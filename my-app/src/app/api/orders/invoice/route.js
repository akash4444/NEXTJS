import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { OrdersModel } from "@/lib/Model/orders";
import { DBConnect } from "../../dbconnect";
import { verifyTokenMiddleware } from "../../ApiCommonUtil/index";

// Establish database connection
DBConnect();

// Define the POST request handler
const apiHandler = async (request) => {
  const payload = await request.json();

  try {
    // Fetch order items from the database based on userId
    const orderItems = await OrdersModel.find({ userId: payload.userId });

    // Extract order details based on orderId from the fetched order items
    const order = orderItems[0].orders.find(
      (ord) => ord._id.toString() === payload.orderId
    );

    // Function to calculate subtotal for each product in the order
    const productSubtotals = (order) => {
      return order.map((item) => item.price * item.quantity);
    };

    // Function to calculate total bill
    const totalBill = (order) => {
      return productSubtotals(order).reduce(
        (acc, subtotal) => acc + subtotal,
        0
      );
    };

    // Construct order details object
    const orderDetails = {
      customerName: payload.userId,
      items: order.items,
      orderId: payload.orderId,
      createdAt: order.createdAt,
      totalAmount: totalBill(order.items),
    };

    // Render PDF document
    const html = generateHTML(orderDetails);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf();
    await browser.close();

    const response = new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=invoice.pdf",
      },
    });

    return response;
  } catch (e) {
    return NextResponse.json(
      { message: "Something went wrong.", status: 500 },
      { status: 500 }
    );
  }
};
// Export the handler function for POST method
export async function POST(request, res) {
  // Apply verifyTokenMiddleware to the productsHandler
  const verifiedHandler = verifyTokenMiddleware(apiHandler);

  // Call the verified handler with the request
  return verifiedHandler(request, res);
}
function generateHTML(invoiceData) {
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };
  // CSS styles for the invoice
  const styles = `
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        .invoice {
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .invoice-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .invoice-header h1 {
          margin: 0;
          color: #333;
        }
        .invoice-details {
          margin-bottom: 20px;
        }
        .invoice-details p {
          margin: 0;
        }
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .invoice-table th, .invoice-table td {
          padding: 10px;
          border: 1px solid #ddd;
        }
        .invoice-total {
          text-align: right;
        }
      </style>
    `;

  // Invoice HTML template
  const html = `
      <html>
        <head>
          ${styles}
        </head>
        <body>
          <div class="invoice">
            <div class="invoice-header">
              <h1>Invoice</h1>
            </div>
            <div class="invoice-details">
              <p><strong>Customer:</strong> ${invoiceData.customerName}</p>
              <p><strong>Order Date:</strong> ${formatDate(
                invoiceData.createdAt
              )}</p>
                <p><strong>Order #:</strong> ${invoiceData.orderId}</p>
              <p><strong>Invoice Date:</strong> ${formatDate(new Date())}</p>
            </div>
            <table class="invoice-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoiceData.items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.productName}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>$${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
            <div class="invoice-total">
              <p><strong>Total Amount:</strong> $${invoiceData.totalAmount.toFixed(
                2
              )}</p>
            </div>
          </div>
        </body>
      </html>
    `;

  return html;
}
