interface SkeletonProps {
  className?: string
  variant?: 'text' | 'avatar' | 'rect' | 'circle'
  width?: string | number
  height?: string | number
  lines?: number
}

export function Skeleton({ className = '', variant = 'rect', width, height, lines = 1 }: SkeletonProps) {
  const base = 'shimmer rounded-lg dark:shimmer'

  if (variant === 'text') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={[base, 'h-3'].join(' ')}
            style={{ width: i === lines - 1 && lines > 1 ? '70%' : (width ?? '100%') }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'avatar') {
    const size = height ?? width ?? 40
    return (
      <div
        className={[base, 'rounded-xl flex-shrink-0', className].join(' ')}
        style={{ width: size, height: size }}
      />
    )
  }

  if (variant === 'circle') {
    const size = height ?? width ?? 40
    return (
      <div
        className={[base, 'rounded-full flex-shrink-0', className].join(' ')}
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      className={[base, className].join(' ')}
      style={{
        width: width ?? '100%',
        height: height ?? '16px',
      }}
    />
  )
}

/* ─── Composed Skeletons ─────────────────────────── */

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={[
      'backdrop-blur-xl bg-white/72 dark:bg-slate-900/75',
      'border border-white/50 dark:border-white/8',
      'rounded-2xl p-4 space-y-3',
      className,
    ].join(' ')}>
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton height={16} width="55%" />
          <Skeleton height={12} width="75%" />
        </div>
        <Skeleton height={24} width={70} className="rounded-full ml-2" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton height={11} width={80} />
          <Skeleton height={11} width={30} />
        </div>
        <Skeleton height={6} className="rounded-full" />
        <div className="flex justify-between">
          <Skeleton height={11} width={90} />
          <Skeleton height={11} width={90} />
        </div>
      </div>
      <div className="pt-2 border-t border-white/20 dark:border-white/5">
        <Skeleton height={11} width={180} />
      </div>
    </div>
  )
}

export function SkeletonAvatar({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <div className="flex items-center gap-3">
      <Skeleton variant="avatar" width={size} height={size} className={className} />
      <div className="space-y-1.5 flex-1">
        <Skeleton height={13} width="50%" />
        <Skeleton height={11} width="35%" />
      </div>
    </div>
  )
}

export function SkeletonStat({ className = '' }: { className?: string }) {
  return (
    <div className={[
      'backdrop-blur-xl bg-white/72 dark:bg-slate-900/75',
      'border border-white/50 dark:border-white/8',
      'rounded-2xl p-4 text-center space-y-2',
      className,
    ].join(' ')}>
      <Skeleton height={28} width="50%" className="mx-auto" />
      <Skeleton height={11} width="60%" className="mx-auto" />
    </div>
  )
}

export function SkeletonList({ count = 3, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton variant="avatar" width={36} height={36} className="rounded-xl" />
          <div className="flex-1 space-y-1.5">
            <Skeleton height={13} width="45%" />
            <Skeleton height={11} width="30%" />
          </div>
          <Skeleton height={22} width={55} className="rounded-full" />
        </div>
      ))}
    </div>
  )
}
