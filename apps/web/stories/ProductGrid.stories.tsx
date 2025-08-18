import type { Meta, StoryObj } from "@storybook/nextjs"
import ProductGrid from "@/components/product-grid"
import { Provider } from "react-redux"
import { store } from "@/store/store"
import { Product } from "@/types/product/product"

const meta: Meta<typeof ProductGrid> = {
  title: "Components/ProductGrid",
  component: ProductGrid,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <div className="p-6">
          <Story />
        </div>
      </Provider>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof ProductGrid>

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Ultraboost Light Shoes",
    image_url: "/placeholder.png",
    jan_code: "NEW-001",
    category: "Running",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    description: "Lightweight running shoes for daily training.",
    slug: "ultraboost-light-shoes",
    variants: [
      {
        id: 101,
        price: 180,
        size: ["M", "XL"],
        images: ["/placeholder.png"],
        product_id: 1,
        stock: 10,
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
      },
    ],
  },
  {
    id: 2,
    name: "Runfalcon 3.0",
    image_url: "/placeholder.png",
    jan_code: "SALE-001",
    category: "Casual",
    created_at: "2023-01-02T00:00:00Z",
    updated_at: "2023-01-02T00:00:00Z",
    description: "Affordable and comfortable everyday sneakers.",
    slug: "runfalcon-3-0",
    variants: [
      {
        id: 102,
        price: 120,
        size: ["S", "L"],
        images: ["/placeholder.png"],
        product_id: 2,
        stock: 5,
        created_at: "2023-01-02T00:00:00Z",
        updated_at: "2023-01-02T00:00:00Z",
      },
    ],
  },
  {
    id: 3,
    name: "Daily 4.0",
    image_url: "/placeholder.png",
    jan_code: "",
    category: "Lifestyle",
    created_at: "2023-01-03T00:00:00Z",
    updated_at: "2023-01-03T00:00:00Z",
    description: "Versatile shoes for daily wear.",
    slug: "daily-4-0",
    variants: [
      {
        id: 103,
        price: 100,
        size: ["M", "L", "XL"],
        images: ["/placeholder.png"],
        product_id: 3,
        stock: 8,
        created_at: "2023-01-03T00:00:00Z",
        updated_at: "2023-01-03T00:00:00Z",
      },
    ],
  },
]

export const Default: Story = {
  args: {
    products: mockProducts,
    columns: 3,
  },
}

export const FourColumns: Story = {
  args: {
    products: mockProducts,
    columns: 4,
  },
}

export const EmptyState: Story = {
  args: {
    products: [],
  },
}
