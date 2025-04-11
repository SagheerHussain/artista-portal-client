// src/redux/slices/analyticsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getRevenue,
  getTotalRecievedAmount,
  getPendingAmount,
  getClients,
  getRecievedAmountByEmployee,
  getPendingAmountByEmployee,
  getClientsByEmployee,
  getTaxSummary
} from "../../services/analyticsService";
import { getProfit } from "../../services/profit";

export const fetchAnalytics = createAsyncThunk(
  "analytics/fetchAnalytics",
  async ({ user, token }) => {
    const revenue = await getRevenue(token);
    const recievedAmount = user?.role === "admin"
      ? await getTotalRecievedAmount(token)
      : await getRecievedAmountByEmployee(user._id, token);
    const pending = user?.role === "admin"
      ? await getPendingAmount(token)
      : await getPendingAmountByEmployee(user._id, token);
    const clients = user?.role === "admin"
      ? await getClients(token)
      : await getClientsByEmployee(user._id, token);
    const tax = await getTaxSummary(token);
    const netProfit = await getProfit(token);

    console.log("Tax", tax)

    return {
      totalRevenue: revenue.totalAmount,
      totalRecievedAmount: recievedAmount.totalReceivedAmount,
      pendingAmount: pending.totalAmount,
      clients: clients.totalClients,
      tax: tax,
      netProfit
    };
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    totalRevenue: 0,
    totalRecievedAmount: 0,
    pendingAmount: 0,
    clients: 0,
    tax: 0,
    netProfit: 0,
    status: "idle", // loading, succeeded, failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.status = "succeeded";
        Object.assign(state, action.payload);
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default analyticsSlice.reducer;
