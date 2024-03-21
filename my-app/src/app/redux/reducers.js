import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import productNamesReducer from "./products/productNames";
import productsReducer from "./products/products";
import cartReducer from "./cart/cart";
import ordersReducer from "./orders/orders";
// import other reducers here

const rootReducer = combineReducers({
  auth: authReducer,
  productNames: productNamesReducer,
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  // add other reducers here
});

export default rootReducer;
