'use client'

import { 
  ArrowLeft, 
  Search, 
  Lock, 
  Key, 
  Users,
  Smartphone,
  Trophy,
  Eye,
  Clock,
  MapPin,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function DemoPage() {
  const [demoStep, setDemoStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerCount, setPlayerCount] = useState(12)
  const [timeRemaining, setTimeRemaining] = useState(23 * 60 + 47) // 23:47

  // Demo steps simulation
  const demoSteps = [
    {
      title: "Adventure Begins",
      description: "Players scan the first QR code to enter the mystery",
      action: "Scanning QR codes...",
      icon: Smartphone,
      color: "amber"
    },
    {
      title: "Teams Form",
      description: "Players choose roles and form collaborative teams",
      action: "Forming teams...",
      icon: Users,
      color: "purple"
    },
    {
      title: "Mysteries Unfold", 
      description: "AI generates dynamic puzzles based on player choices",
      action: "Solving puzzles...",
      icon: Eye,
      color: "emerald"
    },
    {
      title: "Competition Heats Up",
      description: "Real-time leaderboards show team progress",
      action: "Racing to finish...",
      icon: Trophy,
      color: "red"
    }
  ]

  // Simulate demo progression
  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % demoSteps.length)
      setPlayerCount((prev) => prev + Math.floor(Math.random() * 3) - 1)
      setTimeRemaining((prev) => Math.max(0, prev - Math.floor(Math.random() * 5) + 2))
    }, 3000)

    return () => clearInterval(timer)
  }, [isPlaying, demoSteps.length])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(168,85,247,0.2),transparent_50%),radial-gradient(circle_at_75%_75%,rgba(245,158,11,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px]" />
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
      
      <main className="relative z-20 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-500/20 to-amber-500/20 px-6 py-3 text-sm font-semibold text-purple-300 ring-2 ring-purple-500/30 backdrop-blur-xl border border-purple-500/20">
              <Play className="h-4 w-4" />
              Live Demo Experience
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-purple-400 via-amber-300 to-purple-400 bg-clip-text text-transparent">
              ClueQuest in Action
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Watch a simulated corporate team-building adventure unfold in real-time
            </p>
          </motion.div>

          {/* Demo Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Live Dashboard */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="card p-8 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-amber-200 flex items-center gap-3">
                    <Eye className="h-6 w-6" />
                    Live Adventure Dashboard
                  </h2>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                        isPlaying 
                          ? 'bg-red-600 hover:bg-red-500 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    
                    <button
                      onClick={() => {
                        setDemoStep(0)
                        setPlayerCount(12)
                        setTimeRemaining(23 * 60 + 47)
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </button>
                  </div>
                </div>

                {/* Adventure Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-700/40 border border-amber-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="h-5 w-5 text-amber-400" />
                      <span className="text-amber-200 font-semibold">Active Players</span>
                    </div>
                    <div className="text-2xl font-black text-amber-300">{playerCount}</div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-700/40 border border-purple-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="h-5 w-5 text-purple-400" />
                      <span className="text-purple-200 font-semibold">Time Left</span>
                    </div>
                    <div className="text-2xl font-black text-purple-300 font-mono">{formatTime(timeRemaining)}</div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-700/40 border border-emerald-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="h-5 w-5 text-emerald-400" />
                      <span className="text-emerald-200 font-semibold">QR Scanned</span>
                    </div>
                    <div className="text-2xl font-black text-emerald-300">{Math.min(demoStep * 3 + 5, 15)}/15</div>
                  </div>
                </div>

                {/* Current Step Display */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={demoStep}
                    className="p-6 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-700/60 border border-slate-600/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {(() => {
                        const IconComponent = demoSteps[demoStep].icon;
                        return (
                          <div className={`p-3 rounded-xl ${demoSteps[demoStep].color === 'amber' ? 'bg-gradient-to-br from-amber-500/30 to-amber-600/30' : demoSteps[demoStep].color === 'purple' ? 'bg-gradient-to-br from-purple-500/30 to-purple-600/30' : demoSteps[demoStep].color === 'emerald' ? 'bg-gradient-to-br from-emerald-500/30 to-emerald-600/30' : 'bg-gradient-to-br from-blue-500/30 to-blue-600/30'}`}>
                            <IconComponent className={`h-6 w-6 ${demoSteps[demoStep].color === 'amber' ? 'text-amber-300' : demoSteps[demoStep].color === 'purple' ? 'text-purple-300' : demoSteps[demoStep].color === 'emerald' ? 'text-emerald-300' : 'text-blue-300'}`} />
                          </div>
                        );
                      })()}
                      <div>
                        <h3 className="text-xl font-bold text-slate-200">{demoSteps[demoStep].title}</h3>
                        <p className="text-slate-400">{demoSteps[demoStep].description}</p>
                      </div>
                    </div>
                    
                    {isPlaying && (
                      <div className={`text-sm font-semibold flex items-center gap-2 ${demoSteps[demoStep].color === 'amber' ? 'text-amber-300' : demoSteps[demoStep].color === 'purple' ? 'text-purple-300' : demoSteps[demoStep].color === 'emerald' ? 'text-emerald-300' : 'text-blue-300'}`}>
                        <div className={`h-2 w-2 rounded-full animate-pulse ${demoSteps[demoStep].color === 'amber' ? 'bg-amber-400' : demoSteps[demoStep].color === 'purple' ? 'bg-purple-400' : demoSteps[demoStep].color === 'emerald' ? 'bg-emerald-400' : 'bg-blue-400'}`}></div>
                        {demoSteps[demoStep].action}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Simulated Leaderboard */}
              <div className="card p-6">
                <h3 className="text-xl font-bold text-purple-200 mb-4 flex items-center gap-3">
                  <Trophy className="h-5 w-5" />
                  Live Leaderboard
                </h3>
                
                <div className="space-y-3">
                  {[
                    { team: "Mystery Solvers", score: 2450, color: "amber" },
                    { team: "Code Breakers", score: 2380, color: "purple" },
                    { team: "Puzzle Masters", score: 2290, color: "emerald" },
                    { team: "Quest Hunters", score: 2150, color: "red" }
                  ].map((team, index) => (
                    <motion.div
                      key={team.team}
                      className={`flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-slate-800/60 to-slate-700/40 ${team.color === 'amber' ? 'border border-amber-500/20' : team.color === 'purple' ? 'border border-purple-500/20' : team.color === 'emerald' ? 'border border-emerald-500/20' : 'border border-red-500/20'}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${team.color === 'amber' ? 'bg-gradient-to-br from-amber-500/30 to-amber-600/30 text-amber-200' : team.color === 'purple' ? 'bg-gradient-to-br from-purple-500/30 to-purple-600/30 text-purple-200' : team.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 text-emerald-200' : 'bg-gradient-to-br from-red-500/30 to-red-600/30 text-red-200'}`}>
                          {index + 1}
                        </div>
                        <span className="font-semibold text-slate-200">{team.team}</span>
                      </div>
                      <div className={`font-bold ${team.color === 'amber' ? 'text-amber-300' : team.color === 'purple' ? 'text-purple-300' : team.color === 'emerald' ? 'text-emerald-300' : 'text-red-300'}`}>
                        {team.score + (isPlaying ? Math.floor(Math.random() * 50) : 0)} pts
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Demo Controls & Info */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              
              {/* Demo Info */}
              <div className="card p-6">
                <h3 className="text-xl font-bold text-amber-200 mb-4 flex items-center gap-3">
                  <Search className="h-5 w-5" />
                  Demo Adventure
                </h3>
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="text-slate-200 font-semibold">Corporate Team Building</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span className="text-slate-200 font-semibold">45 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Players:</span>
                    <span className="text-slate-200 font-semibold">{playerCount} active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">QR Codes:</span>
                    <span className="text-slate-200 font-semibold">15 locations</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700">
                  <div className="text-xs text-slate-500 mb-2">Adventure Progress</div>
                  <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${((demoStep + 1) / demoSteps.length) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-slate-400">
                    Step {demoStep + 1} of {demoSteps.length}
                  </div>
                </div>
              </div>

              {/* Features Showcase */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-purple-200 mb-4">Live Features</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-sm text-slate-300">Real-time sync</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40">
                    <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
                    <span className="text-sm text-slate-300">AI story generation</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40">
                    <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse"></div>
                    <span className="text-sm text-slate-300">Team coordination</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40">
                    <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse"></div>
                    <span className="text-sm text-slate-300">Fraud detection</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Link 
                  href="/adventure-selection"
                  className="btn-primary w-full justify-center text-lg font-bold py-4 shadow-xl hover:shadow-amber-500/40"
                >
                  <Search className="h-6 w-6" />
                  Create Your Adventure
                </Link>
                
                <Link 
                  href="/join"
                  className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-slate-800/80 text-purple-200 border border-purple-500/30 hover:border-purple-400/50 font-semibold transition-all duration-200 hover:scale-105"
                >
                  <Users className="h-5 w-5" />
                  Join Existing Quest
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Mobile QR Scanner Simulation */}
          <motion.div 
            className="mt-16 max-w-md mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <div className="card p-6 text-center">
              <h3 className="text-lg font-bold text-emerald-200 mb-4">Mobile Experience Preview</h3>
              
              {/* Simulated Phone */}
              <div className="mx-auto w-64 h-96 bg-slate-900 rounded-3xl p-4 ring-2 ring-slate-700 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-4 flex flex-col">
                  
                  {/* Phone Header */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-amber-300 font-bold">ClueQuest</div>
                  </div>
                  
                  {/* QR Scanner Area */}
                  <div className="flex-1 bg-slate-900 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-purple-500/10"></div>
                    <div className="text-center">
                      <Search className="h-8 w-8 text-amber-400 mx-auto mb-2 animate-pulse" />
                      <div className="text-slate-300 text-sm">Point camera at QR</div>
                    </div>
                    
                    {/* Scanning Animation */}
                    {isPlaying && (
                      <div className="absolute inset-0 border-2 border-amber-400 rounded-xl animate-pulse">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-amber-400 animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Phone Info */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Current Clue:</span>
                      <span className="text-amber-300">{demoStep + 1}/4</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Team Score:</span>
                      <span className="text-purple-300 font-bold">2,450 pts</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Rank:</span>
                      <span className="text-emerald-300">#2 of 4 teams</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-purple-300 mb-4">
                Ready to Create Your Adventure?
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Join thousands of organizations worldwide using ClueQuest to create 
                unforgettable team experiences and educational adventures.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
                <Link 
                  href="/adventure-selection"
                  className="btn-primary text-xl font-black px-10 py-5 shadow-2xl hover:shadow-amber-500/40"
                >
                  <Key className="h-6 w-6" />
                  Start Building
                </Link>
                
                <Link 
                  href="/contact"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-600/50 hover:border-slate-500 font-semibold transition-all duration-200 hover:scale-105"
                >
                  Talk to Expert
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}