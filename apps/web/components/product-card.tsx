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
import type {
  ProductAsset,
  ProductVariation,
} from "@/types/product/product-adidas"
import { Breadcrumb } from "@/types/bread-crumb/bread-crumb"
import { Variant } from "@/types/product"

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
    breadcrumb_list?: Breadcrumb[]
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

export default function ProductCard({
  product,
  showAddToBag = false,
  minimalMobile = false,
}: ProductCardProps) {
  const dispatch = useAppDispatch()
  const defaultImage = product.image ?? product.image_url ?? "/placeholder.png"
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
      })
    )
  }

  const fallbackUrl = `/${slugify(product.name || "product")}/${product?.variants?.[0]?.variant_code}.html`

  const hasHoverImage = !!product.hover_image_url?.trim()

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
    <Link href={product.url ?? fallbackUrl}>
      <Card className="group flex flex-col justify-between border border-transparent hover:border-black transition-all shadow-none cursor-pointer rounded-none">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Image section */}
          <div className={`relative aspect-square overflow-hidden group/image ${!minimalMobile ? "mb-4" : ""}`}>
            {/* Main Image */}
            <Image
              src={currentImage}
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
                src={product.hover_image_url}
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

          {/* Variant Carousel (only visible when hover toàn card) */}
          {product.variants?.length > 1 && (
            <div className="overflow-hidden transition-all duration-300 ease-in-out group-hover:max-h-20 max-h-0">
              <ProductVariantCarousel
                variants={product.variants}
                activeImage={currentImage}
                onHover={(src) => setCurrentImage(src)}
              />
            </div>
          )}

          {/* Info */}
          <div
            className={`space-y-2 px-2 pb-2 mt-auto transition-opacity ${
              minimalMobile ? "hidden sm:block" : ""
            }`}
          >
            <p className="font-bold h-5">${product.compare_at_price ?? product.price}</p>
            <h3 className="font-medium h-5 overflow-hidden">{product.name}</h3>
            {product.sport && (
              <p className="text-base text-gray-600 min-h-5">{product.sport}</p>
            )}
            {product.tags?.length > 0 && (
              <p className="text-base text-black min-h-5">{product.tags[0]}</p>
            )}

            {showAddToBag && (
              <Button
                className="w-full bg-black text-white hover:bg-gray-800"
                onClick={handleAddToBag}
              >
                ADD TO BAG
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
