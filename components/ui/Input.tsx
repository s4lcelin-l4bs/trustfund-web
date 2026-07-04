'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      )}
      <motion.div
        animate={{
          boxShadow: isFocused
            ? '0 0 0 3px rgba(5, 150, 105, 0.15)'
            : '0 0 0 0px rgba(5, 150, 105, 0)',
        }}
        transition={{ duration: 0.2 }}
        className="rounded-xl"
      >
        <input
          className={`
            w-full px-4 py-2.5 rounded-xl border text-sm bg-white
            outline-none transition-colors duration-200
            ${error
              ? 'border-red-400'
              : isFocused
                ? 'border-emerald-500'
                : 'border-slate-200'
            }
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}