import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import TopBarDropdown from "../top-bar-dropdown"
import { useTranslations } from "@/hooks/useTranslations"

const TopBar = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [showTopBarDropdown, setShowTopBarDropdown] = useState(false)
  const t = useTranslations("topbar")

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const messages = [
    t?.freeStandardShipping || "FREE STANDARD SHIPPING WITH ADICLUB",
    t?.fastFreeDelivery || "FAST, FREE DELIVERY WITH PRIME",
    t?.extraDiscount || "GET AN EXTRA 25% OFF"
  ]
  
  return (
    <>
    <div className="bg-black text-white text-xs py-3 text-center font-semibold">
      <span>
        {messages[currentMessageIndex]}
        <button className="ml-1 inline-flex items-center" onClick={() => setShowTopBarDropdown(!showTopBarDropdown)}>
          <ChevronDown className="w-3 h-3" />
        </button>
      </span>
    </div>

    <TopBarDropdown isOpen={showTopBarDropdown} onClose={() => setShowTopBarDropdown(false)} />
    </>
  )
}

export default TopBar
