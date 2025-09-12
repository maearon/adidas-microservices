import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-5 w-80" />
        </div>

        <Skeleton className="h-16 w-full" />

        <div className="rounded-lg border p-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="mt-2 h-4 w-64" />
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex flex-col items-center gap-3">
                <Skeleton className="size-32 rounded-full sm:size-24" />
                <Skeleton className="h-5 w-20" />
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="mt-2 h-4 w-60" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-5 w-40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
