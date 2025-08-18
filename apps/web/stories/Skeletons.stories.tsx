import type { Meta, StoryObj } from '@storybook/nextjs'
import { ProductCardSkeleton, ProductGridSkeleton } from '@/components/ui/skeletons'

const meta: Meta = {
  title: 'Example/Skeletons',
  tags: ['autodocs'],
}

export default meta

export const Card: StoryObj = {
  render: () => <ProductCardSkeleton />,
}

export const Grid: StoryObj = {
  render: () => <ProductGridSkeleton />,
}
