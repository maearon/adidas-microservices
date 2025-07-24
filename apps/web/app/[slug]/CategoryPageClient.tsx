"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Filter, Loader2, SlidersHorizontal } from "lucide-react"

import { BaseButton } from "@/components/ui/base-button"
import { Badge } from "@/components/ui/badge"
import ProductGrid from "@/components/product-grid"
import FiltersSidebar from "@/components/filters-sidebar"
import { getCategoryConfig, categoryConfigs, formatSlugTitle } from "@/utils/category-config.auto"
import type { ProductQuery } from "@/api/services/rubyService"
import { useProducts, useSearchProductsFeed } from "@/api/hooks/useProducts"
import Link from "next/link"
import { buildBreadcrumbFromProductItem } from "@/utils/breadcrumb"
import BreadcrumbSkeleton from "@/components/BreadcrumbSkeleton"
import FullScreenLoader from "@/components/ui/FullScreenLoader"
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer"
import ProductCard from "@/components/product-card"
import { SearchFilters as SearchFiltersType } from "@/types/search";
import Loading from "@/components/loading"
import { Button } from "@/components/ui/button"

interface CategoryPageClientProps {
  params: { slug: string }
  searchParams?: Record<string, string | undefined>
  query: string;
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

export default function CategoryPageClient({ params, searchParams, query }: CategoryPageClientProps) {
  // const searchParams = useSearchParams();
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

  // const { data, isLoading, isPlaceholderData, error, refetch } = useProducts(queryParams)
  const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      status,
      refetch,
  } = useProducts(queryParams)

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFiltersType>({});

  

  // const sitePath = searchParams.get("sitePath") || "us";

  const handleFilterChange = (filters: Record<string, any>) => {
  // const handleFiltersChange = (newFilters: Partial<SearchFiltersType>) => {
      // const updatedFilters = { ...filters, ...newFilters, page: 1 };
      // setFilters(updatedFilters);
  
      // const params = new URLSearchParams();
      // params.set("q", updatedFilters.query || "");
      // params.set("sitePath", sitePath);
  
      // Object.entries(updatedFilters).forEach(([key, value]) => {
      //   if (
      //     value !== undefined &&
      //     value !== null &&
      //     value !== "" &&
      //     key !== "query"
      //   ) {
      //     params.set(key, value.toString());
      //   }
      // });
  
      // router.push(`/search?${params.toString()}`);
    };
  
    const products = data?.pages.flatMap((page) => page.products) || [];
  
    if (status === "pending" || isFetching) {
      return <Loading />;
    }
  
    const isError = status === "error";
    const isEmpty = products.length === 0 && "a";

  // const products = data?.products || []
  // const meta = data?.meta || {
  //   current_page: 1,
  //   total_pages: 1,
  //   total_count: 0,
  //   per_page: 24,
  //   filters_applied: {},
  // }

  // const currentTab = queryParams.category || config.tabs[0]?.slug || params.slug

  // const handleTabChange = (tabHref: string) => router.push(tabHref)

  // const handleFilterChange = (filters: Record<string, any>) => {
  //   const newParams = new URLSearchParams()
  //   Object.entries(filters).forEach(([key, value]) => {
  //     if (value && !(Array.isArray(value) && value.length === 0)) {
  //       newParams.set(key, Array.isArray(value) ? value.join(",") : value.toString())
  //     }
  //   })
  //   router.push(`/${params.slug}?${newParams.toString()}`)
  //   setShowFilters(false)
  // }

  // const handlePageChange = (page: number) => {
  //   const newParams = new URLSearchParams(searchParamsToString(searchParams))
  //   newParams.set("page", page.toString())
  //   router.push(`/${params.slug}?${newParams.toString()}`)
  // }

  // const removeFilter = (key: string, valueToRemove?: string) => {
  //   const paramsCopy = new URLSearchParams(searchParamsToString(searchParams))
  //   if (valueToRemove && paramsCopy.get(key)?.includes(",")) {
  //     const values = (paramsCopy.get(key)?.split(",") || []).filter((v) => v !== valueToRemove)
  //     values.length ? paramsCopy.set(key, values.join(",")) : paramsCopy.delete(key)
  //   } else {
  //     paramsCopy.delete(key)
  //   }
  //   router.push(`/${queryParams.slug}?${paramsCopy.toString()}`)
  // }

  // const clearAllFilters = () => router.push(`/${params.slug}`)

  const generateAppliedFiltersTitle = () => {
    const parts: string[] = []
    if (queryParams.gender) parts.push(queryParams.gender.split(",").map((g) => g.toUpperCase()).join(" + "))
    if (queryParams.sport || queryParams.activity) parts.push((queryParams.sport || queryParams.activity)!.toUpperCase())
    if (queryParams.product_type || queryParams.category) parts.push((queryParams.product_type || queryParams.category)!.toUpperCase())
    if (queryParams.material) parts.push(queryParams.material.toUpperCase())
    if (queryParams.collection) parts.push(queryParams.collection.toUpperCase())
    return parts.length ? parts.join(" · ") : config.title
  }

  // // getBreadcrumbTrail(params.slug)
  // const breadcrumbs =
  // !isLoading && products.length > 0
  //   ? buildBreadcrumbFromProductItem(products[0])
  //   : getBreadcrumbTrail(params.slug)

  const hasExtraFilters = Object.keys(queryParams).some(
    (key) => key !== "slug" && key !== "page"
  )

  const pageTitle = hasExtraFilters
    ? `${formatSlugTitle("men-shoes")} | ${generateAppliedFiltersTitle()}`
    : formatSlugTitle("men-shoes")

  // ⏳ Loading thực sự (lần đầu hoặc đang loading dữ liệu mới)
  // if (isLoading || isPlaceholderData) {
  //   return <FullScreenLoader />
  // }

  // const isError = status === "error";
  // const isEmpty = products.length === 0 && "a";

  return (
      <>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 mb-4">
          <div className="grow min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold mb-1 truncate mb[30px]">
              {pageTitle}
            </h1>
            {products.length > 0 && (
              <p className="text-gray-600 truncate">
                Showing {products.length} of {products.length} results
              </p>
            )}
          </div>
  
          {/* Filter Button */}
          <div className="shrink-0 flex items-center">
            <BaseButton
              variant="outline"
              onClick={() => setIsFiltersOpen(true)}
              className="hidden sm:flex items-center gap-2 border border-black text-black rounded-none"
            >
              {/* <Filter size={16} /> */}
              FILTER & SORT
              <SlidersHorizontal className="w-4 h-4" />
            </BaseButton>
            <BaseButton
              variant="outline"
              onClick={() => setIsFiltersOpen(true)}
              className="flex sm:hidden items-center justify-center p-2 text-black"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </BaseButton>
          </div>
        </div>
  
        {/* Error State */}
        {isError && (
            <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 text-center">
              <h2 className="text-2xl font-semibold text-red-600 mb-2">Unable to load products</h2>
              <p className="text-gray-600 mb-4">
                There was a problem fetching products. Please check your internet connection or try again later.
              </p>
              <BaseButton onClick={() => refetch()} variant="default">
                Retry
              </BaseButton>
              <BaseButton variant="link" onClick={() => router.back()} className="mt-2 text-base text-gray-500">
                ← Go Back
              </BaseButton>
            </div>
        )}
  
        {/* Empty State */}
        {isEmpty && !isError && (
          <div className="text-center py-4">
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any products matching "{query}". Try adjusting
              your search terms or filters.
            </p>
            <div className="space-y-2">
              <p className="text-base text-gray-500">Suggestions:</p>
              <ul className="text-base text-gray-500 space-y-1">
                <li>• Check your spelling</li>
                <li>• Try more general terms</li>
                <li>• Use fewer keywords</li>
              </ul>
            </div>
          </div>
        )}
  
        {/* Product Grid */}
        {!isError && products.length > 0 && (
          <InfiniteScrollContainer
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            onBottomReached={() => console.log("Reached bottom") // TODO: Uncomment this line when implementing infinite scroll
              // hasNextPage && !isFetching && fetchNextPage()
            }
          >
            {products.map((product, index) => (
              <ProductCard key={`${product.id}-${index}`} product={product} />
            ))}
            {isFetchingNextPage && (
              <div className="col-span-full flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
          </InfiniteScrollContainer>
        )}
  
        {/* Sidebar Filters */}
        {/* <SearchFilters
          isOpen={isFiltersOpen}
          onClose={() => setIsFiltersOpen(false)}
          onFiltersChange={handleFiltersChange}
          currentFilters={filters}
          totalResults={products.length}
        /> */}
        {/* Filters Sidebar */}
        <FiltersSidebar
          isOpen={isFiltersOpen}
          onClose={() => setIsFiltersOpen(false)}
          onApplyFilters={handleFilterChange}
          slug={params.slug}
          currentFilters={queryParams}
        />
      </>
    );
  }
