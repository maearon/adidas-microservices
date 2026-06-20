"use client"

import { useEffect } from "react"
import { lockBodyScroll, unlockBodyScroll } from "@/lib/body-scroll-lock"

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    lockBodyScroll()
    return () => unlockBodyScroll()
  }, [locked])
}
