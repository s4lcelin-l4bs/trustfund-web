'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { TransactionBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { staggerContainer, fadeInUp } from '@/lib/animations'

interface MockMember {
  id: string
  name: string
  initials: string
  turnPosition: number
  paymentStatus: 'confirmed' | 'pending' | 'failed'
  role: 'manager' | 'member'
}

interface MockGroupDetail {
  id: string
  name: string
  contributionAmount: number
  frequency: string
  totalCollected: number
  totalExpected: number
  currentBeneficiary: string
  nextTurnDate: string
  cycleNumber: number
  members: MockMember[]
}

const mockGroupDetails: Record<string, MockGroupDetail> = {
  'group-1': {
    id: 'group-1',
    name: 'Tontine bureau IUT',
    contributionAmount: 50000,
    frequency: 'Mensuelle',
    totalCollected: 525000,
    totalExpected: 750000,
    currentBeneficiary: 'Marie T.',
    nextTurnDate: '14 juil. 2026',
    cycleNumber: 3,
    members: [
      { id: 'm1', name: 'Marie Tamba', initials: 'MT', turnPosition: 1, paymentStatus: 'confirmed', role: 'manager' },
      { id: 'm2', name: 'Salcelin K.', initials: 'SK', turnPosition: 2, paymentStatus: 'confirmed', role: 'member' },
      { id: 'm3', name: 'Joseph Ngono', initials: 'JN', turnPosition: 3, paymentStatus: 'confirmed', role: 'member' },
      { id: 'm4', name: 'Aissatou B.', initials: 'AB', turnPosition: 4, paymentStatus: 'pending', role: 'member' },
      { id: 'm5', name: 'Paul Mbappe', initials: 'PM', turnPosition: 5, paymentStatus: 'pending', role: 'member' },
    ],
  },
  'group-2': {
    id: 'group-2',
    name: 'Epargne famille',
    contributionAmount: 20000,
    frequency: 'Hebdomadaire',
    totalCollected: 100000,
    totalExpected: 120000,
    currentBeneficiary: 'Vous',
    nextTurnDate: '7 juil. 2026',
    cycleNumber: 1,
    members: [
      { id: 'm1', name: 'Salcelin K.', initials: 'SK', turnPosition: 1, paymentStatus: 'confirmed', role: 'manager' },
      { id: 'm2', name: 'Maman K.', initials: 'MK', turnPosition: 2, paymentStatus: 'confirmed', role: 'member' },
      { id: 'm3', name: 'Papa K.', initials: 'PK', turnPosition: 3, paymentStatus: 'pending', role: 'member' },
    ],
  },
  'group-3': {
    id: 'group-3',
    name: 'Tontine amis campus',
    contributionAmount: 10000,
    frequency: 'Mensuelle',
    totalCollected: 40000,
    totalExpected: 100000,
    currentBeneficiary: 'Paul M.',
    nextTurnDate: '20 juil. 2026',
    cycleNumber: 2,
    members: [
      { id: 'm1', name: 'Paul Mbappe', initials: 'PM', turnPosition: 1, paymentStatus: 'confirmed', role: 'manager' },
      { id: 'm2', name: 'Salcelin K.', initials: 'SK', turnPosition: 2, paymentStatus: 'pending', role: 'member' },
      { id: 'm3', name: 'Alice N.', initials: 'AN', turnPosition: 3, paymentStatus: 'confirmed', role: 'member' },
      { id: 'm4', name: 'Boris T.', initials: 'BT', turnPosition: 4, paymentStatus: 'pending', role: 'member' },
    ],
  },
}

function formatAmount(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n)
}

export default function GroupDetailPage() {
  const router = useRouter()
  const params = useParams()
  const groupId = params.groupId as string
  const [group, setGroup] = useState<MockGroupDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'membres' | 'cycle'>('membres')

  useEffect(() => {
    setTimeout(() => {
      const found = mockGroupDetails[groupId]
      if (found) setGroup(found)
      setIsLoading(false)
    }, 800)
  }, [groupId])

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-xl w-48" />
        <div className="h-32 bg-slate-100 rounded-2xl" />
        <div className="h-64 bg-slate-100 rounded-2xl" />
      </div>
    )
  }

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-4">😕</span>
        <h2 className="text-lg font-semibold text-slate-900">Groupe introuvable</h2>
        <button
          onClick={() => router.push('/dashboard/groups')}
          className="mt-4 text-emerald-600 font-medium text-sm"
        >
          Retour aux groupes
        </button>
      </div>
    )
  }

  const progressPercent = Math.round((group.totalCollected / group.totalExpected) * 100)

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
          <h1 className="text-xl font-bold text-slate-900">{group.name}</h1>
          <p className="text-sm text-slate-500">Cycle {group.cycleNumber} · {group.frequency}</p>
        </div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <motion.div
          variants={fadeInUp}
          className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-lg"
        >
          <p className="text-emerald-100 text-sm mb-1">Pool collecte</p>
          <p className="text-3xl font-bold">
            {formatAmount(group.totalCollected)}{' '}
            <span className="text-xl font-medium text-emerald-200">FCFA</span>
          </p>
          <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: progressPercent + '%' }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-full bg-white rounded-full"
            />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-emerald-200">
            <span>{progressPercent}% collecte</span>
            <span>Objectif : {formatAmount(group.totalExpected)} FCFA</span>
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <span className="text-emerald-700 text-lg">💰</span>
            </div>
            <div>
              <p className="text-xs text-slate-500">Beneficiaire du tour</p>
              <p className="font-semibold text-slate-900">{group.currentBeneficiary}</p>
              <p className="text-xs text-slate-400">Versement le {group.nextTurnDate}</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => router.push('/dashboard/groups/' + groupId + '/contribute')}
          >
            Cotiser
          </Button>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <div className="flex bg-slate-100 p-1 rounded-xl mb-3">
            {(['membres', 'cycle'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={
                  'flex-1 py-2 rounded-lg text-sm font-medium transition-all ' +
                  (activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500')
                }
              >
                {tab === 'membres' ? 'Membres' : 'Cycle en cours'}
              </button>
            ))}
          </div>

          {activeTab === 'membres' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50"
            >
              {group.members.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-3">
                  <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-700 text-xs font-bold">{member.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{member.name}</p>
                    <p className="text-xs text-slate-400">
                      Tour n°{member.turnPosition}
                      {member.role === 'manager' && (
                        <span className="ml-1.5 text-emerald-600 font-medium">· Gerant</span>
                      )}
                    </p>
                  </div>
                  <TransactionBadge status={member.paymentStatus} />
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'cycle' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              {group.members.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex items-center gap-3"
                >
                  <div className={
                    'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ' +
                    (member.paymentStatus === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500')
                  }>
                    {member.turnPosition}
                  </div>
                  <span className="flex-1 text-sm text-slate-700">{member.name}</span>
                  <TransactionBadge status={member.paymentStatus} />
                </div>
              ))}
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1"
                  onClick={() => router.push('/dashboard/groups/' + groupId + '/history')}>
                  Historique
                </Button>
                <Button size="sm" className="flex-1"
                  onClick={() => router.push('/dashboard/groups/' + groupId + '/cycle')}>
                  Tableau de bord
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div variants={fadeInUp}>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.origin + '/invite/abc123')
              toast.success('Lien copie !')
            }}
            className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Copier le lien d'invitation
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
