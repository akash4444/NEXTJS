import { createSlice } from "@reduxjs/toolkit";
const initialState = [];

export const addressSlice = createSlice({
  name: "address",
  initialState: initialState,
  reducers: {
    updateAddress: (state, { payload }) => {
      return payload;
    },
    resetAddress: (state) => {
      return initialState;
    },
  },
});

export const { updateAddress, resetAddress } = addressSlice.actions;

export default addressSlice.reducer;
