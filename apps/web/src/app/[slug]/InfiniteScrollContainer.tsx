"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface InfiniteScrollContainerProps {
  children: React.ReactNode
  onBottomReached: () => void
  className?: string
  threshold?: number
}

export default function InfiniteScrollContainer({
  children,
  onBottomReached,
  className,
  threshold = 100,
}: InfiniteScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold

      if (isNearBottom) {
        onBottomReached()
      }
    }

    // Use window scroll instead of container scroll for better performance
    const handleWindowScroll = () => {
      const { scrollY, innerHeight } = window
      const { scrollHeight } = document.documentElement
      const isNearBottom = scrollY + innerHeight >= scrollHeight - threshold

      if (isNearBottom) {
        onBottomReached()
      }
    }

    window.addEventListener("scroll", handleWindowScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleWindowScroll)
    }
  }, [onBottomReached, threshold])

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      {children}
    </div>
  )
}
