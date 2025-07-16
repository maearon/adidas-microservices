"use client"

import { useState } from "react"
import { BaseButton } from "@/components/ui/base-button"
import ProductCarousel from "@/components/product-carousel"
import { Product } from "@/types/product"
import { useProducts } from "@/api/hooks/useProducts"
import Loading from "@/components/loading"

type ProductTabsProps = {
  initialProductsByTab?: {
    [key: string]: Product[]
  }
}

const tabs = [
  { id: "new-arrivals", label: "New Arrivals", endpoint: "new-arrivals" },
  { id: "best-sellers", label: "Best Sellers", endpoint: "best-sellers" },
  { id: "new-to-sale", label: "New to Sale", endpoint: "sale" },
]

export default function ProductTabs({ initialProductsByTab }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("new-arrivals")

  const { data, isLoading, error } = useProducts({
    category: activeTab,
    limit: 8,
  })

  const products =
    !data?.products || error
      ? initialProductsByTab?.[activeTab] ?? []
      : data.products

  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label
  const viewMoreHref = tabs.find((tab) => tab.id === activeTab)?.endpoint

  return (
    <section className="container mx-auto px-4">
      {/* Tabs & View All */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4"> {/* 4 x 4 = 16px margin bottom*/}
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 border text-sm whitespace-nowrap transition-all
                ${
                  activeTab === tab.id
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View All */}
        <button
          className="hidden sm:inline-block text-sm font-bold underline underline-offset-[4px] mt-4 sm:mt-0"
          onClick={() => {
            if (viewMoreHref) window.location.href = `/${viewMoreHref}`
          }}
        >
          VIEW ALL
        </button>
      </div>

      {/* Title */}
      {/* <h2 className="text-2xl font-bold mb-6">{activeTabLabel}</h2> */}

      {/* Product Carousel or Loading/Error */}
      <div className="min-h-[610px] sm:min-h-[500px]">
      {isLoading ? (
        <Loading />
      ) : products.length > 0 ? (
        <ProductCarousel
          products={products}
          viewMoreHref={`/${viewMoreHref}`}
          carouselModeInMobile={false}
          minimalMobileForProductCard
        />
      ) : error ? (
        <div className="text-center py-8 text-gray-500">
          Failed to load products. Please try again.
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No products available.
        </div>
      )}
      </div>
    </section>
  )
}
