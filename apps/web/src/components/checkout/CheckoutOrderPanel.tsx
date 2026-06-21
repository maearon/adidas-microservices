"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BaseButton } from "@/components/ui/base-button"
import ProductPrice from "@/components/ProductCardPrice"
import { COMMERCE_SECTION_TITLE_CLASS } from "@/components/commerce/commerce-page-shell"
import { useTheme } from "next-themes"
import type { CartItem } from "@/store/cartSlice"

type CheckoutOrderPanelProps = {
  cartItems: CartItem[]
  totalItems: number
  subtotal: number
  originalTotal: number
  saleAmount: number
  salesTax: number
  total: number
}

export default function CheckoutOrderPanel({
  cartItems,
  totalItems,
  subtotal,
  originalTotal,
  saleAmount,
  salesTax,
  total,
}: CheckoutOrderPanelProps) {
  const [showPromoCode, setShowPromoCode] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const monthly = (total / 12).toFixed(2)

  return (
    <div className="w-full lg:sticky lg:top-24 lg:max-w-[416px]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <h2 className={`${COMMERCE_SECTION_TITLE_CLASS} mb-0`}>Your Order</h2>
        <Link
          href="/cart"
          className="mt-2 shrink-0 text-sm font-bold uppercase underline underline-offset-2"
        >
          Edit
        </Link>
      </div>

      <div className="space-y-2 text-sm text-foreground">
        <div className="flex justify-between">
          <span>
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
          <ProductPrice price={subtotal} compareAtPrice={null} />
        </div>
        {saleAmount > 0 ? (
          <>
            <div className="flex justify-between">
              <span>Original price</span>
              <ProductPrice price={originalTotal} compareAtPrice={null} />
            </div>
            <div className="flex justify-between text-red-600">
              <span>Sale</span>
              <span>
                -<ProductPrice price={saleAmount} compareAtPrice={null} />
              </span>
            </div>
          </>
        ) : null}
        <div className="flex justify-between">
          <span>Sales Tax</span>
          <ProductPrice price={salesTax} compareAtPrice={null} />
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between border-t border-border pt-4 text-base font-bold">
          <span>Total</span>
          <ProductPrice price={total} compareAtPrice={null} />
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-[#2c2e2f] dark:text-neutral-300">
        As low as ${monthly}/mo at 0% APR with{" "}
        <span className="font-semibold text-foreground">PayPal</span>.{" "}
        <button type="button" className="underline">
          Learn more
        </button>
      </p>

      <div className="mt-6">
        <BaseButton
          variant="outline"
          onClick={() => setShowPromoCode(!showPromoCode)}
          className="h-auto w-full justify-start border-0 px-0 py-2 text-sm font-normal normal-case hover:bg-transparent"
        >
          <Image
            src="/assets/payment/promo-code.svg"
            alt=""
            width={24}
            height={14}
            className="mr-2 object-contain dark:invert"
          />
          Use a promo code
        </BaseButton>
        {showPromoCode ? (
          <div className="mt-2 flex gap-0">
            <Input
              placeholder="Enter your promo code"
              className="h-11 rounded-none border-foreground"
            />
            <Button
              pressEffect
              border
              shadowColorModeInWhiteTheme="black"
              theme={isDark ? "white" : "black"}
              showArrow={false}
              className="h-11 shrink-0 rounded-none px-6"
            >
              Apply
            </Button>
          </div>
        ) : null}
      </div>

      <div className="mt-8 space-y-6">
        {cartItems.map((item) => (
          <article key={item.id} className="flex gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-[#EBEDEE] dark:bg-neutral-900">
              <Image
                src={item.image || "/placeholder.png"}
                alt={item.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <h3 className="line-clamp-2 text-base font-bold leading-snug text-foreground">
                {item.name}
              </h3>
              <p className="text-base font-bold text-foreground">
                <ProductPrice price={item.price} compareAtPrice={item.compareAtPrice ?? null} />
              </p>
              <p className="text-sm text-foreground">
                Size: {item.size} / Quantity: {item.quantity}
              </p>
              {item.color ? (
                <p className="text-sm text-muted-foreground">{item.color}</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
