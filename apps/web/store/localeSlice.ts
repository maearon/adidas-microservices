import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store"

export type SupportedLocale = "en" | "vi" | "united-states" | "vietnam"

interface LocaleState {
  value: SupportedLocale
}

const getInitialLocale = (): SupportedLocale => {
  // 1) Ưu tiên đọc từ cookie (SSR và client dùng chung key NEXT_LOCALE)
  if (typeof document !== "undefined") {
    const cookieMatch = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/)
    if (cookieMatch) return cookieMatch[1] as SupportedLocale
  }

  // 2) Nếu không có thì thử localStorage
  if (typeof localStorage !== "undefined") {
    const stored = localStorage.getItem("NEXT_LOCALE") as SupportedLocale | null
    if (stored) return stored
  }

  // 3) Nếu vẫn chưa có thì fallback vào ngôn ngữ trình duyệt
  if (typeof navigator !== "undefined") {
    if (navigator.language.startsWith("vi")) return "vi"
  }

  // 4) Mặc định là "en"
  return "en"
}

const initialState: LocaleState = {
  value: getInitialLocale(),
}

export const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<SupportedLocale>) => {
      state.value = action.payload

      // Lưu vào localStorage
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("NEXT_LOCALE", action.payload)
      }

      // Lưu vào cookie
      if (typeof document !== "undefined") {
        document.cookie = `NEXT_LOCALE=${action.payload}; path=/; max-age=31536000`
      }
    },
  },
})

export const { setLocale } = localeSlice.actions

// Selector
export const selectLocale = (state: RootState) => state.locale.value

export default localeSlice.reducer
