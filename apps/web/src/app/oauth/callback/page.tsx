"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
// import { useAuth } from "@/hooks/useAuth"
import { AppDispatch } from "@/store/store"
import { useDispatch } from "react-redux"
import { fetchUser } from "@/store/sessionSlice"

export default function OAuthCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  // const { setUser } = useAuth()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const code = searchParams.get("code")
    if (code) {
      axios
        .post("http://localhost:8080/api/oauth/callback", { code })
        .then((res) => {
          if (typeof window !== "undefined") {
          localStorage.setItem("token", res.data.tokens.access.token)
          localStorage.setItem("refresh_token", res.data.tokens.refresh.token)
          }
          // setUser(user)
          dispatch(fetchUser())
          router.push("/")
        })
        .catch((err) => {
          console.error("OAuth callback error", err)
          router.push("/account-login")
        })
    }
  }, [searchParams])

  return <p className="text-center mt-12">Đang xác thực Google OAuth...</p>
}
