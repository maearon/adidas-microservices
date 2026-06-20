"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { resetBodyScrollLock } from "@/lib/body-scroll-lock"

export function BodyScrollLockReset() {
  const pathname = usePathname()

  useEffect(() => {
    resetBodyScrollLock()
  }, [pathname])

  return null
}
