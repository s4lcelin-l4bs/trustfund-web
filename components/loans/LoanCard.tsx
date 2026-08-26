import { motion } from 'framer-motion'
import { Loan } from '@/types'
import { fadeInUp } from '@/lib/animations'

interface Props { loan: Loan; index: number; onClick?: () => void; onDelete?: () => void; onDisburse?: () => void }

export function LoanCard({ loan, index, onClick, onDelete, onDisburse }: Props) {
  const statusMap: Record<string, string> = { requested: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400', approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400', disbursed: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400', active: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400', completed: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400', rejected: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400', defaulted: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' }
  const labelMap: Record<string, string> = { requested: 'Demandé', approved: 'Approuvé', disbursed: 'Décaissé', active: 'En cours', completed: 'Remboursé', rejected: 'Rejeté', defaulted: 'En défaut' }
  const member = (loan as any).member

  return (
    <motion.div variants={fadeInUp} custom={index} className="glass-card p-5 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-xl">🤝</div>
          <div>
            <h3 className="font-bold text-sm">
              {member ? `${member.firstName} ${member.lastName}` : `#${loan.memberId?.slice(0, 6)}`}
            </h3>
            <p className="text-xs text-slate-500">{new Date(loan.requestDate).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusMap[loan.status] || 'bg-slate-100 text-slate-700'}`}>
          {labelMap[loan.status] || loan.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Montant</p>
          <p className="font-bold text-sm">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(loan.amountRequested || 0)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Durée</p>
          <p className="font-bold text-sm">{loan.durationMonths} mois @ {loan.interestRate}%</p>
        </div>
      </div>
      {loan.amountApproved && loan.status !== 'requested' && loan.status !== 'rejected' && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/50">
          <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Approuvé</p>
          <p className="font-black text-lg text-emerald-600">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(loan.amountApproved)}</p>
        </div>
      )}
      <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity flex-wrap">
        <button onClick={onClick} className="flex-1 min-w-[30%] text-xs py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-slate-600 hover:text-emerald-700 font-medium transition-colors">
          Traiter
        </button>
        {onDisburse && loan.status === 'approved' && (
          <button onClick={onDisburse} className="flex-1 min-w-[30%] text-xs py-2 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 font-bold transition-colors border border-emerald-200 dark:border-emerald-800">
            Décaisser
          </button>
        )}
        <button onClick={onDelete} className="flex-1 min-w-[30%] text-xs py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-600 hover:text-red-600 font-medium transition-colors">
          Supprimer
        </button>
      </div>
    </motion.div>
  )
}