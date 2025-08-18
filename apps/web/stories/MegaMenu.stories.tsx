import type { Meta, StoryObj } from "@storybook/nextjs"
import MegaMenu from "@/components/navbar/mega-menu"
import { useState } from "react"

const meta: Meta<typeof MegaMenu> = {
  title: "Navigation/MegaMenu",
  component: MegaMenu,
  parameters: {
    layout: "fullscreen",
  },
}
export default meta

type Story = StoryObj<typeof MegaMenu>

function Wrapper({ activeMenu }: { activeMenu: string }) {
  const [visible, setVisible] = useState(true)
  return visible ? (
    <MegaMenu activeMenu={activeMenu} onClose={() => setVisible(false)} />
  ) : (
    <div className="p-10 text-gray-500 text-base">Menu closed</div>
  )
}

export const MenMenu: Story = {
  render: () => <Wrapper activeMenu="MEN" />,
}

export const WomenMenu: Story = {
  render: () => <Wrapper activeMenu="WOMEN" />,
}

export const KidsMenu: Story = {
  render: () => <Wrapper activeMenu="KIDS" />,
}

export const SaleMenu: Story = {
  render: () => <Wrapper activeMenu="SALE" />,
}

export const NewTrendingMenu: Story = {
  render: () => <Wrapper activeMenu="NEW & TRENDING" />,
}
