import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../../config/axiosInstance";

export let loginEmployee = createAsyncThunk(
  "auth/login",
  async (credentials, thunkApi) => {
    try {
      let res = await axiosInstance.post("/auth/login", credentials);
      return res.data.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data?.message || "Unable to sign in. Please try again.");
    }
  }
);

export let registerEmployee = createAsyncThunk(
  "auth/register",
  async (credentials, thunkApi) => {
    try {
      let res = await axiosInstance.post("/auth/register", credentials);
      return res.data.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data?.message || "Unable to create account. Please try again.");
    }
  }
);

export let currentLoggedEmployee = createAsyncThunk(
  "auth/me",
  async (_, thunkApi) => {
    try {
      let res = await axiosInstance.get("/auth/me");
      return res.data.user;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data?.message || "Your session has expired. Please sign in again.");
    }
  }
);
