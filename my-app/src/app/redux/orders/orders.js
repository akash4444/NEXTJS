import { createSlice } from "@reduxjs/toolkit";
const initialState = {};

export const ordersSlice = createSlice({
  name: "orders",
  initialState: initialState,
  reducers: {
    updateOrders: (state, { payload }) => {
      return payload;
    },
    resetOrders: (state) => {
      return initialState;
    },
  },
});

export const { updateOrders, resetOrders } = ordersSlice.actions;

export default ordersSlice.reducer;
