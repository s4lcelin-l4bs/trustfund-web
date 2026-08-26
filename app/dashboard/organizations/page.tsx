'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { getOrganizations } from '@/lib/api/organizations'
import { Organization, OrganizationStatus, PaginatedResult } from '@/types'
import { OrganizationCard } from '@/components/organizations/OrganizationCard'
import { OrganizationCardSkeleton } from '@/components/organizations/OrganizationCardSkeleton'
import { OrganizationFormModal } from '@/components/organizations/OrganizationFormModal'
import { Input } from '@/components/ui/Input'
import { Tabs } from '@/components/ui/Tabs'
import { Pagination } from '@/components/ui/Pagination'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { staggerContainer, fadeInUp } from '@/lib/animations'

const STATUS_TABS: { id: OrganizationStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'active', label: 'Actives' },
  { id: 'inactive', label: 'Inactives' },
  { id: 'archived', label: 'Archivées' },
]

const PAGE_SIZE = 9

export default function OrganizationsPage() {
  const [result, setResult] = useState<PaginatedResult<Organization> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<OrganizationStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const debouncedSearch = useDebounce(search, 350)

  const fetchOrganizations = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getOrganizations({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status,
      })
      setResult(data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors du chargement des organisations.')
    } finally {
      setIsLoading(false)
    }
  }, [page, debouncedSearch, status])

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, status])

  const organizations = result?.items || []

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Organisations</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-2 font-medium">
            Gérez les organisations de votre plateforme
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Rechercher une organisation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
              </svg>
            }
          />
        </div>
        <Tabs
          tabs={STATUS_TABS.map((t) => ({ id: t.id, label: t.label }))}
          activeId={status}
          onChange={(id) => setStatus(id as OrganizationStatus | 'all')}
          className="sm:w-auto"
        />
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <OrganizationCardSkeleton key={i} />
            ))}
          </motion.div>
        ) : organizations.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EmptyState
              hasFilters={Boolean(debouncedSearch) || status !== 'all'}
              onCreate={() => setIsFormOpen(true)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {organizations.map((organization, index) => (
              <OrganizationCard key={organization.id} organization={organization} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && result && result.totalPages > 1 && (
        <Pagination page={page} totalPages={result.totalPages} onChange={setPage} className="mt-8" />
      )}

      {!isLoading && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl px-5 py-4 shadow-[0_8px_32px_rgba(5,150,105,0.4)] flex items-center gap-2 font-bold text-sm z-30 border border-white/20 backdrop-blur-md"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Nouvelle organisation</span>
        </motion.button>
      )}

      <OrganizationFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => fetchOrganizations()}
      />
    </div>
  )
}

function EmptyState({ hasFilters, onCreate }: { hasFilters: boolean; onCreate: () => void }) {
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
        <span className="text-5xl drop-shadow-md">🏢</span>
      </motion.div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        {hasFilters ? 'Aucun résultat' : 'Aucune organisation pour l\'instant'}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xs font-medium">
        {hasFilters
          ? 'Aucune organisation ne correspond à votre recherche.'
          : 'Créez votre première organisation pour commencer.'}
      </p>
      {!hasFilters && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreate}
          className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-[0_8px_20px_rgba(5,150,105,0.3)] hover:shadow-[0_8px_25px_rgba(5,150,105,0.4)] transition-shadow"
        >
          Créer une organisation
        </motion.button>
      )}
    </motion.div>
  )
}
