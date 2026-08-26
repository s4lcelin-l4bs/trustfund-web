import { motion } from 'framer-motion'

export function GlassSpinner({ className = '', size = 24 }: { className?: string, size?: number }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      style={{ width: size, height: size }}
      className={`rounded-full border-2 border-emerald-500/30 border-t-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] ${className}`}
    />
  )
}

export function GradientSpinner({ className = '', size = 24 }: { className?: string, size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center ${className}`}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-emerald-500 border-r-teal-500"
      />
      <div className="absolute inset-1 bg-white dark:bg-slate-900 rounded-full" />
    </div>
  )
}

export function DotsSpinner({ className = '' }: { className?: string }) {
  const dotVariants = {
    animate: { y: [0, -8, 0], opacity: [0.5, 1, 0.5] }
  }
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          variants={dotVariants}
          animate="animate"
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
        />
      ))}
    </div>
  )
}
