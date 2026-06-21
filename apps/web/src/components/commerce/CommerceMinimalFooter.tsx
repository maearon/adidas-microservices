"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "@/hooks/useTranslations"

export default function CommerceMinimalFooter() {
  const t = useTranslations("commerce")

  return (
    <footer className="mt-auto bg-[#363738] px-4 py-8 text-center text-xs text-white sm:text-sm">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4">
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
              aria-hidden
            >
              <rect
                x="7"
                y="2.5"
                width="10"
                height="19"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M10 5H14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {t?.footer?.questions ?? "Questions?"}{" "}
            <a href="tel:18009829337" className="hover:underline">
              {t?.footer?.phone ?? "1-800-982-9337"}
            </a>
          </span>
          <span className="hidden sm:inline">|</span>
          <span>{t?.footer?.hours ?? "8AM ET – 11PM ET, 7 days a week"}</span>
        </p>

        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
          <span className="inline-flex items-center gap-1.5">
            {t?.footer?.privacyChoices ?? "Your Privacy Choices"}
            <Image
              src="/assets/img/ccpa-privacy-options.svg"
              alt=""
              width={28}
              height={14}
              className="inline-block"
              aria-hidden
            />
          </span>
          <span>|</span>
          <Link href="#" className="hover:underline">
            {t?.footer?.privacyStatement ?? "Privacy Statement"}
          </Link>
          <span>|</span>
          <Link href="#" className="hover:underline">
            {t?.footer?.termsAndConditions ?? "Terms and Conditions"}
          </Link>
        </p>

        <p className="text-white/80">{t?.footer?.copyright ?? "© 2024 adidas America Inc."}</p>
      </div>
    </footer>
  )
}
