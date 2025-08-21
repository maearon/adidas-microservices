import { InfiniteData, useQuery } from "@tanstack/react-query"
import { ProductFilters } from "@/types/product"
import { handleNetworkError } from "@/components/shared/handleNetworkError"
import { useInfiniteQuery } from "@tanstack/react-query";
import { ProductData, ProductsPage } from "@/lib/types";
import axiosInstance from "@/lib/axios";
import type { AxiosError } from "axios";

export const useSearchProductsFeed = (query: string) => {
  return useInfiniteQuery({
    queryKey: ["product-feed", "search", query],
    queryFn: async ({ pageParam }) => {
      const response = await axiosInstance.get<ProductsPage>("/api/search", { // search/route.ts
        params: {
          q: query,
          ...(pageParam ? { cursor: pageParam } : {}),
        },
      });
      return response.data;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    retry: (failureCount, error: AxiosError<{ code?: string }>) => {
      if (error?.code === "ERR_NETWORK") return false;
      return failureCount < 1;
    }
  });
};

// ===============================
// ✅ useProductDetail: Lấy chi tiết sản phẩm theo slug + model
// ===============================
export const useProductDetail = ( slug: string, variant_code: string) => {
  return useQuery({
    // ): UseQueryResult<Product, Error> {
    queryKey: ["product-detail", slug, variant_code],
    queryFn: async () => {
      try {
        // const product = await rubyService.getProductBySlugAndVariant(slug, model)
        const response = await axiosInstance.get<ProductData>("/api/product", {
          params: {
            q: variant_code
          },
        });
        const product = response.data;
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
    }
  })
}

// ===============================
// ✅ useProducts: Lấy danh sách sản phẩm
// ===============================

// export const useProducts = (filters: ProductFilters = {}) => {
//   return useInfiniteQuery<ProductsPage, Error, ProductsPage, (string | ProductFilters)[], string | undefined>({
//     queryKey: ["product-list", "search", filters],
//     queryFn: async ({ pageParam = undefined }) => {
//       const response = await axiosInstance.get<ProductsPage>("/api/search", {
//         params: {
//           q: 'a',
//           ...(pageParam ? { cursor: pageParam } : {}),
//         },
//       });
//       return response.data;
//     },
//     getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
//     initialPageParam: undefined,
//     retry: (failureCount, error) => {
//       const axiosErr = error as import("axios").AxiosError<{ code?: string }>;
//       if (axiosErr.code === "ERR_NETWORK") return false;
//       return failureCount < 1;
//     }
//   });
// };

export const useProducts = (filters: ProductFilters = {}) => {
  return useInfiniteQuery<
    ProductsPage, // dữ liệu trả về từ queryFn
    AxiosError<{ code?: string }>, // error type
    InfiniteData<ProductsPage>, // dữ liệu transform (data.pages)
    (string | ProductFilters)[], // queryKey
    string | undefined // pageParam (cursor)
  >({
    queryKey: ["product-list", "filters", filters],
    queryFn: async ({ pageParam = undefined }) => {
    
      const params: ProductFilters = {
        ...(filters.gender ? { gender: filters.gender } : {}),
        ...(filters.category ? { category: filters.category } : {}),
        // ...(filters.priceMin ? { price_min: filters.priceMin } : {}),
        // ...(filters.priceMax ? { price_max: filters.priceMax } : {}),
        ...(pageParam ? { cursor: pageParam } : {}),
      };
      const response = await axiosInstance.get<ProductsPage>("/api/products", {
        params,
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    initialPageParam: undefined,
    retry: (failureCount, error) => {
      if (error.code === "ERR_NETWORK") return false;
      return failureCount < 1;
    }
  });
};

// useInfiniteQuery<
//   TQueryFnData, // 1️⃣ Dữ liệu trả về từ queryFn
//   TError,       // 2️⃣ Kiểu error (mặc định: unknown)
//   TData,        // 3️⃣ Dữ liệu sau khi transform (select)
//   TQueryKey,    // 4️⃣ Kiểu queryKey
//   TPageParam    // 5️⃣ Kiểu pageParam
// >()

// export function useProducts(
//   filters: ProductFilters = {}
// ): UseQueryResult<ProductsResponse, Error> {
//   return useQuery<ProductsResponse, Error>({
//     queryKey: ["products", filters],
//     queryFn: async () => {
//       try {
//         const data = await rubyService.getProducts(filters as any)
//         if (!data) throw new Error("No product data found")
//         return data
//       } catch (error: any) {
//         handleNetworkError(error)
//         throw error
//       }
//     },
//     retry: (failureCount, error: any) => {
//       if (error?.code === "ERR_NETWORK") return false
//       return failureCount < 1
//     },
//     staleTime: CACHE_TTL,
//     gcTime: CACHE_TTL * 2,
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//   })
// }
