import type { CartItem } from "@/store/cartSlice"
import type { WishlistItem } from "@/types/wish"

export function cartLineKey(item: Pick<CartItem, "variantId" | "id" | "size">) {
  const variantId = item.variantId ?? String(item.id)
  return `${variantId}|${item.size ?? ""}`
}

export function wishItemKey(item: Pick<WishlistItem, "variantId" | "id">) {
  return String(item.variantId ?? item.id)
}

export function isSameCartLine(
  a: Pick<CartItem, "variantId" | "id" | "size">,
  b: Pick<CartItem, "variantId" | "id" | "size">,
) {
  return cartLineKey(a) === cartLineKey(b)
}

export function isSameWishItem(
  a: Pick<WishlistItem, "variantId" | "id">,
  b: Pick<WishlistItem, "variantId" | "id">,
) {
  return wishItemKey(a) === wishItemKey(b)
}
