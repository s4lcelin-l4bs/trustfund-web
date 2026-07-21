'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, fadeInUp } from '@/lib/animations'

type NotifType = 'payment_reminder' | 'turn_announcement' | 'payment_confirmed' | 'payment_failed'

interface Notif {
  id: string
  type: NotifType
  message: string
  groupName: string
  read: boolean
  createdAt: string
}

const mockNotifications: Notif[] = [
  {
    id: 'n1',
    type: 'turn_announcement',
    message: 'C\'est votre tour de recevoir le pool ce mois-ci !',
    groupName: 'Epargne famille',
    read: false,
    createdAt: 'Il y a 2h',
  },
  {
    id: 'n2',
    type: 'payment_reminder',
    message: 'Rappel : votre cotisation est due dans 3 jours.',
    groupName: 'Tontine bureau IUT',
    read: false,
    createdAt: 'Il y a 5h',
  },
  {
    id: 'n3',
    type: 'payment_confirmed',
    message: 'Votre cotisation de 50 000 FCFA a ete confirmee.',
    groupName: 'Tontine bureau IUT',
    read: true,
    createdAt: 'Hier',
  },
  {
    id: 'n4',
    type: 'payment_confirmed',
    message: 'Marie Tamba a cotise pour ce cycle.',
    groupName: 'Tontine bureau IUT',
    read: true,
    createdAt: 'Il y a 2 jours',
  },
  {
    id: 'n5',
    type: 'payment_failed',
    message: 'Le paiement de Paul Mbappe a echoue.',
    groupName: 'Tontine amis campus',
    read: true,
    createdAt: 'Il y a 3 jours',
  },
]

function getNotifConfig(type: NotifType) {
  const configs = {
    payment_reminder: { emoji: '🔔', color: 'bg-orange-100', label: 'Rappel' },
    turn_announcement: { emoji: '🎯', color: 'bg-emerald-100', label: 'Votre tour' },
    payment_confirmed: { emoji: '✅', color: 'bg-blue-100', label: 'Confirme' },
    payment_failed: { emoji: '❌', color: 'bg-red-100', label: 'Echec' },
  }
  return configs[type]
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>(mockNotifications)

  const unreadCount = notifs.filter((n) => !n.read).length

  function markAllRead() {
    setNotifs(notifs.map((n) => ({ ...n, read: true })))
  }

  function markRead(id: string) {
    setNotifs(notifs.map((n) => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {unreadCount > 0 ? ${unreadCount} non lue : 'Tout est lu'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm text-emerald-600 font-medium hover:underline"
          >
            Tout marquer lu
          </button>
        )}
      </motion.div>

      {notifs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <span className="text-5xl mb-4">🔕</span>
          <h3 className="text-lg font-semibold text-slate-900">Aucune notification</h3>
          <p className="text-slate-500 text-sm mt-1">Vous etes a jour !</p>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          {notifs.map((notif) => {
            const config = getNotifConfig(notif.type)
            return (
              <motion.div
                key={notif.id}
                variants={fadeInUp}
                onClick={() => markRead(notif.id)}
                className={
                  'flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ' +
                  (notif.read
                    ? 'bg-white border-slate-100'
                    : 'bg-emerald-50 border-emerald-100')
                }
              >
                <div className={config.color + ' w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg'}>
                  {config.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-emerald-600">
                      {notif.groupName}
                    </span>
                    {!notif.read && (
                      <span className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-slate-800 mt-0.5">{notif.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{notif.createdAt}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
