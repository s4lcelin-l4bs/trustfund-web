'use client'

import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  animate?: boolean
}

export function Card({
  children,
  className = '',
  onClick,
  animate = false,
}: CardProps) {
  const Wrapper = animate ? motion.div : 'div'
  const animateProps = animate
    ? {
        whileHover: onClick ? { y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' } : {},
        whileTap: onClick ? { scale: 0.99 } : {},
        transition: { duration: 0.2 },
      }
    : {}

  return (
    <Wrapper
      onClick={onClick}
      className={`
        bg-white border border-slate-100 rounded-2xl p-4
        shadow-sm transition-shadow duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...animateProps}
    >
      {children}
    </Wrapper>
  )
}