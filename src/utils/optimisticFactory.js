import { current } from "@reduxjs/toolkit";

export const createOptimisticHandlers = ({ keys = [], onFulfilledPayload } = {}) => {
  const takeSnapshot = (state) => {
    state._snapshot = {};
    const currentState = current(state);
    keys.forEach((key) => {
      if (currentState[key] !== undefined) {
        state._snapshot[key] = currentState[key];
      }
    });
  };

  const onFulfilled = (state, action) => {
    state.loading = false;
    state._snapshot = null;

    keys.forEach((key) => {
      if (action.payload?.[key] !== undefined) {
        state[key] = action.payload[key];
      }
    });

    if (onFulfilledPayload) {
      onFulfilledPayload(state, action.payload, action);
    }
  };

  const onRejected = (state, action) => {
    state.loading = false;
    state.error = action.payload || action.error?.message;

    if (state._snapshot) {
      keys.forEach((key) => {
        if (state._snapshot[key] !== undefined) {
          state[key] = state._snapshot[key];
        }
      });
      state._snapshot = null;
    }
  };

  return { takeSnapshot, onFulfilled, onRejected };
};