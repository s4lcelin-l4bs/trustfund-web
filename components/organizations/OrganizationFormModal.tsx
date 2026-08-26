'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { GlassModal } from '@/components/ui/GlassModal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Organization, CreateOrganizationInput, UpdateOrganizationInput } from '@/types'
import { createOrganization, updateOrganization } from '@/lib/api/organizations'

const CURRENCIES = ['XAF', 'XOF', 'EUR', 'USD', 'GBP', 'CAD']

interface OrganizationFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (organization: Organization) => void
  organization?: Organization | null
}

interface FormState {
  name: string
  description: string
  logoUrl: string
  currency: string
  country: string
  city: string
  // Cycle fields (only for creation)
  cycleName: string
  cycleFrequency: 'weekly' | 'monthly'
  cycleStartDate: string
  cycleEndDate: string
  cycleExpectedAmount: string
  cycleBeneficiariesCount: string
  cycleTurnsCount: string
}

function emptyForm(): FormState {
  const today = new Date().toISOString().slice(0, 10)
  return {
    name: '',
    description: '',
    logoUrl: '',
    currency: 'XAF',
    country: '',
    city: '',
    cycleName: '',
    cycleFrequency: 'monthly',
    cycleStartDate: today,
    cycleEndDate: today,
    cycleExpectedAmount: '',
    cycleBeneficiariesCount: '',
    cycleTurnsCount: '',
  }
}

export function OrganizationFormModal({
  isOpen,
  onClose,
  onSuccess,
  organization = null,
}: OrganizationFormModalProps) {
  const isEditing = Boolean(organization)
  const [form, setForm] = useState<FormState>(emptyForm())
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setForm(
        organization
          ? {
              ...emptyForm(), // populate defaults for cycle fields even if unused
              name: organization.name,
              description: organization.description || '',
              logoUrl: organization.logoUrl || '',
              currency: organization.currency,
              country: organization.country,
              city: organization.city,
            }
          : emptyForm()
      )
      setErrors({})
    }
  }, [isOpen, organization])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  function validate(): boolean {
    const newErrors: Partial<FormState> = {}
    if (!form.name.trim()) newErrors.name = 'Nom requis'
    if (!form.country.trim()) newErrors.country = 'Pays requis'
    if (!form.city.trim()) newErrors.city = 'Ville requise'
    if (!form.currency.trim()) newErrors.currency = 'Devise requise'

    if (!isEditing) {
      if (!form.cycleName.trim()) newErrors.cycleName = 'Nom du cycle requis'
      if (!form.cycleStartDate) newErrors.cycleStartDate = 'Date de début requise'
      if (!form.cycleEndDate) newErrors.cycleEndDate = 'Date de fin requise'
      if (form.cycleStartDate && form.cycleEndDate && form.cycleEndDate < form.cycleStartDate) {
        newErrors.cycleEndDate = 'Doit être après la date de début'
      }
      if (!form.cycleExpectedAmount || Number(form.cycleExpectedAmount) <= 0) newErrors.cycleExpectedAmount = 'Montant requis'
      if (!form.cycleBeneficiariesCount || Number(form.cycleBeneficiariesCount) <= 0) newErrors.cycleBeneficiariesCount = 'Requis'
      if (!form.cycleTurnsCount || Number(form.cycleTurnsCount) <= 0) newErrors.cycleTurnsCount = 'Requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setIsLoading(true)
    try {
      let result;
      if (isEditing && organization) {
        const payload: UpdateOrganizationInput = {
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          logoUrl: form.logoUrl.trim() || undefined,
          currency: form.currency,
          country: form.country.trim(),
          city: form.city.trim(),
        }
        result = await updateOrganization(organization.id, payload)
      } else {
        const payload: CreateOrganizationInput = {
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          logoUrl: form.logoUrl.trim() || undefined,
          currency: form.currency,
          country: form.country.trim(),
          city: form.city.trim(),
          cycleName: form.cycleName.trim(),
          cycleFrequency: form.cycleFrequency,
          cycleStartDate: new Date(form.cycleStartDate).toISOString(),
          cycleEndDate: new Date(form.cycleEndDate).toISOString(),
          cycleExpectedAmount: Number(form.cycleExpectedAmount),
          cycleBeneficiariesCount: Number(form.cycleBeneficiariesCount),
          cycleTurnsCount: Number(form.cycleTurnsCount),
        }
        result = await createOrganization(payload)
      }
      toast.success(isEditing ? 'Organisation mise à jour' : 'Organisation créée avec succès')
      onSuccess(result)
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement de l'organisation.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="p-6 max-h-[85vh] overflow-y-auto space-y-8">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {isEditing ? "Modifier l'organisation" : 'Nouvelle organisation'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            {isEditing ? 'Mettez à jour les informations' : 'Renseignez les informations de base et configurez le premier cycle'}
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-200 dark:border-slate-800 pb-2">
              Général
            </h3>
            
            <Input
              label="Nom de l'organisation"
              name="name"
              placeholder="Ex: Association des Commerçants"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Logo (URL)"
                name="logoUrl"
                placeholder="https://..."
                value={form.logoUrl}
                onChange={handleChange}
              />
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Devise</label>
                <select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-white/40 dark:border-white/10 text-sm outline-none focus:border-emerald-500 dark:focus:border-emerald-500/50 transition-colors bg-white/40 dark:bg-slate-900/40 backdrop-blur-md text-slate-900 dark:text-white shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)] appearance-none"
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency} value={currency} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                      {currency}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-9 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
              <textarea
                name="description"
                rows={2}
                placeholder="Brève description de l'organisation"
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-white/40 dark:border-white/10 text-sm outline-none focus:border-emerald-500 dark:focus:border-emerald-500/50 transition-colors bg-white/40 dark:bg-slate-900/40 backdrop-blur-md text-slate-900 dark:text-white shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Pays"
                name="country"
                placeholder="Cameroun"
                value={form.country}
                onChange={handleChange}
                error={errors.country}
              />
              <Input
                label="Ville"
                name="city"
                placeholder="Douala"
                value={form.city}
                onChange={handleChange}
                error={errors.city}
              />
            </div>
          </div>

          {!isEditing && (
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border-b border-slate-200 dark:border-slate-800 pb-2">
                Configuration du premier cycle
              </h3>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nom du 1er cycle <span className="text-red-500">*</span>
                </label>
                <Input
                  name="cycleName"
                  placeholder="Ex: Cycle 2026"
                  value={form.cycleName}
                  onChange={handleChange}
                  error={errors.cycleName}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Fréquence
                </label>
                <select
                  name="cycleFrequency"
                  value={form.cycleFrequency}
                  onChange={handleChange as any}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="monthly">Mensuel</option>
                  <option value="weekly">Hebdomadaire</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date de début"
                  name="cycleStartDate"
                  type="date"
                  value={form.cycleStartDate}
                  onChange={handleChange}
                  error={errors.cycleStartDate}
                />
                <Input
                  label="Date de fin"
                  name="cycleEndDate"
                  type="date"
                  value={form.cycleEndDate}
                  onChange={handleChange}
                  error={errors.cycleEndDate}
                />
              </div>

              <Input
                label="Montant attendu (Cotisation)"
                name="cycleExpectedAmount"
                type="number"
                placeholder="0"
                value={form.cycleExpectedAmount}
                onChange={handleChange}
                error={errors.cycleExpectedAmount}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nombre de bénéficiaires"
                  name="cycleBeneficiariesCount"
                  type="number"
                  placeholder="0"
                  value={form.cycleBeneficiariesCount}
                  onChange={handleChange}
                  error={errors.cycleBeneficiariesCount}
                />
                <Input
                  label="Nombre de tours"
                  name="cycleTurnsCount"
                  type="number"
                  placeholder="0"
                  value={form.cycleTurnsCount}
                  onChange={handleChange}
                  error={errors.cycleTurnsCount}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button variant="ghost" className="flex-1" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button variant="glow" className="flex-1" onClick={handleSubmit} isLoading={isLoading}>
            {isEditing ? 'Enregistrer les modifications' : "Créer l'organisation"}
          </Button>
        </div>
      </div>
    </GlassModal>
  )
}

