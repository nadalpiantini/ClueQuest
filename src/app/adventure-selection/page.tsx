'use client'

import { 
  Search, 
  Lock, 
  Key, 
  Users,
  ArrowRight,
  ArrowLeft,
  Play,
  MapPin,
  Smartphone,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function WelcomePage() {
  const [selectedAdventure, setSelectedAdventure] = useState<string | null>(null)

  const adventureTypes = [
    {
      id: 'corporate',
      title: 'Corporate Mystery',
      description: 'Team building through collaborative puzzle solving',
      icon: Users,
      color: 'amber',
      duration: '45-90 minutes',
      players: '4-50 players',
      difficulty: 'Medium'
    },
    {
      id: 'social',
      title: 'Social Adventure',
      description: 'Perfect for parties, weddings, and celebrations',
      icon: MapPin,
      color: 'purple',
      duration: '30-60 minutes', 
      players: '2-30 players',
      difficulty: 'Easy'
    },
    {
      id: 'educational',
      title: 'Learning Quest',
      description: 'Gamified education with curriculum integration',
      icon: Eye,
      color: 'emerald',
      duration: '20-45 minutes',
      players: '1-25 players', 
      difficulty: 'Variable'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(168,85,247,0.2),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(245,158,11,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-16 left-8 text-amber-400/20 animate-pulse">
        <Key className="h-10 w-10 rotate-12" />
      </div>
      <div className="absolute top-32 right-12 text-purple-400/20 animate-bounce">
        <Lock className="h-8 w-8 -rotate-45" />
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
      
      <main className="relative z-20 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          
          {/* Page Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 px-6 py-3 text-lg font-semibold text-amber-300 ring-2 ring-amber-500/30 backdrop-blur-xl border border-amber-500/20 shadow-xl">
              <Search className="h-5 w-5 animate-spin" />
              Choose Your Adventure
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 bg-gradient-to-r from-amber-400 via-orange-300 to-purple-400 bg-clip-text text-transparent">
              Welcome to ClueQuest
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Select your adventure type to begin creating an unforgettable mystery experience
            </p>
          </motion.div>

          {/* Adventure Type Selection */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {adventureTypes.map((adventure, index) => {
              const Icon = adventure.icon
              const isSelected = selectedAdventure === adventure.id
              
              return (
                <motion.div
                  key={adventure.id}
                  className={`card group p-8 cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? `ring-2 ring-${adventure.color}-400/60 border-${adventure.color}-400/40 shadow-${adventure.color}-500/20` 
                      : `ring-1 ring-${adventure.color}-500/20 border-${adventure.color}-500/20 hover:ring-${adventure.color}-400/40`
                  } hover:scale-105`}
                  onClick={() => setSelectedAdventure(adventure.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  {/* Icon */}
                  <div className="mb-6 relative">
                    <div className={`rounded-2xl bg-gradient-to-br from-${adventure.color}-500/30 to-${adventure.color}-600/30 p-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-10 w-10 text-${adventure.color}-300`} />
                    </div>
                    {isSelected && (
                      <div className={`absolute -top-2 -right-2 bg-${adventure.color}-500 rounded-full p-1`}>
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  
                  <h3 className={`text-2xl font-bold text-${adventure.color}-100 mb-3`}>
                    {adventure.title}
                  </h3>
                  
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {adventure.description}
                  </p>
                  
                  {/* Adventure Details */}
                  <div className="space-y-2 text-xs text-slate-400">
                    <div className="flex items-center justify-between">
                      <span>Duration:</span>
                      <span className="font-semibold">{adventure.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Players:</span>
                      <span className="font-semibold">{adventure.players}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Difficulty:</span>
                      <span className="font-semibold">{adventure.difficulty}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {selectedAdventure ? (
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <Link 
                    href="/builder"
                    className="btn-primary group text-2xl font-black px-12 py-6 shadow-2xl hover:shadow-amber-500/40 touch-target"
                  >
                    <Play className="h-8 w-8" />
                    <span>Start Adventure Builder</span>
                    <ArrowRight className="h-8 w-8 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                
                <div className="text-slate-400 text-sm">
                  or{' '}
                  <Link 
                    href={`/demo?type=${selectedAdventure}`}
                    className="text-amber-300 hover:text-amber-200 underline font-semibold"
                  >
                    try a demo first
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-800/40 backdrop-blur-sm border border-slate-700/50">
                <p className="text-slate-400 text-lg mb-4">
                  👆 Select an adventure type above to continue
                </p>
                <p className="text-slate-500 text-sm">
                  Each type is optimized for different audiences and use cases
                </p>
              </div>
            )}

            {/* Quick Access Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link 
                href="/demo"
                className="group p-6 rounded-xl bg-slate-800/60 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="h-5 w-5 text-purple-400" />
                  <span className="font-semibold text-purple-200">Live Demo</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Experience a full adventure without setup
                </p>
              </Link>
              
              <Link 
                href="/join"
                className="group p-6 rounded-xl bg-slate-800/60 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Users className="h-5 w-5 text-emerald-400" />
                  <span className="font-semibold text-emerald-200">Join Adventure</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Enter a session code to join existing quest
                </p>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}