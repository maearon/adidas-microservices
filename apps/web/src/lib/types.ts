import { Prisma } from "@prisma/client"

export function getProductSearchSelect() {
  return {
    id: true,
    name: true,
    sport: true,
    variants: {
      select: {
        id: true,
        color: true,
        price: true,
        compare_at_price: true,
        variant_code: true,
        stock: true,
      }
    },
    description_p: true,
    created_at: true,
  } satisfies Prisma.productsSelect
}

export type ProductData = Prisma.productsGetPayload<{
  select: ReturnType<typeof getProductSearchSelect>
}> & {
  image_urls: string[] // 👈 bổ sung từ custom join bên search-service
}

// 👇 Đây là kiểu dữ liệu từ API trả về cho `/api/search`
export interface ProductsPage {
  products: ProductData[]
  nextCursor: string | null
  totalCount: number
  facets?: import("@/types/product/filters").FilterOptionsResponse | null
}
