import type { Meta, StoryObj } from "@storybook/nextjs"
import CheckoutHeader from "@/app/checkout/checkout-header"

const meta: Meta<typeof CheckoutHeader> = {
  title: "Components/CheckoutHeader",
  component: CheckoutHeader,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    userName: "Manh",
    cartCount: 3,
  },
}

export default meta

type Story = StoryObj<typeof CheckoutHeader>

export const Default: Story = {}

export const EmptyCart: Story = {
  args: {
    cartCount: 0,
  },
}

export const LongUserName: Story = {
  args: {
    userName: "Nguyễn Văn Mạnh Rất Dài",
  },
}
