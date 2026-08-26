'use client'

import { useCallback, useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { getContributions } from '@/lib/api/contributions'
import { verifyPayment } from '@/lib/api/payments'
import { Contribution, ContributionStatus, PaginatedResult } from '@/types'
import { ContributionCard } from '@/components/contributions/ContributionCard'
import { ContributionCardSkeleton } from '@/components/contributions/ContributionCardSkeleton'
import { PaymentCheckoutModal } from '@/components/contributions/PaymentCheckoutModal'
import { Input } from '@/components/ui/Input'
import { Tabs } from '@/components/ui/Tabs'
import { Pagination } from '@/components/ui/Pagination'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { staggerContainer } from '@/lib/animations'
import { useActiveOrganizationStore } from '@/store/useActiveOrganizationStore'
import { useMyPermissions } from '@/lib/hooks/useMyPermissions'

const STATUS_TABS: { id: ContributionStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'paid', label: 'Payées' },
  { id: 'pending', label: 'En attente' },
  { id: 'partial', label: 'Partielles' },
  { id: 'late', label: 'En retard' },
  { id: 'advance', label: 'En avance' },
]

const PAGE_SIZE = 9

function ContributionsPageContent() {
  const [result, setResult] = useState<PaginatedResult<Contribution> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ContributionStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  
  const [paymentContribution, setPaymentContribution] = useState<Contribution | null>(null)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)

  const { activeOrganizationId } = useActiveOrganizationStore()
  const { membership, isLoading: isLoadingMembership } = useMyPermissions(activeOrganizationId || undefined)

  const searchParams = useSearchParams()
  const router = useRouter()

  const debouncedSearch = useDebounce(search, 350)

  const fetchData = useCallback(async () => {
    if (!membership?.member) return;
    setIsLoading(true)
    try {
      const data = await getContributions({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status: status === 'all' ? undefined : status,
        memberId: membership.member.id
      })
      setResult(data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors du chargement.')
    } finally {
      setIsLoading(false)
    }
  }, [page, debouncedSearch, status, membership?.member])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [debouncedSearch, status])

  // Handle URL params for payment and verification
  useEffect(() => {
    const action = searchParams?.get('action')
    const contribId = searchParams?.get('contributionId')
    const ref = searchParams?.get('ref')

    if (action === 'pay' && contribId && result?.items) {
      const contrib = result.items.find(c => c.id === contribId)
      if (contrib) {
        setPaymentContribution(contrib)
        setIsPaymentOpen(true)
        // Clean URL to prevent reopening on refresh
        router.replace('/dashboard/contributions', { scroll: false })
      }
    }

    if (ref) {
      verifyPayment(ref)
        .then(() => {
          toast.success('Paiement confirmé avec succès !')
          fetchData()
        })
        .catch(() => {
          toast.error('Erreur lors de la vérification du paiement.')
        })
        .finally(() => {
          router.replace('/dashboard/contributions', { scroll: false })
        })
    }
  }, [searchParams, result?.items, router, fetchData])

  const items = result?.items || []

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Cotisations</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-2 font-medium">
            Suivi des paiements et échéances
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Rechercher par référence..."
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
          onChange={(id) => setStatus(id as ContributionStatus | 'all')}
          className="sm:w-auto"
        />
      </div>

      <AnimatePresence mode="wait">
        {isLoading || isLoadingMembership ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <ContributionCardSkeleton key={i} />)}
          </motion.div>
        ) : items.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center glass-card">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">💰</span>
            </div>
            <h3 className="font-bold text-lg">Aucune cotisation</h3>
            <p className="text-slate-500 mt-2 text-sm max-w-xs">
              {debouncedSearch || status !== 'all' ? 'Aucun résultat pour ces filtres.' : 'Les cotisations apparaîtront ici lorsqu\'un cycle sera activé.'}
            </p>
          </motion.div>
        ) : (
          <motion.div key="list" variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <ContributionCard
                key={item.id}
                contribution={item}
                index={index}
                onPay={() => { setPaymentContribution(item); setIsPaymentOpen(true); }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && result && result.totalPages > 1 && (
        <Pagination page={page} totalPages={result.totalPages} onChange={setPage} className="mt-8" />
      )}

      <PaymentCheckoutModal
        isOpen={isPaymentOpen}
        onClose={() => { setIsPaymentOpen(false); setPaymentContribution(null) }}
        contribution={paymentContribution}
      />
    </div>
  )
}

export default function ContributionsPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ContributionsPageContent />
    </Suspense>
  )
}