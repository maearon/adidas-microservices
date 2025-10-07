"use client"

import { useTranslations } from "@/hooks/useTranslations"
import Link from "next/link"

export default function PromoBanner() {
  const t = useTranslations("promoBanner")
  return (
    <Link
      href="/sale-prime"
      className="block w-full bg-[#e9edf0] hover:opacity-90 transition"
    >
      <div className="relative flex items-center px-4 pt-3 pb-4 md:px-6 md:pt-3 md:pb-4 text-gray-800">
        <p className="text-base mx-auto pr-8 md:pr-10">
          {t?.promoBannerDesc ?? "Shop sale styles and get fast, free delivery with Prime."}
        </p>
        <span className="text-[22px] font-thin leading-none">⟶</span>
      </div>
    </Link>
  )
}
