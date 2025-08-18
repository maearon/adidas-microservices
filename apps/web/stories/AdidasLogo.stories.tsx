import type { Meta, StoryObj } from "@storybook/nextjs"
import AdidasLogo from "@/components/adidas-logo"

const meta: Meta<typeof AdidasLogo> = {
  title: "Components/AdidasLogo",
  component: AdidasLogo,
}
export default meta

type Story = StoryObj<typeof AdidasLogo>

export const Default: Story = {
  render: () => <AdidasLogo />,
}
