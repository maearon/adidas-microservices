import type { MegaMenuColumn, MegaMenuLink, MenuCategory } from "@/types/common"
import { flattenMegaMenuColumns } from "./mega-menu-columns"

function item(name: string, href: string, translationKey: string): MegaMenuLink {
  return { name, href, translationKey }
}

function saleColumn(
  title: string,
  titleHref: string,
  titleTranslationKey: string,
  groups: MegaMenuLink[][],
): MegaMenuColumn {
  return {
    title,
    titleHref,
    translationKey: titleTranslationKey,
    sections: groups.map((items, index) => ({
      items,
      gapAfter: index < groups.length - 1,
    })),
  }
}

/** adidas.com/us SALE mega menu — featured | men | gap | women | kids | by sport */
export const saleMenuColumns: MegaMenuColumn[] = [
  saleColumn(
    "FEATURED SALE",
    "/featured",
    "featuredSaleCol",
    [
      [
        item("New to Sale", "/new-to-sale", "newToSale"),
        item("Soccer Jerseys on Sale", "/soccer-jerseys-sale", "soccerJerseysOnSale"),
        item("Spend $100 Save $30", "/shop", "spend100Save30"),
      ],
    ],
  ),
  saleColumn(
    "MEN",
    "/men",
    "menSaleCol",
    [
      [
        item("Shoes", "/men-shoes-sale", "shoesNav"),
        item("Sneakers", "/men-athletic_sneakers-sale", "sneakersNav"),
        item("Running Shoes", "/men-running-shoes-sale", "runningShoesNav"),
        item("Basketball Shoes", "/men-basketball-shoes-sale", "basketballShoesNav"),
        item("Clothing", "/men-clothing-sale", "clothingNav"),
        item("Shorts", "/men-shorts-sale", "shorts"),
        item("Hoodies & Sweatshirts", "/men-hoodies_sweatshirts-sale", "hoodiesSweatshirts"),
        item("Shirts", "/men-t_shirts-sale", "shirtsNav"),
        item("Accessories", "/men-accessories-sale", "accessoriesNav"),
      ],
    ],
  ),
  { horizontalSpacer: true, sections: [] },
  saleColumn(
    "WOMEN",
    "/women",
    "womenSaleCol",
    [
      [
        item("Shoes", "/women-shoes-sale", "shoesNav"),
        item("Sneakers", "/women-athletic_sneakers-sale", "sneakersNav"),
        item("Running Shoes", "/women-running-shoes-sale", "runningShoesNav"),
        item("Clothing", "/women-clothing-sale", "clothingNav"),
        item("Leggings", "/women-tights_leggings-sale", "leggingsNav"),
        item("Jackets", "/women-jackets-sale", "jacketsNav"),
        item("Shirts", "/women-tops-sale", "shirtsNav"),
        item("Tracksuits", "/women-track_suits-sale", "tracksuits"),
        item("Accessories", "/women-accessories-sale", "accessoriesNav"),
      ],
    ],
  ),
  saleColumn(
    "KIDS",
    "/kids",
    "kidsSaleCol",
    [
      [
        item("All Girls", "/girls-sale", "allGirls"),
        item("Girls Shoes", "/girls-shoes-sale", "girlsShoesNav"),
        item("Girls Clothing", "/girls-clothing-sale", "girlsClothingNav"),
      ],
      [
        item("All Boys", "/boys-sale", "allBoys"),
        item("Boys Shoes", "/boys-shoes-sale", "boysShoesNav"),
        item("Boys Clothing", "/boys-clothing-sale", "boysClothingNav"),
      ],
      [
        item("Infant & Toddler Shoes", "/kids-infant_toddler-shoes-sale", "infantToddlerShoes"),
        item("Accessories", "/kids-accessories-sale", "accessoriesNav"),
      ],
    ],
  ),
  saleColumn(
    "BY SPORT",
    "/by-sport",
    "bySportCol",
    [
      [
        item("Golf", "/golf-sale", "golf"),
        item("Soccer", "/soccer-sale", "soccer"),
        item("Basketball", "/basketball-sale", "basketball"),
        item("Baseball", "/baseball-sale", "baseball"),
        item("Football", "/football-sale", "football"),
      ],
      [
        item("Running", "/running-sale", "running"),
        item("Workout", "/workout-sale", "workoutNav"),
        item("Outdoor", "/outdoor-sale", "outdoor"),
      ],
    ],
  ),
]

/** Flat categories for mobile menu */
export const saleMenuData: MenuCategory[] = flattenMegaMenuColumns(
  saleMenuColumns.filter((column) => !column.horizontalSpacer),
)
