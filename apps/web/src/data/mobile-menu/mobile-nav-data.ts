import { menMenuData } from "@/data/mega-menu/men-mega-menu-data"
import { womenMenuData } from "@/data/mega-menu/women-mega-menu-data"
import { kidsMenuData } from "@/data/mega-menu/kids.mega-menu-data"
import { saleMenuData } from "@/data/mega-menu/sale-mega-menu-data"
import { trendingMenuData } from "@/data/mega-menu/trending-mega-menu-data"
import { fifaWorldCupMenuColumns, fifaWorldCupPromo } from "@/data/mega-menu/fifa-world-cup-mega-menu-data"
import type { MenuCategory } from "@/types/common"

export type MobileNavLeaf = { name: string; href: string; translationKey?: string }
export type MobileNavGroup = {
  title: string
  titleHref?: string
  translationKey?: string
  items: MobileNavNode[]
}
export type MobileNavNode = MobileNavLeaf | MobileNavGroup

export function isMobileNavGroup(node: MobileNavNode): node is MobileNavGroup {
  return "title" in node && "items" in node && !("name" in node)
}

export const primeDeliveryPromo = {
  href: "/men-prime_delivery",
  imageSrc: "/image/upload/f_auto,q_auto,fl_lossy/bwp_adidas_content_slot_navigation_d_dfbf3d31ce.png",
  title: "PRIME DELIVERY",
  titleTranslationKey: "primeDelivery",
  description: "Fast, free delivery, now on adidas",
  descriptionTranslationKey: "primeDeliveryDesc",
}

export { fifaWorldCupPromo }

const COLOR_SLUGS = [
  "black", "grey", "white", "brown", "red", "pink", "orange", "yellow", "green", "blue", "purple",
] as const

function getColumn(data: MenuCategory[], title: string) {
  return data.find((c) => c.title === title)
}

function shopByColorItems(gender: string): MobileNavLeaf[] {
  return [
    ...COLOR_SLUGS.map((slug) => ({
      name: slug.charAt(0).toUpperCase() + slug.slice(1),
      href: `/${gender}-${slug}`,
      translationKey: slug,
    })),
    {
      name: `All ${gender.charAt(0).toUpperCase()}${gender.slice(1)}'s`,
      href: `/${gender}`,
      translationKey: gender === "men" ? "allMensText" : gender === "women" ? "allWomensText" : "allKidsText",
    },
  ]
}

function saleItems(gender: string): MobileNavLeaf[] {
  return [
    { name: "Shoes", href: `/${gender}-shoes-sale`, translationKey: "shoes" },
    { name: "Clothing", href: `/${gender}-clothing-sale`, translationKey: "clothing" },
    { name: "Accessories", href: `/${gender}-accessories-sale`, translationKey: "accessories" },
    { name: "Final Sale", href: `/${gender}-final-sale`, translationKey: "finalSale" },
    { name: "All Sale", href: `/${gender}-sale`, translationKey: "sale" },
  ]
}

function buildMobileGenderMenu(data: MenuCategory[], gender: "men" | "women" | "kids"): MobileNavGroup[] {
  if (gender === "kids") {
    const concatItems = (...titles: string[]) =>
      titles.flatMap((title) => getColumn(data, title)?.items ?? [])

    return [
      {
        title: "Shoes",
        translationKey: "shoes",
        titleHref: "/kids-shoes",
        items: concatItems("BOYS SHOES", "GIRLS SHOES", "BABIES & TODDLERS"),
      },
      {
        title: "Clothing",
        translationKey: "clothing",
        titleHref: "/kids-clothing",
        items: concatItems("BOYS CLOTHING", "GIRLS CLOTHING"),
      },
      {
        title: "Accessories",
        translationKey: "accessories",
        titleHref: getColumn(data, "ACCESSORIES")?.titleHref,
        items: getColumn(data, "ACCESSORIES")?.items ?? [],
      },
      {
        title: "New & Trending",
        translationKey: "newTrending",
        titleHref: getColumn(data, "NEW & TRENDING")?.titleHref,
        items: getColumn(data, "NEW & TRENDING")?.items ?? [],
      },
      {
        title: "Sports",
        translationKey: "sports",
        titleHref: getColumn(data, "SHOP BY SPORT")?.titleHref,
        items: getColumn(data, "SHOP BY SPORT")?.items ?? [],
      },
      {
        title: "Shop by Age",
        translationKey: "shopByAge",
        titleHref: getColumn(data, "SHOP BY AGE")?.titleHref,
        items: getColumn(data, "SHOP BY AGE")?.items ?? [],
      },
      {
        title: "Shop by Color 🎨",
        translationKey: "shopByColor",
        titleHref: "/kids-black",
        items: shopByColorItems("kids"),
      },
      {
        title: "Kids Sale",
        translationKey: "kidsSale",
        titleHref: "/kids-sale",
        items: saleItems("kids"),
      },
    ]
  }

  const sportsTitle = "SPORTS"
  const collectionsTitle = "COLLECTIONS"
  const saleTitle = gender === "men" ? "Men's Sale" : gender === "women" ? "Women's Sale" : "Kids Sale"
  const saleKey = gender === "men" ? "mensSale" : gender === "women" ? "womensSale" : "kidsSale"

  return [
    {
      title: "Shoes",
      translationKey: "shoes",
      titleHref: getColumn(data, "SHOES")?.titleHref,
      items: getColumn(data, "SHOES")?.items ?? [],
    },
    {
      title: "Clothing",
      translationKey: "clothing",
      titleHref: getColumn(data, "CLOTHING")?.titleHref,
      items: getColumn(data, "CLOTHING")?.items ?? [],
    },
    {
      title: "Accessories",
      translationKey: "accessories",
      titleHref: getColumn(data, "ACCESSORIES")?.titleHref,
      items: getColumn(data, "ACCESSORIES")?.items ?? [],
    },
    {
      title: "New & Trending",
      translationKey: "newTrending",
      titleHref: getColumn(data, "NEW & TRENDING")?.titleHref,
      items: getColumn(data, "NEW & TRENDING")?.items ?? [],
    },
    {
      title: "Sports",
      translationKey: "sports",
      titleHref: getColumn(data, sportsTitle)?.titleHref,
      items: getColumn(data, sportsTitle)?.items ?? [],
    },
    {
      title: "Collections",
      translationKey: "collections",
      titleHref: getColumn(data, collectionsTitle)?.titleHref,
      items: getColumn(data, collectionsTitle)?.items ?? [],
    },
    {
      title: "Shop by Color 🎨",
      translationKey: "shopByColor",
      titleHref: `/${gender}-black`,
      items: shopByColorItems(gender),
    },
    {
      title: saleTitle,
      translationKey: saleKey,
      titleHref: `/${gender}-sale`,
      items: saleItems(gender),
    },
  ]
}

type CountryLinkKey =
  | "shopAll"
  | "menNav"
  | "womenNav"
  | "kidsNav"
  | "jerseyHome"
  | "jerseyAway"
  | "shoes"
  | "accessories"
  | "petCollectionWC"

const COUNTRY_LINK_DEFS: Record<CountryLinkKey, { name: string; suffix?: string }> = {
  shopAll: { name: "Shop all" },
  menNav: { name: "Men", suffix: "men" },
  womenNav: { name: "Women", suffix: "women" },
  kidsNav: { name: "Kids", suffix: "kids" },
  jerseyHome: { name: "Home", suffix: "home" },
  jerseyAway: { name: "Away", suffix: "away" },
  shoes: { name: "Shoes", suffix: "shoes" },
  accessories: { name: "Accessories", suffix: "accessories" },
  petCollectionWC: { name: "Pet", suffix: "pet" },
}

const FULL_COUNTRY_KEYS: CountryLinkKey[] = [
  "shopAll",
  "menNav",
  "womenNav",
  "kidsNav",
  "jerseyHome",
  "jerseyAway",
  "shoes",
  "accessories",
  "petCollectionWC",
]

/** Per-team submenu — adidas.com/us varies by nation (e.g. Jamaica ≠ Mexico) */
const FIFA_COUNTRY_SUBMENU_KEYS: Partial<Record<string, CountryLinkKey[]>> = {
  jamaica: ["shopAll", "jerseyHome", "jerseyAway", "accessories"],
}

function countryItems(slug: string, keys: CountryLinkKey[]): MobileNavLeaf[] {
  /** Column headers use "shoes"/"accessories" (ALL CAPS); country links need sentence case */
  const translationKeyOverrides: Partial<Record<CountryLinkKey, string>> = {
    shoes: "shoesNav",
    accessories: "accessoriesNav",
  }

  return keys.map((key) => {
    const def = COUNTRY_LINK_DEFS[key]
    return {
      name: def.name,
      href: def.suffix ? `/fifa_world_cup-${slug}-${def.suffix}` : `/fifa_world_cup-${slug}`,
      translationKey: translationKeyOverrides[key] ?? key,
    }
  })
}

function fifaCountrySubmenu(name: string, slug: string, translationKey: string): MobileNavGroup {
  const keys = FIFA_COUNTRY_SUBMENU_KEYS[slug] ?? FULL_COUNTRY_KEYS
  return {
    title: name,
    translationKey,
    items: countryItems(slug, keys),
  }
}

const fifaFeatured = fifaWorldCupMenuColumns.find((c) => c.title === "FEATURED")
const fifaNationalTeams = fifaWorldCupMenuColumns.find((c) => c.title === "NATIONAL TEAMS")
const fifaJerseysCol = fifaWorldCupMenuColumns[2]
const fifaFanGearCol = fifaWorldCupMenuColumns[3]
const fifaAccessoriesCol = fifaWorldCupMenuColumns[4]

const NESTED_NATIONAL_TEAMS = new Set([
  "mexico", "colombia", "argentina", "germany", "spain", "japan", "italy", "jamaica", "belgium",
])

function buildNationalTeamItems(): MobileNavNode[] {
  const teamItems = fifaNationalTeams?.sections[0]?.items ?? []
  return [
    { name: "All Teams", href: "/fifa_world_cup-national_teams", translationKey: "allTeams" },
    ...teamItems.map((team) => {
      const slug = team.href.replace(/^\/fifa_world_cup-/, "")
      if (NESTED_NATIONAL_TEAMS.has(slug)) {
        return fifaCountrySubmenu(team.name, slug, team.translationKey ?? slug)
      }
      return team
    }),
  ]
}

function sectionToMobileGroup(
  section: { heading?: string; headingHref?: string; headingTranslationKey?: string; items: MobileNavLeaf[] },
  titleOverride?: string,
  translationKeyOverride?: string,
): MobileNavGroup {
  return {
    title: titleOverride ?? section.heading ?? "",
    translationKey: translationKeyOverride ?? section.headingTranslationKey,
    titleHref: section.headingHref,
    items: section.items,
  }
}

export const mobileFifaMenu: MobileNavGroup[] = [
  {
    title: "National Teams",
    translationKey: "nationalTeams",
    titleHref: "/fifa_world_cup-national_teams",
    items: buildNationalTeamItems(),
  },
  {
    title: "Jerseys",
    translationKey: "jerseysHeading",
    titleHref: "/fifa_world_cup-jerseys",
    items: [
      ...(fifaJerseysCol?.sections[0]?.items ?? []),
      {
        name: "Customize Your Jersey",
        href: "/fifa_world_cup-jerseys-personalisable",
        translationKey: "customizeYourJersey",
      },
    ],
  },
  sectionToMobileGroup(fifaFanGearCol?.sections[0] ?? { items: [] }, "Fan Gear", "fanGear"),
  sectionToMobileGroup(fifaFanGearCol?.sections[1] ?? { items: [] }, "Shoes", "shoes"),
  sectionToMobileGroup(fifaAccessoriesCol?.sections[0] ?? { items: [] }, "Accessories", "accessories"),
  {
    title: "Featured",
    translationKey: "featured",
    titleHref: fifaFeatured?.titleHref,
    items: fifaFeatured?.sections[0]?.items ?? [],
  },
  {
    title: "Athlete",
    translationKey: "athletes",
    titleHref: "/fifa_world_cup-athletes",
    items: fifaAccessoriesCol?.sections[1]?.items ?? [],
  },
]

export const mobileMainMenuData: Record<string, MobileNavGroup[]> = {
  MEN: buildMobileGenderMenu(menMenuData, "men"),
  WOMEN: buildMobileGenderMenu(womenMenuData, "women"),
  KIDS: buildMobileGenderMenu(kidsMenuData, "kids"),
  "FIFA WORLD CUP 26™": mobileFifaMenu,
  SALE: saleMenuData as MobileNavGroup[],
  "NEW & TRENDING": trendingMenuData as MobileNavGroup[],
}

export function getPrimePromoHref(menuKey: string): string {
  if (menuKey === "WOMEN") return "/women-prime_delivery"
  if (menuKey === "KIDS") return "/kids-prime_delivery"
  return "/men-prime_delivery"
}
