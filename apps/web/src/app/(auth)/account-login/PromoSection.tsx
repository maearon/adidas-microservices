'use client'

import Image from "next/image"
import {
  authBodyClass,
  authHeadingClass,
  authSectionClass,
  authSubtleTextClass,
} from "@/components/auth/adiclub-auth-styles"
import { useTranslations } from "@/hooks/useTranslations"

const PromoSection = () => {
  const t = useTranslations("auth")

  const rewards = [
    t?.welcomeBonusVoucher ?? "Welcome Bonus Voucher for 15% off",
    t?.freeShippingReturns ?? "Free Shipping and Returns",
    t?.membersOnlyProducts ?? "Members-Only Products",
    t?.earlyAccessSales ?? "Early Access to Sales",
    t?.accessLimitedEditions ?? "Access to Limited Editions",
  ]

  return (
    <div className={authSectionClass}>
      <div className="mb-8 overflow-hidden">
        <Image
          src="/assets/login/account-portal-page-inline.jpeg"
          alt=""
          width={960}
          height={640}
          priority
          className="h-auto w-full object-cover"
        />
      </div>

      <h2 className={`mb-4 ${authHeadingClass}`}>
        {t?.joinAdiclubToUnlock ?? "JOIN ADICLUB TO UNLOCK MORE REWARDS"}
      </h2>

      <p className={`mb-6 ${authBodyClass}`}>
        {t?.joinAdiclubForFree ??
          "Join adiClub for free and enjoy immediate access to these Level 1 rewards:"}
      </p>

      <ul className="mb-6 space-y-3 text-base">
        {rewards.map((reward) => (
          <li key={reward} className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center text-sm font-bold">
              ✓
            </span>
            <span>{reward}</span>
          </li>
        ))}
      </ul>

      <p className={authSubtleTextClass}>
        {t?.startEarningPoints ??
          "Start earning adiClub points every time you shop, track a run on the adidas Running app and share a product review. The more points you earn, the faster you'll level up and unlock rewards such as a Birthday Gift, Free Personalisation, Priority Customer Service, Premium Event Tickets and more."}
      </p>
    </div>
  )
}

export default PromoSection
