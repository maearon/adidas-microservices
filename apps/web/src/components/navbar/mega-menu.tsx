"use client"

import {
  backToSchoolMenuData,
  categoriesToMegaMenuColumns,
  fifaWorldCupMenuColumns,
  fifaWorldCupPromo,
  kidsMenuColumns,
  menMenuColumns,
  saleMenuData,
  trendingMenuData,
  womenMenuColumns,
} from "@/data/mega-menu"
import type { MegaMenuColumn, MegaMenuPromo, MegaMenuSection, Nullable } from "@/types/common"
import Link from "next/link"
import Image from "next/image"
import { useTranslations } from "@/hooks/useTranslations"

type MegaMenuProps = {
  activeMenu: Nullable<string>
  onClose: () => void
}

type FooterLink = { name: string; href: string }

type MegaMenuPanelConfig = {
  columns: MegaMenuColumn[]
  footerLinks: FooterLink[]
  gender?: "men" | "women" | "kids"
  sidePromo?: MegaMenuPromo
}

const PRIME_BANNER_SRC =
  "/image/upload/f_auto,q_auto,fl_lossy/bwp_adidas_content_slot_navigation_d_dfbf3d31ce.png"

function translateSectionHeading(
  t: ReturnType<typeof useTranslations>,
  section: MegaMenuSection,
) {
  if (section.headingTranslationKey) {
    return t?.[section.headingTranslationKey as keyof typeof t] || section.heading
  }
  const normalized = section.heading?.toLowerCase().replace(/\s+/g, "").replace(/&/g, "")
  return (normalized ? t?.[normalized as keyof typeof t] : undefined) || section.heading
}

function translateColumnTitle(
  t: ReturnType<typeof useTranslations>,
  column: MegaMenuColumn,
) {
  if (column.translationKey) {
    return t?.[column.translationKey as keyof typeof t] || column.title
  }
  const normalized = column.title?.toLowerCase().replace(/\s+/g, "").replace(/&/g, "")
  return (normalized ? t?.[normalized as keyof typeof t] : undefined) || column.title
}

function MegaMenuSectionBlock({
  section,
  onClose,
  t,
}: {
  section: MegaMenuSection
  onClose: () => void
  t: ReturnType<typeof useTranslations>
}) {
  return (
    <div className="space-y-2">
      {section.heading &&
        (section.headingHref ? (
          <Link
            onClick={onClose}
            href={section.headingHref}
            className="block text-base font-bold hover:underline"
          >
            {translateSectionHeading(t, section)}
          </Link>
        ) : (
          <p className="text-base font-bold">{translateSectionHeading(t, section)}</p>
        ))}
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
  )
}

function MegaMenuColumnBlock({
  column,
  gender,
  onClose,
  t,
}: {
  column: MegaMenuColumn
  gender?: "men" | "women" | "kids"
  onClose: () => void
  t: ReturnType<typeof useTranslations>
}) {
  return (
    <div className="space-y-4">
      {column.title && (
        <h3 className="text-base font-bold">
          {column.titleHref ? (
            <Link onClick={onClose} href={column.titleHref} className="hover:underline">
              {translateColumnTitle(t, column)}
            </Link>
          ) : (
            translateColumnTitle(t, column)
          )}
        </h3>
      )}

      {column.sections.map((section, sectionIndex) => (
        <MegaMenuSectionBlock key={sectionIndex} section={section} onClose={onClose} t={t} />
      ))}

      {column.showShopByColor && gender && (
        <div className="pt-4">
          <h3 className="mb-2 text-base font-bold">
            <Link onClick={onClose} href={`/${gender}-black`} className="hover:underline">
              {t?.shopByColor || "SHOP BY COLOR 🎨"}
            </Link>
          </h3>
        </div>
      )}

      {column.showPrimeBanner && gender && (
        <Link
          onClick={onClose}
          href={`/${gender}-prime_delivery`}
          className="font-semibold text-blue-600 underline"
        >
          <div className="mt-4">
            <Image
              src={PRIME_BANNER_SRC}
              alt="Prime delivery"
              width={150}
              height={100}
              className="h-auto w-full"
            />
          </div>
        </Link>
      )}
    </div>
  )
}

function MegaMenuSidePromo({
  promo,
  onClose,
  t,
}: {
  promo: MegaMenuPromo
  onClose: () => void
  t: ReturnType<typeof useTranslations>
}) {
  return (
    <Link
      onClick={onClose}
      href={promo.href}
      className="group block border border-gray-300 transition-colors hover:border-black dark:border-gray-600 dark:hover:border-white"
    >
      <Image src={promo.src} alt={promo.alt} width={240} height={320} className="h-auto w-full" />
      {(promo.title || promo.description) && (
        <div className="border-t border-gray-300 p-3 transition-colors group-hover:border-black dark:border-gray-600 dark:group-hover:border-white">
          {promo.title && (
            <p className="text-base font-bold uppercase">
              {promo.titleTranslationKey
                ? (t?.[promo.titleTranslationKey as keyof typeof t] || promo.title)
                : promo.title}
            </p>
          )}
          {promo.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {promo.descriptionTranslationKey
                ? (t?.[promo.descriptionTranslationKey as keyof typeof t] || promo.description)
                : promo.description}
            </p>
          )}
        </div>
      )}
    </Link>
  )
}

function MegaMenuPanel({
  config,
  onClose,
  t,
}: {
  config: MegaMenuPanelConfig
  onClose: () => void
  t: ReturnType<typeof useTranslations>
}) {
  const { columns, footerLinks, gender, sidePromo } = config

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-6 gap-8">
        {columns.map((column, columnIndex) => (
          <MegaMenuColumnBlock
            key={columnIndex}
            column={column}
            gender={gender}
            onClose={onClose}
            t={t}
          />
        ))}
        {sidePromo && <MegaMenuSidePromo promo={sidePromo} onClose={onClose} t={t} />}
      </div>

      {footerLinks.length > 0 && (
        <div className="mt-12 flex justify-start space-x-8 border-t pt-4">
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
      )}
    </div>
  )
}

export default function MegaMenu({ activeMenu, onClose }: MegaMenuProps) {
  const t = useTranslations("megaMenu")

  if (!activeMenu) return null

  let config: MegaMenuPanelConfig | null = null

  switch (activeMenu) {
    case "MEN":
      config = {
        gender: "men",
        columns: menMenuColumns,
        footerLinks: [
          { name: t?.sale || "Sale", href: "/men-sale" },
          { name: t?.allMensShoes || "All Men's Shoes", href: "/men-shoes" },
          { name: t?.allMensClothing || "All Men's Clothing", href: "/men-clothing" },
          { name: t?.allMensAccessories || "All Men's Accessories", href: "/men-accessories" },
          { name: t?.allMensSport || "All Men's Sport", href: "/men-sport" },
          { name: t?.allMens || "All Men's", href: "/men" },
        ],
      }
      break
    case "WOMEN":
      config = {
        gender: "women",
        columns: womenMenuColumns,
        footerLinks: [
          { name: t?.sale || "Sale", href: "/women-sale" },
          { name: t?.allWomensShoes || "All Women's Shoes", href: "/women-shoes" },
          { name: t?.allWomensClothing || "All Women's Clothing", href: "/women-clothing" },
          { name: t?.allWomensAccessories || "All Women's Accessories", href: "/women-accessories" },
          { name: t?.allWomensSport || "All Women's Sport", href: "/women-sport" },
          { name: t?.allWomens || "All Women's", href: "/women" },
        ],
      }
      break
    case "KIDS":
      config = {
        gender: "kids",
        columns: kidsMenuColumns,
        footerLinks: [
          { name: t?.sale || "Sale", href: "/kids-sale" },
          { name: t?.allKidsShoes || "All Kids Shoes", href: "/kids-shoes" },
          { name: t?.allKidsClothing || "All Kids Clothing", href: "/kids-clothing" },
          { name: t?.allKidsAccessories || "All Kids Accessories", href: "/kids-accessories" },
          { name: t?.allKidsSports || "All Kids Sports", href: "/kids-sports" },
          { name: t?.allKids || "All Kids", href: "/kids" },
        ],
      }
      break
    case "FIFA WORLD CUP 26™":
      config = {
        columns: fifaWorldCupMenuColumns,
        sidePromo: fifaWorldCupPromo,
        footerLinks: [],
      }
      break
    case "BACK TO SCHOOL🔥":
      config = {
        columns: categoriesToMegaMenuColumns(backToSchoolMenuData),
        footerLinks: [
          { name: t?.allBackToSchool || "All Back to School", href: "/back_to_school" },
          { name: t?.allKids || "All Kids", href: "/kids" },
          { name: t?.allMens || "All Men's", href: "/men-back_to_school" },
          { name: t?.allWomens || "All Women's", href: "/women-back_to_school" },
          { name: t?.allSchoolAccessories || "All School Accessories", href: "/back_to_school" },
        ],
      }
      break
    case "SALE":
      config = {
        columns: categoriesToMegaMenuColumns(saleMenuData),
        footerLinks: [
          { name: t?.sale || "Sale", href: "/sale" },
          { name: t?.allMensSale || "All Men's Sale", href: "/sale/men" },
          { name: t?.allWomensSale || "All Women's Sale", href: "/sale/women" },
          { name: t?.allKidsSale || "All Kids Sale", href: "/sale/kids" },
        ],
      }
      break
    case "NEW & TRENDING":
      config = {
        columns: categoriesToMegaMenuColumns(trendingMenuData),
        footerLinks: [],
      }
      break
    default:
      return null
  }

  return (
    <div
      className="absolute left-0 right-0 z-50 border-t border-gray-200 bg-white text-foreground shadow-lg dark:border-gray-700 dark:bg-black"
      onMouseLeave={onClose}
    >
      <MegaMenuPanel config={config} onClose={onClose} t={t} />
    </div>
  )
}
