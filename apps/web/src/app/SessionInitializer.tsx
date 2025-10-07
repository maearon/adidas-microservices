"use client";

import { useInitSession } from "@/api/hooks/useLoginMutation";

export function SessionInitializer() {
  useInitSession();
  return null;
}
