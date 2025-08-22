"use client";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";
import WishButton from "./wish-button";
import ProductVariantCarousel from "./ProductVariantCarousel";
import { mapProductToWishlistItem } from "@/lib/mappers/product-to-wishlist";
import { slugify } from "@/utils/slugify";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import ProductPrice from "./ProductCardPrice";

interface ProductCardProps {
  slug?: string;
  product: Product;
  showAddToBag?: boolean;
  minimalMobile?: boolean;
}

export default function ProductCard({
  product,
  showAddToBag = false,
  minimalMobile = false,
}: ProductCardProps) {
  const dispatch = useAppDispatch();
  const fallbackUrl = `/${slugify(product.name || "product")}/${
    product.variants[0]?.variant_code
  }.html`;
  const [currentVariant, setCurrentVariant] = useState(product.variants[0]);
  const [currentUrl, setCurrentUrl] = useState(fallbackUrl);
  const isPlaceholder = product.__isPlaceholder || !product.name;

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        id: Number(product.id),
        name: product.name || "Unknown Product",
        price: String(product.price) || "0",
        image: currentVariant?.avatar_url || "/placeholder.png",
        color: "Default",
        size: "M",
      })
    );
  };

  const hasHoverImage = !!product.hover_image_url?.trim();
  const hasVariants = product.variants?.length > 1;

  if (isPlaceholder) {
    return (
      <div className="border border-gray-200 rounded shadow-xs p-2 animate-pulse min-h-[470px]">
        <div className="relative aspect-square bg-gray-200 rounded mb-4" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
        {showAddToBag && <div className="h-10 bg-gray-300 rounded w-full" />}
      </div>
    );
  }

  const productImage =
    currentVariant?.avatar_url ||
    currentVariant?.image_urls?.[0] ||
    product.main_image_url ||
    "/placeholder.png"

  const hoverImage =
    currentVariant?.hover_url ||
    currentVariant?.image_urls?.[2] ||
    product.hover_image_url ||
    "/placeholder.png"

  return (
    <Link
      href={currentUrl}
      onMouseEnter={() => {
        setCurrentVariant(product.variants[0]);
        setCurrentUrl(fallbackUrl);
      }}
      onMouseLeave={() => {
        setCurrentVariant(product.variants[0]);
        setCurrentUrl(fallbackUrl);
      }}
    >
      <Card
        className={cn(
          "group flex flex-col justify-between border border-transparent hover:border-black dark:hover:border-white transition-all duration-200 shadow-none cursor-pointer rounded-none overflow-visible",
          minimalMobile ? "min-h-fit" : "min-h-fit sm:min-h-[470px]"
        )}
      >
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden group/image mb-1">
            <Image
              src={productImage}
              alt={product.name || "Product Name"}
              fill
              className={cn(
                "object-cover transition-opacity duration-300",
                hasHoverImage && "group-hover/image:opacity-0"
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            />
            {hasHoverImage && (
              <Image
                src={hoverImage}
                alt={product.name || "Product Name"}
                fill
                className="object-cover absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover/image:opacity-100"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              />
            )}
            <div
              className="absolute top-4 right-4 z-10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <WishButton item={mapProductToWishlistItem(product)} />
            </div>
          </div>

          {hasVariants && (
            <div
              className={cn(
                // Desktop hover: only show on hover
                "sm:max-h-0 sm:opacity-0 sm:invisible sm:group-hover:max-h-[64px] sm:group-hover:opacity-100 sm:group-hover:visible",
                // Mobile: always show
                "max-h-[64px] opacity-100 visible",
                "overflow-hidden mb-1"
              )}
            >
              <ProductVariantCarousel
                product={product}
                currentVariant={currentVariant}
                onHover={(variant, url) => {
                  setCurrentVariant(variant);
                  setCurrentUrl(url);
                }}
              />
            </div>
          )}

          <div className={cn("px-2 pb-0 space-y-1", minimalMobile && "hidden sm:block")}>
            <ProductPrice price={String(product.price)} compareAtPrice={String(product.compare_at_price)} />
            <h3 className="font-medium text-base leading-tight line-clamp-2">{product.name}</h3>
            {product.sport && <p className="text-gray-600 dark:text-white text-sm">
              {product.gender ? `${product.gender}'s` : ''} 
              {product.gender && product.sport ? ' ' : ''}
              {product.sport}
            </p>}
            {hasVariants && (
              <p className="text-gray-600 dark:text-white text-sm">{product.variants.length} colors</p>
            )}
            {(product?.tags?.length || 0) > 0 && (
              <p className="text-foreground text-sm font-medium">{product?.tags?.[0]}</p>
            )}
            {showAddToBag && (
              <Button className="w-full bg-black text-white hover:bg-gray-800 mt-3" onClick={handleAddToBag}>
                ADD TO BAG
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
