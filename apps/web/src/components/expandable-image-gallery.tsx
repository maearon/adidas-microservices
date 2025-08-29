"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import ImageLightbox from "@/components/image-lightbox"
import Breadcrumb from "@/components/Breadcrumb"
import BreadcrumbForDetailProductPage from "@/components/BreadcrumbForDetailProductPage"
import { buildBreadcrumbFromProductDetail } from "@/utils/breadcrumb"
import { Product } from "@/types/product"
import { 
  // Badge, 
  Star 
} from "lucide-react"
import { upperWords } from "@/utils/upper-words"
import ProductPrice from "./ProductCardPrice"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"

interface ExpandableImageGalleryProps {
  images: string[]
  productName: string
  variant: Variant | undefined;
  product: Product
  tags: string[]
}

interface Variant {
  id: bigint;
  price: number;
  compare_at_price: number | null;
  variant_code: string | null;
  stock: number | null;
}


export default function ExpandableImageGallery({ variant, images, productName, product, tags }: ExpandableImageGalleryProps) {
  const [showAllImages, setShowAllImages] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile && lightboxOpen) {
      setLightboxOpen(false)
    }
  }, [isMobile, lightboxOpen])

  const displayImages = showAllImages ? images.slice(0, 10) : images.slice(0, 4)
  // const remainingCount = Math.max(0, images.length - 4)

  const openLightbox = (index: number) => {
    if (!isMobile) {
      setLightboxIndex(index)
      setLightboxOpen(true)
    }
  }

  const getZoomCursor = () => {
    return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M8 8L4 4m0 0v4m0-4h4'/%3E%3Cpath d='M16 8l4-4m0 0v4m0-4h-4'/%3E%3Cpath d='M16 16l4 4m0 0v-4m0 4h-4'/%3E%3Cpath d='M8 16l-4 4m0 0v-4m0 4h4'/%3E%3C/svg%3E") 12 12, auto`
  }

  const breadcrumbItems = buildBreadcrumbFromProductDetail(product)

  // Mock product details
  const productDetails = {
    rating: 4.8,
    reviewCount: 1247,
  }

  return (
    <>
      <div className="relative">
        {/* Mobile Product Title */}
        <div className="sm:hidden px-[20px] py-[10px]">
          {/* Breadcrumb + Reviews */}
          <div className="flex items-center justify-between mb-2">
            <Breadcrumb 
              items={breadcrumbItems} 
              useLastItemHighlight={false} 
              showBackButton={false} 
            />
            
            {/* Rating and Reviews */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(productDetails.rating) ? "fill-green-500 text-green-500" : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-base font-bold">{productDetails.reviewCount}</span>
            </div>
          </div>

          <h1 className="text-[24px] leading-[28px] font-extrabold tracking-tight mt-[20px] mb-[10px]">
            {upperWords(product.name)}
          </h1>

          <div className="flex items-center space-x-2 leading-[22px]">
            {/* <span className="text-md font-bold">${formatPrice(variant?.price)}</span>
            {variant?.compare_at_price && (
              <span className="text-md text-gray-500 line-through">${variant?.compare_at_price}</span>
            )} */}
            <ProductPrice
              price={variant?.price ?? null}
              compareAtPrice={variant?.compare_at_price ?? null}
            />
          </div>
        </div>
        <BreadcrumbForDetailProductPage items={breadcrumbItems} />

        {/* Image Grid */}
        <div className="grid grid-cols-2 gap-1">
          <div className="absolute top-51 sm:top-14 -left-4 sm:left-auto sm:right-0 -translate-x-3 sm:translate-x-5 z-20 text-[10px] sm:text-xs text-black font-normal px-3 py-2 -rotate-90 origin-center bg-white tracking-wider uppercase">
            {[...tags].sort((a, b) => a.localeCompare(b))[0] || "BEST SELLER"}
          </div>
          {/* Display first 4 images or all if showAllImages is true */}
          {Array.isArray(displayImages) && displayImages.length > 0 &&
            displayImages.map((image, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-100 overflow-hidden rounded-none group relative"
                onClick={() => openLightbox(index)}
                style={{ cursor: !isMobile ? getZoomCursor() : "default" }}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${productName} view ${index + 1}`}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    !isMobile ? "group-hover:scale-110" : ""
                  }`}
                />
                {/* <Image
                  src={image || "/placeholder.svg"}
                  alt={`${productName} view ${index + 1}`}
                  fill // need relative
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    !isMobile ? "group-hover:scale-110" : ""
                  }`}
                /> */}
              </div>
            ))}
        </div>

        {/* Show More/Less Button */}
        {images.length > 4 && (
          <div className="relative mt-2">
            <div className="absolute left-1/2 transform translate-x-[-50%] translate-y-[-70%] z-10">
              <Button
                shadow={false}
                showArrow={false}
                variant="outline"
                className="border-border text-black dark:text-white bg-background hover:bg-background hover:text-gray-500 transition-colors duration-200 rounded-none px-8 py-3 text-sm"
                onClick={() => setShowAllImages(!showAllImages)}
              >
                {showAllImages ? (
                  <>SHOW LESS <span className="ml-2">↑</span></>
                ) : (
                  <>SHOW MORE <span className="ml-2">↓</span></>
                )}
              </Button>
            </div>
          </div>
        )}

      </div>

      {/* Lightbox - Desktop Only */}
      {lightboxOpen && !isMobile && (
        <ImageLightbox
          images={images}
          currentIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setLightboxIndex}
          productName={productName}
        />
      )}
    </>
  )
}
