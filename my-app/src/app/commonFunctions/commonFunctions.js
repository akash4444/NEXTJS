import axios from "axios";
import servicePath from "@/config";
import { updateCart, resetCart } from "../redux/cart/cart";
import { updateOrders, resetOrders } from "../redux/orders/orders";
import {
  updateAdminOrders,
  resetAdminOrders,
} from "../redux/adminOrders/adminOrders";
import { updateAddress, resetAddress } from "../redux/address/address";
import { resetAuth } from "../redux/auth/authSlice";
import { resetProductNames } from "../redux/products/productNames";
import { resetProducts } from "../redux/products/products";
import axiosInstance from "./axiosCommon";

export const clearStoreForLoggedOut = async (dispatch, payload) => {
  dispatch(resetAuth());
  dispatch(resetProductNames());
  dispatch(resetProducts());
  dispatch(resetCart());
  dispatch(resetOrders());
  dispatch(resetAdminOrders());
  dispatch(resetAddress());
};

export const loggedOut = async (dispatch, payload) => {
  try {
    const response = (await axiosInstance.get(servicePath + "/api/auth/logout"))
      ?.data;

    if (response?.status === 200) {
      clearStoreForLoggedOut(dispatch);
    }
  } catch (e) {}
};

export const getCartItems = async (dispatch, payload) => {
  try {
    const response = (
      await axiosInstance.post(servicePath + "/api/cartItems", {
        userId: payload.userId,
      })
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
      await axiosInstance.post(servicePath + "/api/updateCartItems", {
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
      await axiosInstance.post(servicePath + "/api/clearCart", {
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
    const { type, userId, items, orderId = "", deliveryAddress } = payload;
    const response = (
      await axiosInstance.post(servicePath + "/api/updateOrder", {
        type,
        userId,
        items,
        orderId,
        deliveryAddress,
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
      await axiosInstance.post(servicePath + "/api/orders", {
        userId: payload.userId,
      })
    )?.data;

    if (response?.status === 200) {
      dispatch(updateOrders(response?.orderItems || {}));
    }
  } catch (e) {}
};

export const getAdminOrders = async (dispatch, payload) => {
  try {
    const response = (
      await axiosInstance.post(servicePath + "/api/adminOrders", {})
    )?.data;

    if (response?.status === 200) {
      dispatch(updateAdminOrders(response?.adminOrderItems || []));
    }
  } catch (e) {}
};

export const updateAdminPlacedOrders = async (dispatch, payload) => {
  const { type, userId, orderId = "" } = payload;
  try {
    const response = (
      await axiosInstance.post(
        servicePath + "/api/adminOrders/updateAdminOrders",
        {
          type,
          userId,
          orderId,
        }
      )
    )?.data;

    if (response?.status === 200) {
      await getAdminOrders(dispatch);
      return response;
    }
  } catch (e) {}
};

export const getAddress = async (dispatch, payload) => {
  const { userId } = payload;
  try {
    const response = (
      await axiosInstance.post(servicePath + "/api/address", { userId })
    )?.data;

    if (response?.status === 200) {
      dispatch(updateAddress(response?.address || []));
    }
  } catch (e) {}
};

export const addAddress = async (dispatch, payload) => {
  const { userId } = payload;
  try {
    const response = (
      await axiosInstance.post(servicePath + "/api/address/addAddress", {
        ...payload,
      })
    )?.data;

    if (response?.status === 200) {
      await getAddress(dispatch, { userId });
      return response;
    }
  } catch (e) {}
};

export const editAddress = async (dispatch, payload) => {
  const { userId } = payload;
  try {
    const response = (
      await axiosInstance.post(servicePath + "/api/address/editAddress", {
        ...payload,
      })
    )?.data;

    if (response?.status === 200) {
      await getAddress(dispatch, { userId });
      return response;
    }
  } catch (e) {}
};

export const deleteAddress = async (dispatch, payload) => {
  const { userId } = payload;
  try {
    const response = (
      await axiosInstance.post(servicePath + "/api/address/deleteAddress", {
        ...payload,
      })
    )?.data;

    if (response?.status === 200) {
      await getAddress(dispatch, { userId });
      return response;
    }
  } catch (e) {}
};
