// 📁 @/lib/mappers/product-to-wishlist.ts

import type { Product } from "@/types/product";
import type { WishlistItem } from "@/types/wish";

/**
 * Map a full Product object to a WishlistItem
 * Ensures type safety and normalizes ID and price.
 */
export function mapProductToWishlistItem(product: Product): WishlistItem {
  return {
    id: Number(product.id), // ✅ ép kiểu để luôn là number
    name: product.name || "Unknown Product",
    sport: product.sport,
    price: String(product.price), // ✅ đảm bảo là string
    image: product.image || product.image_url || "/placeholder.png",
    category: product.category,
    url: product.url,
  };
}
