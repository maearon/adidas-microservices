import type { Meta, StoryObj } from '@storybook/nextjs'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

const meta: Meta<typeof Select> = {
  title: 'Example/Select',
  component: Select,
  tags: ['autodocs'],
  render: (args) => (
    <Select {...args}>
      <SelectTrigger aria-label="Select an option" />
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  ),
}
export default meta

type Story = StoryObj<typeof Select>

export const Default: Story = {
  args: {
    defaultValue: 'banana',
  },
}
