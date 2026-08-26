import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { createLoan, updateLoan } from '@/lib/api/loans'
import { Loan } from '@/types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { GlassModal } from '@/components/ui/GlassModal'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  loan?: Loan | null
}

export function LoanFormModal({ isOpen, onClose, onSuccess, loan }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Loan>>({
    status: 'requested',
    interestRate: 0,
    durationMonths: 1
  })

  useEffect(() => {
    if (loan) {
      setFormData(loan)
    } else {
      setFormData({ status: 'requested', interestRate: 0, durationMonths: 1, requestDate: new Date().toISOString().split('T')[0] })
    }
  }, [loan, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (loan?.id) {
        await updateLoan(loan.id, formData as any)
        toast.success('Demande modifiée avec succès')
      } else {
        await createLoan(formData as any)
        toast.success('Demande enregistrée avec succès')
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
    <GlassModal isOpen={isOpen} onClose={onClose} title={loan ? 'Traiter la demande' : 'Demande de Prêt'}>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="ID Membre"
            value={formData.memberId || ''}
            onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
            required
            disabled={!!loan?.id}
          />
          <Input
            label="Montant Demandé (FCFA)"
            type="number"
            value={formData.amountRequested || ''}
            onChange={(e) => setFormData({ ...formData, amountRequested: Number(e.target.value) })}
            required
            disabled={!!loan?.id}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Durée (Mois)"
            type="number"
            value={formData.durationMonths || ''}
            onChange={(e) => setFormData({ ...formData, durationMonths: Number(e.target.value) })}
            required
          />
          <Input
            label="Taux d'intérêt (%)"
            type="number"
            step="0.1"
            value={formData.interestRate === undefined ? '' : formData.interestRate}
            onChange={(e) => setFormData({ ...formData, interestRate: Number(e.target.value) })}
            required
          />
        </div>

        {loan?.id && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-4 mt-6 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-sm uppercase text-slate-500">Traitement de la demande</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Montant Approuvé"
                type="number"
                value={formData.amountApproved || ''}
                onChange={(e) => setFormData({ ...formData, amountApproved: Number(e.target.value) })}
              />
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Statut</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow appearance-none"
                  required
                >
                  <option value="requested">Demandé</option>
                  <option value="approved">Approuvé</option>
                  <option value="rejected">Rejeté</option>
                  <option value="disbursed">Décaissé</option>
                  <option value="active">En cours</option>
                  <option value="completed">Remboursé</option>
                  <option value="defaulted">En défaut</option>
                </select>
              </div>
            </div>
            
            {(formData.status === 'approved' || formData.status === 'disbursed') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Date de validation"
                  type="date"
                  value={formData.validationDate ? formData.validationDate.split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, validationDate: e.target.value })}
                />
                <Input
                  label="Date de décaissement"
                  type="date"
                  value={formData.disbursementDate ? formData.disbursementDate.split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, disbursementDate: e.target.value })}
                />
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>Annuler</Button>
          <Button type="submit" variant="glow" isLoading={isLoading}>Enregistrer</Button>
        </div>
      </form>
    </GlassModal>
  )
}