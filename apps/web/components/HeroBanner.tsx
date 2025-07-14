"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface HeroBannerProps {
  backgroundClassName?: "bg-hero" | "bg-hero-men" | "bg-hero-women" | "bg-hero-kids" | null | undefined
  content?: {
    title: string
    description: string
    buttons: Array<{ buttonLabel?: string; href: string }>
  }
}

export default function HeroBanner({
  backgroundClassName = "bg-hero",
  content = {
    title: "A TRUE MIAMI ORIGINAL",
    description: "Dream big and live blue in the iconic Inter Miami CF 2025 Third Jersey.",
    buttons: [{ href: "/inter-miami-cf", buttonLabel: "SHOP NOW" }],
  },
}: HeroBannerProps) {
  const router = useRouter()

  return (
    <section
      className={cn(
        "relative h-[83vh] bg-cover bg-top text-white",
        backgroundClassName
      )}
    >
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-10 xl:px-20 h-full flex items-end pb-11 sm:pb-20">
        <div className="max-w-xl">
          {/* Tiêu đề */}
          <h1 className="block w-fit bg-white text-black text-base sm:text-lg md:text-xl font-bold px-1.5 py-0.5 mb-2 tracking-tight uppercase">
            {content.title}
          </h1>

          {/* Mô tả */}
          <p className="block w-fit bg-white text-black text-xs sm:text-sm px-1.5 py-0.5 mb-4 leading-snug">
            {content.description}
          </p>

          {/* Nút CTA */}
          <div className="flex flex-wrap items-start gap-2">
            {content.buttons.map((btn, idx) => (
              <Button
                key={`${btn.href}-${idx}`}
                theme="white"
                size="sm"
                border
                shadow={false}
                fullWidth={false}
                variant="outline"
                href={btn.href}
                showArrow
                className="border border-black text-black font-bold px-2 py-1 text-xs sm:text-sm rounded-none hover:bg-gray-100 transition w-auto h-9"
              >
                {btn.buttonLabel || "SHOP NOW"}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
