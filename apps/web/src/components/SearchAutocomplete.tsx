"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";
import { slugify } from "@/utils/slugify";
import ProductPrice from "./ProductCardPrice";

type Props = { keyword: string };

type SuggestionResponse = {
  suggestions: { term: string; count: number }[];
  products: {
    id: number | string;
    name: string;
    category?: string | null;
    image: string;
    price: number | null;
    variant_code: string | null;
    gender: string | null;
  }[];
};

export default function SearchAutocomplete({ keyword }: Props) {
  const [data, setData] = useState<SuggestionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("common");

  // Đảm bảo chỉ render khi đã mount (tránh flash server/client)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!keyword) {
      setData(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/search/suggestions?q=${encodeURIComponent(keyword)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [keyword]);

  // 🔒 Không render gì khi chưa mount hoặc đang loading
  if (!mounted || !keyword || loading) return null;

  if (data?.suggestions?.length === 0 && data?.products?.length === 0)
    return null;

  return (
    <div className="absolute right-0 mt-3 z-50 w-[600px] bg-white dark:bg-black text-foreground border border-gray-200 shadow-md flex text-[13px] leading-snug transition-opacity duration-150">
      {/* LEFT COLUMN */}
      <div className="w-[40%] p-4 flex flex-col min-h-[380px]">
        <div>
          <h2 className="text-lg font-bold mb-3 tracking-wide">
            {t?.suggestions || "Suggestions"}
          </h2>
          <ul className="space-y-3">
            {data?.suggestions
              ?.filter((s) => s.term && s.count > 0)
              .map((s) => (
                <li key={s.term}>
                  <Link
                    href={`/search?q=${encodeURIComponent(
                      s.term
                    )}&sitePath=us`}
                    className="flex justify-between items-center w-full"
                  >
                    <span className="truncate max-w-[130px] font-medium">
                      {s.term}
                    </span>
                    <span className="text-gray-500 ml-2">{s.count}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        {/* SEE ALL */}
        <div className="mt-auto pt-4">
          <Link
            href={`/search?q=${encodeURIComponent(keyword)}`}
            className="inline-block text-[13px] font-semibold underline underline-offset-2 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors px-[2px] py-[3px]"
          >
            {t?.seeAll || "See all"} &ldquo;{keyword}&rdquo;
          </Link>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-[60%] p-4">
        <h2 className="text-lg font-bold mb-3 tracking-wide">
          {t?.products || "Products"}
        </h2>
        {data?.products?.length ? (
          <ul className="space-y-5">
            {data.products.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/${slugify(product.name)}/${product.variant_code}.html`}
                  className="flex gap-3"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={90}
                    height={90}
                    className="object-contain bg-gray-100 w-[90px] h-[90px]"
                  />
                  <div className="flex flex-col min-w-0">
                    {product.gender && (
                      <span className="text-gray-500 text-[12px]">
                        {product.gender} {product.category}
                      </span>
                    )}
                    <span className="font-medium truncate max-w-[200px] text-[13px]">
                      {product.name}
                    </span>
                    {product.price && (
                      <ProductPrice price={product.price} compareAtPrice={null} />
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-400 italic text-[13px]">
            {t?.noProductsFound || "No products found"}
          </div>
        )}
      </div>
    </div>
  );
}
