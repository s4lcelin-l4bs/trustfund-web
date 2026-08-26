import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/Skeleton'

export function FineCardSkeleton() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-2"><Skeleton className="w-28 h-4" /><Skeleton className="w-20 h-3" /></div>
        </div>
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      <Skeleton className="w-full h-4 mb-2" />
      <Skeleton className="w-4/5 h-4 mb-4" />
      <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
        <Skeleton className="w-20 h-3" /><Skeleton className="w-24 h-6" />
      </div>
    </motion.div>
  )
}