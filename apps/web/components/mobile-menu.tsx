// {
//         name: "Shop by Color",
//         icon: "🌸",
//         hasSubmenu: true,
//         submenu: {
//           title: "SHOP BY COLOR 🌸",
//           items: [
//             ...colorItems.map((color) => ({ name: color.name, href: `/men/color/${color.name.toLowerCase()}` })),
//             { name: "All Men's", href: "/men" },
//           ],
//         },
//       },

// const colorItems = [
//   { name: "Black", color: "bg-black" },
//   { name: "Grey", color: "bg-gray-500" },
//   { name: "White", color: "bg-white border border-gray-300" },
//   { name: "Brown", color: "bg-amber-800" },
//   { name: "Red", color: "bg-red-500" },
//   { name: "Pink", color: "bg-pink-300" },
//   { name: "Orange", color: "bg-orange-500" },
//   { name: "Yellow", color: "bg-yellow-400" },
//   { name: "Green", color: "bg-green-500" },
//   { name: "Blue", color: "bg-blue-500" },
//   { name: "Purple", color: "bg-purple-500" },
// ]

// Menu structure matching desktop mega menu
"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import AdidasLogo from "./adidas-logo"

// Import menu data
import { menMenuData } from "@/data/mega-menu/men-mega-menu-data"
import { womenMenuData } from "@/data/mega-menu/women-mega-menu-data"
import { kidsMenuData } from "@/data/mega-menu/kids.mega-menu-data"
import { backToSchoolMenuData } from "@/data/mega-menu/back-to-school-mega-menu-data"
import { trendingMenuData } from "@/data/mega-menu/trending-mega-menu-data"
import { saleMenuData } from "@/data/mega-menu/sale-mega-menu-data"
import type { MenuCategory } from "@/types/common"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

interface MenuLevel {
  title: string
  items: MenuCategory[]
  parentTitle?: string
}

interface NavigationHistory {
  level: MenuLevel
  scrollPosition: number
}

// Shop by Color data
const colorItems = [
  { name: "Black", color: "bg-black" },
  { name: "Grey", color: "bg-gray-500" },
  { name: "White", color: "bg-white border border-gray-300" },
  { name: "Brown", color: "bg-amber-800" },
  { name: "Red", color: "bg-red-500" },
  { name: "Pink", color: "bg-pink-300" },
  { name: "Orange", color: "bg-orange-500" },
  { name: "Yellow", color: "bg-yellow-400" },
  { name: "Green", color: "bg-green-500" },
  { name: "Blue", color: "bg-blue-500" },
  { name: "Purple", color: "bg-purple-500" },
]

// Mapping for color swatch
const colorMapping: Record<string, string> = Object.fromEntries(
  colorItems.map((color) => [color.name.toLowerCase(), color.color])
)

// Shop by Color menu
const getShopByColorMenu = (gender: string): MenuCategory => ({
  title: "Shop by Color",
  items: [
    ...colorItems.map((color) => ({
      name: color.name,
      href: `/${gender}-${color.name.toLowerCase()}`
    })),
    {
      name: `All ${gender.charAt(0).toUpperCase() + gender.slice(1)}'s`,
      href: `/${gender}`,
    },
  ],
})

// Insert Shop by Color after a specific section
const insertShopByColor = (menu: MenuCategory[], gender: string): MenuCategory[] => {
  const index = menu.findIndex((item) =>
    gender.toUpperCase() === "KIDS" ? item.title === "SHOP BY AGE" : item.title === "SHOP BY COLLECTION"
  )
  if (index === -1) return menu
  const newMenu = [...menu]
  newMenu.splice(index + 1, 0, getShopByColorMenu(gender))
  return newMenu
}

// Final menu with Shop by Color injected
const menMenuDataWithColor = insertShopByColor(menMenuData, "men")
const womenMenuDataWithColor = insertShopByColor(womenMenuData, "women")
const kidsMenuDataWithColor = insertShopByColor(kidsMenuData, "kids")

// Override main menu data
const mainMenuData: Record<string, MenuCategory[]> = {
  MEN: menMenuDataWithColor,
  WOMEN: womenMenuDataWithColor,
  KIDS: kidsMenuDataWithColor,
  "BACK TO SCHOOL": backToSchoolMenuData,
  "NEW & TRENDING": trendingMenuData,
  SALE: saleMenuData,
}

// Color mapping for "Shop by Color" sections
// const colorMapping: Record<string, string> = {
//   black: "bg-black",
//   grey: "bg-gray-500",
//   gray: "bg-gray-500",
//   white: "bg-white border border-gray-300",
//   brown: "bg-amber-800",
//   red: "bg-red-500",
//   pink: "bg-pink-300",
//   orange: "bg-orange-500",
//   yellow: "bg-yellow-400",
//   green: "bg-green-500",
//   blue: "bg-blue-500",
//   purple: "bg-purple-500",
// }

// Main menu structure
// const mainMenuData: Record<string, MenuCategory[]> = {
//   MEN: menMenuData,
//   WOMEN: womenMenuData,
//   KIDS: kidsMenuData,
//   "BACK TO SCHOOL": backToSchoolMenuData,
//   "NEW & TRENDING": trendingMenuData,
//   SALE: saleMenuData,
// }

// Additional menu items (non-category items)
const additionalMenuItems = [
  { name: "My Account", href: "/account" },
  { name: "Exchanges & Returns", href: "/returns" },
  { name: "Order Tracker", href: "/orders" },
  { name: "adiClub", href: "/adiclub" },
  { name: "Gift Cards", href: "/gift-cards" },
  { name: "Store Locator", href: "/stores" },
  { name: "Mobile Apps", href: "/mobile-apps" },
]

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [currentLevel, setCurrentLevel] = useState<MenuLevel>({
    title: "MENU",
    items: [],
  })
  const [navigationHistory, setNavigationHistory] = useState<NavigationHistory[]>([])

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
          key === "BACK TO SCHOOL"
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

  const handleItemClick = (item: { name: string; href: string }) => {
    onClose()
    window.location.href = item.href
  }

  const handleBackClick = () => {
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

  const hasSubmenu = (category: MenuCategory) => {
    return category.items && category.items.length > 0
  }

  const isMainMenu = currentLevel.title === "MENU"

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={handleClose} />

      {/* Menu Panel */}
      <div className="fixed inset-0 bg-white z-50 flex flex-col md:hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 min-h-[60px]">
          {navigationHistory.length > 0 && (
            <button onClick={handleBackClick} className="p-2 hover:bg-gray-100 rounded-full -ml-2">
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {isMainMenu ? (
            <Link href="/" className="flex-1 flex justify-center">
              <AdidasLogo />
            </Link>
          ) : (
            <h2 className="text-lg font-bold flex-1 text-center uppercase">{currentLevel.title}</h2>
          )}

          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full -mr-2">
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
                        categoryName === "BACK TO SCHOOL"
                          ? "/back_to_school"
                          : categoryName === "NEW & TRENDING"
                            ? "/trending"
                            : `/${categoryName.toLowerCase()}`,
                      items: [],
                    })
                  }
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 text-left"
                >
                  <span className="font-bold text-lg uppercase">{categoryName}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}

              {/* Divider */}
              <div className="h-2 bg-gray-50" />

              {/* Additional Menu Items */}
              {additionalMenuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleClose}
                  className="block p-4 hover:bg-gray-50 border-b border-gray-100"
                >
                  <span className="text-base">{item.name}</span>
                </Link>
              ))}

              {/* Country Selection */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <Image src="/flag/us-show.svg" alt="United States" width={24} height={16} />
                  <span className="text-base">United States</span>
                </div>
              </div>
            </div>
          ) : (
            // Submenu items
            <div>
              {currentLevel.items.map((item, index) => {
                const isCategory = "items" in item && item.items && item.items.length > 0
                const itemName = "title" in item ? item.title : item.name
                const itemHref = "titleHref" in item ? item.titleHref : item.href

                if (isCategory) {
                  // Category with submenu
                  return (
                    <button
                      key={index}
                      onClick={() => handleSubcategoryClick(item as MenuCategory)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 text-left"
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
                      className="block p-4 hover:bg-gray-50 border-b border-gray-100"
                    >
                      <div className="flex items-center">
                        {getColorSwatch(itemName, currentLevel.title)}
                        <span className="text-base">{itemName}</span>
                      </div>
                    </Link>
                  )
                }
              })}

              {/* Shop by Color - Conditional rendering */}
                {["MEN", "WOMEN", "KIDS"].includes(currentLevel.title) &&
                  currentLevel.items.length > 0 &&
                  ["CLOTHING", "SHOP BY AGE"].includes(currentLevel.items[0]?.title || "") && (
                    <div className="border-t border-gray-200 mt-4">
                      <div className="p-4 bg-gray-50">
                        <h3 className="font-semibold text-base mb-3 flex items-center">SHOP BY COLOR 🌸</h3>
                        <div className="space-y-2">
                          {shopByColorData[0].items.map((colorItem, itemIndex) => (
                            <Link
                              key={itemIndex}
                              href={colorItem.href.replace("/men/", `/${currentLevel.title.toLowerCase()}/`)}
                              onClick={handleClose}
                              className="flex items-center p-2 hover:bg-white rounded text-sm"
                            >
                              {getColorSwatch(colorItem.name, currentLevel.title)}
                              <span>{colorItem.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
