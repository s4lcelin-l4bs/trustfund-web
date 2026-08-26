'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/useAuthStore'
import { loginApi } from '@/lib/api/auth'
import { loginSchema, LoginFormData } from '@/lib/validations/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { fadeInUp, staggerContainer, shakeAnimation } from '@/lib/animations'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const { setUser } = useAuthStore()

  const [form, setForm] = useState<LoginFormData>({
    phoneNumber: '',
    password: '',
  })
  const [errors, setErrors] = useState<Partial<LoginFormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [shake, setShake] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  async function handleSubmit() {
    const result = loginSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Partial<LoginFormData> = {}
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof LoginFormData
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      setShake(true)
      setTimeout(() => setShake(false), 400)
      return
    }

    setIsLoading(true)
    try {
      const { user, token } = await loginApi(form.phoneNumber, form.password)
      setUser(user, token)
      toast.success(`Bienvenue, ${user.fullName.split(' ')[0]} 👋`)
      router.push(redirect || '/dashboard/organizations')
    } catch {
      toast.error('Numéro ou mot de passe incorrect.')
      setShake(true)
      setTimeout(() => setShake(false), 400)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      animate={shake ? shakeAnimation : {}}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="glass-card p-8 sm:p-10"
      >
        <motion.div variants={fadeInUp}>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Connexion</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Ravi de vous revoir 👋
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} className="flex flex-col gap-5 mt-8">
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

          <motion.div variants={fadeInUp} className="pt-2">
            <Button
              variant="glow"
              onClick={handleSubmit}
              isLoading={isLoading}
              className="w-full h-12 text-base"
            >
              Se connecter
            </Button>
          </motion.div>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          className="text-sm font-medium text-center text-slate-500 mt-6"
        >
          Pas encore de compte ?{' '}
          <Link href={redirect ? `/auth/register?redirect=${redirect}` : '/auth/register'} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
            S'inscrire
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  )
}