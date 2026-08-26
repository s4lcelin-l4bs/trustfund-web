'use client'

import { useState, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'glass' | 'solid'
}

export function Input({
  label,
  error,
  hint,
  className = '',
  leftIcon,
  rightIcon,
  variant = 'glass',
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const id = useId()

  const variantBase = {
    glass: [
      'backdrop-blur-md bg-white/60 dark:bg-white/5',
      'border border-white/50 dark:border-white/8',
    ].join(' '),
    solid: [
      'bg-white dark:bg-slate-800',
      'border border-slate-200 dark:border-slate-600',
    ].join(' '),
  }

  const focusedBorder = error
    ? 'border-red-400 dark:border-red-500'
    : isFocused
    ? 'border-emerald-400 dark:border-emerald-500'
    : ''

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-semibold text-slate-700 dark:text-slate-300 select-none"
        >
          {label}
        </label>
      )}

      <motion.div
        animate={{
          boxShadow: error
            ? '0 0 0 3px rgba(239,68,68,0.15)'
            : isFocused
            ? '0 0 0 3px rgba(5,150,105,0.18), 0 4px 12px rgba(5,150,105,0.08)'
            : '0 0 0 0px transparent',
        }}
        transition={{ duration: 0.2 }}
        className="rounded-xl"
      >
        <div className={[
          'flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all duration-200',
          variantBase[variant],
          focusedBorder,
          error ? 'border-red-400' : '',
        ].join(' ')}>
          {leftIcon && (
            <span className={[
              'flex-shrink-0 transition-colors duration-200',
              isFocused ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500',
            ].join(' ')}>
              {leftIcon}
            </span>
          )}

          <input
            id={id}
            className={[
              'flex-1 text-sm bg-transparent outline-none',
              'text-slate-900 dark:text-slate-100',
              'placeholder:text-slate-400 dark:placeholder:text-slate-500',
              className,
            ].join(' ')}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {rightIcon && (
            <span className={[
              'flex-shrink-0 transition-colors duration-200',
              isFocused ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500',
            ].join(' ')}>
              {rightIcon}
            </span>
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-red-500 dark:text-red-400 font-medium"
          >
            ⚠ {error}
          </motion.p>
        ) : hint ? (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-slate-400 dark:text-slate-500"
          >
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}