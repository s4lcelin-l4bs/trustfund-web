export function OrganizationCardSkeleton() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 pr-4">
          <div className="shimmer w-11 h-11 rounded-full flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="shimmer h-4 rounded-lg w-36" />
            <div className="shimmer h-3 rounded-lg w-24" />
          </div>
        </div>
        <div className="shimmer h-6 rounded-full w-16" />
      </div>
      <div className="shimmer h-3 rounded-lg w-full mb-1.5" />
      <div className="shimmer h-3 rounded-lg w-2/3 mb-4" />
      <div className="pt-3 border-t border-white/20 dark:border-white/5">
        <div className="shimmer h-3 rounded w-56" />
      </div>
    </div>
  )
}
