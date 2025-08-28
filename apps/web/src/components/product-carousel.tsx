"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { BaseButton } from "@/components/ui/base-button"
import ProductCard from "@/components/product-card"
import { motion } from "framer-motion"
import { Product } from "@/types/product"
import { Optional } from "@/types/common"
import { cn } from "@/lib/utils"
import CarouselTitle from "./carousel/CarouselTitle"

interface ProductCarouselProps {
  products: Product[]
  title?: string
  showAddToBag?: boolean
  showIndicators?: boolean
  carouselModeInMobile?: boolean
  viewMoreHref?: string
  minimalMobileForProductCard?: Optional<boolean>
}

export default function ProductCarousel({
  products,
  title,
  showAddToBag = false,
  showIndicators = true,
  carouselModeInMobile = true,
  viewMoreHref,
  minimalMobileForProductCard = false,
}: ProductCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [hovering, setHovering] = useState(false)
  const [itemsPerView, setItemsPerView] = useState(4)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setIsMobile(w < 768)
      if (w < 640) setItemsPerView(carouselModeInMobile ? 2 : 8)
      else if (w < 768) setItemsPerView(2)
      else if (w < 1024) setItemsPerView(3)
      else setItemsPerView(4)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [carouselModeInMobile])

  const totalSlides = Math.ceil(products.length / itemsPerView)
  const containerRef = useRef<HTMLDivElement>(null)

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) setCurrentSlide((prev) => prev + 1)
  }

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide((prev) => prev - 1)
  }

  if (!carouselModeInMobile && itemsPerView >= 6 && viewMoreHref) {
    return (
      <section className="container mx-auto px-0 py-0">
        <CarouselTitle title={title} />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} minimalMobile={minimalMobileForProductCard} />
          ))}
          <div className="col-span-full flex justify-center">
            {/* <BaseButton
              variant="outline"
              className="rounded-none border border-border text-background font-bold hover:bg-gray-100 text-base px-6 py-0 leading-none"
              onClick={() => (window.location.href = viewMoreHref || "/new-arrivals")}
            >
              VIEW ALL
            </BaseButton> */}
            <div className="col-span-full">
              <BaseButton
                variant="outline"
                className="w-full rounded-none border border-border text-foreground font-bold hover:bg-gray-100 text-base px-6 py-3 leading-none text-left"
                onClick={() => (window.location.href = viewMoreHref || "/new-arrivals")}
              >
                VIEW ALL
              </BaseButton>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const trackWidth = `${(products.length / itemsPerView) * 100}%`
  const itemWidth = `${100 / products.length}%`
  const offset = `-${(100 / products.length) * itemsPerView * currentSlide}%`

  return (
    <section className="container mx-auto px-4 py-0">
      <CarouselTitle title={title} />

      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div className="relative sm:min-h-[330px]">
          <motion.div
            ref={containerRef}
            className="flex gap-0 md:gap-2 transition-transform duration-700 ease-in-out will-change-transform px-0 md:px-0"
            style={{
              width: trackWidth,
              transform: `translateX(${offset})`,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                style={{ width: itemWidth }}
                className="px-0 md:px-0"
              >
                <ProductCard
                  product={product}
                  showAddToBag={showAddToBag}
                  minimalMobile={minimalMobileForProductCard}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {(isMobile || hovering) && totalSlides > 1 && (
        <>
          {currentSlide > 0 && (
            <BaseButton
              variant="outline"
              size="icon"
              className="w-12 h-12 absolute left-1 top-1/2 -translate-y-1/2 border border-border bg-background hover:bg-muted rounded-none z-20"
              onClick={prevSlide}
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
            </BaseButton>
          )}
          {currentSlide < totalSlides - 1 && (
            <BaseButton
              variant="outline"
              size="icon"
              className="w-12 h-12 absolute right-1 top-1/2 -translate-y-1/2 border border-border bg-background hover:bg-muted rounded-none z-20"
              onClick={nextSlide}
            >
              <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
            </BaseButton>
          )}
        </>
      )}

        {showIndicators && totalSlides > 1 && (
          <div className="mt-6 mx-auto w-full h-1 bg-gray-200 flex overflow-hidden">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <div
                key={index}
                className={cn("h-full transition-all duration-300", {
                  "bg-black": index === currentSlide,
                  "bg-gray-300": index !== currentSlide,
                })}
                style={{ width: `${100 / totalSlides}%` }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
