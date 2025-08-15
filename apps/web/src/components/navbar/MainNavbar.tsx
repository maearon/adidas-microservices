import Link from "next/link"
import SearchField from "../SearchField"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Heart, ShoppingBag, User } from "lucide-react"
import { useAppSelector } from "@/store/hooks"
import { ThemeToggle } from "../theme/ThemeToggle"
import type { Session } from "@/lib/auth"
import { cn } from "@/lib/utils"

interface MainNavbarProps {
  session: Session | null;
  activeMenu: string | null;
  loginBadgeAnimate: boolean;
  cartItemsCount: number;
  wishlistItemsCount: number;
  handleUserIconClick: () => void;
  handleMouseEnter: (menuName: string) => void;
  handleMouseLeave: () => void;
  setShowUserSlideOut: (value: boolean) => void;
  setShowLoginModal: (value: boolean) => void;
}

export default function MainNavbar({
  session,
  activeMenu,
  loginBadgeAnimate,
  cartItemsCount,
  wishlistItemsCount,
  handleUserIconClick,
  handleMouseEnter,
  handleMouseLeave,
  setShowUserSlideOut,
  setShowLoginModal
}: MainNavbarProps) {
  const pathname = usePathname()

  const navItems = [
    { name: "MEN", href: "/men" },
    { name: "WOMEN", href: "/women" },
    { name: "KIDS", href: "/kids" },
    { name: "BACK TO SCHOOL🔥", href: "/back_to_school" },
    { name: "SALE", href: "/sale" },
    { name: "NEW & TRENDING", href: "/trending" },
  ]
  
  return (
    <div className="grid grid-cols-3 items-center px-12 pb-2 mx-0 w-full">
      <div></div>
      <div className="w-full justify-self-start xl:justify-self-center">
        <nav className="flex space-x-8 justify-center">
          {navItems.map((item) => (
            <div key={item.href} onMouseEnter={() => handleMouseEnter(item.name)}>
              <Link
                href={item.href}
                className={cn(
                  "text-base py-2 whitespace-nowrap",
                  (item.name === "MEN" || item.name === "WOMEN" || item.name === "KIDS") ? "font-bold uppercase" : "font-medium",
                  pathname === item.href && "border-b-2 border-black dark:border-white",
                  activeMenu === item.name && "border-b-2 border-black dark:border-white",
                )}
              >
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
      </div>
      <div className="flex justify-end items-center space-x-4">
        <SearchField />

        <button onClick={handleUserIconClick} className="relative cursor-pointer">
          <User className="h-5 w-5" />
          {!session?.user?.email && (
            <span className={cn(
              "absolute -top-3 -right-2 bg-[#FFD619] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold transition-transform duration-100",
              loginBadgeAnimate && "animate-bounce",
            )}>1</span>
          )}
        </button>

        <Link href="/wishlist" className="relative">
          <Heart className="h-5 w-5" />
          {wishlistItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {wishlistItemsCount}
            </span>
          )}
        </Link>

        <Link href="/cart" className="relative group">
          <ShoppingBag className="h-5 w-5" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
          {/* Cart Empty Tooltip */}
              {cartItemsCount === 0 && (
                <div className="absolute top-8 right-0 bg-white dark:bg-black text-black dark:text-white border shadow-lg p-4 rounded hidden group-hover:block z-10 whitespace-nowrap">
                  <p className="font-bold">YOUR CART IS EMPTY</p>
                </div>
              )}
        </Link>

        <ThemeToggle />
      </div>
    </div>
  )
}
