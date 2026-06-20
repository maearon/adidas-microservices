"use client"

import { backToSchoolMenuData, fifaWorldCupMenuColumns, fifaWorldCupPromo, kidsMenuData, menMenuData, saleMenuData, trendingMenuData, womenMenuData } from "@/data/mega-menu"
import { MenuCategory, Nullable } from "@/types/common"
import Link from "next/link"
import Image from "next/image"
import { useTranslations } from "@/hooks/useTranslations"

type MegaMenuProps = {
  activeMenu: Nullable<string>
  onClose: () => void
}

export default function MegaMenu({ activeMenu, onClose }: MegaMenuProps) {
  const t = useTranslations("megaMenu")
  
  const colorItems = [
    { slug: "black", name: t?.black || "Black", color: "bg-black" },
    { slug: "grey", name: t?.grey || "Grey", color: "bg-gray-500" },
    { slug: "white", name: t?.white || "White", color: "bg-white border border-gray-300" },
    { slug: "brown", name: t?.brown || "Brown", color: "bg-amber-800" },
    { slug: "red", name: t?.red || "Red", color: "bg-red-500" },
    { slug: "pink", name: t?.pink || "Pink", color: "bg-pink-300" },
    { slug: "orange", name: t?.orange || "Orange", color: "bg-orange-500" },
    { slug: "yellow", name: t?.yellow || "Yellow", color: "bg-yellow-400" },
    { slug: "green", name: t?.green || "Green", color: "bg-green-500" },
    { slug: "blue", name: t?.blue || "Blue", color: "bg-blue-500" },
    { slug: "purple", name: t?.purple || "Purple", color: "bg-purple-500" },
  ]

  const getShopByColorItems = (gender: string) => [
    ...colorItems.map((color) => ({
      name: color.name,
      href: `/${gender}-${color.slug}`,
    })),
    { 
      name: gender === 'men' ? (t?.allMensText || "All Men's") : 
            gender === 'women' ? (t?.allWomensText || "All Women's") : 
            (t?.allKidsText || "All Kids'"), 
      href: `/${gender}` 
    },
  ]

  if (!activeMenu) return null

  if (activeMenu === "FIFA WORLD CUP 26™") {
    return (
      <div
        className="absolute left-0 right-0 bg-white dark:bg-black text-foreground border-t border-gray-200 shadow-lg z-50"
        onMouseLeave={onClose}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-6 gap-8">
            <div className="col-span-5 grid grid-cols-5 gap-8">
              {fifaWorldCupMenuColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="space-y-4">
                  <h3 className="font-bold text-base">
                    {column.titleHref ? (
                      <Link onClick={onClose} href={column.titleHref} className="hover:underline">
                        {column.translationKey
                          ? (t?.[column.translationKey as keyof typeof t] || column.title)
                          : column.title}
                      </Link>
                    ) : (
                      column.translationKey
                        ? (t?.[column.translationKey as keyof typeof t] || column.title)
                        : column.title
                    )}
                  </h3>
                  {column.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="space-y-2">
                      {section.heading && (
                        section.headingHref ? (
                          <Link
                            onClick={onClose}
                            href={section.headingHref}
                            className="block font-bold text-base hover:underline"
                          >
                            {section.headingTranslationKey
                              ? (t?.[section.headingTranslationKey as keyof typeof t] || section.heading)
                              : section.heading}
                          </Link>
                        ) : (
                          <p className="font-bold text-base">
                            {section.headingTranslationKey
                              ? (t?.[section.headingTranslationKey as keyof typeof t] || section.heading)
                              : section.heading}
                          </p>
                        )
                      )}
                      {section.items.length > 0 && (
                        <ul className="space-y-2">
                          {section.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <Link onClick={onClose} href={item.href} className="text-base hover:underline">
                                {item.translationKey
                                  ? (t?.[item.translationKey as keyof typeof t] || item.name)
                                  : item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="col-span-1">
              <Link onClick={onClose} href={fifaWorldCupPromo.href} className="block">
                <Image
                  src={fifaWorldCupPromo.src}
                  alt={fifaWorldCupPromo.alt}
                  width={240}
                  height={320}
                  className="w-full h-auto"
                />
                <p className="mt-3 font-bold text-base uppercase">
                  {t?.[fifaWorldCupPromo.titleTranslationKey as keyof typeof t] || fifaWorldCupPromo.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t?.[fifaWorldCupPromo.descriptionTranslationKey as keyof typeof t] || fifaWorldCupPromo.description}
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
        { name: t?.sale || "Sale", href: "/men-sale" },
        { name: t?.allMensShoes || "All Men's Shoes", href: "/men-shoes" },
        { name: t?.allMensClothing || "All Men's Clothing", href: "/men-clothing" },
        { name: t?.allMensAccessories || "All Men's Accessories", href: "/men-accessories" },
        { name: t?.allMensSport || "All Men's Sport", href: "/men-sport" },
        { name: t?.allMens || "All Men's", href: "/men" },
      ]
      break
    case "WOMEN":
      menuData = womenMenuData
      footerLinks = [
        { name: t?.sale || "Sale", href: "/women-sale" },
        { name: t?.allWomensShoes || "All Women's Shoes", href: "/women-shoes" },
        { name: t?.allWomensClothing || "All Women's Clothing", href: "/women-clothing" },
        { name: t?.allWomensAccessories || "All Women's Accessories", href: "/women-accessories" },
        { name: t?.allWomensSport || "All Women's Sport", href: "/women-sport" },
        { name: t?.allWomens || "All Women's", href: "/women" },
      ]
      break
    case "BACK TO SCHOOL🔥":
      menuData = backToSchoolMenuData
      footerLinks = [
        { name: t?.allBackToSchool || "All Back to School", href: "/back_to_school" },
        { name: t?.allKids || "All Kids", href: "/kids-back_to_school" },
        { name: t?.allMens || "All Men's", href: "/men-back_to_school" },
        { name: t?.allWomens || "All Women's", href: "/women-back_to_school" },
        { name: t?.allSchoolAccessories || "All School Accessories", href: "/back_to_school" },
      ]
      break
    case "KIDS":
      menuData = kidsMenuData
      footerLinks = [
        { name: t?.sale || "Sale", href: "/kids-sale" },
        { name: t?.allKidsShoes || "All Kids Shoes", href: "/kids-shoes" },
        { name: t?.allKidsClothing || "All Kids Clothing", href: "/kids-clothing" },
        { name: t?.allKidsAccessories || "All Kids Accessories", href: "/kids-accessories" },
        { name: t?.allKidsSports || "All Kids Sports", href: "/kids-sports" },
        { name: t?.allKids || "All Kids", href: "/kids" },
      ]
      break
    case "SALE":
      menuData = saleMenuData
      footerLinks = [
        { name: t?.sale || "Sale", href: "/sale" },
        { name: t?.allMensSale || "All Men's Sale", href: "/sale/men" },
        { name: t?.allWomensSale || "All Women's Sale", href: "/sale/women" },
        { name: t?.allKidsSale || "All Kids Sale", href: "/sale/kids" },
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
      className="absolute left-0 right-0 bg-white dark:bg-black text-foreground border-t border-gray-200 shadow-lg z-50"
      onMouseLeave={onClose}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-6 gap-8">
          {/* Cột đầu tiên - NEW & TRENDING hoặc FEATURED */}
          {menuData[0] && (
            <div className="space-y-4 pr-6 border-r border-gray-200 col-span-1">
                              <h3 className="font-bold text-base">{t?.[menuData[0].title.toLowerCase().replace(/\s+/g, '') as keyof typeof t] || menuData[0].title}</h3>
                              <ul className="space-y-2">
                  {menuData[0].items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link onClick={onClose} href={item.href} className="text-base hover:underline">
                        {item.translationKey ? (t?.[item.translationKey as keyof typeof t] || item.name) : item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              {["MEN", "WOMEN", "KIDS"].includes(activeMenu) && menuData[0].title === "NEW & TRENDING" && (
                <Link
                  onClick={onClose}
                  href={`/${activeMenu.toLowerCase()}-prime`}
                  className="text-blue-600 underline font-semibold"
                >
                  <div className="mt-4">
                    <Image
                      src="/image/upload/f_auto,q_auto,fl_lossy/bwp_adidas_content_slot_navigation_d_dfbf3d31ce.png"
                      alt="Sale promotion"
                      width={150}
                      height={100}
                      className="w-full h-auto"
                    />
                  </div>
                  </Link>
              )}
              {/* {["MEN", "WOMEN", "KIDS"].includes(activeMenu) && ["CLOTHING", "SHOP BY AGE"].includes(menuData[0].title) && (
                {shopbycolor[0].items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link onClick={onClose} href={item.href} className="text-base hover:underline">
                      {item.name}
                    </Link>
                  </li>
                ))}
              )} */}
            </div>
          )}

          {/* Các cột còn lại */}
          <div className="col-span-5 grid grid-cols-5 gap-8">
            {menuData.slice(1).map((category, index) => (
              <div key={index} className="space-y-4">
                <h3 className="font-bold text-base">
                  {category.titleHref ? (
                    <Link onClick={onClose} href={category.titleHref} className="hover:underline">
                      {t?.[category.title.toLowerCase().replace(/\s+/g, '') as keyof typeof t] || category.title}
                    </Link>
                  ) : (
                    t?.[category.title.toLowerCase().replace(/\s+/g, '') as keyof typeof t] || category.title
                  )}
                </h3>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link onClick={onClose} href={item.href} className="text-base hover:underline">
                        {item.translationKey ? (t?.[item.translationKey as keyof typeof t] || item.name) : item.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Render Shop by Color ở cột có tiêu đề CLOTHING hoặc SHOP BY AGE */}
                {["CLOTHING", "SHOP BY AGE"].includes(category.title.toUpperCase()) &&
                  ["MEN", "WOMEN", "KIDS"].includes(activeMenu) && (
                    <div className="pt-4">
                      <h3 className="font-bold text-base mb-2">
                        <Link
                          onClick={onClose}
                          href={getShopByColorItems(activeMenu.toLowerCase())[0].href}
                          className="hover:underline"
                        >
                          {t?.shopByColor || "SHOP BY COLOR 🎨"}
                        </Link>
                      </h3>
                      {/* <h4 className="text-base font-semibold mb-2">Shop by Color 🎨</h4> */}
                      {/* <ul className="space-y-1">
                        {getShopByColorItems(activeMenu.toLowerCase()).map((colorItem, colorIndex) => (
                          <li key={colorIndex}>
                            <Link onClick={onClose} href={colorItem.href} className="text-base hover:underline">
                              {colorItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul> */}
                    </div>
                  )}
              </div>
            ))}

          </div>
        </div>

        {/* Footer links */}
        <div className="flex justify-start space-x-8 mt-12 border-t pt-4">
          {footerLinks.map((link, index) => (
            <Link
              onClick={onClose}
              key={index}
              href={link.href}
              className="text-base font-bold hover:underline"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
