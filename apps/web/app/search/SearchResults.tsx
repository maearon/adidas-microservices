"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchProductsFeed } from "@/api/hooks/useProducts";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import ProductCard from "@/components/product-card";
import Loading from "@/components/loading";
import { Loader2, Filter, SlidersHorizontal } from "lucide-react";
import { BaseButton } from "@/components/ui/base-button";
import SearchFilters from "@/components/search-filters";
import { SearchFilters as SearchFiltersType } from "@/types/search";
import { Button } from "@/components/ui/button";

interface SearchResultsProps {
  query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useSearchProductsFeed(query);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFiltersType>({});

  const sitePath = searchParams.get("sitePath") || "us";

  const handleFiltersChange = (newFilters: Partial<SearchFiltersType>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);

    const params = new URLSearchParams();
    params.set("q", updatedFilters.query ?? query);
    params.set("sitePath", sitePath);

    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        key !== "query"
      ) {
        params.set(key, value.toString());
      }
    });

    router.push(`/search?${params.toString()}`);
  };

  const products = data?.pages.flatMap((page) => page.products) || [];
  const totalCount = data?.pages?.[0]?.totalCount ?? 0;

  if (status === "pending") {
    return <Loading />;
  }

  const isError = status === "error";
  const isEmpty = products.length === 0 && query;

  return (
    <>
    {/* Header */}
      <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-2 sm:gap-4 mb-[30px]">
        {/* Left: Title */}
        <div className="flex flex-col grow min-w-0">
          {/* Mobile Title */}
          <div className="sm:hidden">
            <h1 className="text-2xl md:text-3xl font-bold mb-1 break-words">
              Search for: "{query}"{" "}
              <span className="text-xs text-[#7A7F7B]">[{totalCount}]</span>
            </h1>
          </div>

          {/* Desktop Title */}
          <div className="hidden sm:flex flex-col">
            <p className="text-base text-gray-500">
              You searched for '{query}', showing results for:
            </p>
            <h1 className="text-2xl md:text-3xl font-bold mb-1 break-words">
              "{query}" <span className="text-xs text-[#7A7F7B]">[{totalCount}]</span>
            </h1>
            {products.length > 0 && (
              <p className="text-gray-600 break-words text-sm">
                Showing {products.length} of {totalCount} results
              </p>
            )}
          </div>
        </div>

        {/* Right: Filter button */}
        <div className="shrink-0 flex items-center">
          {/* Desktop button */}
          <BaseButton
            variant="outline"
            onClick={() => setIsFiltersOpen(true)}
            className="hidden sm:flex items-center gap-2 border border-black text-black rounded-none"
          >
            FILTER & SORT
            <SlidersHorizontal className="w-4 h-4" />
          </BaseButton>

          {/* Mobile button */}
          <BaseButton
            variant="outline"
            onClick={() => setIsFiltersOpen(true)}
            className="flex sm:hidden items-center justify-center p-2 text-black"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </BaseButton>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="text-center py-4">
          <h3 className="text-lg font-semibold mb-2 text-red-600">Search Error</h3>
          <p className="text-gray-600 mb-4">
            Failed to search products. Please try again.
          </p>
          <div className="flex justify-center">
            <Button
              theme="black"
              showArrow
              pressEffect
              shadow
              onClick={() =>
                router.push(`/search?q=${encodeURIComponent(query)}`)
              }
              className="px-6 py-3 font-semibold transition-colors"
            >
              TRY AGAIN
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {isEmpty && !isError && (
        <div className="text-center py-4">
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any products matching "{query}". Try adjusting
            your search terms or filters.
          </p>
          <div className="space-y-2">
            <p className="text-base text-gray-500">Suggestions:</p>
            <ul className="text-base text-gray-500 space-y-1">
              <li>• Check your spelling</li>
              <li>• Try more general terms</li>
              <li>• Use fewer keywords</li>
            </ul>
          </div>
        </div>
      )}

      {/* Product Grid */}
      {!isError && products.length > 0 && (
        <InfiniteScrollContainer
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
          onBottomReached={() =>
            hasNextPage && !isFetching && fetchNextPage()
          }
        >
          {products.map((product, index) => (
            <ProductCard key={`${product.id}-${index}`} product={product} />
          ))}
          {isFetchingNextPage && (
            <div className="col-span-full flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </InfiniteScrollContainer>
      )}

      {/* Sidebar Filters */}
      <SearchFilters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onFiltersChange={handleFiltersChange}
        currentFilters={filters}
        totalResults={products.length}
      />
    </>
  );
}
