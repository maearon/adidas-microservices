"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import { LogMeOutButton } from "@/components/auth/LogMeOutButton"
import { LogoutEverywhereButton } from "@/app/(main)/profile/logout-everywhere-button"

interface AccountMenuItem {
  href: string
  name: string
  icon?: ReactNode
}

const accountMenuItems: AccountMenuItem[] = [
  { name: "Account Overview", href: "/my-account", icon: "👤" },
  { name: "Personal Information", href: "/my-account/profile", icon: "📝" },
  { name: "Address Book", href: "/my-account/addresses", icon: "📍" },
  { name: "Order History", href: "/my-account/order-history", icon: "📦" },
  { name: "Preferences", href: "/my-account/preferences", icon: "⚙️" },
  { name: "Size Profile", href: "/my-account/size-profile", icon: "📏" },
  { name: "adiClub Pass", href: "/my-account/adiclub", icon: "🎫" },
]

export default function MyAccountSideBar() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      <h3 className="font-bold text-base mb-4">ACCOUNT OVERVIEW</h3>
      {accountMenuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center px-3 py-2 text-base rounded hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors",
            pathname === item.href ? "bg-gray-100 dark:bg-gray-700 font-medium" : "",
          )}
        >
          <span className="mr-3">{item.icon}</span>
          {item.name}
          <span className="ml-auto">›</span>
        </Link>
      ))}

      <div className="pt-4 border-t">
        <LogMeOutButton/>
        <LogoutEverywhereButton />
      </div>
    </nav>
  )
}
