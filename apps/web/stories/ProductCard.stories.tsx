import type { Meta, StoryObj } from "@storybook/nextjs"
import ProductCard from "@/components/product-card"
import { Provider } from "react-redux"
import { store } from "@/store/store"

const meta: Meta<typeof ProductCard> = {
  title: "Components/ProductCard",
  component: ProductCard,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <div className="max-w-xs p-4">
          <Story />
        </div>
      </Provider>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof ProductCard>

const mockProduct = {
  id: 1,
  name: "Samba OG Shoes",
  price: "$100",
  image: "/placeholder.png?height=300&width=250",
  category: "Sneakers",
}

export const Default: Story = {
  args: {
    product: mockProduct,
    showAddToBag: false,
  },
}

export const WithAddToBag: Story = {
  args: {
    product: mockProduct,
    showAddToBag: true,
  },
}
