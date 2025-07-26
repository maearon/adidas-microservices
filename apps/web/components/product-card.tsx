"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAppDispatch } from "@/store/hooks"
import { addToCart } from "@/store/cartSlice"
import WishButton from "./wish-button"
import ProductVariantCarousel from "./ProductVariantCarousel"
import { mapProductToWishlistItem } from "@/lib/mappers/product-to-wishlist"
import { slugify } from "@/utils/slugtify"
import type { ProductAsset, ProductVariation } from "@/types/product/product-adidas"
import type BreadcrumbItem from "@/types/bread-crumb"
import type { Variant } from "@/types/product"
import ProductPrice from "./ProductCardPrice"

interface ProductCardProps {
  slug?: string
  product: {
    id: number
    name?: string
    price?: string
    sport?: string
    tags?: string[]
    compare_at_price?: string
    image?: string
    image_url?: string
    hover_image_url?: string
    category?: string
    model_number?: string
    base_model_number?: string
    product_type?: string
    url?: string
    price_information?: {
      currentPrice: number
      standard_price: number
      standard_price_no_vat: number
    }
    description?: string
    attribute_list?: {
      brand?: string
      color?: string
      gender?: string
      sale?: boolean
    }
    breadcrumb_list?: BreadcrumbItem[]
    product_description?: {
      title?: string
      text?: string
      subtitle?: string
    }
    links?: {
      self: {
        href: string
      }
    }
    variation_list?: ProductVariation[]
    view_list?: ProductAsset[]
    variants: Variant[]
    __isPlaceholder?: boolean
  }
  showAddToBag?: boolean
  minimalMobile?: boolean
}

export default function ProductCard({ product, showAddToBag = false, minimalMobile = false }: ProductCardProps) {
  const dispatch = useAppDispatch()
  const defaultImage = product.variants?.[0]?.avatar_url ?? product.image ?? product.image_url ?? "/placeholder.png"
  const [currentImage, setCurrentImage] = useState(defaultImage)
  const isPlaceholder = product.__isPlaceholder || !product.name

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(
      addToCart({
        id: product.id,
        name: product.name || "Unknown Product",
        price: product.price || "0",
        image: currentImage,
        color: "Default",
        size: "M",
      }),
    )
  }

  const fallbackUrl = `/${slugify(product.name || "product")}/${product?.variants?.[0]?.variant_code}.html`
  const hasHoverImage = !!product.hover_image_url?.trim()
  const hasVariants = product.variants?.length > 1

  if (isPlaceholder) {
    return (
      <div className="border border-gray-200 rounded shadow-xs p-2 animate-pulse">
        <div className="relative aspect-square bg-gray-200 rounded mb-4" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
        {showAddToBag && <div className="h-10 bg-gray-300 rounded w-full" />}
      </div>
    )
  }

  return (
    <Link
      href={product.url ?? fallbackUrl}
      onMouseEnter={() =>
        setCurrentImage(product.variants?.[0]?.avatar_url || defaultImage)
      }
      onMouseLeave={() =>
        setCurrentImage(product.variants?.[0]?.avatar_url || defaultImage)
      }
    >
      <Card className="group flex flex-col justify-between border border-transparent hover:border-black transition-all duration-200 shadow-none cursor-pointer rounded-none overflow-visible">
        <CardContent className="p-0">
          {/* Image section */}
          <div className="relative aspect-square overflow-hidden group/image mb-3">
            {/* Main Image */}
            <Image
              src={currentImage || "/placeholder.svg"}
              alt={product?.name || ""}
              fill
              className={`object-cover transition-opacity duration-300 ${
                hasHoverImage ? "group-hover/image:opacity-0" : ""
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            />

            {/* Hover Image (only appears when hovering image area) */}
            {hasHoverImage && (
              <Image
                src={product.hover_image_url || "/placeholder.svg"}
                alt={product.name || ""}
                fill
                className="object-cover absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover/image:opacity-100"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              />
            )}

            {/* Wishlist Button */}
            <div
              className="absolute top-4 right-4 z-10"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <WishButton item={mapProductToWishlistItem(product)} />
            </div>
          </div>

          {/* Variant Carousel - appears on hover between image and info */}
          {hasVariants && (
            <div className="h-0 group-hover:h-auto opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 group-hover:mb-3 overflow-hidden">
              <ProductVariantCarousel
                productName={product?.name || "f50-messi-elite-firm-ground-cleats"}
                variants={product.variants}
                activeImage={currentImage}
                onHover={(src) => setCurrentImage(src)}
              />
            </div>
          )}

          {/* Product Info - always visible */}
          <div className={`px-2 pb-2 space-y-1 ${minimalMobile ? "hidden sm:block" : ""}`}>
            {/* Price */}
            <ProductPrice price={product.price} compareAtPrice={product.compare_at_price} />

            {/* Product Name */}
            <h3 className="font-medium text-base leading-tight line-clamp-2">{product.name}</h3>

            {/* Category/Sport */}
            {product.sport && <p className="text-gray-600 text-sm">{product.sport}</p>}

            {/* Color count */}
            {hasVariants && <p className="text-gray-600 text-sm">{product.variants.length} colors</p>}

            {/* Tags */}
            {product.tags?.length > 0 && <p className="text-black text-sm font-medium">{product.tags[0]}</p>}

            {/* Add to Bag Button */}
            {showAddToBag && (
              <Button className="w-full bg-black text-white hover:bg-gray-800 mt-3" onClick={handleAddToBag}>
                ADD TO BAG
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
