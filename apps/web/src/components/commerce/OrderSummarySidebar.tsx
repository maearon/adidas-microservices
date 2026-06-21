"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BaseButton } from "@/components/ui/base-button"
import ProductPrice from "@/components/ProductCardPrice"
import { AcceptedPaymentMethods } from "@/components/commerce/cart-payment-methods"
import { COMMERCE_SECTION_TITLE_CLASS } from "@/components/commerce/commerce-page-shell"
import { useTheme } from "next-themes"

type OrderSummaryProps = {
  totalItems: number
  subtotal: number
  originalTotal: number
  saleAmount: number
  salesTax: number
  total: number
}

export default function OrderSummarySidebar({
  totalItems,
  subtotal,
  originalTotal,
  saleAmount,
  salesTax,
  total,
}: OrderSummaryProps) {
  const [showPromoCode, setShowPromoCode] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const monthly = (total / 12).toFixed(2)

  return (
    <div className="w-full lg:sticky lg:top-24 lg:max-w-[416px]">
      <h2 className={`${COMMERCE_SECTION_TITLE_CLASS} mb-6`}>Order Summary</h2>

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

      <div className="mt-6">
        <Button
          border
          href="/checkout"
          theme="black"
          shadow
          pressEffect
          showArrow
          fullWidth
          className="h-14 w-full normal-case"
        >
          Checkout
        </Button>
      </div>

      <AcceptedPaymentMethods showTitle />
    </div>
  )
}
