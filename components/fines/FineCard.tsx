import { motion } from 'framer-motion'
import { Fine } from '@/types'
import { fadeInUp } from '@/lib/animations'

interface Props { fine: Fine; index: number; onClick?: () => void; onDelete?: () => void }

export function FineCard({ fine, index, onClick, onDelete }: Props) {
  const styleMap: Record<string, string> = { paid: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-slate-100 text-slate-600', pending: 'bg-pink-100 text-pink-700' }
  const labelMap: Record<string, string> = { paid: 'Payée', cancelled: 'Annulée', pending: 'Non payée' }

  return (
    <motion.div variants={fadeInUp} custom={index} className="glass-card p-5 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center">🚫</div>
          <div>
            <h3 className="font-bold text-sm">Membre #{fine.memberId?.slice(0, 6)}</h3>
            <p className="text-xs text-slate-500">{new Date(fine.createdAt).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${styleMap[fine.status] || 'bg-slate-100 text-slate-700'}`}>{labelMap[fine.status] || fine.status}</span>
      </div>
      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2 min-h-[40px]">{fine.motif}</p>
      <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/50">
        {fine.status === 'paid' && fine.paymentDate ? <p className="text-xs text-slate-500">Payé le {new Date(fine.paymentDate).toLocaleDateString('fr-FR')}</p> : <span />}
        <p className="font-black text-lg text-pink-600">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(fine.amount || 0)}</p>
      </div>
      <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onClick} className="flex-1 text-xs py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-slate-600 hover:text-emerald-700 font-medium transition-colors">Modifier</button>
        <button onClick={onDelete} className="flex-1 text-xs py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-600 hover:text-red-600 font-medium transition-colors">Supprimer</button>
      </div>
    </motion.div>
  )
}