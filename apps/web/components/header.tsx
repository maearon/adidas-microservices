"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, ShoppingBag, User, Heart, MenuIcon, LogOut, LogIn, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppSelector } from "@/store/hooks"
import MegaMenu from "./mega-menu"
import LoginModal from "./login-modal"
import UserAccountSlideout from "./user-account-slideout"
import AdidasLogo from "./adidas-logo"
import type { AppDispatch } from "@/store/store"
import TopBarDropdown from "./top-bar-dropdown"
import MobileMenu from "./mobile-menu"
import MobileAppBanner from "./mobile-app-banner"
import MobileSearchOverlay from "./mobile-search-overlay"
import { useLogout } from "@/api/hooks/useLogout"
import { useInitSession } from "@/api/hooks/useInitSession"
import { useSelector, useDispatch } from "react-redux"
import { selectUser } from "@/store/sessionSlice"
import FullScreenLoader from "@/components/ui/FullScreenLoader"
import { Nullable } from "@/types/common"

export default function Header() {
  const dispatch = useDispatch<AppDispatch>()
  const { value: user, status } = useSelector(selectUser)
  const userLoading = status === "loading"
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useInitSession()

  const logoutHandler = useLogout()
  const pathname = usePathname()
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState<Nullable<string>>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showUserSlideout, setShowUserSlideout] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showTopBarDropdown, setShowTopBarDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showAppBanner, setShowAppBanner] = useState(true)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [loginBadgeAnimate, setLoginBadgeAnimate] = useState(false)

  const cartItemsCount = useAppSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  )
  const wishlistItemsCount = useAppSelector((state) => state.wishlist.items.length)

  const navItems = [
    { name: "MEN", href: "/men" },
    { name: "WOMEN", href: "/women" },
    { name: "KIDS", href: "/kids" },
    { name: "SALE", href: "/sale" },
    { name: "NEW & TRENDING", href: "/trending" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % 2)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!user?.email) {
      const interval = setInterval(() => {
        setLoginBadgeAnimate(true)
        const timeout = setTimeout(() => setLoginBadgeAnimate(false), 900)
        return () => clearTimeout(timeout)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [user?.email])

  const handleMouseEnter = (menuName: string) => setActiveMenu(menuName)
  const handleMouseLeave = () => setActiveMenu(null)

  const handleUserIconClick = () => {
    if (user?.email) setShowUserSlideout(true)
    else setShowLoginModal(true)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}&sitePath=us`)
      setShowMobileSearch(false)
    }
  }

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}&sitePath=us`)
    }
  }

  const handleMobileSearchClick = () => setShowMobileSearch(true)

  if (!hasMounted || userLoading) return <FullScreenLoader />

  return (
    <>
      <MobileAppBanner isOpen={showAppBanner} onClose={() => setShowAppBanner(false)} />

      <header className="relative border-b border-gray-200">
        {/* Top bar */}
        <div className="bg-black text-white text-xs py-3 text-center font-semibold">
          <span>
            {["FREE STANDARD SHIPPING WITH ADICLUB", "FAST, FREE DELIVERY WITH PRIME"][currentMessageIndex]}
            <button className="ml-1 inline-flex items-center" onClick={() => setShowTopBarDropdown(!showTopBarDropdown)}>
              <ChevronDown className="w-3 h-3" />
            </button>
          </span>
        </div>

        {/* Desktop layout */}
        <div className="hidden sm:block border-b border-gray-200 relative">
          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20">
            <Link href="/" className="flex items-center">
              <AdidasLogo />
            </Link>
          </div>

          <div className="flex justify-end items-center text-xs text-gray-700 px-12 py-2 w-full">
            <Link href="/help" className="hover:underline mr-3">help</Link>
            <Link href="/orders" className="hover:underline mr-3">orders and returns</Link>
            <Link href="/gift-cards" className="hover:underline mr-3">gift cards</Link>
            <Link href="/join" className="hover:underline mr-3">join adiClub</Link>
            <div className="flex items-center space-x-1">
              <Image
                src="/flag/us.svg"
                alt="US Flag"
                width={16}
                height={12}
                className="inline-block"
              />
              <select defaultValue="US" className="bg-transparent border-none outline-none text-xs cursor-pointer">
                <option value="US">United States</option>
                <option value="VN">Vietnam</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 items-center px-12 pb-2 mx-0 w-full">
            <div></div>
            <div className="w-full justify-self-start xl:justify-self-center">
              <nav className="flex space-x-8 justify-center">
                {navItems.map((item) => (
                  <div key={item.href} onMouseEnter={() => handleMouseEnter(item.name)}>
                    <Link
                      href={item.href}
                      className={cn(
                        "text-sm hover:underline py-2",
                        (item.name === "MEN" || item.name === "WOMEN" || item.name === "KIDS") ? "font-bold uppercase" : "font-medium",
                        pathname === item.href && "border-b-2 border-black",
                        activeMenu === item.name && "border-b-2 border-black",
                      )}
                    >
                      {item.name}
                    </Link>
                  </div>
                ))}
              </nav>
            </div>
            <div className="flex justify-end items-center space-x-4">
              <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
                <Input
                  placeholder="Search"
                  className="w-48"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="button" onClick={handleSearchClick}>
                  <Search className="h-5 w-5 cursor-pointer" />
                </button>
              </form>

              <button onClick={handleUserIconClick} className="relative">
                <User className="h-5 w-5" />
                {!user?.email && (
                  <span className={cn(
                    "absolute -top-2 -right-2 bg-yellow-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold transition-transform duration-100",
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
                      <div className="absolute top-8 right-0 bg-white border shadow-lg p-4 rounded hidden group-hover:block z-10 whitespace-nowrap">
                        <p className="font-bold">YOUR CART IS EMPTY</p>
                      </div>
                    )}
              </Link>

              {user?.email ? (
                <button onClick={logoutHandler}>
                  <LogOut className="h-5 w-5" />
                </button>
              ) : (
                <Link href="/account-login">
                  <LogIn className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="sm:hidden flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <button onClick={() => setShowMobileMenu(true)}>
              <MenuIcon className="h-6 w-6" />
            </button>
            <Link href="/wishlist" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItemsCount}
                </span>
              )}
            </Link>
          </div>

          <Link href="/" className="flex items-center">
            <AdidasLogo />
          </Link>

          <div className="flex items-center space-x-4">
            <button onClick={handleUserIconClick} className="relative">
              <User className="h-5 w-5" />
              {!user?.email && (
                <span className={cn(
                  "absolute -top-2 -right-2 bg-yellow-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold transition-transform duration-100",
                  loginBadgeAnimate && "animate-bounce",
                )}>1</span>
              )}
            </button>
            <button onClick={handleMobileSearchClick}>
              <Search className="h-5 w-5" />
            </button>
            <Link href="/cart" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            {user?.email ? (
              <button onClick={logoutHandler}>
                <LogOut className="h-5 w-5" />
              </button>
            ) : (
              <Link href="/account-login">
                <LogIn className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>

        <MegaMenu activeMenu={activeMenu} onClose={handleMouseLeave} />
      </header>

      <TopBarDropdown isOpen={showTopBarDropdown} onClose={() => setShowTopBarDropdown(false)} />
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
      <MobileSearchOverlay
        isOpen={showMobileSearch}
        onClose={() => setShowMobileSearch(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearchSubmit}
      />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <UserAccountSlideout isOpen={showUserSlideout} onClose={() => setShowUserSlideout(false)} />
    </>
  )
}
