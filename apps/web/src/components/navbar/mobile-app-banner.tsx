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
    <div className="border-b border-gray-200 bg-[#ECEFF1] sm:hidden dark:border-gray-700 dark:bg-[#ECEFF1]">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 p-1"
          aria-label="Close app banner"
        >
          <X className="h-5 w-5 text-black" strokeWidth={1.25} />
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-black">
            <Image
              src="/logo-app.png"
              alt="Adidas app"
              fill
              className="object-contain p-1.5"
              priority
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold uppercase leading-tight text-black">
              {t?.adidasSportsStyle || "ADIDAS - SPORTS & STYLE"}
            </p>
            <div className="mt-0.5 flex items-center gap-1 text-[12px] leading-none text-black">
              <span className="flex" aria-hidden>
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </span>
              <span>{t?.appRatingCount ?? "645.5K"}</span>
            </div>
          </div>
        </div>

        <a
          href="#"
          className="shrink-0 text-[14px] font-bold uppercase leading-none text-black underline underline-offset-2"
        >
          {t?.download || "DOWNLOAD"}
        </a>
      </div>
    </div>
  )
}
