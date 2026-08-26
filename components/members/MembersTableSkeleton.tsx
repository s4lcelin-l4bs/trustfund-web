export function MembersTableSkeleton() {
  return (
    <>
      <div className="hidden sm:block glass-card overflow-hidden !p-0">
        <div className="divide-y divide-white/10 dark:divide-white/5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="shimmer w-9 h-9 rounded-full flex-shrink-0" />
              <div className="shimmer h-3.5 rounded w-36" />
              <div className="shimmer h-3.5 rounded w-20 ml-auto" />
              <div className="shimmer h-3.5 rounded w-24" />
              <div className="shimmer h-3.5 rounded w-28" />
              <div className="shimmer h-6 rounded-full w-16" />
            </div>
          ))}
        </div>
      </div>
      <div className="sm:hidden space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-4 flex items-center gap-3">
            <div className="shimmer w-11 h-11 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="shimmer h-3.5 rounded w-32" />
              <div className="shimmer h-3 rounded w-24" />
            </div>
            <div className="shimmer h-6 rounded-full w-14" />
          </div>
        ))}
      </div>
    </>
  )
}
