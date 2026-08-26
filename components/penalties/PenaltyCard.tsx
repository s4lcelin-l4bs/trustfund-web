import { motion } from 'framer-motion'
import { Penalty } from '@/types'
import { fadeInUp } from '@/lib/animations'

interface Props { penalty: Penalty; index: number; onClick?: () => void; onDelete?: () => void; onCancel?: () => void }

export function PenaltyCard({ penalty, index, onClick, onDelete, onCancel }: Props) {
  const styleMap: Record<string, string> = { paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400', cancelled: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', pending: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400' }
  const labelMap: Record<string, string> = { paid: '✓ Payée', cancelled: '✗ Annulée', pending: '⏳ En attente' }
  const member = (penalty as any).member

  return (
    <motion.div variants={fadeInUp} custom={index} className="glass-card p-5 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-xl">⚠️</div>
          <div>
            <h3 className="font-bold text-sm">
              {member ? `${member.firstName} ${member.lastName}` : `#${penalty.memberId?.slice(0, 6)}`}
            </h3>
            <p className="text-xs text-slate-500">{new Date(penalty.createdAt).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${styleMap[penalty.status] || 'bg-slate-100 text-slate-700'}`}>
          {labelMap[penalty.status] || penalty.status}
        </span>
      </div>
      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2 min-h-[40px]">{penalty.motif}</p>
      <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/50">
        {penalty.status === 'paid' && penalty.paymentDate
          ? <p className="text-xs text-slate-500">Payé le {new Date(penalty.paymentDate).toLocaleDateString('fr-FR')}</p>
          : <span />}
        <p className="font-black text-lg text-rose-600 dark:text-rose-400">
          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(penalty.amount || 0)}
        </p>
      </div>
      <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onClick} className="flex-1 text-xs py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-slate-600 hover:text-emerald-700 font-medium transition-colors">
          Modifier
        </button>
        {onCancel && penalty.status === 'pending' && (
          <button onClick={onCancel} className="flex-1 text-xs py-2 px-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 text-amber-600 hover:text-amber-700 font-medium transition-colors border border-amber-200 dark:border-amber-800">
            Annuler
          </button>
        )}
        <button onClick={onDelete} className="flex-1 text-xs py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-600 hover:text-red-600 font-medium transition-colors">
          Supprimer
        </button>
      </div>
    </motion.div>
  )
}