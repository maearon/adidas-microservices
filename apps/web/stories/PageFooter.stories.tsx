import type { Meta, StoryObj } from "@storybook/nextjs"
import MenFooter from "@/components/page-footer"

const meta: Meta<typeof MenFooter> = {
  title: "Footer/MenFooter",
  component: MenFooter,
  parameters: {
    layout: "fullscreen",
  },
}
export default meta

type Story = StoryObj<typeof MenFooter>

export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
}

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile2", // You can also use "iphone14" or any configured view
    },
  },
}
