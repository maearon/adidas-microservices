import type { Meta, StoryObj } from "@storybook/nextjs"
import MobileMenu from "@/components/mobile-menu"

const meta: Meta<typeof MobileMenu> = {
  title: "Components/MobileMenu",
  component: MobileMenu,
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
}
export default meta

type Story = StoryObj<typeof MobileMenu>

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Closed menu"),
  },
}

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
  },
}
