import { Loader2 } from "lucide-react"

export default function PageLoading() {
  return (
    <div
      className="flex w-full flex-1 items-start justify-center bg-white px-4 pt-12 dark:bg-black sm:pt-16"
      style={{ minHeight: "calc(100dvh - var(--site-header-height, 0px))" }}
      data-auto-id="page-loading"
    >
      <Loader2 className="h-6 w-6 animate-spin text-black dark:text-white" />
    </div>
  )
}
