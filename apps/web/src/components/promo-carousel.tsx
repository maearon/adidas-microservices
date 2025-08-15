"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { BaseButton } from "@/components/ui/base-button"

export interface Slide {
  title: string
  subtitle?: string
  description?: string
  image: string
  cta?: string
  href?: string
}

interface PromoCarouselProps<T extends Slide> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
}

export default function PromoCarousel<T extends Slide>({
  items,
  renderItem,
}: PromoCarouselProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [itemsPerView, setItemsPerView] = useState(4)
  const containerRef = useRef<HTMLDivElement>(null)

  const totalSlides = Math.ceil(items.length / itemsPerView)

  useEffect(() => {
    const updateItems = () => {
      const width = window.innerWidth
      if (width < 640) setItemsPerView(1.2)
      else if (width < 1024) setItemsPerView(2)
      else if (width < 1280) setItemsPerView(3)
      else setItemsPerView(4)
    }

    updateItems()
    window.addEventListener("resize", updateItems)
    return () => window.removeEventListener("resize", updateItems)
  }, [])

  useEffect(() => {
    setCurrentIndex(0)
  }, [itemsPerView])

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalSlides - 1))
  }, [totalSlides])

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  return (
    <section className="container mx-auto px-4 py-0">
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsAutoPlaying(false)}
      >
        <div className="relative">
          <div
            ref={containerRef}
            className="flex transition-transform duration-500 ease-in-out gap-6"
            style={{
              transform: `translateX(-${
                (100 / items.length) * itemsPerView * currentIndex
              }%)`,
              width: `${(100 / itemsPerView) * items.length}%`,
            }}
          >
            {items.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="shrink-0 relative"
                style={{
                  width: `${100 / items.length}%`,
                }}
              >
                {renderItem(item, index)}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        {currentIndex > 0 && (
          <BaseButton
            variant="outline"
            size="icon"
            className="w-12 h-12 absolute left-1 top-1/2 -translate-y-1/2 border border-border bg-background hover:bg-muted rounded-none z-20"
            onClick={prevSlide}
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
          </BaseButton>
        )}
        {currentIndex < totalSlides - 1 && (
          <BaseButton
            variant="outline"
            size="icon"
            className="w-12 h-12 absolute right-1 top-1/2 -translate-y-1/2 border border-border bg-background hover:bg-muted rounded-none z-20"
            onClick={nextSlide}
          >
            <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
          </BaseButton>
        )}

        {/* Dots */}
        {/* <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentIndex ? "bg-black" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div> */}
      </div>
    </section>
  )
}
