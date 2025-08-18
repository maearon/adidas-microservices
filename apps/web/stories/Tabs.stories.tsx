import type { Meta, StoryObj } from "@storybook/nextjs"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const meta: Meta<typeof Tabs> = {
  title: "Example/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    defaultValue: "tab1",
  },
}
export default meta

type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Nội dung Tab 1</TabsContent>
      <TabsContent value="tab2">Nội dung Tab 2</TabsContent>
      <TabsContent value="tab3">Nội dung Tab 3</TabsContent>
    </Tabs>
  ),
}
