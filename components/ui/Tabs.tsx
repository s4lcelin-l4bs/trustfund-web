'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
}

interface TabsProps {
  tabs: TabItem[]
  activeId: string
  onChange: (id: string) => void
  className?: string
  variant?: 'glass' | 'solid'
}

export function Tabs({ tabs, activeId, onChange, className = '', variant = 'glass' }: TabsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const variantStyles = {
    glass: 'bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-white/10 p-1 rounded-xl',
    solid: 'bg-slate-100 dark:bg-slate-800 p-1 rounded-xl',
  }

  return (
    <div className={`relative flex items-center overflow-x-auto no-scrollbar scroll-smooth ${variantStyles[variant]} ${className}`}>
      <div className="flex w-full min-w-max">
        {tabs.map((tab) => {
          const isActive = activeId === tab.id
          const isHovered = hoveredId === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              onMouseEnter={() => setHoveredId(tab.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`relative flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors z-10 ${
                isActive
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span className="whitespace-nowrap">{tab.label}</span>

              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId={`active-tab-${variant}`}
                  className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-sm -z-10 border border-black/5 dark:border-white/5"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}

              {/* Hover Indicator */}
              {!isActive && isHovered && (
                <motion.div
                  layoutId={`hover-tab-${variant}`}
                  className="absolute inset-0 bg-white/50 dark:bg-slate-600/30 rounded-lg -z-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
