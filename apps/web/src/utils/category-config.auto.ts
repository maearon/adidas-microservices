import {
  menMenuData,
  womenMenuData,
  kidsMenuData,
  backToSchoolMenuData,
  trendingMenuData,
  saleMenuData,
} from "@/data/mega-menu"
import { MenuCategory } from "@/types/common"

export interface CategoryTab {
  name: string
  slug: string
  href: string
}

export interface CategoryConfig {
  title: string
  breadcrumb: string
  href: string
  tabs: CategoryTab[]
  description?: string
}

const categoryConfigs: Record<string, CategoryConfig> = {}

/**
 * Normalize text into slug-friendly format
 */
export function toSlug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/**
 * Capitalize the first character
 */
function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

/**
 * Default description fallback
 */
function defaultDescription(title: string): string {
  return `Discover our latest ${title.toLowerCase()}.`
}

/**
 * Build configs from a mega menu group
 */
function buildConfigsFromMenu(menu: MenuCategory[]) {
  for (const category of menu) {
    if (!category.titleHref) continue

    const categorySlug = category.titleHref.replace(/^\/+/, "")
    const categoryHref = `/${categorySlug}`

    const tabs: CategoryTab[] = category.items.map((item) => {
      const tabSlug = item.href.replace(/^\/+/, "")
      return {
        name: item.name,
        slug: tabSlug,
        href: `/${tabSlug}`,
      }
    })

    categoryConfigs[categorySlug] = {
      title: category.title,
      breadcrumb: formatSlugTitle(categorySlug),
      href: categoryHref,
      description: defaultDescription(category.title),
      tabs,
    }

    for (const item of category.items) {
      const itemSlug = item.href.replace(/^\/+/, "")
      if (!categoryConfigs[itemSlug]) {
        categoryConfigs[itemSlug] = {
          title: item.name,
          breadcrumb: formatSlugTitle(itemSlug),
          href: `/${itemSlug}`,
          description: defaultDescription(item.name),
          tabs: [],
        }
      }
    }
  }
}

// 🚀 Build from all mega menus
buildConfigsFromMenu(menMenuData)
buildConfigsFromMenu(womenMenuData)
buildConfigsFromMenu(kidsMenuData)
buildConfigsFromMenu(backToSchoolMenuData)
buildConfigsFromMenu(trendingMenuData)
buildConfigsFromMenu(saleMenuData)

/**
 * Get category config by slug
 */
export function getCategoryConfig(slug: string): CategoryConfig {
  return (
    categoryConfigs[slug] || {
      title: "Products",
      breadcrumb: formatSlugTitle(slug),
      href: `/${slug}`,
      tabs: [],
    }
  )
}

/**
 * Format slug to readable title.
 * Example: "men-soccer-shoes-f50" => "Men Soccer Shoes F50"
 * Handles edge cases where slug is undefined or an array.
 */
export function formatSlugTitle(slug: string | string[] | undefined): string {
  if (!slug) return ""

  const slugStr = Array.isArray(slug) ? slug.join("-") : slug

  const possessiveMap: Record<string, string> = {
    men: "Men's",
    women: "Women's",
    kids: "Kids'",
  }

  const words = slugStr.replace(/[-_]/g, " ").split(" ")

  if (words.length === 0) return ""

  const first = words[0].toLowerCase()
  const firstWord = possessiveMap[first] || capitalize(first)

  const restWords = words.slice(1).map(capitalize)

  return [firstWord, ...restWords].join(" ")
}

export { categoryConfigs }
