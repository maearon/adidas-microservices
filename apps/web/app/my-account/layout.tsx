"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { useAppSelector } from "@/store/hooks"
import { fetchUser, selectUser } from "@/store/sessionSlice"
import type { AppDispatch } from "@/store/store"
import FullScreenLoader from "@/components/ui/FullScreenLoader"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLogout } from "@/api/hooks/useLoginMutation"
import flashMessage from "@/components/shared/flashMessages"
import { useCurrentUser } from "@/api/hooks/useCurrentUser"

const accountMenuItems = [
  { name: "Account Overview", href: "/my-account", icon: "👤" },
  { name: "Personal Information", href: "/my-account/profile", icon: "📝" },
  { name: "Address Book", href: "/my-account/addresses", icon: "📍" },
  { name: "Order History", href: "/my-account/order-history", icon: "📦" },
  { name: "Preferences", href: "/my-account/preferences", icon: "⚙️" },
  { name: "Size Profile", href: "/my-account/size-profile", icon: "📏" },
  { name: "adiClub Pass", href: "/my-account/adiclub", icon: "🎫" },
]

export default function MyAccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const userData = useAppSelector(selectUser)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  if (typeof window !== "undefined") {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  }

  const [hasMounted, setHasMounted] = useState(false)
  const { data: user, isLoading, isError, isFetched } = useCurrentUser()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (isFetched && !user?.email) {
      setTimeout(() => {
        router.replace("/account-login")
      }, 0)
    }
    setLoading(false);
  }, [isFetched, user, router])

  const logoutHandler = useLogout()

  const handleLogoutWithToLogin = async () => {
    try {
      await logoutHandler()           // 🟢 Gọi logout  
      flashMessage("success", "Logged out successfully")
      router.replace("/account-login")   // ✅ To login
    } catch (error) {
      flashMessage("error", "Logout failed")
    }
  }

  useEffect(() => {
    if (!loading && !userData.loggedIn) {
      router.push("/account-login")
    }
  }, [loading, userData.loggedIn, router])

  if (loading) return <FullScreenLoader />

  if (!userData.loggedIn) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">HI {userData.value?.name?.toUpperCase() || "USER"}</h2>
              <div className="flex items-center text-base text-gray-600">
                <span className="mr-2">🏆</span>
                <span>0 points to spend</span>
              </div>
            </div>

            <nav className="space-y-1">
              <h3 className="font-bold text-base mb-4">ACCOUNT OVERVIEW</h3>
              {accountMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-base rounded hover:bg-gray-100 transition-colors",
                    pathname === item.href ? "bg-gray-100 font-medium" : "",
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                  <span className="ml-auto">›</span>
                </Link>
              ))}

              <div className="pt-4 border-t">
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                    localStorage.clear()
                    sessionStorage.clear()
                    }
                    router.push("/")
                  }}
                  className="flex items-center px-3 py-2 text-base text-red-600 hover:bg-red-50 rounded w-full text-left"
                >
                  <span className="mr-3" onClick={handleLogoutWithToLogin}>🚪</span>
                  Log out
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  )
}
