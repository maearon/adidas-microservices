"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "@/hooks/useTranslations"

import { BaseButton } from "@/components/ui/base-button"
import FiltersSidebar from "@/components/filter/filters-sidebar"
import { getCategoryConfig, formatSlugTitle } from "@/utils/category-config.auto"
import type { ProductQuery } from "@/api/services/rubyService"
import { useProducts } from "@/api/hooks/useProducts"
import Loading from "@/components/loading"
import { FilterBar, FilterChips, ProductListToolbar, ProductListContainer, ProductListHeader } from "./components"
import type { Product } from "@/types/product"
import { parseSlugToFilters, generateQueryParams, type SlugFilters } from "@/utils/slug-parser"
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer"
import { mapProductDataToProduct } from "@/lib/mappers/product-data-to-product"
import { countAppliedFilters } from "@/lib/filters/count-applied-filters"

interface CategoryPageClientProps {
  params: { slug: string }
  searchParams?: Record<string, string | undefined>
  query: string;
}

export default function CategoryPageClient({ params, searchParams, query }: CategoryPageClientProps) {
  const t = useTranslations("productList")
  const tFilter = useTranslations("filter")
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const router = useRouter()
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const config = getCategoryConfig(params.slug)

  // Initialize filters based on slug using the new parser
  const [filters, setFilters] = useState<Record<string, any>>(() => {
    const slugFilters = parseSlugToFilters(params.slug)
    return slugFilters
  })

  const [currentSort, setCurrentSort] = useState(
    () => (typeof filters.sort === "string" ? filters.sort : "newest")
  )

  // Keep sort UI in sync when filters change from sidebar
  useEffect(() => {
    if (typeof filters.sort === "string" && filters.sort) {
      setCurrentSort(filters.sort)
    }
  }, [filters.sort])

  // Update filters when slug changes
  useEffect(() => {
    const slugFilters = parseSlugToFilters(params.slug)
    setFilters(slugFilters)
  }, [params.slug])

  const allowedKeys = [
    "page", "sort", "gender", "category", "activity", "sport",
    "product_type", "size", "color", "material", "brand", "model",
    "collection", "min_price", "max_price", "shipping",
    "best_for", "surface", "width",
  ] as const

  // Merge URL params with local filters
  const queryParams = useMemo(() => {
    const query: Record<string, unknown> = { slug: params.slug }
    const search = searchParams || {}

    Object.entries(filters).forEach(([key, value]) => {
      if (value && (allowedKeys as readonly string[]).includes(key)) {
        query[key] = value
      }
    })

    for (const key of allowedKeys) {
      const value = search[key]
      if (!value) continue

      if (["min_price", "max_price", "page"].includes(key)) {
        const num = Number(value)
        if (!isNaN(num)) query[key] = num
      } else if (typeof value === "string" && value.includes(",")) {
        query[key] = value.split(",").map((v) => v.trim()).filter(Boolean)
      } else {
        query[key] = value
      }
    }

    return query
  }, [searchParams, params.slug, filters])

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useProducts(queryParams as ProductQuery)

  // Map API response to Product type
  const products: Product[] = data?.pages.flatMap((page) =>
    page.products.map((productData: any) => mapProductDataToProduct(productData))
  ) || [];
  
  const totalCount = data?.pages?.[0]?.totalCount ?? 0;
  const facets = data?.pages?.[0]?.facets ?? null;

  // Handle filter changes
  const handleFilterChange = (newFilters: Record<string, any>) => {
    // Preserve slug-derived base filters unless user explicitly overrides them
    const slugBase = parseSlugToFilters(params.slug)
    const merged = { ...slugBase, ...newFilters }

    // If user cleared everything, fall back to slug base
    const hasAny =
      Object.keys(newFilters).length > 0 &&
      Object.values(newFilters).some((v) =>
        Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && v !== ""
      )

    const finalFilters = hasAny ? merged : slugBase
    setFilters(finalFilters)

    const queryParams = generateQueryParams(finalFilters as SlugFilters)
    const urlParams = new URLSearchParams()
    Object.entries(queryParams).forEach(([key, values]) => {
      // Prefer comma-joined for array filters so API parsing stays simple
      if (values.length === 1) urlParams.set(key, values[0])
      else if (values.length > 1) urlParams.set(key, values.join(","))
    })

    const base = params.slug.startsWith("/") ? params.slug : `/${params.slug}`
    const finalUrl = urlParams.toString() ? `${base}?${urlParams.toString()}` : base
    router.push(finalUrl, { scroll: false })
  }

  const handleClearFilters = () => {
    const slugFilters = parseSlugToFilters(params.slug)
    setFilters(slugFilters)
    const base = params.slug.startsWith("/") ? params.slug : `/${params.slug}`
    router.push(base, { scroll: false })
  }

  const handleRemoveFilter = (filterKey: string, value?: string) => {
    const newFilters = { ...filters }
    
    if (value && Array.isArray(newFilters[filterKey])) {
      newFilters[filterKey] = newFilters[filterKey].filter((v: string) => v !== value)
      if (newFilters[filterKey].length === 0) {
        delete newFilters[filterKey]
      }
    } else {
      delete newFilters[filterKey]
    }
    
    handleFilterChange(newFilters)
  }

  const handleSortChange = (sort: string) => {
    setCurrentSort(sort)
    const newFilters = { ...filters, sort }
    handleFilterChange(newFilters)
  }

  const handleViewChange = (view: 'grid' | 'list') => {
    setViewMode(view)
  }

  const handleFilterToggle = () => {
    setIsFiltersOpen(true)
  }

  const handleLoadMore = () => {
    if (hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }

  if (status === "pending") {
    return <Loading />;
  }

  const isError = status === "error";
  const isEmpty = products.length === 0 && !isError;

  const pageTitle = formatSlugTitle(params.slug)

  return (
    <>
      {/* Header */}
      <ProductListHeader
        title={pageTitle}
        totalCount={totalCount}
        onSearch={(query) => {
          // Handle search - you can implement this later
          console.log('Search query:', query)
        }}
        showSearchBar={false}
      />

      {/* Error State */}
      {isError && (
        <div className="min-h-screen flex flex-col justify-center items-center bg-background px-4 text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">{t?.unableToLoadProducts || "Unable to load products"}</h2>
          <p className="text-gray-600 dark:text-white mb-4">
            {t?.problemFetchingProducts || "There was a problem fetching products. Please check your internet connection or try again later."}
          </p>
          <BaseButton onClick={() => refetch()} variant="default">
            {t?.retry || "Retry"}
          </BaseButton>
          <BaseButton variant="link" onClick={() => router.back()} className="mt-2 text-base text-gray-500">
            {t?.goBack || "← Go Back"}
          </BaseButton>
        </div>
      )}

      {/* Always show filter chrome when not in error */}
      {!isError && (
        <>
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            slug={params.slug}
            totalCount={totalCount}
          />

          <FilterChips
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearFilters}
            slug={params.slug}
          />

          <ProductListToolbar
            products={products}
            totalCount={totalCount}
            currentSort={currentSort}
            viewMode={viewMode}
            onSortChange={handleSortChange}
            onViewChange={handleViewChange}
            onFilterToggle={handleFilterToggle}
            appliedFilterCount={countAppliedFilters(filters)}
          />
        </>
      )}

      {/* Empty State */}
      {isEmpty && !isError && (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">{t?.noResultsFound || "No results found"}</h3>
          <p className="text-gray-600 dark:text-white mb-4">
            {t?.noProductsMatching || "We couldn't find any products matching the current filters. Try adjusting your filters or browse other categories."}
          </p>
          <BaseButton onClick={handleFilterToggle} variant="outline" className="rounded-none">
            {tFilter?.filterAndSort || "Filter & Sort"}
          </BaseButton>
        </div>
      )}

      {/* Product List */}
      {!isError && products.length > 0 && (
        <InfiniteScrollContainer onBottomReached={handleLoadMore}>
          <ProductListContainer
            products={products}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            viewMode={viewMode}
          />
        </InfiniteScrollContainer>
      )}

      {/* Sidebar Filters */}
      <FiltersSidebar
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onApplyFilters={handleFilterChange}
        currentFilters={filters as Record<string, string | number | string[]>}
        totalCount={totalCount}
        facets={facets}
        preset="plp"
      />
    </>
  );
}
