export default function Loading() {
  return (
    <div className="container py-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-96 bg-muted animate-pulse rounded-lg"></div>
        </div>
        <div className="space-y-6">
          <div className="h-48 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}
