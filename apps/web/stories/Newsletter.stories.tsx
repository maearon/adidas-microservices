import type { Meta, StoryObj } from '@storybook/nextjs'
import Newsletter from '@/components/ui/Newsletter'

const meta: Meta<typeof Newsletter> = {
  title: 'Example/Newsletter',
  component: Newsletter,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof Newsletter>

export const Default: Story = {}
