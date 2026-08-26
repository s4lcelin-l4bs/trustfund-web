const fs = require('fs')
const path = require('path')

const modules = [
  {
    name: 'contributions',
    entity: 'Contribution',
    pathName: 'contributions',
    fields: ['memberId', 'amount', 'date', 'status']
  },
  {
    name: 'expenses',
    entity: 'Expense',
    pathName: 'expenses',
    fields: ['categoryId', 'amount', 'date', 'status']
  },
  {
    name: 'penalties',
    entity: 'Penalty',
    pathName: 'penalties',
    fields: ['memberId', 'motif', 'amount', 'status']
  },
  {
    name: 'fines',
    entity: 'Fine',
    pathName: 'fines',
    fields: ['memberId', 'motif', 'amount', 'status']
  },
  {
    name: 'loans',
    entity: 'Loan',
    pathName: 'loans',
    fields: ['memberId', 'amountRequested', 'status']
  }
]

const baseDir = path.join(__dirname, 'components')
const appDir = path.join(__dirname, 'app', 'dashboard')

modules.forEach(mod => {
  const compDir = path.join(baseDir, mod.name)
  if (!fs.existsSync(compDir)) fs.mkdirSync(compDir, { recursive: true })

  const pageDir = path.join(appDir, mod.pathName)
  if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true })

  // Card Skeleton
  fs.writeFileSync(path.join(compDir, `${mod.entity}CardSkeleton.tsx`), `
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/Skeleton'

export function ${mod.entity}CardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-24 h-3" />
          </div>
        </div>
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-2/3 h-4" />
      </div>
    </motion.div>
  )
}

export function ${mod.entity}RowSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="glass-card p-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-32 h-4" />
      </div>
      <Skeleton className="w-24 h-4 hidden sm:block" />
      <Skeleton className="w-20 h-6 rounded-full" />
    </motion.div>
  )
}
  `.trim())

  // Form Modal
  fs.writeFileSync(path.join(compDir, `${mod.entity}FormModal.tsx`), `
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { create${mod.entity}, update${mod.entity} } from '@/lib/api/${mod.name}'
import { ${mod.entity} } from '@/types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { GlassModal } from '@/components/ui/GlassModal'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  ${mod.entity.toLowerCase()}?: ${mod.entity} | null
}

export function ${mod.entity}FormModal({ isOpen, onClose, onSuccess, ${mod.entity.toLowerCase()} }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    if (${mod.entity.toLowerCase()}) {
      setFormData(${mod.entity.toLowerCase()})
    } else {
      setFormData({})
    }
  }, [${mod.entity.toLowerCase()}])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (${mod.entity.toLowerCase()}?.id) {
        await update${mod.entity}(${mod.entity.toLowerCase()}.id, formData)
        toast.success('${mod.entity} modifiée avec succès')
      } else {
        await create${mod.entity}(formData as any)
        toast.success('${mod.entity} créée avec succès')
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title={${mod.entity.toLowerCase()} ? 'Modifier' : 'Nouveau'}>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        ${mod.fields.map(f => `
        <Input
          label="${f}"
          value={formData.${f} || ''}
          onChange={(e) => setFormData({ ...formData, ${f}: e.target.value })}
          required
        />`).join('')}
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>Annuler</Button>
          <Button type="submit" variant="glow" isLoading={isLoading}>Enregistrer</Button>
        </div>
      </form>
    </GlassModal>
  )
}
  `.trim())

  // Card
  fs.writeFileSync(path.join(compDir, `${mod.entity}Card.tsx`), `
import { motion } from 'framer-motion'
import { ${mod.entity} } from '@/types'
import { fadeInUp } from '@/lib/animations'

interface Props {
  ${mod.entity.toLowerCase()}: ${mod.entity}
  index: number
  onClick?: () => void
}

export function ${mod.entity}Card({ ${mod.entity.toLowerCase()}, index, onClick }: Props) {
  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      className="glass-card p-5 cursor-pointer hover:shadow-lg transition-all"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg">{${mod.entity.toLowerCase()}.${mod.fields[0]}}</h3>
        <span className="text-sm font-semibold">{${mod.entity.toLowerCase()}.${mod.fields[2] || 'status'}}</span>
      </div>
      <p className="text-slate-500 text-sm mt-2">{${mod.entity.toLowerCase()}.${mod.fields[1]} || 'Détails...'}</p>
    </motion.div>
  )
}
  `.trim())

  // Page
  fs.writeFileSync(path.join(pageDir, `page.tsx`), `
'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { get${mod.entity}s } from '@/lib/api/${mod.name}'
import { ${mod.entity}, PaginatedResult } from '@/types'
import { ${mod.entity}Card } from '@/components/${mod.name}/${mod.entity}Card'
import { ${mod.entity}CardSkeleton } from '@/components/${mod.name}/${mod.entity}CardSkeleton'
import { ${mod.entity}FormModal } from '@/components/${mod.name}/${mod.entity}FormModal'
import { Input } from '@/components/ui/Input'
import { Pagination } from '@/components/ui/Pagination'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { staggerContainer } from '@/lib/animations'

export default function ${mod.entity}sPage() {
  const [result, setResult] = useState<PaginatedResult<${mod.entity}> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  const debouncedSearch = useDebounce(search, 350)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await get${mod.entity}s({
        page,
        pageSize: 10,
        search: debouncedSearch || undefined,
      })
      setResult(data as any)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors du chargement.')
    } finally {
      setIsLoading(false)
    }
  }, [page, debouncedSearch])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const items = result?.items || []

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white capitalize">${mod.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-2 font-medium">
            Gérez vos ${mod.name.toLowerCase()}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
              <${mod.entity}CardSkeleton key={i} />
            ))}
          </motion.div>
        ) : items.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center text-slate-500">
            Aucun résultat.
          </motion.div>
        ) : (
          <motion.div
            key="list"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {items.map((item, index) => (
              <${mod.entity}Card key={item.id} ${mod.entity.toLowerCase()}={item} index={index} />
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
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl px-5 py-4 shadow-lg font-bold z-30"
        >
          Nouveau
        </motion.button>
      )}

      <${mod.entity}FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => fetchData()}
      />
    </div>
  )
}
  `.trim())
})

console.log('Scaffolding complete.')
