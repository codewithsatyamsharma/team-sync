import { createSlice } from "@reduxjs/toolkit";
import {
  currentLoggedEmployee,
  loginEmployee,
  registerEmployee,
} from "./authAction";

let authSlice = createSlice({
  name: "auth",
  initialState: {
    employee: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    addEmployee: (state, action) => {
      state.employee = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    removeEmployee: (state) => {
      state.employee = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginEmployee.fulfilled, (state, action) => {
        state.employee = action.payload;
        state.isLoading = false;
      })
      .addCase(loginEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Sign in failed. Check your credentials and try again.";
      })
      .addCase(registerEmployee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerEmployee.fulfilled, (state, action) => {
        state.employee = action.payload;
        state.isLoading = false;
      })
      .addCase(registerEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Account creation failed. Check your details and try again.";
      })
      .addCase(currentLoggedEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(currentLoggedEmployee.fulfilled, (state, action) => {
        state.employee = action.payload;
        state.isLoading = false;
      })
      .addCase(currentLoggedEmployee.rejected, (state) => {
        state.employee = null;
        state.isLoading = false;
      });
  },
});

export let { addEmployee, removeEmployee } = authSlice.actions;
export default authSlice.reducer;
