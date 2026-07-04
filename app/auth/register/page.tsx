'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/useAuthStore'
import { registerApi } from '@/lib/api/auth'
import { registerSchema, RegisterFormData } from '@/lib/validations/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { fadeInUp, staggerContainer, shakeAnimation } from '@/lib/animations'

export default function RegisterPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()

  const [form, setForm] = useState<RegisterFormData>({
    fullName: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [shake, setShake] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  async function handleSubmit() {
  const result = registerSchema.safeParse(form)
  if (!result.success) {
    const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {}
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof RegisterFormData
      if (!fieldErrors[field]) fieldErrors[field] = issue.message
    })
    setErrors(fieldErrors)
    setShake(true)
    setTimeout(() => setShake(false), 400)
    return
  }

  setIsLoading(true)
  try {
    const { user, token } = await registerApi(
      form.fullName,
      form.phoneNumber,
      form.password
    )
    setUser(user, token)
    toast.success('Compte créé avec succès 🎉')
    router.push('/dashboard/groups')
  } catch {
    toast.error('Une erreur est survenue. Réessaie.')
    setShake(true)
    setTimeout(() => setShake(false), 400)
  } finally {
    setIsLoading(false)
  }
}

  return (
    <motion.div animate={shake ? shakeAnimation : {}}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
      >
        <motion.div variants={fadeInUp}>
          <h2 className="text-lg font-semibold text-slate-900">Créer un compte</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Rejoignez TrustFund gratuitement
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} className="flex flex-col gap-4 mt-5">
          <motion.div variants={fadeInUp}>
            <Input label="Nom complet" name="fullName" placeholder="Jean Dupont"
              value={form.fullName} onChange={handleChange} error={errors.fullName} />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Input label="Numéro de téléphone" name="phoneNumber" type="tel"
              placeholder="6XXXXXXXX" value={form.phoneNumber}
              onChange={handleChange} error={errors.phoneNumber} />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Input label="Mot de passe" name="password" type="password"
              placeholder="••••••••" value={form.password}
              onChange={handleChange} error={errors.password} />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Input label="Confirmer le mot de passe" name="confirmPassword"
              type="password" placeholder="••••••••"
              value={form.confirmPassword} onChange={handleChange}
              error={errors.confirmPassword} />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Button onClick={handleSubmit} isLoading={isLoading} className="w-full">
              Créer mon compte
            </Button>
          </motion.div>
        </motion.div>

        <motion.p variants={fadeInUp} className="text-sm text-center text-slate-500 mt-4">
          Déjà un compte ?{' '}
          <Link href="/auth/login" className="text-emerald-600 font-medium hover:underline">
            Se connecter
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  )
}