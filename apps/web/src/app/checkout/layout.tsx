import type React from "react"
import type { Metadata } from "next"
import "../globals.css"
import { getServerSession } from "@/lib/get-session"
import CheckoutHeader from "@/app/checkout/checkout-header"
import CommerceMinimalFooter from "@/components/commerce/CommerceMinimalFooter"

export const metadata: Metadata = {
  title: "Checkout - Adidas",
  description: "Complete your adidas purchase",
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
