import { motion } from 'framer-motion'
import { Expense } from '@/types'
import { fadeInUp } from '@/lib/animations'

interface Props {
  expense: Expense
  index: number
  onClick?: () => void
  onDelete?: () => void
}

export function ExpenseCard({ expense, index, onClick, onDelete }: Props) {
  const getStatusStyle = (s: string) => ({ paid: 'bg-emerald-100 text-emerald-700', approved: 'bg-blue-100 text-blue-700', rejected: 'bg-red-100 text-red-700', pending: 'bg-amber-100 text-amber-700' }[s] || 'bg-slate-100 text-slate-700')
  const getStatusLabel = (s: string) => ({ paid: 'Payée', approved: 'Approuvée', rejected: 'Rejetée', pending: 'En attente' }[s] || s)

  return (
    <motion.div variants={fadeInUp} custom={index} className="glass-card p-5 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">📉</div>
          <div>
            <h3 className="font-bold text-sm">Catégorie: {expense.categoryId?.slice(0, 8)}</h3>
            <p className="text-xs text-slate-500">{new Date(expense.date).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusStyle(expense.status)}`}>{getStatusLabel(expense.status)}</span>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 min-h-[40px]">{expense.description || 'Aucune description.'}</p>
      <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800/50">
        {expense.receiptUrl ? <span className="text-xs text-blue-500 font-medium">📎 Justificatif</span> : <span className="text-xs text-slate-400">Sans justificatif</span>}
        <p className="font-black text-lg text-slate-900 dark:text-white">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(expense.amount || 0)}</p>
      </div>
      <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onClick} className="flex-1 text-xs py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-slate-600 hover:text-emerald-700 font-medium transition-colors">Modifier</button>
        <button onClick={onDelete} className="flex-1 text-xs py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-600 hover:text-red-600 font-medium transition-colors">Supprimer</button>
      </div>
    </motion.div>
  )
}