"use client";

import { cn } from "@/lib/utils";
import type { SizeUnit } from "@/data/kids-shoes-size-chart";
import type { ApparelSizeColumn } from "@/data/mens-shirts-tops-size-chart";
import { ScrollHint, UnitToggle, type SizeGuideTranslations } from "./shared";

export function ApparelChartTable({
  columns,
  t,
  unit,
  onUnitChange,
  showUnitToggle = true,
}: {
  columns: ApparelSizeColumn[];
  t: SizeGuideTranslations;
  unit?: SizeUnit;
  onUnitChange?: (u: SizeUnit) => void;
  showUnitToggle?: boolean;
}) {
  const rows = ["chest", "waist", "hip"] as const;

  return (
    <>
      {showUnitToggle && unit && onUnitChange && (
        <UnitToggle unit={unit} onChange={onUnitChange} t={t} />
      )}
      <div className="mt-4 border border-dashed border-black/30 dark:border-white/30">
        <div className="overflow-x-auto">
          <table className="min-w-max w-full border-collapse text-sm">
            <thead>
              <tr className="bg-black text-white">
                <th className="sticky left-0 z-10 bg-black px-4 py-3 text-left font-bold whitespace-nowrap">
                  {t?.productLabel || "Product label"}
                </th>
                {columns.map((col, i) => (
                  <th
                    key={col.label}
                    className={cn(
                      "px-4 py-3 text-center font-bold whitespace-nowrap min-w-[88px]",
                      i % 2 === 1 && "bg-neutral-800",
                    )}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((rowKey) => (
                <tr key={rowKey} className="border-t border-black/10 dark:border-white/10">
                  <td className="sticky left-0 z-10 bg-white px-4 py-3 font-bold text-black dark:bg-black dark:text-white whitespace-nowrap">
                    {t?.[rowKey] || rowKey}
                  </td>
                  {columns.map((col, i) => (
                    <td
                      key={`${rowKey}-${col.label}`}
                      className={cn(
                        "px-4 py-3 text-center text-black dark:text-white whitespace-nowrap",
                        i % 2 === 1 && "bg-[#f5f5f5] dark:bg-neutral-900",
                      )}
                    >
                      {col[rowKey]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ScrollHint t={t} />
      </div>
    </>
  );
}
