'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { getOrganizationMembers } from '@/lib/api/organizationMembers'
import { OrganizationMember, OrganizationMemberStatus, MemberGender, PaginatedResult } from '@/types'
import { MembersTable } from '@/components/members/MembersTable'
import { MembersTableSkeleton } from '@/components/members/MembersTableSkeleton'
import { InviteLinkModal } from '@/components/members/InviteLinkModal'
import { Input } from '@/components/ui/Input'
import { Tabs } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { useMyPermissions } from '@/lib/hooks/useMyPermissions'

const STATUS_TABS: { id: OrganizationMemberStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'active', label: 'Actifs' },
  { id: 'inactive', label: 'Inactifs' },
  { id: 'suspended', label: 'Suspendus' },
]

const PAGE_SIZE = 10

export default function OrganizationMembersPage() {
  const router = useRouter()
  const params = useParams<{ organizationId: string }>()
  const organizationId = params.organizationId
  const { hasPermission, isOwner, isLoading: isLoadingPermissions, membership } = useMyPermissions(organizationId)

  const [result, setResult] = useState<PaginatedResult<OrganizationMember> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<OrganizationMemberStatus | 'all'>('all')
  const [gender, setGender] = useState<MemberGender | 'all'>('all')
  const [page, setPage] = useState(1)

  const [isInviteOpen, setIsInviteOpen] = useState(false)

  const debouncedSearch = useDebounce(search, 350)

  const fetchMembers = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getOrganizationMembers(organizationId, {
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status,
        gender,
      })
      setResult(data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors du chargement des membres.')
    } finally {
      setIsLoading(false)
    }
  }, [organizationId, page, debouncedSearch, status, gender])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, status, gender])

  const members = result?.items || []

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <button
          onClick={() => router.push(`/dashboard/organizations/${organizationId}`)}
          className="p-2.5 rounded-xl glass-btn hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Membres</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {result ? `${result.total} membre${result.total > 1 ? 's' : ''}` : ''}
          </p>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un membre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
              </svg>
            }
          />
        </div>
        <div className="flex gap-2">
          {(hasPermission('NOTIFY_MEMBER') || isOwner) && (
            <Button variant="glass" onClick={() => setIsInviteOpen(true)}>
              Inviter
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Tabs
          tabs={STATUS_TABS.map((t) => ({ id: t.id, label: t.label }))}
          activeId={status}
          onChange={(id) => setStatus(id as OrganizationMemberStatus | 'all')}
        />
        <Tabs
          tabs={[
            { id: 'all', label: 'Tous' },
            { id: 'male', label: 'Hommes' },
            { id: 'female', label: 'Femmes' },
          ]}
          activeId={gender}
          onChange={(id) => setGender(id as MemberGender | 'all')}
        />
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MembersTableSkeleton />
          </motion.div>
        ) : members.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EmptyState
              hasFilters={Boolean(debouncedSearch) || status !== 'all' || gender !== 'all'}
              onCreate={() => setIsInviteOpen(true)}
              canInvite={hasPermission('NOTIFY_MEMBER') || isOwner}
            />
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MembersTable
              members={members}
              organizationId={organizationId}
              currentMemberId={membership?.member?.id}
              onSelect={(member) => router.push(`/dashboard/organizations/${organizationId}/members/${member.id}`)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && result && result.totalPages > 1 && (
        <Pagination page={page} totalPages={result.totalPages} onChange={setPage} className="mt-8" />
      )}

      <InviteLinkModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} organizationId={organizationId} />
    </div>
  )
}

function EmptyState({ hasFilters, onCreate, canInvite }: { hasFilters: boolean; onCreate: () => void; canInvite: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center justify-center py-16 text-center glass-card"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-full flex items-center justify-center mb-6 shadow-inner border-2 border-white dark:border-slate-800"
      >
        <span className="text-5xl drop-shadow-md">👥</span>
      </motion.div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        {hasFilters ? 'Aucun résultat' : 'Aucun membre pour l\'instant'}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xs font-medium">
        {hasFilters
          ? 'Aucun membre ne correspond à votre recherche.'
          : 'Envoyez une invitation pour ajouter un membre à l’organisation.'}
      </p>
      {!hasFilters && canInvite && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreate}
          className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-[0_8px_20px_rgba(5,150,105,0.3)] hover:shadow-[0_8px_25px_rgba(5,150,105,0.4)] transition-shadow"
        >
          Inviter un membre
        </motion.button>
      )}
    </motion.div>
  )
}
