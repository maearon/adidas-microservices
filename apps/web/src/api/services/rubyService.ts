// 📦 Product Service API
import api from "@/api/client"
import { handleNetworkError } from "@/components/shared/handleNetworkError"
import { WithStatus } from "@/types/auth"
import { ApiResponse } from "@/types/common/api"
import { Product } from "@/types/product"

export interface ProductQuery {
  slug?: string
  page?: number
  per_page?: number
  sort?: string
  gender?: string | string[]
  category?: string | string[]
  activity?: string | string[]
  sport?: string | string[]
  product_type?: string | string[]
  size?: string | string[]
  color?: string | string[]
  material?: string | string[]
  brand?: string | string[]
  model?: string | string[]
  collection?: string | string[]
  min_price?: number
  max_price?: number
  shipping?: string | string[]
  best_for?: string | string[]
  surface?: string | string[]
  width?: string | string[]
}

export interface ProductMeta {
  current_page: number
  total_pages: number
  total_count: number
  per_page: number
  filters_applied: Record<string, unknown>
  category_info: {
    title: string
    breadcrumb: string
    description: string
  }
}

export type ProductListData = {
  products: Product[]
  meta: ProductMeta
}

export type ProductListResponse = ApiResponse<ProductListData>

const rubyService = {
  // ✅ Danh sách sản phẩm
  getProducts: async (params: ProductQuery): Promise<WithStatus<ProductListData | undefined> | undefined> => {
    try {
      const { data }  = await api.get<WithStatus<ProductListData>>("/products", { params })
      return data;
    } catch (error: unknown) {
      handleNetworkError(error)
      throw error
    }
  },

  // ✅ Chi tiết sản phẩm theo slug và model
  getProductBySlugAndVariant: async (slug: string, modelNumber: string): Promise<WithStatus<Product | undefined> | undefined> => {
    try {
      const { data }  = await api.get<WithStatus<Product>>(`/products/${slug}/${modelNumber}`)
      return data;
    } catch (error: unknown) {
      handleNetworkError(error)
      throw error
    }
  },
}

export default rubyService
