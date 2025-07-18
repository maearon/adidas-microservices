import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import Header from "@/components/Navbar"

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta
type Story = StoryObj<typeof Header>

export const Default: Story = {
  render: () => <Header />,
}
