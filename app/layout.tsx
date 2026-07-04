import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { ToasterProvider } from '@/components/ToasterProvider'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

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
    <html lang="fr">
      <body className={geist.className}>
        {children}
        <ToasterProvider />
      </body>
    </html>
  )
}