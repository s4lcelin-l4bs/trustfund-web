'use client'

import { motion } from 'framer-motion'

interface AvatarProps {
  src?: string | null
  initials?: string
  size?: number
  className?: string
  status?: 'online' | 'offline' | 'busy' | 'away'
  animate?: boolean
}

export function Avatar({
  src,
  initials,
  size = 40,
  className = '',
  status,
  animate = true,
}: AvatarProps) {
  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-400',
    busy: 'bg-red-500',
    away: 'bg-orange-500',
  }

  const containerClasses = [
    'relative inline-flex items-center justify-center rounded-full flex-shrink-0',
    'bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/60 dark:to-teal-900/60',
    'border-2 border-white/80 dark:border-white/10 shadow-sm',
    className,
  ].join(' ')

  const content = src ? (
    <img
      src={src}
      alt={initials || 'Avatar'}
      className="w-full h-full rounded-full object-cover"
    />
  ) : (
    <span
      className="text-emerald-700 dark:text-emerald-300 font-bold uppercase"
      style={{ fontSize: size * 0.4 }}
    >
      {initials || '?'}
    </span>
  )

  const AvatarWrapper = animate ? motion.div : 'div'
  const hoverProps = animate ? {
    whileHover: { scale: 1.05 },
    transition: { type: 'spring', stiffness: 400, damping: 17 }
  } : {}

  return (
    <AvatarWrapper
      className={containerClasses}
      style={{ width: size, height: size }}
      {...hoverProps as any}
    >
      {content}

      {status && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${statusColors[status]}`}
          style={{ transform: 'translate(10%, 10%)' }}
        >
          {status === 'online' && animate && (
            <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
          )}
        </span>
      )}
    </AvatarWrapper>
  )
}
