"use client"

import { useState, useEffect } from "react"
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
import { colorMappingClass, colorMappingSymbol, mainMenuData } from "@/utils/menu-utils"
import { useTranslations } from "@/hooks/useTranslations"
import LocaleModal from "@/components/footer/LocaleModal"

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
      title: t?.backToSchool || "BACK TO SCHOOL🔥",
      titleHref: "/back_to_school",
      items: [],
    },
    {
      title: t?.sale || "SALE",
      titleHref: "/sale",
      items: [],
    },
    {
      title: t?.newTrending || "NEW & TRENDING",
      titleHref: "/trending",
      items: [],
    }
  ]
}

const USE_EMOJI_SWATCH = true // config

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
  const [currentLevel, setCurrentLevel] = useState<MenuLevel>({
    title: "MENU",
    items: [],
  })
  const [navigationHistory, setNavigationHistory] = useState<
    NavigationHistory[]
  >([])

  const dispatch = useAppDispatch()
  const locale = useAppSelector((s) => s.locale.locale) || "en_US"
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

  // Close on resize >= md
  useEffect(() => {
    if (!isOpen) return
    const mediaQuery = window.matchMedia("(min-width: 768px)")
    const handleResize = () => mediaQuery.matches && onClose()
    mediaQuery.addEventListener("change", handleResize)
    return () => mediaQuery.removeEventListener("change", handleResize)
  }, [isOpen, onClose])

  // Init menu
  useEffect(() => {
    if (isOpen) {
      setCurrentLevel({ title: t?.menu || "MENU", items: buildMainCategories(t) })
      setNavigationHistory([])
    }
  }, [isOpen, t])

  const handleCategoryClick = (category: MenuCategory) => {
    // Map category title to menu data key
    let menuKey = category.title
    if (category.title === (t?.men || "MEN")) menuKey = "MEN"
    else if (category.title === (t?.women || "WOMEN")) menuKey = "WOMEN"
    else if (category.title === (t?.kids || "KIDS")) menuKey = "KIDS"
    else if (category.title === (t?.backToSchool || "BACK TO SCHOOL🔥")) menuKey = "BACK TO SCHOOL🔥"
    else if (category.title === (t?.sale || "SALE")) menuKey = "SALE"
    else if (category.title === (t?.newTrending || "NEW & TRENDING")) menuKey = "NEW & TRENDING"
    
    const menuData = mainMenuData[menuKey]
    if (menuData?.length > 0) {
      pushToHistory(currentLevel)
      setCurrentLevel({
        title: category.title,
        items: menuData,
        parentTitle: currentLevel.title,
      })
    } else if (category.titleHref) {
      onClose()
      window.location.href = category.titleHref
    }
  }

  const handleSubcategoryClick = (subcategory: MenuCategory) => {
    if (subcategory.items?.length > 0) {
      pushToHistory(currentLevel)
      setCurrentLevel({
        title: subcategory.title,
        items: subcategory.items.map((i) => ({
          title: i.name,
          titleHref: i.href,
          items: [],
        })),
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
    onClose()
  }

  const isMainMenu = currentLevel.title === (t?.menu || "MENU")
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50"
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="fixed inset-0 bg-white dark:bg-black z-50 flex flex-col md:hidden">
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

          <div className="flex-1 flex justify-center pointer-events-none">
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
              <h2 className="text-lg font-bold uppercase text-center">
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
                  className="w-full flex items-center justify-between p-4 hover:bg-white dark:hover:bg-black border-b border-white dark:border-black text-left"
                >
                  <span
                    className={cn(
                      "text-lg uppercase",
                      [t?.men || "MEN", t?.women || "WOMEN", t?.kids || "KIDS"].includes(cat.title)
                        ? "font-bold"
                        : "font-medium"
                    )}
                  >
                    {cat.title}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}

              <div className="h-1 border-b border-gray-200 dark:border-white" />

              {/* Additional */}
              {additionalMenuItems.map((item) =>
                item.hasSubmenu ? (
                  null // Locale handled in footer
                ) : (
                  <Link
                    key={item.name}
                    href={item.href || "#"}
                    onClick={handleClose}
                    className="block p-4 hover:bg-white dark:hover:bg-black border-b border-white dark:border-black"
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

                if (isMenuCategory(item) && item.items?.length > 0) {
                  return (
                    <button
                      key={i}
                      onClick={() => handleSubcategoryClick(item)}
                      className="w-full flex items-center justify-between p-4 hover:bg-white dark:hover:bg-black border-b border-white dark:border-black text-left"
                    >
                      <div className="flex items-center">
                        <span className="text-base mr-3">
                          {megaMenuT?.[item.title.toLowerCase().replace(/\s+/g, '').replace(/&/g, '').replace(/🔥/g, '') as keyof typeof megaMenuT] || item.title}
                        </span>
                        {getColorSwatch(item.title, currentLevel.title)}
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  )
                }

                const href = isMenuLeaf(item)
                  ? item.href
                  : (item as MenuCategory).titleHref

                return (
                  <Link
                    key={i}
                    href={href || "#"}
                    onClick={handleClose}
                    className="block p-4 hover:bg-white dark:hover:bg-black border-b border-white dark:border-black"
                  >
                    <div className="flex items-center">           
                      <span className="text-base mr-3">
                        {isMenuLeaf(item) 
                          ? (item.translationKey ? (megaMenuT?.[item.translationKey as keyof typeof megaMenuT] || item.name) : item.name)
                          : (megaMenuT?.[item.title.toLowerCase().replace(/\s+/g, '').replace(/&/g, '').replace(/🔥/g, '') as keyof typeof megaMenuT] || item.title)
                        }
                      </span>
                      {getColorSwatch(
                        isMenuLeaf(item) ? item.name : item.title,
                        currentLevel.title
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer sticky (only level 1) */}
        {isMainMenu && (
        <div className="sticky bottom-0 bg-white dark:bg-black border-t border-gray-200 dark:border-white">
          <button
            onClick={() => setIsLocaleModalOpen(true)}
            className="w-full h-14 flex items-center justify-between px-4 cursor-pointer"
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

          <LocaleModal
            isOpen={isLocaleModalOpen}
            onClose={() => setIsLocaleModalOpen(false)}
          />
        </div>
        )}
      </div>
    </>
  )
}
