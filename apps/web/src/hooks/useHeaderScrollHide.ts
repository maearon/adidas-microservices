"use client"

import { useEffect, useRef, useState } from "react"

const SCROLL_DELTA = 12
const TOP_REVEAL_OFFSET = 72

/**
 * Hide site header when scrolling down, reveal when scrolling up (Adidas-style).
 */
export function useHeaderScrollHide(enabled = true) {
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    if (!enabled) {
      setVisible(true)
      return
    }

    lastScrollY.current = window.scrollY

    const update = () => {
      const currentY = window.scrollY
      const delta = currentY - lastScrollY.current

      if (currentY <= TOP_REVEAL_OFFSET) {
        setVisible(true)
      } else if (delta > SCROLL_DELTA) {
        setVisible(false)
      } else if (delta < -SCROLL_DELTA) {
        setVisible(true)
      }

      lastScrollY.current = currentY
      ticking.current = false
    }

    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(update)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [enabled])

  return visible
}
