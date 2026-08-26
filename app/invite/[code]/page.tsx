'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/useAuthStore'
import { Button } from '@/components/ui/Button'
import { staggerContainer, fadeInUp, scaleIn } from '@/lib/animations'
import { joinOrganization, getInviteInfo, type InviteInfo } from '@/lib/api/invitations'

export default function InvitePage() {
  const router = useRouter()
  const params = useParams()
  const code = params.code as string
  const { isAuthenticated, _hasHydrated } = useAuthStore()

  const [invite, setInvite] = useState<InviteInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isJoining, setIsJoining] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)

  useEffect(() => {
    if (!_hasHydrated) return

    if (!isAuthenticated) {
      toast.info('Connectez-vous d\'abord pour rejoindre cette organisation')
      router.push(`/auth/login?redirect=/invite/${code}`)
      return
    }

    async function fetchInvite() {
      try {
        const data = await getInviteInfo(code)
        setInvite(data)
      } catch {
        setIsInvalid(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchInvite()
  }, [code, isAuthenticated, _hasHydrated, router])

  async function handleJoin() {
    if (!isAuthenticated) {
      toast.info('Connectez-vous d\'abord pour rejoindre cette organisation')
      router.push(`/auth/login?redirect=/invite/${code}`)
      return
    }

    setIsJoining(true)
    try {
      await joinOrganization(code)
      toast.success('Vous avez rejoint l\'organisation avec succès !')
      router.push('/dashboard/organizations')
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erreur lors de la tentative de rejoindre l\'organisation.'
      toast.error(msg)
    } finally {
      setIsJoining(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-600 rounded-full"
        />
      </div>
    )
  }

  if (isInvalid || !invite) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-6xl mb-4 block">❌</span>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Lien invalide ou expiré
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Ce lien d&apos;invitation n&apos;existe pas ou a expiré.
          </p>
          <Button onClick={() => router.push('/dashboard/organizations')}>
            Retour à l&apos;accueil
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">T</span>
          </div>
          <span className="font-bold text-slate-900">TrustFund</span>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {/* Card principale */}
          <motion.div
            variants={scaleIn}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            {/* Header vert */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🏛️</span>
              </div>
              <p className="text-emerald-100 text-sm mb-1">Vous êtes invité(e) à rejoindre</p>
              <h1 className="text-xl font-bold text-white">{invite.organizationName}</h1>
            </div>

            {/* Infos de l'organisation */}
            <div className="p-5 space-y-3">
              {invite.description && (
                <div className="py-2 border-b border-slate-50">
                  <p className="text-sm text-slate-600 italic">{invite.description}</p>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500">Devise</span>
                <span className="text-sm font-medium text-slate-900">{invite.currency}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-500">Membres actuels</span>
                <span className="text-sm font-medium text-slate-900">{invite.memberCount}</span>
              </div>
            </div>
          </motion.div>

          {/* Boutons */}
          <motion.div variants={fadeInUp} className="space-y-3">
            <Button
              onClick={handleJoin}
              isLoading={isJoining}
              className="w-full"
              size="lg"
            >
              {isAuthenticated ? 'Rejoindre cette organisation' : 'Se connecter pour rejoindre'}
            </Button>
            <button
              onClick={() => router.push('/dashboard/organizations')}
              className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors py-2"
            >
              Décliner l&apos;invitation
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
