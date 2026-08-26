'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  getOrganization,
  archiveOrganization,
  restoreOrganization,
  deleteOrganization,
} from '@/lib/api/organizations'
import { Organization } from '@/types'
import { OrganizationStatusBadge } from '@/components/organizations/OrganizationCard'
import { OrganizationFormModal } from '@/components/organizations/OrganizationFormModal'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Skeleton, SkeletonAvatar } from '@/components/ui/Skeleton'
import { staggerContainer, fadeInUp } from '@/lib/animations'
import { useActiveOrganizationStore } from '@/store/useActiveOrganizationStore'
import { useMyPermissions } from '@/lib/hooks/useMyPermissions'

export default function OrganizationDetailPage() {
  const router = useRouter()
  const params = useParams<{ organizationId: string }>()
  const organizationId = params.organizationId
  const setActiveOrganizationId = useActiveOrganizationStore((s) => s.setActiveOrganizationId)
  const { hasPermission, isLoading: isLoadingPermissions } = useMyPermissions(organizationId)

  useEffect(() => {
    if (organizationId) setActiveOrganizationId(organizationId)
  }, [organizationId, setActiveOrganizationId])

  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isArchiveOpen, setIsArchiveOpen] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)

  const fetchOrganization = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getOrganization(organizationId)
      setOrganization(data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors du chargement de l'organisation.")
    } finally {
      setIsLoading(false)
    }
  }, [organizationId])

  useEffect(() => {
    fetchOrganization()
  }, [fetchOrganization])

  async function handleArchiveToggle() {
    if (!organization) return
    setIsActionLoading(true)
    try {
      const updated =
        organization.status === 'archived'
          ? await restoreOrganization(organization.id)
          : await archiveOrganization(organization.id)
      setOrganization(updated)
      toast.success(organization.status === 'archived' ? 'Organisation restaurée' : 'Organisation archivée')
      setIsArchiveOpen(false)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de l'opération.")
    } finally {
      setIsActionLoading(false)
    }
  }

  async function handleDelete() {
    if (!organization) return
    setIsActionLoading(true)
    try {
      await deleteOrganization(organization.id)
      toast.success('Organisation supprimée')
      router.push('/dashboard/organizations')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression.')
      setIsActionLoading(false)
    }
  }

  if (isLoading || isLoadingPermissions) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-6">
          <SkeletonAvatar size={64} />
        </div>
        <div className="glass-card p-6 space-y-3">
          <Skeleton height={14} width="40%" />
          <Skeleton height={14} width="60%" />
          <Skeleton height={14} width="50%" />
        </div>
      </div>
    )
  }

  if (!organization) return null

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <button
          onClick={() => router.back()}
          className="p-2.5 rounded-xl glass-btn hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Détail de l'organisation</h1>
        </div>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
        <motion.div variants={fadeInUp} className="glass-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Avatar src={organization.logoUrl} initials={organization.name.charAt(0)} size={64} />
              <div className="min-w-0">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white truncate">
                  {organization.name}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {organization.city}, {organization.country}
                </p>
              </div>
            </div>
            <OrganizationStatusBadge status={organization.status} />
          </div>

          {organization.description && (
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">{organization.description}</p>
          )}
        </motion.div>

        <motion.div variants={fadeInUp} className="glass-card p-6 space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wide">
            Informations
          </h3>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <InfoRow label="Devise" value={organization.currency} />
            <InfoRow label="Membres" value={String(organization.memberCount)} />
            <InfoRow label="Pays" value={organization.country} />
            <InfoRow label="Ville" value={organization.city} />
            <InfoRow
              label="Créée le"
              value={new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(organization.createdAt))}
            />
            {organization.updatedAt && (
              <InfoRow
                label="Mise à jour"
                value={new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(organization.updatedAt))}
              />
            )}
          </dl>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <button
            onClick={() => router.push(`/dashboard/organizations/${organization.id}/members`)}
            className="w-full glass-card p-5 flex items-center justify-between hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900 dark:text-white">Membres</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {organization.memberCount} membre{organization.memberCount > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <svg className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>

        {hasPermission('MANAGE_ROLES') && (
          <motion.div variants={fadeInUp}>
            <button
              onClick={() => router.push(`/dashboard/organizations/${organization.id}/roles`)}
              className="w-full glass-card p-5 flex items-center justify-between hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-white">Rôles & permissions</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Gérer les accès de l'équipe</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        )}

        {hasPermission('MANAGE_CYCLES') && (
          <motion.div variants={fadeInUp}>
            <button
              onClick={() => router.push(`/dashboard/organizations/${organization.id}/cycles`)}
              className="w-full glass-card p-5 flex items-center justify-between hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center">
                  <span className="text-xl">🔄</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-white">Cycles</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Gérer les périodes de cotisation</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        )}

        {/* Modules Financiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {hasPermission('MANAGE_CONTRIBUTIONS') && (
            <motion.div variants={fadeInUp}>
              <button
                onClick={() => router.push(`/dashboard/contributions`)}
                className="w-full glass-card p-5 flex items-center justify-between hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center">
                    <span className="text-xl">💰</span>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-900 dark:text-white">Cotisations</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Paiements et retards</p>
                  </div>
                </div>
              </button>
            </motion.div>
          )}

          <motion.div variants={fadeInUp}>
            <button
              onClick={() => router.push(`/dashboard/expenses`)}
              className="w-full glass-card p-5 flex items-center justify-between hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 flex items-center justify-center">
                  <span className="text-xl">📉</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-white">Dépenses</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Gestion des décaissements</p>
                </div>
              </div>
            </button>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <button
              onClick={() => router.push(`/dashboard/loans`)}
              className="w-full glass-card p-5 flex items-center justify-between hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 flex items-center justify-center">
                  <span className="text-xl">🤝</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-white">Prêts</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Demandes et échéanciers</p>
                </div>
              </div>
            </button>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <button
              onClick={() => router.push(`/dashboard/penalties`)}
              className="w-full glass-card p-5 flex items-center justify-between hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/40 flex items-center justify-center">
                  <span className="text-xl">⚠️</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-white">Pénalités & Amendes</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Gestion des sanctions</p>
                </div>
              </div>
            </button>
          </motion.div>
        </div>

        {hasPermission('MANAGE_ORGANIZATION') && (
          <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
            <Button variant="outline" onClick={() => setIsEditOpen(true)}>
              Modifier
            </Button>
            <Button variant="glass" onClick={() => setIsArchiveOpen(true)}>
              {organization.status === 'archived' ? 'Restaurer' : 'Archiver'}
            </Button>
            <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
              Supprimer
            </Button>
          </motion.div>
        )}
      </motion.div>

      <OrganizationFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={(updated) => setOrganization(updated)}
        organization={organization}
      />

      <ConfirmDialog
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        onConfirm={handleArchiveToggle}
        variant="primary"
        title={organization.status === 'archived' ? "Restaurer l'organisation ?" : "Archiver l'organisation ?"}
        description={
          organization.status === 'archived'
            ? "L'organisation redeviendra active et visible normalement."
            : "L'organisation sera masquée des listes actives. Vous pourrez la restaurer à tout moment."
        }
        confirmLabel={organization.status === 'archived' ? 'Restaurer' : 'Archiver'}
        isLoading={isActionLoading}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        variant="danger"
        title="Supprimer cette organisation ?"
        description="Cette action est irréversible. Toutes les données associées seront définitivement supprimées."
        confirmLabel="Supprimer"
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
