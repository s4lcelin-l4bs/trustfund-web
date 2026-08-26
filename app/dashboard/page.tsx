'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getDashboardStats, DashboardStats } from '@/lib/api/dashboard'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { Skeleton } from '@/components/ui/Skeleton'

const fmt = (n: number, currency = 'XAF') =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)

const TRANSACTION_LABELS: Record<string, string> = {
  contribution: 'Cotisation',
  payout: 'Versement',
  penalty: 'Pénalité',
  loan: 'Prêt',
  loan_disbursement: 'Décaissement',
  loan_repayment: 'Remboursement',
  expense: 'Dépense',
  fee: 'Frais',
  savings_deposit: 'Épargne',
  savings_withdrawal: 'Retrait épargne',
  other: 'Autre',
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  failed: 'bg-red-100 text-red-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-slate-100 text-slate-500',
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err?.response?.data?.message || 'Erreur de chargement'))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="shimmer h-8 w-48 rounded-lg mb-2" />
          <div className="shimmer h-4 w-64 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-card p-6">
              <Skeleton className="w-12 h-12 rounded-xl mb-4" />
              <Skeleton className="w-24 h-4 mb-2" />
              <Skeleton className="w-32 h-8" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Tableau de bord</h1>
          <p className="text-slate-500 mt-1 font-medium">Vue d'ensemble de vos activités</p>
        </div>
        {stats?.activeCycle && (
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl px-4 py-2">
            <span className="text-emerald-500">🔄</span>
            <div>
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Cycle actif</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500">{stats.activeCycle.name}</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={fadeInUp} className="glass-card p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_8px_30px_rgba(5,150,105,0.3)]">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4 text-2xl">💰</div>
            <p className="text-sm font-medium text-emerald-50 mb-1">Solde en caisse</p>
            <h3 className="text-2xl font-black">{stats ? fmt(stats.cashBalance) : '—'}</h3>
          </motion.div>

          <motion.div variants={fadeInUp} className="glass-card p-6 group hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">👥</div>
            <p className="text-sm font-medium text-slate-500 mb-1">Membres actifs</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats ? `${stats.activeMembersCount} / ${stats.totalMembers}` : '—'}
            </h3>
          </motion.div>

          <motion.div variants={fadeInUp} className="glass-card p-6 group hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">📈</div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total cotisations</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats ? fmt(stats.totalContributions) : '—'}</h3>
          </motion.div>

          <motion.div variants={fadeInUp} className="glass-card p-6 group hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">🤝</div>
            <p className="text-sm font-medium text-slate-500 mb-1">Prêts actifs</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats ? fmt(stats.activeLoans) : '—'}</h3>
          </motion.div>
        </div>

        {/* Pending Penalties Banner */}
        {stats && stats.pendingPenalties.count > 0 && (
          <motion.div variants={fadeInUp} className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-bold text-rose-700 dark:text-rose-400">{stats.pendingPenalties.count} pénalité{stats.pendingPenalties.count > 1 ? 's' : ''} non payée{stats.pendingPenalties.count > 1 ? 's' : ''}</p>
                <p className="text-sm text-rose-600 dark:text-rose-500">Total : {fmt(stats.pendingPenalties.total)}</p>
              </div>
            </div>
            <a href="/dashboard/penalties" className="text-sm font-bold text-rose-600 dark:text-rose-400 hover:underline">Voir →</a>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <motion.div variants={fadeInUp} className="glass-card p-6">
            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">⚡</span>
              Dernières transactions
            </h3>
            <div className="space-y-3">
              {!stats || stats.recentActivities.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">Aucune transaction récente</p>
              ) : (
                stats.recentActivities.slice(0, 6).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-sm flex-shrink-0">
                        {tx.type === 'contribution' ? '📥' : tx.type.includes('loan') ? '🤝' : tx.type === 'expense' ? '📤' : '💳'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{TRANSACTION_LABELS[tx.type] || tx.type}</p>
                        {tx.member && <p className="text-xs text-slate-500 truncate">{tx.member.firstName} {tx.member.lastName}</p>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="font-bold text-sm">{fmt(tx.amount)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[tx.status] || 'bg-slate-100 text-slate-600'}`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Monthly Stats */}
          <motion.div variants={fadeInUp} className="glass-card p-6">
            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600">📊</span>
              Cotisations récentes
            </h3>
            <div className="space-y-3">
              {!stats || stats.monthlyStats.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">Aucune cotisation récente</p>
              ) : (
                stats.monthlyStats.slice(-6).map((m, i) => {
                  const maxAmount = Math.max(...stats.monthlyStats.map(s => s.amount))
                  const pct = maxAmount > 0 ? (m.amount / maxAmount) * 100 : 0
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 w-20 flex-shrink-0">
                        {new Date(m.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-24 text-right flex-shrink-0">
                        {fmt(m.amount)}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick links */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/dashboard/contributions', label: 'Cotisations', emoji: '📥', color: 'from-blue-500 to-indigo-500' },
            { href: '/dashboard/penalties', label: 'Pénalités', emoji: '⚠️', color: 'from-rose-500 to-pink-500' },
            { href: '/dashboard/loans', label: 'Prêts', emoji: '🤝', color: 'from-amber-500 to-yellow-500' },
            { href: '/dashboard/calendar', label: 'Calendrier', emoji: '📅', color: 'from-emerald-500 to-teal-500' },
          ].map((link) => (
            <a key={link.href} href={link.href}
              className={`glass-card p-4 flex flex-col items-center justify-center gap-2 hover:-translate-y-1 transition-all text-center group rounded-2xl`}>
              <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform`}>
                {link.emoji}
              </span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{link.label}</span>
            </a>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
