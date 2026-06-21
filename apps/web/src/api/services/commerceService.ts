import type { SyncPayload } from "@/lib/commerce/types"
import type { CartItem } from "@/store/cartSlice"
import type { WishlistItem } from "@/types/wish"

const CART_URL = "/api/cart"
const WISHLIST_URL = "/api/wishlist"
const RECOMMENDATIONS_URL = "/api/products/recommendations"

async function commerceFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText)
    throw new Error(`Commerce API ${url} failed (${res.status}): ${body}`)
  }

  return res.json() as Promise<T>
}

export async function fetchCart() {
  return commerceFetch<{ items: CartItem[] }>(CART_URL)
}

export async function syncCart(payload: SyncPayload) {
  return commerceFetch<{ items: CartItem[]; synced?: boolean }>(CART_URL, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

export async function fetchWishlist() {
  return commerceFetch<{ items: WishlistItem[] }>(WISHLIST_URL)
}

export async function syncWishlist(payload: SyncPayload) {
  return commerceFetch<{ items: WishlistItem[]; synced?: boolean }>(WISHLIST_URL, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
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
  if (params.limit !== undefined) search.set("limit", String(params.limit))

  const query = search.toString()
  const url = query ? `${RECOMMENDATIONS_URL}?${query}` : RECOMMENDATIONS_URL
  return commerceFetch<{ products: unknown[] }>(url)
}
