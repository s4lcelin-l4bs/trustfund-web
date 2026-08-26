import { motion } from 'framer-motion'
import { Contribution } from '@/types'
import { fadeInUp } from '@/lib/animations'

interface Props {
  contribution: Contribution
  index: number
  onPay?: () => void
}

export function ContributionCard({ contribution, index, onPay }: Props) {
  const isPayable = contribution.status === 'pending' || contribution.status === 'late' || contribution.status === 'partial'

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
      case 'partial': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-800'
      case 'late': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-800'
      case 'advance': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800'
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
    }
  }
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'paid': return 'Payée'
      case 'partial': return 'Partielle'
      case 'late': return 'En retard'
      case 'advance': return 'En avance'
      default: return 'À payer'
    }
  }
  const getMethodLabel = (method: string) => {
    switch(method) {
      case 'cash': return 'Espèces'
      case 'mobile_money': return 'Mobile Money'
      case 'bank_transfer': return 'Virement'
      default: return 'Non spécifié'
    }
  }

  const memberName = contribution.member ? `${contribution.member.firstName} ${contribution.member.lastName}` : `Membre #${contribution.memberId.slice(0, 6)}`
  const initial = contribution.member ? contribution.member.firstName.charAt(0) : '?'

  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      className="glass-card p-5 group flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-sm">
            {initial}
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[150px]">{memberName}</h3>
            <p className="text-xs text-slate-500">
              {new Date(contribution.date).toLocaleDateString('fr-FR')} {contribution.time && `à ${contribution.time}`}
            </p>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusStyle(contribution.status)}`}>
          {getStatusLabel(contribution.status)}
        </span>
      </div>

      {contribution.reference && (
        <p className="text-xs text-slate-400 font-mono mb-3 truncate">Réf: {contribution.reference}</p>
      )}

      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-end flex-grow">
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Montant attendu</p>
          <p className="font-black text-lg text-emerald-600 dark:text-emerald-400">
            {new Intl.NumberFormat('fr-FR').format(contribution.amount || 0)} <span className="text-xs text-emerald-500/70">FCFA</span>
          </p>
        </div>
      </div>

      {isPayable && (
        <div className="mt-4">
          <button
            onClick={onPay}
            className="w-full text-sm py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            Payer maintenant
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </motion.div>
  )
}