'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { staggerContainer, fadeInUp } from '@/lib/animations'

type Frequency = 'weekly' | 'monthly'
type TurnOrderMode = 'manual' | 'random' | 'seniority'

interface CreateGroupForm {
  name: string
  contributionAmount: string
  frequency: Frequency
  maxMembers: string
  turnOrderMode: TurnOrderMode
  penaltyAmount: string
  penaltyGraceDays: string
}

export default function NewGroupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState<CreateGroupForm>({
    name: '',
    contributionAmount: '',
    frequency: 'monthly',
    maxMembers: '',
    turnOrderMode: 'random',
    penaltyAmount: '0',
    penaltyGraceDays: '3',
  })
  const [errors, setErrors] = useState<Partial<CreateGroupForm>>({})

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  function validate(): boolean {
    const newErrors: Partial<CreateGroupForm> = {}
    if (!form.name.trim()) newErrors.name = 'Nom requis'
    if (!form.contributionAmount || Number(form.contributionAmount) <= 0)
      newErrors.contributionAmount = 'Montant invalide'
    if (!form.maxMembers || Number(form.maxMembers) < 2)
      newErrors.maxMembers = 'Minimum 2 membres'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return false
    }
    return true
  }

  async function handleSubmit() {
    if (!validate()) return
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      toast.success('Groupe cree avec succes !')
      router.push('/dashboard/groups')
    } catch {
      toast.error('Erreur lors de la creation du groupe.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Creer un groupe</h1>
          <p className="text-sm text-slate-500">Configurez votre tontine</p>
        </div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {/* Infos de base */}
        <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">
            Informations de base
          </h2>
          <Input
            label="Nom du groupe"
            name="name"
            placeholder="Ex: Tontine bureau IUT"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />
          <Input
            label="Montant de cotisation (FCFA)"
            name="contributionAmount"
            type="number"
            placeholder="50000"
            value={form.contributionAmount}
            onChange={handleChange}
            error={errors.contributionAmount}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Frequence</label>
            <select
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500 transition-colors bg-white"
            >
              <option value="monthly">Mensuelle</option>
              <option value="weekly">Hebdomadaire</option>
            </select>
          </div>
          <Input
            label="Nombre de membres maximum"
            name="maxMembers"
            type="number"
            placeholder="15"
            value={form.maxMembers}
            onChange={handleChange}
            error={errors.maxMembers}
          />
        </motion.div>

        {/* Ordre de passage */}
        <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">
            Ordre de passage
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {([
              { value: 'random', label: 'Tirage', icon: '🎲' },
              { value: 'manual', label: 'Manuel', icon: '✍️' },
              { value: 'seniority', label: 'Anciennete', icon: '📅' },
            ] as { value: TurnOrderMode; label: string; icon: string }[]).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setForm({ ...form, turnOrderMode: opt.value })}
                className={
                  'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-sm font-medium ' +
                  (form.turnOrderMode === opt.value
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-100 text-slate-600 hover:border-slate-200')
                }
              >
                <span className="text-xl">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Penalites */}
        <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">
            Penalites de retard
          </h2>
          <Input
            label="Montant de penalite (FCFA)"
            name="penaltyAmount"
            type="number"
            placeholder="0"
            value={form.penaltyAmount}
            onChange={handleChange}
          />
          <Input
            label="Grace apres echeance (jours)"
            name="penaltyGraceDays"
            type="number"
            placeholder="3"
            value={form.penaltyGraceDays}
            onChange={handleChange}
          />
        </motion.div>

        {/* Bouton */}
        <motion.div variants={fadeInUp}>
          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            Creer le groupe
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
