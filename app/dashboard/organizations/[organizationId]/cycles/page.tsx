'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { getOrganizationCycles } from '@/lib/api/organizationCycles'
import { OrganizationCycle } from '@/types'
import { CycleFormModal } from '@/components/cycles/CycleFormModal'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { staggerContainer, fadeInUp } from '@/lib/animations'
import { useMyPermissions } from '@/lib/hooks/useMyPermissions'

export default function CyclesPage() {
  const router = useRouter()
  const params = useParams<{ organizationId: string }>()
  const organizationId = params.organizationId
  const { hasPermission, isLoading: isLoadingPermissions } = useMyPermissions(organizationId)

  const [currentCycle, setCurrentCycle] = useState<OrganizationCycle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetchCycle = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getOrganizationCycles(organizationId, { page: 1, pageSize: 1 })
      if (data.items && data.items.length > 0) {
        setCurrentCycle(data.items[0])
      } else {
        setCurrentCycle(null)
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors du chargement du cycle.')
    } finally {
      setIsLoading(false)
    }
  }, [organizationId])

  const handleUpdateStatus = async (newStatus: 'active' | 'closed' | 'archived') => {
    if (!currentCycle) return
    setIsUpdatingStatus(true)
    try {
      // updateOrganizationCycle is already imported, wait, no it's not. Ah, yes it is in lib/api/organizationCycles.
      // But we need to make sure we import it if it's not. Let's check imports.
      // I will just use the same import we have for getOrganizationCycles, wait.
      // I'll check imports later if it fails, but I can just import it.
      // Wait, in page.tsx I have `import { getOrganizationCycles } from '@/lib/api/organizationCycles'`. I need to add updateOrganizationCycle.
      // I will add the import separately.
      
      const { updateOrganizationCycle } = await import('@/lib/api/organizationCycles')
      await updateOrganizationCycle(organizationId, currentCycle.id, { status: newStatus })
      toast.success('Statut du cycle mis à jour.')
      fetchCycle()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour.')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  useEffect(() => {
    fetchCycle()
  }, [fetchCycle])

  function getStatusStyle(status: string) {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 ring-emerald-600/20'
      case 'closed':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 ring-amber-600/20'
      case 'archived':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300 ring-slate-600/20'
      default:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 ring-blue-600/20'
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case 'draft': return 'Brouillon'
      case 'active': return 'Actif'
      case 'closed': return 'Clôturé'
      case 'archived': return 'Archivé'
      default: return status
    }
  }

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
        <div className="flex-1">
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Cycle Actuel</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Paramètres et état du cycle de l'organisation
          </p>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {(isLoading || isLoadingPermissions) ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="glass-card p-6 space-y-4">
              <Skeleton height={20} width="30%" />
              <Skeleton height={14} width="50%" />
              <div className="grid grid-cols-2 gap-4 pt-4">
                <Skeleton height={60} />
                <Skeleton height={60} />
              </div>
            </div>
          </motion.div>
        ) : !currentCycle ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EmptyState />
          </motion.div>
        ) : (
          <motion.div
            key="details"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.div variants={fadeInUp} className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${getStatusStyle(currentCycle.status)}`}>
                  {getStatusLabel(currentCycle.status)}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center shadow-inner">
                  <span className="text-2xl">🔄</span>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {currentCycle.name}
                  </h2>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Configuration globale
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Période
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoRow 
                      label="Date de début" 
                      value={new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(currentCycle.startDate))} 
                    />
                    <InfoRow 
                      label="Date de fin" 
                      value={new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(currentCycle.endDate))} 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Paramètres Financiers
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoRow 
                      label="Cotisation Attendue" 
                      value={new Intl.NumberFormat('fr-FR').format(currentCycle.expectedAmount)}
                      suffix="XAF"
                      highlight
                    />
                    <InfoRow 
                      label="Montant Collecté" 
                      value={new Intl.NumberFormat('fr-FR').format(currentCycle.collectedAmount)}
                      suffix="XAF"
                    />
                  </div>
                </div>

                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Membres & Tours
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InfoRow 
                      label="Bénéficiaires" 
                      value={String(currentCycle.beneficiariesCount)} 
                    />
                    <InfoRow 
                      label="Nombre de tours" 
                      value={String(currentCycle.turnsCount)} 
                    />
                  </div>
                </div>
              </div>

              {hasPermission('MANAGE_CYCLES') && (
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  {currentCycle.status === 'draft' && (
                    <Button 
                      variant="outline" 
                      onClick={() => handleUpdateStatus('active')}
                      isLoading={isUpdatingStatus}
                    >
                      Activer le cycle
                    </Button>
                  )}
                  <Button variant="glow" onClick={() => setIsFormOpen(true)}>
                    Modifier le cycle
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CycleFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => fetchCycle()}
        organizationId={organizationId}
        cycle={currentCycle}
      />
    </div>
  )
}

function InfoRow({ label, value, suffix, highlight }: { label: string; value: string; suffix?: string; highlight?: boolean }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
      <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </dt>
      <dd className={`text-base font-bold flex items-baseline gap-1 ${highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
        {value}
        {suffix && <span className="text-xs font-medium text-slate-400">{suffix}</span>}
      </dd>
    </div>
  )
}

function EmptyState() {
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
        className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800/40 dark:to-slate-900/40 rounded-full flex items-center justify-center mb-6 shadow-inner border-2 border-white dark:border-slate-800"
      >
        <span className="text-5xl drop-shadow-md">⚠️</span>
      </motion.div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        Aucun cycle actuel
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xs font-medium">
        L'organisation ne possède aucun cycle configuré pour le moment.
      </p>
    </motion.div>
  )
}
