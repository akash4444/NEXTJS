import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import productNamesReducer from "./products/productNames";
import productsReducer from "./products/products";
import cartReducer from "./cart/cart";
// import other reducers here

const rootReducer = combineReducers({
  auth: authReducer,
  productNames: productNamesReducer,
  products: productsReducer,
  cart: cartReducer,
  // add other reducers here
});

export default rootReducer;
