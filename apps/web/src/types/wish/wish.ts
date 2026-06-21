// 📁 @types/wish.ts

import type { Product } from '@/types/product/product'

export interface WishItem {
  id: number
  product: Product
}

export interface WishlistItem {
  id: number
  productId?: string
  variantId?: string
  variantCode?: string
  slug?: string
  name: string
  price: string
  color?: string
  sport?: string
  image: string
  category?: string
  url?: string
}

export interface WishlistState {
  items: WishlistItem[]
}
