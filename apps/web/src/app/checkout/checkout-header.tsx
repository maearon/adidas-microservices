"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useAppSelector } from "@/store/hooks"
import { cn } from "@/lib/utils"
import type { Session } from "@/lib/auth"
import { ThemeToggle } from "@/components/theme/ThemeToggle"

type CheckoutHeaderProps = {
  session: Session | null
}

export default function CheckoutHeader({ session }: CheckoutHeaderProps) {
  const cartCount = useAppSelector((state) => state.cart.items.length)
  const userName = session?.user?.name || "Guest"
  return (
    <header className="border-b border-gray-200 py-4">
      <div className="container mx-auto px-4">
        {/* <div className="flex items-center justify-between"> */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0"> {/* For mobile */}
          {/* Left side - Logo and greeting */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold">
              adidas
            </Link>
            <span className="text-base font-medium">HI, {userName.toUpperCase()}!</span>
          </div>

          {/* Right side - Cart and adiClub */}
          <div className="flex items-center space-x-6">
            <Link href="/cart" className="relative">
              <ShoppingBag
                className={cn(
                  "h-6 w-6",
                  cartCount > 0 ? "fill-black text-black dark:fill-white dark:text-white" : "text-black dark:text-white"
                )}
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <ThemeToggle />
            <span className="text-base font-medium">adiClub</span>
          </div>
        </div>
      </div>
    </header>
  )
}
