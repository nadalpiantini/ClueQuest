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
  Eye,
  Brain,
  Shield,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { GlobalHeader } from '@/components/layout/GlobalHeader'
import TemplateSelector from '@/components/templates/TemplateSelector'

export default function AdventureSelectionPage() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [showTemplates, setShowTemplates] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const adventureThemes = [
    {
      id: 'mystery',
      title: 'Mystery Adventures',
      description: 'Solve crimes, uncover secrets, and piece together clues in immersive detective experiences',
      icon: Search,
      image: '/images/Mystery_theme_profile.png',
      color: 'blue',
      count: 5
    },
    {
      id: 'fantasy',
      title: 'Fantasy Quests',
      description: 'Embark on magical journeys with mythical creatures and ancient mysteries',
      icon: Key,
      image: '/images/Fantasy_theme_profile.png', 
      color: 'purple',
      count: 5
    },
    {
      id: 'hacker',
      title: 'Cyberpunk Missions',
      description: 'Navigate digital worlds, crack codes, and outsmart AI in futuristic scenarios',
      icon: Shield,
      image: '/images/Hacker_theme_profile.png',
      color: 'green',
      count: 5
    },
    {
      id: 'corporate',
      title: 'Corporate Challenges',
      description: 'Professional team building through business simulations and strategic puzzles',
      icon: Users,
      image: '/images/Corporate_theme_profile.png',
      color: 'amber',
      count: 5
    },
    {
      id: 'educational',
      title: 'Learning Adventures',
      description: 'Curriculum-integrated experiences that make learning interactive and engaging',
      icon: BookOpen,
      image: '/images/Educational_theme_profile.png',
      color: 'emerald',
      count: 5
    }
  ]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Don't render animations on server side
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(168,85,247,0.2),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(245,158,11,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse" />
        </div>
        <div className="absolute top-16 left-8 text-amber-400/20 animate-pulse">
          <Key className="h-10 w-10 rotate-12" />
        </div>
        <div className="absolute top-32 right-12 text-purple-400/20 animate-bounce">
          <Lock className="h-8 w-8 -rotate-45" />
        </div>
        <nav className="relative z-20 p-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors font-semibold min-h-[44px] min-w-[44px] px-4 py-3 touch-target"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
        </nav>
        <main className="relative z-20 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 px-6 py-3 text-lg font-semibold text-amber-300 ring-2 ring-amber-500/30 backdrop-blur-xl border border-amber-500/20 shadow-xl">
                <Search className="h-5 w-5 animate-spin" />
                Choose Your Adventure Theme
                <div className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></div>
              </div>
              <GlobalHeader />
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Choose from 25 professionally designed adventure templates across 5 exciting themes
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
            {adventureThemes.map((theme, index) => {
              const Icon = theme.icon
              const isSelected = selectedTheme === theme.id
                return (
                  <div
                    key={theme.id}
                    className={`card group p-6 cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? `ring-2 ring-${theme.color}-400/60 border-${theme.color}-400/40 shadow-${theme.color}-500/20` 
                        : `ring-1 ring-${theme.color}-500/20 border-${theme.color}-500/20 hover:ring-${theme.color}-400/40`
                    } hover:scale-105`}
                    onClick={() => setSelectedTheme(theme.id)}
                  >
                    <div className="mb-6 relative">
                      <div className={`rounded-xl bg-gradient-to-br from-${theme.color}-500/20 to-${theme.color}-600/20 p-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-12 w-12 text-${theme.color}-400 mx-auto mb-2`} />
                        <div className={`text-xs text-${theme.color}-300 text-center font-medium`}>
                          {theme.count} Adventures
                        </div>
                      </div>
                      {isSelected && (
                        <div className={`absolute -top-2 -right-2 bg-${theme.color}-500 rounded-full p-1`}>
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <h3 className={`text-lg font-bold text-${theme.color}-100 mb-2 text-center`}>
                      {theme.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed text-center">
                      {theme.description}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="text-center space-y-8">
              {selectedTheme ? (
                <div className="space-y-6">
                  <div>
                    <Link 
                      href={`/builder?adventureType=${selectedTheme}`}
                      className="btn-primary group text-2xl font-black px-12 py-6 shadow-2xl hover:shadow-amber-500/40 touch-target"
                    >
                      <Play className="h-8 w-8" />
                      <span>Start Adventure Builder</span>
                      <ArrowRight className="h-8 w-8 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <div className="text-slate-400 text-sm">
                    or{' '}
                    <Link 
                      href={`/demo?type=${selectedTheme}`}
                      className="text-amber-300 hover:text-amber-200 underline font-semibold touch-target px-5 py-4 min-h-[44px] min-w-[44px] inline-flex items-center"
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
            </div>
          </div>
        </main>
      </div>
    )
  }

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
          className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors font-semibold min-h-[44px] min-w-[44px] px-4 py-3 touch-target"
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
            animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 px-6 py-3 text-lg font-semibold text-amber-300 ring-2 ring-amber-500/30 backdrop-blur-xl border border-amber-500/20 shadow-xl">
              <Search className="h-5 w-5 animate-spin" />
              Choose Your Adventure
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></div>
            </div>
            
            <GlobalHeader />
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Select your adventure type to begin creating an unforgettable mystery experience
            </p>
          </motion.div>

          {/* Adventure Type Selection */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {adventureThemes.map((theme, index) => {
              const Icon = theme.icon
              const isSelected = selectedTheme === theme.id
              
              return (
                <motion.div
                  key={theme.id}
                  className={`card group p-6 cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? `ring-2 ring-${theme.color}-400/60 border-${theme.color}-400/40 shadow-${theme.color}-500/20` 
                      : `ring-1 ring-${theme.color}-500/20 border-${theme.color}-500/20 hover:ring-${theme.color}-400/40`
                  } hover:scale-105`}
                  onClick={() => setSelectedTheme(theme.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Theme Icon */}
                  <div className="mb-4 relative">
                    <div className={`rounded-xl bg-gradient-to-br from-${theme.color}-500/20 to-${theme.color}-600/20 p-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-12 w-12 text-${theme.color}-400 mx-auto mb-2`} />
                      <div className={`text-xs text-${theme.color}-300 text-center font-medium`}>
                        {theme.count} Adventures
                      </div>
                    </div>
                    {isSelected && (
                      <div className={`absolute -top-2 -right-2 bg-${theme.color}-500 rounded-full p-1`}>
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  
                  <h3 className={`text-lg font-bold text-${theme.color}-100 mb-2 text-center`}>
                    {theme.title}
                  </h3>
                  
                  <p className="text-slate-400 text-xs leading-relaxed text-center">
                    {theme.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {selectedTheme ? (
              <div className="space-y-8">
                {/* Template Selector */}
                <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-bold text-white mb-4 text-center">
                    Choose from {adventureThemes.find(t => t.id === selectedTheme)?.count} Professional Templates
                  </h3>
                  <TemplateSelector 
                    onSelectTemplate={(template) => {
                      // Navigate to adventure introduction with selected template
                      window.location.href = `/adventure/intro?template=${template.template_id}`;
                    }}
                    onInstantiateTemplate={(templateId) => {
                      // Navigate to builder with pre-loaded template
                      window.location.href = `/builder?template=${templateId}`;
                    }}
                    className="max-h-96 overflow-y-auto"
                  />
                </div>
                
                <div className="text-slate-400 text-sm text-center">
                  or{' '}
                  <Link 
                    href={`/builder?adventureType=${selectedTheme}`}
                    className="text-amber-300 hover:text-amber-200 underline font-semibold touch-target px-5 py-4 min-h-[44px] min-w-[44px] inline-flex items-center"
                  >
                    create a custom adventure
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-800/40 backdrop-blur-sm border border-slate-700/50">
                <p className="text-slate-400 text-lg mb-4">
                  👆 Select an adventure theme above to continue
                </p>
                <p className="text-slate-500 text-sm">
                  Each theme offers 5 professionally designed templates based on escape room best practices
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