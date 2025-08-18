import type { Meta, StoryObj } from "@storybook/nextjs"
import { Slider } from "@/components/ui/slider"

const meta: Meta = {
  title: "Example/Slider",
  component: Slider,
  tags: ["autodocs"],
  args: {
    defaultValue: [50],
    min: 0,
    max: 100,
    step: 1,
  },
}

export default meta

type Story = StoryObj<typeof Slider>

export const Default: Story = {}
