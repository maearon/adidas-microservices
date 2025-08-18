"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Variant } from "@/types/product"
import { slugify } from "@/utils/slugtify"
import { cn } from "@/lib/utils"

interface ProductVariantCarouselProps {
  productName: string
  variants: Variant[]
  activeImage: string
  onHover: (src: string, url: string) => void
}

export default function ProductVariantCarousel({
  productName = "f50-messi-elite-firm-ground-cleats",
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
          const isActive = variant.variant_code === variants?.[0].variant_code ?
           variant.avatar_url === activeImage ? true : false
           : variant.avatar_url === activeImage ? true : false
          const variantSlug = `/${slugify(productName || "f50-messi-elite-firm-ground-cleats")}/${variant?.variant_code}.html`

          return (
            <Link
              key={variant.id ?? idx}
              href={variantSlug}
              onMouseEnter={() => 
                variant.avatar_url && onHover(variant.avatar_url, variantSlug) // 👈 pass up to parent url and src
              } 
              className={cn(
                "relative w-8 h-8 rounded-none overflow-hidden cursor-pointer transition-all",
                isActive
                  ? "border-b-2 border-b-black dark:border-b-[#538E76]"
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
