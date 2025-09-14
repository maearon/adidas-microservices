import { useCallback } from "react"
import { setTokens, clearTokens } from "@/lib/token"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { fetchUser } from "@/store/sessionSlice"
import type { AppDispatch } from "@/store/store"
import javaService from "@/api/services/javaService"

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const loginWithGoogle = useCallback(async (idToken: string) => {
    try {
      const res = await javaService.oauth({ id_token: idToken, provider: "google" })
      if (res.tokens?.access?.token && res.tokens?.refresh?.token) {
        setTokens(res.tokens.access.token, res.tokens.refresh.token, true)
        await dispatch(fetchUser())
        router.push("/")
      }
    } catch (error) {
      console.error("OAuth login failed", error)
      alert("Google login failed")
    }
  }, [dispatch, router])

  const logout = () => {
    clearTokens()
    router.push("/sign-in")
  }

  return { loginWithGoogle, logout }
}
