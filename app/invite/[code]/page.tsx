'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/useAuthStore'
import { Button } from '@/components/ui/Button'
import { staggerContainer, fadeInUp, scaleIn } from '@/lib/animations'

interface InviteInfo {
  groupName: string
  managerName: string
  contributionAmount: number
  frequency: string
  memberCount: number
  maxMembers: number
}

const mockInvite: InviteInfo = {
  groupName: 'Tontine bureau IUT',
  managerName: 'Marie Tamba',
  contributionAmount: 50000,
  frequency: 'Mensuelle',
  memberCount: 12,
  maxMembers: 15,
}

function formatAmount(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n)
}

export default function InvitePage() {
  const router = useRouter()
  const params = useParams()
  const code = params.code as string
  const { isAuthenticated } = useAuthStore()

  const [invite, setInvite] = useState<InviteInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isJoining, setIsJoining] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      if (code === 'invalid') {
        setIsInvalid(true)
      } else {
        setInvite(mockInvite)
      }
      setIsLoading(false)
    }, 1000)
  }, [code])

  async function handleJoin() {
    if (!isAuthenticated) {
      toast.info('Connectez-vous d\'abord pour rejoindre ce groupe')
      router.push('/auth/login')
      return
    }

    setIsJoining(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success('Vous avez rejoint le groupe avec succes !')
      router.push('/dashboard/groups')
    } catch {
      toast.error('Erreur lors de la tentative de rejoindre le groupe.')
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
            Lien invalide ou expire
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Ce lien d\'invitation n\'existe pas ou a expire.
          </p>
          <Button onClick={() => router.push('/dashboard/groups')}>
            Retour a l\'accueil
          </Button>
        </motion.div>
      </div>
    )
  }

  const spotsLeft = invite.maxMembers - invite.memberCount

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
                <span className="text-3xl">🤝</span>
              </div>
              <p className="text-emerald-100 text-sm mb-1">Vous etes invite a rejoindre</p>
              <h1 className="text-xl font-bold text-white">{invite.groupName}</h1>
            </div>

            {/* Infos du groupe */}
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500">Gere par</span>
                <span className="text-sm font-medium text-slate-900">{invite.managerName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500">Cotisation</span>
                <span className="text-sm font-medium text-slate-900">
                  {formatAmount(invite.contributionAmount)} FCFA / {invite.frequency === 'Mensuelle' ? 'mois' : 'sem.'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500">Membres</span>
                <span className="text-sm font-medium text-slate-900">
                  {invite.memberCount} / {invite.maxMembers}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-500">Places restantes</span>
                <span className={
                  'text-sm font-bold ' +
                  (spotsLeft <= 2 ? 'text-orange-600' : 'text-emerald-600')
                }>
                  {spotsLeft} place{spotsLeft > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Regle */}
          <motion.div
            variants={fadeInUp}
            className="bg-amber-50 border border-amber-100 rounded-xl p-4"
          >
            <p className="text-xs text-amber-700 font-medium mb-1">⚠️ Avant de rejoindre</p>
            <p className="text-xs text-amber-600">
              En rejoignant ce groupe, vous vous engagez a cotiser{' '}
              <strong>{formatAmount(invite.contributionAmount)} FCFA</strong> par{' '}
              {invite.frequency === 'Mensuelle' ? 'mois' : 'semaine'}, sans interruption,
              jusqu\'a la fin du cycle.
            </p>
          </motion.div>

          {/* Boutons */}
          <motion.div variants={fadeInUp} className="space-y-3">
            <Button
              onClick={handleJoin}
              isLoading={isJoining}
              className="w-full"
              size="lg"
            >
              {isAuthenticated ? 'Rejoindre ce groupe' : 'Se connecter pour rejoindre'}
            </Button>
            <button
              onClick={() => router.push('/dashboard/groups')}
              className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors py-2"
            >
              Decliner l\'invitation
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
