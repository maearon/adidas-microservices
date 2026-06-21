import type { CartItem } from "@/store/cartSlice"
import type { WishlistItem } from "@/types/wish"
import type { SyncPayload } from "@/lib/commerce/types"

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function fetchCart(guestCartId?: string | null) {
  const query = guestCartId ? `?guestCartId=${guestCartId}` : ""
  return parseJson<{ guestCartId?: string; items: CartItem[] }>(await fetch(`/api/cart${query}`))
}

export async function syncCart(payload: SyncPayload) {
  return parseJson<{ guestCartId?: string; items: CartItem[]; synced?: boolean }>(
    await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  )
}

export async function upsertCartItem(payload: {
  guestCartId?: string | null
  productId: string
  variantId: string
  quantity: number
  size?: string
}) {
  return parseJson<{ guestCartId: string; items: CartItem[] }>(
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  )
}

export async function removeCartItemApi(guestCartId: string, variantId: string) {
  return parseJson<{ guestCartId: string; items: CartItem[] }>(
    await fetch(`/api/cart?guestCartId=${guestCartId}&variantId=${variantId}`, {
      method: "DELETE",
    }),
  )
}

export async function fetchWishlist(guestWishId?: string | null) {
  const query = guestWishId ? `?guestWishId=${guestWishId}` : ""
  return parseJson<{ guestWishId?: string; items: WishlistItem[] }>(
    await fetch(`/api/wishlist${query}`),
  )
}

export async function syncWishlist(payload: SyncPayload) {
  return parseJson<{ guestWishId?: string; items: WishlistItem[] }>(
    await fetch("/api/wishlist", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  )
}

export async function fetchRecommendations(params: {
  strategy?: string
  productId?: string
  category?: string
  limit?: number
}) {
  const search = new URLSearchParams()
  if (params.strategy) search.set("strategy", params.strategy)
  if (params.productId) search.set("productId", params.productId)
  if (params.category) search.set("category", params.category)
  if (params.limit) search.set("limit", String(params.limit))

  return parseJson<{ products: unknown[] }>(
    await fetch(`/api/products/recommendations?${search.toString()}`),
  )
}
