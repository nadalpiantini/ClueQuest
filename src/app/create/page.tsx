'use client'

import { 
  ArrowLeft, 
  Search, 
  Key, 
  Users,
  Eye,
  MapPin,
  Clock,
  Smartphone,
  ArrowRight,
  Plus,
  Settings
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function CreatePage() {
  const searchParams = useSearchParams()
  const adventureType = searchParams.get('type') || 'corporate'
  
  const [currentStep, setCurrentStep] = useState(1)
  const [adventureData, setAdventureData] = useState({
    title: '',
    theme: 'mystery',
    duration: 45,
    maxPlayers: 20
  })

  const themes = [
    { id: 'mystery', name: 'Mystery Detective', icon: Search, color: 'amber' },
    { id: 'fantasy', name: 'Fantasy Quest', icon: Key, color: 'purple' },
    { id: 'corporate', name: 'Corporate Challenge', icon: Users, color: 'emerald' },
    { id: 'educational', name: 'Learning Adventure', icon: Eye, color: 'blue' }
  ]

  const steps = [
    { id: 1, title: 'Basic Setup', icon: Settings },
    { id: 2, title: 'Theme & Story', icon: Eye },
    { id: 3, title: 'Locations & QR', icon: MapPin },
    { id: 4, title: 'Launch Adventure', icon: ArrowRight }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(168,85,247,0.2),transparent_60%),radial-gradient(circle_at_70%_60%,rgba(245,158,11,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 p-6">
        <Link 
                          href="/adventure-selection"
          className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors font-semibold"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Adventure Selection
        </Link>
      </nav>
      
      <main className="relative z-20 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 px-6 py-3 text-sm font-semibold text-amber-300 ring-2 ring-amber-500/30 backdrop-blur-xl border border-amber-500/20">
              <Search className="h-4 w-4 animate-spin" />
              Adventure Builder
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-amber-400 via-orange-300 to-purple-400 bg-clip-text text-transparent">
              Create Your Mystery
            </h1>
            
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Design an unforgettable {adventureType} adventure in just a few steps
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`relative mb-2 p-3 rounded-full transition-all duration-300 ${
                      isActive 
                        ? 'bg-amber-500 ring-4 ring-amber-500/20 scale-110' 
                        : isCompleted 
                        ? 'bg-emerald-500'
                        : 'bg-slate-700'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        isActive || isCompleted ? 'text-white' : 'text-slate-400'
                      }`} />
                    </div>
                    <div className={`text-xs font-semibold ${
                      isActive ? 'text-amber-300' : isCompleted ? 'text-emerald-300' : 'text-slate-500'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            className="card p-8 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {currentStep === 1 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-amber-200 flex items-center gap-3">
                  <Settings className="h-6 w-6" />
                  Basic Adventure Setup
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">
                        Adventure Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., The Corporate Mystery Challenge"
                        value={adventureData.title}
                        onChange={(e) => setAdventureData({ ...adventureData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-900/80 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        min="15"
                        max="180"
                        value={adventureData.duration}
                        onChange={(e) => setAdventureData({ ...adventureData, duration: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-900/80 border border-slate-600 rounded-lg text-slate-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">
                        Max Players
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="100"
                        value={adventureData.maxPlayers}
                        onChange={(e) => setAdventureData({ ...adventureData, maxPlayers: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-900/80 border border-slate-600 rounded-lg text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>
                  
                  {/* Right Column - Theme Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      Adventure Theme
                    </label>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {themes.map((theme) => {
                        const Icon = theme.icon
                        const isSelected = adventureData.theme === theme.id
                        
                        return (
                          <button
                            key={theme.id}
                            onClick={() => setAdventureData({ ...adventureData, theme: theme.id })}
                            className={`p-4 rounded-lg border transition-all duration-200 ${
                              isSelected
                                ? `border-${theme.color}-400 bg-${theme.color}-500/20 ring-2 ring-${theme.color}-500/20`
                                : `border-slate-600 bg-slate-800/40 hover:border-${theme.color}-500/50`
                            }`}
                          >
                            <Icon className={`h-6 w-6 mx-auto mb-2 ${
                              isSelected ? `text-${theme.color}-300` : 'text-slate-400'
                            }`} />
                            <div className={`text-sm font-semibold ${
                              isSelected ? `text-${theme.color}-200` : 'text-slate-400'
                            }`}>
                              {theme.name}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Demo Steps Placeholder */}
            {currentStep > 1 && (
              <div className="text-center py-16">
                <div className="mb-6">
                  <Eye className="h-16 w-16 text-amber-400 mx-auto animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-amber-200 mb-4">
                  Coming Soon: Advanced Builder
                </h3>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                  Step {currentStep} of the adventure builder is under development. 
                  The full no-code creator will be available soon!
                </p>
                
                <div className="flex items-center gap-4 justify-center">
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>
                  
                  <Link 
                    href="/demo"
                    className="btn-primary px-8 py-3"
                  >
                    <Eye className="h-5 w-5" />
                    Try Demo Instead
                  </Link>
                </div>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          {currentStep === 1 && (
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link 
                href="/adventure-selection"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!adventureData.title}
                className={`btn-primary px-8 py-3 ${
                  !adventureData.title ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-amber-500/40'
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </motion.div>
          )}

          {/* Preview Card */}
          <motion.div 
            className="mt-12 card p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h3 className="text-lg font-bold text-purple-200 mb-4">Adventure Preview</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-slate-500">Title</div>
                <div className="text-slate-200 font-semibold">
                  {adventureData.title || 'Untitled Adventure'}
                </div>
              </div>
              
              <div>
                <div className="text-slate-500">Type</div>
                <div className="text-slate-200 font-semibold capitalize">
                  {adventureType}
                </div>
              </div>
              
              <div>
                <div className="text-slate-500">Duration</div>
                <div className="text-slate-200 font-semibold">
                  {adventureData.duration} min
                </div>
              </div>
              
              <div>
                <div className="text-slate-500">Max Players</div>
                <div className="text-slate-200 font-semibold">
                  {adventureData.maxPlayers}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Start Demo */}
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-700/30 border border-slate-600/30 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-emerald-200 mb-4">
                🚀 Want to see ClueQuest in action first?
              </h3>
              <p className="text-slate-400 mb-6">
                Try our interactive demo to experience the full platform capabilities
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                <Link 
                  href="/demo"
                  className="btn-primary px-8 py-4 text-lg shadow-xl hover:shadow-emerald-500/40"
                >
                  <Eye className="h-5 w-5" />
                  Watch Live Demo
                </Link>
                
                <Link 
                  href="/join"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-slate-800/80 text-purple-200 border border-purple-500/30 hover:border-purple-400/50 font-semibold transition-all duration-200 hover:scale-105"
                >
                  <Users className="h-5 w-5" />
                  Join Existing
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}