import type { Meta, StoryObj } from "@storybook/nextjs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"

const meta: Meta = {
  title: "Example/Toaster Auto Show",
  component: Toaster,
}

export default meta
type Story = StoryObj

export const ShowOnLoad: Story = {
  render: () => {
    const AutoToast = () => {
      const { toast } = useToast()

      useEffect(() => {
        toast({
          title: "Thông báo tự động",
          description: "Toast này xuất hiện ngay khi load story.",
        })
      }, [])

      return <Toaster />
    }

    return <AutoToast />
  },
}
