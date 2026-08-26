'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function GlassProgress({
  value = 0,
  max = 100,
  className = '',
  height = 'h-2',
}: {
  value?: number
  max?: number
  className?: string
  height?: string
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={`w-full overflow-hidden rounded-full bg-white/20 dark:bg-slate-800/50 backdrop-blur-sm border border-white/10 ${height} ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: mounted ? `${percentage}%` : 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 relative overflow-hidden shadow-[0_0_10px_rgba(16,185,129,0.5)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
      </motion.div>
    </div>
  )
}

export function CircularProgress({
  value = 0,
  max = 100,
  size = 64,
  strokeWidth = 6,
  className = '',
}: {
  value?: number
  max?: number
  size?: number
  strokeWidth?: number
  className?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const offset = circumference - (percentage / 100) * circumference

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-emerald-100 dark:text-slate-800"
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: mounted ? offset : circumference }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  )
}
