"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Variant } from "@/types/product"

interface ProductVariantCarouselProps {
  variants: Variant[]
  activeImage: string
  onHover: (src: string) => void
}

export default function ProductVariantCarousel({
  variants,
  activeImage,
  onHover
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
      {canScrollLeft && (
        <button
          onClick={handleScrollLeft}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      <div className="flex gap-1 overflow-hidden">
        {visibleVariants.map((variant, idx) => (
          <div
            key={idx}
            onMouseEnter={() => variant.image_url && onHover(variant.image_url)}
            onClick={(e) => e.preventDefault()}
            className={cn(
              "relative w-6 h-6 rounded overflow-hidden cursor-pointer border",
              variant.image_url === activeImage
                ? "border-black"
                : "border-transparent hover:border-gray-400"
            )}
          >
            {variant.image_url && (
              <Image
                src={variant.image_url}
                alt={`Variant ${idx}`}
                fill
                className="object-cover"
              />
            )}
          </div>
        ))}
      </div>
      {canScrollRight && (
        <button
          onClick={handleScrollRight}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
