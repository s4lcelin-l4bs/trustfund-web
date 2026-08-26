'use client'

import { useEffect, useRef } from 'react'
import { apiClient } from '@/lib/api/client'

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function useWebPush(enabled = true) {
  const subscribed = useRef(false)

  useEffect(() => {
    if (!enabled || subscribed.current) return
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

    async function subscribe() {
      try {
        // 1. Register SW
        const registration = await navigator.serviceWorker.register('/sw.js')
        await navigator.serviceWorker.ready

        // 2. Check existing subscription
        const existing = await registration.pushManager.getSubscription()
        if (existing) {
          subscribed.current = true
          return
        }

        // 3. Request permission
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') return

        // 4. Fetch VAPID public key from backend
        const { data } = await apiClient.get<{ success: boolean; data: { publicKey: string } }>(
          '/notifications/vapid-public-key'
        )
        const publicKey = data.data.publicKey
        if (!publicKey) return

        // 5. Subscribe
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey).buffer as ArrayBuffer
        })

        // 6. Send subscription to backend
        await apiClient.post('/notifications/subscribe', subscription.toJSON())
        subscribed.current = true
        console.log('[WebPush] Subscribed successfully.')
      } catch (err) {
        console.error('[WebPush] Error subscribing:', err)
      }
    }

    subscribe()
  }, [enabled])
}
