import type { Meta, StoryObj } from "@storybook/nextjs"
import { Textarea } from "@/components/ui/textarea"

const meta: Meta<typeof Textarea> = {
  title: "Example/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: {
    placeholder: "Nhập nội dung...",
    "aria-label": "Textarea ví dụ", // 👈 accessibility support
  },
  parameters: {
    layout: "centered",
  },
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {}

export const WithDefaultValue: Story = {
  args: {
    defaultValue: "Nội dung ban đầu...",
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Textarea bị vô hiệu hóa",
  },
}
