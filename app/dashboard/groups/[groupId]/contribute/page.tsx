'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { staggerContainer, fadeInUp, scaleIn } from '@/lib/animations'

type PaymentMethod = 'mtn' | 'orange'

export default function ContributePage() {
  const router = useRouter()
  const params = useParams()
  const groupId = params.groupId as string

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const amount = 50000

  function formatAmount(n: number) {
    return new Intl.NumberFormat('fr-FR').format(n)
  }

  async function handlePay() {
    if (!selectedMethod) {
      toast.error('Choisissez un mode de paiement')
      return
    }
    if (!phoneNumber || phoneNumber.length < 9) {
      toast.error('Entrez un numero valide')
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsSuccess(true)
    } catch {
      toast.error('Echec du paiement. Reessayez.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl"
          >
            ✅
          </motion.span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Cotisation confirmee !
          </h2>
          <p className="text-slate-500 mb-2">
            {formatAmount(amount)} FCFA ont ete debites de votre compte.
          </p>
          <p className="text-sm text-slate-400 mb-8">
            Un recu a ete genere et enregistre dans le registre du groupe.
          </p>

          <div className="bg-slate-50 rounded-2xl p-4 text-left mb-8 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Montant</span>
              <span className="font-semibold text-slate-900">{formatAmount(amount)} FCFA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Methode</span>
              <span className="font-semibold text-slate-900">
                {selectedMethod === 'mtn' ? 'MTN Mobile Money' : 'Orange Money'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Numero</span>
              <span className="font-semibold text-slate-900">{phoneNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Statut</span>
              <span className="font-semibold text-emerald-600">Confirme</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Reference</span>
              <span className="font-mono text-xs text-slate-400">TF-MOCK-{Date.now().toString().slice(-6)}</span>
            </div>
          </div>

          <Button
            onClick={() => router.push('/dashboard/groups/' + groupId)}
            className="w-full"
            size="lg"
          >
            Retour au groupe
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Cotiser</h1>
          <p className="text-sm text-slate-500">Paiement securise via Mobile Money</p>
        </div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {/* Montant */}
        <motion.div
          variants={scaleIn}
          className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white text-center shadow-lg"
        >
          <p className="text-emerald-100 text-sm mb-1">Montant de la cotisation</p>
          <p className="text-4xl font-bold">{formatAmount(amount)}</p>
          <p className="text-emerald-200 text-sm mt-1">FCFA</p>
          <div className="mt-4 bg-white/10 rounded-xl px-4 py-2 inline-block">
            <p className="text-xs text-emerald-100">Mode test — aucun debit reel</p>
          </div>
        </motion.div>

        {/* Choix du mode de paiement */}
        <motion.div
          variants={fadeInUp}
          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"
        >
          <h2 className="font-semibold text-slate-800 text-sm mb-3">
            Mode de paiement
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {([
              {
                id: 'mtn' as PaymentMethod,
                label: 'MTN Mobile Money',
                color: 'bg-yellow-400',
                emoji: '📱',
              },
              {
                id: 'orange' as PaymentMethod,
                label: 'Orange Money',
                color: 'bg-orange-500',
                emoji: '📲',
              },
            ]).map((method) => (
              <motion.button
                key={method.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedMethod(method.id)}
                className={
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ' +
                  (selectedMethod === method.id
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-100 hover:border-slate-200')
                }
              >
                <div className={method.color + ' w-10 h-10 rounded-xl flex items-center justify-center'}>
                  <span className="text-lg">{method.emoji}</span>
                </div>
                <span className={
                  'text-xs font-medium text-center ' +
                  (selectedMethod === method.id ? 'text-emerald-700' : 'text-slate-600')
                }>
                  {method.label}
                </span>
                {selectedMethod === method.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Numero de telephone */}
        <AnimatePresence>
          {selectedMethod && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"
            >
              <h2 className="font-semibold text-slate-800 text-sm mb-3">
                Numero {selectedMethod === 'mtn' ? 'MTN' : 'Orange'}
              </h2>
              <div className="flex items-center gap-2">
                <div className="bg-slate-100 px-3 py-2.5 rounded-xl text-sm text-slate-600 font-medium">
                  +237
                </div>
                <input
                  type="tel"
                  placeholder="6XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  maxLength={9}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recap */}
        <motion.div
          variants={fadeInUp}
          className="bg-slate-50 rounded-2xl p-4 space-y-2"
        >
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Cotisation</span>
            <span className="font-medium">{formatAmount(amount)} FCFA</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Frais (mode test)</span>
            <span className="font-medium text-emerald-600">0 FCFA</span>
          </div>
          <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-semibold">
            <span>Total</span>
            <span>{formatAmount(amount)} FCFA</span>
          </div>
        </motion.div>

        {/* Bouton payer */}
        <motion.div variants={fadeInUp}>
          <Button
            onClick={handlePay}
            isLoading={isLoading}
            className="w-full"
            size="lg"
            disabled={!selectedMethod || !phoneNumber}
          >
            {isLoading ? 'Traitement en cours...' : 'Confirmer le paiement'}
          </Button>
          <p className="text-xs text-center text-slate-400 mt-2">
            Paiement simule — aucun argent reel debite
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
