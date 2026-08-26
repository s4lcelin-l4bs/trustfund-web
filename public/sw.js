// public/sw.js - TrustFund Service Worker
const VERSION = '1.0.0'

self.addEventListener('install', (event) => {
  console.log('[SW] Installing v' + VERSION)
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('[SW] Activated')
  event.waitUntil(self.clients.claim())
})

// Handle push events from the server
self.addEventListener('push', (event) => {
  if (!event.data) return

  let payload
  try {
    payload = event.data.json()
  } catch {
    payload = { title: 'TrustFund', body: event.data.text() }
  }

  const title = payload.title || 'TrustFund'
  const options = {
    body: payload.body || '',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: payload.url || '/dashboard/notifications',
      dateOfArrival: Date.now()
    },
    actions: [
      { action: 'view', title: 'Voir' },
      { action: 'dismiss', title: 'Ignorer' }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  const action = event.action
  const url = event.notification.data?.url || '/dashboard/notifications'

  event.notification.close()

  if (action === 'dismiss') return

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Focus existing window if open
      const client = clients.find(c => c.url.includes(self.location.origin))
      if (client) {
        client.focus()
        client.navigate(url)
      } else {
        self.clients.openWindow(url)
      }
    })
  )
})
