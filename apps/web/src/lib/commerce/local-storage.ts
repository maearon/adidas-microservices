import type { CartItem } from "@/store/cartSlice"
import type { WishlistItem } from "@/types/wish"
import { cartLineKey, wishItemKey } from "@/lib/commerce/line-keys"
import { GUEST_CART_KEY, GUEST_WISH_KEY, type StoredCartLine, type StoredWishLine } from "@/lib/commerce/types"

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

function resolveVariantId(item: { variantId?: string; id?: number | string }) {
  if (item.variantId) return String(item.variantId)
  if (item.id !== undefined && item.id !== null) return String(item.id)
  return null
}

function resolveProductId(item: { productId?: string; id?: number | string }) {
  if (item.productId) return String(item.productId)
  if (item.id !== undefined && item.id !== null) return String(item.id)
  return null
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
  const map = new Map<string, StoredCartLine>()

  for (const item of items) {
    const variantId = resolveVariantId(item)
    const productId = resolveProductId(item)
    if (!variantId || !productId) continue

    const key = cartLineKey(item)
    const existing = map.get(key)

    if (existing) {
      existing.quantity += item.quantity
    } else {
      map.set(key, {
        variantId,
        productId,
        quantity: item.quantity,
        size: item.size,
        addedAt: Date.now(),
      })
    }
  }

  return [...map.values()]
}

export function wishItemsToStoredLines(items: WishlistItem[]): StoredWishLine[] {
  const map = new Map<string, StoredWishLine>()

  for (const item of items) {
    const variantId = resolveVariantId(item)
    const productId = resolveProductId(item)
    if (!variantId || !productId) continue

    const key = wishItemKey(item)
    if (map.has(key)) continue

    map.set(key, {
      variantId,
      productId,
      addedAt: Date.now(),
    })
  }

  return [...map.values()]
}

/** Clear guest localStorage after merge into user account. */
export function clearGuestCommerceKeys() {
  if (typeof window === "undefined") return
  localStorage.removeItem(GUEST_CART_KEY)
  localStorage.removeItem(GUEST_WISH_KEY)
  // legacy keys from older builds
  localStorage.removeItem("guestCartId")
  localStorage.removeItem("guestWishId")
}
