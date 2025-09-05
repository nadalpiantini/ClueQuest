import { Metadata, Viewport } from 'next'
import { AdventureProvider } from '@/components/adventure/adventure-provider'
import { RealtimeProvider } from '@/components/adventure/realtime-provider'

export const metadata: Metadata = {
  title: 'Adventure - ClueQuest',
  description: 'Interactive adventure experience with AR, QR codes, and real-time multiplayer',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ClueQuest Adventure',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0ea5e9'
}

interface AdventureLayoutProps {
  children: React.ReactNode
}

export default function AdventureLayout({ children }: AdventureLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* PWA Status Bar Spacer */}
      <div className="pt-safe" />
      
      {/* Adventure Context Providers */}
      <AdventureProvider>
        <RealtimeProvider>
          {/* Full Height Container with Safe Areas */}
          <div className="min-h-screen pb-safe">
            {children}
          </div>
        </RealtimeProvider>
      </AdventureProvider>
    </div>
  )
}