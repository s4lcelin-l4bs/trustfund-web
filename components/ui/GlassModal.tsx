'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface GlassModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  showParticles?: boolean
  title?: string
}

export function GlassModal({
  isOpen,
  onClose,
  children,
  className = '',
  showParticles = true,
  title,
}: GlassModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Particles (Optional) */}
          {showParticles && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 0,
                    x: Math.random() * window.innerWidth,
                    y: window.innerHeight + 100
                  }}
                  animate={{ 
                    opacity: [0, 0.5, 0],
                    y: -100,
                    x: `calc(${Math.random() * 100}vw - 50px)`
                  }}
                  transition={{ 
                    duration: 5 + Math.random() * 5,
                    repeat: Infinity,
                    delay: Math.random() * 5
                  }}
                  className="absolute w-2 h-2 rounded-full bg-emerald-400/30 blur-[1px]"
                />
              ))}
            </div>
          )}

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={[
              'relative w-full max-w-lg z-10 overflow-hidden',
              'backdrop-blur-xl bg-white/80 dark:bg-slate-900/80',
              'border border-white/50 dark:border-white/10',
              'shadow-[0_24px_48px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.2)]',
              'rounded-3xl',
              className,
            ].join(' ')}
          >
            {/* Top reflection */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
            
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
