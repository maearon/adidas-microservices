import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import MobileAppBanner from "@/components/navbar/mobile-app-banner"

const meta: Meta<typeof MobileAppBanner> = {
  title: "Components/MobileAppBanner",
  component: MobileAppBanner,
  parameters: {
    viewport: {
      defaultViewport: "mobile1", // Giả lập mobile
    },
  },
}
export default meta

type Story = StoryObj<typeof MobileAppBanner>

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Banner closed"),
  },
}

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
  },
}
