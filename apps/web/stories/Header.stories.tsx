import type { Meta, StoryObj } from "@storybook/nextjs"
import Header from "@/components/navbar/NavbarClient"

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
