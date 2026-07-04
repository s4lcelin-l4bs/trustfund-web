'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
      result.error.errors.forEach((err) => {
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
      router.push('/dashboard/groups')
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
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
      >
        <motion.div variants={fadeInUp}>
          <h2 className="text-lg font-semibold text-slate-900">Connexion</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Content de vous revoir 👋
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} className="flex flex-col gap-4 mt-5">
          <motion.div variants={fadeInUp}>
            <Input
              label="Numéro de téléphone"
              name="phoneNumber"
              type="tel"
              placeholder="6XXXXXXXX"
              value={form.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
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
            />
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Button
              onClick={handleSubmit}
              isLoading={isLoading}
              className="w-full"
            >
              Se connecter
            </Button>
          </motion.div>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          className="text-sm text-center text-slate-500 mt-4"
        >
          Pas encore de compte ?{' '}
          <Link href="/auth/register" className="text-emerald-600 font-medium hover:underline">
            S'inscrire
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  )
}