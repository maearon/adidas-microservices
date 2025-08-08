import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

const meta: Meta<typeof Card> = {
  title: 'Example/Card',
  component: Card,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>This is a card description.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the content of the card. You can put anything here.</p>
      </CardContent>
      <CardFooter>
        <p className="text-base text-muted-foreground">Footer area</p>
      </CardFooter>
    </Card>
  ),
}

export const WithButton: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Subscribe</CardTitle>
        <CardDescription>Get notified when we launch</CardDescription>
      </CardHeader>
      <CardContent>
        <input className="w-full px-3 py-2 border rounded" placeholder="Your email" />
      </CardContent>
      <CardFooter>
        <button className="ml-auto px-4 py-2 bg-blue-600 text-background rounded">Subscribe</button>
      </CardFooter>
    </Card>
  ),
}
