'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/useAuthStore'
import { updateProfile } from '@/lib/api/profile'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { staggerContainer, fadeInUp } from '@/lib/animations'

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, updateUser } = useAuthStore()

  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '')
  const [isSaving, setIsSaving] = useState(false)

  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'

  function handleLogout() {
    logout()
    toast.success('Déconnecté avec succès')
    router.push('/auth/login')
  }

  function handleEditOpen() {
    setFullName(user?.fullName || '')
    setAvatarUrl(user?.avatarUrl || '')
    setIsEditing(true)
  }

  function handleEditCancel() {
    setIsEditing(false)
  }

  async function handleSave() {
    if (!fullName.trim()) {
      toast.error('Le nom complet est requis')
      return
    }
    setIsSaving(true)
    try {
      const updated = await updateProfile({
        fullName: fullName.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
      })
      updateUser(updated)
      toast.success('Profil mis à jour')
      setIsEditing(false)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Erreur lors de la mise à jour')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Profil</h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Vos informations personnelles</p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-4 max-w-lg mx-auto sm:max-w-none"
      >
        {/* Avatar + nom */}
        <motion.div
          variants={fadeInUp}
          className="glass-card p-6 flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 dark:bg-emerald-400/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-400/10 dark:bg-teal-400/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="relative w-24 h-24 rounded-3xl object-cover mb-4 shadow-lg shadow-emerald-500/20"
            />
          ) : (
            <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20 rotate-3 hover:rotate-6 transition-transform">
              <span className="text-white text-3xl font-black">{initials}</span>
            </div>
          )}
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.fullName}</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{user?.phoneNumber}</p>
          <div className="mt-4 bg-emerald-50/80 dark:bg-emerald-900/30 px-5 py-2 rounded-full border border-emerald-100 dark:border-emerald-800/50 backdrop-blur-md">
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">Membre TrustFund</p>
          </div>
        </motion.div>

        {/* Infos / Formulaire d'édition */}
        <motion.div variants={fadeInUp} className="glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider">
              Informations du compte
            </h3>
            {!isEditing && (
              <button
                onClick={handleEditOpen}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline px-3 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
              >
                ✏️ Modifier
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-5 space-y-4"
              >
                <Input
                  label="Nom complet"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Votre nom complet"
                />
                <Input
                  label="Photo de profil (URL)"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                />
                <div className="flex gap-3 pt-2">
                  <Button variant="ghost" className="flex-1" onClick={handleEditCancel} disabled={isSaving}>
                    Annuler
                  </Button>
                  <Button variant="glow" className="flex-1" onClick={handleSave} isLoading={isSaving}>
                    Enregistrer
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="divide-y divide-white/20 dark:divide-white/5"
              >
                <div className="flex flex-wrap justify-between items-center px-5 py-4 gap-2">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Nom complet</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{user?.fullName}</span>
                </div>
                <div className="flex flex-wrap justify-between items-center px-5 py-4 gap-2">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Téléphone</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{user?.phoneNumber}</span>
                </div>
                <div className="flex flex-wrap justify-between items-center px-5 py-4 gap-2">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Membre depuis</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {user?.createdAt
                      ? new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date(user.createdAt))
                      : '—'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Paramètres */}
        <motion.div variants={fadeInUp} className="glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider">Paramètres</h3>
          </div>
          <div className="divide-y divide-white/20 dark:divide-white/5">
            <button
              onClick={() => router.push('/dashboard/notifications')}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <span className="text-xl drop-shadow-sm">🔔</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Notifications</span>
              </div>
              <svg className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Déconnexion */}
        <motion.div variants={fadeInUp} className="pt-2">
          <Button
            variant="danger"
            className="w-full h-14 text-base shadow-[0_4px_14px_rgba(239,68,68,0.25)]"
            onClick={handleLogout}
          >
            Se déconnecter
          </Button>
        </motion.div>

        <motion.div variants={fadeInUp} className="text-center pt-4 pb-2">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">TrustFund v1.0</p>
          <p className="text-xs font-medium text-slate-300 dark:text-slate-600 mt-1">Douala, Cameroun · 2026</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
