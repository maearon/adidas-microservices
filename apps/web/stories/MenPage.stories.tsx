import type { Meta, StoryObj } from "@storybook/nextjs"
import MenPage from "@/components/men-page"

const meta: Meta<typeof MenPage> = {
  title: "Pages/MenPage",
  component: MenPage,
  parameters: {
    layout: "fullscreen",
  },
}
export default meta

type Story = StoryObj<typeof MenPage>

export const Default: Story = {
  args: {
    onNavigate: (page: "home" | "men") => {
      console.log(`Navigating to: ${page}`)
    },
  },
}
