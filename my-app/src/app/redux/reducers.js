// reducers/index.js

import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
// import other reducers here

const rootReducer = combineReducers({
  auth: authReducer,
  // add other reducers here
});

export default rootReducer;
