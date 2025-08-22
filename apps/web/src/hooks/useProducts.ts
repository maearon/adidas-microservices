"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import type { ProductQuery } from "./useUrlFilters"

interface Product {
  id: string
  name: string
  price: number
  priceRange?: { min: number; max: number } | null
  images: Array<{
    id: string
    url: string
    filename: string
    content_type: string | null
  }>
  rating: number
  reviewCount: number
  availableSizes: string[]
  availableColors: string[]
  inStock: boolean
  brand?: string
  category?: string
  sport?: string
  gender?: string
  slug?: string
}

interface ProductsResponse {
  products: Product[]
  totalCount: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  filters: {
    applied: Record<string, any>
  }
}

async function fetchProducts(query: ProductQuery, pageParam = 1): Promise<ProductsResponse> {
  const params = new URLSearchParams()

  // Add all query parameters
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, String(v)))
    } else {
      params.set(key, String(value))
    }
  })

  // Override page parameter
  params.set("page", String(pageParam))

  const response = await fetch(`/api/product-list?${params.toString()}`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.details || `HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

export function useProducts(query: ProductQuery) {
  return useInfiniteQuery({
    queryKey: ["products", query],
    queryFn: ({ pageParam = 1 }) => fetchProducts(query, pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error.message.includes("HTTP 4")) return false
      return failureCount < 3
    },
  })
}

// Keep existing exports for backward compatibility
export const useSearchProductsFeed = (query: string) => {
  return useInfiniteQuery({
    queryKey: ["product-feed", "search", query],
    queryFn: async ({ pageParam }) => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&cursor=${pageParam || ""}`)
      if (!response.ok) throw new Error("Search failed")
      return response.json()
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    retry: (failureCount, error) => {
      return failureCount < 1
    },
  })
}

export const useProductDetail = (slug: string, variant_code: string) => {
  return useInfiniteQuery({
    queryKey: ["product-detail", slug, variant_code],
    queryFn: async () => {
      const response = await fetch(`/api/product?q=${encodeURIComponent(variant_code)}`)
      if (!response.ok) throw new Error("Product not found")
      return response.json()
    },
    initialPageParam: null,
    getNextPageParam: () => undefined,
    retry: (failureCount) => failureCount < 1,
  })
}
