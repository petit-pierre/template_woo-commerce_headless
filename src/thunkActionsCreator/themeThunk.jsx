import { createAsyncThunk } from "@reduxjs/toolkit";
import { setTheme } from "../slices/themeSlice";

export const fetchThemeThunk = createAsyncThunk(
  "theme/fetchTheme",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wp-content/themes/twentytwentyfive/theme.json`,
      );

      if (!response.ok) {
        throw new Error(" il est Impossible de récupérer le thème.");
      }

      const themeData = await response.json();
      const palette = themeData.settings?.color?.palette ?? [];

      thunkAPI.dispatch(setTheme({ palette }));

      return palette;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
