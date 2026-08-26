import { useEffect, useState, useCallback } from 'react'
import { getMyMembership, MyMembership } from '@/lib/api/organizationMembers'

interface UseMyPermissionsResult {
  isLoading: boolean
  isOwner: boolean
  permissionKeys: string[]
  hasPermission: (key: string) => boolean
  membership: MyMembership | null
}

/**
 * Charge le rôle/les permissions de l'utilisateur connecté pour une
 * organisation donnée. À utiliser pour masquer côté UI les actions
 * réservées au propriétaire ou à un rôle disposant d'une permission
 * particulière (ex: 'manage_roles', 'manage_members', 'manage_organization').
 *
 * Le backend applique de toute façon la vérification définitive : ce hook
 * sert uniquement à adapter l'affichage, pas à sécuriser l'accès.
 */
export function useMyPermissions(organizationId: string | undefined): UseMyPermissionsResult {
  const [membership, setMembership] = useState<MyMembership | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!organizationId) return
    let cancelled = false
    setIsLoading(true)
    getMyMembership(organizationId)
      .then((data) => {
        if (!cancelled) setMembership(data)
      })
      .catch(() => {
        if (!cancelled) setMembership(null)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [organizationId])

  const hasPermission = useCallback(
    (key: string) => !!membership && (membership.isOwner || membership.permissionKeys.includes(key)),
    [membership]
  )

  return {
    isLoading,
    isOwner: membership?.isOwner ?? false,
    permissionKeys: membership?.permissionKeys ?? [],
    hasPermission,
    membership,
  }
}
