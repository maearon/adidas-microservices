// 📁 @/lib/mappers/product-to-wishlist.ts

import type { Product } from "@/types/product";
import type { WishlistItem } from "@/types/wish";

/**
 * Map a full Product object to a WishlistItem
 * Ensures type safety and normalizes ID and price.
 */
export function mapProductToWishlistItem(product: Product): WishlistItem {
  const variant = product.variants?.[0]
  return {
    id: Number(variant?.id ?? product.id),
    productId: String(product.id),
    variantId: variant?.id ? String(variant.id) : undefined,
    name: product.name || "Unknown Product",
    sport: product.sport,
    price: String(product.price),
    image:
      variant?.avatar_url ||
      product.main_image_url ||
      product.image ||
      product.image_url ||
      "/placeholder.png",
    category: product.category,
    url: product.url,
  }
}
