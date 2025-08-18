import type { Meta, StoryObj } from "@storybook/nextjs"
import LoginModal from "@/components/login-modal"
import { Provider } from "react-redux"
import { store } from "@/store/store"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

const meta: Meta<typeof LoginModal> = {
  title: "Modals/LoginModal",
  component: LoginModal,
  decorators: [
    (Story) => {
      const queryClient = new QueryClient()
      return (
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Story />
          </QueryClientProvider>
        </Provider>
      )
    },
  ],
}
export default meta

type Story = StoryObj<typeof LoginModal>

// Wrapper to control modal visibility in Storybook
function Wrapper() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <LoginModal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false)
      }}
    />
  )
}

export const Default: Story = {
  render: () => <Wrapper />,
}
