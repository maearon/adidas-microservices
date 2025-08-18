import type { Meta, StoryObj } from "@storybook/nextjs"
import Homepage from "@/components/homepage"

const meta: Meta<typeof Homepage> = {
  title: "Pages/Homepage",
  component: Homepage,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof Homepage>

export const Default: Story = {
  args: {
    onNavigate: (page) => {
      console.log(`Navigating to: ${page}`)
    },
  },
}
