import type { Meta, StoryObj } from '@storybook/nextjs'
import FullScreenLoader from '@/components/ui/FullScreenLoader'

const meta: Meta<typeof FullScreenLoader> = {
  title: 'Example/FullScreenLoader',
  component: FullScreenLoader,
  parameters: {
    layout: 'fullscreen',
  },
}
export default meta

type Story = StoryObj<typeof FullScreenLoader>

export const Default: Story = {}
