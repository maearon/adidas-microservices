"use client";

import { Loader2 } from "lucide-react";
import ProductCard from "@/components/product-card";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import { ReactNode } from "react";
import { useTranslations } from "@/hooks/useTranslations";

interface ProductListContainerProps {
  products: Product[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  viewMode: "grid" | "list";
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  className?: string;
}

export default function ProductListContainer({
  products,
  hasNextPage,
  isFetchingNextPage,
  viewMode,
  loadingComponent,
  emptyComponent,
  className,
}: ProductListContainerProps) {
  const t = useTranslations("productList")
  
  // Empty state
  if (products.length === 0 && !isFetchingNextPage) {
    return (
      (emptyComponent as ReactNode) || (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t?.noProductsFound || "No products found"}</h3>
          <p className="text-gray-500 dark:text-gray-400">{t?.tryAdjustingFilters || "Try adjusting your filters or search terms"}</p>
        </div>
      )
    );
  }

  // Grid layout classes based on view mode
  const getGridClasses = () => {
    if (viewMode === "list") return "grid-cols-1 gap-2";
    return "grid-cols-2 sm:grid-cols-4 gap-2";
  };

  return (
    <div className={cn("w-full", className)}>
      {/* grid wrapper must allow overflow-visible */}
      <div className={cn("grid pb-8 overflow-visible", getGridClasses())}>
        {products.map((product, index) => (
          // each grid item wrapper must also allow overflow-visible
          <div key={`${product.id}-${index}`} className="overflow-visible">
            <ProductCard
              product={product}
            />
          </div>
        ))}
      </div>

      {/* Loading indicator for next page */}
      {isFetchingNextPage && (
        <div className="col-span-full flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-black dark:text-white" />
        </div>
      )}

      {/* End of results */}
      {/* {!hasNextPage && products.length > 0 && (
        <div className="text-center py-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            You've reached the end of the results
          </p>
        </div>
      )} */}
    </div>
  );
}
