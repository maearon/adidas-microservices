"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import AdidasLogo from "../adidas-logo"
import type {
  LocaleMenuItem,
  MenuCategory,
  MenuItem,
  MenuLeaf,
  MenuLevel,
  NavigationHistory,
  NavigationTranslations,
} from "@/types/common"
import { capitalizeWordsCountry } from "@/utils/upper-words"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  localeDisplayMap,
  localeOptions,
  SupportedLocale,
} from "@/lib/constants/localeOptions"
import { setLocale } from "@/store/localeSlice"
import { colorMappingClass, colorMappingSymbol } from "@/utils/menu-utils"
import {
  fifaWorldCupPromo,
  getPrimePromoHref,
  isMobileNavGroup,
  mobileMainMenuData,
  primeDeliveryPromo,
  type MobileNavGroup,
  type MobileNavNode,
} from "@/data/mobile-menu/mobile-nav-data"
import { useTranslations } from "@/hooks/useTranslations"
import LocaleModal from "@/components/footer/LocaleModal"
import LocationModal from "@/components//location-modal"
import { useLocationModal } from "@/hooks/useLocationModal"
import { normalizeLocale } from "@/lib/utils"
import { adidasCdnImage } from "@/lib/adidas-cdn"
import { Z } from "@/lib/z-index"

// ======================
// Utils type guards
// ======================
function isMenuCategory(item: MenuItem): item is MenuCategory {
  return "title" in item && "items" in item
}
function isLocaleMenuItem(item: MenuItem): item is LocaleMenuItem {
  return "value" in item && "flag" in item
}
function isMenuLeaf(item: MenuItem): item is MenuLeaf {
  return "name" in item && "href" in item
}

// ======================
// Helpers
// ======================
function buildMainCategories(t: NavigationTranslations): MenuCategory[] {
  return [
    {
      title: t?.men || "MEN",
      titleHref: "/men",
      items: [],
    },
    {
      title: t?.women || "WOMEN", 
      titleHref: "/women",
      items: [],
    },
    {
      title: t?.kids || "KIDS",
      titleHref: "/kids", 
      items: [],
    },
    {
      title: t?.fifaWorldCup26 || "FIFA WORLD CUP 26™",
      titleHref: "/fifa_world_cup",
      items: [],
    },
    {
      title: t?.sports || "SPORTS",
      titleHref: "/sports",
      items: [],
    },
    {
      title: t?.newTrending || "NEW & TRENDING",
      titleHref: "/trending",
      items: [],
    },
    {
      title: t?.sale || "SALE",
      titleHref: "/sale",
      items: [],
    },
  ]
}

function isBoldMainCategory(title: string, t: NavigationTranslations) {
  return [
    t?.men || "MEN",
    t?.women || "WOMEN",
    t?.kids || "KIDS",
    t?.fifaWorldCup26 || "FIFA WORLD CUP 26™",
  ].includes(title)
}

function getMenuKey(category: MenuCategory, t: NavigationTranslations): string | null {
  if (category.title === (t?.men || "MEN")) return "MEN"
  if (category.title === (t?.women || "WOMEN")) return "WOMEN"
  if (category.title === (t?.kids || "KIDS")) return "KIDS"
  if (category.title === (t?.fifaWorldCup26 || "FIFA WORLD CUP 26™")) return "FIFA WORLD CUP 26™"
  if (category.title === (t?.sports || "SPORTS")) return "SPORTS"
  if (category.title === (t?.sale || "SALE")) return "SALE"
  if (category.title === (t?.newTrending || "NEW & TRENDING")) return "NEW & TRENDING"
  return null
}

function translateMegaLabel(
  megaMenuT: Record<string, string> | null | undefined,
  label: string,
  translationKey?: string,
) {
  if (translationKey && megaMenuT?.[translationKey]) {
    return megaMenuT[translationKey]
  }
  const normalized = label.toLowerCase().replace(/\s+/g, "").replace(/&/g, "").replace(/🔥/g, "")
  return megaMenuT?.[normalized] || label
}

type MobileMenuSpotlightProps = {
  href: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  onClose: () => void
  /** Messi 3:4 portrait vs Prime square tile */
  imageAspect?: "3/4" | "1/1"
}

/** adidas.com mobile nav spotlight — text block + full-height image */
function MobileMenuSpotlight({
  href,
  title,
  description,
  imageSrc,
  imageAlt,
  onClose,
  imageAspect = "1/1",
}: MobileMenuSpotlightProps) {
  const imageWidth = imageAspect === "3/4" ? 121 : 141
  const imageHeight = 161
  const imageSrcOptimized = adidasCdnImage(imageSrc, {
    width: imageWidth,
    height: imageHeight,
  })

  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex h-[161px] w-full border-y border-gray-200 dark:border-gray-700"
    >
      <div className="flex min-w-0 flex-1 flex-col justify-center py-8 pl-14 pr-10">
        <span className="mb-1 block text-left text-base font-bold leading-6">{title}</span>
        <span className="block text-left text-sm leading-5 text-foreground">{description}</span>
      </div>
      <div
        className={cn(
          "relative h-full shrink-0 overflow-hidden",
          imageAspect === "3/4" ? "w-[121px]" : "w-[141px]",
        )}
      >
        <Image
          src={imageSrcOptimized}
          alt={imageAlt}
          width={imageWidth * 2}
          height={imageHeight * 2}
          className="h-full w-full object-cover object-center"
          quality={90}
          draggable={false}
        />
      </div>
    </Link>
  )
}

const USE_EMOJI_SWATCH = true // config

function MobileMenuChevron() {
  return <ChevronRight className="h-6 w-6 shrink-0 text-black dark:text-white" strokeWidth={1.25} />
}

function getColorSwatch(itemName: string, categoryTitle: string) {
  if (categoryTitle.toLowerCase().includes("color")) {
    const colorName = itemName.toLowerCase()
    const colorClass = colorMappingClass[colorName]
    const colorSymbol = colorMappingSymbol[colorName]
    if (USE_EMOJI_SWATCH) {
      return <span>{colorSymbol}</span>
    } else {
      return <div className={cn("w-4 h-4 rounded-full", colorClass)} />
    }
  }
  return null
}

// ======================
// Component
// ======================
interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [country, setCountry] = useState<string>("US")
  const [isLocaleModalOpen, setIsLocaleModalOpen] = useState(false)
  const { selectLocation } = useLocationModal()
  const [currentLevel, setCurrentLevel] = useState<MenuLevel>({
    title: "MENU",
    items: [],
  })
  const [navigationHistory, setNavigationHistory] = useState<
    NavigationHistory[]
  >([])
  const [activeRootMenu, setActiveRootMenu] = useState<string | null>(null)

  const dispatch = useAppDispatch()
  const locale = useAppSelector((s) => s.locale.locale)
  const languageLabel = localeDisplayMap[locale]
  const t = useTranslations("navigation")
  const commonT = useTranslations("common")
  const megaMenuT = useTranslations("megaMenu")

  const additionalMenuItems = [
    { name: t?.myAccount || "My Account", href: "/my-account" },
    { name: t?.exchangesReturns || "Exchanges & Returns", href: "/returns" },
    { name: t?.orderTracker || "Order Tracker", href: "/orders" },
    { name: t?.adiClub || "adiClub", href: "/adiclub" },
    { name: t?.giftCards || "Gift Cards", href: "/gift-cards" },
    { name: t?.storeLocator || "Store Locator", href: "/stores" },
    { name: t?.mobileApps || "Mobile Apps", href: "/mobile-apps" },
    {
      name: languageLabel,
      hasSubmenu: true,
      items: localeOptions,
      value: locale, // Add value property to match LocaleOption interface
    },
  ]

  // Helper push to history
  const pushToHistory = (level: MenuLevel) => {
    const scrollPosition =
      document.querySelector(".mobile-menu-content")?.scrollTop || 0
    setNavigationHistory((prev) => [...prev, { level, scrollPosition }])
  }

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const mediaQuery = window.matchMedia("(min-width: 768px)")
    const handleResize = () => mediaQuery.matches && onClose()
    mediaQuery.addEventListener("change", handleResize)
    return () => {
      document.body.style.overflow = prev
      mediaQuery.removeEventListener("change", handleResize)
    }
  }, [isOpen, onClose])

  // Init menu
  useEffect(() => {
    if (isOpen) {
      setCurrentLevel({ title: t?.menu || "MENU", items: buildMainCategories(t) })
      setNavigationHistory([])
      setActiveRootMenu(null)
    }
  }, [isOpen, t])

  const handleCategoryClick = (category: MenuCategory) => {
    const menuKey = getMenuKey(category, t)
    const menuData = menuKey ? mobileMainMenuData[menuKey] : undefined

    if ((menuData?.length ?? 0) > 0) {
      setActiveRootMenu(menuKey)
      pushToHistory(currentLevel)
      setCurrentLevel({
        title: category.title,
        items: menuData as MenuItem[],
        parentTitle: currentLevel.title,
      })
    } else if (category.titleHref) {
      onClose()
      window.location.href = category.titleHref
    }
  }

  const handleSubcategoryClick = (subcategory: MobileNavGroup | MenuCategory) => {
    if (subcategory.items?.length > 0) {
      pushToHistory(currentLevel)
      setCurrentLevel({
        title: subcategory.title,
        items: subcategory.items as MenuItem[],
        parentTitle: currentLevel.title,
      })
    } else if (subcategory.titleHref) {
      onClose()
      window.location.href = subcategory.titleHref
    }
  }

  const handleBackClick = () => {
    if (navigationHistory.length > 0) {
      const prev = navigationHistory[navigationHistory.length - 1]
      setCurrentLevel(prev.level)
      setNavigationHistory((h) => h.slice(0, -1))
      setTimeout(() => {
        const menuContent = document.querySelector(
          ".mobile-menu-content"
        ) as HTMLElement
        if (menuContent) menuContent.scrollTop = prev.scrollPosition
      }, 0)
    }
  }

  const handleClose = () => {
    setCurrentLevel({ title: t?.menu || "MENU", items: [] })
    setNavigationHistory([])
    setActiveRootMenu(null)
    onClose()
  }

  const isMainMenu = currentLevel.title === (t?.menu || "MENU")
  const showGenderPromo =
    !isMainMenu &&
    navigationHistory.length === 1 &&
    ["MEN", "WOMEN", "KIDS"].includes(activeRootMenu ?? "")
  const showFifaPromo =
    !isMainMenu &&
    navigationHistory.length === 1 &&
    activeRootMenu === "FIFA WORLD CUP 26™"
  if (!isOpen) return null

  const menu = (
    <>
      <div
        className="fixed inset-0 bg-black/50 md:hidden"
        style={{ zIndex: Z.mobileMenuBackdrop }}
        onClick={handleClose}
      />

      <div
        className="fixed inset-0 flex flex-col bg-white dark:bg-black md:hidden"
        style={{ zIndex: Z.mobileMenu }}
      >
        {/* Header sticky top */}
        <div
          className="h-10 flex items-center justify-between p-4 border-b border-gray-200 dark:border-white min-h-[60px]"
          onClick={() => {
            if (!isMainMenu) handleBackClick()
          }}
        >
          {navigationHistory.length > 0 ? (
            <div className="p-2 rounded-full -ml-2">
              <ChevronLeft className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-10" />
          )}

          <div
            className={cn(
              "flex-1 flex pointer-events-none",
              isMainMenu ? "justify-center" : "justify-start",
            )}
          >
            {isMainMenu ? (
              <Link
                href="/"
                aria-label={commonT?.home || "Home"}
                className="pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <AdidasLogo />
              </Link>
            ) : (
              <h2 className="pl-2 text-left text-lg font-bold uppercase">
                {currentLevel.title}
              </h2>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              handleClose()
            }}
            className="p-2 hover:bg-white dark:hover:bg-black rounded-full -mr-2 z-10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content scrollable */}
        <div className="flex-1 overflow-y-auto mobile-menu-content">
          {isMainMenu ? (
            <div>
              {/* Main Categories */}
              {buildMainCategories(t).map((cat) => (
                <button
                  key={cat.title}
                  onClick={() => handleCategoryClick(cat)}
                  className="w-full flex items-center justify-between py-4 pl-5 pr-4 hover:bg-white dark:hover:bg-black border-b border-white dark:border-black text-left"
                >
                  <span
                    className={cn(
                      "text-lg uppercase",
                      isBoldMainCategory(cat.title, t) ? "font-bold" : "font-medium"
                    )}
                  >
                    {cat.title}
                  </span>
                  <MobileMenuChevron />
                </button>
              ))}

              <div className="h-1 border-b border-gray-200 dark:border-white" />

              {/* Additional */}
              {additionalMenuItems.map((item) =>
                item.hasSubmenu ? (
                  null // Locale handled in footer
                  // <button
                  //   key={item.name}
                  //   onClick={() => {
                  //     pushToHistory(currentLevel)
                  //     setCurrentLevel({
                  //       title: item.name,
                  //       items: localeOptions.map((opt) => ({
                  //         title: opt.label,
                  //         value: opt.value,
                  //         flag: opt.flag,
                  //         items: [],
                  //       })),
                  //     })
                  //   }}
                  //   className="w-full text-left p-4 hover:bg-white dark:hover:bg-black border-b border-white dark:border-black flex items-center justify-between"
                  // >
                  //   <div className="flex items-center space-x-2">
                  //     <Image
                  //       src={
                  //         localeOptions.find((o) => o.value === locale)?.flag ||
                  //         "/flag/us-show.svg"
                  //       }
                  //       alt="flag"
                  //       width={24}
                  //       height={16}
                  //     />
                  //     <span className="text-base">
                  //       {capitalizeWordsCountry(item.name)}
                  //     </span>
                  //   </div>
                  //   <ChevronRight className="w-5 h-5 text-gray-400" />
                  // </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href || "#"}
                    onClick={handleClose}
                    className="block py-4 pl-5 pr-4 hover:bg-white dark:hover:bg-black border-b border-white dark:border-black"
                  >
                    <span className="text-base">{item.name}</span>
                  </Link>
                )
              )}
            </div>
          ) : (
            <div>
              {currentLevel.items.map((item, i) => {
                if (isLocaleMenuItem(item)) {
                  return null
                }

                if (isMobileNavGroup(item as MobileNavNode) || (isMenuCategory(item) && item.items?.length > 0)) {
                  const group = item as MobileNavGroup
                  return (
                    <button
                      key={i}
                      onClick={() => handleSubcategoryClick(group)}
                      className="w-full flex items-center justify-between py-4 pl-14 pr-4 hover:bg-white dark:hover:bg-black border-b border-white dark:border-black text-left"
                    >
                      <div className="flex items-center">
                        <span className="text-base mr-3">
                          {translateMegaLabel(megaMenuT, group.title, group.translationKey)}
                        </span>
                        {getColorSwatch(group.title, currentLevel.title)}
                      </div>
                      <MobileMenuChevron />
                    </button>
                  )
                }

                const href = isMenuLeaf(item)
                  ? item.href
                  : (item as MenuCategory).titleHref

                const leafName = isMenuLeaf(item) ? item.name : (item as MenuCategory).title
                const leafKey = isMenuLeaf(item) ? item.translationKey : (item as MobileNavGroup).translationKey

                return (
                  <Link
                    key={i}
                    href={href || "#"}
                    onClick={handleClose}
                    className="block py-4 pl-14 pr-4 hover:bg-white dark:hover:bg-black border-b border-white dark:border-black"
                  >
                    <div className="flex items-center">
                      <span className="text-base mr-3">
                        {translateMegaLabel(megaMenuT, leafName, leafKey)}
                      </span>
                      {getColorSwatch(leafName, currentLevel.title)}
                    </div>
                  </Link>
                )
              })}

              {showGenderPromo && (
                <MobileMenuSpotlight
                  href={getPrimePromoHref(activeRootMenu ?? "MEN")}
                  title={translateMegaLabel(megaMenuT, primeDeliveryPromo.title, primeDeliveryPromo.titleTranslationKey) ?? primeDeliveryPromo.title}
                  description={translateMegaLabel(megaMenuT, primeDeliveryPromo.description, primeDeliveryPromo.descriptionTranslationKey) ?? primeDeliveryPromo.description}
                  imageSrc={primeDeliveryPromo.imageSrc}
                  imageAlt="Prime delivery"
                  onClose={handleClose}
                />
              )}

              {showFifaPromo && (
                <MobileMenuSpotlight
                  href={fifaWorldCupPromo.href}
                  title={translateMegaLabel(megaMenuT, fifaWorldCupPromo.title, fifaWorldCupPromo.titleTranslationKey) ?? fifaWorldCupPromo.title}
                  description={translateMegaLabel(megaMenuT, fifaWorldCupPromo.description, fifaWorldCupPromo.descriptionTranslationKey) ?? fifaWorldCupPromo.description}
                  imageSrc={fifaWorldCupPromo.src}
                  imageAlt={fifaWorldCupPromo.alt}
                  imageAspect="3/4"
                  onClose={handleClose}
                />
              )}
            </div>
          )}
        </div>

        {/* Footer sticky (only level 1) */}
        {isMainMenu && (
        <div className="sticky bottom-0 bg-white dark:bg-black border-t border-gray-200 dark:border-white">
          <button
            onClick={() => setIsLocaleModalOpen(true)}
            className="w-full h-14 flex items-center justify-between pl-5 pr-4 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Image
                src={localeOptions.find(c => c.value === locale)?.flag || "/flag/us.svg"}
                alt={`${localeDisplayMap[locale]} Flag`}
                width={24}
                height={16}
              />
              <span className="font-medium">{localeDisplayMap[locale]}</span>
            </div>
          </button>

          <LocationModal
            isOpen={isLocaleModalOpen}
            onClose={() => setIsLocaleModalOpen(false)}
            onLocationSelect={selectLocation}
          />
        </div>
        )}
      </div>
    </>
  )

  return createPortal(menu, document.body)
}
