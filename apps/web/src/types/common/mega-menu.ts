// types/common/mega-menu.ts

export type MegaMenuLink = {
  name: string
  href: string
  translationKey?: string
}

export type MegaMenuSection = {
  heading?: string
  headingHref?: string
  headingTranslationKey?: string
  items: MegaMenuLink[]
  /** One blank line after this group — adidas SPORTS column spacing */
  gapAfter?: boolean
}

/** Desktop mega menu column — one equal grid column; may stack multiple sections */
export type MegaMenuColumn = {
  title?: string
  titleHref?: string
  translationKey?: string
  sections: MegaMenuSection[]
  /** Prime banner below section links */
  showPrimeBanner?: boolean
  /** Shop by Color block at bottom of column */
  showShopByColor?: boolean
  /** Bold link at column bottom (e.g. All Soccer) */
  footerLink?: MegaMenuLink
  /** Empty horizontal grid column before Other Sports */
  horizontalSpacer?: boolean
}

export type MegaMenuPromo = {
  href: string
  src: string
  alt: string
  title?: string
  titleTranslationKey?: string
  description?: string
  descriptionTranslationKey?: string
}

// MenuCategory: category có thể có submenu (items)
export interface MenuCategory {
  title: string
  titleHref?: string      // link chính cho category
  description?: string    // optional description
  items: MegaMenuLink[]
  translationKey?: string
}

// MenuLeaf: item đơn lẻ, không có submenu
export interface MenuLeaf {
  name: string
  href: string
  translationKey?: string
}

// LocaleMenuItem: menu chọn ngôn ngữ / quốc gia
export interface LocaleMenuItem {
  title: string
  value: string
  flag?: string
  items: [] // luôn rỗng để đồng nhất field items
}

// MenuItem: union type của 3 loại menu
export type MenuItem = MenuCategory | MenuLeaf | LocaleMenuItem

// MenuLevel: cấp menu hiện tại, chứa title và items
export interface MenuLevel {
  title: string
  items: MenuItem[]
  parentTitle?: string
}

// NavigationHistory: dùng để lưu lịch sử navigation trong mobile menu
export interface NavigationHistory {
  level: MenuLevel
  scrollPosition: number
}

export interface NavigationTranslations {
  menu: string;
  men: string;
  women: string;
  kids: string;
  backToSchool: string;
  fifaWorldCup26: string;
  sports: string;
  sale: string;
  newTrending: string;
}
