export function GroupCardSkeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-40" />
          <div className="h-3 bg-slate-100 rounded w-32" />
        </div>
        <div className="h-6 bg-slate-100 rounded-full w-16" />
      </div>
      <div className="space-y-2 mb-3">
        <div className="flex justify-between mb-1.5">
          <div className="h-3 bg-slate-100 rounded w-20" />
          <div className="h-3 bg-slate-100 rounded w-8" />
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full w-full" />
        <div className="flex justify-between">
          <div className="h-3 bg-slate-100 rounded w-24" />
          <div className="h-3 bg-slate-100 rounded w-24" />
        </div>
      </div>
      <div className="pt-3 border-t border-slate-50">
        <div className="h-3 bg-slate-100 rounded w-48" />
      </div>
    </div>
  )
}
