"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
// import Product from "@/components/products/Product";
import ProductsLoadingSkeleton from "@/components/products/ProductsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { ProductsPage } from "@/lib/types"
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductGrid from "@/components/product-grid"
import SearchFilters from "@/components/search-filters"
import { Product } from "@/types/product/product"
import { SearchFilters as SearchFiltersType } from "@/types/search"
import javaService from "@/api/services/javaService"
import { Nullable } from "@/types/common"
import { BaseButton } from "@/components/ui/base-button"
import { Metadata } from "next";
import ProductCard from "@/components/product-card";

interface SearchResultsProps {
  query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["product-feed", "search", query],
    queryFn: async ({ pageParam }) => {
  const res = await kyInstance.get("/api/search", {
    searchParams: {
      q: query,
      ...(pageParam ? { cursor: pageParam } : {}),
    },
  });
  const json = await res.json<ProductsPage>();
  console.log("Search result:", json); // 👈 kiểm tra ở đây
  return json;
  },
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      gcTime: 0,
  });
  const searchParams = useSearchParams()
  const router = useRouter()
  // const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Nullable<string>>(null)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<SearchFiltersType>({})

  // const query = searchParams.get("q") || ""
  const sitePath = searchParams.get("sitePath") || "us"

  // useEffect(() => {
  //   const initialFilters: SearchFiltersType = {
  //     query,
  //     page: 1,
  //     size: 20,
  //   }

  //   // Parse URL params into filters
  //   const category = searchParams.get("category")
  //   const brand = searchParams.get("brand")
  //   const gender = searchParams.get("gender")
  //   const sport = searchParams.get("sport")
  //   const minPrice = searchParams.get("min_price")
  //   const maxPrice = searchParams.get("max_price")
  //   const sort = searchParams.get("sort")

  //   if (category) initialFilters.category = category
  //   if (brand) initialFilters.brand = brand
  //   if (gender) initialFilters.gender = gender
  //   if (sport) initialFilters.sport = sport
  //   if (minPrice) initialFilters.min_price = Number.parseInt(minPrice)
  //   if (maxPrice) initialFilters.max_price = Number.parseInt(maxPrice)
  //   if (sort) initialFilters.sort = sort

  //   setFilters(initialFilters)
  //   performSearch(initialFilters)
  // }, [searchParams])

  // const performSearch = async (searchFilters: SearchFiltersType) => {
  //   if (!searchFilters.query) return

  //   setLoading(true)
  //   setError(null)

  //   try {
  //     const response = await javaService.searchProducts(searchFilters)
  //     setProducts(response.products)
  //     setTotalResults(response.total)
  //     setCurrentPage(searchFilters.page || 1)
  //   } catch (err) {
  //     console.error("Search error:", err)
  //     setError("Failed to search products. Please try again.")
  //     setProducts([])
  //     setTotalResults(0)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleFiltersChange = (newFilters: Partial<SearchFiltersType>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }
    setFilters(updatedFilters)

    // Update URL with new filters
    const params = new URLSearchParams()
    params.set("q", updatedFilters.query || "")
    params.set("sitePath", sitePath)

    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && key !== "query") {
        params.set(key, value.toString())
      }
    })

    router.push(`/search?${params.toString()}`)
  }

  // const loadMore = () => {
  //   const nextPage = currentPage + 1
  //   const updatedFilters = { ...filters, page: nextPage }

  //   performSearch(updatedFilters).then(() => {
  //     setCurrentPage(nextPage)
  //   })
  // }

  const products = data?.pages.flatMap((page) => page.products) || [];

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-80 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (status === "pending") {
    return <ProductsLoadingSkeleton />;
  }

  if (status === "success" && !products.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No products found for this query.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading products.
      </p>
    );
  }

  return (
    <>
      {/* Search Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 mb-4">
        <div className="flex-grow min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 truncate">
            Search for: "{query.toUpperCase()}" [{totalResults}]
          </h1>
          {totalResults > 0 && (
            <p className="text-gray-600 truncate">
              Showing {products.length} of {totalResults} results
            </p>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex-shrink-0 flex items-center">
          {/* Button for sm and up */}
          <BaseButton
            variant="outline"
            onClick={() => setIsFiltersOpen(true)}
            className="hidden sm:flex items-center gap-2"
          >
            <Filter size={16} />
            FILTER & SORT
            <SlidersHorizontal className="w-4 h-4" />
          </BaseButton>

          {/* Icon-only button for mobile */}
          <BaseButton
            variant="outline"
            onClick={() => setIsFiltersOpen(true)}
            className="flex sm:hidden items-center justify-center p-2"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </BaseButton>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-4">
          <h3 className="text-lg font-semibold mb-2 text-red-600">Search Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          {/* <Button shadow={false} theme="black" onClick={() => performSearch(filters)}>Try Again</Button> */}
        </div>
      )}

      {/* No Results */}
      {!loading && !error && products.length === 0 && query && (
        <div className="text-center py-4">
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any products matching "{query}". Try adjusting your search terms or filters.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Suggestions:</p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Check your spelling</li>
              <li>• Try more general terms</li>
              <li>• Use fewer keywords</li>
            </ul>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {/* {products.length > 0 && (
        <>
          <ProductGrid products={products} columns={4} />

          Load More
          {products.length < totalResults && (
            <div className="text-center mt-12">
              <Button onClick={loadMore} disabled={loading} variant="outline" size="lg">
                {loading ? "Loading..." : `Load More (${totalResults - products.length} remaining)`}
              </Button>
            </div>
          )}
        </>
      )} */}

      <InfiniteScrollContainer
        className="space-y-5"
        onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      >
        {products.map((product, index) => (
          <ProductCard key={`${product.id}-${index}`} product={product} />
        ))}
        {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
      </InfiniteScrollContainer>

      {/* Search Filters Sidebar */}
      <SearchFilters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onFiltersChange={handleFiltersChange}
        currentFilters={filters}
        totalResults={totalResults}
      />
    </>
  );
}
