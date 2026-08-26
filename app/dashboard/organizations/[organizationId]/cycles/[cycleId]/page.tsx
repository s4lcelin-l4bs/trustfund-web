'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  getOrganizationCycle,
  closeOrganizationCycle,
  archiveOrganizationCycle,
} from '@/lib/api/organizationCycles'
import { OrganizationCycle } from '@/types'
import { CycleStatusBadge } from '@/components/cycles/CycleStatusBadge'
import { CycleFormModal } from '@/components/cycles/CycleFormModal'
import { GlassProgress } from '@/components/ui/Progress'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Skeleton } from '@/components/ui/Skeleton'
import { staggerContainer, fadeInUp } from '@/lib/animations'

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount)
}

import { TurnOrderManager } from '@/components/cycles/TurnOrderManager'

export default function CycleDetailPage() {
  const router = useRouter()
  const params = useParams<{ organizationId: string; cycleId: string }>()
  const { organizationId, cycleId } = params

  const [cycle, setCycle] = useState<OrganizationCycle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isCloseOpen, setIsCloseOpen] = useState(false)
  const [isArchiveOpen, setIsArchiveOpen] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)

  const fetchCycle = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getOrganizationCycle(organizationId, cycleId)
      setCycle(data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors du chargement du cycle.')
    } finally {
      setIsLoading(false)
    }
  }, [organizationId, cycleId])

  useEffect(() => {
    fetchCycle()
  }, [fetchCycle])

  async function handleClose() {
    if (!cycle) return
    setIsActionLoading(true)
    try {
      const updated = await closeOrganizationCycle(organizationId, cycle.id)
      setCycle(updated)
      toast.success('Cycle clôturé')
      setIsCloseOpen(false)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la clôture.')
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handleArchive() {
    if (!cycle) return
    setIsActionLoading(true)
    try {
      const updated = await archiveOrganizationCycle(organizationId, cycle.id)
      setCycle(updated)
      toast.success('Cycle archivé')
      setIsArchiveOpen(false)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de l'archivage.")
    } finally {
      setIsActionLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="glass-card p-6 space-y-3">
          <Skeleton height={20} width="40%" />
          <Skeleton height={14} width="60%" />
        </div>
        <div className="glass-card p-6 space-y-3">
          <Skeleton height={14} width="30%" />
          <Skeleton height={10} />
        </div>
      </div>
    )
  }

  if (!cycle) return null

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <button
          onClick={() => router.push(`/dashboard/organizations/${organizationId}/cycles`)}
          className="p-2.5 rounded-xl glass-btn hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Détail du cycle</h1>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
        <motion.div variants={fadeInUp} className="glass-card p-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{cycle.name}</h2>
            <CycleStatusBadge status={cycle.status} />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(cycle.startDate))} —{' '}
            {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(cycle.endDate))}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <motion.div variants={fadeInUp} className="glass-card p-6 space-y-3 h-full">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Montant collecté</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formatAmount(cycle.collectedAmount)} / {formatAmount(cycle.expectedAmount)}
                </span>
              </div>
              <GlassProgress value={cycle.collectedAmount} max={Math.max(cycle.expectedAmount, 1)} height="h-2.5" />
            </motion.div>

            <motion.div variants={fadeInUp} className="glass-card p-6 space-y-4 h-full">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wide">
                Informations
              </h3>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <InfoRow label="Bénéficiaires" value={String(cycle.beneficiariesCount)} />
                <InfoRow label="Nombre de tours" value={String(cycle.turnsCount)} />
                <InfoRow
                  label="Créé le"
                  value={new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(cycle.createdAt))}
                />
                {cycle.updatedAt && (
                  <InfoRow
                    label="Mis à jour"
                    value={new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(cycle.updatedAt))}
                  />
                )}
              </dl>
            </motion.div>
          </div>

          <motion.div variants={fadeInUp} className="glass-card p-6">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wide mb-4">
              Ordre de passage
            </h3>
            <TurnOrderManager 
              cycle={cycle} 
              organizationId={organizationId} 
              onUpdate={(newOrder) => setCycle({ ...cycle, nextTurnOrder: newOrder })} 
            />
          </motion.div>
        </div>

        <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          <Button variant="outline" onClick={() => setIsEditOpen(true)} disabled={cycle.status === 'archived'}>
            Modifier
          </Button>
          <Button
            variant="glass"
            onClick={() => setIsCloseOpen(true)}
            disabled={cycle.status === 'closed' || cycle.status === 'archived'}
          >
            Clôturer
          </Button>
          <Button variant="danger" onClick={() => setIsArchiveOpen(true)} disabled={cycle.status === 'archived'}>
            Archiver
          </Button>
        </motion.div>
      </motion.div>

      <CycleFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={(updated) => setCycle(updated)}
        organizationId={organizationId}
        cycle={cycle}
      />

      <ConfirmDialog
        isOpen={isCloseOpen}
        onClose={() => setIsCloseOpen(false)}
        onConfirm={handleClose}
        variant="primary"
        title="Clôturer ce cycle ?"
        description="Aucune nouvelle cotisation ne pourra être enregistrée sur ce cycle une fois clôturé."
        confirmLabel="Clôturer"
        isLoading={isActionLoading}
      />

      <ConfirmDialog
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        onConfirm={handleArchive}
        variant="danger"
        title="Archiver ce cycle ?"
        description="Le cycle sera masqué des listes actives. Cette action peut être irréversible selon votre configuration."
        confirmLabel="Archiver"
        isLoading={isActionLoading}
      />
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
        {label}
      </dt>
      <dd className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5">{value}</dd>
    </div>
  )
}
