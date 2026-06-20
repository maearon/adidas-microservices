"use client"

import type { MegaMenuColumn } from "@/types/common"
import Link from "next/link"
import type { useTranslations } from "@/hooks/useTranslations"
import { megaMenuBold, megaMenuRegular } from "@/components/navbar/mega-menu-styles"
import { cn } from "@/lib/utils"

/** One empty line between link groups — matches adidas nav spacing */
const GROUP_GAP = "h-[1.625rem] shrink-0"

export const SPORTS_MEGA_MENU_GRID =
  "grid grid-cols-[repeat(6,minmax(0,1fr))_minmax(0,1fr)_minmax(0,1.05fr)] items-stretch gap-x-8"

export const SALE_MEGA_MENU_GRID =
  "grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,0.95fr)] items-stretch gap-x-8"

export const TRENDING_MEGA_MENU_GRID = "grid grid-cols-5 items-stretch gap-x-8"

function translateColumnTitle(
  t: ReturnType<typeof useTranslations>,
  column: MegaMenuColumn,
) {
  if (column.translationKey) {
    return t?.[column.translationKey as keyof typeof t] || column.title
  }
  return column.title
}

function translateLink(
  t: ReturnType<typeof useTranslations>,
  translationKey?: string,
  fallback?: string,
) {
  if (translationKey) {
    return t?.[translationKey as keyof typeof t] || fallback
  }
  return fallback
}

export function GroupedColumnsMegaMenuPanel({
  columns,
  onClose,
  t,
  gridClassName,
}: {
  columns: MegaMenuColumn[]
  onClose: () => void
  t: ReturnType<typeof useTranslations>
  gridClassName: string
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className={gridClassName}>
          {columns.map((column, columnIndex) => {
            if (column.horizontalSpacer) {
              return (
                <div
                  key={`spacer-${columnIndex}`}
                  aria-hidden
                  className="hidden min-h-px sm:block"
                />
              )
            }

            return (
              <div key={columnIndex} className="flex min-w-0 flex-col">
                {column.title && (
                  <h3 className={cn("mb-4", megaMenuBold)}>
                    {column.titleHref ? (
                      <Link onClick={onClose} href={column.titleHref} className="hover:underline">
                        {translateColumnTitle(t, column)}
                      </Link>
                    ) : (
                      translateColumnTitle(t, column)
                    )}
                  </h3>
                )}

                <div className="flex flex-1 flex-col">
                  {column.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                      {section.items.length > 0 && (
                        <ul className="space-y-2">
                          {section.items.map((linkItem, itemIndex) => (
                            <li key={`${linkItem.href}-${itemIndex}`}>
                              <Link
                                onClick={onClose}
                                href={linkItem.href}
                                className={cn("block hover:underline", megaMenuRegular)}
                              >
                                {translateLink(t, linkItem.translationKey, linkItem.name)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                      {section.gapAfter && <div aria-hidden className={GROUP_GAP} />}
                    </div>
                  ))}
                </div>

                {column.footerLink && (
                  <Link
                    onClick={onClose}
                    href={column.footerLink.href}
                    className={cn("mt-auto block pt-4 hover:underline", megaMenuBold)}
                  >
                    {translateLink(t, column.footerLink.translationKey, column.footerLink.name)}
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
