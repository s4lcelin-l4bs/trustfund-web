'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  variant?: 'glass' | 'solid' | 'gradient' | 'elevated' | 'glow'
  animate?: boolean
  tilt?: boolean
  noPadding?: boolean
}

export function Card({
  children,
  className = '',
  onClick,
  variant = 'glass',
  animate = true,
  tilt = false,
  noPadding = false,
}: CardProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !animate) return
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) / (rect.width / 2)
    const deltaY = (e.clientY - centerY) / (rect.height / 2)
    setRotateX(-deltaY * 4)
    setRotateY(deltaX * 4)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  const variantStyles = {
    glass: [
      'backdrop-blur-xl bg-white/72 dark:bg-slate-900/75',
      'border border-white/50 dark:border-white/8',
      'shadow-[0_8px_32px_rgba(5,150,105,0.08),0_2px_8px_rgba(0,0,0,0.04)]',
    ].join(' '),

    solid: [
      'bg-white dark:bg-slate-800',
      'border border-slate-100 dark:border-slate-700',
      'shadow-[0_2px_8px_rgba(0,0,0,0.06)]',
    ].join(' '),

    gradient: [
      'bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70',
      'backdrop-blur-xl border border-white/50 dark:border-white/8',
      'shadow-[0_8px_32px_rgba(5,150,105,0.08)]',
    ].join(' '),

    elevated: [
      'bg-white dark:bg-slate-800',
      'border border-slate-100/80 dark:border-slate-700/60',
      'shadow-[0_12px_40px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)]',
    ].join(' '),

    glow: [
      'backdrop-blur-xl bg-white/72 dark:bg-slate-900/75',
      'border border-emerald-200/50 dark:border-emerald-800/30',
      'shadow-[0_0_30px_rgba(5,150,105,0.12),0_8px_32px_rgba(5,150,105,0.08)]',
    ].join(' '),
  }

  const hoverProps = animate && onClick ? {
    whileHover: { y: -3, boxShadow: '0 16px 48px rgba(5,150,105,0.14), 0 4px 12px rgba(0,0,0,0.06)' },
    whileTap: { scale: 0.99 },
    transition: { duration: 0.2 },
  } : {}

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={tilt ? handleMouseMove : undefined}
      onMouseLeave={tilt ? handleMouseLeave : undefined}
      style={tilt ? {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.15s ease',
      } : {}}
      className={[
        'rounded-2xl relative overflow-hidden',
        !noPadding && 'p-4',
        onClick && 'cursor-pointer',
        variantStyles[variant],
        className,
      ].filter(Boolean).join(' ')}
      {...hoverProps}
    >
      {/* Top light reflection */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
        }}
      />
      {children}
    </motion.div>
  )
}