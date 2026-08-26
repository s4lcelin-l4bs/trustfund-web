'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { OrganizationCycle } from '@/types'
import { CycleStatusBadge } from './CycleStatusBadge'
import { GlassProgress } from '@/components/ui/Progress'
import { fadeInUp } from '@/lib/animations'

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(dateStr)
  )
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount)
}

interface CycleCardProps {
  cycle: OrganizationCycle
  index: number
  organizationId: string
}

export function CycleCard({ cycle, index, organizationId }: CycleCardProps) {
  const router = useRouter()

  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(5,150,105,0.16), 0 4px 16px rgba(0,0,0,0.06)' }}
      whileTap={{ scale: 0.99 }}
      onClick={() => router.push(`/dashboard/organizations/${organizationId}/cycles/${cycle.id}`)}
      className="relative glass-card p-5 cursor-pointer bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm rounded-2xl overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" />

      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 pr-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">{cycle.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {formatDate(cycle.startDate)} — {formatDate(cycle.endDate)}
          </p>
        </div>
        <CycleStatusBadge status={cycle.status} />
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-500 dark:text-slate-400">Montant collecté</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {formatAmount(cycle.collectedAmount)} / {formatAmount(cycle.expectedAmount)}
          </span>
        </div>
        <GlassProgress value={cycle.collectedAmount} max={Math.max(cycle.expectedAmount, 1)} />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/20 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {cycle.beneficiariesCount} bénéficiaire{cycle.beneficiariesCount > 1 ? 's' : ''}
          </span>
          <span>·</span>
          <span>
            {cycle.turnsCount} tour{cycle.turnsCount > 1 ? 's' : ''}
          </span>
        </div>
        <svg className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.div>
  )
}
