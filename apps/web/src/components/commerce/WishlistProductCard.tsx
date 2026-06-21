"use client"

import Image from "next/image"
import Link from "next/link"
import ProductPrice from "@/components/ProductCardPrice"
import AddToBagButton from "@/components/commerce/AddToBagButton"
import { AdidasCloseButton } from "@/components/ui/adidas-close-button"
import type { WishlistItem } from "@/types/wish"

type WishlistProductCardProps = {
  item: WishlistItem
  addToBagLabel?: string
  onRemove: (item: WishlistItem) => void
  onAddToBag: (item: WishlistItem) => void
}

export default function WishlistProductCard({
  item,
  addToBagLabel = "Add to bag",
  onRemove,
  onAddToBag,
}: WishlistProductCardProps) {
  const price = Number(String(item.price).replace(/[^0-9.-]+/g, "")) || 0

  return (
    <article className="flex w-full flex-col">
      <div className="relative mb-4 aspect-square w-full overflow-hidden bg-[#EBEDEE] dark:bg-neutral-900">
        <Link href={item.url ?? "#"} className="block h-full w-full">
          <Image
            src={item.image || "/placeholder.png"}
            alt={item.name}
            fill
            sizes="(max-width: 1024px) 100vw, 364px"
            className="object-cover"
          />
        </Link>
        <AdidasCloseButton
          variant="panel"
          onClick={() => onRemove(item)}
          ariaLabel="Remove from wishlist"
          wrapperClassName="absolute right-0 top-0 z-10"
        />
      </div>

      <div className="flex w-full flex-1 flex-col space-y-1">
        <h2 className="text-sm font-bold leading-snug text-foreground">
          <Link href={item.url ?? "#"}>{item.name}</Link>
        </h2>
        <p className="text-sm font-bold text-foreground">
          <ProductPrice price={price} />
        </p>
        {item.color || item.category ? (
          <p className="text-sm text-muted-foreground">
            Color: {item.color ?? item.category}
          </p>
        ) : null}
        <div className="mt-auto w-full pt-3">
          <AddToBagButton label={addToBagLabel} onClick={() => onAddToBag(item)} />
        </div>
      </div>
    </article>
  )
}
