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

  const { data, isLoading, error, refetch } = useProducts({
    category: activeTab,
    limit: 4,
  })

  const products =
    !data?.products || error
      ? initialProductsByTab?.[activeTab] ?? []
      : data.products

  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label
  const activeTabInfo = tabs.find((tab) => tab.id === activeTab)
  const viewMoreHref = activeTabInfo ? `/${activeTabInfo.endpoint}` : undefined

  if (isLoading || !products) return <Loading />

  return (
    <section className="container  mx-auto px-2 py-0 mb-10">
      {/* Tabs Navigation */}
      <div className="flex flex-wrap sm:flex-nowrap justify-start sm:justify-between items-center gap-2 mb-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <BaseButton
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-none ${
                activeTab === tab.id
                  ? "bg-black text-white"
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </BaseButton>
          ))}
        </div>

        {/* VIEW ALL */}
        <BaseButton
          variant="link"
          className="hidden sm:block text-sm font-bold underline whitespace-nowrap px-0"
          onClick={() => {
            const activeTabData = tabs.find((tab) => tab.id === activeTab)
            window.location.href = `/${activeTabData?.endpoint}`
          }}
        >
          VIEW ALL
        </BaseButton>
      </div>

      {/* Products Carousel */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 mb-4"></div>
              <div className="bg-gray-200 h-4 mb-2"></div>
              <div className="bg-gray-200 h-4 w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <ProductCarousel
          products={products}
          carouselModeInMobile={false}
          viewMoreHref={viewMoreHref}
          minimalMobileForProductCard={true}
        />
      ) : error ? (
        <div className="text-center py-8 text-gray-500">
          Failed to load products. Please try again.
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No products available.
        </div>
      )}
    </section>
  )
}
