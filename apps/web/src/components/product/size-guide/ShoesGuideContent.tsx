"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUp } from "lucide-react";
import {
  kidsShoesSizeChart,
  type SizeChartSectionData,
  type SizeUnit,
} from "@/data/kids-shoes-size-chart";
import { cn } from "@/lib/utils";
import { ScrollHint, UnitToggle, type SizeGuideTranslations } from "./shared";

type SectionId = SizeChartSectionData["id"];

const sectionTitleKey: Record<SectionId, string> = {
  babiesToddlers: "babiesToddlersTitle",
  children: "childrenTitle",
  youthTeens: "youthTeensTitle",
};

const sectionDescKey: Record<SectionId, string> = {
  babiesToddlers: "babiesToddlersDesc",
  children: "childrenDesc",
  youthTeens: "youthTeensDesc",
};

function ShoesSizeTable({
  section,
  unit,
  t,
}: {
  section: SizeChartSectionData;
  unit: SizeUnit;
  t: SizeGuideTranslations;
}) {
  const columns = section.columns[unit];

  return (
    <div className="mt-4 border border-dashed border-black/30 dark:border-white/30">
      <div className="overflow-x-auto">
        <table className="min-w-max w-full border-collapse text-sm">
          <thead>
            <tr className="bg-black text-white">
              <th className="sticky left-0 z-10 bg-black px-4 py-3 text-left font-bold whitespace-nowrap">
                {t?.heelToe || "Heel-toe"}
              </th>
              {columns.map((col, i) => (
                <th
                  key={`${col.heelToe}-${i}`}
                  className={cn(
                    "px-4 py-3 text-center font-bold whitespace-nowrap min-w-[72px]",
                    i % 2 === 1 && "bg-neutral-800",
                  )}
                >
                  {col.heelToe}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(["uk", "us", "eu"] as const).map((rowKey) => (
              <tr key={rowKey} className="border-t border-black/10 dark:border-white/10">
                <td className="sticky left-0 z-10 bg-white px-4 py-3 font-bold text-black dark:bg-black dark:text-white whitespace-nowrap">
                  {t?.[rowKey] || rowKey.toUpperCase()}
                </td>
                {columns.map((col, i) => (
                  <td
                    key={`${rowKey}-${col.heelToe}-${i}`}
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
  );
}

function ShoesSizeChartSection({
  section,
  t,
}: {
  section: SizeChartSectionData;
  t: SizeGuideTranslations;
}) {
  const [unit, setUnit] = useState<SizeUnit>("inches");
  const titleKey = sectionTitleKey[section.id];
  const descKey = sectionDescKey[section.id];

  return (
    <section className="border-b border-black/10 py-8 dark:border-white/10">
      <h3 className="text-base font-bold text-black dark:text-white">{t?.[titleKey]}</h3>
      <p className="mt-1 text-sm text-black dark:text-white">{t?.[descKey]}</p>
      <UnitToggle unit={unit} onChange={setUnit} t={t} />
      <ShoesSizeTable section={section} unit={unit} t={t} />
    </section>
  );
}

export function ShoesGuideContent({
  t,
  onBackToTop,
}: {
  t: SizeGuideTranslations;
  onBackToTop: () => void;
}) {
  return (
    <>
      {kidsShoesSizeChart.map((section) => (
        <ShoesSizeChartSection key={section.id} section={section} t={t} />
      ))}

      <section className="py-8">
        <h3 className="text-base font-bold text-black dark:text-white">
          {t?.howToMeasureTitle || "How to measure"}
        </h3>
        <p className="mt-2 text-sm text-black dark:text-white">{t?.howToMeasureIntro}</p>

        <div className="mt-4 bg-[#f5f5f5] p-4 dark:bg-neutral-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[200px] shrink-0 sm:mx-0">
              <Image
                src="/images/size-guide/sock-measure.png"
                alt={t?.sockMeasureAlt || "Sock measurement guide"}
                fill
                className="object-contain"
                sizes="200px"
              />
            </div>
            <ol className="space-y-4 text-sm leading-relaxed text-black dark:text-white">
              <li className="flex gap-3">
                <span className="font-bold">1</span>
                <span>{t?.step1}</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">2</span>
                <span>{t?.step2}</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">3</span>
                <span>{t?.step3}</span>
              </li>
            </ol>
          </div>
        </div>

        <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden bg-[#f5f5f5] dark:bg-neutral-900">
          <Image
            src="/images/size-guide/how-to-measure.png"
            alt={t?.howToMeasureTitle || "How to measure"}
            fill
            className="object-contain object-left"
            sizes="(max-width: 480px) 100vw, 480px"
          />
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
