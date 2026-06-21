"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useAppSelector } from "@/store/hooks"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/hooks/useTranslations"
import type { Session } from "@/lib/auth"
import { CART_PAGE_SHELL } from "@/components/commerce/commerce-page-shell"

type CheckoutHeaderProps = {
  session: Session | null
}

export default function CheckoutHeader({ session }: CheckoutHeaderProps) {
  const t = useTranslations("commerce")
  const cartItems = useAppSelector((state) => state.cart.items)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const userName =
    session?.user?.name?.split(" ")[0] || (t?.checkout?.guest ?? "Guest")
  const greeting = (t?.checkout?.greeting ?? "Hi, {{name}}!").replace(
    "{{name}}",
    userName.toLowerCase(),
  )

  return (
    <header className="border-b border-border bg-background text-foreground">
      <div className={`${CART_PAGE_SHELL} py-4 lg:py-5`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/" className="text-2xl font-bold lowercase tracking-tight">
              adidas
            </Link>
            <span className="text-base font-medium uppercase">{greeting}</span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/cart"
              className="relative inline-flex"
              aria-label={t?.checkout?.goToBag ?? "Go to bag"}
            >
              <ShoppingBag
                className={cn(
                  "h-6 w-6",
                  cartCount > 0
                    ? "fill-black text-black dark:fill-white dark:text-white"
                    : "text-black dark:text-white",
                )}
              />
              {cartCount > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#00853e] px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>
            <span className="text-base font-bold lowercase tracking-tight">
              {t?.checkout?.adiclub ?? "adiclub"}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
