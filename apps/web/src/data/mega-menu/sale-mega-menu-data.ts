import { MenuCategory } from "@/types/common";

export const saleMenuData: MenuCategory[] = [
  {
    title: "FEATURED SALE",
    titleHref: "/sale-featured",
    items: [
      { name: "New to Sale", href: "/sale-new_to_sale", translationKey: "newToSale" },
      { name: "Summer Savings", href: "/sale-summer_savings", translationKey: "summerSavings" },
    ],
  },
  {
    title: "MEN",
    titleHref: "/sale-men",
    items: [
      { name: "Shoes", href: "/sale-men_shoes", translationKey: "shoes" },
      { name: "Clothing", href: "/sale-men_clothing", translationKey: "clothing" },
      { name: "Accessories", href: "/sale-men_accessories", translationKey: "accessories" },
    ],
  },
  {
    title: "WOMEN",
    titleHref: "/sale-women",
    items: [
      { name: "Shoes", href: "/sale-women_shoes", translationKey: "shoes" },
      { name: "Clothing", href: "/sale-women_clothing", translationKey: "clothing" },
      { name: "Accessories", href: "/sale-women_accessories", translationKey: "accessories" },
    ],
  },
  {
    title: "KIDS",
    titleHref: "/sale-kids",
    items: [
      { name: "Boys Sale", href: "/sale-kids_boys", translationKey: "boysSale" },
      { name: "Girls Sale", href: "/sale-kids_girls", translationKey: "girlsSale" },
    ],
  },
];
