import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isOpen: false,
    modalName: null,
    modalProps: {},
  },
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.modalName = action.payload.name;
      state.modalProps = action.payload.props || {};
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    updateModalProps: (state, action) => {
      state.modalProps = { ...state.modalProps, ...action.payload };
    },
  },
});

export const { openModal, closeModal, updateModalProps } = modalSlice.actions;