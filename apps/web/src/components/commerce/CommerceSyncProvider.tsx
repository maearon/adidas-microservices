"use client"

import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setCartItems } from "@/store/cartSlice"
import { setWishlistItems } from "@/store/wishlistSlice"
import type { AppDispatch, RootState } from "@/store/store"
import {
  clearGuestCommerceKeys,
  getGuestCartId,
  getGuestWishId,
  loadGuestCartItems,
  loadGuestWishItems,
  saveGuestCartItems,
  saveGuestWishItems,
  cartItemsToStoredLines,
  wishItemsToStoredLines,
} from "@/lib/commerce/local-storage"
import { fetchCart, fetchWishlist, syncCart, syncWishlist } from "@/lib/commerce/commerce-api"
import { selectUser } from "@/store/sessionSlice"

export default function CommerceSyncProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>()
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items)
  const { value: user, status } = useSelector(selectUser)
  const hydratedRef = useRef(false)
  const guestPersistTimeoutRef = useRef<number | null>(null)
  const userPersistTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (status === "loading") return

    let cancelled = false

    async function hydrate() {
      try {
        if (user?.id) {
          const localCart = loadGuestCartItems()
          const localWish = loadGuestWishItems()
          const guestCartId = getGuestCartId()
          const guestWishId = getGuestWishId()
          const hasGuestData =
            localCart.length > 0 ||
            localWish.length > 0 ||
            Boolean(guestCartId) ||
            Boolean(guestWishId)

          if (hasGuestData) {
            const [cartRes, wishRes] = await Promise.all([
              syncCart({
                guestCartId,
                cartLines: cartItemsToStoredLines(localCart),
              }),
              syncWishlist({
                guestWishId,
                wishLines: wishItemsToStoredLines(localWish),
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
        } else {
          dispatch(setCartItems(loadGuestCartItems()))
          dispatch(setWishlistItems(loadGuestWishItems()))
        }
      } catch (error) {
        console.error("Commerce hydrate failed", error)
        if (user?.id) {
          try {
            const [cartRes, wishRes] = await Promise.all([fetchCart(), fetchWishlist()])
            if (!cancelled) {
              dispatch(setCartItems(cartRes.items))
              dispatch(setWishlistItems(wishRes.items))
            }
          } catch {
            dispatch(setCartItems([]))
            dispatch(setWishlistItems([]))
          }
        } else {
          dispatch(setCartItems(loadGuestCartItems()))
          dispatch(setWishlistItems(loadGuestWishItems()))
        }
      } finally {
        hydratedRef.current = true
      }
    }

    hydratedRef.current = false
    hydrate()

    return () => {
      cancelled = true
    }
  }, [dispatch, status, user?.id])

  useEffect(() => {
    if (!hydratedRef.current || user?.id) return

    if (guestPersistTimeoutRef.current) {
      window.clearTimeout(guestPersistTimeoutRef.current)
    }

    guestPersistTimeoutRef.current = window.setTimeout(() => {
      saveGuestCartItems(cartItems)
      saveGuestWishItems(wishlistItems)
    }, 300)

    return () => {
      if (guestPersistTimeoutRef.current) {
        window.clearTimeout(guestPersistTimeoutRef.current)
      }
    }
  }, [cartItems, wishlistItems, user?.id])

  useEffect(() => {
    if (!hydratedRef.current || !user?.id) return

    if (userPersistTimeoutRef.current) {
      window.clearTimeout(userPersistTimeoutRef.current)
    }

    userPersistTimeoutRef.current = window.setTimeout(() => {
      void syncCart({
        cartLines: cartItemsToStoredLines(cartItems),
        fullReplace: true,
      }).catch((error) => {
        console.error("Failed to persist user cart", error)
      })
      void syncWishlist({
        wishLines: wishItemsToStoredLines(wishlistItems),
        fullReplace: true,
      }).catch((error) => {
        console.error("Failed to persist user wishlist", error)
      })
    }, 500)

    return () => {
      if (userPersistTimeoutRef.current) {
        window.clearTimeout(userPersistTimeoutRef.current)
      }
    }
  }, [cartItems, wishlistItems, user?.id])

  return children
}
