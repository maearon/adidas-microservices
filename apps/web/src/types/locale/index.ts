// types/locale/index.ts
import type { HeroNamespace } from "./hero";
import type { CommonNamespace } from "./common";

export type TranslationSchema = {
  hero: HeroNamespace;
  common: CommonNamespace;
  // thêm các namespace khác ở đây
};
