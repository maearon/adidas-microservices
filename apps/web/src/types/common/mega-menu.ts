// types/common/mega-menu.ts

// MenuCategory: category có thể có submenu (items)
export interface MenuCategory {
  title: string
  titleHref?: string      // link chính cho category
  description?: string    // optional description
  items: { name: string; href: string; translationKey?: string }[]
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
  sale: string;
  newTrending: string;
}
