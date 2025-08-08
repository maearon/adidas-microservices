import type { Meta, StoryObj } from "@storybook/nextjs"
import TopBarDropdown from "@/components/top-bar-dropdown"
import { useState } from "react"

const meta: Meta<typeof TopBarDropdown> = {
  title: "Components/TopBarDropdown",
  component: TopBarDropdown,
  parameters: {
    layout: "fullscreen", // Quan trọng để panel fixed full màn hình
  },
  argTypes: {
    isOpen: { control: false },
    onClose: { control: false },
  },
}
export default meta

type Story = StoryObj<typeof TopBarDropdown>

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true)

    return (
      <div className="min-h-screen bg-gray-50">
        <button
          onClick={() => setIsOpen(true)}
          className="m-4 px-4 py-2 bg-blue-600 text-background rounded"
        >
          Toggle TopBarDropdown
        </button>

        <TopBarDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    )
  },
}
