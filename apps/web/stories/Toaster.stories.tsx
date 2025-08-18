import type { Meta, StoryObj } from "@storybook/nextjs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

const meta: Meta = {
  title: "Example/Toaster",
  component: Toaster,
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const { toast } = useToast()

      return (
        <div>
          <Button
            onClick={() =>
              toast({
                title: "Đã lưu",
                description: "Thông tin đã được lưu thành công.",
              })
            }
          >
            Hiển thị Toast
          </Button>

          <Toaster />
        </div>
      )
    }

    return <Demo />
  },
}
