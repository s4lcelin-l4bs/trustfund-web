'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { GlassModal } from '@/components/ui/GlassModal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { OrganizationCycle, UpdateOrganizationCycleInput } from '@/types'
import { updateOrganizationCycle } from '@/lib/api/organizationCycles'

interface CycleFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (cycle: OrganizationCycle) => void
  organizationId: string
  cycle: OrganizationCycle | null
}

interface FormState {
  name: string
  startDate: string
  endDate: string
  expectedAmount: string
  frequency: 'weekly' | 'monthly'
}

function emptyForm(): FormState {
  const today = new Date().toISOString().slice(0, 10)
  return { name: '', startDate: today, endDate: today, expectedAmount: '', frequency: 'monthly' as const }
}

export function CycleFormModal({
  isOpen,
  onClose,
  onSuccess,
  organizationId,
  cycle,
}: CycleFormModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm())
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && cycle) {
      setForm({
        name: cycle.name,
        startDate: cycle.startDate.slice(0, 10),
        endDate: cycle.endDate.slice(0, 10),
        expectedAmount: String(cycle.expectedAmount),
        frequency: cycle.frequency || 'monthly',
      })
      setErrors({})
    }
  }, [isOpen, cycle])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  function validate(): boolean {
    const newErrors: Partial<FormState> = {}
    if (!form.name.trim()) newErrors.name = 'Nom requis'
    if (!form.startDate) newErrors.startDate = 'Date de début requise'
    if (!form.endDate) newErrors.endDate = 'Date de fin requise'
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      newErrors.endDate = 'Doit être après la date de début'
    }
    if (!form.expectedAmount || Number(form.expectedAmount) <= 0) newErrors.expectedAmount = 'Montant requis'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validate() || !cycle) return
    setIsLoading(true)
    try {
      const payload: UpdateOrganizationCycleInput = {
        name: form.name.trim(),
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        expectedAmount: Number(form.expectedAmount),
        frequency: form.frequency,
      }
      const result = await updateOrganizationCycle(organizationId, cycle.id, payload)
      toast.success('Paramètres du cycle mis à jour')
      onSuccess(result)
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de la modification du cycle.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!cycle) return null

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <div className="p-6 max-h-[85vh] overflow-y-auto space-y-5">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Modifier le cycle
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Mettez à jour les paramètres de votre cycle actuel
          </p>
        </div>

        <div className="space-y-4">
          <Input 
            label="Nom du cycle" 
            name="name" 
            placeholder="Ex: Cycle 2026 - T1" 
            value={form.name} 
            onChange={handleChange} 
            error={errors.name} 
          />

          <div className="grid grid-cols-2 gap-3">
            <Input 
              label="Date de début" 
              name="startDate" 
              type="date" 
              value={form.startDate} 
              onChange={handleChange} 
              error={errors.startDate} 
            />
            <Input 
              label="Date de fin" 
              name="endDate" 
              type="date" 
              value={form.endDate} 
              onChange={handleChange} 
              error={errors.endDate} 
            />
          </div>

          <Input
            label="Montant attendu (Cotisation)"
            name="expectedAmount"
            type="number"
            placeholder="0"
            value={form.expectedAmount}
            onChange={handleChange}
            error={errors.expectedAmount}
          />

          {/* Frequency selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Fréquence
            </label>
            <select
              name="frequency"
              value={form.frequency}
              onChange={handleChange as any}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="monthly">Mensuel</option>
              <option value="weekly">Hebdomadaire</option>
            </select>
          </div>

          {/* Readonly fields to inform the user of unchangeable configuration */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nombre de bénéficiaires"
              name="beneficiariesCount"
              type="number"
              value={cycle.beneficiariesCount}
              onChange={() => {}}
              disabled
              className="opacity-60 cursor-not-allowed"
            />
            <Input
              label="Nombre de tours"
              name="turnsCount"
              type="number"
              value={cycle.turnsCount}
              onChange={() => {}}
              disabled
              className="opacity-60 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" className="flex-1" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button variant="glow" className="flex-1" onClick={handleSubmit} isLoading={isLoading}>
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </GlassModal>
  )
}
