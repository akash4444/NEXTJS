import { createSlice } from "@reduxjs/toolkit";
const initialState = [];

export const productsSlice = createSlice({
  name: "products",
  initialState: initialState,
  reducers: {
    updateProducts: (state, { payload }) => {
      return payload;
    },
    resetProducts: (state) => {
      return initialState;
    },
  },
});

export const { updateProducts, resetProducts } = productsSlice.actions;

export default productsSlice.reducer;
