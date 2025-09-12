import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="space-y-7">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <div className="bg-card rounded-lg border p-6 shadow-sm">
              <div className="space-y-3">
                <Skeleton className="h-6.5 w-40" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <div className="bg-card rounded-lg border p-6 shadow-sm">
              <div className="space-y-3">
                <Skeleton className="h-6.5 w-32" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="bg-card rounded-lg border p-6 shadow-sm">
              <div className="space-y-3">
                <Skeleton className="h-6.5 w-40" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
