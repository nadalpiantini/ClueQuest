'use client'

import { useEffect, useState } from 'react'

interface BodyWrapperProps {
  children: React.ReactNode
  className?: string
}

export function BodyWrapper({ children, className }: BodyWrapperProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Clean up any browser extension attributes that might cause hydration issues
    // This prevents the "data-atm-ext-installed" and similar attributes from causing
    // hydration mismatches between server and client rendering
    const body = document.body
    if (body) {
      // Remove common browser extension attributes that cause hydration mismatches
      const extensionAttributes = [
        'data-atm-ext-installed',
        'data-extension-installed',
        'data-browser-extension'
      ]
      
      extensionAttributes.forEach(attr => {
        if (body.hasAttribute(attr)) {
          body.removeAttribute(attr)
        }
      })
    }
  }, [])

  // During SSR and initial hydration, use suppressHydrationWarning
  // After hydration, render normally to avoid the warning
  if (!mounted) {
    return (
      <body className={className} suppressHydrationWarning={true}>
        {children}
      </body>
    )
  }

  return (
    <body className={className}>
      {children}
    </body>
  )
}
