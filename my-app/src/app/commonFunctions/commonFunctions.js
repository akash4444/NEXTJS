import axios from "axios";
import servicePath from "@/config";
import { updateCart } from "../redux/cart/cart";

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
