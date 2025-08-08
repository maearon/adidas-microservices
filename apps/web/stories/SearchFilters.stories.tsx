import type { Meta, StoryObj } from "@storybook/nextjs"
import SearchFilters from "@/components/filter/search-filters"
import type { SearchFilters as SearchFiltersType } from "@/types/search"
import { useState } from "react"

const meta: Meta<typeof SearchFilters> = {
  title: "Filter/SearchFilters",
  component: SearchFilters,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen", // 👈 Bắt buộc để component fixed hiển thị full
  },
  argTypes: {
    isOpen: { control: false },
    onClose: { control: false },
    onFiltersChange: { control: false },
    currentFilters: { control: false },
    totalResults: { control: false },
  },
}
export default meta

type Story = StoryObj<typeof SearchFilters>

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true)
    const [filters, setFilters] = useState<SearchFiltersType>({
      query: "",
      page: 1,
      size: 20,
      sort: "relevance",
      gender: undefined,
      category: undefined,
      sport: undefined,
      min_price: 50,
      max_price: 300,
    })

    return (
      <div className="min-h-screen bg-gray-50">
        <button
          className="m-4 px-4 py-2 bg-blue-500 text-background rounded"
          onClick={() => setIsOpen(true)}
        >
          Open Filter
        </button>
        <SearchFilters
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onFiltersChange={(changed) => {
            console.log("Filters changed:", changed)
            setFilters((prev) => ({ ...prev, ...changed }))
          }}
          currentFilters={filters}
          totalResults={123}
        />
      </div>
    )
  },
}
