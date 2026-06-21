"use client"

import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setCartItems } from "@/store/cartSlice"
import { setWishlistItems } from "@/store/wishlistSlice"
import type { AppDispatch, RootState } from "@/store/store"
import {
  clearGuestCommerceKeys,
  loadGuestCartItems,
  loadGuestWishItems,
  saveGuestCartItems,
  saveGuestWishItems,
  cartItemsToStoredLines,
  wishItemsToStoredLines,
} from "@/lib/commerce/local-storage"
import { fetchCart, fetchWishlist, syncCart, syncWishlist } from "@/api/services/commerceService"
import { authClient } from "@/lib/auth-client"

/**
 * Guest: localStorage ↔ Redux only (no API, no guest DB).
 * Logged in: DB ↔ Redux via /api/cart and /api/wishlist.
 */
export default function CommerceSyncProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>()
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items)
  const { data: authSession, isPending: isAuthPending } = authClient.useSession()
  const authUserId = authSession?.user?.id

  const cartItemsRef = useRef(cartItems)
  const wishlistItemsRef = useRef(wishlistItems)
  cartItemsRef.current = cartItems
  wishlistItemsRef.current = wishlistItems

  const hydratedRef = useRef(false)
  const guestSaveReadyRef = useRef(false)
  const userPersistReadyRef = useRef(false)
  const userPersistTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (authUserId) return

    const persistGuest = () => {
      saveGuestCartItems(cartItemsRef.current)
      saveGuestWishItems(wishlistItemsRef.current)
    }

    window.addEventListener("pagehide", persistGuest)
    return () => window.removeEventListener("pagehide", persistGuest)
  }, [authUserId])

  useEffect(() => {
    if (isAuthPending) return

    let cancelled = false

    async function hydrateGuest() {
      guestSaveReadyRef.current = false
      userPersistReadyRef.current = false
      dispatch(setCartItems(loadGuestCartItems()))
      dispatch(setWishlistItems(loadGuestWishItems()))
      hydratedRef.current = true
      window.setTimeout(() => {
        guestSaveReadyRef.current = true
      }, 0)
    }

    async function hydrateLoggedIn() {
      userPersistReadyRef.current = false

      const localCart = loadGuestCartItems()
      const localWish = loadGuestWishItems()
      const guestCart = localCart.length > 0 ? localCart : cartItemsRef.current
      const guestWish = localWish.length > 0 ? localWish : wishlistItemsRef.current

      try {
        if (guestCart.length > 0 || guestWish.length > 0) {
          const [cartRes, wishRes] = await Promise.all([
            syncCart({
              cartLines: cartItemsToStoredLines(guestCart),
              fullReplace: true,
            }),
            syncWishlist({
              wishLines: wishItemsToStoredLines(guestWish),
              fullReplace: true,
            }),
          ])
          if (cancelled) return
          dispatch(setCartItems(cartRes.items))
          dispatch(setWishlistItems(wishRes.items))
          clearGuestCommerceKeys()
        } else {
          const [cartRes, wishRes] = await Promise.all([fetchCart(), fetchWishlist()])
          if (cancelled) return
          dispatch(setCartItems(cartRes.items))
          dispatch(setWishlistItems(wishRes.items))
        }
      } catch (error) {
        console.error("Commerce hydrate failed", error)
        if (!cancelled) {
          dispatch(setCartItems(guestCart))
          dispatch(setWishlistItems(guestWish))
        }
      } finally {
        if (!cancelled) {
          hydratedRef.current = true
          userPersistReadyRef.current = true
        }
      }
    }

    hydratedRef.current = false

    if (!authUserId) {
      hydrateGuest()
      return () => {
        cancelled = true
      }
    }

    hydrateLoggedIn()

    return () => {
      cancelled = true
    }
  }, [authUserId, isAuthPending, dispatch])

  useEffect(() => {
    if (isAuthPending || authUserId) return
    if (!hydratedRef.current || !guestSaveReadyRef.current) return

    saveGuestCartItems(cartItems)
    saveGuestWishItems(wishlistItems)
  }, [cartItems, wishlistItems, authUserId, isAuthPending])

  useEffect(() => {
    if (!authUserId) return

    const persistUser = () => {
      const cartLines = cartItemsToStoredLines(cartItemsRef.current)
      const wishLines = wishItemsToStoredLines(wishlistItemsRef.current)

      if (cartItemsRef.current.length > 0 && cartLines.length === 0) {
        console.error("Cart items missing productId/variantId — skipping DB sync")
        return
      }
      if (wishlistItemsRef.current.length > 0 && wishLines.length === 0) {
        console.error("Wishlist items missing productId/variantId — skipping DB sync")
        return
      }

      void syncCart({ cartLines, fullReplace: true }).catch((error) => {
        console.error("Failed to persist user cart", error)
      })
      void syncWishlist({ wishLines, fullReplace: true }).catch((error) => {
        console.error("Failed to persist user wishlist", error)
      })
    }

    window.addEventListener("pagehide", persistUser)
    return () => window.removeEventListener("pagehide", persistUser)
  }, [authUserId])

  useEffect(() => {
    if (!hydratedRef.current || !authUserId || !userPersistReadyRef.current) return

    if (userPersistTimeoutRef.current) {
      window.clearTimeout(userPersistTimeoutRef.current)
    }

    userPersistTimeoutRef.current = window.setTimeout(() => {
      const cartLines = cartItemsToStoredLines(cartItems)
      const wishLines = wishItemsToStoredLines(wishlistItems)

      if (cartItems.length > 0 && cartLines.length === 0) {
        console.error("Cart items missing productId/variantId — skipping DB sync")
        return
      }
      if (wishlistItems.length > 0 && wishLines.length === 0) {
        console.error("Wishlist items missing productId/variantId — skipping DB sync")
        return
      }

      void syncCart({ cartLines, fullReplace: true }).catch((error) => {
        console.error("Failed to persist user cart", error)
      })
      void syncWishlist({ wishLines, fullReplace: true }).catch((error) => {
        console.error("Failed to persist user wishlist", error)
      })
    }, 500)

    return () => {
      if (userPersistTimeoutRef.current) {
        window.clearTimeout(userPersistTimeoutRef.current)
      }
    }
  }, [cartItems, wishlistItems, authUserId])

  return children
}
