'use client'

import AdiclubAuthForm from "@/components/auth/AdiclubAuthForm"
import AdiclubLogo from "@/components/auth/AdiclubLogo"
import { useTranslations } from "@/hooks/useTranslations"
import { useSearchParams } from "next/navigation"

const LoginForm = () => {
  const t = useTranslations("auth")
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") ?? "/my-account"

  return (
    <div className="w-full bg-white py-2 lg:py-10">
      <AdiclubLogo className="mb-8" />

      <h1 className="mb-2 text-[28px] font-bold uppercase leading-tight">
        {t?.logInOrSignUp ?? "LOG IN OR SIGN UP"}
      </h1>
      <p className="mb-6 text-base leading-relaxed">
        {t?.enjoyMembersOnly ??
          "Enjoy members-only access to exclusive products, experiences, offers and more."}
      </p>

      <AdiclubAuthForm redirectTo={redirectTo} showForgotPasswordLink />
    </div>
  )
}

export default LoginForm
