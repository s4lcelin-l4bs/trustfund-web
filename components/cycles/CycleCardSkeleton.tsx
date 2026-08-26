export function CycleCardSkeleton() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-2 flex-1 pr-4">
          <div className="shimmer h-4 rounded-lg w-32" />
          <div className="shimmer h-3 rounded-lg w-40" />
        </div>
        <div className="shimmer h-6 rounded-full w-16" />
      </div>
      <div className="space-y-1.5 mb-4">
        <div className="shimmer h-3 rounded w-full" />
        <div className="shimmer h-2 rounded-full w-full" />
      </div>
      <div className="pt-3 border-t border-white/20 dark:border-white/5">
        <div className="shimmer h-3 rounded w-40" />
      </div>
    </div>
  )
}
