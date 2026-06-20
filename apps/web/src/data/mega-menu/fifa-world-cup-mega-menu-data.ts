import { MenuCategory } from "@/types/common";

export type FifaMenuSection = {
  heading?: string
  headingHref?: string
  headingTranslationKey?: string
  items: { name: string; href: string; translationKey?: string }[]
}

export type FifaMenuColumn = {
  title?: string
  titleHref?: string
  translationKey?: string
  sections: FifaMenuSection[]
}

export const fifaWorldCupPromo = {
  href: "/fifa_world_cup_store",
  src: "/image/upload/f_auto,q_auto,fl_lossy/H24630_FY_26_WORLDCUP_3x4_FB_Messi_RGB_1402232_d_2c7f2cda83.jpg",
  alt: "Backyard Legends — Lionel Messi",
  title: "BACKYARD LEGENDS",
  titleTranslationKey: "backyardLegends",
  description: "Iconic on and off the pitch.",
  descriptionTranslationKey: "backyardLegendsDesc",
}

export const fifaWorldCupMenuColumns: FifaMenuColumn[] = [
  {
    title: "FEATURED",
    titleHref: "/fifa_world_cup-featured",
    translationKey: "featured",
    sections: [
      {
        items: [
          { name: "Pet Collection", href: "/fifa_world_cup-pet_collection", translationKey: "petCollection" },
          { name: "Retro Team Kits", href: "/fifa_world_cup-retro_team_kits", translationKey: "retroTeamKits" },
          { name: "Lifestyle", href: "/fifa_world_cup-lifestyle", translationKey: "lifestyle" },
          { name: "USA", href: "/fifa_world_cup-usa", translationKey: "usa" },
          { name: "Road to Glory", href: "/fifa_world_cup-road_to_glory", translationKey: "roadToGlory" },
          { name: "Trionda", href: "/fifa_world_cup-trionda", translationKey: "trionda" },
          { name: "Coca-Cola", href: "/fifa_world_cup-coca_cola", translationKey: "cocaCola" },
          { name: "Thrasher x AFA", href: "/fifa_world_cup-thrasher_afa", translationKey: "thrasherAfa" },
          { name: "adidas Equipment", href: "/fifa_world_cup-equipment", translationKey: "adidasEquipment" },
        ],
      },
    ],
  },
  {
    title: "NATIONAL TEAMS",
    titleHref: "/fifa_world_cup-national_teams",
    translationKey: "nationalTeams",
    sections: [
      {
        items: [
          { name: "Mexico", href: "/fifa_world_cup-mexico", translationKey: "mexico" },
          { name: "Colombia", href: "/fifa_world_cup-colombia", translationKey: "colombia" },
          { name: "Argentina", href: "/fifa_world_cup-argentina", translationKey: "argentina" },
          { name: "Germany", href: "/fifa_world_cup-germany", translationKey: "germany" },
          { name: "Spain", href: "/fifa_world_cup-spain", translationKey: "spain" },
          { name: "Japan", href: "/fifa_world_cup-japan", translationKey: "japan" },
          { name: "South Africa", href: "/fifa_world_cup-south_africa", translationKey: "southAfrica" },
          { name: "Qatar", href: "/fifa_world_cup-qatar", translationKey: "qatar" },
          { name: "Italy", href: "/fifa_world_cup-italy", translationKey: "italy" },
          { name: "Jamaica", href: "/fifa_world_cup-jamaica", translationKey: "jamaica" },
          { name: "Belgium", href: "/fifa_world_cup-belgium", translationKey: "belgium" },
          { name: "Chile", href: "/fifa_world_cup-chile", translationKey: "chile" },
          { name: "Peru", href: "/fifa_world_cup-peru", translationKey: "peru" },
          { name: "Sweden", href: "/fifa_world_cup-sweden", translationKey: "sweden" },
        ],
      },
    ],
  },
  {
    sections: [
      {
        heading: "JERSEYS",
        headingHref: "/fifa_world_cup-jerseys",
        headingTranslationKey: "jerseysHeading",
        items: [
          { name: "Home", href: "/fifa_world_cup-jerseys-home", translationKey: "jerseyHome" },
          { name: "Away", href: "/fifa_world_cup-jerseys-away", translationKey: "jerseyAway" },
          { name: "Authentic", href: "/fifa_world_cup-jerseys-authentic", translationKey: "jerseyAuthentic" },
        ],
      },
      {
        heading: "CUSTOMIZE YOUR JERSEY",
        headingHref: "/fifa_world_cup-customize",
        headingTranslationKey: "customizeYourJersey",
        items: [],
      },
    ],
  },
  {
    sections: [
      {
        heading: "FAN GEAR",
        headingHref: "/fifa_world_cup-fan_gear",
        headingTranslationKey: "fanGear",
        items: [
          { name: "T-Shirts & Graphics", href: "/fifa_world_cup-t-shirts_graphics", translationKey: "tShirtsGraphics" },
          { name: "Shorts", href: "/fifa_world_cup-shorts", translationKey: "shorts" },
          { name: "Pants", href: "/fifa_world_cup-pants", translationKey: "pants" },
          { name: "Tracksuits", href: "/fifa_world_cup-tracksuits", translationKey: "tracksuits" },
        ],
      },
      {
        heading: "SHOES",
        headingHref: "/fifa_world_cup-shoes",
        headingTranslationKey: "shoes",
        items: [
          { name: "Sneakers", href: "/fifa_world_cup-sneakers", translationKey: "sneakers" },
          { name: "Cleats", href: "/fifa_world_cup-cleats", translationKey: "cleats" },
        ],
      },
    ],
  },
  {
    sections: [
      {
        heading: "ACCESSORIES",
        headingHref: "/fifa_world_cup-accessories",
        headingTranslationKey: "accessories",
        items: [
          { name: "Soccer Balls", href: "/fifa_world_cup-soccer_balls", translationKey: "soccerBalls" },
          { name: "Bags", href: "/fifa_world_cup-bags", translationKey: "bags" },
          { name: "Hats", href: "/fifa_world_cup-hats", translationKey: "hats" },
        ],
      },
      {
        heading: "ATHLETES",
        headingHref: "/fifa_world_cup-athletes",
        headingTranslationKey: "athletes",
        items: [
          { name: "Lionel Messi", href: "/fifa_world_cup-lionel_messi", translationKey: "lionelMessi" },
          { name: "Lamine Yamal", href: "/fifa_world_cup-lamine_yamal", translationKey: "lamineYamal" },
          { name: "Jude Bellingham", href: "/fifa_world_cup-jude_bellingham", translationKey: "judeBellingham" },
        ],
      },
    ],
  },
]

/** Flat structure for mobile menu */
export const fifaWorldCupMenuData: MenuCategory[] = fifaWorldCupMenuColumns.flatMap((column) => {
  if (column.title) {
    return [{
      title: column.title,
      titleHref: column.titleHref,
      items: column.sections.flatMap((section) => section.items),
    }]
  }

  return column.sections.map((section) => ({
    title: section.heading || "",
    titleHref: section.headingHref,
    items: section.items,
  }))
})
