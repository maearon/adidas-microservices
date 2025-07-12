// 📦 Product Service API
import api from "@/api/client"
import { handleNetworkError } from "@/components/shared/handleNetworkError"
import { ApiResponse } from "@/types/common/api"
import { Product } from "@/types/product"

export interface ProductQuery {
  slug: string
  page?: number
  per_page?: number
  sort?: string
  gender?: string
  category?: string
  activity?: string
  sport?: string
  product_type?: string
  size?: string
  color?: string
  material?: string
  brand?: string
  model?: string
  collection?: string
  min_price?: number
  max_price?: number
  shipping?: string
}

export interface ProductMeta {
  current_page: number
  total_pages: number
  total_count: number
  per_page: number
  filters_applied: Record<string, any>
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
  getProducts: async (params: ProductQuery): Promise<ProductListData | undefined> => {
    try {
      const res = await api.get<ProductListResponse>("/products", { params })
      return res
    } catch (error: any) {
      handleNetworkError(error)
      throw error
    }
  },

  // ✅ Chi tiết sản phẩm theo slug và model
  getProductBySlugAndVariant: async (slug: string, modelNumber: string): Promise<Product | undefined> => {
    try {
      const res = await api.get<ApiResponse<Product>>(`/products/${slug}/${modelNumber}`)
      return res
    } catch (error: any) {
      handleNetworkError(error)
      throw error
    }
  },
}

export default rubyService
