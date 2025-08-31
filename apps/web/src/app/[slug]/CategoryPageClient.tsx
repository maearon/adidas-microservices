"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"
import { useTranslations } from "@/hooks/useTranslations"

import { BaseButton } from "@/components/ui/base-button"
import FiltersSidebar from "@/components/filter/filters-sidebar"
import { getCategoryConfig, formatSlugTitle } from "@/utils/category-config.auto"
import type { ProductQuery } from "@/api/services/rubyService"
import { useProducts } from "@/api/hooks/useProducts"
import Loading from "@/components/loading"
import { FilterBar, FilterChips, ProductListToolbar, ProductListContainer, ProductListHeader } from "./components"
import type { Product } from "@/types/product"
import { parseSlugToFilters, generateUrlFromFilters, generateQueryParams, type SlugFilters } from "@/utils/slug-parser"
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer"
import { mapProductDataToProduct } from "@/lib/mappers/product-data-to-product"

interface CategoryPageClientProps {
  params: { slug: string }
  searchParams?: Record<string, string | undefined>
  query: string;
}

export default function CategoryPageClient({ params, searchParams, query }: CategoryPageClientProps) {
  const t = useTranslations("productList")
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const router = useRouter()
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentSort, setCurrentSort] = useState('newest')

  const config = getCategoryConfig(params.slug)

  // Initialize filters based on slug using the new parser
  const [filters, setFilters] = useState<Record<string, any>>(() => {
    const slugFilters = parseSlugToFilters(params.slug)
    return slugFilters
  })

  // Update filters when slug changes
  useEffect(() => {
    const slugFilters = parseSlugToFilters(params.slug)
    setFilters(slugFilters)
  }, [params.slug])

  const allowedKeys: (keyof ProductQuery)[] = [
    "page", "sort", "gender", "category", "activity", "sport",
    "product_type", "size", "color", "material", "brand", "model",
    "collection", "min_price", "max_price", "shipping"
  ]

  // Merge URL params with local filters
  const queryParams: ProductQuery = useMemo(() => {
    const query: Partial<ProductQuery> = { slug: params.slug }
    const search = searchParams || {}

    // Add local filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && allowedKeys.includes(key as keyof ProductQuery)) {
        query[key as keyof ProductQuery] = value as any
      }
    })

    // Add URL params (these override local filters)
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
  }, [searchParams, params.slug, filters])

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useProducts(queryParams)

  // Map API response to Product type
  const products: Product[] = data?.pages.flatMap((page) =>
    page.products.map((productData: any) => mapProductDataToProduct(productData))
  ) || [];
  
  const totalCount = data?.pages?.[0]?.totalCount ?? 0;

  // Handle filter changes
  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters)
    
    // Generate new URL based on filters
    const newUrl = generateUrlFromFilters(newFilters as SlugFilters, params.slug)
    
    // Generate query parameters
    const queryParams = generateQueryParams(newFilters as SlugFilters)
    
    // Build URL with query parameters
    const urlParams = new URLSearchParams()
    Object.entries(queryParams).forEach(([key, values]) => {
      values.forEach(value => {
        urlParams.append(key, value)
      })
    })
    
    const finalUrl = urlParams.toString() ? `${newUrl}?${urlParams.toString()}` : newUrl
    router.push(finalUrl, { scroll: false })
  }

  const handleClearFilters = () => {
    // Keep only the basic filters from slug
    const slugFilters = parseSlugToFilters(params.slug)
    setFilters(slugFilters)
    
    // Navigate to base slug without query params
    router.push(params.slug, { scroll: false })
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

      {/* Empty State */}
      {isEmpty && !isError && (
        <div className="text-center py-4">
          <h3 className="text-lg font-semibold mb-2">{t?.noResultsFound || "No results found"}</h3>
          <p className="text-gray-600 dark:text-white mb-4">
            {t?.noProductsMatching || "We couldn't find any products matching the current filters. Try adjusting your filters or browse other categories."}
          </p>
          <div className="space-y-2">
            <p className="text-base text-gray-500">{t?.suggestions || "Suggestions:"}</p>
            <ul className="text-base text-gray-500 space-y-1">
              <li>• {t?.tryDifferentFilters || "Try different filters"}</li>
              <li>• {t?.browseOtherCategories || "Browse other categories"}</li>
              <li>• {t?.checkSimilarProducts || "Check for similar products"}</li>
            </ul>
          </div>
        </div>
      )}

      {/* Product List */}
      {!isError && products.length > 0 && (
        <>
          {/* Filter Bar */}
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            slug={params.slug}
            totalCount={totalCount}
          />

          {/* Filter Chips */}
          <FilterChips
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearFilters}
            slug={params.slug}
          />

          {/* Toolbar */}
          <ProductListToolbar
            products={products}
            totalCount={totalCount}
            currentSort={currentSort}
            viewMode={viewMode}
            onSortChange={handleSortChange}
            onViewChange={handleViewChange}
            onFilterToggle={handleFilterToggle}
          />

          {/* Product Grid */}
          <InfiniteScrollContainer onBottomReached={handleLoadMore}>
            <ProductListContainer
              products={products}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              viewMode={viewMode}
            />
          </InfiniteScrollContainer>
        </>
      )}

      {/* Sidebar Filters */}
      <FiltersSidebar
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onApplyFilters={handleFilterChange}
        currentFilters={filters as Record<string, string | number | string[]>}
      />
    </>
  );
}
