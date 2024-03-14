import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isLoggedIn: false,
  userId: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    updateAuth: (state, { payload }) => {
      return {
        ...state,
        ...payload,
      };
    },
    resetAuth: (state) => {
      return initialState;
    },
  },
});

export const { updateAuth, resetAuth } = authSlice.actions;

export default authSlice.reducer;
