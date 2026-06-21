"use client"

import Image from "next/image"
import { ChevronDown, Heart, Trash2 } from "lucide-react"
import ProductPrice from "@/components/ProductCardPrice"
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
  return (
    <article className="border border-border bg-background">
      <div className="flex">
        <div className="relative h-[180px] w-[180px] shrink-0 overflow-hidden bg-[#EBEDEE] dark:bg-neutral-900 sm:h-[238px] sm:w-[238px]">
          <Image
            src={item.image || "/placeholder.png"}
            alt={item.name}
            fill
            sizes="238px"
            className="object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-1 gap-3 sm:gap-4">
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="text-base font-bold leading-snug text-foreground">{item.name}</h3>
              {item.color ? (
                <p className="text-sm leading-snug text-foreground">{item.color}</p>
              ) : null}
              {item.size ? (
                <p className="text-sm leading-snug text-foreground">Size: {item.size}</p>
              ) : null}
              <div className="pt-1">
                <Image
                  src="/assets/payment/prime-delivery.svg"
                  alt="Prime Delivery"
                  width={60}
                  height={16}
                  className="object-contain dark:invert"
                />
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-center gap-4 text-foreground">
              <button
                type="button"
                aria-label="Remove item"
                onClick={() => onRemove(item.id)}
                className="hover:opacity-70"
              >
                <Trash2 className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                aria-label="Move to wishlist"
                onClick={() => onMoveToWishlist(item)}
                className="hover:opacity-70"
              >
                <Heart className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div className="mt-auto flex items-end justify-between gap-4 pt-4 sm:pt-6">
            <div className="relative">
              <select
                value={item.quantity}
                onChange={(e) => onUpdateQuantity(item.id, Number.parseInt(e.target.value, 10))}
                aria-label="Qty"
                className="h-[51px] w-[100px] appearance-none border border-foreground bg-background py-[11px] pl-[14px] pr-9 text-sm outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
              />
            </div>

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
