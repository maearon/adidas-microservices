"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAppDispatch } from "@/store/hooks"
import { addToCart } from "@/store/cartSlice"
import WishButton from "./wish-button"
import type {
  LastVisitedProduct,
  PriceInfo,
  ProductAsset,
  ProductVariation
} from "@/types/product/product-adidas"
import { Breadcrumb } from "@/types/bread-crumb/bread-crumb"
import { mapProductToWishlistItem } from "@/lib/mappers/product-to-wishlist"
import { slugify } from "@/utils/slugtify"
import { Variant } from "@/types/product"

interface ProductCardProps {
  slug?: string
  product: {
    id: number
    name?: string
    price?: string
    sport?: string;
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
  minimalMobile = false
}: ProductCardProps) {
  const dispatch = useAppDispatch()
  const image = product.image ?? product.image_url ?? "/placeholder.png"
  const isPlaceholder = product.__isPlaceholder || !product.name

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(
      addToCart({
        id: product.id,
        name: product.name || "Unknown Product",
        price: product.price || "0",
        image: image,
        color: "Default",
        size: "M"
      })
    )
  }

  const fallbackUrl = `/${slugify(product.name || "product")}/${product?.variants?.[0]?.variant_code}.html`

  const hasHoverImage =
    product.hover_image_url !== undefined &&
    product.hover_image_url !== null &&
    product.hover_image_url.trim?.() !== ""

  if (isPlaceholder) {
    return (
      <div className="border border-gray-200 rounded shadow-xs p-2 animate-pulse">
        <div className="relative aspect-square bg-gray-200 rounded mb-4" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
        {showAddToBag && (
          <div className="h-10 bg-gray-300 rounded w-full" />
        )}
      </div>
    )
  }

  return (
    <Link href={product.url ?? fallbackUrl}>
      <Card className="flex flex-col justify-between border border-transparent hover:border-black transition-all shadow-none cursor-pointer rounded-none">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Image Section */}
          <div
            className={`relative aspect-square overflow-hidden ${
              hasHoverImage ? "group" : ""
            } ${!minimalMobile ? "mb-4" : ""}`}
          >
            {/* Main image (hiện mặc định, ẩn khi hover nếu có hover image) */}
            <Image
              src={image}
              alt={product?.name || ""}
              fill
              className={`object-cover transition-opacity duration-300 ${
                hasHoverImage ? "group-hover:opacity-0" : ""
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            />

            {/* Hover image (ẩn mặc định, hiện khi hover) */}
            {hasHoverImage && (
              <Image
                src={product?.hover_image_url || ""}
                alt={product?.name || ""}
                fill
                className="object-cover absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              />
            )}

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

          {/* Info Section */}
          <div
            className={`space-y-2 px-2 pb-2 mt-auto ${minimalMobile ? "hidden sm:block" : ""}`}
          >
            {/* {product.category && (
              <p className="text-base text-gray-600">
                {typeof product.category === "string"
                  ? product.category
                  : String(product?.category ?? "")}
              </p>
            )} */}
            <p className="font-bold h-5">
              ${product?.compare_at_price ?? product.price}
            </p>
            <h3 className="font-medium h-5 overflow-hidden">{product.name}</h3>
            {product?.sport && (
              <p className="text-base text-gray-600 min-h-5">
                {product?.sport || product?.attribute_list?.brand}
              </p>
            )}
            {product?.tags && (
              <p className="text-base text-black min-h-5">
                {product?.tags?.[0] || "BEST SELLER"}
              </p>
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
