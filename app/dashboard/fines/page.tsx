'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { getFines, deleteFine } from '@/lib/api/fines'
import { Fine, FineStatus, PaginatedResult } from '@/types'
import { FineCard } from '@/components/fines/FineCard'
import { FineCardSkeleton } from '@/components/fines/FineCardSkeleton'
import { FineFormModal } from '@/components/fines/FineFormModal'
import { Input } from '@/components/ui/Input'
import { Tabs } from '@/components/ui/Tabs'
import { Pagination } from '@/components/ui/Pagination'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { staggerContainer } from '@/lib/animations'

const STATUS_TABS: { id: FineStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'pending', label: 'Non payées' },
  { id: 'paid', label: 'Payées' },
  { id: 'cancelled', label: 'Annulées' },
]

export default function FinesPage() {
  const [result, setResult] = useState<PaginatedResult<Fine> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<FineStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Fine | null>(null)
  const [deleting, setDeleting] = useState<Fine | null>(null)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const debouncedSearch = useDebounce(search, 350)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getFines({ page, pageSize: 9, search: debouncedSearch || undefined, status: status === 'all' ? undefined : status })
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
      await deleteFine(deleting.id)
      toast.success('Amende supprimée')
      setDeleting(null)
      fetchData()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur.')
    } finally {
      setIsDeleteLoading(false)
    }
  }

  const items = result?.items || []

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Amendes</h1>
          <p className="text-slate-500 text-base mt-2 font-medium">Suivi des amendes et infractions</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Tabs tabs={STATUS_TABS} activeId={status} onChange={(id) => setStatus(id as FineStatus | 'all')} />
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <FineCardSkeleton key={i} />)}
          </motion.div>
        ) : items.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center glass-card">
            <span className="text-5xl mb-4">🚫</span>
            <h3 className="font-bold text-lg">Aucune amende</h3>
            <p className="text-slate-500 mt-2 text-sm">{debouncedSearch || status !== 'all' ? 'Aucun résultat.' : 'Aucune amende enregistrée.'}</p>
          </motion.div>
        ) : (
          <motion.div key="list" variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, index) => (
              <FineCard key={item.id} fine={item} index={index} onClick={() => { setEditing(item); setIsFormOpen(true) }} onDelete={() => setDeleting(item)} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && result && result.totalPages > 1 && (
        <Pagination page={page} totalPages={result.totalPages} onChange={setPage} className="mt-8" />
      )}

      {!isLoading && (
        <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setEditing(null); setIsFormOpen(true) }} className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white rounded-2xl px-5 py-4 shadow-lg flex items-center gap-2 font-bold text-sm z-30">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          <span className="hidden sm:inline">Nouvelle amende</span>
        </motion.button>
      )}

      <FineFormModal isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditing(null) }} onSuccess={() => fetchData()} fine={editing} />
      <ConfirmDialog isOpen={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} variant="danger" title="Supprimer cette amende ?" description="Cette action est irréversible." confirmLabel="Supprimer" isLoading={isDeleteLoading} />
    </div>
  )
}