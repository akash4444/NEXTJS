"use client";
import React from "react";
import moment from "moment";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const PDFGenerator = ({ order = {}, userName = "" }) => {
  const generatePDF = (invoiceDetails) => {
    const documentDefinition = {
      watermark: {
        text: "Fresh Fare Shop",
        color: "gray",
        opacity: 0.1,
        bold: true,
        italics: false,
        width: 100,
        height: 100,
        absolutePosition: { x: 200, y: 300 }, // Adjust the position of the watermark
      },
      content: [
        { text: "Invoice", style: "header", alignment: "center" },
        {
          text: [
            { text: "Customer Name: ", bold: true },
            { text: invoiceDetails.customerName },
          ],
        },
        {
          text: [
            { text: "Order Date: ", bold: true },
            { text: formatDate(invoiceDetails.orderDate) },
          ],
        },
        {
          text: [
            { text: "Order #: ", bold: true },
            { text: invoiceDetails.orderId },
          ],
        },
        {
          text: [
            { text: "Invoice Date: ", bold: true },
            { text: formatDate(new Date()) },
          ],
        },
        { text: "\n" },
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 5,
              x2: 515,
              y2: 5,
              lineWidth: 1,
              lineColor: "#CCCCCC", // Gray color
            },
          ],
        },
        { text: "\n" },
        { text: "Delivery Address: ", bold: true },
        {
          text: `${invoiceDetails.deliveryAddress.firstName} ${invoiceDetails.deliveryAddress.lastName}`,
        },
        { text: invoiceDetails.deliveryAddress.address },
        { text: invoiceDetails.deliveryAddress.locality },
        {
          text: `${invoiceDetails.deliveryAddress.city} - ${invoiceDetails.deliveryAddress.pinCode}`,
        },
        { text: invoiceDetails.deliveryAddress.state },
        { text: `Mobile #:${invoiceDetails.deliveryAddress.mobileNumber}` },
        { text: "\n" },

        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*"],
            body: [
              [
                { text: "Product", style: "tableHeader", bold: true },
                { text: "Quantity", style: "tableHeader", bold: true },
                { text: "Price", style: "tableHeader", bold: true },
                { text: "Total", style: "tableHeader", bold: true },
              ],
              ...(invoiceDetails.items || []).map((product) => [
                product.productName,
                product.quantity,
                `$${product.price.toFixed(2)}`,
                `$${(product.price * product.quantity).toFixed(2)}`,
              ]),
            ],
          },
        },
        { text: "\n" },
        {
          text: [
            { text: "Total Amount: ", bold: true },
            { text: `$${invoiceDetails.totalAmount.toFixed(2)}` },
          ],
          alignment: "right", // Aligning to the right
          margin: [0, 10, 0, 0], // Adding margin to adjust spacing
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
      },
    };

    pdfMake
      .createPdf(documentDefinition)
      .download(
        `invoice-${order._id}-${moment().format("YYYY-MM-DD_HH-mm-ss")}.pdf`
      );
  };

  const handleGeneratePDF = () => {
    let invoiceData = {};
    if (order?.status === "delivered") {
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
      invoiceData = {
        customerName: userName,
        items: order.items,
        orderId: order._id,
        orderDate: order.createdAt,
        totalAmount: totalBill(order.items),
        deliveryAddress: order.deliveryAddress,
      };
    }

    generatePDF(invoiceData);
  };

  const formatDate = (dt) => {
    return moment(dt).format("DD-MM-YYYY HH:MM:SS");
  };

  return (
    <div>
      {order.status === "delivered" ? (
        <button
          onClick={() => handleGeneratePDF(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Download Invoice
        </button>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default PDFGenerator;
