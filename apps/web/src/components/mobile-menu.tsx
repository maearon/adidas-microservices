// Menu structure matching desktop mega menu import { mainMenuData, additionalMenuItems, colorMapping } from "@/lib/menu-utils" // bạn import từ nơi đã tách
"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import AdidasLogo from "./adidas-logo"
import type { LocaleMenuItem, MenuCategory, MenuItem, MenuLeaf, MenuLevel, NavigationHistory } from "@/types/common"
import { capitalizeWordsCountry } from "@/utils/upper-words"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { localeDisplayMap, localeOptions, SupportedLocale } from "@/lib/constants/localeOptions"
// import { usePathname, useRouter } from "next/navigation"
import { setLocale } from "@/store/localeSlice"
// import { useTranslations } from "@/hooks/useTranslations"
import { colorMapping, mainMenuData } from "@/lib/menu-utils"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

function isMenuCategory(item: MenuItem): item is MenuCategory {
  return "title" in item && "items" in item;
}

function isLocaleMenuItem(item: MenuItem): item is LocaleMenuItem {
  return "value" in item && "flag" in item;
}

function isMenuLeaf(item: MenuItem): item is MenuLeaf {
  return "name" in item && "href" in item;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [country, setCountry] = useState<"US" | "VN">("US") // mặc định là US
  // const pathname = usePathname()
  // const router = useRouter()
  const dispatch = useAppDispatch()
  const [currentLevel, setCurrentLevel] = useState<MenuLevel>({
    title: "MENU",
    items: [],
  })
  const [navigationHistory, setNavigationHistory] = useState<NavigationHistory[]>([])
  const locale = useAppSelector((state) => state.locale.locale) || "en_US" // Mặc định là US English  
  const languageLabel = localeDisplayMap[locale]
  // const t = useTranslations("header")

  const additionalMenuItems = [
    { name: "My Account", href: "/my-account" },
    { name: "Exchanges & Returns", href: "/returns" },
    { name: "Order Tracker", href: "/orders" },
    { name: "adiClub", href: "/adiclub" },
    { name: "Gift Cards", href: "/gift-cards" },
    { name: "Store Locator", href: "/stores" },
    { name: "Mobile Apps", href: "/mobile-apps" },
    {
      name: languageLabel,
      hasSubmenu: true,
      items: [
        { name: "English", value: "en_US", flag: "/flag/us-show.svg" },
        { name: "Tiếng Việt", value: "vi_VN", flag: "/flag/vn-show.svg" },
      ],
    },
  ]

  useEffect(() => {
    if (!isOpen) return

    const mediaQuery = window.matchMedia("(min-width: 768px)")

    const handleResize = () => {
      if (mediaQuery.matches) {
        onClose()
      }
    }

    mediaQuery.addEventListener("change", handleResize)

    return () => {
      mediaQuery.removeEventListener("change", handleResize)
    }
  }, [isOpen, onClose])

  // Initialize main menu
  useEffect(() => {
    if (isOpen) {
      const mainCategories: MenuCategory[] = Object.keys(mainMenuData).map((key) => ({
        title: key,
        titleHref:
          key === "BACK TO SCHOOL🔥"
            ? "/back_to_school"
            : key === "NEW & TRENDING"
              ? "/trending"
              : `/${key.toLowerCase()}`,
        items: [],
      }))

      setCurrentLevel({
        title: "MENU",
        items: mainCategories,
      })
      setNavigationHistory([])
    }
  }, [isOpen])

  const handleCategoryClick = (category: MenuCategory) => {
    const menuData = mainMenuData[category.title]

    if (menuData && menuData.length > 0) {
      // Save current scroll position
      const scrollPosition = document.querySelector(".mobile-menu-content")?.scrollTop || 0

      setNavigationHistory((prev) => [
        ...prev,
        {
          level: currentLevel,
          scrollPosition,
        },
      ])

      setCurrentLevel({
        title: category.title,
        items: menuData,
        parentTitle: currentLevel.title,
      })
    } else if (category.titleHref) {
      // Direct navigation for categories without submenus
      onClose()
      window.location.href = category.titleHref
    }
  }

  const handleSubcategoryClick = (subcategory: MenuCategory) => {
    if (subcategory.items && subcategory.items.length > 0) {
      // Save current scroll position
      const scrollPosition = document.querySelector(".mobile-menu-content")?.scrollTop || 0

      setNavigationHistory((prev) => [
        ...prev,
        {
          level: currentLevel,
          scrollPosition,
        },
      ])

      setCurrentLevel({
        title: subcategory.title,
        items: subcategory.items.map((item) => ({
          title: item.name,
          titleHref: item.href,
          items: [],
        })),
        parentTitle: currentLevel.title,
      })
    } else if (subcategory.titleHref) {
      // Direct navigation
      onClose()
      window.location.href = subcategory.titleHref
    }
  }

  // const handleItemClick = (item: { name: string; href: string }) => {
  //   onClose()
  //   window.location.href = item.href
  // }

  const handleBackClick = () => {
    console.log('country', country);
    if (navigationHistory.length > 0) {
      const previousLevel = navigationHistory[navigationHistory.length - 1]
      setCurrentLevel(previousLevel.level)
      setNavigationHistory((prev) => prev.slice(0, -1))

      // Restore scroll position
      setTimeout(() => {
        const menuContent = document.querySelector(".mobile-menu-content")
        if (menuContent) {
          menuContent.scrollTop = previousLevel.scrollPosition
        }
      }, 0)
    }
  }

  const handleClose = () => {
    setCurrentLevel({ title: "MENU", items: [] })
    setNavigationHistory([])
    onClose()
  }

  const getColorSwatch = (itemName: string, categoryTitle: string) => {
    if (categoryTitle.toLowerCase().includes("color")) {
      const colorName = itemName.toLowerCase()
      const colorClass = colorMapping[colorName]
      if (colorClass) {
        return <div className={cn("w-4 h-4 rounded-full mr-3", colorClass)} />
      }
    }
    return null
  }

  // const hasSubmenu = (category: MenuCategory) => {
  //   return category.items && category.items.length > 0
  // }

  const isMainMenu = currentLevel.title === "MENU"

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50" onClick={handleClose} />

      {/* Menu Panel */}
      <div className="fixed inset-0 bg-white dark:bg-black z-50 flex flex-col md:hidden">
        {/* Header */}
        <div
          className="h-10 flex items-center justify-between p-4 border-b border-gray-200 dark:border-white min-h-[60px]" // border-b for end of menu 0
          onClick={() => {
            if (!isMainMenu) handleBackClick()
          }}
        >
          {/* Back button (chỉ hiển thị nhưng không cần gán handler riêng nữa) */}
          {navigationHistory.length > 0 ? (
            <div className="p-2 rounded-full -ml-2">
              <ChevronLeft className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-10" />
          )}

          {/* Center: Logo nếu là main menu, Title nếu submenu */}
          <div className="flex-1 flex justify-center pointer-events-none">
            {isMainMenu ? (
              <Link
                href="/"
                aria-label="Home"
                className="pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <AdidasLogo />
              </Link>
            ) : (
              <h2 className="text-lg font-bold uppercase text-center">{currentLevel.title}</h2>
            )}
          </div>

          {/* Close button – KHÔNG để handler onClick ở div cha ảnh hưởng đến nút này */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleClose()
            }}
            className="p-2 hover:bg-gray-100 rounded-full -mr-2 z-10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto mobile-menu-content">
          {isMainMenu ? (
            // Main menu with categories and additional items
            <div>
              {/* Main Categories */}
              {Object.keys(mainMenuData).map((categoryName) => (
                <button
                  key={categoryName}
                  onClick={() =>
                    handleCategoryClick({
                      title: categoryName,
                      titleHref:
                        categoryName === "BACK TO SCHOOL🔥"
                          ? "/back_to_school"
                          : categoryName === "NEW & TRENDING"
                            ? "/trending"
                            : `/${categoryName.toLowerCase()}`,
                      items: [],
                    })
                  }
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-white dark:border-black text-left" // border-b for ?
                >
                  <span
                    className={cn(
                      "text-lg uppercase",
                      ["MEN", "WOMEN", "KIDS"].includes(categoryName) ? "font-bold" : "font-medium"
                    )}
                  >
                    {categoryName}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}

              {/* Divider */}
              <div className="h-1 border-b border-gray-200 dark:border-white" /> {/* Divider // border-b for end of menu 1 */}

              {/* Additional Menu Items */}
              {/* {additionalMenuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleClose}
                  className="block p-4 hover:bg-gray-50 border-b border-gray-100"
                >
                  <span className="text-base">{item.name}</span>
                </Link>
              ))} */}
              {additionalMenuItems.map((item) => {
                const countryData = localeOptions.find(opt => opt.value === locale)

                if (item.hasSubmenu) {
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        const scrollPosition = document.querySelector(".mobile-menu-content")?.scrollTop || 0;
                        setNavigationHistory((prev) => [
                          ...prev,
                          { level: currentLevel, scrollPosition },
                        ]);

                        setCurrentLevel({
                          title: item.name,
                          items: [], // Temporarily empty, will be filled below
                        });

                        setTimeout(() => {
                          // Inject radio options
                          setCurrentLevel({
                            title: item.name,
                            items: localeOptions.map(({ value, label, flag }) => ({
                              title: label,
                              value,
                              flag,
                              // onClick: () => {
                              //   localStorage.setItem("NEXT_LOCALE", value)
                              //   dispatch(setLocale(value as SupportedLocale))
                              // },
                              items: [],
                            })),
                          });
                        }, 0);
                      }}
                      className="w-full text-left p-4 hover:bg-gray-50 border-b border-white dark:border-black flex items-center justify-between" // border-b for end of all
                    >
                      <div className="flex items-center space-x-2">
                        <Image
                          src={
                            countryData?.flagShow ||
                            (locale === "en_US" ? "/flag/us-show.svg" : "/flag/vn-show.svg")
                          }
                          alt={
                            countryData?.label ||
                            capitalizeWordsCountry(locale === "en_US" ? "United States" : "Việt Nam")
                          }
                          width={24}
                          height={16}
                        />
                        <span className="text-base">{capitalizeWordsCountry(item.name)}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href || "#"}
                    onClick={handleClose}
                    className="block p-4 hover:bg-gray-50 border-b border-white dark:border-black" // border-b for menu 2
                  >
                    <span className="text-base">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ) : (
            // Submenu items
            <div>
              {currentLevel.items.map((item, index) => {
                let itemName: string
                let itemHref: string | undefined
                let itemValue: string | undefined
                let itemFlag: string | undefined

                if (isMenuCategory(item)) {
                  itemName = item.title
                  itemHref = item.titleHref
                  itemValue = undefined
                  itemFlag = undefined
                } else if (isLocaleMenuItem(item)) {
                  itemName = item.title
                  itemHref = "#" // logic locale
                  itemValue = item.value
                  itemFlag = item.flag
                } else if (isMenuLeaf(item)) {
                  itemName = item.name
                  itemHref = item.href
                  itemValue = undefined
                  itemFlag = undefined
                } else {
                  return null // an toàn cho TS
                }

                const isCategory = "items" in item && item.items && item.items.length > 0
                const isCountryMenu = localeOptions.some(opt => opt.label === currentLevel.title)
                const isSelected = itemValue === locale

                if (isCountryMenu) {
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (itemValue) {
                          // item.onClick?.()
                          dispatch(setLocale(itemValue as SupportedLocale));
                          document.cookie = `NEXT_LOCALE=${itemValue}; path=/; max-age=31536000`
                          localStorage.setItem("NEXT_LOCALE", itemValue)
                          setCountry(itemValue === "en_US" ? "US" : "VN") // Cập nhật country dựa trên locale
                          handleClose()
                        }
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-4 border-b border-white dark:border-black text-left", // border-b for language menu
                        isSelected ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {itemFlag && (
                          <Image src={itemFlag} alt={itemName} width={24} height={16} />
                        )}
                        <span className="text-base">{itemName}</span>
                      </div>
                      <div className="w-4 h-4 border-2 rounded-full flex items-center justify-center">
                        {isSelected && <div className="w-2 h-2 bg-black rounded-full" />}
                      </div>
                    </button>
                  )
                }

                // Default rendering for other items
                if (isCategory) {
                  // Category with submenu
                  return (
                    <button
                      key={index}
                      onClick={() => handleSubcategoryClick(item as MenuCategory)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-white dark:border-black text-left" // border-b for menu 1 - level 2
                    >
                      <div className="flex items-center">
                        {getColorSwatch(itemName, currentLevel.title)}
                        <span className="text-base">
                          {itemName}
                          {itemName.toLowerCase().includes("color") && " 🌸"}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  )
                } else {
                  // Direct link item
                  return (
                    <Link
                      key={index}
                      href={itemHref || "#"}
                      onClick={handleClose}
                      className="block p-4 hover:bg-gray-50 border-b border-white dark:border-black" // border-b for end of menu 1 - level 3
                    >
                      <div className="flex items-center">
                        {getColorSwatch(itemName, currentLevel.title)}
                        <span className="text-base">{itemName}</span>
                      </div>
                    </Link>
                  )
                }

              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
