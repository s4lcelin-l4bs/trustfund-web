'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Organization } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { fadeInUp } from '@/lib/animations'

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(dateStr)
  )
}

const statusConfig = {
  active: { variant: 'success' as const, label: 'Active' },
  inactive: { variant: 'warning' as const, label: 'Inactive' },
  archived: { variant: 'neutral' as const, label: 'Archivée' },
}

export function OrganizationStatusBadge({ status }: { status: Organization['status'] }) {
  const config = statusConfig[status]
  return <Badge variant={config.variant} label={config.label} dot />
}

interface OrganizationCardProps {
  organization: Organization
  index: number
}

export function OrganizationCard({ organization, index }: OrganizationCardProps) {
  const router = useRouter()

  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(5,150,105,0.16), 0 4px 16px rgba(0,0,0,0.06)' }}
      whileTap={{ scale: 0.99 }}
      onClick={() => router.push('/dashboard/organizations/' + organization.id)}
      className="relative glass-card p-5 cursor-pointer bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm rounded-2xl overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
          <Avatar src={organization.logoUrl} initials={organization.name.charAt(0)} size={44} />
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">
              {organization.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {organization.city}, {organization.country}
            </p>
          </div>
        </div>
        <OrganizationStatusBadge status={organization.status} />
      </div>

      {organization.description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
          {organization.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-white/20 dark:border-white/5">
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {organization.memberCount} membre{organization.memberCount > 1 ? 's' : ''}
          </span>
          <span>·</span>
          <span>{organization.currency}</span>
          <span>·</span>
          <span>Créée le {formatDate(organization.createdAt)}</span>
        </div>
        <svg className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.div>
  )
}
