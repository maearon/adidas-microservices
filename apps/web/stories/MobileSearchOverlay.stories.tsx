import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import MobileSearchOverlay from "@/components/navbar/mobile-search-overlay"
import { useState } from "react"

const meta: Meta<typeof MobileSearchOverlay> = {
  title: "Components/MobileSearchOverlay",
  component: MobileSearchOverlay,
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
}
export default meta

type Story = StoryObj<typeof MobileSearchOverlay>

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true)
    const [query, setQuery] = useState("dame")

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault()
      console.log("Search submitted:", query)
      setIsOpen(false)
    }

    return (
      <MobileSearchOverlay
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        searchQuery={query}
        setSearchQuery={setQuery}
        onSearch={handleSearch}
      />
    )
  },
}
