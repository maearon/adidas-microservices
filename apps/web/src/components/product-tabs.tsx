"use client"

import { useState, useMemo } from "react"
import ProductCarousel from "@/components/product-carousel"
import { Product } from "@/types/product"
import { useProducts } from "@/api/hooks/useProducts"
import Loading from "@/components/loading"
import { mapProductDataToSimpleProduct } from "@/lib/mappers/product-data-to-simple-product"
import { parseSlugToFilters } from "@/utils/slug-parser"
import { useTranslations } from "@/hooks/useTranslations"

type ProductTabsProps = {
  initialProductsByTab?: {
    [key: string]: Product[]
  }
}

// Build filters for each tab
function buildFiltersFromTab(tabId: string) {
  let filters = parseSlugToFilters(tabId)

  switch (tabId) {
    case "new-arrivals":
      filters = {
        ...filters,
        product_type: [tabId, "shoes"],
        gender: ["men"],
        limit: 12,
      }
      break

    case "best-sellers":
      filters = {
        ...filters,
        product_type: [tabId, "shoes"],
        gender: ["women"],
        limit: 12,
      }
      break

    case "new-to-sale":
      filters = {
        ...filters,
        product_type: [tabId, "shoes"],
        gender: ["kids"],
        limit: 12,
      }
      break

    default:
      filters = { ...filters, limit: 12 }
  }

  return filters
}

export default function ProductTabs({ initialProductsByTab }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("new-arrivals")
  const t = useTranslations("common")

  const tabs = [
    { id: "new-arrivals", label: t?.newArrivals || "New Arrivals", endpoint: "new-arrivals" },
    { id: "best-sellers", label: t?.bestSellers || "Best Sellers", endpoint: "best-sellers" },
    { id: "new-to-sale", label: t?.newToSale || "New to Sale", endpoint: "sale" },
  ]

  // filters cho tab hiện tại
  const filters = useMemo(() => buildFiltersFromTab(activeTab), [activeTab])

  // call hook với object filters trực tiếp
  const { data, isLoading, error } = useProducts(filters)

  const products: Product[] = error
    ? initialProductsByTab?.[activeTab] ?? []
    : (data?.pages.flatMap((page) =>
        page.products.map((productData: unknown) =>
          mapProductDataToSimpleProduct(productData)
        )
      ) ?? initialProductsByTab?.[activeTab] ?? [])

  const viewMoreHref = tabs.find((tab) => tab.id === activeTab)?.endpoint

  return (
    <section className="container mx-auto px-4">
      {/* Tabs & View All */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
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
          {t?.viewAll || "VIEW ALL"}
        </button>
      </div>

      {/* Product Carousel or Loading/Error */}
      <div className="min-h-[605px] sm:min-h-[500px]">
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
          <div className="text-center text-gray-500">No products available.</div>
        )}
      </div>
    </section>
  )
}
