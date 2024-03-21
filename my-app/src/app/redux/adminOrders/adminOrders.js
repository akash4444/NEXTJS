import { createSlice } from "@reduxjs/toolkit";
const initialState = [];

export const adminOrdersSlice = createSlice({
  name: "adminOrders",
  initialState: initialState,
  reducers: {
    updateAdminOrders: (state, { payload }) => {
      return payload;
    },
    resetAdminOrders: (state) => {
      return initialState;
    },
  },
});

export const { updateAdminOrders, resetAdminOrders } = adminOrdersSlice.actions;

export default adminOrdersSlice.reducer;
