"use client";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const [variantHeight, setVariantHeight] = useState(0);
  const variantRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // đo chiều cao panel variant
  useEffect(() => {
    if (variantRef.current) {
      setVariantHeight(variantRef.current.offsetHeight);
    }
  }, [product?.variants?.length, isMobile]);

  const dispatch = useAppDispatch();
  const defaultVariant = product.variants?.[0] ?? null;
  const fallbackUrl = `/${slugify(product.name || "product")}/${defaultVariant?.variant_code}.html`;

  const [currentVariant, setCurrentVariant] = useState(defaultVariant);
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
        color: currentVariant?.color || "Default",
        size: currentVariant?.sizes[0] || "M",
      })
    );
  };

  const hasHoverImage = !!product.hover_image_url?.trim();
  const hasVariants = (product.variants?.length ?? 0) > 1;
  const hasVariantPanel = hasVariants && variantHeight > 0;

  if (isPlaceholder) {
    return (
      <div className="border border-gray-200 rounded shadow-xs p-2 animate-pulse min-h-[300px]">
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
    "/placeholder.png";

  const hoverImage =
    currentVariant?.hover_url ||
    currentVariant?.image_urls?.[2] ||
    product.hover_image_url ||
    "/placeholder.png";

  const shouldHideDetails = minimalMobile && isMobile

  return (
    <Link
      href={currentUrl}
      onMouseLeave={() => {
        setCurrentVariant(defaultVariant);
        setCurrentUrl(fallbackUrl);
      }}
    >
      <Card
        className={cn(
          "group relative z-0 hover:z-20 overflow-visible",
          "flex flex-col justify-between border border-transparent",
          "transition-all duration-200 shadow-none cursor-pointer rounded-none",
          "hover:border-black dark:hover:border-white",
          // Khi hover thì ẩn border-bottom để info block nối tiếp
          hasVariantPanel && "hover:border-b-0",
          // hasVariantPanel && "border-b-0" // bỏ border dưới của card khi có variant
          // minimalMobile ? "min-h-fit" : "min-h-fit sm:min-h-[470px]"
        )}
      >
        <CardContent className="p-0 relative">
          {/* IMAGE WRAPPER */}
          <div className="relative">
            <div className="relative aspect-square overflow-hidden group/image">
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

            {/* VARIANTS PANEL */}
            {hasVariants && !shouldHideDetails && (
              <>
                {isMobile ? (
                  <div
                    ref={variantRef}
                    className="relative block opacity-100 pointer-events-auto"
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
                ) : (
                  <div
                    ref={variantRef}
                    className={cn(
                      "absolute left-0 right-0 top-full z-10",
                      "opacity-0 pointer-events-none transition-opacity duration-200",
                      "group-hover:opacity-100 group-hover:pointer-events-auto"
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
              </>
            )}
          </div>

          {/* INFO BLOCK */}
          {!shouldHideDetails && (
          <div
            className={cn(
              "pb-1 space-y-1 relative bg-white dark:bg-black",
              hasVariants && !isMobile && "transition-transform duration-200 group-hover:translate-y-8",
              hasVariantPanel &&
                "group-hover:border-x group-hover:border-b group-hover:border-black dark:group-hover:border-white -ml-px -mr-px",
            )}
          >
            <div className="px-[10px] py-[10px] mb-[10px]">
            <ProductPrice
              price={String(product.price)}
              compareAtPrice={String(product.compare_at_price)}
            />
            <h3 className="font-medium text-base leading-tight line-clamp-2">
              {product.name}
            </h3>
            {product.sport && (
              <p className="text-gray-600 dark:text-white text-sm">
                {product.gender ? `${product.gender}'s` : ""}{" "}
                {product.gender && product.sport ? " " : ""}
                {product.sport}
              </p>
            )}
            {hasVariants && (
              <p className="text-gray-600 dark:text-white text-sm">
                {product.variants.length} colors
              </p>
            )}
            {(product?.tags?.length || 0) > 0 && (
              <p className="text-foreground text-sm font-medium">
                {product?.tags?.[0]}
              </p>
            )}
            {showAddToBag && (
              <Button
                className="w-full bg-black text-white hover:bg-gray-800 mt-3"
                onClick={handleAddToBag}
              >
                ADD TO BAG
              </Button>
            )}
            </div>
          </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
