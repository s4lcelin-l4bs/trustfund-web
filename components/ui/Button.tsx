'use client'

import { motion } from 'framer-motion'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const base =
    'relative inline-flex items-center justify-center font-medium rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden'

  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200',
    outline: 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50',
    ghost:   'text-slate-600 hover:bg-slate-100',
    danger:  'bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-200',
  }

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3',
  }

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.01 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...(props as any)}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
          />
          Chargement...
        </span>
      ) : children}
    </motion.button>
  )
}