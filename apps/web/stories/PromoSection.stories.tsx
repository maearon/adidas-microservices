import type { Meta, StoryObj } from '@storybook/nextjs'
import PromoSection from '@/components/ui/PromoSection'

const meta: Meta<typeof PromoSection> = {
  title: 'Example/PromoSection',
  component: PromoSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof PromoSection>

export const Default: Story = {}
