import type { MegaMenuColumn, MegaMenuSection, MenuCategory } from "@/types/common"

export function getCategoryByTitle(data: MenuCategory[], title: string): MenuCategory {
  const found = data.find((c) => c.title === title)
  if (!found) throw new Error(`Mega menu category not found: ${title}`)
  return found
}

export function sectionFromCategory(category: MenuCategory): MegaMenuSection {
  return {
    heading: category.title,
    headingHref: category.titleHref,
    headingTranslationKey: category.translationKey,
    items: category.items,
  }
}

/** Flat list for mobile menu, menu-utils, category-config */
export function flattenMegaMenuColumns(columns: MegaMenuColumn[]): MenuCategory[] {
  return columns.flatMap((column) => {
    if (column.title) {
      return [{
        title: column.title,
        titleHref: column.titleHref,
        translationKey: column.translationKey,
        items: column.sections.flatMap((section) => section.items),
      }]
    }

    return column.sections.map((section) => ({
      title: section.heading ?? "",
      titleHref: section.headingHref,
      translationKey: section.headingTranslationKey,
      items: section.items,
    }))
  })
}

type ColumnGroup = {
  titles: string[]
  showPrimeBanner?: boolean
  showShopByColor?: boolean
}

/** Stack sections into equal-width grid columns (KIDS, custom layouts) */
export function buildStackedMegaMenuColumns(
  data: MenuCategory[],
  groups: ColumnGroup[],
): MegaMenuColumn[] {
  const section = (title: string) => sectionFromCategory(getCategoryByTitle(data, title))

  return groups.map((group) => ({
    sections: group.titles.map(section),
    showPrimeBanner: group.showPrimeBanner,
    showShopByColor: group.showShopByColor,
  }))
}

/** One category → one column (MEN/WOMEN default, SALE, TRENDING) */
export function categoriesToMegaMenuColumns(
  categories: MenuCategory[],
  options?: { shopByColorAfterHeading?: string; primeOnFirst?: boolean },
): MegaMenuColumn[] {
  return categories.map((category, index) => ({
    sections: [sectionFromCategory(category)],
    showPrimeBanner: options?.primeOnFirst && index === 0,
    showShopByColor: options?.shopByColorAfterHeading === category.title,
  }))
}

/** MEN / WOMEN — 6 equal columns, adidas.com layout */
export function buildGenderMegaMenuColumns(
  categories: MenuCategory[],
  options?: { shopByColorAfterHeading?: string },
): MegaMenuColumn[] {
  return categoriesToMegaMenuColumns(categories, {
    primeOnFirst: true,
    shopByColorAfterHeading: options?.shopByColorAfterHeading,
  })
}

/** KIDS — adidas.com/us: 6 equal columns with stacked sections */
export function buildKidsMegaMenuColumns(data: MenuCategory[]): MegaMenuColumn[] {
  return buildStackedMegaMenuColumns(data, [
    { titles: ["NEW & TRENDING"], showPrimeBanner: true },
    { titles: ["BOYS SHOES", "BOYS CLOTHING"] },
    { titles: ["GIRLS SHOES", "GIRLS CLOTHING"] },
    { titles: ["BABIES & TODDLERS", "SHOP BY AGE"], showShopByColor: true },
    { titles: ["ACCESSORIES"] },
    { titles: ["SPORTS"] },
  ])
}
