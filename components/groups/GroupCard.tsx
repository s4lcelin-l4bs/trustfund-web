'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { GroupSummary } from '@/lib/api/groups'
import { TransactionBadge } from '@/components/ui/Badge'
import { fadeInUp } from '@/lib/animations'

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount)
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(dateStr))
}

interface GroupCardProps {
  group: GroupSummary
  index: number
}

export function GroupCard({ group, index }: GroupCardProps) {
  const router = useRouter()
  const progressPercent = Math.round(
    (group.totalCollected / group.totalExpected) * 100
  )

  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      onClick={() => router.push('/dashboard/groups/' + group.id)}
      className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-900 text-base">{group.name}</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {group.memberCount}/{group.maxMembers} membres
            {' · '}
            {formatAmount(group.contributionAmount)} FCFA/
            {group.frequency === 'monthly' ? 'mois' : 'sem.'}
          </p>
        </div>
        <TransactionBadge status={group.myPaymentStatus} />
      </div>

      {/* Barre de progression */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Pool collecte</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: progressPercent + '%' }}
            transition={{
              duration: 0.8,
              delay: 0.2 + index * 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="h-full rounded-full bg-emerald-400"
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-emerald-600 font-medium">
            {formatAmount(group.totalCollected)} FCFA
          </span>
          <span className="text-slate-400">
            {formatAmount(group.totalExpected)} FCFA
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
        <div className="flex items-center gap-1.5">
          {group.isMyTurnNext ? (
            <>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-emerald-600">
                Votre tour — {formatDate(group.nextTurnDate)}
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 bg-slate-300 rounded-full" />
              <span className="text-xs text-slate-500">
                Prochain :{' '}
                <span className="text-slate-700 font-medium">
                  {group.nextTurnBeneficiaryName}
                </span>{' '}
                · {formatDate(group.nextTurnDate)}
              </span>
            </>
          )}
        </div>
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.div>
  )
}
