'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/useAuthStore'
import { Button } from '@/components/ui/Button'
import { staggerContainer, fadeInUp } from '@/lib/animations'

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  function handleLogout() {
    logout()
    toast.success('Deconnecte avec succes')
    router.push('/auth/login')
  }

  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-slate-900">Profil</h1>
        <p className="text-sm text-slate-500 mt-0.5">Vos informations personnelles</p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {/* Avatar + nom */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">{initials}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{user?.fullName}</h2>
          <p className="text-sm text-slate-500 mt-1">{user?.phoneNumber}</p>
          <div className="mt-3 bg-emerald-50 px-4 py-1.5 rounded-full">
            <p className="text-xs text-emerald-700 font-medium">Membre TrustFund</p>
          </div>
        </motion.div>

        {/* Infos */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-slate-50">
            <h3 className="font-semibold text-slate-800 text-sm">Informations du compte</h3>
          </div>
          <div className="divide-y divide-slate-50">
            <div className="flex justify-between items-center px-4 py-3">
              <span className="text-sm text-slate-500">Nom complet</span>
              <span className="text-sm font-medium text-slate-900">{user?.fullName}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3">
              <span className="text-sm text-slate-500">Telephone</span>
              <span className="text-sm font-medium text-slate-900">{user?.phoneNumber}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3">
              <span className="text-sm text-slate-500">Membre depuis</span>
              <span className="text-sm font-medium text-slate-900">
                {user?.createdAt
                  ? new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
                      .format(new Date(user.createdAt))
                  : '—'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Options */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-slate-50">
            <h3 className="font-semibold text-slate-800 text-sm">Parametres</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {[
              { label: 'Modifier le profil', icon: '✏️', action: () => toast.info('Disponible en vague 2') },
              { label: 'Changer le mot de passe', icon: '🔐', action: () => toast.info('Disponible en vague 2') },
              { label: 'Notifications', icon: '🔔', action: () => router.push('/dashboard/notifications') },
              { label: 'Aide & Support', icon: '💬', action: () => toast.info('Disponible en vague 2') },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm text-slate-700">{item.label}</span>
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Version */}
        <motion.div variants={fadeInUp} className="text-center">
          <p className="text-xs text-slate-400">TrustFund v1.0 — MVP Vague 1</p>
          <p className="text-xs text-slate-300 mt-0.5">Douala, Cameroun · 2026</p>
        </motion.div>

        {/* Deconnexion */}
        <motion.div variants={fadeInUp}>
          <Button
            variant="danger"
            className="w-full"
            onClick={handleLogout}
          >
            Se deconnecter
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
