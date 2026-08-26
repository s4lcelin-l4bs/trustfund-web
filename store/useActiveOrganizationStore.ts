import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ActiveOrganizationState {
  activeOrganizationId: string | null
  setActiveOrganizationId: (organizationId: string) => void
  clearActiveOrganizationId: () => void
}

/**
 * Organisation "active" côté client : injectée automatiquement dans les
 * requêtes vers les modules qui ne sont pas nestés sous
 * /organizations/:organizationId/... (cotisations, dépenses, amendes,
 * pénalités, prêts, épargne, calendrier, comptabilité, dashboard).
 *
 * Elle est définie quand l'utilisateur entre dans une organisation
 * (voir app/dashboard/organizations/[organizationId]/page.tsx).
 */
export const useActiveOrganizationStore = create<ActiveOrganizationState>()(
  persist(
    (set) => ({
      activeOrganizationId: null,
      setActiveOrganizationId: (organizationId) => set({ activeOrganizationId: organizationId }),
      clearActiveOrganizationId: () => set({ activeOrganizationId: null }),
    }),
    {
      name: 'trustfund-active-organization',
    }
  )
)
