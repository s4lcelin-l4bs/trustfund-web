'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getSavingsAccounts, getSavingsTransactions } from '@/lib/api/savings'
import { SavingsAccount, SavingsTransaction, SavingsTransactionType } from '@/types'
import { Tabs } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { staggerContainer, fadeInUp } from '@/lib/animations'

const SAVINGS_TABS = [
  { id: 'overview', label: 'Vue d\'ensemble' },
  { id: 'history', label: 'Historique des transactions' },
  { id: 'deposits', label: 'Dépôts' },
  { id: 'withdrawals', label: 'Retraits' },
]

export default function SavingsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [accounts, setAccounts] = useState<SavingsAccount[]>([])
  const [transactions, setTransactions] = useState<SavingsTransaction[]>([])
  
  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      if (activeTab === 'overview') {
        const data = await getSavingsAccounts()
        setAccounts(data)
      } else {
        const typeFilter = activeTab === 'deposits' ? 'deposit' : activeTab === 'withdrawals' ? 'withdrawal' : 'all'
        const data = await getSavingsTransactions({ type: typeFilter as any })
        setTransactions(data.items || [])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalSavings = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Épargne</h1>
          <p className="text-slate-500 mt-1 font-medium">Gérez l'épargne individuelle et collective</p>
        </div>
        <Button variant="glow" onClick={() => {}}>Nouvelle Transaction</Button>
      </div>

      <Tabs 
        tabs={SAVINGS_TABS} 
        activeId={activeTab} 
        onChange={setActiveTab} 
      />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div key={activeTab} variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div variants={fadeInUp} className="glass-card p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
                    <p className="text-emerald-100 mb-1 font-medium">Solde Total de l'Épargne</p>
                    <h2 className="text-3xl font-black">{formatCurrency(totalSavings)}</h2>
                  </motion.div>
                  <motion.div variants={fadeInUp} className="glass-card p-6">
                    <p className="text-slate-500 mb-1 font-medium">Comptes d'épargne actifs</p>
                    <h2 className="text-2xl font-bold">{accounts.length}</h2>
                  </motion.div>
                  <motion.div variants={fadeInUp} className="glass-card p-6">
                    <p className="text-slate-500 mb-1 font-medium">Taux d'intérêt moyen</p>
                    <h2 className="text-2xl font-bold text-amber-500">4.5%</h2>
                  </motion.div>
                </div>
                
                <h3 className="font-bold text-lg mt-8 mb-4">Comptes d'épargne par membre</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {accounts.map(acc => (
                    <motion.div variants={fadeInUp} key={acc.id} className="glass-card p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">👤</div>
                        <div>
                          <p className="font-bold">Membre #{acc.memberId.slice(0, 5)}</p>
                          <p className="text-xs text-slate-500">Créé le {new Date(acc.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-slate-500">Solde</span>
                        <span className="font-black text-lg text-emerald-600">{formatCurrency(acc.balance)}</span>
                      </div>
                    </motion.div>
                  ))}
                  {accounts.length === 0 && <EmptyState message="Aucun compte d'épargne." />}
                </div>
              </>
            )}

            {activeTab !== 'overview' && (
              <div className="glass-card p-6 overflow-x-auto">
                {transactions.length === 0 ? (
                  <EmptyState message="Aucune transaction trouvée." />
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase">
                        <th className="pb-3 px-4">Date</th>
                        <th className="pb-3 px-4">Type</th>
                        <th className="pb-3 px-4">Membre</th>
                        <th className="pb-3 px-4">Description</th>
                        <th className="pb-3 px-4 text-right">Montant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(tx => (
                        <motion.tr variants={fadeInUp} key={tx.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="py-3 px-4">{new Date(tx.date).toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              tx.type === 'deposit' ? 'bg-emerald-100 text-emerald-700' :
                              tx.type === 'withdrawal' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {tx.type === 'deposit' ? 'Dépôt' : tx.type === 'withdrawal' ? 'Retrait' : 'Intérêt'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-500">#{tx.savingsAccountId.slice(0, 5)}</td>
                          <td className="py-3 px-4">{tx.description || '-'}</td>
                          <td className={`py-3 px-4 text-right font-bold ${tx.type === 'withdrawal' ? 'text-red-600' : 'text-emerald-600'}`}>
                            {tx.type === 'withdrawal' ? '-' : '+'}{formatCurrency(tx.amount)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">📭</span>
      </div>
      <p>{message}</p>
    </div>
  )
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(amount)
}
