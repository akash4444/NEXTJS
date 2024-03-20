import { createSlice } from "@reduxjs/toolkit";
const initialState = {};

export const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    updateCart: (state, { payload }) => {
      return payload;
    },
    resetCart: (state) => {
      return initialState;
    },
  },
});

export const { updateCart, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
