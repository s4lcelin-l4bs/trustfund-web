import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { createFine, updateFine } from '@/lib/api/fines'
import { Fine } from '@/types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { GlassModal } from '@/components/ui/GlassModal'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  fine?: Fine | null
}

export function FineFormModal({ isOpen, onClose, onSuccess, fine }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Fine>>({
    status: 'pending'
  })

  useEffect(() => {
    if (fine) {
      setFormData(fine)
    } else {
      setFormData({ status: 'pending' })
    }
  }, [fine, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (fine?.id) {
        await updateFine(fine.id, formData as any)
        toast.success('Amende modifiée avec succès')
      } else {
        await createFine(formData as any)
        toast.success('Amende enregistrée avec succès')
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
    <GlassModal isOpen={isOpen} onClose={onClose} title={fine ? 'Modifier l\'amende' : 'Nouvelle amende'}>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="ID Membre"
            value={formData.memberId || ''}
            onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
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

        <Input
          label="Motif de l'amende"
          value={formData.motif || ''}
          onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow appearance-none"
              required
            >
              <option value="pending">En attente</option>
              <option value="paid">Payée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>
          {formData.status === 'paid' && (
            <Input
              label="Date de paiement"
              type="date"
              value={formData.paymentDate ? formData.paymentDate.split('T')[0] : ''}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              required
            />
          )}
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>Annuler</Button>
          <Button type="submit" variant="glow" isLoading={isLoading}>Enregistrer</Button>
        </div>
      </form>
    </GlassModal>
  )
}