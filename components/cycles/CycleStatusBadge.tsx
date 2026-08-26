import { Badge } from '@/components/ui/Badge'
import { OrganizationCycleStatus } from '@/types'

const statusConfig: Record<OrganizationCycleStatus, { variant: 'success' | 'warning' | 'neutral' | 'info'; label: string }> = {
  draft: { variant: 'neutral', label: 'Brouillon' },
  active: { variant: 'success', label: 'Actif' },
  closed: { variant: 'warning', label: 'Clôturé' },
  archived: { variant: 'info', label: 'Archivé' },
}

export function CycleStatusBadge({ status }: { status: OrganizationCycleStatus }) {
  const config = statusConfig[status]
  return <Badge variant={config.variant} label={config.label} dot />
}
