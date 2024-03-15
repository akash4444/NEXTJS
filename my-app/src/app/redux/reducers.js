import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import productNamesReducer from "./products/productNames";
// import other reducers here

const rootReducer = combineReducers({
  auth: authReducer,
  productNames: productNamesReducer,
  // add other reducers here
});

export default rootReducer;
