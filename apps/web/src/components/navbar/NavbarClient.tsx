'use client'

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import MegaMenu from "./mega-menu"
import LoginModal from "../login-modal"
import AdidasLogo from "../adidas-logo"
import MobileMenu from "./mobile-menu"
import MobileAppBanner from "./mobile-app-banner"
import MobileSearchOverlay from "./mobile-search-overlay"
import { Nullable } from "@/types/common"
import TopBar from "./TopBar"
import HeaderNavbar from "./HeaderNavbar"
import MainNavbar from "./MainNavbar"
import UserAccountSlideOut from "./UserAccountSlideOut"
import MobileMenuSlideOut from "./MobileMenuSideOut"
import { useInitSession } from "@/api/hooks/useLoginMutation"
import FullScreenLoader from "../ui/FullScreenLoader"
// import { selectUser } from "@/store/sessionSlice"
// import { useSelector } from "react-redux"
import type { Session } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"

interface NavbarClientProps {
  session: Session | null;
}

export default function NavbarClient({ session }: NavbarClientProps) {
  // const current_user = session?.user
  // const { value: userRedux, status } = useSelector(selectUser)
  // const userLoading = status === "loading"
  const [hasMounted, setHasMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const [loginBadgeAnimate, setLoginBadgeAnimate] = useState(false)
  const cartItemsCount = useAppSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  )
  const wishlistItemsCount = useAppSelector((state) => state.wishlist.items.length)

  useEffect(() => {
    if (!session?.user?.email) {
      const interval = setInterval(() => {
        setLoginBadgeAnimate(true)
        const timeout = setTimeout(() => setLoginBadgeAnimate(false), 900)
        return () => clearTimeout(timeout)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [session?.user?.email])

  useInitSession()

  const [searchQuery, setSearchQuery] = useState("")

  
  
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showUserSlideOut, setShowUserSlideOut] = useState(false)

  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showAppBanner, setShowAppBanner] = useState(true)


  

  const [activeMenu, setActiveMenu] = useState<Nullable<string>>(null)
  const handleMouseEnter = (menuName: string) => setActiveMenu(menuName)
  const handleMouseLeave = () => setActiveMenu(null)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}&sitePath=us`)
      setShowMobileSearch(false)
    }
  }

  const handleMobileSearchClick = () => setShowMobileSearch(true)

  const handleUserIconClick = () => {
    if (session?.user?.email) setShowUserSlideOut(true)
    else
    {
      setShowLoginModal(true)
      // router.push("/sign-in")
    }
  }

  if (!hasMounted 
    // || userLoading
  ) return <FullScreenLoader />

  return (
    <>
      <MobileAppBanner isOpen={showAppBanner} onClose={() => setShowAppBanner(false)} />

      <header className="relative sm:border-b sm:border-gray-200">
        {/* Top bar */}
        <TopBar />

        {/* Desktop layout */}
        <div className="hidden sm:block border-b border-gray-200 relative bg-white dark:bg-black text-black dark:text-white">
          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20">
            <Link href="/" className="flex items-center">
              <AdidasLogo />
            </Link>
          </div>
          
          {/* header navbar */}
          <HeaderNavbar />

          {/* main navbar */}
          <MainNavbar
            session={session}
            activeMenu={activeMenu}
            loginBadgeAnimate={loginBadgeAnimate}
            cartItemsCount={cartItemsCount}
            wishlistItemsCount={wishlistItemsCount}
            handleUserIconClick={handleUserIconClick}
            handleMouseEnter={handleMouseEnter}
            // handleMouseLeave={handleMouseLeave}
            // setShowUserSlideOut={setShowUserSlideOut}
            // setShowLoginModal={setShowLoginModal}
          />
        </div>

        {/* Mobile layout */}
        <MobileMenuSlideOut
          session={session}
          loginBadgeAnimate={loginBadgeAnimate}
          cartItemsCount={cartItemsCount}
          wishlistItemsCount={wishlistItemsCount}
          handleUserIconClick={handleUserIconClick}
          setShowMobileMenu={setShowMobileMenu}
          // setShowUserSlideOut={setShowUserSlideOut}
          // setShowLoginModal={setShowLoginModal}
          // setShowMobileSearch={setShowMobileSearch}
          handleMobileSearchClick={handleMobileSearchClick}
        />

        <MegaMenu activeMenu={activeMenu} onClose={handleMouseLeave} /> 
        {/* Menu dropdown when hover main menu */}
      </header>

      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
      <MobileSearchOverlay
        isOpen={showMobileSearch}
        onClose={() => setShowMobileSearch(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearchSubmit}
      />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <UserAccountSlideOut 
        isOpen={showUserSlideOut} 
        onClose={() => setShowUserSlideOut(false)}
        user={session?.user}
      /> {/* onLogout missing */}
    </>
  )
}
