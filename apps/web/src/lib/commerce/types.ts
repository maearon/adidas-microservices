import type { CartItem } from "@/store/cartSlice"
import type { WishlistItem } from "@/types/wish"

export const GUEST_CART_KEY = "guestCartItems"
export const GUEST_WISH_KEY = "guestWishItems"
export const GUEST_CART_ID_KEY = "guestCartId"
export const GUEST_WISH_ID_KEY = "guestWishId"

export interface StoredCartLine {
  variantId: string
  productId: string
  quantity: number
  size?: string
  addedAt: number
}

export interface StoredWishLine {
  variantId: string
  productId: string
  addedAt: number
}

export interface CartApiItem extends CartItem {
  productId: string
  variantId: string
  sport?: string
  url?: string
}

export interface WishApiItem extends WishlistItem {
  productId: string
  variantId: string
}

export interface SyncPayload {
  guestCartId?: string | null
  guestWishId?: string | null
  cartLines?: StoredCartLine[]
  wishLines?: StoredWishLine[]
}
