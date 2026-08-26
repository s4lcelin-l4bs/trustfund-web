'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { OrganizationMember, ContributionStatus } from '@/types'
import { Avatar } from '@/components/ui/Avatar'
import { MemberStatusBadge } from './MemberStatusBadge'
import { fadeInUp, staggerContainer } from '@/lib/animations'

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(dateStr)
  )
}

function formatAmount(amount: number, currency?: string): string {
  return new Intl.NumberFormat('fr-FR', { style: 'decimal', maximumFractionDigits: 0 }).format(amount) + ' ' + (currency || 'FCFA')
}

function ContributionStatusBadge({ status }: { status: ContributionStatus }) {
  const config: Record<ContributionStatus, { label: string; icon: string; className: string }> = {
    paid:    { label: 'Payée',      icon: '✓', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' },
    partial: { label: 'Partielle',  icon: '~', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
    late:    { label: 'En retard',  icon: '!', className: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
    advance: { label: 'Avancée',   icon: '↑', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
    pending: { label: 'À payer',    icon: '○', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  }
  const c = config[status] || config.pending
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${c.className}`}>
      <span>{c.icon}</span>
      {c.label}
    </span>
  )
}

function TurnPositionBadge({ position }: { position: number }) {
  if (position <= 0) return null
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-[10px] font-bold shadow-sm flex-shrink-0">
      #{position}
    </span>
  )
}

interface MembersTableProps {
  members: OrganizationMember[]
  onSelect: (member: OrganizationMember) => void
  currentMemberId?: string
  organizationId?: string
}

export function MembersTable({ members, onSelect, currentMemberId, organizationId }: MembersTableProps) {
  const router = useRouter()

  function handleRowClick(member: OrganizationMember) {
    // If it's current user's own row + unpaid contribution → redirect to pay
    if (member.id === currentMemberId && organizationId) {
      const contrib = member.currentContribution
      if (contrib && (contrib.status === 'pending' || contrib.status === 'late' || contrib.status === 'partial')) {
        router.push(`/dashboard/contributions?action=pay&contributionId=${contrib.id}`)
        return
      }
    }
    onSelect(member)
  }

  return (
    <>
      {/* Desktop table */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="hidden sm:block glass-card overflow-hidden !p-0"
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/20 dark:border-white/5 text-left">
              <th className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">Tour</th>
              <th className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">Membre</th>
              <th className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">Matricule</th>
              <th className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">Téléphone</th>
              <th className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide text-right">Montant</th>
              <th className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">Cotisation</th>
              <th className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => {
              const isMe = member.id === currentMemberId
              const contrib = member.currentContribution
              const isPendingPayment = contrib && (contrib.status === 'pending' || contrib.status === 'late' || contrib.status === 'partial')

              return (
                <motion.tr
                  key={member.id}
                  variants={fadeInUp}
                  custom={index}
                  onClick={() => handleRowClick(member)}
                  className={`border-b border-white/10 dark:border-white/5 last:border-0 cursor-pointer transition-colors
                    ${isMe
                      ? 'bg-emerald-50/60 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                      : 'hover:bg-white/40 dark:hover:bg-white/5'
                    }`}
                >
                  {/* Turn position */}
                  <td className="px-4 py-3.5">
                    {member.turnPosition && member.turnPosition > 0
                      ? <TurnPositionBadge position={member.turnPosition} />
                      : <span className="text-slate-300 dark:text-slate-700 text-xs">—</span>
                    }
                  </td>

                  {/* Name + "Vous" badge */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={member.photoUrl}
                        initials={`${member.firstName.charAt(0)}${member.lastName.charAt(0)}`}
                        size={36}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {member.firstName} {member.lastName}
                          </span>
                          {isMe && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold">
                              Vous
                            </span>
                          )}
                        </div>
                        {member.profession && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{member.profession}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 font-mono text-xs">
                    {member.matricule}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400">{member.phone}</td>

                  {/* Amount — always visible */}
                  <td className="px-4 py-3.5 text-right">
                    {contrib ? (
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                          {new Intl.NumberFormat('fr-FR').format(contrib.amount)}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">FCFA</p>
                      </div>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700 text-xs">—</span>
                    )}
                  </td>

                  {/* Contribution status badge */}
                  <td className="px-4 py-3.5">
                    {contrib
                      ? <ContributionStatusBadge status={contrib.status} />
                      : <span className="text-slate-300 dark:text-slate-700 text-xs">—</span>
                    }
                  </td>

                  {/* Member status */}
                  <td className="px-4 py-3.5">
                    <MemberStatusBadge status={member.status} />
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3.5 text-right">
                    {isMe && isPendingPayment ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-sm whitespace-nowrap">
                        Cotiser
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    ) : (
                      <svg className="w-4 h-4 text-slate-400 dark:text-slate-500 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </motion.div>

      {/* Mobile card view */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="sm:hidden space-y-3">
        {members.map((member, index) => {
          const isMe = member.id === currentMemberId
          const contrib = member.currentContribution
          const isPendingPayment = contrib && (contrib.status === 'pending' || contrib.status === 'late' || contrib.status === 'partial')

          return (
            <motion.div
              key={member.id}
              variants={fadeInUp}
              custom={index}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleRowClick(member)}
              className={`glass-card p-4 cursor-pointer border-2 transition-colors
                ${isMe
                  ? 'border-emerald-400/50 dark:border-emerald-600/40'
                  : 'border-transparent'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <Avatar
                    src={member.photoUrl}
                    initials={`${member.firstName.charAt(0)}${member.lastName.charAt(0)}`}
                    size={44}
                  />
                  {member.turnPosition && member.turnPosition > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                      {member.turnPosition}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {member.firstName} {member.lastName}
                    </p>
                    {isMe && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold">
                        Vous
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {member.matricule} · {member.phone}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <MemberStatusBadge status={member.status} />
                  {contrib && <ContributionStatusBadge status={contrib.status} />}
                </div>
              </div>
              {/* Mobile amount + pay button */}
              {contrib && (
                <div className="mt-3 pt-3 border-t border-white/20 dark:border-white/5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Cotisation</p>
                    <p className="font-bold text-slate-800 dark:text-slate-100 tabular-nums text-base">
                      {new Intl.NumberFormat('fr-FR').format(contrib.amount)} <span className="text-xs font-medium text-slate-400">FCFA</span>
                    </p>
                  </div>
                  {isMe && isPendingPayment ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold shadow-md whitespace-nowrap">
                      Cotiser
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  ) : (
                    <ContributionStatusBadge status={contrib.status} />
                  )}
                </div>
              )}
            </motion.div>
          )
        })}
      </motion.div>
    </>
  )
}
