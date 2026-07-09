"use client";

import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AdidasCloseButton } from "@/components/ui/adidas-close-button";
import { useTranslations } from "@/hooks/useTranslations";
import type { SizeGuideType } from "@/lib/size-guide-type";
import {
  recommendTopSize,
  type SizeProfileInput,
} from "@/lib/size-recommendation";
import { ShoesGuideContent } from "./size-guide/ShoesGuideContent";
import { TopsGuideContent } from "./size-guide/TopsGuideContent";
import { MensTopsGuideContent } from "./size-guide/MensTopsGuideContent";
import { SizeProfileView } from "./size-guide/SizeProfileView";
import { SizeRecommendationView } from "./size-guide/SizeRecommendationView";

type View = "guide" | "profile" | "recommendation";

const SIZE_REC_STORAGE_KEY = "adidas_size_recommendation";

const defaultProfile: SizeProfileInput = {
  heightUnit: "cm",
  heightCm: "",
  heightFt: "",
  heightIn: "",
  weightUnit: "kg",
  weight: "",
  age: "",
  preference: "mens",
};

function readSavedRecommendation(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(SIZE_REC_STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveRecommendation(size: string) {
  try {
    localStorage.setItem(SIZE_REC_STORAGE_KEY, size);
  } catch {
    /* ignore */
  }
}

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  guideType?: SizeGuideType;
  availableSizes?: string[];
  onSelectSize?: (size: string) => void;
}

export default function SizeGuideModal({
  isOpen,
  onClose,
  guideType = "shoes",
  availableSizes = [],
  onSelectSize,
}: SizeGuideModalProps) {
  const t = useTranslations("sizeGuide");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>("guide");
  const [profile, setProfile] = useState<SizeProfileInput>(defaultProfile);
  const [recommendedSize, setRecommendedSize] = useState("M");
  const [savedRecommendedSize, setSavedRecommendedSize] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSavedRecommendedSize(readSavedRecommendation());
    } else {
      setView("guide");
      setProfile(defaultProfile);
    }
  }, [isOpen]);

  const chartTitle =
    guideType === "mensTops"
      ? t?.chartTitleMensTops || "MEN'S SHIRTS & TOPS SIZING"
      : guideType === "tops"
        ? t?.chartTitleTops || "UNITEFIT TOPS SIZING"
        : t?.chartTitle || "SIZE CHART: KIDS' SHOES";

  const handleBackToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFindSize = () => {
    const size = recommendTopSize(profile);
    setRecommendedSize(size);
    saveRecommendation(size);
    setSavedRecommendedSize(size);
    setView("recommendation");
  };

  const resolveSelectableSize = () => {
    const match = availableSizes.find(
      (s) => s.toUpperCase() === recommendedSize.toUpperCase() || s.includes(recommendedSize),
    );
    return match ?? recommendedSize;
  };

  const handleSelectRecommended = () => {
    onSelectSize?.(resolveSelectableSize());
    onClose();
  };

  const showGuideHeader = view === "guide";
  const supportsProfile = guideType === "tops" || guideType === "mensTops";

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        side="right"
        className="w-full max-w-[min(100vw,480px)] rounded-none border-l border-black/10 p-0 sm:max-w-[480px] [&>button]:hidden"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetTitle className="sr-only">{t?.title || "SIZE GUIDE"}</SheetTitle>

        <div className="relative flex h-full flex-col">
          {showGuideHeader && (
            <div className="flex items-start justify-between border-b border-black/10 px-6 py-5 dark:border-white/10">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight text-black dark:text-white">
                  {t?.title || "SIZE GUIDE"}
                </h2>
                <p className="mt-3 text-sm font-bold uppercase tracking-wide text-black dark:text-white">
                  {chartTitle}
                </p>
              </div>
              <AdidasCloseButton
                variant="panel"
                onClick={onClose}
                ariaLabel={t?.close || "Close"}
              />
            </div>
          )}

          {!showGuideHeader && (
            <div className="absolute right-4 top-4 z-10">
              <AdidasCloseButton
                variant="panel"
                onClick={onClose}
                ariaLabel={t?.close || "Close"}
              />
            </div>
          )}

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto overflow-x-hidden"
          >
            {view === "guide" && guideType === "shoes" && (
              <div className="px-6">
                <ShoesGuideContent t={t} onBackToTop={handleBackToTop} />
              </div>
            )}

            {view === "guide" && guideType === "tops" && (
              <div className="px-6">
                <TopsGuideContent
                  t={t}
                  onStartProfile={() => setView("profile")}
                  onBackToTop={handleBackToTop}
                />
              </div>
            )}

            {view === "guide" && guideType === "mensTops" && (
              <div className="px-6">
                <MensTopsGuideContent
                  t={t}
                  savedRecommendedSize={savedRecommendedSize}
                  onStartProfile={() => setView("profile")}
                  onEditProfile={() => setView("profile")}
                  onBackToTop={handleBackToTop}
                />
              </div>
            )}

            {view === "profile" && supportsProfile && (
              <SizeProfileView
                t={t}
                profile={profile}
                onChange={setProfile}
                onBack={() => setView("guide")}
                onSubmit={handleFindSize}
              />
            )}

            {view === "recommendation" && supportsProfile && (
              <SizeRecommendationView
                t={t}
                recommendedSize={recommendedSize}
                onSelectSize={handleSelectRecommended}
                onEdit={() => setView("profile")}
                onOpenGuide={() => setView("guide")}
              />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
