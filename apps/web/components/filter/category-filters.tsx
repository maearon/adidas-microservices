import { BaseButton } from "@/components/ui/base-button"
import { Checkbox } from "@/components/ui/checkbox"

type CategoryConfig = {
  title: string
  category: string
  subcategory: string
  productType: string
}

type CategoryFiltersProps = {
  category: CategoryConfig
}

export default function CategoryFilters({ category }: CategoryFiltersProps) {
  const sizeOptions =
    category.productType === "shoes"
      ? ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"]
      : ["XS", "S", "M", "L", "XL", "XXL"]

  const colorOptions = [
    { name: "Black", value: "black", color: "bg-black" },
    { name: "White", value: "white", color: "bg-white border" },
    { name: "Blue", value: "blue", color: "bg-blue-600" },
    { name: "Red", value: "red", color: "bg-red-600" },
    { name: "Green", value: "green", color: "bg-green-600" },
    { name: "Yellow", value: "yellow", color: "bg-yellow-400" },
  ]

  const priceRanges = ["$25 - $50", "$50 - $100", "$100 - $150", "$150 - $200", "$200+"]

  return (
    <div className="space-y-8">
      {/* Size Filter */}
      <div>
        <h3 className="font-bold mb-4">Size</h3>
        <div className="grid grid-cols-3 gap-2">
          {sizeOptions.map((size) => (
            <BaseButton key={size} variant="outline" size="sm" className="h-10 text-base hover:bg-black hover:text-white">
              {size}
            </BaseButton>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h3 className="font-bold mb-4">Color</h3>
        <div className="grid grid-cols-4 gap-3">
          {colorOptions.map((color) => (
            <div key={color.value} className="flex flex-col items-center space-y-1">
              <button className={`w-8 h-8 rounded-full ${color.color} hover:scale-110 transition-transform`} />
              <span className="text-xs">{color.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="font-bold mb-4">Price</h3>
        <div className="space-y-3">
          {priceRanges.map((range) => (
            <div key={range} className="flex items-center space-x-2">
              <Checkbox id={range} />
              <label htmlFor={range} className="text-base cursor-pointer">
                {range}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Category Specific Filters */}
      {category.productType === "shoes" && category.subcategory === "soccer" && (
        <div>
          <h3 className="font-bold mb-4">Surface</h3>
          <div className="space-y-3">
            {["Firm Ground", "Artificial Turf", "Indoor", "Multi-Ground"].map((surface) => (
              <div key={surface} className="flex items-center space-x-2">
                <Checkbox id={surface} />
                <label htmlFor={surface} className="text-base cursor-pointer">
                  {surface}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brand Filter */}
      <div>
        <h3 className="font-bold mb-4">Collection</h3>
        <div className="space-y-3">
          {["Predator", "X", "Copa", "Nemeziz", "F50"].map((collection) => (
            <div key={collection} className="flex items-center space-x-2">
              <Checkbox id={collection} />
              <label htmlFor={collection} className="text-base cursor-pointer">
                {collection}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <BaseButton variant="outline" className="w-full">
        Clear All Filters
      </BaseButton>
    </div>
  )
}
