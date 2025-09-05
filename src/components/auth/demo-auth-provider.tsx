'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface DemoUser {
  email: string
  name: string
}

interface DemoAuthContextType {
  isDemoAuthenticated: boolean
  demoUser: DemoUser | null
  login: (user: DemoUser) => void
  logout: () => void
}

const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined)

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const [isDemoAuthenticated, setIsDemoAuthenticated] = useState(false)
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null)

  useEffect(() => {
    // Check for existing demo authentication on mount
    const demoAuth = localStorage.getItem('demo-auth')
    const userData = localStorage.getItem('demo-user')
    
    if (demoAuth === 'true' && userData) {
      try {
        const user = JSON.parse(userData)
        setIsDemoAuthenticated(true)
        setDemoUser(user)
      } catch (error) {
        localStorage.removeItem('demo-auth')
        localStorage.removeItem('demo-user')
      }
    }
  }, [])

  const login = (user: DemoUser) => {
    localStorage.setItem('demo-auth', 'true')
    localStorage.setItem('demo-user', JSON.stringify(user))
    setIsDemoAuthenticated(true)
    setDemoUser(user)
  }

  const logout = () => {
    localStorage.removeItem('demo-auth')
    localStorage.removeItem('demo-user')
    setIsDemoAuthenticated(false)
    setDemoUser(null)
  }

  return (
    <DemoAuthContext.Provider value={{ isDemoAuthenticated, demoUser, login, logout }}>
      {children}
    </DemoAuthContext.Provider>
  )
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext)
  if (context === undefined) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider')
  }
  return context
}
