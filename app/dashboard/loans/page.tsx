'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { getLoans, deleteLoan, disburseLoan } from '@/lib/api/loans'
import { Loan, LoanStatus, PaginatedResult } from '@/types'
import { LoanCard } from '@/components/loans/LoanCard'
import { LoanCardSkeleton } from '@/components/loans/LoanCardSkeleton'
import { LoanFormModal } from '@/components/loans/LoanFormModal'
import { Input } from '@/components/ui/Input'
import { Tabs } from '@/components/ui/Tabs'
import { Pagination } from '@/components/ui/Pagination'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { staggerContainer } from '@/lib/animations'

const STATUS_TABS: { id: LoanStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'requested', label: 'Demandés' },
  { id: 'approved', label: 'Approuvés' },
  { id: 'disbursed', label: 'Décaissés' },
  { id: 'active', label: 'En cours' },
  { id: 'completed', label: 'Remboursés' },
]

export default function LoansPage() {
  const [result, setResult] = useState<PaginatedResult<Loan> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<LoanStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Loan | null>(null)
  const [deleting, setDeleting] = useState<Loan | null>(null)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [disbursing, setDisbursing] = useState<Loan | null>(null)
  const [isDisburseLoading, setIsDisburseLoading] = useState(false)
  const debouncedSearch = useDebounce(search, 350)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getLoans({ page, pageSize: 9, search: debouncedSearch || undefined, status: status === 'all' ? undefined : status })
      setResult(data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors du chargement.')
    } finally {
      setIsLoading(false)
    }
  }, [page, debouncedSearch, status])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [debouncedSearch, status])

  const handleDelete = async () => {
    if (!deleting) return
    setIsDeleteLoading(true)
    try {
      await deleteLoan(deleting.id)
      toast.success('Prêt supprimé')
      setDeleting(null)
      fetchData()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur.')
    } finally {
      setIsDeleteLoading(false)
    }
  }

  const handleDisburse = async () => {
    if (!disbursing) return
    setIsDisburseLoading(true)
    try {
      await disburseLoan(disbursing.id)
      toast.success('Fonds décaissés avec succès')
      setDisbursing(null)
      fetchData()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Impossible de décaisser.')
    } finally {
      setIsDisburseLoading(false)
    }
  }

  const items = result?.items || []

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Prêts</h1>
          <p className="text-slate-500 text-base mt-2 font-medium">Demandes, validations et remboursements</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Tabs tabs={STATUS_TABS} activeId={status} onChange={(id) => setStatus(id as LoanStatus | 'all')} />
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <LoanCardSkeleton key={i} />)}
          </motion.div>
        ) : items.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center glass-card">
            <span className="text-5xl mb-4">🤝</span>
            <h3 className="font-bold text-lg">Aucun prêt</h3>
            <p className="text-slate-500 mt-2 text-sm">{debouncedSearch || status !== 'all' ? 'Aucun résultat.' : 'Enregistrez la première demande de prêt.'}</p>
          </motion.div>
        ) : (
          <motion.div key="list" variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <LoanCard key={item.id} loan={item} index={index} onClick={() => { setEditing(item); setIsFormOpen(true) }} onDelete={() => setDeleting(item)} onDisburse={item.status === 'approved' ? () => setDisbursing(item) : undefined} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && result && result.totalPages > 1 && (
        <Pagination page={page} totalPages={result.totalPages} onChange={setPage} className="mt-8" />
      )}

      {!isLoading && (
        <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setEditing(null); setIsFormOpen(true) }} className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-2xl px-5 py-4 shadow-lg flex items-center gap-2 font-bold text-sm z-30">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          <span className="hidden sm:inline">Nouvelle demande</span>
        </motion.button>
      )}

      <LoanFormModal isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditing(null) }} onSuccess={() => fetchData()} loan={editing} />
      <ConfirmDialog isOpen={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} variant="danger" title="Supprimer ce prêt ?" description="Cette action est irréversible." confirmLabel="Supprimer" isLoading={isDeleteLoading} />
      <ConfirmDialog isOpen={!!disbursing} onClose={() => setDisbursing(null)} onConfirm={handleDisburse} variant="primary" title="Décaisser les fonds ?" description={`Un montant de ${disbursing?.amountApproved || disbursing?.amountRequested} XAF sera transféré et une transaction sera enregistrée.`} confirmLabel="Confirmer le décaissement" isLoading={isDisburseLoading} />
    </div>
  )
}