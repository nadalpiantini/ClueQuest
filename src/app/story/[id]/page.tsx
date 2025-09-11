'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  Clock, 
  Users, 
  MapPin, 
  BookOpen, 
  Puzzle, 
  Target,
  Award,
  ChevronRight,
  Play,
  Download,
  Share2
} from 'lucide-react'
import { premadeStories, PremadeStory } from '@/data/premade-stories'
import { extendedPremadeStories } from '@/data/premade-stories-extended'
import { additionalPremadeStories } from '@/data/premade-stories-additional'

export default function StoryDetailPage() {
  const params = useParams()
  const [story, setStory] = useState<PremadeStory | null>(null)
  const [activeAct, setActiveAct] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      // Combine all story collections
      const allStories = [...premadeStories, ...extendedPremadeStories, ...additionalPremadeStories]
      const foundStory = allStories.find(s => s.id === params.id)
      setStory(foundStory || null)
      setIsLoading(false)
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading story details...</div>
      </div>
    )
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Story not found</div>
      </div>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'hard': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 border-green-500/30'
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/30'
      case 'hard': return 'bg-red-500/20 border-red-500/30'
      default: return 'bg-slate-500/20 border-slate-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative h-96 overflow-hidden">
          <Image
            src={story.image}
            alt={story.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 z-20 flex items-end">
          <div className="w-full p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-white mb-4">{story.title}</h1>
              <p className="text-xl text-slate-200 mb-6 max-w-3xl">{story.description}</p>
              <div className="flex flex-wrap gap-4">
                <div className={`px-4 py-2 rounded-full border ${getDifficultyBg(story.difficulty)}`}>
                  <span className={`font-semibold ${getDifficultyColor(story.difficulty)}`}>
                    {story.difficulty.toUpperCase()}
                  </span>
                </div>
                <div className="px-4 py-2 rounded-full bg-slate-500/20 border border-slate-500/30">
                  <span className="text-slate-200 font-semibold">
                    {story.theme.toUpperCase()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Story Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Story Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{story.duration}</div>
                  <div className="text-sm text-slate-400">Minutes</div>
                </div>
                <div className="text-center">
                  <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{story.players.min}-{story.players.max}</div>
                  <div className="text-sm text-slate-400">Players</div>
                </div>
                <div className="text-center">
                  <BookOpen className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{story.scenes}</div>
                  <div className="text-sm text-slate-400">Scenes</div>
                </div>
                <div className="text-center">
                  <Target className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{story.ageRange.min}+</div>
                  <div className="text-sm text-slate-400">Age</div>
                </div>
              </div>
            </motion.div>

            {/* Story Acts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Story Structure</h2>
              <div className="space-y-4">
                {story.acts.map((act, index) => (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      activeAct === index
                        ? 'bg-purple-500/20 border-purple-500/50'
                        : 'bg-slate-700/30 border-slate-600/50 hover:border-purple-500/30'
                    }`}
                    onClick={() => setActiveAct(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{act.title}</h3>
                        <p className="text-slate-300 text-sm mt-1">{act.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                          <span>⏱️ {act.duration} min</span>
                          <span>🎮 {act.games.length} games</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Active Act Details */}
            {story.acts[activeAct] && (
              <motion.div
                key={activeAct}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
              >
                <h3 className="text-2xl font-bold text-white mb-4">
                  {story.acts[activeAct].title}
                </h3>
                <p className="text-slate-300 mb-6">{story.acts[activeAct].description}</p>
                
                {/* Objectives */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Objectives</h4>
                  <ul className="space-y-2">
                    {story.acts[activeAct].objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Games */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Games & Activities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {story.acts[activeAct].games.map((game, index) => (
                      <div key={index} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Puzzle className="h-4 w-4 text-purple-400" />
                          <span className="font-semibold text-white text-sm">{game.name}</span>
                        </div>
                        <p className="text-slate-300 text-xs mb-2">{game.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>⏱️ {game.duration} min</span>
                          <span>👥 {game.players} players</span>
                          <span className={`capitalize ${getDifficultyColor(game.difficulty)}`}>
                            {game.difficulty}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Setup Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
            >
              <h3 className="text-xl font-bold text-white mb-4">Setup Requirements</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-200 mb-2">Materials Needed</h4>
                  <ul className="space-y-1">
                    {story.setup.materials.map((material, index) => (
                      <li key={index} className="text-slate-300 text-sm">• {material}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 mb-2">Location</h4>
                  <p className="text-slate-300 text-sm">{story.setup.location}</p>
                </div>
              </div>
            </motion.div>

            {/* Skills Developed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
            >
              <h3 className="text-xl font-bold text-white mb-4">Skills Developed</h3>
              <div className="flex flex-wrap gap-2">
                {story.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-3"
            >
              <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
                <Play className="h-5 w-5" />
                Start Adventure
              </button>
              <button className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-slate-600/50">
                <Download className="h-5 w-5" />
                Download Guide
              </button>
              <button className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-slate-600/50">
                <Share2 className="h-5 w-5" />
                Share Story
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
