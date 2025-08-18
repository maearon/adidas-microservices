import type { Meta, StoryObj } from "@storybook/nextjs"
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast"

import { Button } from "@/components/ui/button"
import { useState } from "react"

const meta: Meta = {
  title: "Example/Toast",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => {
    function ToastDemo() {
      const [open, setOpen] = useState(false)

      return (
        <ToastProvider>
          <Button onClick={() => setOpen(true)}>Hiển thị Toast</Button>
          <Toast open={open} onOpenChange={setOpen}>
            <div className="grid gap-1">
              <ToastTitle>Thông báo</ToastTitle>
              <ToastDescription>Đây là nội dung thông báo đơn giản.</ToastDescription>
            </div>
            <ToastClose />
          </Toast>
          <ToastViewport />
        </ToastProvider>
      )
    }

    return <ToastDemo />
  },
}
