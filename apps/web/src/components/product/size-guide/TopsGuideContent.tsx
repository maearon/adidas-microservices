"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUp, Ruler } from "lucide-react";
import { unitefitTopsSizeChart } from "@/data/unitefit-tops-size-chart";
import type { SizeUnit } from "@/data/kids-shoes-size-chart";
import { ApparelChartTable } from "./ApparelChartTable";
import { UnitToggle, type SizeGuideTranslations } from "./shared";

export function TopsGuideContent({
  t,
  onStartProfile,
  onBackToTop,
}: {
  t: SizeGuideTranslations;
  onStartProfile: () => void;
  onBackToTop: () => void;
}) {
  const [unit, setUnit] = useState<SizeUnit>("inches");

  return (
    <>
      <div className="border-b border-black/10 py-6 dark:border-white/10">
        <div className="flex gap-4 border border-black/20 p-4 dark:border-white/20">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-black/20 dark:border-white/20">
            <Ruler className="h-6 w-6" strokeWidth={1.25} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-black dark:text-white">{t?.findYourSize}</p>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{t?.findYourSizeDesc}</p>
            <button
              type="button"
              onClick={onStartProfile}
              className="mt-3 flex w-full items-center justify-between border border-black px-4 py-3 text-sm font-bold text-black transition hover:bg-neutral-50 dark:border-white dark:text-white dark:hover:bg-neutral-900"
            >
              <span>{t?.start}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <section className="border-b border-black/10 py-6 dark:border-white/10">
        <p className="text-sm leading-relaxed text-black dark:text-white">{t?.unitefitDesc}</p>
        <h3 className="mt-6 text-base font-bold text-black dark:text-white">{t?.relaxedFittedTitle}</h3>
        <p className="mt-2 text-sm leading-relaxed text-black dark:text-white">{t?.relaxedFittedDesc}</p>
        <UnitToggle unit={unit} onChange={setUnit} t={t} />
        <ApparelChartTable
          columns={unitefitTopsSizeChart[unit]}
          t={t}
          showUnitToggle={false}
        />
      </section>

      <section className="py-8">
        <h3 className="text-base font-bold text-black dark:text-white">{t?.howToMeasureTitle}</h3>
        <p className="mt-2 text-sm text-black dark:text-white">{t?.howToMeasureTopsIntro}</p>

        <div className="mt-4 bg-[#f5f5f5] p-4 dark:bg-neutral-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[220px] shrink-0 overflow-hidden rounded-sm bg-black sm:mx-0">
              <Image
                src="/images/size-guide/body-measure-diagram.png"
                alt={t?.howToMeasureTopsAlt || "Body measurement guide"}
                fill
                className="object-contain"
                sizes="220px"
              />
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-black dark:text-white">
              <div>
                <p className="font-bold">{t?.holdTapeHorizontal}</p>
                <ol className="mt-2 space-y-2">
                  <li><strong>1.</strong> {t?.topsStep1}</li>
                  <li><strong>2.</strong> {t?.topsStep2}</li>
                  <li><strong>3.</strong> {t?.topsStep3}</li>
                </ol>
              </div>
              <div>
                <p className="font-bold">{t?.holdTapeVertical}</p>
                <ol className="mt-2 space-y-2">
                  <li><strong>4.</strong> {t?.topsStep4}</li>
                  <li><strong>5.</strong> {t?.topsStep5}</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-black/10 py-6 dark:border-white/10">
        <button
          type="button"
          onClick={onBackToTop}
          className="flex items-center gap-2 text-sm font-bold text-black underline underline-offset-4 hover:opacity-80 dark:text-white"
        >
          <ArrowUp className="h-4 w-4" />
          {t?.backToTop || "Back to top"}
        </button>
      </div>
    </>
  );
}
