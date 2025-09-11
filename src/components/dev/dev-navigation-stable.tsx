'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Code2, 
  X, 
  Home,
  LogIn,
  Users,
  Trophy,
  Target,
  Gamepad2,
  Palette,
  Crown,
  Eye,
  Settings,
  Zap,
  Play,
  UserPlus,
  Compass,
  Camera,
  RefreshCw
} from 'lucide-react'

interface DevRoute {
  id: string
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  category: 'workflow' | 'page' | 'tool'
  color: string
}

const DEV_ROUTES: DevRoute[] = [
  // Workflow Routes
  {
    id: 'host-dashboard',
    label: '🎭 Host Dashboard',
    path: '/dashboard',
    icon: Crown,
    description: 'Full creator dashboard with analytics',
    category: 'workflow',
    color: 'amber'
  },
  {
    id: 'guest-game',
    label: '🕵️ Guest Game Panel',
    path: '/join?dev=guest&code=DEMO01&name=DevGuest',
    icon: Target,
    description: 'Player panel with active challenge',
    category: 'workflow', 
    color: 'purple'
  },
  {
    id: 'adventure-hub',
    label: '🎮 Adventure Hub',
    path: '/adventure-hub',
    icon: Compass,
    description: 'Central game management',
    category: 'workflow',
    color: 'blue'
  },
  
  // Page Routes
  {
    id: 'homepage',
    label: '🏠 Homepage',
    path: '/',
    icon: Home,
    description: 'Landing page experience',
    category: 'page',
    color: 'green'
  },
  {
    id: 'login',
    label: '🔐 Login',
    path: '/auth/login',
    icon: LogIn,
    description: 'Auth with dev workflows',
    category: 'page',
    color: 'slate'
  },
  {
    id: 'join',
    label: '⚡ Join',
    path: '/join',
    icon: Users,
    description: 'Join adventure form',
    category: 'page',
    color: 'emerald'
  },
  {
    id: 'builder',
    label: '🎨 Builder',
    path: '/builder',
    icon: Palette,
    description: 'Adventure creation wizard',
    category: 'page',
    color: 'orange'
  },
  {
    id: 'challenges',
    label: '🎯 Challenges',
    path: '/challenges',
    icon: Target,
    description: 'Challenge interface',
    category: 'page',
    color: 'red'
  },
  {
    id: 'ranking',
    label: '📊 Rankings',
    path: '/ranking',
    icon: Trophy,
    description: 'Leaderboard display',
    category: 'page',
    color: 'yellow'
  },
  {
    id: 'avatar',
    label: '🤖 Avatar Gen',
    path: '/avatar-generation',
    icon: UserPlus,
    description: 'AI avatar creation',
    category: 'page',
    color: 'pink'
  },
  {
    id: 'intro',
    label: '📖 Intro',
    path: '/intro?dev=true',
    icon: Play,
    description: 'Adventure introduction',
    category: 'page',
    color: 'indigo'
  },
  {
    id: 'qr-scan',
    label: '📱 QR Scan',
    path: '/qr-scan',
    icon: Camera,
    description: 'QR code scanning interface',
    category: 'page',
    color: 'teal'
  },
  {
    id: 'adventure-selection',
    label: '🎲 Adventure Selection',
    path: '/adventure-selection',
    icon: Gamepad2,
    description: 'Choose adventure type',
    category: 'page',
    color: 'violet'
  },
  {
    id: 'create',
    label: '⚡ Create',
    path: '/create',
    icon: Zap,
    description: 'Adventure creation flow',
    category: 'page',
    color: 'cyan'
  },
  
  // Dev Tools
  {
    id: 'reset-state',
    label: '🔄 Reset State',
    path: '#reset',
    icon: RefreshCw,
    description: 'Clear all dev data',
    category: 'tool',
    color: 'gray'
  }
]

export default function DevNavigationStable() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState<'host' | 'guest' | 'anonymous'>('anonymous')
  const [isMounted, setIsMounted] = useState(false)
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  // Handle SSR - don't render until mounted on client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Don't render anything until mounted
  if (!isMounted) {
    return null
  }

  useEffect(() => {
    if (!isMounted) return

    // Detect current role from localStorage
    try {
      const demoAuth = localStorage.getItem('demo-auth')
      const demoUser = localStorage.getItem('demo-user')
      
      if (demoAuth && demoUser) {
        const user = JSON.parse(demoUser)
        if (user.email?.includes('host')) {
          setCurrentRole('host')
        } else if (user.email?.includes('guest')) {
          setCurrentRole('guest')
        } else {
          setCurrentRole('anonymous')
        }
      }
    } catch {
      setCurrentRole('anonymous')
    }

    // Keyboard shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault()
        setIsOpen(!isOpen)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMounted, isOpen])

  const handleRouteClick = (route: DevRoute) => {
    if (route.id === 'reset-state') {
      // Reset all dev state
      try {
        localStorage.removeItem('demo-auth')
        localStorage.removeItem('demo-user')
        localStorage.removeItem('cluequest_participant')
        localStorage.removeItem('cluequest_session')
        setCurrentRole('anonymous')
        window.location.reload()
      } catch {
        // Ignore localStorage errors
      }
      return
    }
  }

  const getRoleIcon = () => {
    switch (currentRole) {
      case 'host': return '🎭'
      case 'guest': return '🕵️' 
      default: return '👤'
    }
  }

  const getRoleColor = () => {
    switch (currentRole) {
      case 'host': return 'text-amber-400'
      case 'guest': return 'text-purple-400'
      default: return 'text-slate-400'
    }
  }

  const groupedRoutes = {
    workflow: DEV_ROUTES.filter(r => r.category === 'workflow'),
    page: DEV_ROUTES.filter(r => r.category === 'page'),
    tool: DEV_ROUTES.filter(r => r.category === 'tool')
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-full shadow-2xl border-2 border-amber-500/30 hover:border-amber-400/50 transition-all duration-200"
        title="Dev Navigation Panel (Ctrl+D)"
      >
        <div className="relative">
          <Code2 className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-black">{getRoleIcon()}</span>
          </div>
        </div>
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
          <div className="fixed bottom-24 right-6 z-50 w-96 max-h-[70vh] bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-amber-200">Dev Navigation</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className={`text-sm font-semibold ${getRoleColor()}`}>
                  Current Role: {getRoleIcon()} {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
                </div>
                <div className="text-xs text-slate-500">
                  Ctrl+D to toggle
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-96">
              {/* Workflows */}
              <div className="p-4">
                <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  Workflows
                </h3>
                <div className="space-y-2">
                  {groupedRoutes.workflow.map((route) => (
                    <Link
                      key={route.id}
                      href={route.path}
                      onClick={() => handleRouteClick(route)}
                      className={`block p-3 rounded-lg bg-${route.color}-500/10 hover:bg-${route.color}-500/20 border border-${route.color}-500/20 hover:border-${route.color}-400/40 transition-all duration-200 group`}
                    >
                      <div className="flex items-center gap-3">
                        <route.icon className={`w-5 h-5 text-${route.color}-400`} />
                        <div className="flex-1">
                          <div className={`font-semibold text-${route.color}-200`}>{route.label}</div>
                          <div className="text-xs text-slate-400">{route.description}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Pages */}
              <div className="p-4 border-t border-slate-700/30">
                <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Pages
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {groupedRoutes.page.map((route) => (
                    <Link
                      key={route.id}
                      href={route.path}
                      onClick={() => handleRouteClick(route)}
                      className={`block p-3 rounded-lg bg-${route.color}-500/10 hover:bg-${route.color}-500/20 border border-${route.color}-500/20 hover:border-${route.color}-400/40 transition-all duration-200 text-center group`}
                    >
                      <route.icon className={`w-5 h-5 text-${route.color}-400 mx-auto mb-1`} />
                      <div className={`text-sm font-semibold text-${route.color}-200`}>{route.label}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div className="p-4 border-t border-slate-700/30">
                <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Tools
                </h3>
                <div className="space-y-2">
                  {groupedRoutes.tool.map((route) => (
                    <button
                      key={route.id}
                      onClick={() => handleRouteClick(route)}
                      className={`w-full block p-3 rounded-lg bg-${route.color}-500/10 hover:bg-${route.color}-500/20 border border-${route.color}-500/20 hover:border-${route.color}-400/40 transition-all duration-200 group text-left`}
                    >
                      <div className="flex items-center gap-3">
                        <route.icon className={`w-5 h-5 text-${route.color}-400`} />
                        <div className="flex-1">
                          <div className={`font-semibold text-${route.color}-200`}>{route.label}</div>
                          <div className="text-xs text-slate-400">{route.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
