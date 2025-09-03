import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ClueQuest - The Ultimate Problem-Solving Platform',
  description: 'Empowering global teams to solve complex challenges collaboratively. The world\'s most intuitive problem-solving platform.',
  keywords: ['problem solving', 'collaboration', 'teams', 'productivity', 'saas', 'cluequest'],
  authors: [{ name: 'ClueQuest Team' }],
  creator: 'ClueQuest',
  publisher: 'ClueQuest',
  robots: 'index, follow',
  
  // Open Graph / Social Media
  openGraph: {
    title: 'ClueQuest - The Ultimate Problem-Solving Platform',
    description: 'Empowering global teams to solve complex challenges collaboratively.',
    url: 'https://cluequest.empleaido.com',
    siteName: 'ClueQuest',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ClueQuest - Problem-Solving Platform',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'ClueQuest - The Ultimate Problem-Solving Platform',
    description: 'Empowering global teams to solve complex challenges collaboratively.',
    creator: '@cluequest',
    images: ['/og-image.png'],
  },

  // Additional meta tags
  other: {
    'theme-color': '#0ea5e9',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'ClueQuest',
    'application-name': 'ClueQuest',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#0ea5e9',
    'msapplication-config': '/browserconfig.xml',
  },

  // Verification tags
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },

  // Manifest
  manifest: '/manifest.json',

  // Canonical URL
  alternates: {
    canonical: 'https://cluequest.empleaido.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Performance hints */}
        <link rel="dns-prefetch" href="https://vercel.live" />
        
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ClueQuest",
              "description": "The world's most intuitive problem-solving platform for global teams",
              "url": "https://cluequest.empleaido.com",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "ClueQuest Team"
              }
            })
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div id="root">
          {children}
        </div>
        
        {/* Analytics - Add your tracking code here */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Vercel Analytics */}
            <script async src="https://cdn.vercel-insights.com/v1/script.js" />
            
            {/* Google Analytics - Replace with your GA4 ID */}
            {process.env.NEXT_PUBLIC_GA_ID && (
              <>
                <script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                />
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                    `,
                  }}
                />
              </>
            )}
          </>
        )}
      </body>
    </html>
  )
}