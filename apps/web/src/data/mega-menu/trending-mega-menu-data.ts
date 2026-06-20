import type { MegaMenuColumn, MegaMenuLink, MenuCategory } from "@/types/common"
import { flattenMegaMenuColumns } from "./mega-menu-columns"

function item(name: string, href: string, translationKey: string): MegaMenuLink {
  return { name, href, translationKey }
}

function trendingColumn(
  title: string,
  titleHref: string,
  titleTranslationKey: string,
  links: MegaMenuLink[],
): MegaMenuColumn {
  return {
    title,
    titleHref,
    translationKey: titleTranslationKey,
    sections: [{ items: links }],
  }
}

/** adidas.com/us NEW & TRENDING mega menu — 5 equal columns */
export const trendingMenuColumns: MegaMenuColumn[] = [
  trendingColumn(
    "WHAT'S NEW?",
    "/trending_whats_new",
    "whatsNewCol",
    [
      item("New Arrivals", "/new_arrivals", "newArrivals"),
      item("Best Sellers", "/best_sellers", "bestSellers"),
      item("Summer Shop ☀️", "/summer", "summerShop"),
      item("Pet Collection 🐾", "/pet", "petCollection"),
      item("Pride: Love Unites 🏳️‍🌈", "/pride", "prideLoveUnites"),
      item("Gifts for Every Dad 🧢", "/fathers_day_gifts", "giftsForEveryDad"),
      item("Release Dates", "/release-dates", "releaseDates"),
      item("Blog", "/blog", "blog"),
    ],
  ),
  trendingColumn(
    "TRENDING NOW",
    "/trending_now",
    "trendingNowCol",
    [
      item("Y2k", "/2000k", "y2k"),
      item("90's", "/90s", "nineties"),
      item("Short Shorts", "/extra-short_shorts", "shortShorts"),
      item("Wide Leg Pants", "/women-wide_legs", "wideLegPants"),
      item("Denim Shop", "/denim", "denimShop"),
      item("Animal Print", "/animal", "animalPrint"),
      item("Graphic Tees", "/graphics-t_shirts", "graphicTees"),
      item("Metallics", "/metallic", "metallics"),
      item("Balletcore", "/ballerina", "balletcoreNav"),
    ],
  ),
  trendingColumn(
    "COLLECTIONS",
    "/trending_collections",
    "collectionsCol",
    [
      item("Samba", "/samba", "samba"),
      item("Samba Jane", "/samba_jane", "sambaJane"),
      item("Gazelle", "/gazelle", "gazelle"),
      item("Firebird", "/firebird", "firebird"),
      item("SL72", "/sl_72", "sl72"),
      item("Taekwondo", "/taekwondo", "taekwondo"),
      item("Adizero Evo SL", "/adizero_evo_sl", "adizeroEvoSl"),
      item("Superstar", "/superstar", "superstar"),
      item("Low Profile", "/low_profile", "lowProfile"),
    ],
  ),
  trendingColumn(
    "FAN GEAR",
    "/trending_fan_gear",
    "fanGearCol",
    [
      item("FIFA World Cup™", "/fifa_world_cup", "shopFifaWorldCup"),
      item("National Teams", "/federation", "nationalTeamsNav"),
      item("International Clubs", "/clubs", "internationalClubs"),
      item("College Gear", "/college", "collegeGear"),
      item("MLS", "/mls", "mls"),
    ],
  ),
  trendingColumn(
    "COLLABORATIONS",
    "/trending_collaborations",
    "collaborationsCol",
    [
      item("adidas by Stella McCartney", "/adidas_by_stella_mccartney", "adidasByStellaMccartney"),
      item("Bad Bunny", "/badbunny", "badBunny"),
      item("Bape", "/bape", "bape"),
      item("Disney", "/disney", "disney"),
      item("Edison Chen", "/edisonchen", "edisonChen"),
      item("Pharrell", "/pharrell", "pharrell"),
      item("Sporty & Rich", "/sporty_and_rich", "sportyAndRich"),
      item("Wales Bonner", "/wales_bonner", "walesBonner"),
      item("Y-3", "/y_3", "y3"),
    ],
  ),
]

export const trendingMenuData: MenuCategory[] = flattenMegaMenuColumns(trendingMenuColumns)
