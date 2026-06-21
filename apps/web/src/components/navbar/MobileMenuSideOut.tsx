import { Heart, MenuIcon, Search, ShoppingBag, User } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "../theme/ThemeToggle"
import AdidasLogo from "../adidas-logo"
import type { Session } from "@/lib/auth"
import { cn } from "@/lib/utils"

const NOTIFICATION_BADGE =
  "absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#538E76] text-xs font-bold text-white"

interface MobileMenuSlideOutProps {
  session: Session | null;
  loginBadgeAnimate: boolean;
  cartItemsCount: number;
  wishlistItemsCount: number;
  handleUserIconClick: () => void;
  setShowMobileMenu: (value: boolean) => void;
  // setShowUserSlideOut: (value: boolean) => void;
  // setShowLoginModal: (value: boolean) => void;
  // setShowMobileSearch: (value: boolean) => void;
  handleMobileSearchClick: () => void;
}

export default function MobileMenuSlideOut({
  session,
  loginBadgeAnimate,
  cartItemsCount,
  wishlistItemsCount,
  handleUserIconClick,
  setShowMobileMenu,
  // setShowUserSlideOut,
  // setShowLoginModal,
  // setShowMobileSearch,
  handleMobileSearchClick
}: MobileMenuSlideOutProps) {
  return (
    <>
    <div className="sm:hidden flex items-center justify-between px-[10px] py-2 sm:px-[20px] xl:px-[40px]">
      <div className="flex items-center space-x-4">
        <button onClick={() => setShowMobileMenu(true)}>
          <MenuIcon className="h-6 w-6" />
        </button>
        <Link href="/wishlists" className="relative inline-flex">
          <Heart
            className={cn(
              "h-5 w-5",
              wishlistItemsCount > 0 ? "fill-black text-black dark:fill-white dark:text-white" : "text-black dark:text-white"
            )}
          />
          {wishlistItemsCount > 0 && (
            <span className={NOTIFICATION_BADGE}>
              {wishlistItemsCount}
            </span>
          )}
        </Link>
        <ThemeToggle />
      </div>

      <Link href="/" className="flex items-center">
        <AdidasLogo />
      </Link>

      <div className="flex items-center space-x-4">
        <button onClick={handleUserIconClick} className="relative inline-flex cursor-pointer">
          <User className="h-5 w-5" />
          {!session?.user?.email && (
            <span className={cn(
              NOTIFICATION_BADGE,
              "transition-transform duration-100",
              loginBadgeAnimate && "animate-bounce",
            )}>1</span>
          )}
        </button>
        <button onClick={handleMobileSearchClick}>
          <Search className="h-5 w-5" />
        </button>
        <Link href="/cart" className="relative inline-flex">
          <ShoppingBag
            className={cn(
              "h-5 w-5",
              cartItemsCount > 0 ? "fill-black text-black dark:fill-white dark:text-white" : "text-black dark:text-white"
            )}
          />
          <span className={NOTIFICATION_BADGE}>
            {cartItemsCount}
          </span>
        </Link>
      </div>
    </div>
    </>
  )
}
