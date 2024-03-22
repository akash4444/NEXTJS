"use client";
import { useState, useEffect } from "react";
import axios from "axios"; // Install axios for making HTTP requests
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  getAdminOrders,
  updateAdminPlacedOrders,
} from "../commonFunctions/commonFunctions";
import { LoadingSpinner, AlertModal } from "../CommonComponents";

export default function AdminOrdersPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoggedIn, userId, role } = useSelector((state) => state.auth || {});
  const adminOrders = useSelector((state) => state.adminOrders || []);

  const [orderUpdating, setOrderUpdating] = useState("");
  const [loadingOrders, setLoadingOrders] = useState(false);

  const isAdmin = role === "admin";

  useEffect(() => {
    if (userId && isAdmin) {
      fetchOrders();
    }
  }, [userId]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    await getAdminOrders(dispatch, {});
    setLoadingOrders(false);
  };
  const handleDeliverOrder = async (order) => {
    try {
      setOrderUpdating(order.orderId);
      const payload = {
        type: "delivered",
        orderId: order.orderId,
        userId: order.userId,
      };
      const response = await updateAdminPlacedOrders(dispatch, payload);
      response.showAlert && alert(response.message);
      setOrderUpdating("");
    } catch (error) {
      setOrderUpdating("");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-4">Admin Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loadingOrders ? (
          <LoadingSpinner size="lg" loadingMsg="Please wait. Loading orders" />
        ) : (
          adminOrders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white shadow-md p-4 rounded-lg mb-4"
            >
              <p>
                <strong>Order ID:</strong> {order.orderId}
              </p>
              <p>
                <strong>User ID:</strong> {order.userId}
              </p>
              {orderUpdating === order.orderId ? (
                <LoadingSpinner loadingMsg="Updating order" />
              ) : order.status === "ordered" ? (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                  onClick={() => handleDeliverOrder(order)}
                >
                  Deliver Order
                </button>
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
          ))
        )}
      </div>
    </div>
  );
}
