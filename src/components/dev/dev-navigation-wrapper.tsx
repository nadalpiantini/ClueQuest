'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Code2, X, Home, LogIn, Users } from 'lucide-react'

function DevNavigationWrapper() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Handle SSR - don't render until mounted on client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Don't render anything until mounted or in development
  if (!isMounted || process.env.NODE_ENV !== 'development') {
    return null
  }

  const routes = [
    { label: '🏠 Home', path: '/', icon: Home, desc: 'Landing page' },
    { label: '🚀 Onboard', path: '/onboard', icon: Users, desc: 'Auth & membership' },
    { label: '🧪 Test Auth', path: '/test-auth', icon: LogIn, desc: 'Auth test suite' },
    { label: '🏆 Dashboard', path: '/dashboard', icon: Home, desc: 'Main dashboard' },
  ]

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-full shadow-2xl border-2 border-amber-500/30 transition-all duration-200"
        title="Dev Navigation Panel"
      >
        <Code2 className="w-6 h-6" />
      </button>

      {/* Navigation Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="fixed bottom-24 right-6 z-50 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-amber-200">Dev Navigation</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Routes */}
            <div className="p-4 space-y-2">
              {routes.map((route, index) => (
                <Link
                  key={index}
                  href={route.path}
                  onClick={() => setIsOpen(false)}
                  className="block p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 hover:border-amber-500/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <route.icon className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="font-semibold text-white">{route.label}</div>
                      <div className="text-xs text-slate-400">{route.desc}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default DevNavigationWrapper