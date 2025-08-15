"use client"

import { Button } from "@/components/ui/button"
import { useTranslations } from "@/hooks/useTranslations"
import { cn } from "@/lib/utils"

interface HeroBannerProps {
  backgroundClassName?: "bg-hero" | "bg-hero-men" | "bg-hero-women" | "bg-hero-kids" | null | undefined
  content?: {
    title?: string
    description?: string
    buttons?: Array<{
      buttonLabel?: string
      border?: boolean
      href: string
      shadow?: boolean
    }>
  }
}

export default function HeroBanner({
  backgroundClassName = "bg-hero",
  content,
}: HeroBannerProps) {
  const t = useTranslations("hero") || {} // fallback tránh lỗi
  const title = content?.title || t.heroTitle || "A TRUE MIAMI ORIGINAL"
  const description = content?.description || t.heroDesc || "Dream big and live blue in the iconic Inter Miami CF 2025 Third Jersey."
  const buttons = content?.buttons?.length
    ? content.buttons
    : [
        {
          href: "/inter-miami-cf",
          buttonLabel: t.shopNow || "SHOP NOW",
          border: true,
          shadow: false,
        },
      ]

  return (
    <section
      className={cn(
        "hero-section relative h-[83vh] bg-cover bg-top text-white",
        backgroundClassName
      )}
    >
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-10 xl:px-20 h-full flex items-end pb-11 text-white">
        <div className="w-full max-w-md text-left">
          <div className="flex flex-col gap-2 sm:gap-3">
            {/* Tiêu đề */}
            <h1 className="bg-white text-black text-lg sm:text-xl font-extrabold px-1.5 py-0.5 w-fit tracking-tight uppercase">
              {title}
            </h1>

            {/* Mô tả */}
            <p className="bg-white text-black text-xs sm:text-base px-1.5 py-0.5 w-fit leading-snug">
              {description}
            </p>

            {/* Nút CTA */}
            <div className="flex flex-wrap items-start gap-2">
              {buttons.map((btn, idx) => (
                <Button
                  key={`${btn.href}-${idx}`}
                  theme="white"
                  size="sm"
                  border={btn.border}
                  shadow={btn.shadow}
                  fullWidth={false}
                  variant="outline"
                  href={btn.href}
                  showArrow
                  className="bg-white text-black py-3 rounded-none font-semibold transition-colors"
                >
                  {btn.buttonLabel || t.shopNow || "SHOP NOW"}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
