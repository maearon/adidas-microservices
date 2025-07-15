import { sanitizeMenuTitles } from "@/utils/sanitizeMenuTitleOnly"
import { menMenuData } from "@/data/mega-menu/men-mega-menu-data"
import { womenMenuData } from "@/data/mega-menu/women-mega-menu-data"
import { kidsMenuData } from "@/data/mega-menu/kids.mega-menu-data"
import { backToSchoolMenuData } from "@/data/mega-menu/back-to-school-mega-menu-data"
import { trendingMenuData } from "@/data/mega-menu/trending-mega-menu-data"
import { saleMenuData } from "@/data/mega-menu/sale-mega-menu-data"
import type { MenuCategory } from "@/types/common"

// Color items & mapping
export const colorItems = [
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

export const colorMapping: Record<string, string> = Object.fromEntries(
  colorItems.map((c) => [c.name.toLowerCase(), c.color])
)

const getShopByColorMenu = (gender: string): MenuCategory => ({
  title: "Shop by Color",
  items: [
    ...colorItems.map((color) => ({
      name: color.name,
      href: `/${gender}-${color.name.toLowerCase()}`,
    })),
    {
      name: `All ${gender.charAt(0).toUpperCase() + gender.slice(1)}'s`,
      href: `/${gender}`,
    },
  ],
})

const insertShopByColor = (menu: MenuCategory[], gender: string): MenuCategory[] => {
  const index = menu.findIndex((item) =>
    gender.toUpperCase() === "KIDS" ? item.title === "SHOP BY AGE" : item.title === "SHOP BY COLLECTION"
  )
  const newMenu = [...menu]
  if (index !== -1) {
    newMenu.splice(index + 1, 0, getShopByColorMenu(gender))
  }

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
    newMenu.push(commonSale, {
      title: "Fast, free delivery with Prime",
      titleHref: `/prime`,
      items: [],
    })
  } else {
    newMenu.push(commonSale, {
      title: "All Kids",
      titleHref: "/kids?grid=true",
      items: [],
    })
  }

  return newMenu
}

export const menMenuDataWithColor = sanitizeMenuTitles(insertShopByColor(menMenuData, "men"))
export const womenMenuDataWithColor = sanitizeMenuTitles(insertShopByColor(womenMenuData, "women"))
export const kidsMenuDataWithColor = sanitizeMenuTitles(insertShopByColor(kidsMenuData, "kids"))

export const mainMenuData: Record<string, MenuCategory[]> = {
  MEN: menMenuDataWithColor,
  WOMEN: womenMenuDataWithColor,
  KIDS: kidsMenuDataWithColor,
  "BACK TO SCHOOL": sanitizeMenuTitles(backToSchoolMenuData),
  "NEW & TRENDING": sanitizeMenuTitles(trendingMenuData),
  SALE: sanitizeMenuTitles(saleMenuData),
}

export const additionalMenuItems = [
  { name: "My Account", href: "/my-account" },
  { name: "Exchanges & Returns", href: "/returns" },
  { name: "Order Tracker", href: "/orders" },
  { name: "adiClub", href: "/adiclub" },
  { name: "Gift Cards", href: "/gift-cards" },
  { name: "Store Locator", href: "/stores" },
  { name: "Mobile Apps", href: "/mobile-apps" },
]
