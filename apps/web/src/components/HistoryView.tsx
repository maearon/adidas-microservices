"use client"

import ProductCarousel from "@/components/product-carousel"
import { useEffect, useState } from "react"
import { getLastVisited } from "@/lib/recentlyViewed"
import type { LastVisitedItem } from "@/lib/recentlyViewed"
import CarouselTitle from "./carousel/CarouselTitle"
import { mapProductDataToSimpleProduct } from "@/lib/mappers/product-data-to-simple-product"

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
    const items = getLastVisited().map((item: LastVisitedItem) => ({
      visitedAt: item.visitedAt,
      product: mapProductDataToSimpleProduct(item.product),
    }))
    setStillInterestedProducts(items)
  }, [])

  if (!stillInterestedProducts.length) return null

  return (
    <section className="container mx-auto px-4 py-0 mb-4">
      <CarouselTitle title={title} />

      <ProductCarousel
        products={stillInterestedProducts.map(({ product }) => product)}
        showIndicators={showIndicatorsInProductCarousel}
        minimalMobileForProductCard={false}
      />
    </section>
  )
}
