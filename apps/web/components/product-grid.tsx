"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { BaseButton } from "@/components/ui/base-button"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import type { Product } from "@/types/product" // ✅ dùng chung type đã khai báo

interface ProductGridProps {
  products: Product[]
  loading: boolean
  pagination: {
    current_page: number
    total_pages: number
    total_count: number
    per_page: number
  }
  onPageChange: (page: number) => void
  slug: string
}

export default function ProductGrid({
  products,
  loading,
  pagination,
  onPageChange,
  slug,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse space-y-2">
            <div className="bg-gray-200 aspect-square rounded-lg" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your filters or search terms</p>
      </div>
    )
  }

  return (
    <div>
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {products.map((product) => (
          <ProductCard
            key={String(product.id)}
            slug={slug}
            product={{
              ...product,
              id: Number(product.id),
              price: String(product.price),
              original_price: String(product.original_price),
            }}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <BaseButton
            variant="outline"
            onClick={() => onPageChange(pagination.current_page - 1)}
            disabled={pagination.current_page <= 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </BaseButton>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            Page <strong>{pagination.current_page}</strong> of {pagination.total_pages}
            <span className="text-gray-400">({pagination.total_count} items)</span>
          </div>

          <BaseButton
            variant="outline"
            onClick={() => onPageChange(pagination.current_page + 1)}
            disabled={pagination.current_page >= pagination.total_pages}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </BaseButton>
        </div>
      )}
    </div>
  )
}
