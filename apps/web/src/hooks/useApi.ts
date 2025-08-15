"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { setTokens } from "@/lib/token"
import { fetchUser } from "@/store/sessionSlice"
import type { AppDispatch } from "@/store/store"
import javaService from "@/api/services/javaService"

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const loginWithGoogle = useCallback(async (idToken: string) => {
    try {
      const res = await javaService.oauth({
        id_token: idToken,
        provider: "google",
      })

      if (res?.tokens?.access?.token) {
        setTokens(res.tokens.access.token, res.tokens.refresh.token, true)
        await dispatch(fetchUser())
        router.push("/")
      }
    } catch (err) {
      console.error("OAuth login error:", err)
    }
  }, [dispatch, router])

  return { loginWithGoogle }
}

export default useAuth
