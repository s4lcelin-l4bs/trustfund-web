import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToasterProvider } from '@/components/ToasterProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import { PageTransitionProvider } from '@/components/PageTransitionProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TrustFund',
  description: 'La tontine digitale transparente',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <PageTransitionProvider>
            {children}
            <ToasterProvider />
          </PageTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}