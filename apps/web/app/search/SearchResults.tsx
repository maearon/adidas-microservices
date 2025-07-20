"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Product from "@/components/products/Product";
import ProductsLoadingSkeleton from "@/components/products/ProductsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { ProductsPage } from "@/lib/types"
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface SearchResultsProps {
  query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["product-feed", "search", query],
    queryFn: async ({ pageParam }) => {
  const res = await kyInstance.get("/api/search", {
    searchParams: {
      q: query,
      ...(pageParam ? { cursor: pageParam } : {}),
    },
  });
  const json = await res.json<ProductsPage>();
  console.log("Search result:", json); // 👈 kiểm tra ở đây
  return json;
},
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    gcTime: 0,
  });

  const products = data?.pages.flatMap((page) => page.products) || [];

  if (status === "pending") {
    return <ProductsLoadingSkeleton />;
  }

  if (status === "success" && !products.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No products found for this query.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading products.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}