"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RedirectListener() {
  const router = useRouter()

  useEffect(() => {
    const handler = () => {
      router.push("/") // Keep user on home page even if not logged in
    }

    window.addEventListener("customRedirectToLogin", handler)
    return () => {
      window.removeEventListener("customRedirectToLogin", handler)
    }
  }, [router])

  return null
}
