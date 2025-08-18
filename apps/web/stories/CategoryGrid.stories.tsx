import type { Meta, StoryObj } from '@storybook/nextjs'
import CategoryGrid from '@/components/ui/CategoryGrid'

const meta: Meta<typeof CategoryGrid> = {
  title: 'Example/CategoryGrid',
  component: CategoryGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof CategoryGrid>

export const Default: Story = {}
