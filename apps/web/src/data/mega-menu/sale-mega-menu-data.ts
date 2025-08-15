import { MenuCategory } from "@/types/common";

export const saleMenuData: MenuCategory[] = [
  {
    title: "FEATURED SALE",
    titleHref: "/sale-featured",
    items: [
      { name: "New to Sale", href: "/sale-new_to_sale" },
      { name: "Summer Savings", href: "/sale-summer_savings" },
    ],
  },
  {
    title: "MEN",
    titleHref: "/sale-men",
    items: [
      { name: "Shoes", href: "/sale-men_shoes" },
      { name: "Clothing", href: "/sale-men_clothing" },
      { name: "Accessories", href: "/sale-men_accessories" },
    ],
  },
  {
    title: "WOMEN",
    titleHref: "/sale-women",
    items: [
      { name: "Shoes", href: "/sale-women_shoes" },
      { name: "Clothing", href: "/sale-women_clothing" },
      { name: "Accessories", href: "/sale-women_accessories" },
    ],
  },
  {
    title: "KIDS",
    titleHref: "/sale-kids",
    items: [
      { name: "Boys Sale", href: "/sale-kids_boys" },
      { name: "Girls Sale", href: "/sale-kids_girls" },
    ],
  },
];
