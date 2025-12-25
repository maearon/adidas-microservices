"use client"

import { useState } from "react"
import { Star, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { slugify } from "@/utils/slugify"

export type SectionType = "reviews" | "description" | "details" | "highlights"

export interface SectionOrder {
  type: SectionType
  enabled: boolean
  order: number
}

export interface ProductSectionsProps {
  // Data
  product: {
    name?: string
    data?: {
      description?: {
        descTitle?: string
        descText?: string
      }
      details?: string[]
      highlights?: Array<{ title: string; text: string }>
      sectionOrder?: SectionOrder[]
    }
  }
  productDetails: {
    rating: number
    reviewCount: number
  }
  productVariant?: {
    variant_code?: string
  }
  translations?: {
    reviews?: string
    description?: string
    details?: string
    highlights?: string
    writeAReview?: string
    customerReviewsPlaceholder?: string
    descTitle?: string
    descText?: string
  }
  // Layout
  layoutVariant?: "mobile" | "desktop"
  className?: string
}

const DEFAULT_SECTION_ORDER: SectionOrder[] = [
  { type: "reviews", enabled: true, order: 0 },
  { type: "description", enabled: true, order: 1 },
  { type: "details", enabled: true, order: 2 },
  { type: "highlights", enabled: true, order: 3 },
]

export default function ProductSections({
  product,
  productDetails,
  productVariant,
  translations = {},
  layoutVariant = "desktop",
  className = "",
}: ProductSectionsProps) {
  const [expandedSections, setExpandedSections] = useState<Record<SectionType, boolean>>({
    reviews: false,
    description: false,
    details: false,
    highlights: false,
  })

  const toggleSection = (section: SectionType) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Get section order from product data or use default
  const sectionOrder: SectionOrder[] =
    product?.data?.sectionOrder && product.data.sectionOrder.length > 0
      ? product.data.sectionOrder
      : DEFAULT_SECTION_ORDER

  // Sort by order and filter enabled
  const sortedSections = [...sectionOrder]
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order)

  const renderSection = (section: SectionOrder) => {
    switch (section.type) {
      case "reviews":
        return (
          <div key="reviews" className="border-b px-8">
            <button
              onClick={() => toggleSection("reviews")}
              className="w-full flex justify-between items-center py-6 text-left font-bold text-lg"
            >
              <span>
                {translations.reviews || "Reviews"} ({productDetails.reviewCount})
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold">
                  {productDetails.rating.toFixed(1)}
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(productDetails.rating)
                          ? "fill-green-500 text-green-500"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                {expandedSections.reviews ? <ChevronUp /> : <ChevronDown />}
              </div>
            </button>
            {expandedSections.reviews && (
              <div className="pb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">{productDetails.rating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.floor(productDetails.rating)
                              ? "fill-green-500 text-green-500"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  theme="transparent"
                  border={true}
                  href={`/${slugify(product.name || "product")}/${productVariant?.variant_code}/submit-review?campaignId=dotcom_pdp`}
                  pressEffect={false}
                  shadow={false}
                  className="bg-transparent hover:bg-gray-100"
                >
                  {translations.writeAReview || "WRITE A REVIEW"}
                </Button>
                <p className="text-gray-600 dark:text-white">
                  {translations.customerReviewsPlaceholder ||
                    "Customer reviews and ratings would appear here."}
                </p>
              </div>
            )}
          </div>
        )

      case "description":
        return (
          <div key="description" className="border-b px-8">
            <button
              onClick={() => toggleSection("description")}
              className="w-full flex justify-between items-center py-6 text-left font-bold text-lg"
            >
              <span>{translations.description || "Description"}</span>
              {expandedSections.description ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expandedSections.description && (
              <div className="pb-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                  <h4 className="text-lg font-extrabold tracking-wide uppercase">
                    {product?.data?.description?.descTitle || translations.descTitle}
                  </h4>
                  <p className="text-gray-600 dark:text-white leading-relaxed">
                    {product?.data?.description?.descText || translations.descText}
                  </p>
                </div>
                <div className="flex justify-center">
                  <Image
                    src="/assets/product/F50_Messi_Elite_Firm_Ground_Cleats_White_JP5593_DM1.jpg"
                    alt="Product Description"
                    width={600}
                    height={600}
                    className="rounded-none object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        )

      case "details":
        return (
          <div key="details" className="border-b px-8">
            <button
              onClick={() => toggleSection("details")}
              className="w-full flex justify-between items-center py-6 text-left font-bold text-lg"
            >
              <span>{translations.details || "Details"}</span>
              {expandedSections.details ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expandedSections.details && (
              <div className="pb-6">
                <ul className="space-y-2">
                  {(product?.data?.details ?? []).map((line, i) => (
                    <li key={i} className="text-gray-600 dark:text-white">
                      • {line}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )

      case "highlights":
        return (
          <div key="highlights" className="border-b px-8">
            <button
              onClick={() => toggleSection("highlights")}
              className="w-full flex justify-between items-center py-6 text-left font-bold text-lg"
            >
              <span>{translations.highlights || "Highlights"}</span>
              {expandedSections.highlights ? <ChevronUp /> : <ChevronDown />}
            </button>
            {expandedSections.highlights && (
              <div className="pb-6">
                <ul className="space-y-6">
                  {product?.data?.highlights && product.data.highlights.length > 0
                    ? product.data.highlights.map((h, i) => (
                        <li key={i}>
                          <h4 className="text-lg font-extrabold tracking-wide">{h.title}</h4>
                          <p className="text-gray-600 dark:text-white">{h.text}</p>
                        </li>
                      ))
                    : null}
                </ul>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={className}>
      <div className="max-w-none mx-0 space-y-0 my-16 border-t sm:mt-24">
        {sortedSections.map((section) => renderSection(section))}
      </div>
    </div>
  )
}

