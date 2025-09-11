'use client'

import { useState, useEffect } from 'react'
import { 
  signUpWithLink, 
  signInWithLink,
  ensureMembershipOwner, 
  getCurrentUserWithMembership 
} from '@/lib/auth/actions'
import { supabase } from '@/lib/supabase/client'
import { 
  ArrowLeft, 
  Mail, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  UserPlus, 
  LogIn,
  Crown,
  LogOut
} from 'lucide-react'
import Link from 'next/link'

export default function OnboardPageSimple() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    // Set initialized immediately for testing
    setIsInitialized(true)
    checkUserStatus()
  }, [])

  const checkUserStatus = async () => {
    try {
      console.log('Checking user status...')
      const userWithMembership = await getCurrentUserWithMembership()
      console.log('User status result:', userWithMembership)
      setUserInfo(userWithMembership)
    } catch (error) {
      console.log('User not logged in:', error)
      // Ensure userInfo is set to null explicitly
      setUserInfo(null)
    } finally {
      // Mark as initialized after checking user status
      console.log('Setting initialized to true')
      setIsInitialized(true)
    }
  }

  const handleSendMagicLink = async () => {
    if (!email) {
      setMessage('Por favor ingresa tu email')
      return
    }

    setLoading(true)
    try {
      const result = isSignUp ? 
        await signUpWithLink(email) : 
        await signInWithLink(email)
      setMessage(result)
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleActivateMembership = async () => {
    setLoading(true)
    try {
      const result = await ensureMembershipOwner()
      setMessage(result)
      // Refresh user info
      await checkUserStatus()
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setUserInfo(null)
      setMessage('Sesión cerrada correctamente')
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    }
  }

  // Show loading state until initialized to prevent hydration mismatch
  if (!isInitialized) {
    console.log('Rendering loading state, isInitialized:', isInitialized)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Cargando...</p>
        </div>
      </div>
    )
  }

  console.log('Rendering main content, isInitialized:', isInitialized, 'userInfo:', userInfo)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      
      {/* Background Effects */}
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
          <div className="text-center mb-12">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-500/20 to-amber-500/20 px-6 py-3 text-lg font-semibold text-purple-300 ring-2 ring-purple-500/30 backdrop-blur-xl border border-purple-500/20 shadow-xl">
              <Shield className="h-5 w-5" />
              {userInfo?.user ? 'Welcome Back' : 'Join the Quest'}
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 mystery-title">
              ClueQuest
            </h1>
            
            <p className="text-lg text-slate-300">
              {userInfo?.user ? 'Bienvenido de vuelta' : 'Únete a la aventura'}
            </p>
          </div>

          {/* User Status Card */}
          {userInfo?.user && (
            <div className="gaming-card p-6 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-300">Usuario Autenticado</h3>
                  <p className="text-sm text-slate-400">{userInfo.user.email}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">ID:</span>
                  <span className="text-slate-300 font-mono text-xs">{userInfo.user.id.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Miembro:</span>
                  <span className={`font-semibold ${userInfo.membership.isMember ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {userInfo.membership.isMember ? '✅ Activo' : '❌ Pendiente'}
                  </span>
                </div>
                {userInfo.membership.isMember && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rol:</span>
                    <span className="text-purple-400 font-semibold flex items-center gap-1">
                      <Crown className="h-4 w-4" />
                      {userInfo.membership.role}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Auth Form */}
          {!userInfo?.user && (
            <div className="gaming-card p-8 mb-8">
              <div className="space-y-6">
                {/* Toggle Sign Up / Sign In */}
                <div className="flex bg-slate-800/60 rounded-xl p-1 border border-slate-600/50">
                  <button
                    onClick={() => setIsSignUp(true)}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      isSignUp
                        ? 'bg-gradient-to-r from-purple-500/20 to-amber-500/20 text-purple-300 border border-purple-500/30 shadow-lg'
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <UserPlus className="h-4 w-4" />
                    Registro
                  </button>
                  <button
                    onClick={() => setIsSignUp(false)}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      !isSignUp
                        ? 'bg-gradient-to-r from-purple-500/20 to-amber-500/20 text-purple-300 border border-purple-500/30 shadow-lg'
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <LogIn className="h-4 w-4" />
                    Iniciar sesión
                  </button>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/80 border-2 border-slate-600 rounded-xl text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Magic Link Button */}
                <button
                  onClick={handleSendMagicLink}
                  disabled={loading || !email}
                  className={`w-full btn-primary text-xl font-black py-4 shadow-2xl transition-all duration-300 ${
                    email && !loading
                      ? 'hover:shadow-purple-500/40 hover:scale-105' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="h-6 w-6" />
                      {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'} con link mágico
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Membership Activation */}
          {userInfo?.user && !userInfo.membership.isMember && (
            <div className="gaming-card p-8 mb-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-full bg-amber-500/20 border border-amber-500/30">
                    <Crown className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-amber-300">Activar Membresía</h3>
                    <p className="text-sm text-slate-400">¡Ya estás autenticado! Ahora activa tu membresía para comenzar a crear aventuras.</p>
                  </div>
                </div>

                <button
                  onClick={handleActivateMembership}
                  disabled={loading}
                  className="w-full btn-primary text-xl font-black py-4 shadow-2xl hover:shadow-emerald-500/40 hover:scale-105"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Activando...
                    </>
                  ) : (
                    <>
                      <Crown className="h-6 w-6" />
                      🚀 Activar membresía OWNER
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Success State */}
          {userInfo?.user && userInfo.membership.isMember && (
            <div className="gaming-card p-8 mb-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-300">¡Acceso Completo!</h3>
                    <p className="text-sm text-slate-400">
                      Ya tienes acceso completo como <span className="text-purple-400 font-semibold">{userInfo.membership.role}</span>.
                      Puedes crear y editar aventuras.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <a
                    href="/dashboard"
                    className="flex-1 btn-primary text-center py-4 shadow-2xl hover:shadow-purple-500/40 hover:scale-105"
                  >
                    <Shield className="h-6 w-6" />
                    Ir al Dashboard
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="px-6 py-4 rounded-xl bg-slate-800/60 border-2 border-slate-600/50 text-slate-300 hover:border-slate-500 transition-all duration-200 hover:scale-105 font-semibold"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div
              className={`p-6 rounded-xl border-2 backdrop-blur-sm ${
                message.includes('Error') 
                  ? 'bg-red-500/20 text-red-300 border-red-500/30' 
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
              }`}
            >
              <div className="flex items-center gap-3">
                {message.includes('Error') ? (
                  <XCircle className="h-5 w-5 text-red-400" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                )}
                <p className="text-sm font-semibold">{message}</p>
              </div>
            </div>
          )}

          {/* Development Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-400">
              <p className="font-semibold text-slate-300 mb-2">Debug Info:</p>
              <p>Default Organization: <span className="text-purple-400 font-mono">f7b93ab0-b4c2-46bc-856f-6e22ac6671fb</span></p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
