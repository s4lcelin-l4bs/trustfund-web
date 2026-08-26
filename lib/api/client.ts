import axios from 'axios'
import { useAuthStore } from '../../store/useAuthStore'
import { useActiveOrganizationStore } from '../../store/useActiveOrganizationStore'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to attach the access token, and to inject the
// currently active organization (organizationId) into requests that don't
// already carry it — GET query params and JSON bodies. Endpoints already
// nested under /organizations/:organizationId/... simply ignore the extra
// (unused) field.
apiClient.interceptors.request.use(
  (config) => {
    // We fetch the token directly from the Zustand store
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    const activeOrganizationId = useActiveOrganizationStore.getState().activeOrganizationId
    if (activeOrganizationId) {
      if ((config.method === 'get' || config.method === 'GET')) {
        config.params = { organizationId: activeOrganizationId, ...(config.params || {}) }
      } else if (config.data && typeof config.data === 'object' && !Array.isArray(config.data)) {
        if ((config.data as Record<string, unknown>).organizationId === undefined) {
          config.data = { organizationId: activeOrganizationId, ...(config.data as Record<string, unknown>) }
        }
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle errors globally (e.g. 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // In a more complex app, this is where we would implement token refresh logic.
      // For now, if we get 401, we just logout the user (clear store).
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)
