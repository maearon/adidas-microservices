"use client"

import { useState, useEffect } from "react"
import { useAppSelector } from "@/store/hooks"

export function useFeedbackModal() {
  const [isOpen, setIsOpen] = useState(false)
  const userData = useAppSelector((state) => state.session)
  const isLoggedIn = userData.loggedIn

  useEffect(() => {
    // Only show feedback modal for non-logged users
    if (!isLoggedIn) {
      if (typeof window !== "undefined") {
      const hasSeenFeedback = localStorage.getItem("feedback-modal-seen")
      const lastShown = localStorage.getItem("feedback-modal-last-shown")
      }
      const now = Date.now()
      const oneDay = 24 * 60 * 60 * 1000 // 24 hours

      // Show feedback modal if:
      // 1. User hasn't seen it before, OR
      // 2. It's been more than 24 hours since last shown
      if (!hasSeenFeedback || (lastShown && now - Number.parseInt(lastShown) > oneDay)) {
        const timer = setTimeout(() => {
          setIsOpen(true)
        }, 30000) // Show after 30 seconds

        return () => clearTimeout(timer)
      }
    }
  }, [isLoggedIn])

  const closeModal = () => {
    setIsOpen(false)
    if (typeof window !== "undefined") {
    localStorage.setItem("feedback-modal-seen", "true")
    localStorage.setItem("feedback-modal-last-shown", Date.now().toString())
    }
  }

  return {
    isOpen: isOpen && !isLoggedIn, // Only show for non-logged users
    closeModal,
  }
}
