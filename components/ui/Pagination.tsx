'use client'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
  className?: string
}

export function Pagination({ page, totalPages, onChange, className = '' }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPageWindow(page, totalPages)

  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-xl glass-btn text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-sm text-slate-400 select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={[
              'w-9 h-9 rounded-xl text-sm font-semibold transition-colors',
              p === page
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_4px_14px_rgba(5,150,105,0.35)]'
                : 'glass-btn text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400',
            ].join(' ')}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded-xl glass-btn text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

function getPageWindow(page: number, totalPages: number): (number | '...')[] {
  const window = 1
  const pages: (number | '...')[] = []

  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= page - window && p <= page + window)) {
      pages.push(p)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return pages
}
