import { useQuery, UseQueryResult } from "@tanstack/react-query"
import rubyService from "@/api/services/rubyService"
import { Product, ProductFilters, ProductsResponse } from "@/types/product"
import { handleNetworkError } from "@/components/shared/handleNetworkError"

const CACHE_TTL = 1000 * 60 * 5 // 5 phút

// ===============================
// ✅ useProductDetail: Lấy chi tiết sản phẩm theo slug + model
// ===============================
export function useProductDetail(
  slug: string,
  model: string
): UseQueryResult<Product, Error> {
  return useQuery<Product, Error>({
    queryKey: ["productDetail", slug, model],
    queryFn: async () => {
      try {
        const product = await rubyService.getProductBySlugAndVariant(slug, model)
        if (!product) throw new Error("Product not found")
        return product
      } catch (error: any) {
        handleNetworkError(error)
        throw error
      }
    },
    retry: (failureCount, error: any) => {
      if (error?.code === "ERR_NETWORK") return false
      return failureCount < 1
    },
    staleTime: CACHE_TTL,
    gcTime: CACHE_TTL * 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

// ===============================
// ✅ useProducts: Lấy danh sách sản phẩm
// ===============================
export function useProducts(
  filters: ProductFilters = {}
): UseQueryResult<ProductsResponse, Error> {
  return useQuery<ProductsResponse, Error>({
    queryKey: ["products", filters],
    queryFn: async () => {
      try {
        const data = await rubyService.getProducts(filters as any)
        if (!data) throw new Error("No product data found")
        return data
      } catch (error: any) {
        handleNetworkError(error)
        throw error
      }
    },
    retry: (failureCount, error: any) => {
      if (error?.code === "ERR_NETWORK") return false
      return failureCount < 1
    },
    staleTime: CACHE_TTL,
    gcTime: CACHE_TTL * 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}
