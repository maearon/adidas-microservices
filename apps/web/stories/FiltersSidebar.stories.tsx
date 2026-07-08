import type { Meta, StoryObj } from "@storybook/nextjs"
import FiltersSidebar from "@/components/filter/filters-sidebar"
import { useState } from "react"

const meta: Meta<typeof FiltersSidebar> = {
  title: "Filter/FiltersSidebar",
  component: FiltersSidebar,
}
export default meta

type Story = StoryObj<typeof FiltersSidebar>

const Wrapper = () => {
  const [open, setOpen] = useState(true)

  return (
    <FiltersSidebar
      isOpen={open}
      onClose={() => setOpen(false)}
      currentFilters={{ gender: ["Men"], category: ["Shoes"] }}
      totalCount={226}
      onApplyFilters={(filters) => console.log("Filters Applied:", filters)}
    />
  )
}

export const Default: Story = {
  render: () => <Wrapper />,
}
