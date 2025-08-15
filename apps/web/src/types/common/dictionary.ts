// types/common/dictionary.ts
import { Nullable, Optional } from "@/types/common/utility";

export type Dictionary<T = Optional<Nullable<unknown>>> = Record<string, T>;
