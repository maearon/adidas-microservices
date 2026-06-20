import Link from "next/link"
import SearchField from "../SearchField"
import { usePathname } from "next/navigation"
import { Heart, ShoppingBag, User } from "lucide-react"
import { ThemeToggle } from "../theme/ThemeToggle"
import type { Session } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/hooks/useTranslations"

const NOTIFICATION_BADGE =
  "absolute flex h-5 w-5 items-center justify-center rounded-full bg-[#538E76] text-xs font-bold text-white"

interface MainNavbarProps {
  session: Session | null;
  activeMenu: string | null;
  loginBadgeAnimate: boolean;
  cartItemsCount: number;
  wishlistItemsCount: number;
  handleUserIconClick: () => void;
  handleMouseEnter: (menuName: string) => void;
  // handleMouseLeave: () => void;
  // setShowUserSlideOut: (value: boolean) => void;
  // setShowLoginModal: (value: boolean) => void;
}

export default function MainNavbar({
  session,
  activeMenu,
  loginBadgeAnimate,
  cartItemsCount,
  wishlistItemsCount,
  handleUserIconClick,
  handleMouseEnter,
  // handleMouseLeave,
  // setShowUserSlideOut,
  // setShowLoginModal
}: MainNavbarProps) {
  const pathname = usePathname()
  const t = useTranslations("navigation")
  const accountT = useTranslations("account")

  const navItems = [
    { name: t?.men || "MEN", href: "/men", menuKey: "MEN", bold: true },
    { name: t?.women || "WOMEN", href: "/women", menuKey: "WOMEN", bold: true },
    { name: t?.kids || "KIDS", href: "/kids", menuKey: "KIDS", bold: true },
    { name: t?.fifaWorldCup26 || "FIFA WORLD CUP 26™", href: "/fifa_world_cup", menuKey: "FIFA WORLD CUP 26™", bold: true },
    { name: t?.sports || "SPORTS", href: "/sports", menuKey: "SPORTS", bold: false },
    { name: t?.sale || "SALE", href: "/sale", menuKey: "SALE", bold: false },
    { name: t?.newTrending || "NEW & TRENDING", href: "/trending", menuKey: "NEW & TRENDING", bold: false },
  ]
  
  return (
    <div className="grid grid-cols-3 items-center px-12 pb-2 mx-0 w-full">
      <div></div>
      <div className="w-full justify-self-start xl:justify-self-center">
        <nav className="flex space-x-8 justify-center">
          {navItems.map((item) => (
              <div key={item.href} onMouseEnter={() => handleMouseEnter(item.menuKey)}>
                <Link
                  href={item.href}
                  className={cn(
                    "text-base py-2 whitespace-nowrap",
                    item.bold ? "font-bold uppercase" : "font-medium",
                    pathname === item.href && "border-b-2 border-black dark:border-white",
                    activeMenu === item.menuKey && "border-b-2 border-black dark:border-white",
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
              NOTIFICATION_BADGE,
              "-top-3 -right-2 transition-transform duration-100",
              loginBadgeAnimate && "animate-bounce",
            )}>1</span>
          )}
        </button>

        <Link href="/wishlist" className="relative">
          <Heart
            className={cn(
              "h-5 w-5",
              wishlistItemsCount > 0 ? "fill-black text-black dark:fill-white dark:text-white" : "text-black dark:text-white"
            )}
          />
          {wishlistItemsCount > 0 && (
            <span className={cn(NOTIFICATION_BADGE, "-top-2 -right-2")}>
              {wishlistItemsCount}
            </span>
          )}
        </Link>

        <Link href="/cart" className="relative group">
          <ShoppingBag
            className={cn(
              "h-5 w-5",
              cartItemsCount > 0 ? "fill-black text-black dark:fill-white dark:text-white" : "text-black dark:text-white"
            )}
          />
          <span className={cn(NOTIFICATION_BADGE, "-top-2 -right-2")}>
            {cartItemsCount}
          </span>
          {cartItemsCount === 0 && (
                <div className="absolute top-8 right-0 bg-white dark:bg-black text-black dark:text-white border shadow-lg p-4 rounded-none hidden group-hover:block z-10 whitespace-nowrap">
                  <p className="font-bold">{accountT?.yourBagIsEmpty || "Your Bag is Empty"}</p>
                </div>
              )}
        </Link>

        <ThemeToggle />
      </div>
    </div>
  )
}
