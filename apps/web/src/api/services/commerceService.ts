import axiosInstance from "@/lib/axios"
import type { SyncPayload } from "@/lib/commerce/types"
import type { CartItem } from "@/store/cartSlice"
import type { WishlistItem } from "@/types/wish"

const CART_URL = "/api/cart"
const WISHLIST_URL = "/api/wishlist"
const RECOMMENDATIONS_URL = "/api/products/recommendations"

export async function fetchCart() {
  const { data } = await axiosInstance.get<{ items: CartItem[] }>(CART_URL)
  return data
}

export async function syncCart(payload: SyncPayload) {
  const { data } = await axiosInstance.put<{ items: CartItem[]; synced?: boolean }>(
    CART_URL,
    payload,
  )
  return data
}

export async function fetchWishlist() {
  const { data } = await axiosInstance.get<{ items: WishlistItem[] }>(WISHLIST_URL)
  return data
}

export async function syncWishlist(payload: SyncPayload) {
  const { data } = await axiosInstance.put<{ items: WishlistItem[]; synced?: boolean }>(
    WISHLIST_URL,
    payload,
  )
  return data
}

export async function fetchRecommendations(params: {
  strategy?: string
  productId?: string
  category?: string
  limit?: number
}) {
  const { data } = await axiosInstance.get<{ products: unknown[] }>(RECOMMENDATIONS_URL, {
    params: {
      strategy: params.strategy,
      productId: params.productId,
      category: params.category,
      limit: params.limit,
    },
  })
  return data
}
