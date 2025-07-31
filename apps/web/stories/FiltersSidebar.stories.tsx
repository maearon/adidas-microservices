import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import FiltersSidebar from "@/components/filter/filters-sidebar"
import { useState } from "react"

const meta: Meta<typeof FiltersSidebar> = {
  title: "Filter/FiltersSidebar",
  component: FiltersSidebar,
}
export default meta

type Story = StoryObj<typeof FiltersSidebar>

const mockFilterOptions = {
  genders: ["Men", "Women"],
  categories: ["Shoes", "Clothing"],
  sports: ["Soccer", "Running"],
  brands: ["Adidas", "Nike"],
  sizes: ["S", "M", "L", "XL"],
  price_ranges: [
    { label: "$0 - $50", min: 0, max: 50 },
    { label: "$50 - $100", min: 50, max: 100 },
    { label: "$100+", min: 100, max: null },
  ],
}

const Wrapper = () => {
  const [open, setOpen] = useState(true)

  return (
    <FiltersSidebar
      isOpen={open}
      onClose={() => setOpen(false)}
      onFiltersChange={(filters) => console.log("Filters Applied:", filters)}
    />
  )
}

export const Default: Story = {
  render: () => <Wrapper />,
}
