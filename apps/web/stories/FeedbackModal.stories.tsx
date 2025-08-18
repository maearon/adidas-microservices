import type { Meta, StoryObj } from "@storybook/nextjs"
import FeedbackModal from "@/components/feedback-modal"
import { useState } from "react"

const meta: Meta<typeof FeedbackModal> = {
  title: "Components/FeedbackModal",
  component: FeedbackModal,
  parameters: {
    layout: "centered",
  },
}
export default meta

type Story = StoryObj<typeof FeedbackModal>

// ✅ Wrapper để mô phỏng open/close state từ bên ngoài
const StoryWrapper = () => {
  const [open, setOpen] = useState(true)
  return <FeedbackModal isOpen={open} onClose={() => setOpen(false)} />
}

export const Default: Story = {
  render: () => <StoryWrapper />,
}
