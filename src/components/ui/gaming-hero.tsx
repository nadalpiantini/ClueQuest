'use client'

import { 
  ArrowRight, 
  Search, 
  Lock, 
  Key, 
  Puzzle, 
  Eye,
  PlayCircle
} from 'lucide-react'
import { motion } from 'framer-motion'

export function GamingHero() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 relative">
      
      {/* Floating Mystery Elements */}
      <div className="absolute top-20 left-10 text-amber-400/20 animate-pulse">
        <Key className="h-12 w-12 rotate-12" />
      </div>
      <div className="absolute top-40 right-20 text-purple-400/20 animate-bounce">
        <Lock className="h-10 w-10 -rotate-12" />
      </div>
      <div className="absolute bottom-40 left-20 text-amber-400/20 animate-pulse">
        <Search className="h-14 w-14 rotate-45" />
      </div>
      <div className="absolute bottom-60 right-10 text-purple-400/20 animate-bounce">
        <Puzzle className="h-8 w-8 -rotate-45" />
      </div>
      
      <div className="w-full max-w-7xl text-center">
        
        {/* Gaming Badge */}
        <motion.div 
          className="mb-12 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 px-8 py-4 text-lg font-semibold text-amber-300 ring-2 ring-amber-500/30 backdrop-blur-xl border border-amber-500/20 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
        >
          <Eye className="h-6 w-6 animate-spin" />
          The Ultimate Mystery Platform
          <div className="h-3 w-3 rounded-full bg-amber-400 animate-ping"></div>
        </motion.div>

        {/* Gaming Title */}
        <motion.div 
          className="relative mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tight mb-6 bg-gradient-to-r from-amber-400 via-orange-300 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
            CLUE<span className="text-purple-400">QUEST</span>
          </h1>
          
          {/* Floating Icons */}
          <div className="absolute -top-8 -left-8 text-amber-400/30 animate-pulse">
            <Search className="h-16 w-16 rotate-12" />
          </div>
          <div className="absolute -top-4 -right-12 text-purple-400/30 animate-bounce">
            <Lock className="h-14 w-14 -rotate-12" />
          </div>
        </motion.div>

        {/* Gaming Subtitle */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-200 mb-4 leading-tight">
            Interactive Escape Room Adventures
          </h2>
          <h3 className="text-xl sm:text-2xl text-slate-300 font-medium max-w-4xl mx-auto leading-relaxed">
            Transform Any Venue Into An Immersive Mystery Experience
          </h3>
        </motion.div>
        
        {/* Description */}
        <motion.p 
          className="mb-16 text-lg text-slate-400 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Create interactive scavenger hunts with AI-generated stories, secure QR codes, 
          real-time team collaboration, and immersive AR experiences. Perfect for corporate events, 
          educational adventures, and unforgettable celebrations.
        </motion.p>

        {/* Gaming CTAs */}
        <motion.div 
          className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <motion.a 
                            href="/adventure-selection" 
            className="group relative inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 px-12 py-6 text-2xl font-black text-white shadow-2xl overflow-hidden touch-target"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 60px rgba(245,158,11,0.6)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Search className="h-8 w-8 animate-pulse" />
            <span>Begin Quest</span>
            <ArrowRight className="h-8 w-8 group-hover:translate-x-1 transition-transform" />
          </motion.a>
          
          <motion.a 
            href="/demo" 
            className="group inline-flex items-center gap-4 rounded-2xl bg-slate-800/90 px-12 py-6 text-2xl font-bold text-amber-200 ring-2 ring-amber-500/40 backdrop-blur-xl border border-amber-500/30 touch-target"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 40px rgba(245,158,11,0.2)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <PlayCircle className="h-8 w-8" />
            Watch Demo
          </motion.a>
        </motion.div>

        {/* Premium Email Capture */}
        <motion.div 
          className="mx-auto max-w-2xl mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div className="relative p-8 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-2xl ring-2 ring-amber-500/30 border border-amber-500/20 shadow-2xl">
            
            {/* Top Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-amber-600 to-orange-500 rounded-2xl px-6 py-2 shadow-xl">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Key className="h-5 w-5" />
                  <span>EXCLUSIVE BETA ACCESS</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-amber-200 mb-2">Join the Mystery</h3>
                <p className="text-slate-300">First 1000 pioneers get lifetime access</p>
              </div>
              
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter email to unlock secrets..."
                  className="flex-1 rounded-xl border-2 border-slate-600 bg-slate-900/80 px-6 py-4 text-amber-100 text-lg backdrop-blur-sm placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all duration-300"
                />
                <button className="rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-4 text-lg font-bold text-white shadow-xl touch-target hover:scale-105 transition-transform">
                  <Lock className="h-6 w-6" />
                </button>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-sm text-slate-400">
                  <span className="animate-spin">🔐</span>
                  <span>Lifetime access • No spam • Pure mystery</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}