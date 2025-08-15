"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useAppSelector } from "@/store/hooks"

// type Props = {
//   userName: string
//   cartCount: number
// }

export default function CheckoutHeader() {
  const cartCount = useAppSelector((state) => state.cart.items.length)
  const userName = "mark nguyen"
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
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <span className="text-base font-medium">adiClub</span>
          </div>
        </div>
      </div>
    </header>
  )
}
