"use client"

import { useTranslations } from "@/hooks/useTranslations"
import { authDisclaimerClass } from "@/components/auth/adiclub-auth-styles"

export default function AuthTermsDisclaimer() {
  const t = useTranslations("auth")

  return (
    <div className={authDisclaimerClass}>
      <p className="mb-2">
        {t?.signMeUpToAdiclub ??
          "Sign me up to adiClub, featuring exclusive adidas offers and news"}
      </p>
      <p>
        {t?.termsText ??
          'By clicking the "Continue" button, you are joining adiClub, will receive emails with the latest news and updates, and agree to the'}{" "}
        <button type="button" className="underline">
          {t?.termsOfUse ?? "TERMS OF USE"}
        </button>{" "}
        {t?.and ?? "and"}{" "}
        <button type="button" className="underline">
          {t?.adiclubTerms ?? "ADICLUB TERMS AND CONDITIONS"}
        </button>{" "}
        {t?.acknowledgeRead ?? "and acknowledge you have read the"}{" "}
        <button type="button" className="underline">
          {t?.adidasPrivacyPolicy ?? "ADIDAS PRIVACY POLICY"}
        </button>
        {t?.californiaResident ??
          ". If you are a California resident, the adiClub membership may be considered a financial incentive. Please see the Financial Incentives section of our"}{" "}
        <button type="button" className="underline">
          {t?.californiaPrivacyNotice ?? "CALIFORNIA PRIVACY NOTICE"}
        </button>{" "}
        {t?.forDetails ?? "for details."}
      </p>
    </div>
  )
}
