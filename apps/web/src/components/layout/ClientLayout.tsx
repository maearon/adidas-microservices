"use client";
import { useInitSession } from "@/api/hooks/useLoginMutation";
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // 🔄 Đồng bộ session khi mount app
  useInitSession();
  return <>{children}</>;
}
