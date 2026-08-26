'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getJournalEntries, getBalanceSheet } from '@/lib/api/accounting'
import { AccountingJournalEntry, AccountingBalance } from '@/types'
import { Tabs } from '@/components/ui/Tabs'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { staggerContainer, fadeInUp } from '@/lib/animations'

const ACCOUNTING_TABS = [
  { id: 'journal', label: 'Livre Journal' },
  { id: 'balance', label: 'Balance' },
  { id: 'grand_livre', label: 'Grand Livre' },
  { id: 'bilan', label: 'Bilan Simplifié' },
]

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState('journal')
  const [isLoading, setIsLoading] = useState(true)
  const [journalEntries, setJournalEntries] = useState<AccountingJournalEntry[]>([])
  const [balances, setBalances] = useState<AccountingBalance[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    fetchData()
  }, [activeTab, startDate, endDate])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      if (activeTab === 'journal') {
        const data = await getJournalEntries({ startDate, endDate })
        setJournalEntries(data)
      } else if (activeTab === 'balance') {
        const data = await getBalanceSheet({ startDate, endDate })
        setBalances(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Comptabilité</h1>
          <p className="text-slate-500 mt-1 font-medium">Consultez et exportez vos états financiers</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input 
            type="date" 
            value={startDate} 
            onChange={e => setStartDate(e.target.value)}
            className="w-full sm:w-auto"
          />
          <Input 
            type="date" 
            value={endDate} 
            onChange={e => setEndDate(e.target.value)}
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      <Tabs 
        tabs={ACCOUNTING_TABS} 
        activeId={activeTab} 
        onChange={setActiveTab} 
      />

      <div className="glass-card p-6 overflow-x-auto min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'journal' && (
              <motion.div key="journal" variants={staggerContainer} initial="hidden" animate="visible">
                {journalEntries.length === 0 ? (
                  <EmptyState message="Aucune écriture comptable trouvée pour cette période." />
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase">
                        <th className="pb-3 px-4">Date</th>
                        <th className="pb-3 px-4">Référence</th>
                        <th className="pb-3 px-4">Compte</th>
                        <th className="pb-3 px-4">Libellé</th>
                        <th className="pb-3 px-4 text-right">Débit</th>
                        <th className="pb-3 px-4 text-right">Crédit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {journalEntries.map((entry, idx) => (
                        <motion.tr variants={fadeInUp} key={entry.id || idx} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="py-3 px-4">{new Date(entry.date).toLocaleDateString()}</td>
                          <td className="py-3 px-4 font-mono">{entry.reference}</td>
                          <td className="py-3 px-4 font-bold">{entry.accountCode} - {entry.accountName}</td>
                          <td className="py-3 px-4">{entry.description}</td>
                          <td className="py-3 px-4 text-right text-emerald-600">{entry.debit > 0 ? formatCurrency(entry.debit) : '-'}</td>
                          <td className="py-3 px-4 text-right text-red-600">{entry.credit > 0 ? formatCurrency(entry.credit) : '-'}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </motion.div>
            )}

            {activeTab === 'balance' && (
              <motion.div key="balance" variants={staggerContainer} initial="hidden" animate="visible">
                {balances.length === 0 ? (
                  <EmptyState message="Aucune balance trouvée." />
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase">
                        <th className="pb-3 px-4">Compte</th>
                        <th className="pb-3 px-4 text-right">Débit</th>
                        <th className="pb-3 px-4 text-right">Crédit</th>
                        <th className="pb-3 px-4 text-right">Solde Débiteur</th>
                        <th className="pb-3 px-4 text-right">Solde Créditeur</th>
                      </tr>
                    </thead>
                    <tbody>
                      {balances.map((bal, idx) => (
                        <motion.tr variants={fadeInUp} key={bal.accountCode || idx} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="py-3 px-4 font-bold">{bal.accountCode} - {bal.accountName}</td>
                          <td className="py-3 px-4 text-right">{formatCurrency(bal.periodDebit)}</td>
                          <td className="py-3 px-4 text-right">{formatCurrency(bal.periodCredit)}</td>
                          <td className="py-3 px-4 text-right font-medium text-emerald-600">{bal.finalDebit > 0 ? formatCurrency(bal.finalDebit) : '-'}</td>
                          <td className="py-3 px-4 text-right font-medium text-red-600">{bal.finalCredit > 0 ? formatCurrency(bal.finalCredit) : '-'}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </motion.div>
            )}

            {activeTab === 'grand_livre' && (
              <motion.div key="grand_livre" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <EmptyState message="Sélectionnez un compte pour voir son grand livre." />
              </motion.div>
            )}

            {activeTab === 'bilan' && (
              <motion.div key="bilan" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <EmptyState message="Le bilan simplifié sera généré en fin d'exercice." />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">📉</span>
      </div>
      <p>{message}</p>
    </div>
  )
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(amount)
}
