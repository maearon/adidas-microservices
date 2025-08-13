// /apps/web/stories/UserAccountSlideout.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs"
import UserAccountSlideout from "@/components/navbar/UserAccountSlideOut"

const meta: Meta<typeof UserAccountSlideout> = {
  title: "Components/UserAccountSlideout",
  component: UserAccountSlideout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen", // 👈 Bắt buộc để component fixed hiển thị full
  },
  argTypes: {
    isOpen: { control: false },
    onClose: { control: false },
    user: { control: false },
    onLogout: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof UserAccountSlideout>

export const Default: Story = {
  render: (args) => (
    <div className="w-screen h-screen width:100vw height:100vh border border-red-500 overflow-hidden">
      <UserAccountSlideout {...args} />
    </div>
  ),
  args: {
    isOpen: true,
    onClose: () => alert("Closed"),
    onLogout: async () => {
      alert("Logged out");
    },
    user: {
      name: "John Doe",
      email: "john@example.com",
      // Add other fields if needed
    },
  },
}
