import { motion } from 'framer-motion'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'info' | 'emerald'

interface BadgeProps {
  variant: BadgeVariant
  label: string
  pulse?: boolean
  dot?: boolean
}

const styles: Record<BadgeVariant, string> = {
  success: [
    'bg-emerald-100/80 dark:bg-emerald-900/40',
    'text-emerald-700 dark:text-emerald-300',
    'border border-emerald-200/60 dark:border-emerald-700/40',
    'shadow-[0_0_8px_rgba(16,185,129,0.15)]',
  ].join(' '),
  warning: [
    'bg-orange-100/80 dark:bg-orange-900/30',
    'text-orange-700 dark:text-orange-300',
    'border border-orange-200/60 dark:border-orange-700/40',
    'shadow-[0_0_8px_rgba(234,88,12,0.12)]',
  ].join(' '),
  danger: [
    'bg-red-100/80 dark:bg-red-900/30',
    'text-red-700 dark:text-red-300',
    'border border-red-200/60 dark:border-red-700/40',
    'shadow-[0_0_8px_rgba(239,68,68,0.12)]',
  ].join(' '),
  neutral: [
    'bg-slate-100/80 dark:bg-slate-700/50',
    'text-slate-600 dark:text-slate-300',
    'border border-slate-200/50 dark:border-slate-600/40',
  ].join(' '),
  info: [
    'bg-blue-100/80 dark:bg-blue-900/30',
    'text-blue-700 dark:text-blue-300',
    'border border-blue-200/60 dark:border-blue-700/40',
    'shadow-[0_0_8px_rgba(59,130,246,0.12)]',
  ].join(' '),
  emerald: [
    'bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40',
    'text-emerald-700 dark:text-emerald-300',
    'border border-emerald-200/60 dark:border-emerald-700/40',
    'shadow-[0_0_10px_rgba(5,150,105,0.18)]',
  ].join(' '),
}

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-orange-500',
  danger:  'bg-red-500',
  neutral: 'bg-slate-400',
  info:    'bg-blue-500',
  emerald: 'bg-emerald-500',
}

export function Badge({ variant, label, pulse = false, dot = false }: BadgeProps) {
  return (
    <span className={[
      'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full',
      'backdrop-blur-sm transition-all duration-200',
      styles[variant],
    ].join(' ')}>
      {dot && (
        <span className={[
          'w-1.5 h-1.5 rounded-full flex-shrink-0',
          dotColors[variant],
          pulse ? 'animate-pulse' : '',
        ].join(' ')} />
      )}
      {label}
    </span>
  )
}

export function ContributionStatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string; pulse?: boolean }> = {
    paid:    { variant: 'success', label: 'Payé' },
    partial: { variant: 'info',    label: 'Partiel' },
    late:    { variant: 'danger',  label: 'En retard' },
    advance: { variant: 'emerald', label: 'Avance' },
    pending: { variant: 'warning', label: 'En attente', pulse: true },
  }
  const config = map[status] ?? { variant: 'neutral' as BadgeVariant, label: status }
  return <Badge {...config} dot />
}