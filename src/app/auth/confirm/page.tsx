'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { ensureMembershipOwner } from '@/lib/auth/actions'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, ArrowLeft, Shield } from 'lucide-react'
import Link from 'next/link'

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [autoActivating, setAutoActivating] = useState(false)

  useEffect(() => {
    handleEmailConfirmation()
  }, [])

  const handleEmailConfirmation = async () => {
    try {
      // Handle the auth callback
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setStatus('error')
        setMessage(`Error de autenticación: ${error.message}`)
        return
      }

      if (data.session) {
        setStatus('success')
        setMessage('¡Autenticación exitosa! Activando tu membresía...')
        
        // Auto-activate membership for new users
        setAutoActivating(true)
        try {
          await ensureMembershipOwner()
          setMessage('¡Perfecto! Tu membresía como OWNER ha sido activada. Redirigiendo...')
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        } catch (membershipError: any) {
          setMessage(`Autenticación exitosa, pero error al activar membresía: ${membershipError.message}. Puedes activarla manualmente.`)
          
          // Redirect to onboard page to manually activate
          setTimeout(() => {
            router.push('/onboard')
          }, 3000)
        } finally {
          setAutoActivating(false)
        }
      } else {
        setStatus('error')
        setMessage('No se pudo confirmar la autenticación. Intenta de nuevo.')
      }
    } catch (error: any) {
      setStatus('error')
      setMessage(`Error inesperado: ${error.message}`)
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'success':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      case 'error':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Loader2 className="h-12 w-12 text-blue-400 animate-spin" />
              <div className="absolute inset-0 h-12 w-12 border-2 border-blue-400/30 rounded-full animate-ping"></div>
            </div>
          </div>
        )
      case 'success':
        return (
          <div className="flex justify-center mb-6">
            <div className="relative">
              <CheckCircle className="h-12 w-12 text-emerald-400" />
              <div className="absolute inset-0 h-12 w-12 border-2 border-emerald-400/30 rounded-full animate-ping"></div>
            </div>
          </div>
        )
      case 'error':
        return (
          <div className="flex justify-center mb-6">
            <div className="relative">
              <XCircle className="h-12 w-12 text-red-400" />
              <div className="absolute inset-0 h-12 w-12 border-2 border-red-400/30 rounded-full animate-ping"></div>
            </div>
          </div>
        )
    }
  }

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
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-500/20 to-amber-500/20 px-6 py-3 text-lg font-semibold text-purple-300 ring-2 ring-purple-500/30 backdrop-blur-xl border border-purple-500/20 shadow-xl">
              <Shield className="h-5 w-5" />
              Account Verification
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 mystery-title">
              ClueQuest
            </h1>
            
            <p className="text-lg text-slate-300">
              Verificando tu acceso al misterio
            </p>
          </motion.div>

          {/* Status Card */}
          <motion.div 
            className="gaming-card p-8 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-center">
              {getStatusIcon()}
              
              <div className={`p-6 rounded-xl border-2 backdrop-blur-sm ${getStatusColor()}`}>
                <p className="text-base font-semibold leading-relaxed">{message}</p>
                
                {autoActivating && (
                  <div className="mt-4">
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-current" />
                      <span className="text-sm font-medium">Activando membresía...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {status === 'success' && !autoActivating && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/dashboard')}
                className="w-full btn-primary text-xl font-black py-4 shadow-2xl hover:shadow-purple-500/40 hover:scale-105"
              >
                <Shield className="h-6 w-6" />
                Ir al Dashboard
              </motion.button>
            )}
            
            {status === 'error' && (
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/onboard')}
                  className="w-full btn-primary text-xl font-black py-4 shadow-2xl hover:shadow-purple-500/40 hover:scale-105"
                >
                  <Shield className="h-6 w-6" />
                  Intentar de nuevo
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/auth/login')}
                  className="w-full p-4 rounded-xl bg-slate-800/60 border-2 border-slate-600/50 text-slate-300 hover:border-slate-500 transition-all duration-200 hover:scale-105 font-semibold"
                >
                  Ir al login
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* Debug Info (development only) */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div 
              className="mt-8 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <p className="font-semibold text-slate-300 mb-2">Debug Info:</p>
              <p>Status: <span className="text-amber-400">{status}</span></p>
              <p>Search Params: <span className="text-purple-400">{searchParams?.toString() || 'None'}</span></p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}