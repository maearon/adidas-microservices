import { Loader2 } from "lucide-react"

export default function PageLoading() {
  return (
    <div
      className="flex flex-1 items-center justify-center"
      data-auto-id="page-loading"
    >
      <Loader2 className="h-8 w-8 animate-spin text-black dark:text-white" />
    </div>
  )
}
