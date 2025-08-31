"use client"

import { X } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "@/hooks/useTranslations"

interface MobileAppBannerProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileAppBanner({ isOpen, onClose }: MobileAppBannerProps) {
  const t = useTranslations("mobile")

  if (!isOpen) return null

  return (
    <div className="sm:hidden bg-background border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <button onClick={onClose} className="p-1">
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="flex items-center space-x-3 flex-1 mx-4">
          {/* App Icon */}
          <div className="relative w-16 h-16 bg-black rounded-2xl overflow-hidden">
            <Image
              src="/logo-app.png"
              alt="App Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* App Info */}
          <div className="flex-1">
            <div className="font-semibold text-base">{t?.adidasSportsStyle || "ADIDAS - SPORTS & STYLE"}</div>
            <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-white">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ★
                  </span>
                ))}
              </div>
              <span>548.7K</span>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-base font-semibold">
          {t?.download || "DOWNLOAD"}
        </button>
      </div>
    </div>
  )
}
