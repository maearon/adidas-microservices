"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Variant } from "@/types/product"
import { slugify } from "@/utils/slugtify"
import { cn } from "@/lib/utils"

interface ProductVariantCarouselProps {
  variants: Variant[]
  activeImage: string
  onHover: (src: string) => void
}

export default function ProductVariantCarousel({
  variants,
  activeImage,
  onHover,
}: ProductVariantCarouselProps) {
  const [scrollIndex, setScrollIndex] = useState(0)

  const visibleCount = 6
  const totalVariants = variants.length

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

  const visibleVariants = variants.slice(
    scrollIndex,
    scrollIndex + visibleCount
  )

  return (
    <div className="flex items-center space-x-1 mt-2 px-2">
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
          const isActive = variant.avatar_url === activeImage
          const variantSlug = `/${slugify(variant.name || "product")}/${variant.variant_code}.html`

          return (
            <Link
              key={variant.id ?? idx}
              href={variantSlug}
              onMouseEnter={() => variant.avatar_url && onHover(variant.avatar_url)}
              className={cn(
                "relative w-8 h-8 rounded-none overflow-hidden cursor-pointer transition-all border",
                isActive
                  ? "border-black border-b-[3px]"
                  : "border-gray-200 hover:border-gray-400"
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
