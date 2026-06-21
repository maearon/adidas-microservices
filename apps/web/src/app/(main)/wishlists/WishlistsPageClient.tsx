"use client"

import { useSelector } from "react-redux"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { addToCart } from "@/store/cartSlice"
import { removeFromWishlist } from "@/store/wishlistSlice"
import WishlistAppPromo from "@/components/commerce/WishlistAppPromo"
import WishlistProductCard from "@/components/commerce/WishlistProductCard"
import HistoryView from "@/components/HistoryView"
import { useTranslations } from "@/hooks/useTranslations"
import { getGuestWishId, setGuestWishId } from "@/lib/commerce/local-storage"
import { selectUser } from "@/store/sessionSlice"
import { WISHLIST_PAGE_SHELL } from "@/components/commerce/commerce-page-shell"
import type { WishlistItem } from "@/types/wish"

export default function WishlistsPageClient() {
  const dispatch = useAppDispatch()
  const t = useTranslations("categoryPages")
  const wishlistItems = useAppSelector((state) => state.wishlist.items)
  const { value: user } = useSelector(selectUser)

  const handleRemove = async (item: WishlistItem) => {
    dispatch(removeFromWishlist(item.id))

    if (!item.variantId) return

    try {
      const guestWishId = getGuestWishId()
      const params = new URLSearchParams({ variantId: String(item.variantId) })
      if (guestWishId && !user?.id) params.set("guestWishId", guestWishId)

      const res = await fetch(`/api/wishlist?${params.toString()}`, { method: "DELETE" })
      if (!res.ok) return
      const data = await res.json()
      if (data.guestWishId) setGuestWishId(data.guestWishId)
    } catch (error) {
      console.error("Failed to remove wishlist item", error)
    }
  }

  const handleAddToBag = (item: WishlistItem) => {
    dispatch(
      addToCart({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        price: Number(String(item.price).replace(/[^0-9.-]+/g, "")) || 0,
        image: item.image,
        color: item.color ?? item.category ?? "Default",
        size: "M",
        category: item.category,
      }),
    )
  }

  const pageShell = (content: React.ReactNode) => (
    <div className={WISHLIST_PAGE_SHELL}>{content}</div>
  )

  const recentlyViewed = (
    <div className="border-t border-border pb-8 pt-8">
      <div className={`${WISHLIST_PAGE_SHELL} border-t border-border pb-8 pt-8`}>
        <HistoryView
          title={t?.recentlyViewedItems ?? "RECENTLY VIEWED ITEMS"}
          showIndicatorsInProductCarousel
        />
      </div>
    </div>
  )

  if (!wishlistItems.length) {
    return (
      <>
        {pageShell(
          <>
            <h1 className="mb-4 text-2xl font-bold uppercase tracking-tight text-foreground sm:text-[28px]">
              {t?.myWishlist ?? "MY WISHLIST"}{" "}
              <span className="font-normal normal-case">
                (0 {t?.itemsLabel ?? "items"})
              </span>
            </h1>
            <p className="mb-8 max-w-3xl text-sm text-foreground sm:text-base">
              {t?.wishlistEmptyCopy ??
                "You haven't saved any items to your wishlist yet. Start shopping and add your favorite items to your wishlist."}
            </p>
            <div className="mb-10">
              <WishlistAppPromo />
            </div>
          </>,
        )}
        {recentlyViewed}
      </>
    )
  }

  return (
    <>
      {pageShell(
        <>
          <h1 className="mb-8 text-2xl font-bold uppercase tracking-tight text-foreground sm:text-[28px]">
            {t?.myWishlist ?? "MY WISHLIST"}{" "}
            <span className="font-normal normal-case">
              ({wishlistItems.length} {t?.itemsLabel ?? "items"})
            </span>
          </h1>

          <div className="mb-12 grid grid-cols-1 gap-x-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {wishlistItems.map((item) => (
              <WishlistProductCard
                key={`${item.id}-${item.variantId ?? "default"}`}
                item={item}
                addToBagLabel={t?.addToBag ?? "Add to bag"}
                onRemove={handleRemove}
                onAddToBag={handleAddToBag}
              />
            ))}
          </div>

          <div className="mb-12">
            <WishlistAppPromo />
          </div>
        </>,
      )}
      {recentlyViewed}
    </>
  )
}
