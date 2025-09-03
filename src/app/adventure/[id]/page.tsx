'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Users, 
  MapPin, 
  Clock, 
  Trophy, 
  Shield, 
  Palette,
  BookOpen,
  Settings,
  Eye,
  Camera,
  Mic,
  Puzzle,
  Smartphone
} from 'lucide-react'
import Link from 'next/link'

interface Adventure {
  id: string
  title: string
  description: string
  theme: string
  category: string
  difficulty: string
  estimated_duration: number
  theme_config: any
  settings: any
  status: string
  created_at: string
  max_participants: number
}

export default function AdventurePage() {
  const params = useParams()
  const [adventure, setAdventure] = useState<Adventure | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAdventure = async () => {
      try {
        const response = await fetch(`/api/adventures/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch adventure')
        }
        const data = await response.json()
        setAdventure(data.adventure)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchAdventure()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-amber-300 text-lg">Loading adventure...</p>
        </div>
      </div>
    )
  }

  if (error || !adventure) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-300 mb-2">Adventure Not Found</h1>
          <p className="text-slate-400 mb-6">{error || 'The adventure you are looking for does not exist.'}</p>
          <Link 
            href="/builder"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Builder
          </Link>
        </div>
      </div>
    )
  }

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'fantasy': return '🧚‍♀️'
      case 'mystery': return '🕵️'
      case 'detective': return '🔍'
      case 'corporate': return '💼'
      case 'educational': return '📚'
      default: return '🎮'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-emerald-400'
      case 'intermediate': return 'text-amber-400'
      case 'advanced': return 'text-orange-400'
      case 'expert': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-slate-400'
      case 'published': return 'text-emerald-400'
      case 'active': return 'text-amber-400'
      case 'completed': return 'text-purple-400'
      default: return 'text-slate-400'
    }
  }

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
          href="/builder"
          className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors font-semibold"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Builder
        </Link>
      </nav>
      
      <main className="relative z-20 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 px-6 py-3 text-sm font-semibold text-amber-300 ring-2 ring-amber-500/30 backdrop-blur-xl border border-amber-500/20">
              <Trophy className="h-4 w-4" />
              Adventure Created Successfully!
            </div>
            
            <div className="text-8xl mb-6">{getThemeIcon(adventure.theme)}</div>
            
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-amber-400 via-orange-300 to-purple-400 bg-clip-text text-transparent">
              {adventure.title}
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
              {adventure.description}
            </p>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/60 border border-slate-600">
              <div className={`h-2 w-2 rounded-full bg-${getStatusColor(adventure.status).replace('text-', '')}-400`}></div>
              <span className={`text-sm font-semibold ${getStatusColor(adventure.status)} capitalize`}>
                {adventure.status}
              </span>
            </div>
          </motion.div>

          {/* Adventure Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* Left Column - Basic Info */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              
              {/* Theme & Category */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-amber-200 mb-4 flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Theme & Category
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Theme:</span>
                    <span className="text-slate-200 font-semibold capitalize">{adventure.theme}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Category:</span>
                    <span className="text-slate-200 font-semibold capitalize">{adventure.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Difficulty:</span>
                    <span className={`font-semibold capitalize ${getDifficultyColor(adventure.difficulty)}`}>
                      {adventure.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Duration & Participants */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-purple-200 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Duration & Participants
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Estimated Duration:</span>
                    <span className="text-slate-200 font-semibold">{adventure.estimated_duration} minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Max Participants:</span>
                    <span className="text-slate-200 font-semibold">{adventure.max_participants}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Teams Allowed:</span>
                    <span className="text-slate-200 font-semibold">Yes</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-emerald-200 mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Features
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Leaderboard:</span>
                    <span className="text-emerald-400 font-semibold">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Live Tracking:</span>
                    <span className="text-emerald-400 font-semibold">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">AI Avatars:</span>
                    <span className="text-emerald-400 font-semibold">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Offline Mode:</span>
                    <span className="text-emerald-400 font-semibold">Supported</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Configuration */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              
              {/* Story Configuration */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-purple-200 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Story Configuration
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Story Type:</span>
                    <span className="text-slate-200 font-semibold capitalize">
                      {adventure.settings?.storyType || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">AI Generated:</span>
                    <span className={`font-semibold ${adventure.settings?.aiGenerated ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {adventure.settings?.aiGenerated ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Framework:</span>
                    <span className="text-slate-200 font-semibold capitalize">
                      {adventure.settings?.storyFramework || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Branching Points:</span>
                    <span className="text-slate-200 font-semibold">
                      {adventure.settings?.branchingPoints || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Roles */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-emerald-200 mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Available Roles
                </h3>
                {adventure.settings?.roles && adventure.settings.roles.length > 0 ? (
                  <div className="space-y-2">
                    {adventure.settings.roles.map((role: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <span className="text-slate-200 capitalize">{role}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No specific roles defined</p>
                )}
              </div>

              {/* Challenge Types */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-red-200 mb-4 flex items-center gap-2">
                  <Puzzle className="h-5 w-5" />
                  Challenge Types
                </h3>
                {adventure.settings?.challengeTypes && adventure.settings.challengeTypes.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {adventure.settings.challengeTypes.map((challenge: string, index: number) => {
                      const getChallengeIcon = (type: string) => {
                        switch (type) {
                          case 'trivia': return <Eye className="h-4 w-4 text-purple-400" />
                          case 'photo': return <Camera className="h-4 w-4 text-amber-400" />
                          case 'audio': return <Mic className="h-4 w-4 text-emerald-400" />
                          case 'collaborative': return <Users className="h-4 w-4 text-red-400" />
                          default: return <Puzzle className="h-4 w-4 text-slate-400" />
                        }
                      }
                      
                      return (
                        <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40">
                          {getChallengeIcon(challenge)}
                          <span className="text-slate-200 text-sm capitalize">{challenge}</span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No challenge types specified</p>
                )}
              </div>

              {/* Security & Access */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-red-200 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Access
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Access Mode:</span>
                    <span className="text-slate-200 font-semibold capitalize">
                      {adventure.settings?.accessMode || 'private'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Device Limit:</span>
                    <span className="text-slate-200 font-semibold">
                      {adventure.settings?.deviceLimits || 'No limit'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Ranking:</span>
                    <span className="text-slate-200 font-semibold capitalize">
                      {adventure.settings?.ranking || 'public'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary px-8 py-4 text-lg font-bold shadow-xl hover:shadow-emerald-500/40">
                <Trophy className="h-6 w-6" />
                Launch Adventure
              </button>
              
              <button className="btn-secondary px-8 py-4 text-lg font-bold">
                <Settings className="h-6 w-6" />
                Edit Adventure
              </button>
              
              <button className="btn-outline px-8 py-4 text-lg font-bold">
                <Eye className="h-6 w-6" />
                Preview
              </button>
            </div>
            
            <p className="text-slate-400 text-sm">
              Your adventure is ready! Click "Launch Adventure" to start creating QR codes and inviting participants.
            </p>
          </motion.div>

          {/* Creation Info */}
          <motion.div 
            className="mt-12 text-center text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Created on {new Date(adventure.created_at).toLocaleDateString()} at {new Date(adventure.created_at).toLocaleTimeString()}
          </motion.div>
        </div>
      </main>
    </div>
  )
}

