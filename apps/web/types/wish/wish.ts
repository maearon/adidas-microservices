// 📁 @types/wish.ts

import type { Product } from '@/types/product/product'

export interface WishItem {
  id: number
  product: Product
}

export interface WishlistItem {
  id: number
  name: string
  price: string
  sport?: string
  image: string
  category?: string
  url?:string
}

export interface WishlistState {
  items: WishlistItem[]
}
