import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { createExpense, updateExpense } from '@/lib/api/expenses'
import { Expense } from '@/types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { GlassModal } from '@/components/ui/GlassModal'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  expense?: Expense | null
}

export function ExpenseFormModal({ isOpen, onClose, onSuccess, expense }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Expense>>({
    status: 'pending',
  })

  useEffect(() => {
    if (expense) {
      setFormData(expense)
    } else {
      setFormData({ status: 'pending' })
    }
  }, [expense, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (expense?.id) {
        await updateExpense(expense.id, formData as any)
        toast.success('Dépense modifiée avec succès')
      } else {
        await createExpense(formData as any)
        toast.success('Dépense enregistrée avec succès')
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
    <GlassModal isOpen={isOpen} onClose={onClose} title={expense ? 'Modifier la dépense' : 'Nouvelle dépense'}>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Catégorie (ID)"
            value={formData.categoryId || ''}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            required
          />
          <Input
            label="Montant (FCFA)"
            type="number"
            value={formData.amount || ''}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            value={formData.date || ''}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow appearance-none"
              required
            >
              <option value="pending">En attente</option>
              <option value="approved">Approuvée</option>
              <option value="paid">Payée</option>
              <option value="rejected">Rejetée</option>
            </select>
          </div>
        </div>

        <Input
          label="Description détaillée"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        
        <Input
          label="Lien du justificatif"
          value={formData.receiptUrl || ''}
          onChange={(e) => setFormData({ ...formData, receiptUrl: e.target.value })}
        />

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>Annuler</Button>
          <Button type="submit" variant="glow" isLoading={isLoading}>Enregistrer</Button>
        </div>
      </form>
    </GlassModal>
  )
}