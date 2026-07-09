"use client";

import { cn } from "@/lib/utils";
import type { SizeUnit } from "@/data/kids-shoes-size-chart";

export type SizeGuideTranslations = Record<string, string> | undefined;

export function UnitToggle({
  unit,
  onChange,
  t,
}: {
  unit: SizeUnit;
  onChange: (unit: SizeUnit) => void;
  t: SizeGuideTranslations;
}) {
  return (
    <div className="mt-4 flex gap-6 border-b border-black/10 dark:border-white/10">
      {(["inches", "cm"] as const).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={cn(
            "pb-2 text-sm font-bold uppercase tracking-wide transition-colors",
            unit === value
              ? "border-b-2 border-black text-black dark:border-white dark:text-white"
              : "text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white",
          )}
        >
          {t?.[value] || value}
        </button>
      ))}
    </div>
  );
}

export function ScrollHint({ t }: { t: SizeGuideTranslations }) {
  return (
    <p className="px-3 py-2 text-xs text-neutral-500 dark:text-neutral-400">
      {t?.scrollHint || "Scroll horizontally to see more."}
    </p>
  );
}
