"use client";
import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import ImageSection from "./ImageSection";
import { getOrders, updateOrder } from "../commonFunctions/commonFunctions";
import { LoadingSpinner, AlertModal } from "../CommonComponents";
import servicePath from "@/config";
import axios from "axios";

const OrderPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoggedIn, userId, role } = useSelector((state) => state.auth || {});
  const { orders = [] } = useSelector((state) => state.orders || {});

  const [orderCancelling, setOrderCancelling] = useState("");
  const [orderDownloading, setOrderDownloading] = useState("");

  const isAdmin = role === "admin";

  useEffect(() => {
    if (userId) {
      getOrders(dispatch, { userId });
    }
  }, [userId]);

  const cancelOrder = async (order) => {
    const payload = { orderId: order._id, userId, type: "cancelled" };
    setOrderCancelling(order._id);
    const response = await updateOrder(dispatch, payload);
    response.showAlert && alert(response.message);
    setOrderCancelling("");
  };

  const handleDownloadInvoice = async (order) => {
    const payload = { orderId: order._id, userId };
    setOrderDownloading(order._id);
    try {
      const response = await axios.post(
        servicePath + `/orders/invoice`,
        payload,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `invoice-${order._id}-${moment().format("YYYY-MM-DD_HH-mm-ss")}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setOrderDownloading("");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      setOrderDownloading("");
    }
  };

  const productSubtotals = (order) => {
    return order.map((item) => item.price * item.quantity);
  };

  // Calculate total bill
  const totalBill = (order) => {
    return productSubtotals(order).reduce((acc, subtotal) => acc + subtotal, 0);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.map((order) => (
        <Accordion key={order._id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h2 className="text-lg font-semibold"> Order ID: {order._id}</h2>
          </AccordionSummary>
          <AccordionDetails>
            <div className="w-full">
              <div className="max-w-4xl mx-auto py-8">
                <div className="flex justify-between mb-4">
                  <p className="text-lg font-semibold">
                    Total Bill: ${totalBill(order.items).toFixed(2)}
                  </p>
                  <p className="text-lg font-semibold">
                    Ordered Date:{" "}
                    {moment(order.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                  </p>
                </div>
              </div>
              <ul className="divide-y divide-gray-300">
                {order.items.map((item) => (
                  <li key={item._id} className="py-4 flex">
                    <ImageSection
                      image={item.image}
                      productName={item.productName}
                    />
                    <div>
                      <h2 className="text-lg font-semibold">
                        {item.productName}
                      </h2>
                      <p>Price: ${item.price}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between">
                {orderDownloading === order._id ? (
                  <LoadingSpinner loadingMsg="Please wait. Downloading your order invoice..." />
                ) : order.status === "delivered" ? (
                  <Button
                    onClick={() => handleDownloadInvoice(order)}
                    variant="contained"
                    color="primary"
                  >
                    Download Invoice
                  </Button>
                ) : (
                  <div></div>
                )}
                {orderCancelling === order._id ? (
                  <LoadingSpinner loadingMsg="Please wait. Cancelling your order..." />
                ) : order.status === "ordered" ? (
                  <Button
                    onClick={() => cancelOrder(order)}
                    variant="contained"
                    color="error"
                  >
                    Cancel Order
                  </Button>
                ) : (
                  <p
                    className={
                      order.status === "delivered"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    <strong>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </strong>
                  </p>
                )}
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      ))}

      {orders.length === 0 && (
        <div className="max-w-4xl mx-auto py-8 text-center">
          <p className="text-lg font-semibold mb-4">No orders available</p>
          <p className="text-gray-600 mb-8">Start shopping to place orders!</p>
          <button
            onClick={() => router.push("/products")}
            className="px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Go to Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
