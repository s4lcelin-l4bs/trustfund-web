'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { getOrganizationMember, deleteOrganizationMember } from '@/lib/api/organizationMembers'
import { OrganizationMember } from '@/types'
import { MemberStatusBadge } from '@/components/members/MemberStatusBadge'
import { MemberFormModal } from '@/components/members/MemberFormModal'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Skeleton, SkeletonAvatar } from '@/components/ui/Skeleton'
import { staggerContainer, fadeInUp } from '@/lib/animations'
import { useMyPermissions } from '@/lib/hooks/useMyPermissions'

export default function OrganizationMemberDetailPage() {
  const router = useRouter()
  const params = useParams<{ organizationId: string; memberId: string }>()
  const { organizationId, memberId } = params
  const { hasPermission, isOwner, isLoading: isLoadingPermissions } = useMyPermissions(organizationId)

  const [member, setMember] = useState<OrganizationMember | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchMember = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getOrganizationMember(organizationId, memberId)
      setMember(data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors du chargement du membre.')
    } finally {
      setIsLoading(false)
    }
  }, [organizationId, memberId])

  useEffect(() => {
    fetchMember()
  }, [fetchMember])

  async function handleDelete() {
    if (!member) return
    setIsDeleting(true)
    try {
      await deleteOrganizationMember(organizationId, member.id)
      toast.success('Membre supprimé')
      router.push(`/dashboard/organizations/${organizationId}/members`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression.')
      setIsDeleting(false)
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

  if (!member) return null

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <button
          onClick={() => router.push(`/dashboard/organizations/${organizationId}/members`)}
          className="p-2.5 rounded-xl glass-btn hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Détail du membre</h1>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
        <motion.div variants={fadeInUp} className="glass-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Avatar
                src={member.photoUrl}
                initials={`${member.firstName.charAt(0)}${member.lastName.charAt(0)}`}
                size={64}
              />
              <div className="min-w-0">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white truncate">
                  {member.firstName} {member.lastName}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-mono">{member.matricule}</p>
              </div>
            </div>
            <MemberStatusBadge status={member.status} />
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="glass-card p-6 space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wide">
            Coordonnées
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <InfoRow label="Téléphone" value={member.phone} />
            <InfoRow label="WhatsApp" value={member.whatsapp || '—'} />
            <InfoRow label="Email" value={member.email || '—'} />
            <InfoRow label="Adresse" value={member.address || '—'} />
          </dl>
        </motion.div>

        <motion.div variants={fadeInUp} className="glass-card p-6 space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wide">
            Informations complémentaires
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <InfoRow label="Sexe" value={member.gender === 'male' ? 'Masculin' : 'Féminin'} />
            <InfoRow label="Profession" value={member.profession || '—'} />
            <InfoRow
              label="Date d'entrée"
              value={new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(member.joinedAt))}
            />
          </dl>
        </motion.div>

        <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-3">
          {(hasPermission('MANAGE_MEMBERS') || isOwner) && (
            <Button variant="outline" onClick={() => setIsEditOpen(true)}>
              Modifier
            </Button>
          )}
          {hasPermission('DELETE_MEMBER') && (
            <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
              Supprimer
            </Button>
          )}
        </motion.div>
      </motion.div>

      <MemberFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={(updated) => setMember(updated)}
        organizationId={organizationId}
        member={member}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        variant="danger"
        title="Supprimer ce membre ?"
        description="Cette action est irréversible."
        confirmLabel="Supprimer"
        isLoading={isDeleting}
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
