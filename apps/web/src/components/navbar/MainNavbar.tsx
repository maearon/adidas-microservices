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
    <div className="grid grid-cols-[1fr_auto_1fr] items-center px-12 pb-2 mx-0 w-full">
      <div aria-hidden />
      <nav className="relative z-30 flex shrink-0 items-center justify-center gap-6 xl:gap-8">
          {navItems.map((item) => (
              <div
                key={item.href}
                className="relative shrink-0"
                onMouseEnter={() => handleMouseEnter(item.menuKey)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "inline-block py-2 text-base whitespace-nowrap",
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
      <div className="pointer-events-none flex items-center justify-end gap-4 justify-self-end">
        <div className="pointer-events-auto">
          <SearchField />
        </div>

        <button
          onClick={handleUserIconClick}
          className="pointer-events-auto relative cursor-pointer"
        >
          <User className="h-5 w-5" />
          {!session?.user?.email && (
            <span className={cn(
              NOTIFICATION_BADGE,
              "-top-3 -right-2 transition-transform duration-100",
              loginBadgeAnimate && "animate-bounce",
            )}>1</span>
          )}
        </button>

        <Link href="/wishlist" className="pointer-events-auto relative">
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

        <div className="group/bag pointer-events-auto relative">
          <Link href="/cart" className="relative inline-flex">
            <ShoppingBag
              className={cn(
                "h-5 w-5",
                cartItemsCount > 0 ? "fill-black text-black dark:fill-white dark:text-white" : "text-black dark:text-white"
              )}
            />
            <span className={cn(NOTIFICATION_BADGE, "-top-2 -right-2")}>
              {cartItemsCount}
            </span>
          </Link>
          {cartItemsCount === 0 && (
            <div
              className={cn(
                "absolute right-0 top-full z-[60] mt-px hidden h-14 w-[min(520px,calc(100vw-6rem))]",
                "items-center border border-gray-200 bg-white pl-12 pr-8 shadow-sm",
                "group-hover/bag:block dark:border-gray-700 dark:bg-black",
              )}
            >
              <p className="text-base font-bold text-black dark:text-white">
                {accountT?.yourBagIsEmpty || "Your Bag is Empty"}
              </p>
            </div>
          )}
        </div>

        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
