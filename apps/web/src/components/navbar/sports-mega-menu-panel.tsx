"use client"

import type { MegaMenuColumn } from "@/types/common"
import type { useTranslations } from "@/hooks/useTranslations"
import {
  GroupedColumnsMegaMenuPanel,
  SPORTS_MEGA_MENU_GRID,
} from "@/components/navbar/grouped-columns-mega-menu-panel"

export function SportsMegaMenuPanel({
  columns,
  onClose,
  t,
}: {
  columns: MegaMenuColumn[]
  onClose: () => void
  t: ReturnType<typeof useTranslations>
}) {
  return (
    <GroupedColumnsMegaMenuPanel
      columns={columns}
      onClose={onClose}
      t={t}
      gridClassName={SPORTS_MEGA_MENU_GRID}
    />
  )
}
