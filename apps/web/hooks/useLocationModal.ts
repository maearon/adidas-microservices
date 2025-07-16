"use client"

import { Nullable } from "@/types/common";
import { useState, useEffect } from "react"

export function useLocationModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if user has already selected a location
    let savedLocation: Nullable<string> = null;
    let hasSeenModal: Nullable<string> = null;
    if (typeof window !== "undefined") {
      savedLocation = localStorage.getItem("NEXT_LOCALE");
      hasSeenModal = localStorage.getItem("location-modal-seen");
    }

    if (!savedLocation && !hasSeenModal) {
      // Show modal after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  const closeModal = () => {
    setIsOpen(false)
    {
      if (typeof window !== "undefined") {
    localStorage.setItem("location-modal-seen", "true")
      }
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
