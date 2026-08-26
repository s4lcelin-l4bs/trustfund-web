'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { fadeIn, fadeInUp, staggerContainer, springScaleIn } from '@/lib/animations'
import { AuroraBackground } from '@/components/layout/AuroraBackground'

const features = [
  { icon: '🔒', title: 'Sécurisé', text: 'Transactions vérifiables' },
  { icon: '📊', title: 'Transparent', text: 'Registre en temps réel' },
  { icon: '⚡', title: 'Rapide', text: 'Mobile Money instantané' },
]

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative flex">
      <AuroraBackground />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative z-10"
      >
        <motion.div
          variants={springScaleIn}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-white text-2xl font-black">T</span>
          </div>
          <span className="text-3xl font-extrabold tracking-tight gradient-text">
            TrustFund
          </span>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-10 max-w-md"
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.1]">
              La tontine digitale
              <span className="block gradient-text mt-2">100% transparente.</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-6 text-lg font-medium">
              Fini le cahier papier. Gérez vos tontines en toute confiance avec notre système automatisé.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} className="grid gap-4">
            {features.map((f, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp} 
                className="glass p-4 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform"
              >
                <div className="w-12 h-12 rounded-xl bg-white/50 dark:bg-slate-800/50 flex items-center justify-center text-2xl shadow-sm">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{f.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-slate-500 text-sm font-medium"
        >
          © 2026 TrustFund · Douala, Cameroun
        </motion.p>
      </motion.div>

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex lg:hidden flex-col items-center mb-10"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
              <span className="text-white text-2xl font-black">T</span>
            </div>
            <h1 className="text-2xl font-extrabold gradient-text tracking-tight">TrustFund</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">La tontine digitale transparente</p>
          </motion.div>
          
          <Suspense fallback={<div className="glass-card p-12 flex justify-center"><div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" /></div>}>
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  )
}
