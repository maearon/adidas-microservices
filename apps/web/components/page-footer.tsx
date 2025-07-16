"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface Props {
  currentPage: "home" | "men" | "women" | "kids";
  onNavigate?: (page: "home" | "men" | "women" | "kids") => void
  typeMobileResponsive?: "accordion1x4" | "accordion2x2"
}

export default function PageFooter({currentPage = "home", onNavigate, typeMobileResponsive = "accordion1x4" }: Props) {
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category)
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }
  


  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const footerCategories = {
    "SUMMER FAVORITES": ["Summer Shoes", "Tees", "Tank Tops", "Shorts", "Swimwear", "Outdoor Gear & Accessories"],
    "SUMMER SPORT FITS": [
      "Men's Summer Outfits",
      "Men's Tank Tops",
      "Men's Shorts",
      "Women's Summer Outfits",
      "Women's Shorts & Skirts",
      "Women's Tank Tops",
    ],
    "OUR FAVORITE ACCESSORIES": ["Hats", "Bags", "Socks", "Sunglasses", "Water Bottles", "Gift Cards"],
    "SCHOOL UNIFORMS": [
      "Uniform Shoes",
      "Uniform Polos",
      "Uniform Pants",
      "Uniform Shorts",
      "Uniform Accessories",
      "School Backpacks",
    ],
  }

  const menFooterCategories = {
    "Men's Clothing": ["T-shirts", "Hoodies", "Jackets", "Shorts", "Pants & Joggers"],
    "Men's Shoes": ["Shoes", "High Top Sneakers", "Classic Sneakers", "Slip On Sneakers", "All White Sneakers"],
    "Men's Accessories": ["Men's Accessories", "Men's Duffle Bags", "Men's Socks", "Men's Hats", "Men's Headphones"],
    "MEN'S COLLECTIONS": [
      "Men's Running",
      "Men's Soccer",
      "Men's Loungewear",
      "Men's Training & Gym",
      "Men's Originals",
    ],
  }

  const womenFooterSections = {
    "WOMEN'S CLOTHING": [
      "Sports Bras",
      "Tops",
      "Hoodies",
      "Shorts",
      "Tights & Leggings",
    ],
    "WOMEN'S SHOES": [
      "Casual Sneakers",
      "All White Sneakers",
      "Slip On Sneakers",
      "Classic Sneakers",
      "High Top Sneakers",
    ],
    "WOMEN'S ACCESSORIES": [
      "Women's Accessories",
      "Women's Backpacks",
      "Women's Hats",
      "Women's Headphones",
      "Women's Socks",
    ],
    "WOMEN'S COLLECTIONS": [
      "Loungewear",
      "Training & Gym",
      "Running",
      "Yoga & Barre",
      "Plus Size",
    ],
  }

  const kidsFooterSections = {
    "KIDS COLLECTIONS": [
      "Infant & Toddler",
      "Boys",
      "Girls",
      "Disney",
      "Sportswear",
    ],
    "KIDS' SHOES": [
      "Casual Sneakers",
      "High Top Sneakers",
      "Slides & Sandals",
      "Cleats",
      "Boots",
    ],
    "KIDS' ACCESSORIES": [
      "Socks",
      "Hats",
      "Gloves",
      "Backpacks & Bags",
      "Sunglasses",
    ],
    "KIDS' CLOTHING": [
      "T-shirts",
      "Hoodies & Sweatshirts",
      "Jackets & Coats",
      "Pants & Sweats",
      "Track Suits",
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
      <section className="bg-white container mx-auto px-4 xl:px-20 py-4 mb-1 sm:mb-4">
        {/* Mobile - Accordion 1x4 */}
        <div className="block sm:hidden divide-y divide-gray-200">
          {Object.entries(selectedCategories).map(([category, items]) => (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex justify-between items-center py-4 font-bold text-md"
              >
                {category}
                {openCategory === category ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              <ul className={`pl-4 pb-4 space-y-2 ${openCategory === category ? "block" : "hidden"}`}>
                {items.map((item, index) => (
                  <li key={`${item}-${index}`}>
                    <a href="#" className="text-sm text-gray-600 hover:underline">
                      {item}
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
              <h4 className="font-bold mb-4 text-md">{category}</h4>
              <ul className="space-y-2">
                {items.map((item, index) => (
                  <li key={`${item}-${index}`}>
                    <a href="#" className="text-sm text-gray-600 hover:underline">
                      {item}
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
      <section className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-8 bg-white container mx-auto px-4 py-4">
        {sectionEntries.map(([section, items]) => (
          <div key={section}>
            <h3 className="font-bold mb-4 text-md capitalize">{section}</h3>
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-600 hover:underline">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Mobile layout (<sm)  - Accordion 2x2 */}
      <section className="sm:hidden bg-white container mx-auto px-4 py-4 space-y-6">
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
                  <span className="font-semibold text-sm capitalize">{section}</span>
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
                          className="block text-sm text-gray-600 hover:text-black transition-colors"
                        >
                          {item}
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
