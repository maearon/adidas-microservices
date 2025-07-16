"use client"

import PromoCarousel from "@/components/promo-carousel"
import TileCard from "@/components/tile-card"
import type { Slide } from "@/components/promo-carousel"

type Props = {
  items: Slide[]
}

export default function KidsPromoCarousel({ items }: Props) {
  return (
    <PromoCarousel
      items={items}
      renderItem={(slide, i) => (
        <TileCard tile={slide} index={i} />
      )}
    />
  )
}
