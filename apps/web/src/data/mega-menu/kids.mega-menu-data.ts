import { MenuCategory } from "@/types/common";
import { buildKidsMegaMenuColumns } from "./mega-menu-columns";

/** Prime banner — cột NEW & TRENDING (adidas.com/us KIDS, World Cup season) */
export const kidsMegaMenuBanner = {
  href: "/kids-prime_delivery",
  src: "https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/bwp_adidas_content_slot_navigation_d_dfbf3d31ce.png",
  alt: "Fast, free delivery with Prime",
};

export const kidsMenuData: MenuCategory[] = [
  {
    title: "NEW & TRENDING",
    titleHref: "/kids-new_trending",
    items: [
      { name: "New Arrivals", href: "/kids-new_arrivals", translationKey: "newArrivals" },
      { name: "Best Sellers", href: "/kids-best_sellers", translationKey: "bestSellers" },
      { name: "Trending Now", href: "/kids-trending", translationKey: "trendingNow" },
      { name: "Disney Collection", href: "/kids-disney_collection", translationKey: "disneyCollection" },
      { name: "Shop FIFA World Cup™", href: "/kids-fifa_world_cup", translationKey: "shopFifaWorldCup" },
      { name: "Summer Shop ☀️", href: "/kids-summer", translationKey: "summerShop" },
      { name: "Spend $100 Save $30", href: "/kids-shop", translationKey: "spend100Save30" },
    ],
  },
  {
    title: "BOYS SHOES",
    titleHref: "/boys-shoes",
    items: [
      { name: "Soccer", href: "/boys-soccer", translationKey: "soccer" },
      { name: "Basketball", href: "/boys-basketball", translationKey: "basketball" },
      { name: "Slip-On & Straps", href: "/boys-slip-on_straps", translationKey: "slipOnStraps" },
      { name: "Sneakers", href: "/boys-sneakers", translationKey: "sneakers" },
      { name: "Shoes $60 & Under", href: "/boys-shoes_under_60", translationKey: "shoes60AndUnder" },
    ],
  },
  {
    title: "BOYS CLOTHING",
    titleHref: "/boys-clothing",
    items: [
      { name: "Pants", href: "/boys-pants", translationKey: "pants" },
      { name: "Graphic Tees", href: "/boys-graphic_tees", translationKey: "graphicTees" },
      { name: "Shorts", href: "/boys-shorts", translationKey: "shorts" },
      { name: "Tracksuits", href: "/boys-tracksuits", translationKey: "tracksuits" },
      { name: "Jerseys", href: "/boys-jerseys", translationKey: "jerseys" },
      { name: "Shirts & Tops", href: "/boys-shirts_tops", translationKey: "shirtsAndTops" },
      { name: "Hoodies & Sweatshirts", href: "/boys-hoodies_sweatshirts", translationKey: "hoodiesSweatshirts" },
      { name: "Jackets & Coats", href: "/boys-jackets_coats", translationKey: "jacketsCoats" },
      { name: "Matching Sets", href: "/boys-matching_sets", translationKey: "matchingSets" },
    ],
  },
  {
    title: "GIRLS SHOES",
    titleHref: "/girls-shoes",
    items: [
      { name: "Soccer", href: "/girls-soccer", translationKey: "soccer" },
      { name: "Basketball", href: "/girls-basketball", translationKey: "basketball" },
      { name: "Slip-On & Straps", href: "/girls-slip-on_straps", translationKey: "slipOnStraps" },
      { name: "Sneakers", href: "/girls-sneakers", translationKey: "sneakers" },
      { name: "Shoes $60 & Under", href: "/girls-shoes_under_60", translationKey: "shoes60AndUnder" },
    ],
  },
  {
    title: "GIRLS CLOTHING",
    titleHref: "/girls-clothing",
    items: [
      { name: "Tracksuits", href: "/girls-tracksuits", translationKey: "tracksuits" },
      { name: "Pants", href: "/girls-pants", translationKey: "pants" },
      { name: "Shirts & Tops", href: "/girls-shirts_tops", translationKey: "shirtsAndTops" },
      { name: "Hoodies & Sweatshirts", href: "/girls-hoodies_sweatshirts", translationKey: "hoodiesSweatshirts" },
      { name: "Graphic Tees", href: "/girls-graphic_tees", translationKey: "graphicTees" },
      { name: "Jerseys", href: "/girls-jerseys", translationKey: "jerseys" },
      { name: "Tights & Leggings", href: "/girls-tights_leggings", translationKey: "tightsLeggings" },
      { name: "Jackets & Coats", href: "/girls-jackets_coats", translationKey: "jacketsCoats" },
      { name: "Matching Sets", href: "/girls-matching_sets", translationKey: "matchingSets" },
    ],
  },
  {
    title: "BABIES & TODDLERS",
    titleHref: "/babies-toddlers",
    items: [
      { name: "Baby Girl", href: "/babies-baby_girl", translationKey: "babyGirl" },
      { name: "Baby Boy", href: "/babies-baby_boy", translationKey: "babyBoy" },
      { name: "All Shoes (1K - 10K)", href: "/babies-all_shoes", translationKey: "allShoes1k10k" },
      { name: "All Clothing (0M-4T)", href: "/babies-all_clothing", translationKey: "allClothing0M4T" },
    ],
  },
  {
    title: "SHOP BY AGE",
    titleHref: "/kids-shop_by_age",
    items: [
      { name: "Youth & Teens (8-16 years)", href: "/kids-youth_teens", translationKey: "youthTeens8to16years" },
      { name: "Children (4-8 years)", href: "/kids-children", translationKey: "children4to8years" },
      { name: "Babies & Toddlers (0-4 years)", href: "/kids-babies_toddlers", translationKey: "babiesToddlers0to4years" },
    ],
  },
  {
    title: "ACCESSORIES",
    titleHref: "/kids-accessories",
    items: [
      { name: "Backpacks", href: "/kids-backpacks", translationKey: "backpacks" },
      { name: "Soccer Balls", href: "/kids-soccer_balls", translationKey: "soccerBalls" },
      { name: "Hats & Beanies", href: "/kids-hats_beanies", translationKey: "hatsAndBeanies" },
      { name: "Socks", href: "/kids-socks", translationKey: "socks" },
    ],
  },
  {
    title: "SPORTS",
    titleHref: "/kids-sports",
    items: [
      { name: "Baseball", href: "/kids-baseball", translationKey: "baseball" },
      { name: "Basketball", href: "/kids-basketball", translationKey: "basketball" },
      { name: "Football", href: "/kids-football", translationKey: "football" },
      { name: "Golf", href: "/kids-golf", translationKey: "golf" },
      { name: "Outdoor", href: "/kids-outdoor", translationKey: "outdoor" },
      { name: "Running", href: "/kids-running", translationKey: "running" },
      { name: "Soccer", href: "/kids-soccer", translationKey: "soccer" },
      { name: "Volleyball", href: "/kids-volleyball", translationKey: "volleyball" },
    ],
  },
];

export const kidsMenuColumns = buildKidsMegaMenuColumns(kidsMenuData);
