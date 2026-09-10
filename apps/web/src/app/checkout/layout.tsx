import type React from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import "../globals.css"
import { getServerSession } from "@/lib/get-session"
import { resolveRequestLocale } from "@/lib/locale.server"
import CheckoutHeader from "@/app/checkout/checkout-header"
import CommerceMinimalFooter from "@/components/commerce/CommerceMinimalFooter"
import commerceEn from "@/locales/en_US/commerce.json" with { type: "json" }
import commerceVi from "@/locales/vi_VN/commerce.json" with { type: "json" }

const commerceByLocale = {
  en_US: commerceEn,
  vi_VN: commerceVi,
} as const

type SupportedLocale = keyof typeof commerceByLocale

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const resolved = await resolveRequestLocale(cookieStore.get("NEXT_LOCALE")?.value)
  const locale: SupportedLocale = resolved === "vi_VN" ? "vi_VN" : "en_US"
  const t = commerceByLocale[locale].checkout

  return {
    title: t.metaTitle,
    description: t.metaDescription,
  }
}

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CheckoutHeader session={session} />
      <main className="flex-1">{children}</main>
      <CommerceMinimalFooter />
    </div>
  )
}
