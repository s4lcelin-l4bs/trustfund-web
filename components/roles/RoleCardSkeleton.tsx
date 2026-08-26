export function RoleCardSkeleton() {
  return (
    <div className="glass-card p-5">
      <div className="space-y-2 mb-4">
        <div className="shimmer h-4 rounded-lg w-32" />
        <div className="shimmer h-3 rounded-lg w-48" />
      </div>
      <div className="shimmer h-3 rounded w-40 mb-4" />
      <div className="flex gap-2 pt-3 border-t border-white/20 dark:border-white/5">
        <div className="shimmer h-7 rounded-lg flex-1" />
        <div className="shimmer h-7 rounded-lg flex-1" />
      </div>
    </div>
  )
}
