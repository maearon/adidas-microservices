"use client"

import { normalizeLocale } from "@/lib/utils"
import { Nullable } from "@/types/common"
import { useState, useEffect } from "react"

export function useLocationModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const savedLocation: Nullable<string> = localStorage.getItem("NEXT_LOCALE")

    // Nếu chưa chọn địa điểm thì sau 1 giây hiện modal
    if (!savedLocation) {
      // const timer = setTimeout(() => {
      //   setIsOpen(true)
      // }, 1000)

      // return () => clearTimeout(timer)
      // ✅ Nếu chưa có thì tự động detect từ browser
      const detected = normalizeLocale(navigator.language)
      localStorage.setItem("NEXT_LOCALE", detected)
    }
  }, [])

  const closeModal = () => {
    setIsOpen(false)

    if (typeof window !== "undefined") {
      localStorage.setItem("location-modal-seen", "true")
    }
  }

  const selectLocation = (location: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("NEXT_LOCALE", location)
      localStorage.setItem("location-modal-seen", "true")
    }
    setIsOpen(false)
  }

  return {
    isOpen,
    closeModal,
    selectLocation,
  }
}
