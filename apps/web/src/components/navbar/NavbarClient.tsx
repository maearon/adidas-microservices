'use client'

import type React from "react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
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
import { Z } from "@/lib/z-index"
import { useInitSession } from "@/api/hooks/useLoginMutation"
import FullScreenLoader from "../ui/FullScreenLoader"
// import { selectUser } from "@/store/sessionSlice"
// import { useSelector } from "react-redux"
import type { Session } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import { useHeaderScrollHide } from "@/hooks/useHeaderScrollHide"

const HEADER_SLIDE_TRANSITION = {
  duration: 0.28,
  ease: [0.25, 0.1, 0.25, 1] as const,
}

function measureVisibleHeaderHeight(header: HTMLElement) {
  let height = 0
  for (const child of Array.from(header.children)) {
    const style = window.getComputedStyle(child)
    if (style.display === "none") continue
    height += child.getBoundingClientRect().height
  }
  return Math.round(height)
}

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

  const suppressHeaderHide =
    Boolean(activeMenu) ||
    showMobileMenu ||
    showMobileSearch ||
    showUserSlideOut ||
    showLoginModal

  const isHeaderVisible = useHeaderScrollHide(!suppressHeaderHide)
  const headerRef = useRef<HTMLElement>(null)
  const [headerHeight, setHeaderHeight] = useState(0)

  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el) return

    const updateHeight = () => {
      const height = measureVisibleHeaderHeight(el)
      setHeaderHeight(height)
      document.documentElement.style.setProperty("--site-header-height", `${height}px`)
    }

    updateHeight()

    const observer = new ResizeObserver(updateHeight)
    observer.observe(el)

    const mq = window.matchMedia("(min-width: 640px)")
    mq.addEventListener("change", updateHeight)
    window.addEventListener("resize", updateHeight)

    return () => {
      observer.disconnect()
      mq.removeEventListener("change", updateHeight)
      window.removeEventListener("resize", updateHeight)
    }
  }, [hasMounted, showAppBanner])

  useEffect(() => {
    if (!isHeaderVisible && activeMenu) {
      handleMouseLeave()
    }
  }, [isHeaderVisible, activeMenu])

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
      <motion.header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 w-full bg-white dark:bg-black sm:border-b sm:border-gray-200"
        style={{ zIndex: Z.siteHeader }}
        initial={false}
        animate={{ y: isHeaderVisible ? 0 : "-100%" }}
        transition={HEADER_SLIDE_TRANSITION}
      >
        {showAppBanner && (
          <MobileAppBanner
            isOpen={showAppBanner}
            onClose={() => setShowAppBanner(false)}
          />
        )}

        {/* Top bar */}
        <TopBar />

        {/* Desktop layout — hidden on mobile so it does not affect header height */}
        <div className="relative hidden overflow-visible border-b border-gray-200 bg-white text-black sm:block dark:bg-black dark:text-white">
          <div className="absolute left-8 top-1/2 z-20 -translate-y-1/2">
            <Link href="/" className="flex items-center">
              <AdidasLogo />
            </Link>
          </div>

          <HeaderNavbar onCloseMegaMenu={handleMouseLeave} />

          <div className="relative">
            <MainNavbar
              session={session}
              activeMenu={activeMenu}
              loginBadgeAnimate={loginBadgeAnimate}
              cartItemsCount={cartItemsCount}
              wishlistItemsCount={wishlistItemsCount}
              handleUserIconClick={handleUserIconClick}
              handleMouseEnter={handleMouseEnter}
            />
            <MegaMenu activeMenu={activeMenu} onClose={handleMouseLeave} />
          </div>
        </div>

        {/* Mobile layout */}
        <div className="border-b border-gray-200 sm:hidden dark:border-white">
          <MobileMenuSlideOut
            session={session}
            loginBadgeAnimate={loginBadgeAnimate}
            cartItemsCount={cartItemsCount}
            wishlistItemsCount={wishlistItemsCount}
            handleUserIconClick={handleUserIconClick}
            setShowMobileMenu={setShowMobileMenu}
            handleMobileSearchClick={handleMobileSearchClick}
          />
        </div>

      </motion.header>

      {headerHeight > 0 && (
        <div
          aria-hidden
          className="pointer-events-none shrink-0"
          style={{ height: headerHeight }}
        />
      )}

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
