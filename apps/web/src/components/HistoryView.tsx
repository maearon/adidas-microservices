"use client"

import ProductCarousel from "@/components/product-carousel"
import { useEffect, useState } from "react"
import { getLastVisited } from "@/lib/recentlyViewed"
import type { LastVisitedItem } from "@/lib/recentlyViewed"

interface HistoryViewProps {
  title?: React.ReactNode
  showIndicatorsInProductCarousel?: boolean
}

export default function HistoryView({
  title = "RECENTLY VIEWED ITEMS",
  showIndicatorsInProductCarousel = false,
}: HistoryViewProps) {
  const [stillInterestedProducts, setStillInterestedProducts] = useState<LastVisitedItem[]>([])

  useEffect(() => {
    setStillInterestedProducts(getLastVisited())
  }, [])

  if (!stillInterestedProducts.length) return null

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
        products={stillInterestedProducts.map(({ product }) => product)}
        showIndicators={showIndicatorsInProductCarousel}
        minimalMobileForProductCard={false}
      />
    </section>
  )
}
