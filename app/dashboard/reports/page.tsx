'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { exportReport } from '@/lib/api/reports'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { staggerContainer, fadeInUp } from '@/lib/animations'

const REPORT_TYPES = [
  { key: 'contributions', label: 'Cotisations', icon: '💰', description: 'Historique complet des cotisations par membre et par cycle' },
  { key: 'expenses', label: 'Dépenses', icon: '📉', description: 'Détail des dépenses par catégorie et par période' },
  { key: 'loans', label: 'Prêts', icon: '🤝', description: 'État du portefeuille de prêts et échéanciers' },
  { key: 'penalties', label: 'Pénalités & Amendes', icon: '⚠️', description: 'Récapitulatif des sanctions par membre' },
  { key: 'savings', label: 'Épargne', icon: '🏦', description: 'Soldes et mouvements des comptes d\'épargne' },
  { key: 'general', label: 'Rapport général', icon: '📊', description: 'Vue consolidée de toutes les activités' },
]

export default function ReportsPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loadingKey, setLoadingKey] = useState<string | null>(null)

  const handleExport = async (module: string, type: 'pdf' | 'excel' | 'csv') => {
    const key = `${module}-${type}`
    setLoadingKey(key)
    try {
      await exportReport({ type, module, startDate: startDate || undefined, endDate: endDate || undefined })
      toast.success(`Rapport ${type.toUpperCase()} — ${module} généré avec succès`)
    } catch {
      toast.error('Erreur lors de la génération du rapport')
    } finally {
      setLoadingKey(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Rapports</h1>
        <p className="text-slate-500 mt-1 font-medium">Générez et téléchargez vos rapports financiers</p>
      </div>

      <div className="glass-card p-5">
        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-4">Période de rapport</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Date de début" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input label="Date de fin" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORT_TYPES.map((report) => (
          <motion.div key={report.key} variants={fadeInUp} className="glass-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center text-2xl">
                {report.icon}
              </div>
              <div>
                <h3 className="font-bold">{report.label}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{report.description}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              {(['pdf', 'excel', 'csv'] as const).map((fmt) => (
                <button
                  key={fmt}
                  disabled={loadingKey === `${report.key}-${fmt}`}
                  onClick={() => handleExport(report.key, fmt)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                    fmt === 'pdf' ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' :
                    fmt === 'excel' ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' :
                    'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
                  } ${loadingKey === `${report.key}-${fmt}` ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {loadingKey === `${report.key}-${fmt}` ? '...' : fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
