import { createSlice } from "@reduxjs/toolkit";
import {
  initializeCartThunk,
  emptyCartThunk,
  addProductToCart,
  deleteProductFromCart,
  substractProductFromCart,
  applyCouponThunk,
  removeCouponThunk,
} from "../thunkActionsCreator/cartThunks";
import { createOptimisticHandlers } from "../utils/optimisticFactory";

const { takeSnapshot, onFulfilled, onRejected } = createOptimisticHandlers({
  keys: ["items", "coupons", "totals", "nonce"],
  onFulfilledPayload: (_state, payload) => {
    if (payload?.nonce) {
      localStorage.setItem("wc_cart_nonce", payload.nonce);
    }
  },
});

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    coupons: [],
    totals: null,
    nonce:
      typeof window !== "undefined"
        ? localStorage.getItem("wc_cart_nonce")
        : null,
    _snapshot: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initializeCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeCartThunk.fulfilled, onFulfilled)
      .addCase(initializeCartThunk.rejected, onRejected)
      .addCase(addProductToCart.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        takeSnapshot(state);
        const { productId, quantity } = action.meta.arg;
        const existing = state.items.find((i) => i.id === productId);
        if (existing) {
          existing.quantity += quantity;
        } else {
          state.items.push({
            id: productId,
            key: `_optimistic_${productId}_${Date.now()}`,
            quantity,
            name: "…",
            images: [],
            prices: null,
            totals: null,
            _optimistic: true,
          });
        }
      })
      .addCase(addProductToCart.fulfilled, onFulfilled)
      .addCase(addProductToCart.rejected, onRejected)
      .addCase(deleteProductFromCart.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        takeSnapshot(state);
        const { itemKey } = action.meta.arg;
        state.items = state.items.filter((i) => i.key !== itemKey);
      })
      .addCase(deleteProductFromCart.fulfilled, onFulfilled)
      .addCase(deleteProductFromCart.rejected, onRejected)
      .addCase(substractProductFromCart.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        takeSnapshot(state);
        const { itemKey, quantity } = action.meta.arg;
        const newQuantity = quantity - 1;
        if (newQuantity <= 0) {
          state.items = state.items.filter((i) => i.key !== itemKey);
        } else {
          const item = state.items.find((i) => i.key === itemKey);
          if (item) item.quantity = newQuantity;
        }
      })
      .addCase(substractProductFromCart.fulfilled, onFulfilled)
      .addCase(substractProductFromCart.rejected, onRejected)
      .addCase(emptyCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        takeSnapshot(state);
        state.items = [];
        state.totals = null;
      })
      .addCase(emptyCartThunk.fulfilled, onFulfilled)
      .addCase(emptyCartThunk.rejected, onRejected)
      .addCase(applyCouponThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCouponThunk.fulfilled, onFulfilled)
      .addCase(applyCouponThunk.rejected, onRejected)
      .addCase(removeCouponThunk.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        takeSnapshot(state);
        const { code } = action.meta.arg;
        state.coupons = state.coupons.filter((c) => c !== code);
      })
      .addCase(removeCouponThunk.fulfilled, onFulfilled)
      .addCase(removeCouponThunk.rejected, onRejected);
  },
});

export const cartActions = cartSlice.actions;