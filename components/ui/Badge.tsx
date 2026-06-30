import { TransactionStatus, CycleStatus, TurnStatus } from '@/types'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral'

interface BadgeProps {
  variant: BadgeVariant
  label: string
}

export function Badge({ variant, label }: BadgeProps) {
  const styles = {
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-orange-100 text-orange-700',
    danger:  'bg-red-100 text-red-700',
    neutral: 'bg-gray-100 text-gray-600',
  }

  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[variant]}`}>
      {label}
    </span>
  )
}

// Helpers pour ne pas répéter la logique variant dans chaque écran
export function TransactionBadge({ status }: { status: TransactionStatus }) {
  const map: Record<TransactionStatus, { variant: BadgeVariant; label: string }> = {
    confirmed: { variant: 'success', label: 'Payé' },
    pending:   { variant: 'warning', label: 'En attente' },
    failed:    { variant: 'danger',  label: 'Échoué' },
  }
  const { variant, label } = map[status]
  return <Badge variant={variant} label={label} />
}

export function TurnBadge({ status }: { status: TurnStatus }) {
  const map: Record<TurnStatus, { variant: BadgeVariant; label: string }> = {
    paid_out: { variant: 'success', label: 'Versé' },
    pending:  { variant: 'warning', label: 'En attente' },
    skipped:  { variant: 'neutral', label: 'Passé' },
  }
  const { variant, label } = map[status]
  return <Badge variant={variant} label={label} />
}