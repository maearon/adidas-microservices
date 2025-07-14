"use client"

import { backToSchoolMenuData, kidsMenuData, menMenuData, saleMenuData, trendingMenuData, womenMenuData } from "@/data/mega-menu"
import { MenuCategory, Nullable } from "@/types/common"
import Link from "next/link"
import Image from "next/image";

type MegaMenuProps = {
  activeMenu: Nullable<string>
  onClose: () => void
}

export default function MegaMenu({ activeMenu, onClose }: MegaMenuProps) {
  if (!activeMenu) return null

  // Tất cả dữ liệu MEN, WOMEN, KIDS, SALE, TRENDING... bạn đã cung cấp sẽ nằm ở đây
  // -- omitted for brevity --
  // const menMenuData = [...];
  // const womenMenuData = [...];
  // const kidsMenuData = [...];
  // const saleMenuData = [...];
  // const trendingMenuData = [...];

  let menuData: MenuCategory[] = []
  let footerLinks: { name: string; href: string }[] = []

  switch (activeMenu) {
    case "MEN":
      menuData = menMenuData
      footerLinks = [
        { name: "Sale", href: "/men-sale" },
        { name: "All Men's Shoes", href: "/men-shoes" },
        { name: "All Men's Clothing", href: "/men-clothing" },
        { name: "All Men's Accessories", href: "/men-accessories" },
        { name: "All Men's Sport", href: "/men-sport" },
        { name: "All Men's", href: "/men" },
      ]
      break
    case "WOMEN":
      menuData = womenMenuData
      footerLinks = [
        { name: "Sale", href: "/women-sale" },
        { name: "All Women's Shoes", href: "/women-shoes" },
        { name: "All Women's Clothing", href: "/women-clothing" },
        { name: "All Women's Accessories", href: "/women-accessories" },
        { name: "All Women's Sport", href: "/women-sport" },
        { name: "All Women's", href: "/women" },
      ]
      break
    case "BACK TO SCHOOL":
      menuData = backToSchoolMenuData
      footerLinks = [
        { name: "All Back to School", href: "/back_to_school" },
        { name: "All Kids", href: "/kids-back_to_school" },
        { name: "All Men's", href: "/men-back_to_school" },
        { name: "All Women's", href: "/women-back_to_school" },
        { name: "All School Accessories", href: "/back_to_school-accessories" },
      ]
      break
    case "KIDS":
      menuData = kidsMenuData
      footerLinks = [
        { name: "Sale", href: "/kids-sale" },
        { name: "All Kids Shoes", href: "/kids-shoes" },
        { name: "All Kids Clothing", href: "/kids-clothing" },
        { name: "All Kids Accessories", href: "/kids-accessories" },
        { name: "All Kids Sports", href: "/kids-sports" },
        { name: "All Kids", href: "/kids" },
      ]
      break
    case "SALE":
      menuData = saleMenuData
      footerLinks = [
        { name: "Sale", href: "/sale" },
        { name: "All Men's Sale", href: "/sale/men" },
        { name: "All Women's Sale", href: "/sale/women" },
        { name: "All Kids Sale", href: "/sale/kids" },
      ]
      break
    case "NEW & TRENDING":
      menuData = trendingMenuData
      footerLinks = []
      break
    default:
      return null
  }

  return (
    <div
      className="absolute left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
      onMouseLeave={onClose}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-6 gap-8">
          {/* Cột đầu tiên - NEW & TRENDING hoặc FEATURED */}
          {menuData[0] && (
            <div className="space-y-4 pr-6 border-r border-gray-200 col-span-1">
              <h3 className="font-bold text-sm">{menuData[0].title}</h3>
              <ul className="space-y-2">
                {menuData[0].items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link href={item.href} className="text-sm hover:underline">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              {["MEN", "WOMEN", "KIDS"].includes(activeMenu) && menuData[0].title === "NEW & TRENDING" && (
                <Link
                  href={`/${activeMenu.toLowerCase()}-superstar`}
                  className="text-blue-600 underline font-semibold"
                >
                  <div className="mt-4">
                    <Image
                      src="/assets/nav/originals_fw25_superstar_topnav_launch_d_331db9ccb5.jpg"
                      alt="Sale promotion"
                      width={150}
                      height={100}
                      className="w-full h-auto"
                    />
                  </div>
                  </Link>
              )}
            </div>
          )}

          {/* Các cột còn lại */}
          <div className="col-span-5 grid grid-cols-5 gap-8">
            {menuData.slice(1).map((category, index) => (
              <div key={index} className="space-y-4">
                <h3 className="font-bold text-sm">
                  {category.titleHref ? (
                    <Link href={category.titleHref} className="hover:underline">
                      {category.title}
                    </Link>
                  ) : (
                    category.title
                  )}
                </h3>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link href={item.href} className="text-sm hover:underline">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer links */}
        <div className="flex justify-start space-x-8 mt-12 border-t pt-4">
          {footerLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-sm font-medium hover:underline"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
