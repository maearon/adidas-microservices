import type { Meta, StoryObj } from "@storybook/nextjs"
import { SliderWithValue } from "@/components/ui/SliderWithValue"

const meta: Meta<typeof SliderWithValue> = {
  title: "Example/SliderWithValue",
  component: SliderWithValue,
  tags: ["autodocs"],
  args: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: [50],
    "aria-label": "Giá trị slider",
  },
}
export default meta

type Story = StoryObj<typeof SliderWithValue>

export const Default: Story = {}
