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
        className="mx-auto flex w-full max-w-none items-center justify-between gap-3 px-4 py-4 text-black transition-opacity hover:opacity-90 sm:justify-center sm:px-6 sm:py-2"
      >
        <p className="text-[14px] font-bold leading-5 sm:text-center">
          {t?.promoBannerDesc ??
            "Save $30 on orders $100+ with code DEAL. Exclusions apply."}
        </p>
        <ArrowRight
          className="h-8 w-8 shrink-0"
          strokeWidth={1.25}
          aria-hidden
        />
      </Link>
    </section>
  )
}
