"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import ImageLightbox from "@/components/image-lightbox"
import Breadcrumb from "@/components/Breadcrumb"
import BreadcrumbForDetailProductPage from "@/components/BreadcrumbForDetailProductPage"
import { buildBreadcrumbFromProductDetail } from "@/utils/breadcrumb"
import { Product } from "@/types/product"
import { Badge, Star } from "lucide-react"
import { upperWords } from "@/utils/upper-words"

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
  const remainingCount = Math.max(0, images.length - 4)

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
    soldOutSizes: ["36", "36.5", "37", "42.5"],
    rating: 4.8,
    reviewCount: 1247,
    features: ["Get delivery dates", "Free standard shipping with adiClub", "Free 30 day returns"],
    sizeGuide: "True to size. We recommend ordering your usual size.",
    breadcrumb: "Home / Women / Soccer",
    sizes: [
      "4",
      "4.5",
      "5",
      "5.5",
      "6",
      "6.5",
      "7",
      "7.5",
      "8",
      "8.5",
      "9",
      "9.5",
      "10",
      "10.5",
      "11",
      "11.5",
      "12",
      "12.5",
      "13",
      "13.5",
    ],
  }

  return (
    <>
      <div className="relative space-y-4">
        {/* <div  className="flex sm:hidden px-[20px] py-[10px]">
          <Breadcrumb items={breadcrumbItems} useLastItemHighlight={false} />
           
            <div className="sm:hidden">
              <h1 className="text-xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl font-bold">${product.price}</span>
                {product.badge === "Best seller" && (
                  <Badge className="bg-gray-300 text-black text-xs rounded-none">BEST SELLER</Badge>
                )}
              </div>
            </div>
        </div> */}
        {/* Mobile Product Title */}
        <div className="sm:hidden px-[20px] py-[10px]">
          {/* Breadcrumb + Reviews */}
          <div className="flex items-center justify-between mb-2">
            {/* <p className="text-base text-gray-600">
              {product.gender ? `${product.gender}'s` : ''} 
              {product.gender && product.sport ? ' • ' : ''}
              {product.sport}
            </p> */}
            <Breadcrumb items={breadcrumbItems} useLastItemHighlight={false} />
            
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

          <h1 className="text-3xl font-bold mb-4 leading-tight">{upperWords(product.name)}</h1>

          <div className="flex items-center space-x-2 mb-6">
            <span className="text-2xl font-bold">${variant?.price}</span>
            {variant?.compare_at_price && (
              <span className="text-lg text-gray-500 line-through">${variant?.compare_at_price}</span>
            )}
          </div>

          {/* <p className="text-base text-black mb-6">Promo codes will not apply to this product.</p> */}
        </div>
        <BreadcrumbForDetailProductPage items={breadcrumbItems} />

        

        {/* Image Grid */}
        <div className="grid grid-cols-2 gap-1">
          <div className="absolute top-64 sm:top-14 left-0 sm:left-auto sm:right-0 -translate-x-3 sm:translate-x-5 z-20 text-[10px] sm:text-xs text-black font-normal px-3 py-2 -rotate-90 origin-center bg-white tracking-wider uppercase">
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
              </div>
            ))}
        </div>

        {/* Show More/Less Button */}
        {images.length > 4 && (
          <div className="text-center">
            <Button
              shadow={false}
              showArrow={false}
              variant="outline"
              className="border-black text-black hover:bg-white hover:text-gray-500 bg-transparent transition-colors duration-200 rounded-none px-8 py-3"
              onClick={() => setShowAllImages(!showAllImages)}
            >
              {showAllImages ? (
                <>SHOW LESS <span className="ml-2">↑</span></>
              ) : (
                <>SHOW MORE <span className="ml-2">↓</span></>
              )}
            </Button>
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
