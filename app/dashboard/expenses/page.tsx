'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { getExpenses, deleteExpense } from '@/lib/api/expenses'
import { Expense, ExpenseStatus, PaginatedResult } from '@/types'
import { ExpenseCard } from '@/components/expenses/ExpenseCard'
import { ExpenseCardSkeleton } from '@/components/expenses/ExpenseCardSkeleton'
import { ExpenseFormModal } from '@/components/expenses/ExpenseFormModal'
import { Input } from '@/components/ui/Input'
import { Tabs } from '@/components/ui/Tabs'
import { Pagination } from '@/components/ui/Pagination'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { staggerContainer } from '@/lib/animations'

const STATUS_TABS: { id: ExpenseStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'pending', label: 'En attente' },
  { id: 'approved', label: 'Approuvées' },
  { id: 'paid', label: 'Payées' },
  { id: 'rejected', label: 'Rejetées' },
]

const PAGE_SIZE = 9

export default function ExpensesPage() {
  const [result, setResult] = useState<PaginatedResult<Expense> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ExpenseStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Expense | null>(null)
  const [deleting, setDeleting] = useState<Expense | null>(null)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  const debouncedSearch = useDebounce(search, 350)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getExpenses({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status: status === 'all' ? undefined : status,
      })
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
      await deleteExpense(deleting.id)
      toast.success('Dépense supprimée')
      setDeleting(null)
      fetchData()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression.')
    } finally {
      setIsDeleteLoading(false)
    }
  }

  const items = result?.items || []

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Dépenses</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-2 font-medium">
            Gestion et suivi des décaissements
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Rechercher une dépense..."
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
          onChange={(id) => setStatus(id as ExpenseStatus | 'all')}
          className="sm:w-auto"
        />
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <ExpenseCardSkeleton key={i} />)}
          </motion.div>
        ) : items.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center glass-card">
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">📉</span>
            </div>
            <h3 className="font-bold text-lg">Aucune dépense</h3>
            <p className="text-slate-500 mt-2 text-sm max-w-xs">
              {debouncedSearch || status !== 'all' ? 'Aucun résultat pour ces filtres.' : 'Enregistrez la première dépense.'}
            </p>
            {!debouncedSearch && status === 'all' && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setEditing(null); setIsFormOpen(true) }} className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-bold text-sm">
                Ajouter une dépense
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div key="list" variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <ExpenseCard
                key={item.id}
                expense={item}
                index={index}
                onClick={() => { setEditing(item); setIsFormOpen(true) }}
                onDelete={() => setDeleting(item)}
              />
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
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setEditing(null); setIsFormOpen(true) }}
          className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl px-5 py-4 shadow-[0_8px_32px_rgba(249,115,22,0.4)] flex items-center gap-2 font-bold text-sm z-30 border border-white/20"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Nouvelle dépense</span>
        </motion.button>
      )}

      <ExpenseFormModal
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditing(null) }}
        onSuccess={() => fetchData()}
        expense={editing}
      />

      <ConfirmDialog
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        variant="danger"
        title="Supprimer cette dépense ?"
        description="Cette action est irréversible."
        confirmLabel="Supprimer"
        isLoading={isDeleteLoading}
      />
    </div>
  )
}