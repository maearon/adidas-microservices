"use client"

import Image from "next/image"
import { useTranslations } from "@/hooks/useTranslations"

function PromoArrow() {
  return (
    <svg
      viewBox="0 0 140 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hidden h-12 w-28 shrink-0 text-neutral-500 sm:block"
      aria-hidden
    >
      <path
        d="M4 44C36 44 58 30 78 18C92 10 108 6 128 6"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M120 2L128 6L122 14"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function WishlistAppPromo() {
  const t = useTranslations("categoryPages")

  const bullets = Array.isArray(t?.wishlistAppPromoBullets)
    ? t.wishlistAppPromoBullets
    : [
        "Instant notifications on items on sale or low in stock",
        "Share your wishlist with friends and family",
        "See which wishlist items are eligible for a voucher",
        "Get 50 adiClub points and unlock more rewards with the app",
      ]

  return (
    <div className="relative w-full overflow-hidden bg-[#E8E8E8] px-6 py-8 text-foreground dark:bg-neutral-900 sm:px-10 sm:py-10 lg:max-w-[50%]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.08)_1px,transparent_0)] [background-size:4px_4px] dark:opacity-20 dark:[background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)]"
      />
      <div className="relative">
      <h2 className="mb-5 max-w-xl text-xl font-bold leading-tight sm:text-[28px]">
        {t?.wishlistAppPromoTitle ?? "Get more from your wishlist through the app"}
      </h2>

      <ul className="mb-10 max-w-2xl space-y-3 text-sm sm:text-base">
        {bullets.map((bullet: string) => (
          <li key={bullet} className="flex items-start gap-3">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-end gap-4">
          <p className="max-w-[240px] text-sm font-bold leading-snug sm:text-base">
            {t?.wishlistAppPromoScan ?? "Scan to download the adidas app"}
          </p>
          <PromoArrow />
        </div>

        <div className="shrink-0 bg-white p-1">
          <Image
            src="/assets/wishlist/adidas-app-qr.png"
            alt="QR code to download the adidas app"
            width={120}
            height={120}
            className="h-[120px] w-[120px] object-contain"
          />
        </div>
      </div>
      </div>
    </div>
  )
}
