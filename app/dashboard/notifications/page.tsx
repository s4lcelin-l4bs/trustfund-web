'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { staggerContainer, fadeInUp } from '@/lib/animations'
import { SkeletonCard } from '@/components/ui/Skeleton'
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  NotificationItem,
} from '@/lib/api/notifications'

const NOTIF_CONFIG: Record<string, { emoji: string; color: string }> = {
  payment_reminder:  { emoji: '🔔', color: 'bg-orange-100 dark:bg-orange-900/40' },
  turn_announcement: { emoji: '🎯', color: 'bg-emerald-100 dark:bg-emerald-900/40' },
  payment_confirmed: { emoji: '✅', color: 'bg-blue-100 dark:bg-blue-900/40' },
  payment_failed:    { emoji: '❌', color: 'bg-red-100 dark:bg-red-900/40' },
  CONTRIBUTION:      { emoji: '📥', color: 'bg-blue-100 dark:bg-blue-900/40' },
  PENALTY:           { emoji: '⚠️', color: 'bg-rose-100 dark:bg-rose-900/40' },
  LOAN:              { emoji: '🤝', color: 'bg-amber-100 dark:bg-amber-900/40' },
  CYCLE:             { emoji: '🔄', color: 'bg-purple-100 dark:bg-purple-900/40' },
  MEMBERSHIP:        { emoji: '👤', color: 'bg-slate-100 dark:bg-slate-800' },
  ORGANIZATION:      { emoji: '🏢', color: 'bg-teal-100 dark:bg-teal-900/40' },
  AUTH:              { emoji: '🔐', color: 'bg-indigo-100 dark:bg-indigo-900/40' },
  SECURITY:          { emoji: '🛡️', color: 'bg-red-100 dark:bg-red-900/40' },
  SYSTEM:            { emoji: '⚙️', color: 'bg-slate-100 dark:bg-slate-800' },
}

function getConfig(type: string) {
  return NOTIF_CONFIG[type] || { emoji: '📌', color: 'bg-slate-100 dark:bg-slate-800' }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'À l\'instant'
  if (minutes < 60) return `Il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Il y a ${hours}h`
  const days = Math.floor(hours / 24)
  return `Il y a ${days} jour${days > 1 ? 's' : ''}`
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifs, setNotifs] = useState<NotificationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      const result = await getNotifications({ limit: 50 })
      setNotifs(result.notifications || [])
    } catch {
      toast.error('Impossible de charger les notifications')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchNotifications() }, [fetchNotifications])

  const unreadCount = notifs.filter(n => !n.read).length

  async function handleMarkRead(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    try {
      await markNotificationAsRead(id)
    } catch {
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: false } : n))
    }
  }

  async function handleMarkAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
    try {
      await markAllNotificationsAsRead()
    } catch {
      toast.error('Erreur lors de la mise à jour')
      fetchNotifications()
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deleteNotification(id)
      setNotifs(prev => prev.filter(n => n.id !== id))
      toast.success('Notification supprimée')
    } catch {
      toast.error('Impossible de supprimer')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleNotificationClick(notif: NotificationItem) {
    if (!notif.read) {
      handleMarkRead(notif.id)
    }
    
    if (notif.data) {
      if (notif.data.loanId) {
        router.push(`/dashboard/loans`)
      } else if (notif.data.penaltyId) {
        router.push(`/dashboard/penalties`)
      } else if (notif.data.contributionId) {
        router.push(`/dashboard/contributions`)
      } else if (notif.data.organizationId) {
        router.push(`/dashboard/organizations/${notif.data.organizationId}`)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="shimmer h-8 w-48 rounded-lg mb-6" />
        <SkeletonCard /><SkeletonCard /><SkeletonCard />
      </div>
    )
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            {unreadCount > 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </span>
            ) : 'Tout est lu ✓'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-emerald-600 dark:text-emerald-400 font-bold hover:underline bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl transition-colors"
          >
            Tout marquer lu
          </button>
        )}
      </motion.div>

      {notifs.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24 text-center glass-card">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🔕</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Aucune notification</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Vous êtes à jour !</p>
        </motion.div>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
          <AnimatePresence>
            {notifs.map((notif) => {
              const config = getConfig(notif.type)
              return (
                <motion.div
                  key={notif.id}
                  variants={fadeInUp}
                  layout
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className={
                    'flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer ' +
                    (notif.read
                      ? 'glass-card hover:bg-white/60 dark:hover:bg-slate-900/60'
                      : 'bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-200/50 dark:border-emerald-500/20 backdrop-blur-md shadow-[0_4px_20px_rgba(16,185,129,0.08)]')
                  }
                  onClick={() => handleNotificationClick(notif)}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMarkRead(notif.id); }}
                    className={config.color + ' w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl shadow-sm hover:scale-110 transition-transform'}
                  >
                    <span>{config.emoji}</span>
                  </button>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        {notif.type.replace('_', ' ')}
                      </span>
                      {!notif.read && (
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                      )}
                    </div>
                    {notif.title && (
                      <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{notif.title}</p>
                    )}
                    <p className={'text-sm mt-0.5 ' + (notif.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white font-medium')}>
                      {notif.message}
                    </p>
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-2">{timeAgo(notif.createdAt)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(notif.id); }}
                    disabled={deletingId === notif.id}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                    title="Supprimer"
                  >
                    {deletingId === notif.id ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
