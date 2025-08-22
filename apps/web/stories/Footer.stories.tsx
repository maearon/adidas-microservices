import type { Meta, StoryObj } from "@storybook/nextjs"
import Footer from "@/components/footer/Footer"

const meta: Meta<typeof Footer> = {
  title: "Components/Footer",
  component: Footer,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof Footer>

export const Default: Story = {
  render: () => <Footer />,
}
