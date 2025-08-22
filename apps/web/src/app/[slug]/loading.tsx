import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-300" />
        <p className="text-gray-600 dark:text-gray-300">Loading products...</p>
      </div>
    </div>
  )
}
