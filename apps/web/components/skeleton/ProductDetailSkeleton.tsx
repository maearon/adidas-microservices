export default function ProductDetailSkeleton() {
  return (
    <main className="w-full mx-auto px-6 py-6 lg:flex gap-12 animate-pulse">
      {/* Left Column */}
      <div className="w-full lg:w-2/3 space-y-6">
        {/* Gallery */}
        <div className="aspect-square bg-gray-200 rounded w-full" />
        {/* Sections */}
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="h-6 bg-gray-200 rounded w-1/2" />
          ))}
          <div className="h-40 bg-gray-200 rounded w-full" />
        </div>
      </div>

      {/* Right Column */}
      <aside className="w-full lg:w-1/3 mt-10 lg:mt-0 space-y-6">
        <div className="bg-background border p-6 space-y-4 shadow-xs">
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-5 gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="h-12 bg-gray-200 rounded w-full" />
        </div>
      </aside>
    </main>
  )
}
