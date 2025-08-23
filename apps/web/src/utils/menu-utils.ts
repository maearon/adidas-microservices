import { sanitizeMenuTitles } from "@/utils/sanitizeMenuTitleOnly"
import { menMenuData } from "@/data/mega-menu/men-mega-menu-data"
import { womenMenuData } from "@/data/mega-menu/women-mega-menu-data"
import { kidsMenuData } from "@/data/mega-menu/kids.mega-menu-data"
import { backToSchoolMenuData } from "@/data/mega-menu/back-to-school-mega-menu-data"
import { trendingMenuData } from "@/data/mega-menu/trending-mega-menu-data"
import { saleMenuData } from "@/data/mega-menu/sale-mega-menu-data"
import type { MenuCategory } from "@/types/common"
import { capitalizeWords } from "@/utils/upper-words"
import { localeOptions } from "@/lib/constants/localeOptions"
import { symbol } from "zod"

//
// COLOR ITEMS & MAPPING
//
// Shop by Color data
export const colorItems = [
  { name: "Black", color: "bg-black", symbol: "⚫" },
  { name: "Grey", color: "bg-gray-500", symbol: "🔘" },
  { name: "White", color: "bg-white border border-gray-300", symbol: "⚪" },
  { name: "Brown", color: "bg-amber-800", symbol: "🟤" },
  { name: "Red", color: "bg-red-500", symbol: "🔴" },
  { name: "Pink", color: "bg-pink-300", symbol: "⭕" },
  { name: "Orange", color: "bg-orange-500", symbol: "🟠" },
  { name: "Yellow", color: "bg-yellow-400", symbol: "🟡" },
  { name: "Green", color: "bg-green-500", symbol: "🟢" },
  { name: "Blue", color: "bg-blue-500", symbol: "🔵" },
  { name: "Purple", color: "bg-purple-500", symbol: "🟣" },
]


// Mapping for color swatch
export const colorMappingClass: Record<string, string> = Object.fromEntries(
  colorItems.map((color) => [color.name.toLowerCase(), color.color])
)
export const colorMappingSymbol: Record<string, string> = Object.fromEntries(
  colorItems.map((color) => [color.name.toLowerCase(), color.symbol])
)

//
// SHOP BY COLOR
//
// Shop by Color menu
export const getShopByColorMenu = (gender: string): MenuCategory => ({
  title: "Shop by Color 🎨",
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
export const insertShopByColor = (menu: MenuCategory[], gender: string): MenuCategory[] => {
  const index = menu.findIndex((item) =>
    gender.toUpperCase() === "KIDS" ? item.title === "SHOP BY AGE" : item.title === "SHOP BY COLLECTION"
  )
  const newMenu = [...menu]

  // Chèn "Shop by Color" Chỉ khi tìm thấy (index !== -1), ta mới chèn mục "Shop by Color" vào ngay sau mục "SHOP BY AGE" hoặc "SHOP BY COLLECTION".
  if (index !== -1) {
    newMenu.splice(index + 1, 0, getShopByColorMenu(gender))
  }

  // Các mục cần thêm ở cuối menu
  const commonSale = {
    title: "Sale",
    items: [
      { name: "Shoes", href: `/${gender}-shoes-sale` },
      { name: "Clothing", href: `/${gender}-clothing-sale` },
      { name: "Accessories", href: `/${gender}-accessories-sale` },
      { name: "Final Sale", href: `/${gender}-final-sale` },
      { name: "All Sale", href: `/${gender}-sale` },
    ],
  }

  if (gender === "men" || gender === "women") {
    newMenu.push(
      commonSale,
      {
        title: `All ${capitalizeWords(gender)}`,
        titleHref: `/${gender}?grid=true`,
        items: [],
      },
      {
        title: "Fast, free delivery with Prime",
        titleHref: `/prime`,
        items: [],
      }
    )
  } else if (gender === "kids") {
    newMenu.push(
      commonSale,
      {
        title: "All Kids",
        titleHref: "/kids?grid=true",
        items: [],
      }
    )
  }

  return newMenu
}

//
// FINAL SANITIZED MENUS
//
// Final menu with Shop by Color injected
export const menMenuDataWithColor = sanitizeMenuTitles(insertShopByColor(menMenuData, "men"))
export const womenMenuDataWithColor = sanitizeMenuTitles(insertShopByColor(womenMenuData, "women"))
export const kidsMenuDataWithColor = sanitizeMenuTitles(insertShopByColor(kidsMenuData, "kids"))

// Override main menu data
export const mainMenuData: Record<string, MenuCategory[]> = {
  MEN: menMenuDataWithColor,
  WOMEN: womenMenuDataWithColor,
  KIDS: kidsMenuDataWithColor,
  "BACK TO SCHOOL🔥": sanitizeMenuTitles(backToSchoolMenuData),
  "NEW & TRENDING": sanitizeMenuTitles(trendingMenuData),
  SALE: sanitizeMenuTitles(saleMenuData),
}

//
// FOOTER MENU ITEMS
//
export const additionalMenuItems = [
  { name: "My Account", href: "/my-account" },
  { name: "Exchanges & Returns", href: "/returns" },
  { name: "Order Tracker", href: "/orders" },
  { name: "adiClub", href: "/adiclub" },
  { name: "Gift Cards", href: "/gift-cards" },
  { name: "Store Locator", href: "/stores" },
  { name: "Mobile Apps", href: "/mobile-apps" },
  {
    name: "Languages", // localeDisplayMap["en_US"],
    hasSubmenu: true,
    items: localeOptions,
  },
]

// function withColorEmoji(label: string) {
//   return label.toLowerCase().includes("shop by color") ? `${label} 🎨` : label
// }
