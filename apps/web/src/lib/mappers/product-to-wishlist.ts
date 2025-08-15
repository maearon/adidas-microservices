// 📁 @/lib/mappers/product-to-wishlist.ts

import type { WishlistItem } from "@/types/wish"

interface PartialProductForWishlist {
  id: number
  name: string
  price: string
  sport?: string
  image?: string
  image_url?: string
  category?: string
  url?: string
}

export function mapProductToWishlistItem(product: PartialProductForWishlist): WishlistItem {
  return {
    id: product.id,
    name: product.name,
    sport: product.sport,
    price: product.price,
    image: product.image || product.image_url || "/placeholder.png",
    category: product.category,
    url: product.url,
  }
}
