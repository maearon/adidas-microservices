"use client"

import { searchSuggestions } from "@/data/searchSuggestions"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "@/hooks/useTranslations"

type Props = {
  keyword: string
}

export default function SearchAutocomplete({ keyword }: Props) {
  const t = useTranslations("common")
  const matchedSuggestions = searchSuggestions
  // const matchedSuggestions = searchSuggestions.filter(item =>
  //   item.keyword.toLowerCase().includes(keyword.toLowerCase())
  // )

  if (!keyword) return null

  return (
    <div className="absolute right-0 mt-3 z-50 w-[600px] bg-white dark:bg-black text-foreground border border-gray-200 shadow-md flex">
      {/* LEFT COLUMN */}{/* SUGGESTIONS */}
      <div className="w-1/2 p-4">
        <h4 className="font-bold mb-2">{t?.suggestions || "SUGGESTIONS"}</h4>
        <ul className="space-y-5">
          {matchedSuggestions.length > 0 ? (
            matchedSuggestions.map((item) => (
              <li key={item.keyword} className="flex justify-between text-md">
                <span>{item.keyword}</span>
                <span className="text-gray-500">{item.count}</span>
              </li>
            ))
          ) : (
            <li className="text-base text-gray-400 italic">{t?.noSuggestionsFound || "No suggestions found"}</li>
          )}
        </ul>
        <Link
          href={`/search?q=${encodeURIComponent(keyword)}`}
          className="block mt-6 text-base font-semibold text-foreground underline hover:opacity-80"
        >
          {t?.seeAll || "SEE ALL"} &ldquo;{keyword.toUpperCase()}&rdquo;
        </Link>
      </div>

      {/* RIGHT COLUMN */}{/* PRODUCTS */}
      <div className="w-1/2 p-4 border-l border-gray-200">
        <h4 className="font-bold mb-2">{t?.products || "PRODUCTS"}</h4>
        {matchedSuggestions[0]?.products.length ? (
          <ul className="space-y-6">
            {matchedSuggestions[0].products.map((product) => (
              <li key={product.id} className="flex gap-3 text-gl">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={90}
                  height={90}
                  className="object-fill bg-gray-100"
                />
                <div>
                  <div className="text-gray-500">{product.gender}</div>
                  <div className="font-medium">{product.title}</div>
                  <div>${formatPrice(product?.price.toFixed(2))}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-400 text-base italic">{t?.noProductsFound || "No products found"}</div>
        )}
      </div>
    </div>
  )
}
