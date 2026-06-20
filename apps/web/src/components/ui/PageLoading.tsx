import { Loader2 } from "lucide-react"

export default function PageLoading() {
  return (
    <div
      className="flex w-full flex-1 items-center justify-center bg-white dark:bg-black"
      style={{ minHeight: "calc(100dvh - var(--site-header-height))" }}
      data-auto-id="page-loading"
    >
      <Loader2 className="h-8 w-8 animate-spin text-black dark:text-white" />
    </div>
  )
}
