import type { Meta, StoryObj } from '@storybook/nextjs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const meta: Meta<typeof RadioGroup> = {
  title: 'Example/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  render: (args) => (
    <RadioGroup defaultValue="option-1" {...args}>
      <label className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="r1" />
        <span>Option 1</span>
      </label>
      <label className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="r2" />
        <span>Option 2</span>
      </label>
      <label className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" id="r3" />
        <span>Option 3</span>
      </label>
    </RadioGroup>
  ),
}

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  args: {
    defaultValue: 'option-1',
  },
}
