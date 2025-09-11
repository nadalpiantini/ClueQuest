'use client'

import React, { useState } from 'react'
import { 
  Target, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  Camera,
  MessageCircle,
  Clock,
  Trophy,
  Puzzle,
  Users,
  CheckCircle,
  AlertCircle,
  Star,
  Zap,
  Brain,
  Activity,
  Eye,
  Settings
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GamingButton, GamingCard, GamingInput, GamingBadge } from '@/components/ui/gaming-components'
import { challengeTemplates, getTemplatesByCategory, createChallengeFromTemplate, type ChallengeTemplate } from '@/lib/templates/challenge-templates'

export interface Challenge {
  id: string
  name: string
  description: string
  type: 'photo' | 'question' | 'puzzle' | 'task' | 'riddle' | 'location' | 'team'
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  points: number
  timeLimit?: number // minutes
  hints: string[]
  instructions: string
  successMessage: string
  failureMessage: string
  
  // Type-specific data
  typeData: {
    // Photo challenge
    photoPrompt?: string
    photoRequirements?: string[]
    
    // Question challenge
    question?: string
    correctAnswer?: string
    wrongAnswers?: string[]
    answerType?: 'multiple_choice' | 'text' | 'number'
    
    // Puzzle challenge
    puzzleType?: 'riddle' | 'math' | 'logic' | 'word'
    puzzleData?: any
    
    // Task challenge
    taskSteps?: string[]
    completionCriteria?: string
    
    // Team challenge
    minPlayers?: number
    maxPlayers?: number
    teamRole?: string
  }
  
  tags: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface ChallengeDesignerProps {
  challenges: Challenge[]
  onChallengesChange: (challenges: Challenge[]) => void
  maxChallenges?: number
}

export default function ChallengeDesigner({
  challenges = [],
  onChallengesChange,
  maxChallenges = 50
}: ChallengeDesignerProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const challengeTypes = [
    {
      id: 'photo',
      name: 'Photo Challenge',
      icon: Camera,
      description: 'Take a specific photo or selfie',
      color: 'emerald',
      defaultPoints: 10
    },
    {
      id: 'question',
      name: 'Quiz Question',
      icon: MessageCircle,
      description: 'Answer a trivia or knowledge question',
      color: 'blue',
      defaultPoints: 15
    },
    {
      id: 'puzzle',
      name: 'Puzzle',
      icon: Puzzle,
      description: 'Solve a riddle, math problem, or logic puzzle',
      color: 'purple',
      defaultPoints: 25
    },
    {
      id: 'task',
      name: 'Physical Task',
      icon: Activity,
      description: 'Complete a specific physical action',
      color: 'orange',
      defaultPoints: 20
    },
    {
      id: 'riddle',
      name: 'Riddle',
      icon: Brain,
      description: 'Solve a creative riddle or mystery',
      color: 'indigo',
      defaultPoints: 30
    },
    {
      id: 'team',
      name: 'Team Challenge',
      icon: Users,
      description: 'Collaborative challenge requiring multiple people',
      color: 'pink',
      defaultPoints: 35
    }
  ]

  const difficultyLevels = [
    { id: 'easy', name: 'Easy', color: 'emerald', points: 10, description: 'Simple, quick completion' },
    { id: 'medium', name: 'Medium', color: 'amber', points: 20, description: 'Moderate challenge' },
    { id: 'hard', name: 'Hard', color: 'orange', points: 35, description: 'Requires thinking' },
    { id: 'expert', name: 'Expert', color: 'red', points: 50, description: 'Very challenging' }
  ]

  const createNewChallenge = (type: string): Challenge => {
    const challengeType = challengeTypes.find(ct => ct.id === type)
    const defaultDifficulty = difficultyLevels.find(d => d.id === 'medium')!
    
    return {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      type: type as Challenge['type'],
      difficulty: 'medium',
      points: challengeType?.defaultPoints || 15,
      hints: [],
      instructions: '',
      successMessage: '🎉 Challenge completed successfully!',
      failureMessage: '❌ Try again! Check the hints if you need help.',
      typeData: {},
      tags: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  const addChallenge = (type: string) => {
    if (challenges.length >= maxChallenges) return
    
    const newChallenge = createNewChallenge(type)
    setSelectedChallenge(newChallenge)
    setIsEditing(true)
  }

  const addChallengeFromTemplate = (template: ChallengeTemplate) => {
    if (challenges.length >= maxChallenges) return
    
    const newChallenge = createChallengeFromTemplate(template)
    onChallengesChange([...challenges, newChallenge])
    setShowTemplates(false)
  }

  const editChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setIsEditing(true)
  }

  const saveChallenge = (challenge: Challenge) => {
    const updatedChallenge = { ...challenge, updatedAt: new Date() }
    
    const updatedChallenges = selectedChallenge?.id === challenge.id && challenges.find(c => c.id === challenge.id)
      ? challenges.map(c => c.id === challenge.id ? updatedChallenge : c)
      : [...challenges, updatedChallenge]

    onChallengesChange(updatedChallenges)
    setSelectedChallenge(null)
    setIsEditing(false)
  }

  const deleteChallenge = (challengeId: string) => {
    const updatedChallenges = challenges.filter(c => c.id !== challengeId)
    onChallengesChange(updatedChallenges)
    
    if (selectedChallenge?.id === challengeId) {
      setSelectedChallenge(null)
      setIsEditing(false)
    }
  }

  const duplicateChallenge = (challenge: Challenge) => {
    const duplicated = {
      ...challenge,
      id: crypto.randomUUID(),
      name: `${challenge.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    onChallengesChange([...challenges, duplicated])
  }

  const toggleChallengeActive = (challengeId: string) => {
    const updatedChallenges = challenges.map(c =>
      c.id === challengeId ? { ...c, isActive: !c.isActive } : c
    )
    onChallengesChange(updatedChallenges)
  }

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesType = filterType === 'all' || challenge.type === filterType
    const matchesDifficulty = filterDifficulty === 'all' || challenge.difficulty === filterDifficulty
    
    return matchesSearch && matchesType && matchesDifficulty
  })

  const getChallengeTypeInfo = (type: string) => {
    return challengeTypes.find(ct => ct.id === type) || challengeTypes[0]
  }

  const getDifficultyInfo = (difficulty: string) => {
    return difficultyLevels.find(d => d.id === difficulty) || difficultyLevels[1]
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-3 flex items-center justify-center gap-3">
          <Target className="h-7 w-7" />
          Challenge Designer
        </h3>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Create specific challenges and puzzles that participants will receive when they scan QR stickers. Each challenge is unique and can be assigned to different QR codes.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="flex gap-3">
          <GamingButton
            variant="mystery"
            size="md"
            onClick={() => setShowTemplates(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Use Templates
          </GamingButton>
          <GamingButton
            variant="outline"
            size="md"
            onClick={() => setShowTemplates(false)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Custom
          </GamingButton>
        </div>
        <div className="text-sm text-slate-400">
          {challenges.length}/{maxChallenges} challenges created
        </div>
      </div>

      {/* Challenge Type Showcase */}
      {!showTemplates && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {challengeTypes.map((type) => {
          const Icon = type.icon
          const count = challenges.filter(c => c.type === type.id).length
          
          return (
            <motion.button
              key={type.id}
              onClick={() => addChallenge(type.id)}
              disabled={challenges.length >= maxChallenges}
              className={`p-4 rounded-xl border border-${type.color}-500/30 bg-${type.color}-500/5 hover:bg-${type.color}-500/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center space-y-2">
                <Icon className={`h-8 w-8 text-${type.color}-400 mx-auto`} />
                <div className={`text-sm font-bold text-${type.color}-200`}>
                  {type.name}
                </div>
                <div className="text-xs text-slate-400">
                  {type.description}
                </div>
                {count > 0 && (
                  <GamingBadge variant={type.color as any} size="sm">
                    {count} created
                  </GamingBadge>
                )}
              </div>
            </motion.button>
          )
        })}
        </div>
      )}

      {/* Templates Section */}
      {showTemplates && (
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="text-xl font-bold text-purple-200 mb-2">Challenge Templates</h4>
            <p className="text-slate-400">Choose from pre-designed challenges that are ready to use</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {['all', 'corporate', 'educational', 'social', 'mystery', 'fantasy'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challengeTemplates
              .filter(template => selectedCategory === 'all' || template.category === selectedCategory)
              .map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-xl border border-slate-600 bg-slate-800/40 hover:bg-slate-800/60 transition-all duration-200"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-lg font-bold text-slate-200 mb-1">{template.name}</h5>
                        <p className="text-sm text-slate-400">{template.description}</p>
                      </div>
                      <GamingBadge variant={template.difficulty === 'easy' ? 'emerald' : template.difficulty === 'medium' ? 'gold' : template.difficulty === 'hard' ? 'red' : 'red'} size="sm">
                        {template.difficulty}
                      </GamingBadge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>⏱️ {template.estimatedTime} min</span>
                      <span>🎯 {template.challenge.points} pts</span>
                      <span className="capitalize">📂 {template.category}</span>
                    </div>

                    <div className="text-sm text-slate-300">
                      <strong>Instructions:</strong> {template.challenge.instructions.substring(0, 100)}...
                    </div>

                    <div className="flex gap-2">
                      <GamingButton
                        variant="mystery"
                        size="sm"
                        onClick={() => addChallengeFromTemplate(template)}
                        className="flex-1"
                      >
                        <Plus className="h-4 w-4" />
                        Use Template
                      </GamingButton>
                      <GamingButton
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const challenge = createChallengeFromTemplate(template)
                          setSelectedChallenge(challenge)
                          setIsEditing(true)
                          setShowTemplates(false)
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                        Customize
                      </GamingButton>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search challenges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-600 rounded-lg text-slate-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Types</option>
            {challengeTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            {difficultyLevels.map(level => (
              <option key={level.id} value={level.id}>{level.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Challenges Grid */}
      {filteredChallenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge, index) => {
            const typeInfo = getChallengeTypeInfo(challenge.type)
            const difficultyInfo = getDifficultyInfo(challenge.difficulty)
            const TypeIcon = typeInfo.icon

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <GamingCard className={`p-6 space-y-4 ${!challenge.isActive ? 'opacity-60' : ''}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg bg-${typeInfo.color}-500/20`}>
                        <TypeIcon className={`h-5 w-5 text-${typeInfo.color}-400`} />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-base font-bold text-slate-200 mb-1">
                          {challenge.name || 'Untitled Challenge'}
                        </h5>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {challenge.description || 'No description'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs">
                    <GamingBadge variant={typeInfo.color as any} size="sm">
                      {typeInfo.name}
                    </GamingBadge>
                    <GamingBadge variant={difficultyInfo.color as any} size="sm">
                      {difficultyInfo.name}
                    </GamingBadge>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Trophy className="h-3 w-3" />
                      {challenge.points}
                    </div>
                    {challenge.timeLimit && (
                      <div className="flex items-center gap-1 text-blue-400">
                        <Clock className="h-3 w-3" />
                        {challenge.timeLimit}m
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {challenge.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {challenge.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-slate-700/50 text-slate-300 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                      {challenge.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-slate-700/50 text-slate-300 rounded">
                          +{challenge.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Instructions Preview */}
                  {challenge.instructions && (
                    <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700">
                      <div className="text-xs text-slate-400 mb-1">Instructions:</div>
                      <div className="text-sm text-slate-300 line-clamp-2">
                        {challenge.instructions}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
                    <GamingButton
                      variant="ghost"
                      size="sm"
                      onClick={() => editChallenge(challenge)}
                      className="flex-1"
                    >
                      <Edit3 className="h-3 w-3" />
                      Edit
                    </GamingButton>
                    <GamingButton
                      variant="ghost"
                      size="sm"
                      onClick={() => duplicateChallenge(challenge)}
                      className="flex-1"
                    >
                      <Plus className="h-3 w-3" />
                      Copy
                    </GamingButton>
                    <GamingButton
                      variant={challenge.isActive ? "outline" : "mystery"}
                      size="sm"
                      onClick={() => toggleChallengeActive(challenge.id)}
                    >
                      {challenge.isActive ? 
                        <Eye className="h-3 w-3" /> :
                        <Settings className="h-3 w-3" />
                      }
                    </GamingButton>
                    <GamingButton
                      variant="outline"
                      size="sm"
                      onClick={() => deleteChallenge(challenge.id)}
                      className="border-red-500/40 text-red-400 hover:border-red-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </GamingButton>
                  </div>
                </GamingCard>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <Target className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-slate-300 mb-2">
            {searchQuery || filterType !== 'all' || filterDifficulty !== 'all' 
              ? 'No challenges found'
              : 'No challenges yet'
            }
          </h4>
          <p className="text-slate-500 mb-6">
            {searchQuery || filterType !== 'all' || filterDifficulty !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Click on a challenge type above to create your first challenge'
            }
          </p>
          {!searchQuery && filterType === 'all' && filterDifficulty === 'all' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {challengeTypes.slice(0, 6).map((type) => {
                const Icon = type.icon
                return (
                  <GamingButton
                    key={type.id}
                    variant="ghost"
                    onClick={() => addChallenge(type.id)}
                    disabled={challenges.length >= maxChallenges}
                    className="p-4"
                  >
                    <div className="text-center space-y-2">
                      <Icon className={`h-6 w-6 text-${type.color}-400 mx-auto`} />
                      <div className="text-sm font-medium">{type.name}</div>
                    </div>
                  </GamingButton>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Challenge Editor Modal */}
      <AnimatePresence>
        {isEditing && selectedChallenge && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              // Only close if clicking the backdrop, not the modal content
              if (e.target === e.currentTarget) {
                setIsEditing(false)
                setSelectedChallenge(null)
              }
            }}
          >
            <motion.div
              className="bg-slate-900 border border-slate-600 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-purple-200">
                      {challenges.find(c => c.id === selectedChallenge.id) ? 'Edit Challenge' : 'Create New Challenge'}
                    </h3>
                    {selectedChallenge.type && (
                      <GamingBadge variant={getChallengeTypeInfo(selectedChallenge.type).color as any} size="md">
                        {getChallengeTypeInfo(selectedChallenge.type).name}
                      </GamingBadge>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setSelectedChallenge(null)
                    }}
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-slate-200">Basic Information</h4>
                    
                    <GamingInput
                      label="Challenge Name"
                      placeholder="e.g., Find the Secret Sign, Solve the Math Puzzle"
                      value={selectedChallenge.name}
                      onChange={(e) => setSelectedChallenge({
                        ...selectedChallenge,
                        name: e.target.value
                      })}
                    />

                    <div>
                      <label className="text-sm font-bold text-purple-300 uppercase tracking-wide mb-2 block">
                        Description
                      </label>
                      <textarea
                        placeholder="Describe what this challenge is about..."
                        value={selectedChallenge.description}
                        onChange={(e) => setSelectedChallenge({
                          ...selectedChallenge,
                          description: e.target.value
                        })}
                        className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 min-h-[80px] resize-none"
                      />
                    </div>

                    {/* Difficulty and Points */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-bold text-purple-300 uppercase tracking-wide mb-2 block">
                          Difficulty
                        </label>
                        <select
                          value={selectedChallenge.difficulty}
                          onChange={(e) => {
                            const difficulty = e.target.value as Challenge['difficulty']
                            const difficultyInfo = getDifficultyInfo(difficulty)
                            setSelectedChallenge({
                              ...selectedChallenge,
                              difficulty,
                              points: difficultyInfo.points
                            })
                          }}
                          className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        >
                          {difficultyLevels.map(level => (
                            <option key={level.id} value={level.id}>
                              {level.name} ({level.points} pts) - {level.description}
                            </option>
                          ))}
                        </select>
                      </div>

                      <GamingInput
                        label="Points"
                        type="number"
                        min="1"
                        max="100"
                        value={selectedChallenge.points}
                        onChange={(e) => setSelectedChallenge({
                          ...selectedChallenge,
                          points: parseInt(e.target.value) || 10
                        })}
                      />
                    </div>

                    {/* Time Limit */}
                    <div>
                      <label className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                        <input
                          type="checkbox"
                          checked={!!selectedChallenge.timeLimit}
                          onChange={(e) => setSelectedChallenge({
                            ...selectedChallenge,
                            timeLimit: e.target.checked ? 5 : undefined
                          })}
                          className="w-4 h-4 text-purple-500 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                        />
                        Add time limit
                      </label>
                      {selectedChallenge.timeLimit && (
                        <div className="mt-2">
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              min="1"
                              max="60"
                              value={selectedChallenge.timeLimit}
                              onChange={(e) => setSelectedChallenge({
                                ...selectedChallenge,
                                timeLimit: parseInt(e.target.value) || 5
                              })}
                              className="w-20 px-3 py-2 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                            />
                            <span className="text-sm text-slate-400">minutes</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Challenge Content */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-slate-200">Challenge Content</h4>
                    
                    <div>
                      <label className="text-sm font-bold text-purple-300 uppercase tracking-wide mb-2 block">
                        Instructions for Participants
                      </label>
                      <textarea
                        placeholder="Clear instructions on what participants need to do..."
                        value={selectedChallenge.instructions}
                        onChange={(e) => setSelectedChallenge({
                          ...selectedChallenge,
                          instructions: e.target.value
                        })}
                        className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 min-h-[120px] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-sm font-bold text-emerald-300 uppercase tracking-wide mb-2 block">
                          Success Message
                        </label>
                        <input
                          type="text"
                          placeholder="Message shown when challenge is completed successfully"
                          value={selectedChallenge.successMessage}
                          onChange={(e) => setSelectedChallenge({
                            ...selectedChallenge,
                            successMessage: e.target.value
                          })}
                          className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-bold text-red-300 uppercase tracking-wide mb-2 block">
                          Failure Message
                        </label>
                        <input
                          type="text"
                          placeholder="Message shown when challenge fails"
                          value={selectedChallenge.failureMessage}
                          onChange={(e) => setSelectedChallenge({
                            ...selectedChallenge,
                            failureMessage: e.target.value
                          })}
                          className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        />
                      </div>
                    </div>

                    {/* Hints */}
                    <div>
                      <label className="text-sm font-bold text-amber-300 uppercase tracking-wide mb-2 block">
                        Hints (Optional)
                      </label>
                      <div className="space-y-2">
                        {selectedChallenge.hints.map((hint, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder={`Hint ${index + 1}...`}
                              value={hint}
                              onChange={(e) => {
                                const newHints = [...selectedChallenge.hints]
                                newHints[index] = e.target.value
                                setSelectedChallenge({
                                  ...selectedChallenge,
                                  hints: newHints
                                })
                              }}
                              className="flex-1 px-3 py-2 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                            />
                            <button
                              onClick={() => {
                                const newHints = selectedChallenge.hints.filter((_, i) => i !== index)
                                setSelectedChallenge({
                                  ...selectedChallenge,
                                  hints: newHints
                                })
                              }}
                              className="p-2 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => setSelectedChallenge({
                            ...selectedChallenge,
                            hints: [...selectedChallenge.hints, '']
                          })}
                          className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Add hint
                        </button>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-2 block">
                        Tags
                      </label>
                      <input
                        type="text"
                        placeholder="Enter tags separated by commas (e.g., photo, outdoor, team)"
                        value={selectedChallenge.tags.join(', ')}
                        onChange={(e) => setSelectedChallenge({
                          ...selectedChallenge,
                          tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                        })}
                        className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-slate-700">
                  <GamingButton
                    variant="ghost"
                    size="md"
                    onClick={() => {
                      setIsEditing(false)
                      setSelectedChallenge(null)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </GamingButton>
                  <GamingButton
                    variant="mystery"
                    size="md"
                    onClick={() => saveChallenge(selectedChallenge)}
                    disabled={!selectedChallenge.name.trim() || !selectedChallenge.instructions.trim()}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Save Challenge
                  </GamingButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Summary */}
      {challenges.length > 0 && (
        <div className="p-6 rounded-xl border border-slate-600/50 bg-slate-800/30 space-y-4">
          <h4 className="text-lg font-bold text-slate-200 flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Challenge Bank Summary
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-400">{challenges.length}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Total Challenges</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">
                {challenges.filter(c => c.isActive).length}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">
                {Math.round(challenges.reduce((sum, c) => sum + c.points, 0) / challenges.length) || 0}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Avg Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {challenges.filter(c => c.timeLimit).length}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Timed</div>
            </div>
          </div>

          {/* Type Breakdown */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-4 border-t border-slate-700/50">
            {challengeTypes.map(type => {
              const count = challenges.filter(c => c.type === type.id).length
              if (count === 0) return null
              
              return (
                <div key={type.id} className="text-center">
                  <div className={`text-lg font-bold text-${type.color}-400`}>
                    {count}
                  </div>
                  <div className="text-xs text-slate-400">
                    {type.name}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}