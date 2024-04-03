"use client";
import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import moment from "moment";
import { Modal, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LoadingSpinner, AlertModal } from "../CommonComponents";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const PDFGenerator = ({
  order = {},
  userId = "",
  userName = "",
  orderDownloading = "",
  setOrderDownloading = () => {},
}) => {
  const htmlRef = useRef(null);
  const [openInvoice, setOpenInvoice] = useState(false);

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
      createdAt: order.createdAt,
      totalAmount: totalBill(order.items),
      deliveryAddress: order.deliveryAddress,
    };
  }

  const handleDownloadInvoice = async () => {
    // try {
    //   setOrderDownloading(order._id);
    //   const pdfdata = document.getElementById("pdf-creation");
    //   html2canvas(pdfdata, { scrollY: -window.scrollY }).then(function (
    //     canvas
    //   ) {
    //     var imgData = canvas.toDataURL("image/png");
    //     var imgWidth = 210;
    //     var pageHeight = 295;
    //     var imgHeight = (canvas.height * imgWidth) / canvas.width;
    //     var heightLeft = imgHeight;
    //     var doc = new jsPDF("p", "mm");
    //     var position = 10; // give some top padding to first page
    //     doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    //     heightLeft -= pageHeight;
    //     while (heightLeft >= 0) {
    //       position = heightLeft - imgHeight + 10; // top padding for other pages
    //       doc.addPage();
    //       doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    //       heightLeft -= pageHeight;
    //     }
    //     doc.save(
    //       `invoice-${order._id}-${moment().format("YYYY-MM-DD_HH-mm-ss")}.pdf`
    //     );
    //   });
    //   setOrderDownloading("");
    //   setOpenInvoice(false);
    // } catch (error) {
    //   console.error("Error generating PDF:", error);
    //   setOrderDownloading("");
    //   setOpenInvoice(false);
    // }
  };

  const generatePDF = (invoiceDetails, productDetails) => {
    const documentDefinition = {
      content: [
        { text: "Invoice Details", style: "header" },
        { text: "Invoice Number: " + invoiceDetails.invoiceNumber },
        { text: "Date: " + invoiceDetails.date },
        { text: "Customer: " + invoiceDetails.customer },
        { text: "\n" },
        { text: "Product Details", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*"],
            body: [
              ["Product", "Quantity", "Price"],
              ...productDetails.map((product) => [
                product.name,
                product.quantity,
                product.price,
              ]),
            ],
          },
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

    pdfMake.createPdf(documentDefinition).download("invoice.pdf");
  };

  const handleGeneratePDF = () => {
    const invoiceDetails = {
      invoiceNumber: "INV-001",
      date: "2024-04-03",
      customer: "John Doe",
    };

    const productDetails = [
      { name: "Product 1", quantity: 2, price: 10 },
      { name: "Product 2", quantity: 1, price: 20 },
      { name: "Product 3", quantity: 3, price: 15 },
    ];
    generatePDF(invoiceDetails, productDetails);
  };

  const formatDate = (dt) => {
    return moment(dt).format("DD-MM-YYYY HH:MM:SS");
  };

  const handleCloseInvoice = () => {
    setOpenInvoice(false);
  };

  return (
    <div>
      {orderDownloading === order?._id ? (
        <LoadingSpinner
          loadingMsg="Please wait. Downloading your order invoice..."
          size="sm"
        />
      ) : order.status === "delivered" ? (
        <button
          onClick={() => handleGeneratePDF(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Invoice
        </button>
      ) : (
        <div></div>
      )}

      <Modal
        open={openInvoice || false}
        onClose={handleCloseInvoice}
        maxWidth="md"
        fullWidth
      >
        <div className="bg-white rounded-md p-4 overflow-y-auto max-h-full">
          <div className="flex justify-between">
            {orderDownloading === order._id ? (
              <LoadingSpinner
                loadingMsg="Please wait. Downloading your order invoice..."
                size="sm"
              />
            ) : order.status === "delivered" ? (
              <button
                onClick={() => handleDownloadInvoice()}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Download
              </button>
            ) : (
              <div></div>
            )}
            <IconButton
              // disabled={submittingAddress}
              color="error"
              onClick={handleCloseInvoice}
              aria-label="delete"
            >
              <CloseIcon />
            </IconButton>
          </div>
          {order.status === "delivered" && (
            <div id="pdf-creation" ref={htmlRef}>
              <div className="bg-white rounded-lg p-8">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-semibold text-gray-800">
                    Invoice
                  </h1>
                </div>
                <div className="mb-8">
                  <p className="text-sm text-gray-700">
                    <strong>Customer:</strong> {invoiceData.customerName}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Order Date:</strong>{" "}
                    {formatDate(invoiceData.createdAt)}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Order #:</strong> {invoiceData.orderId}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Invoice Date:</strong> {formatDate(new Date())}
                  </p>
                </div>
                <div className="border-t border-gray-300"></div>
                <div className="flex py-2 px-1  w-full md:w-full flex-1 md:flex-none">
                  <div className="">
                    <div className="font-semibold">Delivered Address:</div>
                    <h4 className="">{`${invoiceData.deliveryAddress.firstName} ${invoiceData.deliveryAddress.lastName}`}</h4>

                    <p className="">{invoiceData.deliveryAddress.address}</p>

                    <p className="">{invoiceData.deliveryAddress.locality}</p>
                    <p className="">
                      {invoiceData.deliveryAddress.city} -{" "}
                      {invoiceData.deliveryAddress.pinCode}
                    </p>
                    <p className="">{invoiceData.deliveryAddress.state}</p>

                    <p className="">
                      Mobile #:{invoiceData.deliveryAddress.mobileNumber}
                    </p>
                  </div>
                </div>
                <table className="w-full border-collapse mb-8">
                  <thead>
                    <tr>
                      <th className="p-1 border">Product</th>
                      <th className="p-1 border">Quantity</th>
                      <th className="p-1 border">Price</th>
                      <th className="p-1 border">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items.map((item) => (
                      <tr key={item.productId}>
                        <td className="p-1 border">{item.productName}</td>
                        <td className="p-1 border">{item.quantity}</td>
                        <td className="p-1 border">${item.price.toFixed(2)}</td>
                        <td className="p-1 border">
                          ${(item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-800">
                    <strong>Total Amount:</strong> $
                    {invoiceData.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PDFGenerator;
