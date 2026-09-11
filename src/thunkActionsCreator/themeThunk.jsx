import { createAsyncThunk } from "@reduxjs/toolkit";
import { setSite } from "../slices/siteSlice";

export const fetchThemeThunk = createAsyncThunk(
  "theme/fetchTheme",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}wp-json/custom/v1/theme-settings`,
      );

      if (!response.ok) {
        throw new Error(" il est Impossible de récupérer le thème.");
      }

      const themeData = await response.json();
      const palette = themeData.color.palette.custom ?? [];

      thunkAPI.dispatch(setSite({ palette }));

      return palette;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);
