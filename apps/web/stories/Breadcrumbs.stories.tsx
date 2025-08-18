import type { Meta, StoryObj } from '@storybook/nextjs'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Example/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
    },
  },
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Shop', href: '/shop' },
      { label: 'Shoes', href: '/shop/shoes' },
    ],
  },
}

export default meta
type Story = StoryObj<typeof Breadcrumbs>

export const Default: Story = {}

export const TwoItems: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Contact', href: '/contact' },
    ],
  },
}

export const LongTrail: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Men', href: '/products/men' },
      { label: 'Shoes', href: '/products/men/shoes' },
      { label: 'Running', href: '/products/men/shoes/running' },
    ],
  },
}
