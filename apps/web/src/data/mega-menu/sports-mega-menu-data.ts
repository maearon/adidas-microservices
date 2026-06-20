import type { MegaMenuColumn, MegaMenuLink } from "@/types/common"
import { flattenMegaMenuColumns } from "./mega-menu-columns"

function item(name: string, href: string, translationKey: string): MegaMenuLink {
  return { name, href, translationKey }
}

/** Groups with gapAfter on each group except the last — adidas SPORTS spacing */
function sportColumn(
  title: string,
  titleHref: string,
  titleTranslationKey: string,
  groups: MegaMenuLink[][],
  footerLink?: MegaMenuLink,
): MegaMenuColumn {
  return {
    title,
    titleHref,
    translationKey: titleTranslationKey,
    sections: groups.map((items, index) => ({
      items,
      gapAfter: index < groups.length - 1,
    })),
    ...(footerLink ? { footerLink } : {}),
  }
}

/**
 * adidas.com/us SPORTS mega menu
 * Gaps per column: col1×1, col2-4×2, col5-6×1, col7×0
 */
export const sportsMenuColumns: MegaMenuColumn[] = [
  sportColumn(
    "SOCCER",
    "/soccer",
    "soccerSportCol",
    [
      [
        item("Cleats & Shoes", "/soccer-cleats_shoes", "cleatsAndShoes"),
        item("Jerseys", "/soccer-jerseys", "jerseysNav"),
        item("Personalizable Jerseys", "/soccer-personalizable_jerseys", "personalizableJerseys"),
        item("Balls & Accessories", "/soccer-balls_accessories", "ballsAndAccessories"),
      ],
      [
        item("Shop FIFA World Cup™", "/soccer-fifa_world_cup", "shopFifaWorldCup"),
        item("National Teams", "/soccer-national_teams", "nationalTeamsNav"),
        item("Club Teams", "/soccer-club_teams", "clubTeams"),
        item("MLS", "/soccer-mls", "mls"),
      ],
    ],
    { name: "All Soccer", href: "/soccer", translationKey: "allSoccer" },
  ),
  sportColumn(
    "RUNNING",
    "/running",
    "runningSportCol",
    [
      [
        item("Shoes", "/running-shoes", "shoesNav"),
        item("Clothing", "/running-clothing", "clothingNav"),
        item("Accessories", "/running-accessories", "accessoriesNav"),
      ],
      [
        item("Marathon Running", "/running-marathon", "marathonRunning"),
        item("Everyday Running", "/running-everyday", "everydayRunning"),
        item("Trail Running", "/running-trail", "trailRunning"),
        item("Walking Shoes", "/running-walking_shoes", "walkingShoes"),
      ],
      [
        item("Adizero Evo SL", "/running-adizero_evo_sl", "adizeroEvoSl"),
        item("Hyperboost", "/running-hyperboost", "hyperboost"),
        item("Supernova", "/running-supernova", "supernova"),
      ],
    ],
    { name: "All Running", href: "/running", translationKey: "allRunning" },
  ),
  sportColumn(
    "WORKOUT & GYM",
    "/workout_gym",
    "workoutGymCol",
    [
      [
        item("Shoes", "/workout_gym-shoes", "shoesNav"),
        item("Clothing", "/workout_gym-clothing", "clothingNav"),
        item("Accessories", "/workout_gym-accessories", "accessoriesNav"),
      ],
      [
        item("Hybrid Training", "/workout_gym-hybrid_training", "hybridTraining"),
        item("Yoga & Pilates", "/workout_gym-yoga_pilates", "yogaPilates"),
        item("Weightlifting", "/workout_gym-weightlifting", "weightlifting"),
        item("HIIT", "/workout_gym-hiit", "hiit"),
      ],
      [
        item("Adizero Dropset", "/workout_gym-adizero_dropset", "adizeroDropset"),
        item("Dropset 4", "/workout_gym-dropset_4", "dropset4"),
        item("Optime", "/workout_gym-optime", "optime"),
        item("D4T", "/workout_gym-d4t", "d4t"),
      ],
    ],
    { name: "All Workout & Gym", href: "/workout_gym", translationKey: "allWorkoutGym" },
  ),
  sportColumn(
    "COLLEGE SPORTS",
    "/college",
    "collegeSportsCol",
    [
      [
        item("Shoes", "/college-shoes", "shoesNav"),
        item("Clothing", "/college-clothing", "clothingNav"),
        item("Shop by School", "/college-shop_by_school", "shopBySchool"),
      ],
      [
        item("College Baseball & Softball", "/college-baseball_softball", "collegeBaseballSoftball"),
        item("College Basketball", "/college-basketball", "collegeBasketball"),
        item("College Football", "/college-football", "collegeFootball"),
      ],
      [
        item("Georgia Tech Yellow Jackets", "/college-georgia_tech", "georgiaTechYellowJackets"),
        item("Texas Tech Red Raiders", "/college-texas_tech", "texasTechRedRaiders"),
        item("Nebraska Cornhuskers", "/college-nebraska_cornhuskers", "nebraskaCornhuskers"),
      ],
    ],
    { name: "All College Sports", href: "/college", translationKey: "allCollegeSports" },
  ),
  sportColumn(
    "BASKETBALL",
    "/basketball",
    "basketballSportCol",
    [
      [
        item("Shoes", "/basketball-shoes", "shoesNav"),
        item("Clothing", "/basketball-clothing", "clothingNav"),
        item("Accessories", "/basketball-accessories", "accessoriesNav"),
      ],
      [
        item("Anthony Edwards", "/basketball-anthony_edwards", "anthonyEdwards"),
        item("Damian Lillard", "/basketball-damian_lillard", "damianLillard"),
        item("James Harden", "/basketball-james_harden", "jamesHarden"),
        item("Donovan Mitchell", "/basketball-donovan_mitchell", "donovanMitchell"),
      ],
    ],
    { name: "All Basketball", href: "/basketball", translationKey: "allBasketball" },
  ),
  sportColumn(
    "GOLF",
    "/golf",
    "golfSportCol",
    [
      [
        item("Shoes", "/golf-shoes", "shoesNav"),
        item("Clothing", "/golf-clothing", "clothingNav"),
        item("Accessories", "/golf-accessories", "accessoriesNav"),
      ],
      [
        item("Ultimate365", "/golf-ultimate365", "ultimate365"),
        item("Originals Golf", "/golf-originals", "originalsGolf"),
        item("Beyond the Course", "/golf-beyond_the_course", "beyondTheCourse"),
      ],
    ],
    { name: "All Golf", href: "/golf", translationKey: "allGolf" },
  ),
  { horizontalSpacer: true, sections: [] },
  sportColumn(
    "OTHER SPORTS",
    "/other_sports",
    "otherSportsCol",
    [
      [
        item("Football", "/football", "football"),
        item("Baseball", "/baseball", "baseball"),
        item("Climbing", "/climbing", "climbing"),
        item("Cycling", "/cycling", "cycling"),
        item("Hiking", "/hiking", "hiking"),
        item("Motorsport", "/motorsport", "motorsport"),
        item("Outdoor", "/outdoor", "outdoor"),
        item("Pickleball", "/pickleball", "pickleball"),
        item("Skateboarding", "/skateboarding", "skateboarding"),
        item("Softball", "/softball", "softball"),
        item("Swimming", "/swimming", "swimming"),
        item("Tennis", "/tennis", "tennis"),
        item("Volleyball", "/volleyball", "volleyball"),
      ],
    ],
  ),
]

export const sportsMenuData = flattenMegaMenuColumns(
  sportsMenuColumns.filter((column) => !column.horizontalSpacer),
)
