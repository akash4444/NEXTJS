import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import productNamesReducer from "./products/productNames";
import productsReducer from "./products/products";
// import other reducers here

const rootReducer = combineReducers({
  auth: authReducer,
  productNames: productNamesReducer,
  products: productsReducer,
  // add other reducers here
});

export default rootReducer;
