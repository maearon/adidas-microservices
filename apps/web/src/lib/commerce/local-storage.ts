import type { CartItem } from "@/store/cartSlice"
import type { WishlistItem } from "@/types/wish"
import {
  GUEST_CART_ID_KEY,
  GUEST_CART_KEY,
  GUEST_WISH_ID_KEY,
  GUEST_WISH_KEY,
  type StoredCartLine,
  type StoredWishLine,
} from "@/lib/commerce/types"

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Failed to write ${key}`, error)
  }
}

export function getGuestCartId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(GUEST_CART_ID_KEY)
}

export function setGuestCartId(id: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(GUEST_CART_ID_KEY, id)
}

export function getGuestWishId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(GUEST_WISH_ID_KEY)
}

export function setGuestWishId(id: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(GUEST_WISH_ID_KEY, id)
}

export function loadGuestCartItems(): CartItem[] {
  return readJson<CartItem[]>(GUEST_CART_KEY) ?? []
}

export function saveGuestCartItems(items: CartItem[]) {
  writeJson(GUEST_CART_KEY, items)
}

export function loadGuestWishItems(): WishlistItem[] {
  return readJson<WishlistItem[]>(GUEST_WISH_KEY) ?? []
}

export function saveGuestWishItems(items: WishlistItem[]) {
  writeJson(GUEST_WISH_KEY, items)
}

export function cartItemsToStoredLines(items: CartItem[]): StoredCartLine[] {
  return items
    .filter((item) => item.variantId && item.productId)
    .map((item) => ({
      variantId: String(item.variantId),
      productId: String(item.productId),
      quantity: item.quantity,
      size: item.size,
      addedAt: Date.now(),
    }))
}

export function wishItemsToStoredLines(items: WishlistItem[]): StoredWishLine[] {
  return items
    .filter((item) => item.variantId && item.productId)
    .map((item) => ({
      variantId: String(item.variantId),
      productId: String(item.productId),
      addedAt: Date.now(),
    }))
}

export function clearGuestCommerceKeys() {
  if (typeof window === "undefined") return
  localStorage.removeItem(GUEST_CART_KEY)
  localStorage.removeItem(GUEST_WISH_KEY)
}
