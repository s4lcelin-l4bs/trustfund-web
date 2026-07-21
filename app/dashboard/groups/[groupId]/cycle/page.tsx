'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { TransactionBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { staggerContainer, fadeInUp } from '@/lib/animations'

interface CycleMember {
  id: string
  name: string
  initials: string
  paymentStatus: 'confirmed' | 'pending' | 'failed'
  paidAt?: string
}

interface CycleDashboard {
  groupName: string
  cycleNumber: number
  totalCollected: number
  totalExpected: number
  beneficiaryName: string
  beneficiaryInitials: string
  payoutDate: string
  members: CycleMember[]
}

const mockCycles: Record<string, CycleDashboard> = {
  'group-1': {
    groupName: 'Tontine bureau IUT',
    cycleNumber: 3,
    totalCollected: 525000,
    totalExpected: 750000,
    beneficiaryName: 'Marie Tamba',
    beneficiaryInitials: 'MT',
    payoutDate: '14 juil. 2026',
    members: [
      { id: 'm1', name: 'Marie Tamba', initials: 'MT', paymentStatus: 'confirmed', paidAt: '1 juil.' },
      { id: 'm2', name: 'Salcelin K.', initials: 'SK', paymentStatus: 'confirmed', paidAt: '2 juil.' },
      { id: 'm3', name: 'Joseph Ngono', initials: 'JN', paymentStatus: 'confirmed', paidAt: '1 juil.' },
      { id: 'm4', name: 'Aissatou B.', initials: 'AB', paymentStatus: 'pending' },
      { id: 'm5', name: 'Paul Mbappe', initials: 'PM', paymentStatus: 'pending' },
    ],
  },
  'group-2': {
    groupName: 'Epargne famille',
    cycleNumber: 1,
    totalCollected: 100000,
    totalExpected: 120000,
    beneficiaryName: 'Salcelin K.',
    beneficiaryInitials: 'SK',
    payoutDate: '7 juil. 2026',
    members: [
      { id: 'm1', name: 'Salcelin K.', initials: 'SK', paymentStatus: 'confirmed', paidAt: '30 juin' },
      { id: 'm2', name: 'Maman K.', initials: 'MK', paymentStatus: 'confirmed', paidAt: '30 juin' },
      { id: 'm3', name: 'Papa K.', initials: 'PK', paymentStatus: 'pending' },
    ],
  },
  'group-3': {
    groupName: 'Tontine amis campus',
    cycleNumber: 2,
    totalCollected: 40000,
    totalExpected: 100000,
    beneficiaryName: 'Paul Mbappe',
    beneficiaryInitials: 'PM',
    payoutDate: '20 juil. 2026',
    members: [
      { id: 'm1', name: 'Paul Mbappe', initials: 'PM', paymentStatus: 'confirmed', paidAt: '29 juin' },
      { id: 'm2', name: 'Salcelin K.', initials: 'SK', paymentStatus: 'pending' },
      { id: 'm3', name: 'Alice N.', initials: 'AN', paymentStatus: 'confirmed', paidAt: '1 juil.' },
      { id: 'm4', name: 'Boris T.', initials: 'BT', paymentStatus: 'pending' },
    ],
  },
}

function formatAmount(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n)
}

export default function CyclePage() {
  const router = useRouter()
  const params = useParams()
  const groupId = params.groupId as string
  const [cycle, setCycle] = useState<CycleDashboard | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setCycle(mockCycles[groupId] || null)
      setIsLoading(false)
    }, 800)
  }, [groupId])

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-xl w-48" />
        <div className="h-40 bg-slate-100 rounded-2xl" />
        <div className="h-64 bg-slate-100 rounded-2xl" />
      </div>
    )
  }

  if (!cycle) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-4">😕</span>
        <h2 className="text-lg font-semibold text-slate-900">Cycle introuvable</h2>
        <button onClick={() => router.back()} className="mt-4 text-emerald-600 font-medium text-sm">
          Retour
        </button>
      </div>
    )
  }

  const progressPercent = Math.round((cycle.totalCollected / cycle.totalExpected) * 100)
  const paidCount = cycle.members.filter((m) => m.paymentStatus === 'confirmed').length
  const pendingCount = cycle.members.filter((m) => m.paymentStatus === 'pending').length

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Cycle {cycle.cycleNumber}</h1>
          <p className="text-sm text-slate-500">{cycle.groupName}</p>
        </div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {/* Stats */}
        <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-3">
          <div className="bg-emerald-50 rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold text-emerald-700">{paidCount}</p>
            <p className="text-xs text-emerald-600 font-medium">A jour</p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold text-orange-700">{pendingCount}</p>
            <p className="text-xs text-orange-600 font-medium">En attente</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold text-slate-700">{progressPercent}%</p>
            <p className="text-xs text-slate-500 font-medium">Collecte</p>
          </div>
        </motion.div>

        {/* Pool */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-slate-700">Pool du cycle</span>
            <span className="text-sm font-bold text-emerald-600">
              {formatAmount(cycle.totalCollected)} / {formatAmount(cycle.totalExpected)} FCFA
            </span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: progressPercent + '%' }}
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Manque encore {formatAmount(cycle.totalExpected - cycle.totalCollected)} FCFA
          </p>
        </motion.div>

        {/* Beneficiaire */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"
        >
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-3">
            Beneficiaire de ce cycle
          </p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold">{cycle.beneficiaryInitials}</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{cycle.beneficiaryName}</p>
              <p className="text-sm text-slate-500">
                Recevra {formatAmount(cycle.totalExpected)} FCFA le {cycle.payoutDate}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-600 font-medium">En cours</span>
            </div>
          </div>
        </motion.div>

        {/* Statut des cotisations */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-slate-50">
            <h2 className="font-semibold text-slate-800 text-sm">
              Statut des cotisations
            </h2>
          </div>
          <div className="divide-y divide-slate-50">
            {cycle.members.map((member) => (
              <div key={member.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-slate-600">{member.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{member.name}</p>
                  {member.paidAt && (
                    <p className="text-xs text-slate-400">Paye le {member.paidAt}</p>
                  )}
                </div>
                <TransactionBadge status={member.paymentStatus} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div variants={fadeInUp} className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push('/dashboard/groups/' + groupId + '/history')}
          >
            Voir l'historique
          </Button>
          <Button
            className="flex-1"
            onClick={() => router.push('/dashboard/groups/' + groupId + '/contribute')}
          >
            Cotiser
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
