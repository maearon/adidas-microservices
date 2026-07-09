"use client";

import { ArrowRight, Pencil, Ruler } from "lucide-react";
import type { SizeGuideTranslations } from "./shared";

interface SizeRecommendationViewProps {
  t: SizeGuideTranslations;
  recommendedSize: string;
  onSelectSize: () => void;
  onEdit: () => void;
  onOpenGuide: () => void;
}

export function SizeRecommendationView({
  t,
  recommendedSize,
  onSelectSize,
  onEdit,
  onOpenGuide,
}: SizeRecommendationViewProps) {
  return (
    <div className="flex h-full flex-col px-6 py-8">
      <div className="mb-6 flex h-12 w-12 items-center justify-center">
        <Ruler className="h-8 w-8" strokeWidth={1.25} />
      </div>

      <h2 className="text-sm font-bold uppercase tracking-wide text-black dark:text-white">
        {t?.recommendedSizeIs}
      </h2>
      <p className="mt-4 text-6xl font-bold text-black dark:text-white">{recommendedSize}</p>
      <p className="mt-6 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
        {t?.recommendationDesc}
      </p>
      <button
        type="button"
        onClick={onOpenGuide}
        className="mt-4 w-fit text-sm underline underline-offset-4"
      >
        {t?.sizeGuideLink}
      </button>

      <div className="mt-auto space-y-3 pt-10">
        <button
          type="button"
          onClick={onSelectSize}
          className="flex w-full items-center justify-between bg-black px-4 py-4 text-sm font-bold text-white dark:bg-white dark:text-black"
        >
          <span>{t?.selectSize}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="flex w-full items-center justify-between border border-black px-4 py-4 text-sm font-bold text-black dark:border-white dark:text-white"
        >
          <span>{t?.edit}</span>
          <Pencil className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
