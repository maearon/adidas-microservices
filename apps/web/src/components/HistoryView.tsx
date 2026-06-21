"use client"

import ProductCarousel from "@/components/product-carousel"
import { useEffect, useState } from "react"
import { getLastVisited } from "@/lib/recentlyViewed"
import type { LastVisitedItem } from "@/lib/recentlyViewed"
import CarouselTitle from "./carousel/CarouselTitle"
import { mapProductDataToSimpleProduct } from "@/lib/mappers/product-data-to-simple-product"
import { useTranslations } from "@/hooks/useTranslations"

interface HistoryViewProps {
  title?: React.ReactNode
  showIndicatorsInProductCarousel?: boolean
  embedded?: boolean
}

export default function HistoryView({
  title,
  showIndicatorsInProductCarousel = false,
  embedded = false,
}: HistoryViewProps) {
  const [stillInterestedProducts, setStillInterestedProducts] = useState<LastVisitedItem[]>([])
  const t = useTranslations("common")

  const defaultTitle = title || t?.recentlyViewedItems || "RECENTLY VIEWED ITEMS"

  useEffect(() => {
    const items = getLastVisited().map((item: LastVisitedItem) => ({
      visitedAt: item.visitedAt,
      product: mapProductDataToSimpleProduct(item.product),
    }))
    setStillInterestedProducts(items)
  }, [])

  if (!stillInterestedProducts.length) return null

  const titleNode = embedded ? (
    <h2 className="mb-4 text-xl font-bold uppercase tracking-tight text-foreground">
      {defaultTitle}
    </h2>
  ) : (
    <CarouselTitle title={defaultTitle} />
  )

  return (
    <section className={embedded ? "py-0" : "container mx-auto mb-4 px-4 py-0"}>
      {titleNode}

      <ProductCarousel
        products={stillInterestedProducts.map(({ product }) => product)}
        showIndicators={showIndicatorsInProductCarousel}
        minimalMobileForProductCard={false}
      />
    </section>
  )
}
