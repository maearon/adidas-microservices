"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { removeFromCart, updateQuantity } from "@/store/cartSlice"
import { addToWishlist } from "@/store/wishlistSlice"
import { Button } from "@/components/ui/button"
import ProductCarousel from "@/components/product-carousel"
import HistoryView from "@/components/HistoryView"
import CommerceTrustSignals from "@/components/commerce/CommerceTrustSignals"
import CartLineItem from "@/components/commerce/CartLineItem"
import OrderSummarySidebar from "@/components/commerce/OrderSummarySidebar"
import {
  CART_PAGE_SHELL,
  CART_TITLE_CLASS,
  CART_TITLE_COUNT_CLASS,
  COMMERCE_SECTION_TITLE_CLASS,
} from "@/components/commerce/commerce-page-shell"
import { fetchRecommendations } from "@/lib/commerce/commerce-api"
import { useTranslations } from "@/hooks/useTranslations"
import type { CartItem } from "@/types/cart"
import type { Product } from "@/types/product"

export default function CartPageClient() {
  const t = useTranslations("categoryPages")
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector((state) => state.cart.items)
  const [topPicks, setTopPicks] = useState<Product[]>([])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const originalTotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.compareAtPrice) || Number(item.price) || 0) * item.quantity,
    0,
  )
  const saleAmount = Math.max(originalTotal - subtotal, 0)
  const salesTax = subtotal * 0.12
  const total = subtotal + salesTax
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    fetchRecommendations({ strategy: "top-picks", limit: 12 })
      .then((res) => setTopPicks(res.products as Product[]))
      .catch(() => setTopPicks([]))
  }, [])

  const bagTitle = (
    <h1 className={`mb-2 ${CART_TITLE_CLASS}`}>
      {t?.yourBag ?? "YOUR BAG"}{" "}
      <span className={CART_TITLE_COUNT_CLASS}>
        ({totalItems} {t?.itemsLabel ?? "items"})
      </span>
    </h1>
  )

  const shippingBanner = (
    <div className="mb-8 bg-[#C5D5E3] px-4 py-4 text-sm text-foreground dark:bg-neutral-800">
      <p className="font-bold uppercase">Free shipping unlocked</p>
      <p className="mt-1 leading-relaxed">
        Your FIFA World Cup 26™ gear unlocks free shipping with any method on your entire bag,
        be ready for the next match.{" "}
        <button type="button" className="underline">
          Terms apply
        </button>
      </p>
    </div>
  )

  const topPicksSection =
    topPicks.length > 0 ? (
      <section className="mt-10 border-t border-border pt-8">
        <h2 className={`${COMMERCE_SECTION_TITLE_CLASS} mb-6`}>
          {t?.topPicks ?? "TOP PICKS FOR YOU"}
        </h2>
        <ProductCarousel products={topPicks} showIndicators />
      </section>
    ) : null

  const recentlyViewedSection = (
    <div className="mt-10 border-t border-border pt-8">
      <HistoryView
        title={t?.recentlyViewedItems ?? "RECENTLY VIEWED ITEMS"}
        showIndicatorsInProductCarousel
      />
    </div>
  )

  if (cartItems.length === 0) {
    return (
      <div className={CART_PAGE_SHELL}>
        {bagTitle}

        <p className="mb-2 text-base font-bold text-foreground">
          {t?.bagEmptySubtitle ?? "Your bag is empty"}
        </p>
        <p className="mb-8 max-w-2xl text-sm text-foreground sm:text-base">
          {t?.bagEmptyCopy ??
            "Once you add something to your bag, it will appear here. Ready to get started?"}
        </p>

        <div className="mb-12 max-w-[220px]">
          <Button
            border
            theme="black"
            showArrow
            pressEffect
            shadow
            href="/"
            className="h-12 w-full normal-case"
          >
            {t?.getStarted ?? "Get started"}
          </Button>
        </div>

        {recentlyViewedSection}
        {topPicksSection}
        <CommerceTrustSignals />
      </div>
    )
  }

  return (
    <div className={CART_PAGE_SHELL}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_416px] lg:gap-12">
        <div>
          {bagTitle}
          <p className="mb-6 text-sm text-foreground sm:text-base">
            Items in your bag are not reserved — check out now to make them yours.
          </p>

          {shippingBanner}

          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartLineItem
                key={`${item.id}-${item.size}-${item.color}`}
                item={item}
                onRemove={(id) => dispatch(removeFromCart(id))}
                onMoveToWishlist={(cartItem: CartItem) => {
                  dispatch(
                    addToWishlist({
                      id: cartItem.id,
                      productId: cartItem.productId,
                      variantId: cartItem.variantId,
                      variantCode: cartItem.variantCode,
                      slug: cartItem.slug,
                      url: cartItem.url,
                      name: cartItem.name,
                      price: String(cartItem.price),
                      image: cartItem.image,
                      category: cartItem.color,
                    }),
                  )
                  dispatch(removeFromCart(cartItem.id))
                }}
                onUpdateQuantity={(id, quantity) =>
                  dispatch(updateQuantity({ id, quantity }))
                }
              />
            ))}
          </div>

          {topPicksSection}
          <CommerceTrustSignals />
        </div>

        <aside>
          <OrderSummarySidebar
            totalItems={totalItems}
            subtotal={subtotal}
            originalTotal={originalTotal}
            saleAmount={saleAmount}
            salesTax={salesTax}
            total={total}
          />
        </aside>
      </div>
    </div>
  )
}
