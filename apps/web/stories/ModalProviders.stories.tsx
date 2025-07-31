import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { LocationModalProvider } from "@/components/modal-providers"
import { useEffect } from "react"
import { useLocationModal } from "@/hooks/useLocationModal"
import { useFeedbackModal } from "@/hooks/useFeedbackModal"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Provider } from "react-redux"
import { store } from "@/store/store"

const queryClient = new QueryClient()

const meta: Meta = {
  title: "Providers/ModalProviders",
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      </Provider>
    ),
  ],
}
export default meta
type Story = StoryObj

// Helper wrapper to trigger modals for demonstration
function LocationModalStoryWrapper() {
  const { isOpen, closeModal, selectLocation } = useLocationModal()

  // Optionally, trigger the modal open here if needed, e.g. by calling selectLocation or another method
  // useEffect(() => {
  //   // Example: selectLocation("default-location")
  // }, [selectLocation])

  return <LocationModalProvider />
}

// function FeedbackModalStoryWrapper() {
//   const { isOpen, closeModal } = useFeedbackModal()

//   // Optionally, you can use isOpen or closeModal here if needed

//   return <FeedbackModalProvider />
// }

export const LocationModalExample: Story = {
  render: () => <LocationModalStoryWrapper />,
}

// export const FeedbackModalExample: Story = {
//   render: () => <FeedbackModalStoryWrapper />,
// }
