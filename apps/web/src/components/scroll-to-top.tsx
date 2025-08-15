"use client"

import { ChevronUp, ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"

export default function ScrollButtons() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      // Show after user scrolls 400 px
      setVisible(window.scrollY > 400)
    }

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setVisible(false)
  }

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
  }

  return (
    <>
      {/* show only button Scroll back to top */}
      <button
        aria-label="Scroll back to top"
        onClick={scrollToTop}
        className={`hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 
          h-12 w-12 items-center justify-center rounded-sm bg-black text-white shadow-lg 
          transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <ChevronUp className="h-5 w-5" />
      </button>

      {/* show both buttons next to each other */}
      <div
        className={`flex fixed bottom-6 left-1/2 -translate-x-1/2 z-50 gap-3
          transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <button
          aria-label="Scroll to top"
          onClick={scrollToTop}
          className="h-12 w-12 flex items-center justify-center rounded-sm bg-black text-white shadow-lg"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
        <button
          aria-label="Scroll to bottom"
          onClick={scrollToBottom}
          className="h-12 w-12 flex items-center justify-center rounded-sm bg-black text-white shadow-lg"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
    </>
  )
}
