"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Filter, SlidersHorizontal } from "lucide-react"

import { BaseButton } from "@/components/ui/base-button"
import { Badge } from "@/components/ui/badge"
import ProductGrid from "@/components/product-grid"
import FiltersSidebar from "@/components/filters-sidebar"
import { getCategoryConfig, categoryConfigs, formatSlugTitle } from "@/utils/category-config.auto"
import type { ProductQuery } from "@/api/services/rubyService"
import { useProducts } from "@/api/hooks/useProducts"
import Link from "next/link"
import { buildBreadcrumbFromProductItem } from "@/utils/breadcrumb"
import BreadcrumbSkeleton from "@/components/BreadcrumbSkeleton"
import FullScreenLoader from "@/components/ui/FullScreenLoader"

interface CategoryPageClientProps {
  params: { slug: string }
  searchParams?: Record<string, string | undefined>
}

function searchParamsToString(obj?: Record<string, string | undefined>): string {
  if (!obj) return ""
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(obj)) {
    if (value != null) params.set(key, value)
  }
  return params.toString()
}

function getBreadcrumbTrail(slug: string): { label: string; href: string }[] {
  const trail: { label: string; href: string }[] = []
  let currentSlug = slug
  let depth = 0

  while (currentSlug && depth < 4) {
    const config = getCategoryConfig(currentSlug)
    trail.unshift({
      label: config.breadcrumb || formatSlugTitle(currentSlug),
      href: config.href || `/${currentSlug}`,
    })

    const parent = Object.entries(categoryConfigs).find(([_, c]) =>
      c.tabs.some((tab) => tab.slug === currentSlug)
    )
    currentSlug = parent?.[0] || ""
    depth++
  }

  return [{ label: "Home", href: "/" }, ...trail]
}

export default function CategoryPageClient({ params, searchParams }: CategoryPageClientProps) {
  const router = useRouter()
  const [showFilters, setShowFilters] = useState(false)

  const config = getCategoryConfig(params.slug)

  const allowedKeys: (keyof ProductQuery)[] = [
    "page", "sort", "gender", "category", "activity", "sport",
    "product_type", "size", "color", "material", "brand", "model",
    "collection", "min_price", "max_price", "shipping"
  ]

  const queryParams: ProductQuery = useMemo(() => {
    const query: Partial<ProductQuery> = { slug: params.slug }
    const search = searchParams || {}

    for (const key of allowedKeys) {
      const value = search[key]
      if (!value) continue

      if (["min_price", "max_price", "page"].includes(key)) {
        const num = Number(value)
        if (!isNaN(num)) query[key] = num as any
      } else {
        query[key] = value as any
      }
    }

    return query as ProductQuery
  }, [searchParams, params.slug])

  const { data, isLoading, isPlaceholderData, error, refetch } = useProducts(queryParams)

  const products = data?.products || []
  const meta = data?.meta || {
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    per_page: 24,
    filters_applied: {},
  }

  const currentTab = queryParams.category || config.tabs[0]?.slug || params.slug

  const handleTabChange = (tabHref: string) => router.push(tabHref)

  const handleFilterChange = (filters: Record<string, any>) => {
    const newParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && !(Array.isArray(value) && value.length === 0)) {
        newParams.set(key, Array.isArray(value) ? value.join(",") : value.toString())
      }
    })
    router.push(`/${params.slug}?${newParams.toString()}`)
    setShowFilters(false)
  }

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParamsToString(searchParams))
    newParams.set("page", page.toString())
    router.push(`/${params.slug}?${newParams.toString()}`)
  }

  const removeFilter = (key: string, valueToRemove?: string) => {
    const paramsCopy = new URLSearchParams(searchParamsToString(searchParams))
    if (valueToRemove && paramsCopy.get(key)?.includes(",")) {
      const values = (paramsCopy.get(key)?.split(",") || []).filter((v) => v !== valueToRemove)
      values.length ? paramsCopy.set(key, values.join(",")) : paramsCopy.delete(key)
    } else {
      paramsCopy.delete(key)
    }
    router.push(`/${queryParams.slug}?${paramsCopy.toString()}`)
  }

  const clearAllFilters = () => router.push(`/${params.slug}`)

  const generateAppliedFiltersTitle = () => {
    const parts: string[] = []
    if (queryParams.gender) parts.push(queryParams.gender.split(",").map((g) => g.toUpperCase()).join(" + "))
    if (queryParams.sport || queryParams.activity) parts.push((queryParams.sport || queryParams.activity)!.toUpperCase())
    if (queryParams.product_type || queryParams.category) parts.push((queryParams.product_type || queryParams.category)!.toUpperCase())
    if (queryParams.material) parts.push(queryParams.material.toUpperCase())
    if (queryParams.collection) parts.push(queryParams.collection.toUpperCase())
    return parts.length ? parts.join(" · ") : config.title
  }

  // getBreadcrumbTrail(params.slug)
  const breadcrumbs =
  !isLoading && products.length > 0
    ? buildBreadcrumbFromProductItem(products[0])
    : getBreadcrumbTrail(params.slug)

  const hasExtraFilters = Object.keys(queryParams).some(
    (key) => key !== "slug" && key !== "page"
  )

  const pageTitle = hasExtraFilters
    ? `${formatSlugTitle(params.slug)} | ${generateAppliedFiltersTitle()}`
    : formatSlugTitle(params.slug)

  // ⛔ Handle lỗi sớm trước
  if (error  || !products) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">Unable to load products</h2>
        <p className="text-gray-600 mb-4">
          There was a problem fetching products. Please check your internet connection or try again later.
        </p>
        <BaseButton onClick={() => refetch()} variant="default">
          Retry
        </BaseButton>
        <BaseButton variant="link" onClick={() => router.back()} className="mt-2 text-sm text-gray-500">
          ← Go Back
        </BaseButton>
      </div>
    )
  }

  // ⏳ Loading thực sự (lần đầu hoặc đang loading dữ liệu mới)
  if (isLoading || isPlaceholderData) {
    return <FullScreenLoader />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 mb-6">
        <div className="grow min-w-0">
          <h1 className="text-3xl font-bold mb-2 truncate">
            {pageTitle}
            <span className="text-gray-500 ml-2 text-lg font-normal whitespace-nowrap">
              ({meta.total_count})
            </span>
          </h1>
          {Object.keys(queryParams).length === 1 && (
            <p className="text-gray-600 max-w-4xl truncate">{config.description}</p>
          )}
        </div>

        <div className="shrink-0 flex items-center">
          <BaseButton
            variant="outline"
            onClick={() => setShowFilters(true)}
            className="hidden sm:flex items-center gap-2 ml-4 border border-black text-black rounded-none"
          >
            {/* <Filter size={16} /> */}
            FILTER & SORT
            <SlidersHorizontal className="w-4 h-4" />
          </BaseButton>
          <BaseButton
            variant="outline"
            onClick={() => setShowFilters(true)}
            className="flex sm:hidden items-center justify-center p-2 ml-2 text-black"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </BaseButton>
        </div>
      </div>

      {/* Applied Filters */}
      {Object.keys(queryParams).length > 1 && (
        <div className="border-b bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">Applied Filters:</span>
              {Object.entries(queryParams).map(([key, value]) => {
                if (key === "slug" || key === "page") return null
                if (typeof value === "string" && value.includes(",")) {
                  return value.split(",").map((val) => (
                    <Badge key={`${key}-${val}`} variant="secondary" className="flex items-center gap-1">
                      {val}
                      <button onClick={() => removeFilter(key, val)} className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-xs">×</button>
                    </Badge>
                  ))
                }
                return (
                  <Badge key={key} variant="secondary" className="flex items-center gap-1">
                    {value}
                    <button onClick={() => removeFilter(key)} className="ml-1 hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-xs">×</button>
                  </Badge>
                )
              })}
              <button onClick={clearAllFilters} className="text-sm text-gray-500 hover:text-black underline ml-2">
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        <ProductGrid
          products={products}
          loading={isLoading}
          pagination={meta}
          onPageChange={handlePageChange}
          slug={params.slug}
        />
      </div>

      {/* Filters Sidebar */}
      <FiltersSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleFilterChange}
        slug={params.slug}
        currentFilters={queryParams}
      />
    </div>
  )
}
