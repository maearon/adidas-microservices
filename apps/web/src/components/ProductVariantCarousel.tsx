"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Product, Variant } from "@/types/product"
import { slugify } from "@/utils/slugtify"
import { cn } from "@/lib/utils"

interface ProductVariantCarouselProps {
  product: Product
  currentVariant: Variant
  onHover: (variant: Variant,  url: string) => void
}

export default function ProductVariantCarousel({
  product,
  currentVariant,
  onHover,
}: ProductVariantCarouselProps) {
  const [scrollIndex, setScrollIndex] = useState(0)

  const visibleCount = 6
  const totalVariants = product.variants.length

  const canScrollLeft = scrollIndex > 0
  const canScrollRight = scrollIndex + visibleCount < totalVariants

  const handleScrollLeft = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setScrollIndex((prev) => Math.max(0, prev - 1))
  }

  const handleScrollRight = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setScrollIndex((prev) =>
      Math.min(totalVariants - visibleCount, prev + 1)
    )
  }

  const visibleVariants = product.variants.slice(
    scrollIndex,
    scrollIndex + visibleCount
  )

  return (
    <div className="flex items-center space-x-1">
      {/* Left scroll button */}
      {canScrollLeft && (
        <button
          onClick={handleScrollLeft}
          className="p-1 hover:bg-gray-100 rounded-full bg-white shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Variant thumbnails */}
      <div className="flex gap-1 overflow-hidden">
        {visibleVariants.map((variant, idx) => {
          const isActive = variant.variant_code === currentVariant.variant_code
          const variantSlug = `/${slugify(product.name || "f50-messi-elite-firm-ground-cleats")}/${variant?.variant_code}.html`

          return (
            <Link
              key={variant.id ?? idx}
              href={variantSlug}
              onMouseEnter={() => 
                onHover(variant, variantSlug) // 👈 pass up to parent variant and url
              }
              className={cn(
                "relative w-8 h-8 rounded-none overflow-hidden cursor-pointer transition-all",
                isActive
                  ? "border-b-2 border-b-black dark:border-b-[#E32B2B]"
                  : "border-b-2 border-b-transparent"
              )}
            >
              {variant.avatar_url && (
                <Image
                  src={variant.avatar_url}
                  alt={`Variant ${variant.color || idx}`}
                  fill
                  className="object-cover"
                />
              )}
            </Link>
          )
        })}
      </div>

      {/* Right scroll button */}
      {canScrollRight && (
        <button
          onClick={handleScrollRight}
          className="p-1 hover:bg-gray-100 rounded-full bg-white shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
