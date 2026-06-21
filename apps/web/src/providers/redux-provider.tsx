"use client"

import type React from "react"

import { Provider } from "react-redux"
import { store } from "@/store/store"
import CommerceSyncProvider from "@/components/commerce/CommerceSyncProvider"

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CommerceSyncProvider>{children}</CommerceSyncProvider>
    </Provider>
  )
}
