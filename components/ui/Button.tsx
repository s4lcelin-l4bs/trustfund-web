'use client'

import { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'glass' | 'gradient' | 'glow'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
  children: React.ReactNode
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  onClick,
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null)

  // Ripple effect
  const handleRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return
    const btn = btnRef.current
    if (!btn) return
    const circle = document.createElement('span')
    const rect = btn.getBoundingClientRect()
    const diameter = Math.max(btn.clientWidth, btn.clientHeight)
    const radius = diameter / 2
    circle.style.cssText = `
      position: absolute;
      width: ${diameter}px;
      height: ${diameter}px;
      left: ${e.clientX - rect.left - radius}px;
      top: ${e.clientY - rect.top - radius}px;
      border-radius: 50%;
      background: rgba(255,255,255,0.35);
      transform: scale(0);
      animation: ripple 0.55s linear;
      pointer-events: none;
    `
    btn.appendChild(circle)
    setTimeout(() => circle.remove(), 600)
    onClick?.(e)
  }, [disabled, isLoading, onClick])

  const base = [
    'relative inline-flex items-center justify-center font-semibold rounded-xl',
    'transition-all duration-200 overflow-hidden select-none',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500',
  ].join(' ')

  const variants = {
    primary: [
      'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
      'shadow-[0_4px_14px_rgba(5,150,105,0.35)]',
      'hover:shadow-[0_6px_20px_rgba(5,150,105,0.5)]',
      'hover:from-emerald-500 hover:to-teal-500',
    ].join(' '),

    gradient: [
      'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white',
      'shadow-[0_4px_14px_rgba(5,150,105,0.35)]',
      'hover:shadow-[0_6px_20px_rgba(5,150,105,0.5)]',
      'bg-[length:200%_100%] bg-left',
      'hover:bg-right transition-[background-position]',
    ].join(' '),

    glow: [
      'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
      'shadow-[0_0_20px_rgba(5,150,105,0.4),0_4px_14px_rgba(5,150,105,0.3)]',
      'hover:shadow-[0_0_35px_rgba(5,150,105,0.6),0_4px_20px_rgba(5,150,105,0.4)]',
    ].join(' '),

    glass: [
      'backdrop-blur-md bg-white/15 dark:bg-white/8',
      'border border-white/30 dark:border-white/10',
      'text-emerald-700 dark:text-emerald-300',
      'hover:bg-white/25 dark:hover:bg-white/12',
      'shadow-[0_4px_12px_rgba(0,0,0,0.06)]',
    ].join(' '),

    outline: [
      'border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400',
      'hover:bg-emerald-50 dark:hover:bg-emerald-950',
      'shadow-sm',
    ].join(' '),

    ghost: [
      'text-slate-600 dark:text-slate-400',
      'hover:bg-slate-100 dark:hover:bg-slate-800',
    ].join(' '),

    danger: [
      'bg-gradient-to-r from-red-500 to-rose-500 text-white',
      'shadow-[0_4px_14px_rgba(239,68,68,0.3)]',
      'hover:shadow-[0_6px_20px_rgba(239,68,68,0.45)]',
    ].join(' '),
  }

  const sizes = {
    sm:   'text-xs px-3 py-1.5 gap-1.5',
    md:   'text-sm px-4 py-2.5 gap-2',
    lg:   'text-base px-6 py-3.5 gap-2.5',
    icon: 'w-10 h-10 p-0',
  }

  const isDisabled = disabled || isLoading

  return (
    <motion.button
      ref={btnRef as any}
      whileTap={isDisabled ? {} : { scale: 0.96 }}
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isDisabled}
      onClick={handleRipple}
      {...(props as any)}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
            className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
          />
          <span className="opacity-80">Chargement...</span>
        </span>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  )
}