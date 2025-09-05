'use client'

export const dynamic = 'force-dynamic'

import { 
  ArrowLeft, 
  Eye, 
  Lock,
  Mail,
  ArrowRight,
  Users,
  Key
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDemoAuth } from '@/components/auth/demo-auth-provider'

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { login: demoLogin } = useDemoAuth()
  const redirectTo = searchParams.get('redirectTo') || '/welcome'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (email && password) {
      setIsLoading(true)
      try {
        // For demo purposes, simulate login
        alert(`🎉 Welcome back to ClueQuest!\n\nIn production, this would authenticate with Supabase.\nRedirecting to: ${redirectTo}`)
        
        // Use demo auth provider
        demoLogin({ email, name: 'Demo User' })
        
        // Use Next.js router for proper navigation
        router.push(redirectTo)
      } catch (error) {
        alert('Login failed. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    try {
      // Use demo auth provider
      demoLogin({ 
        email: 'demo@cluequest.com', 
        name: 'Demo User' 
      })
      
      alert(`🎮 Demo Login Successful!\n\nLogged in as Demo User\nRedirecting to: ${redirectTo}`)
      
      // Use Next.js router for proper navigation
      router.push(redirectTo)
    } catch (error) {
      alert('Demo login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(168,85,247,0.2),transparent_60%),radial-gradient(circle_at_60%_80%,rgba(245,158,11,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 p-6">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors font-semibold"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </Link>
      </nav>
      
      <main className="relative z-20 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-500/20 to-amber-500/20 px-6 py-3 text-lg font-semibold text-purple-300 ring-2 ring-purple-500/30 backdrop-blur-xl border border-purple-500/20 shadow-xl">
              <Lock className="h-5 w-5" />
              Secure Access
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-purple-400 via-amber-300 to-purple-400 bg-clip-text text-transparent">
              Enter the Quest
            </h1>
            
            <p className="text-lg text-slate-300">
              Sign in to access your mystery adventures
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.div 
            className="card p-8 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="space-y-6">
              
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="email"
                    placeholder="your.email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/80 border-2 border-slate-600 rounded-xl text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/80 border-2 border-slate-600 rounded-xl text-slate-200 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Login Button */}
              <motion.button
                onClick={handleLogin}
                disabled={!email || !password || isLoading}
                className={`w-full btn-primary text-xl font-black py-4 shadow-2xl transition-all duration-300 ${
                  email && password && !isLoading
                    ? 'hover:shadow-purple-500/40 hover:scale-105' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
                whileHover={email && password && !isLoading ? { scale: 1.02 } : {}}
                whileTap={email && password && !isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <Lock className="h-6 w-6" />
                    Enter Quest
                    <ArrowRight className="h-6 w-6" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Development Access - Only in dev mode */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-500/30 text-sm font-semibold">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  Development Mode
                </div>
                <p className="text-slate-400 mt-3 mb-6">
                  Quick access for testing workflows
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Host/Creator Button */}
                <button
                  onClick={async () => {
                    if (isLoading) return
                    setIsLoading(true)
                    try {
                      demoLogin({ 
                        email: 'host@dev.com', 
                        name: 'Dev Host Creator' 
                      })
                      
                      alert(`🎭 Host Mode Activated!\n\nLogged in as Adventure Creator\nRedirecting to Dashboard...`)
                      router.push('/dashboard')
                    } catch (error) {
                      alert('Host login failed. Please try again.')
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                  disabled={isLoading}
                  className={`group p-6 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-200 border-2 border-amber-500/30 hover:border-amber-400/50 font-bold transition-all duration-300 hover:scale-105 backdrop-blur-sm text-left ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl hover:shadow-amber-500/25'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-full bg-amber-500/30">
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-200"></div>
                      ) : (
                        <Users className="h-6 w-6 text-amber-300" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-amber-100">🎭 Entrar como Creador</h3>
                      <p className="text-sm text-amber-300/80">Host Workflow</p>
                    </div>
                  </div>
                  <p className="text-sm text-amber-200/70 leading-relaxed">
                    Acceso completo para crear y gestionar aventuras. Dashboard de control total.
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-xs text-amber-300/60">
                    <ArrowRight className="h-4 w-4" />
                    Dashboard → Create Adventures
                  </div>
                </button>

                {/* Guest/User Button */}
                <button
                  onClick={async () => {
                    if (isLoading) return
                    setIsLoading(true)
                    try {
                      demoLogin({ 
                        email: 'guest@dev.com', 
                        name: 'Dev Guest Player' 
                      })
                      
                      alert(`🕵️ Guest Mode Activated!\n\nLogged in as Adventure Participant\nRedirecting to Join Page...`)
                      router.push('/join')
                    } catch (error) {
                      alert('Guest login failed. Please try again.')
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                  disabled={isLoading}
                  className={`group p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 text-purple-200 border-2 border-purple-500/30 hover:border-purple-400/50 font-bold transition-all duration-300 hover:scale-105 backdrop-blur-sm text-left ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl hover:shadow-purple-500/25'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-full bg-purple-500/30">
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-200"></div>
                      ) : (
                        <Eye className="h-6 w-6 text-purple-300" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-purple-100">🕵️ Entrar como Usuario</h3>
                      <p className="text-sm text-purple-300/80">Guest Workflow</p>
                    </div>
                  </div>
                  <p className="text-sm text-purple-200/70 leading-relaxed">
                    Experiencia de participante. Únete a aventuras y resuelve misterios.
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-xs text-purple-300/60">
                    <ArrowRight className="h-4 w-4" />
                    Join → Adventure Experience
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Standard Demo Access */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <p className="text-slate-400 mb-4">
              Want to try without creating an account?
            </p>
            
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600/20 to-emerald-500/20 text-emerald-200 border border-emerald-500/30 hover:border-emerald-400/50 font-semibold transition-all duration-200 hover:scale-105 backdrop-blur-sm ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-200"></div>
                  Loading...
                </>
              ) : (
                <>
                  <Eye className="h-5 w-5" />
                  Demo Access (No Account Needed)
                </>
              )}
            </button>
          </motion.div>

          {/* Social Login Options */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-900 text-slate-500">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => alert('🚧 Google SSO coming soon!')}
                className="flex items-center justify-center gap-3 px-4 py-3 bg-slate-800/60 border border-slate-600/50 rounded-lg text-slate-300 hover:border-slate-500 transition-all duration-200 hover:scale-105"
              >
                <div className="w-5 h-5 bg-gradient-to-br from-red-400 to-orange-400 rounded"></div>
                <span className="font-semibold">Google</span>
              </button>
              
              <button 
                onClick={() => alert('🚧 Apple SSO coming soon!')}
                className="flex items-center justify-center gap-3 px-4 py-3 bg-slate-800/60 border border-slate-600/50 rounded-lg text-slate-300 hover:border-slate-500 transition-all duration-200 hover:scale-105"
              >
                <div className="w-5 h-5 bg-gradient-to-br from-slate-400 to-slate-600 rounded"></div>
                <span className="font-semibold">Apple</span>
              </button>
            </div>
          </motion.div>

          {/* Register Link */}
          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <p className="text-slate-400">
              New to ClueQuest?{' '}
              <Link 
                href="/auth/register"
                className="text-amber-300 hover:text-amber-200 font-semibold underline"
              >
                Create your account
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}