"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "@/hooks/useTranslations"

export default function PromoBanner() {
  const t = useTranslations("promoBanner")

  return (
    <section className="w-full bg-[#ECEFF1] dark:bg-[#ECEFF1]">
      <Link
        href="/sale"
        className="relative flex min-h-10 w-full items-center px-4 py-2 text-black transition-opacity hover:opacity-90 sm:px-12"
      >
        <p className="w-full text-center text-[14px] font-bold leading-5">
          {t?.promoBannerDesc ??
            "Save $30 on orders $100+ with code DEAL. Exclusions apply."}
        </p>
        <ArrowRight
          className="absolute right-4 top-1/2 h-8 w-8 shrink-0 -translate-y-1/2 sm:right-12"
          strokeWidth={1.25}
          aria-hidden
        />
      </Link>
    </section>
  )
}
