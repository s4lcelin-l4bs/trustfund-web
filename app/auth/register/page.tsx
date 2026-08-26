'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
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
      router.push(redirect || '/dashboard')
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
        className="glass-card p-8 sm:p-10"
      >
        <motion.div variants={fadeInUp}>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Créer un compte</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Rejoignez TrustFund gratuitement
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} className="flex flex-col gap-5 mt-8">
          <motion.div variants={fadeInUp}>
            <Input 
              label="Nom complet" 
              name="fullName" 
              placeholder="Jean Dupont"
              value={form.fullName} 
              onChange={handleChange} 
              error={errors.fullName}
              leftIcon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Input 
              label="Numéro de téléphone" 
              name="phoneNumber" 
              type="tel"
              placeholder="6XXXXXXXX" 
              value={form.phoneNumber}
              onChange={handleChange} 
              error={errors.phoneNumber}
              leftIcon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              }
            />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Input 
              label="Mot de passe" 
              name="password" 
              type="password"
              placeholder="••••••••" 
              value={form.password}
              onChange={handleChange} 
              error={errors.password}
              leftIcon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Input 
              label="Confirmer le mot de passe" 
              name="confirmPassword"
              type="password" 
              placeholder="••••••••"
              value={form.confirmPassword} 
              onChange={handleChange}
              error={errors.confirmPassword}
              leftIcon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </motion.div>
          <motion.div variants={fadeInUp} className="pt-2">
            <Button 
              variant="glow"
              onClick={handleSubmit} 
              isLoading={isLoading} 
              className="w-full h-12 text-base"
            >
              Créer mon compte
            </Button>
          </motion.div>
        </motion.div>

        <motion.p variants={fadeInUp} className="text-sm font-medium text-center text-slate-500 mt-6">
          Déjà un compte ?{' '}
          <Link href={redirect ? `/auth/login?redirect=${redirect}` : '/auth/login'} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
            Se connecter
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  )
}