'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { staggerContainer, fadeInUp } from '@/lib/animations'

type TxType = 'contribution' | 'payout' | 'penalty'
type TxStatus = 'confirmed' | 'pending' | 'failed'

interface HistoryTransaction {
  id: string
  type: TxType
  memberName: string
  amount: number
  status: TxStatus
  date: string
  reference: string
}

const mockHistory: Record<string, HistoryTransaction[]> = {
  'group-1': [
    { id: 't1', type: 'contribution', memberName: 'Marie Tamba', amount: 50000, status: 'confirmed', date: '1 juil. 2026', reference: 'TF-001234' },
    { id: 't2', type: 'contribution', memberName: 'Salcelin K.', amount: 50000, status: 'confirmed', date: '2 juil. 2026', reference: 'TF-001235' },
    { id: 't3', type: 'contribution', memberName: 'Joseph Ngono', amount: 50000, status: 'confirmed', date: '1 juil. 2026', reference: 'TF-001236' },
    { id: 't4', type: 'contribution', memberName: 'Aissatou B.', amount: 50000, status: 'pending', date: '4 juil. 2026', reference: 'TF-001237' },
    { id: 't5', type: 'penalty', memberName: 'Aissatou B.', amount: 1000, status: 'pending', date: '4 juil. 2026', reference: 'TF-PEN-001' },
    { id: 't6', type: 'payout', memberName: 'Joseph Ngono', amount: 750000, status: 'confirmed', date: '15 juin 2026', reference: 'TF-OUT-002' },
    { id: 't7', type: 'contribution', memberName: 'Paul Mbappe', amount: 50000, status: 'failed', date: '3 juil. 2026', reference: 'TF-001238' },
  ],
  'group-2': [
    { id: 't1', type: 'contribution', memberName: 'Salcelin K.', amount: 20000, status: 'confirmed', date: '30 juin 2026', reference: 'TF-002001' },
    { id: 't2', type: 'contribution', memberName: 'Maman K.', amount: 20000, status: 'confirmed', date: '30 juin 2026', reference: 'TF-002002' },
    { id: 't3', type: 'contribution', memberName: 'Papa K.', amount: 20000, status: 'pending', date: '4 juil. 2026', reference: 'TF-002003' },
  ],
  'group-3': [
    { id: 't1', type: 'contribution', memberName: 'Paul Mbappe', amount: 10000, status: 'confirmed', date: '29 juin 2026', reference: 'TF-003001' },
    { id: 't2', type: 'contribution', memberName: 'Alice N.', amount: 10000, status: 'confirmed', date: '1 juil. 2026', reference: 'TF-003002' },
    { id: 't3', type: 'contribution', memberName: 'Salcelin K.', amount: 10000, status: 'pending', date: '4 juil. 2026', reference: 'TF-003003' },
    { id: 't4', type: 'contribution', memberName: 'Boris T.', amount: 10000, status: 'pending', date: '4 juil. 2026', reference: 'TF-003004' },
  ],
}

function formatAmount(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n)
}

function getTxConfig(type: TxType) {
  const configs = {
    contribution: { label: 'Cotisation', emoji: '⬆️', color: 'text-emerald-600', sign: '+' },
    payout: { label: 'Versement', emoji: '💰', color: 'text-blue-600', sign: '-' },
    penalty: { label: 'Penalite', emoji: '⚠️', color: 'text-orange-600', sign: '+' },
  }
  return configs[type]
}

function getStatusStyle(status: TxStatus) {
  const styles = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-orange-100 text-orange-700',
    failed: 'bg-red-100 text-red-700',
  }
  const labels = {
    confirmed: 'Confirme',
    pending: 'En attente',
    failed: 'Echoue',
  }
  return { style: styles[status], label: labels[status] }
}

export default function HistoryPage() {
  const router = useRouter()
  const params = useParams()
  const groupId = params.groupId as string
  const [transactions, setTransactions] = useState<HistoryTransaction[]>([])
  const [filter, setFilter] = useState<'all' | TxType>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setTransactions(mockHistory[groupId] || [])
      setIsLoading(false)
    }, 800)
  }, [groupId])

  const filtered = filter === 'all'
    ? transactions
    : transactions.filter((t) => t.type === filter)

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-xl w-48" />
        <div className="h-12 bg-slate-100 rounded-2xl" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-slate-100 rounded-2xl" />
        ))}
      </div>
    )
  }

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
          <h1 className="text-xl font-bold text-slate-900">Historique</h1>
          <p className="text-sm text-slate-500">{transactions.length} transactions</p>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-4"
      >
        {/* Filtres */}
        <motion.div variants={fadeInUp} className="flex gap-2 overflow-x-auto pb-1">
          {([
            { value: 'all', label: 'Tout' },
            { value: 'contribution', label: 'Cotisations' },
            { value: 'payout', label: 'Versements' },
            { value: 'penalty', label: 'Penalites' },
          ] as { value: typeof filter; label: string }[]).map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={
                'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ' +
                (filter === f.value
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300')
              }
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Liste */}
        {filtered.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <span className="text-4xl mb-3">📭</span>
            <p className="text-slate-500 text-sm">Aucune transaction pour ce filtre</p>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            {filtered.map((tx, i) => {
              const config = getTxConfig(tx.type)
              const statusInfo = getStatusStyle(tx.status)
              return (
                <motion.div
                  key={tx.id}
                  variants={fadeInUp}
                  className={
                    'flex items-center gap-3 px-4 py-3 ' +
                    (i < filtered.length - 1 ? 'border-b border-slate-50' : '')
                  }
                >
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
                    {config.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {config.label} — {tx.memberName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-slate-400">{tx.date}</p>
                      <span className="text-slate-300">·</span>
                      <p className="text-xs font-mono text-slate-400">{tx.reference}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={'text-sm font-bold ' + config.color}>
                      {config.sign}{formatAmount(tx.amount)} F
                    </p>
                    <span className={'text-xs px-2 py-0.5 rounded-full font-medium ' + statusInfo.style}>
                      {statusInfo.label}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Export */}
        <motion.div variants={fadeInUp}>
          <button
            onClick={() => toast.success('Export PDF disponible dans la vague 2 !')}
            className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exporter en PDF
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
