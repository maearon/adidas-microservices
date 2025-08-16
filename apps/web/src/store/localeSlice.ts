// apps/web/store/localeSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { SupportedLocale } from "@/lib/constants/localeOptions";
import { getLocaleFromClient } from "@/lib/locale.client";

interface LocaleState {
  locale: SupportedLocale;
}

const DEFAULT_LOCALE: SupportedLocale = "en_US";

const initialState: LocaleState = {
  locale: (getLocaleFromClient() as SupportedLocale) || DEFAULT_LOCALE,
};

const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<SupportedLocale>) => {
      state.locale = action.payload;
    },
  },
});

export const { setLocale } = localeSlice.actions;

export const selectLocale = (state: RootState) => state.locale.locale;

export default localeSlice.reducer;
