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
  setGuestCartId,
  setGuestWishId,
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
  const persistTimeoutRef = useRef<number | null>(null)

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

          setGuestCartId(cartRes.guestCartId)
          dispatch(setCartItems(cartRes.items))
          dispatch(setWishlistItems(wishRes.items))
          clearGuestCommerceKeys()
        } else {
          const localCart = loadGuestCartItems()
          const localWish = loadGuestWishItems()

          if (localCart.length) {
            dispatch(setCartItems(localCart))
          } else {
            const cartRes = await fetchCart(getGuestCartId())
            if (cancelled) return
            setGuestCartId(cartRes.guestCartId)
            dispatch(setCartItems(cartRes.items))
          }

          if (localWish.length) {
            dispatch(setWishlistItems(localWish))
          } else {
            const wishRes = await fetchWishlist(getGuestWishId())
            if (cancelled) return
            if (wishRes.guestWishId) setGuestWishId(wishRes.guestWishId)
            dispatch(setWishlistItems(wishRes.items))
          }
        }
      } catch (error) {
        console.error("Commerce hydrate failed", error)
        dispatch(setCartItems(loadGuestCartItems()))
        dispatch(setWishlistItems(loadGuestWishItems()))
      } finally {
        hydratedRef.current = true
      }
    }

    hydrate()

    return () => {
      cancelled = true
    }
  }, [dispatch, status, user?.id])

  useEffect(() => {
    if (!hydratedRef.current || user?.id) return

    if (persistTimeoutRef.current) {
      window.clearTimeout(persistTimeoutRef.current)
    }

    persistTimeoutRef.current = window.setTimeout(() => {
      saveGuestCartItems(cartItems)
      saveGuestWishItems(wishlistItems)
    }, 300)

    return () => {
      if (persistTimeoutRef.current) {
        window.clearTimeout(persistTimeoutRef.current)
      }
    }
  }, [cartItems, wishlistItems, user?.id])

  return children
}
