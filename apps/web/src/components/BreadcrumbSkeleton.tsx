export default function BreadcrumbSkeleton() {
  return (
    <div className="flex items-center gap-2 text-base text-gray-300 mb-4 animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-12" />
      <span className="mx-2">/</span>
      <div className="h-4 bg-gray-300 rounded w-16" />
      <span className="mx-2">/</span>
      <div className="h-4 bg-gray-300 rounded w-20" />
    </div>
  )
}
