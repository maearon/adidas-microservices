"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUp, Pencil, Ruler } from "lucide-react";
import type { SizeUnit } from "@/data/kids-shoes-size-chart";
import {
  mensShirtsTopsShort,
  mensShirtsTopsStandard,
  mensShirtsTopsTall,
  mensSizeConversion,
  mensSizeConversionUsHeaders,
} from "@/data/mens-shirts-tops-size-chart";
import { cn } from "@/lib/utils";
import { ApparelChartTable } from "./ApparelChartTable";
import { ScrollHint, type SizeGuideTranslations } from "./shared";

function SizeConversionTable({ t }: { t: SizeGuideTranslations }) {
  return (
    <div className="mt-4 border border-dashed border-black/30 dark:border-white/30">
      <div className="overflow-x-auto">
        <table className="min-w-max w-full border-collapse text-sm">
          <thead>
            <tr className="bg-black text-white">
              <th className="sticky left-0 z-10 bg-black px-4 py-3 text-left font-bold whitespace-nowrap">
                US
              </th>
              {mensSizeConversionUsHeaders.map((size, i) => (
                <th
                  key={size}
                  className={cn(
                    "px-4 py-3 text-center font-bold whitespace-nowrap min-w-[56px]",
                    i % 2 === 1 && "bg-neutral-800",
                  )}
                >
                  {size}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mensSizeConversion.map((row) => (
              <tr key={row.region} className="border-t border-black/10 dark:border-white/10">
                <td className="sticky left-0 z-10 bg-white px-4 py-3 font-bold text-black dark:bg-black dark:text-white">
                  {row.region}
                </td>
                {row.sizes.map((size, i) => (
                  <td
                    key={`${row.region}-${size}`}
                    className={cn(
                      "px-4 py-3 text-center text-black dark:text-white",
                      i % 2 === 1 && "bg-[#f5f5f5] dark:bg-neutral-900",
                    )}
                  >
                    {size}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ScrollHint t={t} />
    </div>
  );
}

function ChartSection({
  title,
  description,
  data,
  t,
}: {
  title: string;
  description?: string;
  data: Record<SizeUnit, import("@/data/mens-shirts-tops-size-chart").ApparelSizeColumn[]>;
  t: SizeGuideTranslations;
}) {
  const [unit, setUnit] = useState<SizeUnit>("inches");

  return (
    <section className="border-b border-black/10 py-6 dark:border-white/10">
      <h3 className="text-base font-bold text-black dark:text-white">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-black dark:text-white">{description}</p>
      )}
      <ApparelChartTable
        columns={data[unit]}
        t={t}
        unit={unit}
        onUnitChange={setUnit}
      />
    </section>
  );
}

export function MensTopsGuideContent({
  t,
  savedRecommendedSize,
  onStartProfile,
  onEditProfile,
  onBackToTop,
}: {
  t: SizeGuideTranslations;
  savedRecommendedSize?: string | null;
  onStartProfile: () => void;
  onEditProfile: () => void;
  onBackToTop: () => void;
}) {
  const [unit, setUnit] = useState<SizeUnit>("inches");

  return (
    <>
      {savedRecommendedSize ? (
        <div className="border-b border-black/10 py-6 dark:border-white/10">
          <div className="flex gap-4 border border-black/20 p-4 dark:border-white/20">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center">
              <Ruler className="h-6 w-6" strokeWidth={1.25} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-black dark:text-white">
                {t?.yourRecommendedSizeIs} {savedRecommendedSize}
              </p>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                {t?.recommendedSizeSavedDesc}
              </p>
              <button
                type="button"
                onClick={onEditProfile}
                className="mt-3 flex items-center gap-2 text-sm font-bold underline underline-offset-4"
              >
                <Pencil className="h-4 w-4" />
                {t?.edit}
              </button>
            </div>
          </div>
        </div>
      ) : (
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
      )}

      <section className="border-b border-black/10 py-6 dark:border-white/10">
        <ApparelChartTable
          columns={mensShirtsTopsStandard[unit]}
          t={t}
          unit={unit}
          onUnitChange={setUnit}
        />
      </section>

      <ChartSection
        title={t?.tallTitle || "Tall"}
        description={t?.tallDesc}
        data={mensShirtsTopsTall}
        t={t}
      />

      <ChartSection
        title={t?.shortTitle || "Short"}
        description={t?.shortDesc}
        data={mensShirtsTopsShort}
        t={t}
      />

      <section className="border-b border-black/10 py-6 dark:border-white/10">
        <h3 className="text-base font-bold text-black dark:text-white">
          {t?.convertYourSize || "Convert your size"}
        </h3>
        <SizeConversionTable t={t} />
      </section>

      <section className="py-8">
        <h3 className="text-base font-bold text-black dark:text-white">{t?.howToMeasureTitle}</h3>
        <p className="mt-2 text-sm text-black dark:text-white">{t?.howToMeasureTopsIntro}</p>

        <div className="mt-4 bg-[#f5f5f5] p-4 dark:bg-neutral-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[180px] shrink-0 overflow-hidden rounded-sm bg-black sm:mx-0">
              <Image
                src="/images/size-guide/mens-body-measure-diagram.png"
                alt={t?.mensHowToMeasureAlt || "Men's body measurement guide"}
                fill
                className="object-contain"
                sizes="180px"
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
