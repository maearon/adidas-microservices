'use client'

import Image from "next/image"
import { useTranslations } from "@/hooks/useTranslations"

const PromoSection = () => {
  const t = useTranslations("auth")

  const benefits = [
    t?.freeShipping ?? "Free shipping",
    t?.fifteenPercentVoucher ?? "A 15% off voucher",
    t?.membersOnlySales ?? "Members Only sales",
    t?.accessAdidasApps ?? "Access to adidas apps",
    t?.specialPromotions ?? "Special promotions",
  ]

  return (
    <div className="w-full bg-white py-2 lg:py-10">
      <div className="mb-8 overflow-hidden">
        <Image
          src="/assets/login/account-portal-page-inline.png"
          alt="Adiclub Benefits"
          width={960}
          height={640}
          priority
          className="h-auto w-full object-cover"
        />
      </div>

      <h2 className="mb-4 text-[28px] font-bold uppercase leading-tight">
        {t?.joinAdiclubGetDiscount ?? "JOIN ADICLUB. GET A 15% DISCOUNT."}
      </h2>

      <p className="mb-6 text-base leading-relaxed">
        {t?.asAdiclubMember ??
          "As an adiClub member you get rewarded with what you love for doing what you love. Sign up today and receive immediate access to these Level 1 benefits:"}
      </p>

      <ul className="space-y-3 text-base">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-3">
            <span className="mt-0.5 text-green-500">✓</span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PromoSection
