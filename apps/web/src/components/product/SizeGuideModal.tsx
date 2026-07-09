"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUp } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AdidasCloseButton } from "@/components/ui/adidas-close-button";
import { useTranslations } from "@/hooks/useTranslations";
import {
  kidsShoesSizeChart,
  type SizeChartSectionData,
  type SizeUnit,
} from "@/data/kids-shoes-size-chart";
import { cn } from "@/lib/utils";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

function SizeChartTable({
  section,
  unit,
  t,
}: {
  section: SizeChartSectionData;
  unit: SizeUnit;
  t: Record<string, string> | undefined;
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
      <p className="px-3 py-2 text-xs text-neutral-500 dark:text-neutral-400">
        {t?.scrollHint || "Scroll horizontally to see more."}
      </p>
    </div>
  );
}

function UnitToggle({
  unit,
  onChange,
  t,
}: {
  unit: SizeUnit;
  onChange: (unit: SizeUnit) => void;
  t: Record<string, string> | undefined;
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

function SizeChartSection({
  section,
  t,
}: {
  section: SizeChartSectionData;
  t: Record<string, string> | undefined;
}) {
  const [unit, setUnit] = useState<SizeUnit>("inches");
  const titleKey = sectionTitleKey[section.id];
  const descKey = sectionDescKey[section.id];

  return (
    <section className="border-b border-black/10 py-8 dark:border-white/10">
      <h3 className="text-base font-bold text-black dark:text-white">
        {t?.[titleKey]}
      </h3>
      <p className="mt-1 text-sm text-black dark:text-white">
        {t?.[descKey]}
      </p>
      <UnitToggle unit={unit} onChange={setUnit} t={t} />
      <SizeChartTable section={section} unit={unit} t={t} />
    </section>
  );
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const t = useTranslations("sizeGuide");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleBackToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        side="right"
        className="w-full max-w-[min(100vw,480px)] rounded-none border-l border-black/10 p-0 sm:max-w-[480px] [&>button]:hidden"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetTitle className="sr-only">{t?.title || "SIZE GUIDE"}</SheetTitle>

        <div className="relative flex h-full flex-col">
          <div className="flex items-start justify-between border-b border-black/10 px-6 py-5 dark:border-white/10">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-black dark:text-white">
                {t?.title || "SIZE GUIDE"}
              </h2>
              <p className="mt-3 text-sm font-bold uppercase tracking-wide text-black dark:text-white">
                {t?.chartTitle || "SIZE CHART: KIDS' SHOES"}
              </p>
            </div>
            <AdidasCloseButton
              variant="panel"
              onClick={onClose}
              ariaLabel={t?.close || "Close"}
            />
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden px-6">
            {kidsShoesSizeChart.map((section) => (
              <SizeChartSection key={section.id} section={section} t={t} />
            ))}

            <section className="py-8">
              <h3 className="text-base font-bold text-black dark:text-white">
                {t?.howToMeasureTitle || "How to measure"}
              </h3>
              <p className="mt-2 text-sm text-black dark:text-white">
                {t?.howToMeasureIntro}
              </p>

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
                onClick={handleBackToTop}
                className="flex items-center gap-2 text-sm font-bold text-black underline underline-offset-4 hover:opacity-80 dark:text-white"
              >
                <ArrowUp className="h-4 w-4" />
                {t?.backToTop || "Back to top"}
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
