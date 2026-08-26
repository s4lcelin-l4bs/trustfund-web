'use client'

import { motion } from 'framer-motion'
import { Role } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { fadeInUp } from '@/lib/animations'

interface RoleCardProps {
  role: Role
  index: number
  onEdit: () => void
  onDelete: () => void
}

export function RoleCard({ role, index, onEdit, onDelete }: RoleCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      whileHover={{ y: -3, boxShadow: '0 16px 48px rgba(5,150,105,0.14), 0 4px 12px rgba(0,0,0,0.06)' }}
      className="relative glass-card p-5 bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm rounded-2xl overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" />

      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 pr-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">{role.name}</h3>
            {role.isSystem && <Badge variant="info" label="Système" />}
          </div>
          {role.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{role.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {role.permissionKeys.length} permission{role.permissionKeys.length > 1 ? 's' : ''}
        </span>
        <span>·</span>
        <span>
          {role.memberCount} membre{role.memberCount > 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex gap-2 pt-3 border-t border-white/20 dark:border-white/5">
        <button
          onClick={onEdit}
          className="flex-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg py-2 transition-colors"
        >
          Modifier
        </button>
        {!role.isSystem && (
          <button
            onClick={onDelete}
            className="flex-1 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg py-2 transition-colors"
          >
            Supprimer
          </button>
        )}
      </div>
    </motion.div>
  )
}
