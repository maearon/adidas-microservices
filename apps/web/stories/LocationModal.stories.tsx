import type { Meta, StoryObj } from "@storybook/nextjs"
import LocationModal from "@/components/location-modal"

const meta: Meta<typeof LocationModal> = {
  title: "Components/LocationModal",
  component: LocationModal,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof LocationModal>

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {
      console.log("Modal closed")
    },
    onLocationSelect: (location) => {
      console.log("Selected location:", location)
    },
  },
}
