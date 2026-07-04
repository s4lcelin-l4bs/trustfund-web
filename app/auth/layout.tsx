'use client'

import { motion } from 'framer-motion'
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations'

const features = [
  { icon: '🔒', text: 'Transactions securisees et verifiables' },
  { icon: '📊', text: 'Registre transparent en temps reel' },
  { icon: '🔔', text: 'Rappels automatiques de cotisation' },
  { icon: '⚡', text: 'Versements instantanes via Mobile Money' },
]

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-12 relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-white/5 rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-emerald-700 text-lg font-bold">T</span>
            </div>
            <span className="text-white text-xl font-bold">TrustFund</span>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-white leading-tight">
              La tontine digitale
              <span className="text-emerald-200"> 100% transparente</span>
            </h2>
            <p className="text-emerald-100 mt-3 text-base">
              Fini le cahier papier. Gerez vos tontines en toute confiance.
            </p>
          </motion.div>

          <motion.ul variants={staggerContainer} className="space-y-4">
            {features.map((f, i) => (
              <motion.li key={i} variants={fadeInUp} className="flex items-center gap-3">
                <span className="text-xl">{f.icon}</span>
                <span className="text-emerald-50 text-sm">{f.text}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-emerald-300 text-xs"
        >
          2026 TrustFund · Douala, Cameroun
        </motion.p>
      </motion.div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex lg:hidden flex-col items-center mb-8"
          >
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mb-2">
              <span className="text-white text-xl font-bold">T</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">TrustFund</h1>
            <p className="text-sm text-slate-500">La tontine digitale transparente</p>
          </motion.div>
          {children}
        </div>
      </div>
    </div>
  )
}
