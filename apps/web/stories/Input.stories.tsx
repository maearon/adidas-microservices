import type { Meta, StoryObj } from '@storybook/nextjs'
import { Input } from '@/components/ui/input'

const meta: Meta<typeof Input> = {
  title: 'Example/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number'],
    },
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for screen readers',
      table: {
        category: 'Accessibility',
      },
    },
  },
  args: {
    type: 'text',
    placeholder: 'Nhập văn bản...',
    disabled: false,
    'aria-label': 'Trường nhập liệu', // ✅ hỗ trợ accessibility
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Input bị disable',
    'aria-label': 'Trường nhập bị vô hiệu hóa',
  },
}

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Nhập mật khẩu',
    'aria-label': 'Trường nhập mật khẩu',
  },
}
