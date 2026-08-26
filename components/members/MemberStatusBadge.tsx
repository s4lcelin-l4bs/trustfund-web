import { Badge } from '@/components/ui/Badge'
import { OrganizationMemberStatus } from '@/types'

const statusConfig: Record<OrganizationMemberStatus, { variant: 'success' | 'warning' | 'danger'; label: string }> = {
  active: { variant: 'success', label: 'Actif' },
  inactive: { variant: 'warning', label: 'Inactif' },
  suspended: { variant: 'danger', label: 'Suspendu' },
}

export function MemberStatusBadge({ status }: { status: OrganizationMemberStatus }) {
  const config = statusConfig[status]
  return <Badge variant={config.variant} label={config.label} dot />
}
