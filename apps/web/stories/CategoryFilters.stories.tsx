import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import CategoryFilters from "@/components/filter/category-filters"

const meta: Meta<typeof CategoryFilters> = {
  title: "Filter/CategoryFilters",
  component: CategoryFilters,
}
export default meta

type Story = StoryObj<typeof CategoryFilters>

export const ShoesSoccer: Story = {
  args: {
    category: {
      title: "Soccer Shoes",
      category: "shoes",
      subcategory: "soccer",
      productType: "shoes",
    },
  },
}

export const Clothes: Story = {
  args: {
    category: {
      title: "Clothing",
      category: "clothes",
      subcategory: "tshirts",
      productType: "apparel",
    },
  },
}
