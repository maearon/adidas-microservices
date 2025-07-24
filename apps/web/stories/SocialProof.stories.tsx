import React, { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { SocialProof } from "@/components/ui/SocialProof"

const meta: Meta<typeof SocialProof> = {
  title: "Example/SocialProof", // 👈 đừng đổi UI/Slider nếu không setup custom folder
  component: SocialProof,
  tags: ["autodocs"],
  args: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: [50],
    "aria-label": "Volume", // 👈 giúp hỗ trợ accessibility
  },
}
export default meta

type Story = StoryObj<typeof SocialProof>

export const Default: Story = {}

export const WithValue: Story = {
  render: (args) => {
    const [value, setValue] = useState<number[]>(args.defaultValue as number[])

    return (
      <div className="space-y-4">
        <SocialProof {...args} value={value} onValueChange={setValue} />
        <p className="text-base text-muted-foreground">Value: {value[0]}</p>
      </div>
    )
  },
}
