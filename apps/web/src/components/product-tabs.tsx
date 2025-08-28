"use client"

import { useState } from "react"
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

// build query params giống CategoryPageClient.tsx
function buildQueryParams(tabId: string) {
  return {
    categories: [tabId],        // <-- plural, truyền dạng mảng
    genders: ["men", "women"],  // lọc thêm gender để query nhẹ hơn
    limit: 8,
  }
}

export default function ProductTabs({ initialProductsByTab }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("new-arrivals")

  // query params cho tab hiện tại
  const queryParams = buildQueryParams(activeTab)

  const { data, isLoading, error } = useProducts(queryParams)

  const products = error
  ? initialProductsByTab?.[activeTab] ?? []
  : data?.pages.flatMap((page) => page.products) ??
    initialProductsByTab?.[activeTab] ??
    []

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
              className={`px-4 py-2 border text-sm sm:text-base whitespace-nowrap transition-all
                ${
                  activeTab === tab.id
                    ? "bg-background text-black dark:text-white border-black dark:border-white"
                    : "bg-background text-foreground border-gray-300 dark:border-gray-500"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View All */}
        <button
          className="hidden sm:inline-block text-base font-bold underline underline-offset-4 mt-4 sm:mt-0"
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
      <div className="min-h-[605px] sm:min-h-[500px]">
      {isLoading ? (
        <Loading />
      ) : products.length > 0 ? (
        <ProductCarousel
          products={products as Product[]}
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
