'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/useAuthStore'
import { AuroraBackground } from '@/components/layout/AuroraBackground'
import { GlassNavbar } from '@/components/layout/GlassNavbar'
import { GlassBottomNav } from '@/components/layout/GlassBottomNav'
import { GlassSpinner } from '@/components/ui/Spinner'
import { useWebPush } from '@/hooks/useWebPush'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, _hasHydrated } = useAuthStore()

  // Register Service Worker and subscribe to Web Push once authenticated
  useWebPush(isAuthenticated)

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, _hasHydrated, router])

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <AuroraBackground />
        <GlassSpinner size={40} className="z-10" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen relative">
      <AuroraBackground />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <GlassNavbar />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-24 pb-28 sm:pb-8">
          {children}
        </main>

        <GlassBottomNav />
      </div>
    </div>
  )
}
