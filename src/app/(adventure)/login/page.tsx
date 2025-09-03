'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, User, Wifi, WifiOff, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  guestName: z.string().min(2, 'Name must be at least 2 characters').optional(),
})

type LoginForm = z.infer<typeof loginSchema>

type ConnectionStatus = 'online' | 'offline' | 'checking' | 'unstable'
type LoginMethod = 'email' | 'guest' | 'sso'

function AdventureLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionCode = searchParams.get('session')
  const language = searchParams.get('lang') || 'en'

  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email')
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [sessionInfo, setSessionInfo] = useState<any>(null)

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      guestName: ''
    }
  })

  // Monitor network connection
  useEffect(() => {
    const checkConnection = () => {
      if (!navigator.onLine) {
        setConnectionStatus('offline')
        return
      }

      // Test connection with a quick ping to our API
      fetch('/api/health', { method: 'HEAD', cache: 'no-cache' })
        .then(() => setConnectionStatus('online'))
        .catch(() => setConnectionStatus('unstable'))
    }

    // Initial check
    checkConnection()

    // Set up listeners
    const handleOnline = () => setConnectionStatus('online')
    const handleOffline = () => setConnectionStatus('offline')

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Periodic connection check
    const connectionCheck = setInterval(checkConnection, 30000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(connectionCheck)
    }
  }, [])

  // Load session info if session code provided
  useEffect(() => {
    if (sessionCode && connectionStatus === 'online') {
      loadSessionInfo(sessionCode)
    }
  }, [sessionCode, connectionStatus])

  const loadSessionInfo = async (code: string) => {
    try {
      const response = await fetch(`/api/sessions/info?code=${code}`)
      if (response.ok) {
        const data = await response.json()
        setSessionInfo(data)
      } else {
        setError('Session not found or expired')
      }
    } catch (error) {
      console.error('Failed to load session info:', error)
      setError('Unable to connect to session')
    }
  }

  const handleEmailLogin = async (data: LoginForm) => {
    setIsLoading(true)
    setError('')

    try {
      // TODO: Implement Supabase Auth integration
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          sessionCode,
          language
        })
      })

      const result = await response.json()

      if (response.ok) {
        // Redirect to intro story or role selection based on session state
        if (sessionCode) {
          router.push(`/intro?session=${sessionCode}`)
        } else {
          router.push('/intro')
        }
      } else {
        setError(result.error || 'Login failed')
      }
    } catch (error) {
      setError('Connection failed. Please check your internet connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestLogin = async (data: LoginForm) => {
    if (!data.guestName) {
      setError('Please enter your name')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: data.guestName,
          sessionCode,
          language
        })
      })

      const result = await response.json()

      if (response.ok) {
        // Store guest session
        localStorage.setItem('cluequest_guest_session', JSON.stringify(result.session))
        
        // Redirect to intro story
        if (sessionCode) {
          router.push(`/intro?session=${sessionCode}&guest=true`)
        } else {
          router.push('/intro?guest=true')
        }
      } else {
        setError(result.error || 'Failed to join as guest')
      }
    } catch (error) {
      setError('Connection failed. Please check your internet connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSSOLogin = async (provider: 'google' | 'apple') => {
    setIsLoading(true)
    setError('')

    try {
      // TODO: Implement OAuth with Supabase
      window.location.href = `/api/auth/oauth/${provider}?session=${sessionCode}&lang=${language}`
    } catch (error) {
      setError('SSO login failed')
      setIsLoading(false)
    }
  }

  const getConnectionBadge = () => {
    const configs = {
      online: { icon: CheckCircle2, text: 'Connected', variant: 'success' as const, color: 'text-green-600' },
      offline: { icon: WifiOff, text: 'Offline', variant: 'destructive' as const, color: 'text-red-600' },
      checking: { icon: Loader2, text: 'Connecting...', variant: 'secondary' as const, color: 'text-gray-600' },
      unstable: { icon: Wifi, text: 'Unstable', variant: 'warning' as const, color: 'text-yellow-600' }
    }

    const config = configs[connectionStatus]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="mb-4">
        <Icon className={`w-3 h-3 mr-1 ${config.color} ${connectionStatus === 'checking' ? 'animate-spin' : ''}`} />
        {config.text}
      </Badge>
    )
  }

  const onSubmit = (data: LoginForm) => {
    if (loginMethod === 'guest') {
      handleGuestLogin(data)
    } else {
      handleEmailLogin(data)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Connection Status */}
        <div className="text-center mb-6">
          {getConnectionBadge()}
        </div>

        {/* Session Info Card */}
        <AnimatePresence>
          {sessionInfo && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <div>
                      <p className="font-semibold text-sm">{sessionInfo.adventure?.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Session: {sessionInfo.session_code} • {sessionInfo.participants?.length || 0} players
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-slate-800">
                {sessionCode ? 'Join Adventure' : 'Quick Access'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {connectionStatus === 'offline' 
                  ? 'You appear to be offline. Some features may not work.'
                  : 'Choose how you\'d like to participate'
                }
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              
              {/* Login Method Selector */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg">
                {[
                  { key: 'email', label: 'Email', icon: Mail },
                  { key: 'guest', label: 'Guest', icon: User },
                  { key: 'sso', label: 'SSO', icon: CheckCircle2 }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setLoginMethod(key as LoginMethod)}
                    disabled={connectionStatus === 'offline' && key !== 'guest'}
                    className={`flex flex-col items-center gap-1 py-2 px-3 rounded text-xs font-medium transition-all touch-target ${
                      loginMethod === key
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    } ${connectionStatus === 'offline' && key !== 'guest' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
                  >
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertTriangle className="w-4 h-4" />
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Forms */}
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <AnimatePresence mode="wait">
                  
                  {/* Email Login */}
                  {loginMethod === 'email' && (
                    <motion.div
                      key="email"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <Input
                        {...form.register('email')}
                        type="email"
                        placeholder="Enter your email address"
                        disabled={connectionStatus === 'offline' || isLoading}
                        className="touch-target"
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                      )}
                      <Button
                        type="submit"
                        className="w-full touch-target"
                        disabled={connectionStatus === 'offline' || isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Signing In...
                          </div>
                        ) : (
                          'Continue with Email'
                        )}
                      </Button>
                    </motion.div>
                  )}

                  {/* Guest Login */}
                  {loginMethod === 'guest' && (
                    <motion.div
                      key="guest"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <Input
                        {...form.register('guestName')}
                        type="text"
                        placeholder="Enter your name"
                        disabled={isLoading}
                        className="touch-target"
                      />
                      {form.formState.errors.guestName && (
                        <p className="text-sm text-destructive">{form.formState.errors.guestName.message}</p>
                      )}
                      <Button
                        type="submit"
                        variant="secondary"
                        className="w-full touch-target"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Joining...
                          </div>
                        ) : (
                          'Join as Guest'
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        No account needed • Perfect for one-time events
                      </p>
                    </motion.div>
                  )}

                  {/* SSO Login */}
                  {loginMethod === 'sso' && (
                    <motion.div
                      key="sso"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full touch-target"
                        disabled={connectionStatus === 'offline' || isLoading}
                        onClick={() => handleSSOLogin('google')}
                      >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full touch-target"
                        disabled={connectionStatus === 'offline' || isLoading}
                        onClick={() => handleSSOLogin('apple')}
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                        Continue with Apple
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              {/* Connection Help */}
              {connectionStatus === 'offline' && (
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    You can still join as a guest while offline
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your progress will sync when connection is restored
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to ClueQuest's Terms of Service
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <AdventureLoginForm />
    </Suspense>
  )
}