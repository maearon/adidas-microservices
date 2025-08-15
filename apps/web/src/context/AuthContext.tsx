"use client"

import { createContext, useContext } from "react"
import { useAuth } from "@/hooks/useAuth"

export const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
