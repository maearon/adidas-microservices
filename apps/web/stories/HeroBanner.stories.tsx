import type { Meta, StoryObj } from '@storybook/nextjs'
import HeroBanner from '@/components/HeroBanner'

const meta: Meta<typeof HeroBanner> = {
  title: 'Example/HeroBanner',
  component: HeroBanner,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof HeroBanner>

export const Default: Story = {}
