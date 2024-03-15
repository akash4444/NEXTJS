import { createSlice } from "@reduxjs/toolkit";
const initialState = [];

export const productNamesSlice = createSlice({
  name: "productNames",
  initialState: initialState,
  reducers: {
    updateProductNames: (state, { payload }) => {
      return payload;
    },
    resetProductNames: (state) => {
      return initialState;
    },
  },
});

export const { updateProductNames, resetProductNames } =
  productNamesSlice.actions;

export default productNamesSlice.reducer;
