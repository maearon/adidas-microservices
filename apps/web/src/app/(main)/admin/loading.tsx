import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="space-y-3">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-5 w-56" />
      </div>
    </main>
  );
}
