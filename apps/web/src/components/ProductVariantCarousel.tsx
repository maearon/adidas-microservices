"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Product, Variant } from "@/types/product"
import { slugify } from "@/utils/slugify"
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
    <div className="flex items-center">
      {/* Left scroll button */}
      {canScrollLeft && (
        <button
          onClick={handleScrollLeft}
          className="p-1 rounded-none 
          bg-white text-black hover:bg-black hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Variant thumbnails */}
      <div className="flex overflow-hidden mt-[1px]">
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
              {(() => {
                const thumb =
                  variant?.avatar_url?.trim() ||
                  variant?.image_urls?.[0] ||
                  product.main_image_url ||
                  "/placeholder.png"

                return (
                  <Image
                    src={thumb}
                    alt={`Variant ${variant.color || idx}`}
                    fill
                    className="object-cover"
                  />
                )
              })()}
            </Link>
          )
        })}
      </div>

      {/* Right scroll button */}
      {canScrollRight && (
        <button
          onClick={handleScrollRight}
          className="p-1 rounded-none 
          bg-white text-black hover:bg-black hover:text-white"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
