"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import type {
  HeightUnit,
  ShoppingPreference,
  SizeProfileInput,
  WeightUnit,
} from "@/lib/size-recommendation";
import { cn } from "@/lib/utils";
import type { SizeGuideTranslations } from "./shared";

interface SizeProfileViewProps {
  t: SizeGuideTranslations;
  profile: SizeProfileInput;
  onChange: (profile: SizeProfileInput) => void;
  onBack: () => void;
  onSubmit: () => void;
}

function UnitRadio<T extends string>({
  value,
  current,
  label,
  onChange,
}: {
  value: T;
  current: T;
  label: string;
  onChange: (v: T) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <span
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-full border border-black dark:border-white",
          current === value && "after:block after:h-2 after:w-2 after:rounded-full after:bg-black dark:after:bg-white",
        )}
      />
      <input type="radio" className="sr-only" checked={current === value} onChange={() => onChange(value)} />
      <span>{label}</span>
    </label>
  );
}

export function SizeProfileView({
  t,
  profile,
  onChange,
  onBack,
  onSubmit,
}: SizeProfileViewProps) {
  const set = <K extends keyof SizeProfileInput>(key: K, value: SizeProfileInput[K]) => {
    onChange({ ...profile, [key]: value });
  };

  const prefs: { id: ShoppingPreference; label: string }[] = [
    { id: "unisex", label: t?.unisex || "Unisex" },
    { id: "mens", label: t?.mens || "Men's" },
    { id: "womens", label: t?.womens || "Women's" },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-black/10 px-4 py-4 dark:border-white/10">
        <button type="button" onClick={onBack} aria-label={t?.back} className="p-1">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-sm font-bold uppercase tracking-wide">{t?.sizeProfile}</h2>
        <div className="w-7" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <p className="text-sm text-black dark:text-white">{t?.sizeProfileDesc}</p>

        <div className="mt-8 space-y-8">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="font-bold">{t?.height}</span>
              <div className="flex gap-4">
                <UnitRadio<HeightUnit>
                  value="inch"
                  current={profile.heightUnit}
                  label={t?.inch || "inch"}
                  onChange={(v) => set("heightUnit", v)}
                />
                <UnitRadio<HeightUnit>
                  value="cm"
                  current={profile.heightUnit}
                  label={t?.cm || "cm"}
                  onChange={(v) => set("heightUnit", v)}
                />
              </div>
            </div>
            {profile.heightUnit === "cm" ? (
              <div className="flex items-center border border-neutral-300 px-3 py-3 dark:border-neutral-600">
                <input
                  type="number"
                  inputMode="decimal"
                  value={profile.heightCm}
                  onChange={(e) => set("heightCm", e.target.value)}
                  className="w-full bg-transparent text-base outline-none"
                  placeholder="171"
                />
                <span className="text-neutral-400">{t?.cm}</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center border border-neutral-300 px-3 py-3 dark:border-neutral-600">
                  <input
                    type="number"
                    value={profile.heightFt}
                    onChange={(e) => set("heightFt", e.target.value)}
                    className="w-full bg-transparent text-base outline-none"
                    placeholder="5"
                  />
                  <span className="text-neutral-400">{t?.ft}</span>
                </div>
                <div className="flex items-center border border-neutral-300 px-3 py-3 dark:border-neutral-600">
                  <input
                    type="number"
                    value={profile.heightIn}
                    onChange={(e) => set("heightIn", e.target.value)}
                    className="w-full bg-transparent text-base outline-none"
                    placeholder="7"
                  />
                  <span className="text-neutral-400">{t?.inch}</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="font-bold">{t?.weight}</span>
              <div className="flex gap-4">
                <UnitRadio<WeightUnit>
                  value="lb"
                  current={profile.weightUnit}
                  label={t?.lb || "lb"}
                  onChange={(v) => set("weightUnit", v)}
                />
                <UnitRadio<WeightUnit>
                  value="kg"
                  current={profile.weightUnit}
                  label={t?.kg || "kg"}
                  onChange={(v) => set("weightUnit", v)}
                />
              </div>
            </div>
            <div className="flex items-center border border-neutral-300 px-3 py-3 dark:border-neutral-600">
              <input
                type="number"
                inputMode="decimal"
                value={profile.weight}
                onChange={(e) => set("weight", e.target.value)}
                className="w-full bg-transparent text-base outline-none"
                placeholder={profile.weightUnit === "kg" ? "86" : "190"}
              />
              <span className="text-neutral-400">{profile.weightUnit === "kg" ? t?.kg : t?.lb}</span>
            </div>
          </div>

          <div>
            <span className="font-bold">{t?.ageOptional}</span>
            <div className="mt-3 flex items-center border border-neutral-300 px-3 py-3 dark:border-neutral-600">
              <input
                type="number"
                value={profile.age}
                onChange={(e) => set("age", e.target.value)}
                className="w-full bg-transparent text-base outline-none"
                placeholder="31"
              />
              <span className="text-neutral-400">{t?.years}</span>
            </div>
          </div>

          <div>
            <span className="font-bold">{t?.shoppingPreferenceOptional}</span>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {prefs.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => set("preference", p.id)}
                  className={cn(
                    "border px-2 py-3 text-sm font-bold transition",
                    profile.preference === p.id
                      ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                      : "border-neutral-300 text-black hover:border-black dark:border-neutral-600 dark:text-white",
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button type="button" className="text-sm underline underline-offset-4">
            {t?.privacyPolicy}
          </button>
        </div>
      </div>

      <div className="border-t border-black/10 p-4 dark:border-white/10">
        <button
          type="button"
          onClick={onSubmit}
          className="flex w-full items-center justify-between bg-black px-4 py-4 text-sm font-bold text-white dark:bg-white dark:text-black"
        >
          <span>{t?.findSize}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
