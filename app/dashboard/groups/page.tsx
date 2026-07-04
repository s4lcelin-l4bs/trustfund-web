'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/useAuthStore'
import { getMyGroupsApi, GroupSummary } from '@/lib/api/groups'
import { GroupCard } from '@/components/groups/GroupCard'
import { GroupCardSkeleton } from '@/components/groups/GroupCardSkeleton'
import { staggerContainer, fadeInUp } from '@/lib/animations'

export default function GroupsPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [groups, setGroups] = useState<GroupSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getMyGroupsApi()
      .then(setGroups)
      .finally(() => setIsLoading(false))
  }, [])

  const firstName = user?.fullName?.split(' ')[0] || 'la'

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-slate-900">
          Bonjour, {firstName} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Voici vos groupes de tontine
        </p>
      </motion.div>

      {/* Stats */}
      {!isLoading && groups.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <StatCard value={groups.length.toString()} label="Groupes" color="emerald" />
          <StatCard
            value={groups.filter((g) => g.myPaymentStatus === 'confirmed').length.toString()}
            label="A jour"
            color="blue"
          />
          <StatCard
            value={groups.filter((g) => g.isMyTurnNext).length.toString()}
            label="Tour proche"
            color="orange"
          />
        </motion.div>
      )}

      {/* Liste des groupes */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <GroupCardSkeleton key={i} />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <EmptyState onCreateGroup={() => router.push('/dashboard/groups/new')} />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {groups.map((group, index) => (
            <GroupCard key={group.id} group={group} index={index} />
          ))}
        </motion.div>
      )}

      {/* FAB */}
      {!isLoading && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/dashboard/groups/new')}
          className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 bg-emerald-600 text-white rounded-2xl px-4 py-3 shadow-lg flex items-center gap-2 font-medium text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Creer un groupe
        </motion.button>
      )}
    </div>
  )
}

function StatCard({
  value,
  label,
  color,
}: {
  value: string
  label: string
  color: 'emerald' | 'blue' | 'orange'
}) {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-700',
    blue: 'bg-blue-50 text-blue-700',
    orange: 'bg-orange-50 text-orange-700',
  }

  return (
    <div className={'rounded-2xl p-3 text-center ' + colors[color]}>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs font-medium mt-0.5 opacity-80">{label}</p>
    </div>
  )
}

function EmptyState({ onCreateGroup }: { onCreateGroup: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-4">
        <span className="text-4xl">🫂</span>
      </div>
      <h3 className="text-lg font-semibold text-slate-900">Aucun groupe pour l'instant</h3>
      <p className="text-slate-500 text-sm mt-1 max-w-xs">
        Creez votre premier groupe de tontine ou rejoignez-en un via un lien d'invitation.
      </p>
      <button
        onClick={onCreateGroup}
        className="mt-6 bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-emerald-700 transition-colors"
      >
        Creer mon premier groupe
      </button>
    </motion.div>
  )
}
