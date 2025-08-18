import type { Meta, StoryObj } from '@storybook/nextjs'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const meta: Meta = {
  title: 'Example/Dialog',
  component: Dialog,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is an example of a dialog. It uses Radix UI under the hood.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Some content inside the dialog body.</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const CustomContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Show Custom</Button>
      </DialogTrigger>
      <DialogContent>
        <h2 className="text-xl font-bold">Custom content</h2>
        <p>More flexible layout.</p>
      </DialogContent>
    </Dialog>
  ),
}
