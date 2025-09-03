"use client"

import { upperWords } from "@/utils/upper-words";
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "@/hooks/useTranslations"

interface Props {
  currentPage: "home" | "men" | "women" | "kids";
  // onNavigate?: (page: "home" | "men" | "women" | "kids") => void
  typeMobileResponsive?: "accordion1x4" | "accordion2x2"
}

export default function PageFooter({currentPage = "home", typeMobileResponsive = "accordion1x4" }: Props) {
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const t = useTranslations("pageFooter")

  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category)
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }
  

  const [expandedSections, setExpandedSections] = useState<string[]>([])

  // Get page-specific translations
  const pageTranslations = t?.[currentPage] || {}

  const footerCategories = {
    "summerFavorites": ["summerShoes", "tees", "tankTops", "shorts", "swimwear", "outdoorGearAccessories"],
    "summerSportFits": [
      "mensSummerOutfits",
      "mensTankTops", 
      "mensShorts",
      "womensSummerOutfits",
      "womensShortsSkirts",
      "womensTankTops",
    ],
    "ourFavoriteAccessories": ["hats", "bags", "socks", "sunglasses", "waterBottles", "giftCards"],
    "schoolUniforms": [
      "uniformShoes",
      "uniformPolos",
      "uniformPants",
      "uniformShorts",
      "uniformAccessories",
      "schoolBackpacks",
    ],
  }

  const menFooterCategories = {
    "mensClothing": ["tshirts", "hoodies", "jackets", "shorts", "pantsJoggers"],
    "mensShoes": ["shoes", "highTopSneakers", "classicSneakers", "slipOnSneakers", "allWhiteSneakers"],
    "mensAccessories": ["mensAccessories", "mensDuffleBags", "mensSocks", "mensHats", "mensHeadphones"],
    "mensCollections": [
      "mensRunning",
      "mensSoccer",
      "mensLoungewear",
      "mensTrainingGym",
      "mensOriginals",
    ],
  }

  const womenFooterSections = {
    "womensClothing": [
      "sportsBras",
      "tops",
      "hoodies",
      "shorts",
      "tightsLeggings",
    ],
    "womensShoes": [
      "casualSneakers",
      "allWhiteSneakers",
      "slipOnSneakers",
      "classicSneakers",
      "highTopSneakers",
    ],
    "womensAccessories": [
      "womensAccessories",
      "womensBackpacks",
      "womensHats",
      "womensHeadphones",
      "womensSocks",
    ],
    "womensCollections": [
      "loungewear",
      "trainingGym",
      "running",
      "yogaBarre",
      "plusSize",
    ],
  }

  const kidsFooterSections = {
    "kidsCollections": [
      "infantToddler",
      "boys",
      "girls",
      "disney",
      "sportswear",
    ],
    "kidsShoes": [
      "casualSneakers",
      "highTopSneakers",
      "slidesSandals",
      "cleats",
      "boots",
    ],
    "kidsAccessories": [
      "socks",
      "hats",
      "gloves",
      "backpacksBags",
      "sunglasses",
    ],
    "kidsClothing": [
      "tshirts",
      "hoodiesSweatshirts",
      "jacketsCoats",
      "pantsSweats",
      "trackSuits",
    ],
  };

  type PageType = "home" | "men" | "women" | "kids"

  const categoriesMap: Record<PageType, Record<string, string[]>> = {
    home: footerCategories,
    men: menFooterCategories,
    women: womenFooterSections,
    kids: kidsFooterSections,
  }

  const selectedCategories = categoriesMap[currentPage]

  const sectionEntries = Object.entries(selectedCategories)
  const rows =
  sectionEntries.length >= 4
    ? [
        [sectionEntries[0], sectionEntries[1]],
        [sectionEntries[2], sectionEntries[3]],
      ]
    : []

  return (
    typeMobileResponsive === "accordion1x4" ? (
      <section className="bg-background container mx-auto px-4 xl:px-20 py-2 mb-2">
        {/* Mobile - Accordion 1x4 */}
        <div className="block sm:hidden divide-y divide-gray-200">
          {Object.entries(selectedCategories).map(([category, items]) => (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex justify-between items-center py-4 font-bold text-md"
              >
                {pageTranslations[category] || upperWords(category)}
                {openCategory === category ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              <ul className={`pl-4 pb-4 space-y-2 ${openCategory === category ? "block" : "hidden"}`}>
                {items.map((item, index) => (
                  <li key={`${item}-${index}`}>
                    <a href="#" className="text-base text-gray-600 dark:text-white hover:underline">
                      {pageTranslations[item] || item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Desktop - Grid */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(selectedCategories).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-bold mb-4 text-md">
                {pageTranslations[category] || upperWords(category)}
              </h4>
              <ul className="space-y-2">
                {items.map((item, index) => (
                  <li key={`${item}-${index}`}>
                    <a href="#" className="text-base text-gray-600 dark:text-white hover:underline">
                      {pageTranslations[item] || item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    ) : (
      <>
      {/* Desktop layout (≥sm) */}
      <section className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-8 bg-background container mx-auto px-4 py-4">
        {sectionEntries.map(([section, items]) => (
          <div key={section}>
            <h3 className="font-bold mb-4 text-md capitalize">{pageTranslations[section] || section}</h3>
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-base text-gray-600 dark:text-white hover:underline">
                    {pageTranslations[item] || item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Mobile layout (<sm)  - Accordion 2x2 */}
      <section className="sm:hidden bg-background container mx-auto px-4 py-4 space-y-6">
        {rows.map((pair, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {pair.map(([section, items]) => (
              <div key={section} className="w-1/2 flex flex-col border-b border-gray-200">
                <button
                  onClick={() => toggleSection(section)}
                  className={`w-full flex items-center justify-between px-2 py-3 text-left ${
                    expandedSections.includes(section) ? "bg-gray-100" : ""
                  }`}
                >
                  <span className="font-semibold text-base capitalize">{pageTranslations[section] || section}</span>
                  {expandedSections.includes(section) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedSections.includes(section) ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <ul className="pl-3 pb-3 space-y-1">
                    {items.map((item, index) => (
                      <li key={index}>
                        <a
                          href="#"
                          className="block text-base text-gray-600 dark:text-white hover:text-background transition-colors"
                        >
                          {pageTranslations[item] || item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>
      </>
    )
  )
}