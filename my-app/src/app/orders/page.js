"use client";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import ImageSection from "./ImageSection";
import { getOrders, updateOrder } from "../commonFunctions/commonFunctions";
import { LoadingSpinner } from "../CommonComponents";
import PDFGenerator from "../Invoice/Invoice";

const MyOrdersPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoggedIn, userId, role, userName } = useSelector(
    (state) => state.auth || {}
  );
  const { orders = [] } = useSelector((state) => state.orders || {});

  const [orderCancelling, setOrderCancelling] = useState("");
  const [orderDownloading, setOrderDownloading] = useState("");
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [isOpen, setIsOpen] = useState([]);

  const toggleAccordion = (orderId) => {
    const fIndex = isOpen.findIndex((oId) => oId === orderId);
    if (fIndex > -1) {
      let filteredNumbers = isOpen.filter((value) => value !== orderId);
      setIsOpen([...filteredNumbers]);
    } else {
      setIsOpen([...isOpen, orderId]);
    }
  };

  const isAdmin = role === "admin";

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    await getOrders(dispatch, { userId });
    setLoadingOrders(false);
  };

  const cancelOrder = async (order) => {
    const payload = { orderId: order._id, userId, type: "cancelled" };
    setOrderCancelling(order._id);
    const response = await updateOrder(dispatch, payload);
    response.showAlert && alert(response.message);
    setOrderCancelling("");
  };

  const productSubtotals = (order) => {
    return order.map((item) => item.price * item.quantity);
  };

  // Calculate total bill
  const totalBill = (order) => {
    return productSubtotals(order).reduce((acc, subtotal) => acc + subtotal, 0);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-4">My Orders</h1>
      {loadingOrders ? (
        <LoadingSpinner size="lg" loadingMsg="Please wait. Loading orders..." />
      ) : orders.length === 0 ? (
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
      ) : (
        orders.map((order) => (
          <div key={order._id}>
            <div className="border rounded-md p-4 mb-4 md:w-100 lg:w-3/4 mx-auto bg-white">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleAccordion(order._id)}
              >
                <div className="flex flex-wrap gap-x-10 justify-center items-center">
                  <h3 className="text-lg font-semibold">#{order._id}</h3>
                  <span className="text-gray-600">
                    {moment(order.createdAt).format("DD-MM-YYYY")}
                  </span>
                  <span
                    className={`text-lg font-semibold ${
                      order.status === "delivered"
                        ? "text-green-500"
                        : order.status === "ordered"
                        ? "text-blue-500"
                        : "text-red-500"
                    }`}
                  >
                    {order.status === "ordered"
                      ? "Shipped"
                      : order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                  </span>
                </div>
                {isOpen.includes(order._id) ? (
                  <svg
                    className="w-6 h-6 transition-transform duration-300 transform rotate-180 text-primary text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 transition-transform duration-300 transform text-primary text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </div>
              {isOpen.includes(order._id) && (
                <div className="mt-4">
                  {order.items.map((product) => (
                    <div
                      key={product._id}
                      className="flex flex-col md:flex-row justify-between items-center border-b py-2"
                    >
                      <div className="flex items-center mb-2 md:mb-0">
                        <ImageSection
                          image={product.image}
                          productName={product.productName}
                        />
                        <span className="ml-2">{product.productName}</span>
                      </div>
                      <span className="mb-2 md:mb-0">${product.price}</span>
                      <span className="mb-2 md:mb-0">
                        Quantity: {product.quantity}
                      </span>
                      <span className="mb-2 md:mb-0 text-lg font-semibold">
                        ${(product.quantity * product.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center mt-4 py-2 px-4 bg-gray-200">
                    <span className="font-semibold">Total Price:</span>
                    <span className="font-semibold">
                      ${totalBill(order.items).toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <PDFGenerator
                      order={order}
                      userId={userId}
                      orderDownloading={orderDownloading}
                      userName={userName}
                      setOrderDownloading={setOrderDownloading}
                    />
                    {orderCancelling === order._id ? (
                      <LoadingSpinner
                        loadingMsg="Please wait. Cancelling your order..."
                        size="sm"
                      />
                    ) : (
                      order.status === "ordered" && (
                        <button
                          onClick={() => cancelOrder(order)}
                          className="bg-red-500 text-white px-4 py-2 rounded-md"
                        >
                          Cancel Order
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrdersPage;
