"use client"

import { ProductData } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { formatRelativeDate } from "@/lib/utils"

interface ProductProps {
  product: ProductData
}

export default function Product({ product }: ProductProps) {
  const imageUrl = product.image_urls[0] || "/placeholder.svg"

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-2xl bg-card shadow-xs transition hover:shadow-md"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl">
        <Image
          src={imageUrl}
          alt={product.name || `Image first of ${product.id}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4 space-y-1">
        <h3 className="text-sm font-semibold leading-snug line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {product.description_p}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {formatRelativeDate(product.created_at)}
        </p>
      </div>
    </Link>
  )
}
