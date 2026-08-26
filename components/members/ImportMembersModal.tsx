'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { GlassModal } from '@/components/ui/GlassModal'
import { Button } from '@/components/ui/Button'
import { MemberImportResult } from '@/types'
import { importMembers } from '@/lib/api/organizationMembers'

interface ImportMembersModalProps {
  isOpen: boolean
  onClose: () => void
  onImported: () => void
  organizationId: string
}

export function ImportMembersModal({ isOpen, onClose, onImported, organizationId }: ImportMembersModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<MemberImportResult | null>(null)

  function handleClose() {
    setFile(null)
    setResult(null)
    onClose()
  }

  async function handleImport() {
    if (!file) return
    setIsLoading(true)
    try {
      const data = await importMembers(organizationId, file)
      setResult(data)
      if (data.importedCount > 0) onImported()
      if (data.failedCount === 0) toast.success(`${data.importedCount} membre(s) importé(s) avec succès`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de l'import du fichier.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GlassModal isOpen={isOpen} onClose={handleClose} className="max-w-md" showParticles={false}>
      <div className="p-6 space-y-5">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Importer des membres</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Fichier CSV ou Excel (.csv, .xlsx)
          </p>
        </div>

        {!result ? (
          <>
            <button
              onClick={() => inputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center gap-3 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors"
            >
              <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {file ? file.name : 'Cliquez pour choisir un fichier'}
              </span>
              <span className="text-xs text-slate-400">.csv, .xlsx — 5 Mo max</span>
              <input
                ref={inputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </button>

            <div className="flex gap-3 pt-2">
              <Button variant="ghost" className="flex-1" onClick={handleClose} disabled={isLoading}>
                Annuler
              </Button>
              <Button variant="glow" className="flex-1" onClick={handleImport} isLoading={isLoading} disabled={!file}>
                Importer
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="glass-card p-4 space-y-2 !bg-white/50">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Lignes lues</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{result.totalRows}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Membres importés</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{result.importedCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Échecs</span>
                <span className="font-bold text-red-500">{result.failedCount}</span>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="max-h-40 overflow-y-auto space-y-1.5">
                {result.errors.map((e, i) => (
                  <p key={i} className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                    Ligne {e.row} : {e.message}
                  </p>
                ))}
              </div>
            )}

            <Button variant="glow" className="w-full" onClick={handleClose}>
              Terminer
            </Button>
          </>
        )}
      </div>
    </GlassModal>
  )
}
