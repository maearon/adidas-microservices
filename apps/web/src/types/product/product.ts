// import { Optional } from "@/types/common"

/** 👟 Size type (used in Product Variant and CartItem) */
export interface Size {
  id?: number
  label?: string
  system?: string
  location?: string
  created_at?: string
  updated_at?: string
  stock: number
  isAvailable: boolean
  name?: string // optional alias cho label nếu cần
}

/** 🎨 Product variant */
export interface Variant {
  id: number | string
  color: string
  price: number
  compare_at_price?: number
  variant_code?: string
  sku?: string
  stock?: number
  sizes: string[] // ✅ Sử dụng size chuẩn ở trên
  product_id?: number
  created_at?: string
  updated_at?: string
  image_urls?: string[]
  images?: string[]
  avatar_url?: string
  hover_url?: string
  image_url?: string
  hover_image_url?: string
  hover_image?: string
  available?: boolean
}

// 🛍 Product entity (thông tin đầy đủ)
export interface Product {
  id: number | string
  tags: string[]
  breadcrumb?: string
  model_number?: string
  title: string
  name: string
  description: string
  description_h5: string
  specifications: string
  care: string
  gender: string
  franchise: string
  product_type: string
  brand: string
  category: string
  sport: string
  currencyId: string
  currencyFormat: string
  isFreeShipping: boolean
  price: number
  compare_at_price: number
  installments: number
  created_at: string
  updated_at: string
  image?: string
  main_image_url?: string
  image_url?: string
  hover_image?: string
  hover_image_url?: string
  availableSizes: string[]
  collection: string
  badge: string
  variants: Variant[]
  slug: string
  reviews_count: number
  average_rating: number
  url?: string
  __isPlaceholder?: boolean
}

// 📦 API response for product listing
export interface ProductsResponse {
  products: Product[]
  meta: {
    current_page: number
    total_pages: number
    total_count: number
    per_page: number
    // filters_applied: Record<string, any>
    category_info: {
      title: string
      breadcrumb: string
      description: string
    }
  }
}

// 🧾 Product detail (kế thừa từ Product)
// export interface ProductDetails extends Product {
//   // Extend here if needed
// }

// 👤 Product follow feature
export interface ProductFollow {
  readonly id: string
  name: string
  gravatar_id: string
  size: number
}

export interface IProductFollow {
  readonly id: string
  name: string
  followers: number
  following: number
  gravatar: string
  micropost: number
}

export interface FollowResponse<
  TFollow = ProductFollow,
  TProduct = IProductFollow
> {
  products: TFollow[]
  xproducts: TFollow[]
  total_count: number
  product: TProduct
}
