import axios from "axios";
import servicePath from "@/config";
import { updateCart } from "../redux/cart/cart";
import { updateOrders } from "../redux/orders/orders";
import { updateAdminOrders } from "../redux/adminOrders/adminOrders";

export const getCartItems = async (dispatch, payload) => {
  try {
    const response = (
      await axios.post(servicePath + "/cartItems", { userId: payload.userId })
    )?.data;

    if (response?.status === 200) {
      dispatch(updateCart(response?.cartItems || {}));
    }
  } catch (e) {}
};

export const updateCartItems = async (dispatch, payload) => {
  try {
    const { type, userId, productId } = payload;
    const response = (
      await axios.post(servicePath + "/updateCartItems", {
        type,
        userId,
        productId,
      })
    )?.data;

    if (response?.status === 200) {
      await getCartItems(dispatch, { userId: userId });
    }
  } catch (e) {}
};

export const clearCartItems = async (dispatch, payload) => {
  try {
    const { userId } = payload;
    const response = (
      await axios.post(servicePath + "/clearCart", {
        userId,
      })
    )?.data;

    if (response?.status === 200) {
      await getCartItems(dispatch, { userId: userId });
    }
  } catch (e) {}
};

export const updateOrder = async (dispatch, payload) => {
  try {
    const { type, userId, items, orderId = "" } = payload;
    const response = (
      await axios.post(servicePath + "/updateOrder", {
        type,
        userId,
        items,
        orderId,
      })
    )?.data;

    if (response?.status === 200 && type === "ordered") {
      await clearCartItems(dispatch, { userId: userId });
      return response;
    } else if (response?.status === 200 && type === "cancelled") {
      await getOrders(dispatch, payload);
      return response;
    }
  } catch (e) {
    const data = e?.response?.data;
    return data;
  }
};

export const getOrders = async (dispatch, payload) => {
  try {
    const response = (
      await axios.post(servicePath + "/orders", { userId: payload.userId })
    )?.data;

    if (response?.status === 200) {
      dispatch(updateOrders(response?.orderItems || {}));
    }
  } catch (e) {}
};

export const getAdminOrders = async (dispatch, payload) => {
  try {
    const response = (await axios.post(servicePath + "/adminOrders", {}))?.data;

    if (response?.status === 200) {
      dispatch(updateAdminOrders(response?.adminOrderItems || []));
    }
  } catch (e) {}
};

export const updateAdminPlacedOrders = async (dispatch, payload) => {
  const { type, userId, orderId = "" } = payload;
  try {
    const response = (
      await axios.post(servicePath + "/adminOrders/updateAdminOrders", {
        type,
        userId,
        orderId,
      })
    )?.data;

    if (response?.status === 200) {
      await getAdminOrders(dispatch);
      return response;
    }
  } catch (e) {}
};
