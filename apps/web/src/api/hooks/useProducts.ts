import { InfiniteData, useQuery } from "@tanstack/react-query"
import { ProductFilters, FilterOptionsResponse } from "@/types/product"
import { handleNetworkError } from "@/components/shared/handleNetworkError"
import { useInfiniteQuery } from "@tanstack/react-query"
import { ProductData, ProductsPage } from "@/lib/types"
import axiosInstance from "@/lib/axios"
import type { AxiosError } from "axios"

export const useSearchProductsFeed = (query: string) => {
  return useInfiniteQuery({
    queryKey: ["product-feed", "search", query],
    queryFn: async ({ pageParam }) => {
      const response = await axiosInstance.get<ProductsPage>("/api/search", {
        params: {
          q: query,
          ...(pageParam ? { cursor: pageParam } : {}),
        },
      })
      return response.data
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    retry: (failureCount, error: AxiosError<{ code?: string }>) => {
      if (error?.code === "ERR_NETWORK") return false
      return failureCount < 1
    },
  })
}

export const useProductDetail = (slug: string, variant_code: string) => {
  return useQuery({
    queryKey: ["product-detail", slug, variant_code],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get<ProductData>("/api/product", {
          params: { q: variant_code },
        })
        const product = response.data
        if (!product) throw new Error("Product not found")
        return product
      } catch (error: unknown) {
        handleNetworkError(error)
        throw error
      }
    },
    retry: (failureCount, error: AxiosError<{ code?: string }>) => {
      if (error?.code === "ERR_NETWORK") return false
      return failureCount < 1
    },
  })
}

function serializeFilterParams(filters: ProductFilters): Record<string, string | number> {
  const params: Record<string, string | number> = {}

  const arrayKeys: (keyof ProductFilters)[] = [
    "gender",
    "category",
    "sport",
    "activity",
    "product_type",
    "brand",
    "material",
    "collection",
    "franchise",
    "size",
    "color",
    "shipping",
    "best_for",
    "surface",
    "width",
    "features",
  ]

  for (const key of arrayKeys) {
    const value = filters[key]
    if (value === undefined || value === null || value === "") continue
    params[key] = Array.isArray(value) ? value.join(",") : String(value)
  }

  if (filters.min_price !== undefined && filters.min_price !== null && filters.min_price !== "") {
    params.min_price = Number(filters.min_price)
  }
  if (filters.max_price !== undefined && filters.max_price !== null && filters.max_price !== "") {
    params.max_price = Number(filters.max_price)
  }
  if (filters.sort) params.sort = String(filters.sort)
  if (filters.slug) params.slug = String(filters.slug)
  if (filters.q) params.q = String(filters.q)

  return params
}

export type ProductsPageWithFacets = ProductsPage & {
  facets?: FilterOptionsResponse | null
}

export const useProducts = (filters: ProductFilters = {}) => {
  return useInfiniteQuery<
    ProductsPageWithFacets,
    AxiosError<{ code?: string }>,
    InfiniteData<ProductsPageWithFacets>,
    (string | ProductFilters)[],
    string | undefined
  >({
    queryKey: ["product-list", "filters", filters],
    queryFn: async ({ pageParam = undefined }) => {
      const params = {
        ...serializeFilterParams(filters),
        ...(pageParam ? { cursor: pageParam } : {}),
        include_facets: pageParam ? "0" : "1",
      }
      const response = await axiosInstance.get<ProductsPageWithFacets>("/api/products", {
        params,
      })
      return response.data
    },
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    initialPageParam: undefined,
    retry: (failureCount, error) => {
      if (error.code === "ERR_NETWORK") return false
      return failureCount < 1
    },
  })
}
