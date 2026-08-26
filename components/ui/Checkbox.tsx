'use client'

import { motion } from 'framer-motion'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: React.ReactNode
  indeterminate?: boolean
  className?: string
}

export function Checkbox({ checked, onChange, label, indeterminate = false, className = '' }: CheckboxProps) {
  return (
    <label className={`inline-flex items-center gap-2.5 cursor-pointer select-none ${className}`}>
      <span
        onClick={() => onChange(!checked)}
        className={[
          'relative w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-150 border-2',
          checked || indeterminate
            ? 'bg-gradient-to-br from-emerald-600 to-teal-600 border-emerald-600'
            : 'bg-white/60 dark:bg-slate-900/40 border-slate-300 dark:border-slate-600',
        ].join(' ')}
      >
        {(checked || indeterminate) && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-3.5 h-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {indeterminate && !checked ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            )}
          </motion.svg>
        )}
      </span>
      {label && <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{label}</span>}
    </label>
  )
}
