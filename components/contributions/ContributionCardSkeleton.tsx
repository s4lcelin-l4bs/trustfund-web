'use client'

import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/Skeleton'

export function ContributionCardSkeleton() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="w-28 h-4" />
            <Skeleton className="w-20 h-3" />
          </div>
        </div>
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      <div className="space-y-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex justify-between">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-24 h-5" />
        </div>
      </div>
    </motion.div>
  )
}

export function ContributionRowSkeleton() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-32 h-4" />
      </div>
      <Skeleton className="w-24 h-4 hidden sm:block" />
      <Skeleton className="w-16 h-6 rounded-full" />
    </motion.div>
  )
}