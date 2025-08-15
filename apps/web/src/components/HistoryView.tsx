"use client"

import ProductCarousel from "@/components/product-carousel"
import { useEffect, useState } from "react"
import { fakeLastVisitedProducts } from "@/data/fake-last-visited-products"
import { LastVisitedProduct } from "@/types/product"

interface HistoryViewProps {
  title: React.ReactNode
  showIndicatorsInProductCarousel?: boolean
}

export default function HistoryView({
  title = "RECENTLY VIEWED ITEMS",
  showIndicatorsInProductCarousel = false,
}: HistoryViewProps) {
  const [stillInterestedProducts, setStillInterestedProducts] = useState<LastVisitedProduct[]>([])

  useEffect(() => {
    const visitedProducts: LastVisitedProduct[] = fakeLastVisitedProducts;
    localStorage.setItem("lastVisitedProducts", JSON.stringify(visitedProducts))
    try {
      const lastVisitedProductsStr = localStorage.getItem("lastVisitedProducts") ?? "[]"
      const parsed: LastVisitedProduct[] = JSON.parse(lastVisitedProductsStr)
      const sliced = parsed.slice().reverse()

      setStillInterestedProducts(sliced)
    } catch (err) {
        console.error("Failed to parse lastVisitedProducts", err)
    }
  }, [])

  return (
    <section className="container mx-auto px-4 py-0 mb-4">
        <div className="flex justify-between items-center mb-4"> {/* 4 x 4 = 16px margin bottom*/}
            <h2 className="text-xl sm:text-2xl md:text-3xl xl:text-3xl font-extrabold tracking-tight leading-tight break-words">
              {title}
            </h2>
            {/* <Button variant="link" className="text-base font-bold">
            VIEW ALL
            </Button> */}
        </div>
    
        <ProductCarousel 
          products={stillInterestedProducts.map((p) => p.product)} 
          showIndicators={showIndicatorsInProductCarousel} 
          minimalMobileForProductCard={true}
        />
    </section>
  )
}
