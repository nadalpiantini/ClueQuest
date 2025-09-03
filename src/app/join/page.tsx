'use client'

import { 
  ArrowLeft, 
  Search, 
  Users,
  ArrowRight,
  Eye,
  Smartphone
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function JoinPage() {
  const [sessionCode, setSessionCode] = useState('')
  const [playerName, setPlayerName] = useState('')

  const handleJoinAdventure = () => {
    if (sessionCode && playerName) {
      // For demo purposes, simulate joining
      alert(`🎉 Joining adventure "${sessionCode}" as "${playerName}"!\n\nIn production, this would connect to the live session.`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(168,85,247,0.2),transparent_60%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
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
        <div className="mx-auto max-w-2xl">
          
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-500/20 to-purple-500/20 px-6 py-3 text-lg font-semibold text-emerald-300 ring-2 ring-emerald-500/30 backdrop-blur-xl border border-emerald-500/20 shadow-xl">
              <Users className="h-5 w-5" />
              Join Adventure
              <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping"></div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-emerald-400 via-amber-300 to-purple-400 bg-clip-text text-transparent">
              Enter the Mystery
            </h1>
            
            <p className="text-xl text-slate-300 leading-relaxed">
              Join an existing adventure with your session code
            </p>
          </motion.div>

          {/* Join Form */}
          <motion.div 
            className="card p-8 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="space-y-6">
              
              {/* Session Code Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Adventure Code
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code (e.g., MYSTIC)"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                  className="w-full px-6 py-4 text-xl font-mono bg-slate-900/80 border-2 border-slate-600 rounded-xl text-amber-100 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all duration-300"
                  maxLength={6}
                />
                <p className="mt-2 text-xs text-slate-500">
                  Get the code from your adventure host
                </p>
              </div>

              {/* Player Name Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your display name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-6 py-4 text-lg bg-slate-900/80 border-2 border-slate-600 rounded-xl text-purple-100 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-300"
                  maxLength={30}
                />
                <p className="mt-2 text-xs text-slate-500">
                  This will be visible to other players
                </p>
              </div>

              {/* Join Button */}
              <motion.button
                onClick={handleJoinAdventure}
                disabled={!sessionCode || !playerName}
                className={`w-full btn-primary text-xl font-black py-5 shadow-2xl transition-all duration-300 ${
                  sessionCode && playerName 
                    ? 'hover:shadow-emerald-500/40 hover:scale-105' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
                whileHover={sessionCode && playerName ? { scale: 1.02 } : {}}
                whileTap={sessionCode && playerName ? { scale: 0.98 } : {}}
              >
                <Users className="h-6 w-6" />
                Join Adventure
                <ArrowRight className="h-6 w-6" />
              </motion.button>
            </div>
          </motion.div>


          {/* Quick Access */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-slate-400 mb-6">
              Don't have a code? Create your own adventure
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <Link 
                href="/adventure-selection"
                className="btn-primary text-lg font-bold px-8 py-4 shadow-xl hover:shadow-amber-500/40"
              >
                <Search className="h-5 w-5" />
                Create Adventure
              </Link>
              
              <Link 
                href="/demo"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-600/50 hover:border-slate-500 font-semibold transition-all duration-200 hover:scale-105"
              >
                <Eye className="h-5 w-5" />
                Watch Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}