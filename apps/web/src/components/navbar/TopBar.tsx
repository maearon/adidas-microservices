import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import TopBarDropdown from "../top-bar-dropdown"
import { useTranslations } from "@/hooks/useTranslations"
import { cn } from "@/lib/utils"

const TopBar = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [showTopBarDropdown, setShowTopBarDropdown] = useState(false)
  const t = useTranslations("topbar")

  useEffect(() => {
    if (showTopBarDropdown) return

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [showTopBarDropdown])

  const messages = [
    t?.freeStandardShipping || "FREE STANDARD SHIPPING WITH ADICLUB",
    t?.fastFreeDelivery || "FREE SHIPPING ON FIFA WORLD CUP 26™",
    t?.extraDiscount || "SAVE $30 ON ORDERS $100+",
  ]

  return (
    <div className="relative">
      <button
        type="button"
        className="flex w-full items-center justify-center gap-1 bg-black px-4 py-3 text-center text-base font-bold text-white"
        onClick={() => setShowTopBarDropdown((prev) => !prev)}
        aria-expanded={showTopBarDropdown}
      >
        <span>{messages[currentMessageIndex]}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            showTopBarDropdown && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <TopBarDropdown
        isOpen={showTopBarDropdown}
        onClose={() => setShowTopBarDropdown(false)}
      />
    </div>
  )
}

export default TopBar
