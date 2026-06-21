"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Trash2 } from "lucide-react"
import ProductPrice from "@/components/ProductCardPrice"
import CartQuantitySelect from "@/components/commerce/CartQuantitySelect"
import { resolveCommerceItemUrl } from "@/lib/commerce/product-url"
import { useTranslations } from "@/hooks/useTranslations"
import type { CartItem } from "@/store/cartSlice"

type CartLineItemProps = {
  item: CartItem
  onRemove: (id: number) => void
  onMoveToWishlist: (item: CartItem) => void
  onUpdateQuantity: (id: number, quantity: number) => void
}

export default function CartLineItem({
  item,
  onRemove,
  onMoveToWishlist,
  onUpdateQuantity,
}: CartLineItemProps) {
  const t = useTranslations("commerce")
  const productUrl = resolveCommerceItemUrl(item)

  return (
    <article className="border border-border bg-background">
      <div className="flex">
        <Link
          href={productUrl}
          className="relative h-[180px] w-[180px] shrink-0 overflow-hidden bg-[#EBEDEE] dark:bg-neutral-900 sm:h-[238px] sm:w-[238px]"
        >
          <Image
            src={item.image || "/placeholder.png"}
            alt={item.name}
            fill
            sizes="238px"
            className="object-cover"
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-1 gap-3 sm:gap-4">
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="text-base font-bold leading-snug text-foreground">
                <Link href={productUrl} className="hover:underline">
                  {item.name}
                </Link>
              </h3>
              {item.color ? (
                <p className="text-sm leading-snug text-foreground">{item.color}</p>
              ) : null}
              {item.size ? (
                <p className="text-sm leading-snug text-foreground">
                  {t?.cart?.size ?? "Size:"} {item.size}
                </p>
              ) : null}
              <div className="pt-1">
                <Image
                  src="/assets/payment/prime-delivery.svg"
                  alt={t?.cart?.primeDelivery ?? "Prime Delivery"}
                  width={60}
                  height={16}
                  className="object-contain dark:invert"
                />
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-center gap-4 text-foreground">
              <button
                type="button"
                aria-label={t?.cart?.removeItem ?? "Remove item"}
                onClick={() => onRemove(item.id)}
                className="hover:opacity-70"
              >
                <Trash2 className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                aria-label={t?.cart?.moveToWishlist ?? "Move to wishlist"}
                onClick={() => onMoveToWishlist(item)}
                className="hover:opacity-70"
              >
                <Heart className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div className="mt-auto flex items-end justify-between gap-4 pt-4 sm:pt-6">
            <CartQuantitySelect
              value={item.quantity}
              onChange={(quantity) => onUpdateQuantity(item.id, quantity)}
            />

            <p className="text-base font-bold text-foreground">
              <ProductPrice
                price={item.price * item.quantity}
                compareAtPrice={
                  item.compareAtPrice ? item.compareAtPrice * item.quantity : null
                }
              />
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
