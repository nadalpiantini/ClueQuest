'use client'

import React, { useState, useEffect } from 'react'
import { 
  Map,
  Target,
  Link,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Users,
  Clock,
  Trophy,
  Settings,
  Zap,
  Eye,
  Route,
  Shuffle,
  Layers,
  GitBranch,
  Play,
  RefreshCw,
  Download
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GamingButton, GamingCard, GamingBadge } from '@/components/ui/gaming-components'
import { Challenge } from '../ChallengeDesigner'

interface Location {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  address?: string
  order: number
  routeType?: 'walking' | 'driving' | 'checkpoint'
}

interface QRSticker {
  id: string
  name: string
  challengeId: string
  challengeName: string
  isActive: boolean
}

interface ActivityMapping {
  id: string
  stickerId: string
  stickerName: string
  challengeId: string
  challengeName: string
  suggestedLocationIds: string[]
  hidingInstructions: string
  revealOrder: number
  isRequired: boolean
  dependencies: string[] // Other mapping IDs that must be completed first
  estimatedDuration: number // minutes
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  points: number
  isActive: boolean
}

interface ActivityCoordinatorProps {
  challenges: Challenge[]
  locations: Location[]
  qrStickers: QRSticker[]
  adventureType: 'linear' | 'parallel' | 'hub'
  onMappingsChange: (mappings: ActivityMapping[]) => void
  existingMappings?: ActivityMapping[]
}

export default function ActivityCoordinator({
  challenges,
  locations,
  qrStickers,
  adventureType,
  onMappingsChange,
  existingMappings = []
}: ActivityCoordinatorProps) {
  const [mappings, setMappings] = useState<ActivityMapping[]>(existingMappings)
  const [selectedMapping, setSelectedMapping] = useState<ActivityMapping | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'flow' | 'timeline'>('grid')
  const [showPreview, setShowPreview] = useState(false)

  const activeStickers = qrStickers.filter(s => s.isActive)
  const activeChallenges = challenges.filter(c => c.isActive)

  // Auto-generate mappings for stickers without mappings
  const autoGenerateMappings = () => {
    const unmappedStickers = activeStickers.filter(sticker => 
      !mappings.some(m => m.stickerId === sticker.id)
    )

    const newMappings: ActivityMapping[] = unmappedStickers.map((sticker, index) => {
      const challenge = activeChallenges.find(c => c.id === sticker.challengeId)
      if (!challenge) return null

      return {
        id: crypto.randomUUID(),
        stickerId: sticker.id,
        stickerName: sticker.name,
        challengeId: sticker.challengeId,
        challengeName: sticker.challengeName,
        suggestedLocationIds: getSuggestedLocations(challenge, index),
        hidingInstructions: generateHidingInstructions(challenge),
        revealOrder: mappings.length + index + 1,
        isRequired: true,
        dependencies: [],
        estimatedDuration: getEstimatedDuration(challenge),
        difficulty: challenge.difficulty,
        points: challenge.points,
        isActive: true
      }
    }).filter(Boolean) as ActivityMapping[]

    const updatedMappings = [...mappings, ...newMappings]
    setMappings(updatedMappings)
    onMappingsChange(updatedMappings)
  }

  const getSuggestedLocations = (challenge: Challenge, index: number): string[] => {
    if (locations.length === 0) return []

    // Different logic based on challenge type and difficulty
    const maxSuggestions = Math.min(3, locations.length)
    
    if (challenge.type === 'photo' && challenge.description.toLowerCase().includes('outdoor')) {
      // Prefer locations with driving route type for outdoor photos
      return locations
        .filter(l => l.routeType !== 'checkpoint')
        .slice(0, maxSuggestions)
        .map(l => l.id)
    }

    if (challenge.difficulty === 'expert' || challenge.difficulty === 'hard') {
      // Hard challenges at later locations
      const startIndex = Math.floor(locations.length * 0.6)
      return locations
        .slice(startIndex)
        .slice(0, maxSuggestions)
        .map(l => l.id)
    }

    if (challenge.difficulty === 'easy') {
      // Easy challenges at early locations
      return locations
        .slice(0, maxSuggestions)
        .map(l => l.id)
    }

    // Default: distribute evenly
    const step = Math.floor(locations.length / maxSuggestions)
    return locations
      .filter((_, i) => i % step === index % step)
      .slice(0, maxSuggestions)
      .map(l => l.id)
  }

  const generateHidingInstructions = (challenge: Challenge): string => {
    const baseInstructions = [
      `Hide sticker where participants can find it during their adventure.`,
      `Place in a location that relates to the "${challenge.name}" challenge.`
    ]

    // Type-specific instructions
    switch (challenge.type) {
      case 'photo':
        return baseInstructions.join(' ') + ' Consider scenic spots or interesting visual elements.'
      case 'puzzle':
      case 'riddle':
        return baseInstructions.join(' ') + ' Hide somewhere that adds to the mystery - under tables, behind signs, etc.'
      case 'team':
        return baseInstructions.join(' ') + ' Place in areas where teams can gather and work together.'
      case 'task':
        return baseInstructions.join(' ') + ' Position near areas where the physical task can be performed.'
      default:
        return baseInstructions.join(' ') + ' Use your creativity for the perfect hiding spot!'
    }
  }

  const getEstimatedDuration = (challenge: Challenge): number => {
    const baseDuration = {
      easy: 3,
      medium: 5,
      hard: 8,
      expert: 12
    }

    let duration = baseDuration[challenge.difficulty]

    // Adjust by challenge type
    switch (challenge.type) {
      case 'photo':
        duration += 2 // Time to get to location and take photo
        break
      case 'team':
        duration += 5 // Coordination time
        break
      case 'puzzle':
      case 'riddle':
        duration += 3 // Thinking time
        break
      case 'task':
        duration += 4 // Execution time
        break
    }

    return duration
  }

  const createNewMapping = (): ActivityMapping => {
    const availableStickers = activeStickers.filter(s => 
      !mappings.some(m => m.stickerId === s.id)
    )
    
    const firstAvailable = availableStickers[0]
    const challenge = activeChallenges.find(c => c.id === firstAvailable?.challengeId)

    return {
      id: crypto.randomUUID(),
      stickerId: firstAvailable?.id || '',
      stickerName: firstAvailable?.name || '',
      challengeId: firstAvailable?.challengeId || '',
      challengeName: firstAvailable?.challengeName || '',
      suggestedLocationIds: [],
      hidingInstructions: challenge ? generateHidingInstructions(challenge) : '',
      revealOrder: mappings.length + 1,
      isRequired: true,
      dependencies: [],
      estimatedDuration: challenge ? getEstimatedDuration(challenge) : 5,
      difficulty: challenge?.difficulty || 'medium',
      points: challenge?.points || 15,
      isActive: true
    }
  }

  const editMapping = (mapping: ActivityMapping) => {
    setSelectedMapping(mapping)
    setIsEditing(true)
  }

  const saveMapping = (mapping: ActivityMapping) => {
    const updatedMappings = selectedMapping && mappings.find(m => m.id === selectedMapping.id)
      ? mappings.map(m => m.id === mapping.id ? mapping : m)
      : [...mappings, mapping]

    setMappings(updatedMappings)
    onMappingsChange(updatedMappings)
    setSelectedMapping(null)
    setIsEditing(false)
  }

  const deleteMapping = (mappingId: string) => {
    const updatedMappings = mappings.filter(m => m.id !== mappingId)
    setMappings(updatedMappings)
    onMappingsChange(updatedMappings)
  }

  const reorderMapping = (mappingId: string, newOrder: number) => {
    const updatedMappings = mappings.map(m => {
      if (m.id === mappingId) return { ...m, revealOrder: newOrder }
      if (m.revealOrder >= newOrder && m.id !== mappingId) return { ...m, revealOrder: m.revealOrder + 1 }
      return m
    }).sort((a, b) => a.revealOrder - b.revealOrder)
    .map((m, index) => ({ ...m, revealOrder: index + 1 }))

    setMappings(updatedMappings)
    onMappingsChange(updatedMappings)
  }

  const getLocationName = (locationId: string): string => {
    const location = locations.find(l => l.id === locationId)
    return location ? location.name : 'Unknown Location'
  }

  const getMappingStats = () => {
    const total = activeStickers.length
    const mapped = mappings.filter(m => m.isActive).length
    const totalDuration = mappings.reduce((sum, m) => sum + m.estimatedDuration, 0)
    const totalPoints = mappings.reduce((sum, m) => sum + m.points, 0)

    return { total, mapped, totalDuration, totalPoints }
  }

  const generateAdventurePreview = () => {
    const sortedMappings = mappings
      .filter(m => m.isActive)
      .sort((a, b) => a.revealOrder - b.revealOrder)

    return sortedMappings.map(mapping => {
      const suggestedLocations = mapping.suggestedLocationIds
        .map(id => getLocationName(id))
        .filter(Boolean)

      return {
        ...mapping,
        suggestedLocationNames: suggestedLocations
      }
    })
  }

  const stats = getMappingStats()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-blue-200 mb-3 flex items-center justify-center gap-3">
          <Map className="h-7 w-7" />
          Activity Coordinator
        </h3>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Map your QR stickers to specific challenges and get location suggestions. Create the perfect flow for your {adventureType} adventure.
        </p>
      </div>

      {/* Adventure Type Context */}
      <div className="p-6 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-4">
        <h4 className="text-lg font-bold text-blue-200 flex items-center gap-2">
          {adventureType === 'linear' && <Route className="h-5 w-5" />}
          {adventureType === 'parallel' && <Layers className="h-5 w-5" />}
          {adventureType === 'hub' && <GitBranch className="h-5 w-5" />}
          {adventureType.charAt(0).toUpperCase() + adventureType.slice(1)} Adventure Coordination
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-400">{stats.mapped}/{stats.total}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">Stickers Mapped</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">{stats.totalDuration}min</div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">Est. Duration</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400">{stats.totalPoints}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">Total Points</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">{locations.length}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">Available Locations</div>
          </div>
        </div>

        {adventureType === 'linear' && (
          <div className="mt-4 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
            <div className="text-sm text-amber-300">
              <strong>Linear Mode:</strong> Stickers will be discovered in sequential order. Plan your difficulty progression carefully!
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-3">
          <GamingButton
            variant={viewMode === 'grid' ? 'mystery' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Target className="h-4 w-4" />
            Grid View
          </GamingButton>
          <GamingButton
            variant={viewMode === 'flow' ? 'mystery' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('flow')}
          >
            <GitBranch className="h-4 w-4" />
            Flow View
          </GamingButton>
          <GamingButton
            variant={viewMode === 'timeline' ? 'mystery' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('timeline')}
          >
            <Clock className="h-4 w-4" />
            Timeline
          </GamingButton>
        </div>

        <div className="flex gap-3">
          <GamingButton
            variant="ghost"
            size="md"
            onClick={() => setShowPreview(true)}
            disabled={mappings.length === 0}
          >
            <Eye className="h-4 w-4" />
            Preview Adventure
          </GamingButton>
          
          <GamingButton
            variant="outline"
            size="md"
            onClick={autoGenerateMappings}
            disabled={activeStickers.filter(s => !mappings.some(m => m.stickerId === s.id)).length === 0}
          >
            <Zap className="h-4 w-4" />
            Auto-Map ({activeStickers.filter(s => !mappings.some(m => m.stickerId === s.id)).length})
          </GamingButton>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mappings.sort((a, b) => a.revealOrder - b.revealOrder).map((mapping, index) => (
            <motion.div
              key={mapping.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <GamingCard className={`p-6 space-y-4 ${!mapping.isActive ? 'opacity-60' : ''}`}>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <GamingBadge variant="gold" size="sm">
                      #{mapping.revealOrder}
                    </GamingBadge>
                    <div className="flex-1">
                      <h5 className="text-base font-bold text-slate-200 mb-1">
                        {mapping.challengeName}
                      </h5>
                      <p className="text-xs text-slate-400">
                        Sticker: {mapping.stickerName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 text-xs">
                  <GamingBadge variant={
                    mapping.difficulty === 'easy' ? 'emerald' :
                    mapping.difficulty === 'medium' ? 'gold' :
                    mapping.difficulty === 'hard' ? 'purple' : 'red'
                  } size="sm">
                    {mapping.difficulty}
                  </GamingBadge>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Trophy className="h-3 w-3" />
                    {mapping.points}
                  </div>
                  <div className="flex items-center gap-1 text-blue-400">
                    <Clock className="h-3 w-3" />
                    {mapping.estimatedDuration}m
                  </div>
                </div>

                {/* Suggested Locations */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-green-300 uppercase tracking-wide">
                    Suggested Locations ({mapping.suggestedLocationIds.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {mapping.suggestedLocationIds.slice(0, 2).map(locationId => (
                      <span
                        key={locationId}
                        className="px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded"
                      >
                        {getLocationName(locationId)}
                      </span>
                    ))}
                    {mapping.suggestedLocationIds.length > 2 && (
                      <span className="px-2 py-1 text-xs bg-slate-700/50 text-slate-400 rounded">
                        +{mapping.suggestedLocationIds.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Hiding Instructions */}
                <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700">
                  <div className="text-xs text-slate-400 mb-1">Hiding Instructions:</div>
                  <div className="text-sm text-slate-300 line-clamp-2">
                    {mapping.hidingInstructions}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
                  <GamingButton
                    variant="ghost"
                    size="sm"
                    onClick={() => editMapping(mapping)}
                    className="flex-1"
                  >
                    <Settings className="h-3 w-3" />
                    Configure
                  </GamingButton>
                  {adventureType === 'linear' && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => mapping.revealOrder > 1 && reorderMapping(mapping.id, mapping.revealOrder - 1)}
                        disabled={mapping.revealOrder === 1}
                        className="p-1 rounded text-xs hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ⬆️
                      </button>
                      <button
                        onClick={() => mapping.revealOrder < mappings.length && reorderMapping(mapping.id, mapping.revealOrder + 1)}
                        disabled={mapping.revealOrder === mappings.length}
                        className="p-1 rounded text-xs hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ⬇️
                      </button>
                    </div>
                  )}
                </div>
              </GamingCard>
            </motion.div>
          ))}

          {/* Add New Mapping Card */}
          {activeStickers.filter(s => !mappings.some(m => m.stickerId === s.id)).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GamingCard className="p-6 border-dashed border-blue-500/30 bg-blue-500/5 text-center space-y-4 min-h-[300px] flex flex-col justify-center">
                <div className="text-blue-300 text-4xl mb-2">+</div>
                <h5 className="text-lg font-bold text-blue-200">
                  Create New Mapping
                </h5>
                <p className="text-sm text-slate-400 mb-4">
                  {activeStickers.filter(s => !mappings.some(m => m.stickerId === s.id)).length} stickers need mapping
                </p>
                <div className="space-y-2">
                  <GamingButton
                    variant="mystery"
                    size="md"
                    onClick={() => {
                      const newMapping = createNewMapping()
                      setSelectedMapping(newMapping)
                      setIsEditing(true)
                    }}
                    className="w-full"
                  >
                    <Target className="h-4 w-4" />
                    Map Single Sticker
                  </GamingButton>
                  <GamingButton
                    variant="outline"
                    size="sm"
                    onClick={autoGenerateMappings}
                    className="w-full"
                  >
                    <Zap className="h-4 w-4" />
                    Auto-Map All
                  </GamingButton>
                </div>
              </GamingCard>
            </motion.div>
          )}
        </div>
      )}

      {viewMode === 'flow' && (
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="text-lg font-bold text-slate-200 mb-2">Adventure Flow Visualization</h4>
            <p className="text-slate-400 text-sm">
              {adventureType === 'linear' ? 'Sequential progression through challenges' :
               adventureType === 'parallel' ? 'Parallel challenge completion paths' :
               'Hub-based branching adventure paths'}
            </p>
          </div>

          <div className="flex justify-center">
            <div className="max-w-4xl w-full">
              {adventureType === 'linear' ? (
                <div className="flex flex-col gap-4">
                  {mappings.sort((a, b) => a.revealOrder - b.revealOrder).map((mapping, index) => (
                    <div key={mapping.id} className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <GamingBadge variant="gold" size="md">
                          {mapping.revealOrder}
                        </GamingBadge>
                      </div>
                      <div className="flex-1 p-4 rounded-lg border border-slate-600 bg-slate-800/30">
                        <div className="font-bold text-slate-200">{mapping.challengeName}</div>
                        <div className="text-sm text-slate-400">
                          {mapping.estimatedDuration}min • {mapping.points} pts • 
                          {mapping.suggestedLocationIds.length} location suggestions
                        </div>
                      </div>
                      {index < mappings.length - 1 && (
                        <div className="flex-shrink-0">
                          <ArrowRight className="h-5 w-5 text-slate-500" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mappings.map((mapping) => (
                    <div key={mapping.id} className="p-4 rounded-lg border border-slate-600 bg-slate-800/30 text-center">
                      <div className="font-bold text-slate-200 mb-2">{mapping.challengeName}</div>
                      <div className="text-sm text-slate-400">
                        {mapping.estimatedDuration}min • {mapping.points} pts
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'timeline' && (
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="text-lg font-bold text-slate-200 mb-2">Adventure Timeline</h4>
            <p className="text-slate-400 text-sm">
              Estimated participant journey and timing breakdown
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-600"></div>
            <div className="space-y-6">
              {mappings.sort((a, b) => a.revealOrder - b.revealOrder).map((mapping, index) => {
                const cumulativeTime = mappings
                  .slice(0, index + 1)
                  .reduce((sum, m) => sum + m.estimatedDuration, 0)

                return (
                  <div key={mapping.id} className="relative flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-blue-500 bg-slate-900 flex items-center justify-center relative z-10">
                      <span className="text-xs font-bold text-blue-300">
                        {cumulativeTime}m
                      </span>
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="p-4 rounded-lg border border-slate-600 bg-slate-800/30">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-bold text-slate-200">{mapping.challengeName}</h5>
                          <GamingBadge variant="gold" size="sm">
                            #{mapping.revealOrder}
                          </GamingBadge>
                        </div>
                        <div className="text-sm text-slate-400 mb-3">
                          Duration: {mapping.estimatedDuration}min • 
                          Points: {mapping.points} • 
                          Difficulty: {mapping.difficulty}
                        </div>
                        {mapping.suggestedLocationIds.length > 0 && (
                          <div className="text-xs text-slate-500">
                            Suggested: {mapping.suggestedLocationIds.map(id => getLocationName(id)).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {mappings.length > 0 && (
            <div className="text-center p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
              <div className="text-lg font-bold text-emerald-200 mb-2">
                Total Adventure Time: {stats.totalDuration} minutes
              </div>
              <div className="text-sm text-slate-400">
                Estimated completion time including travel between locations
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty States */}
      {mappings.length === 0 && activeStickers.length === 0 && (
        <div className="text-center py-16">
          <Target className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-slate-300 mb-2">
            No QR stickers available
          </h4>
          <p className="text-slate-500 mb-6">
            Create challenges and generate QR stickers first before mapping activities
          </p>
        </div>
      )}

      {mappings.length === 0 && activeStickers.length > 0 && (
        <div className="text-center py-16">
          <Map className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-blue-200 mb-2">
            Ready to coordinate activities!
          </h4>
          <p className="text-slate-400 mb-6">
            You have {activeStickers.length} QR sticker{activeStickers.length !== 1 ? 's' : ''} ready for mapping
          </p>
          <GamingButton
            variant="mystery"
            size="lg"
            onClick={autoGenerateMappings}
          >
            <Zap className="h-5 w-5" />
            Auto-Generate Activity Map
          </GamingButton>
        </div>
      )}

      {/* Mapping Editor Modal */}
      <AnimatePresence>
        {isEditing && selectedMapping && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-900 border border-slate-600 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-blue-200">
                    Configure Activity Mapping
                  </h3>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setSelectedMapping(null)
                    }}
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Settings */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-slate-200">Basic Settings</h4>
                    
                    <div>
                      <label className="text-sm font-bold text-blue-300 uppercase tracking-wide mb-2 block">
                        QR Sticker
                      </label>
                      <select
                        value={selectedMapping.stickerId}
                        onChange={(e) => {
                          const sticker = activeStickers.find(s => s.id === e.target.value)
                          if (sticker) {
                            setSelectedMapping({
                              ...selectedMapping,
                              stickerId: sticker.id,
                              stickerName: sticker.name,
                              challengeId: sticker.challengeId,
                              challengeName: sticker.challengeName
                            })
                          }
                        }}
                        className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="">Select QR Sticker</option>
                        {activeStickers
                          .filter(s => s.id === selectedMapping.stickerId || !mappings.some(m => m.stickerId === s.id))
                          .map(sticker => (
                          <option key={sticker.id} value={sticker.id}>
                            {sticker.name} → {sticker.challengeName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-bold text-blue-300 uppercase tracking-wide mb-2 block">
                          Reveal Order
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={selectedMapping.revealOrder}
                          onChange={(e) => setSelectedMapping({
                            ...selectedMapping,
                            revealOrder: parseInt(e.target.value) || 1
                          })}
                          className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-bold text-blue-300 uppercase tracking-wide mb-2 block">
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="60"
                          value={selectedMapping.estimatedDuration}
                          onChange={(e) => setSelectedMapping({
                            ...selectedMapping,
                            estimatedDuration: parseInt(e.target.value) || 5
                          })}
                          className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                        <input
                          type="checkbox"
                          checked={selectedMapping.isRequired}
                          onChange={(e) => setSelectedMapping({
                            ...selectedMapping,
                            isRequired: e.target.checked
                          })}
                          className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        Required challenge
                      </label>
                      <p className="text-xs text-slate-500 mt-1">
                        Participants must complete this to progress
                      </p>
                    </div>
                  </div>

                  {/* Location Suggestions */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-slate-200">Location Suggestions</h4>
                    
                    <div>
                      <label className="text-sm font-bold text-green-300 uppercase tracking-wide mb-2 block">
                        Suggested Hiding Locations
                      </label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {locations.map(location => (
                          <label key={location.id} className="flex items-center gap-3 text-sm text-slate-300">
                            <input
                              type="checkbox"
                              checked={selectedMapping.suggestedLocationIds.includes(location.id)}
                              onChange={(e) => {
                                const newSuggestions = e.target.checked
                                  ? [...selectedMapping.suggestedLocationIds, location.id]
                                  : selectedMapping.suggestedLocationIds.filter(id => id !== location.id)
                                setSelectedMapping({
                                  ...selectedMapping,
                                  suggestedLocationIds: newSuggestions
                                })
                              }}
                              className="w-4 h-4 text-green-500 bg-slate-700 border-slate-600 rounded focus:ring-green-500 focus:ring-2"
                            />
                            <span className="flex-1">
                              #{location.order} {location.name}
                              {location.routeType && (
                                <span className="text-xs text-slate-500 ml-2">
                                  ({location.routeType})
                                </span>
                              )}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-amber-300 uppercase tracking-wide mb-2 block">
                        Hiding Instructions
                      </label>
                      <textarea
                        placeholder="Specific instructions for where to hide this sticker..."
                        value={selectedMapping.hidingInstructions}
                        onChange={(e) => setSelectedMapping({
                          ...selectedMapping,
                          hidingInstructions: e.target.value
                        })}
                        className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 min-h-[120px] resize-none"
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
                      setSelectedMapping(null)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </GamingButton>
                  {selectedMapping.id && mappings.find(m => m.id === selectedMapping.id) && (
                    <GamingButton
                      variant="outline"
                      size="md"
                      onClick={() => deleteMapping(selectedMapping.id)}
                      className="border-red-500/40 text-red-400 hover:border-red-400"
                    >
                      Delete
                    </GamingButton>
                  )}
                  <GamingButton
                    variant="mystery"
                    size="md"
                    onClick={() => saveMapping(selectedMapping)}
                    disabled={!selectedMapping.stickerId}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Save Mapping
                  </GamingButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Adventure Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-900 border border-slate-600 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-blue-200">
                    Adventure Preview
                  </h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Preview Content */}
                <div className="space-y-6">
                  <div className="text-center p-6 rounded-xl border border-blue-500/30 bg-blue-500/5">
                    <h4 className="text-lg font-bold text-blue-200 mb-2">
                      {adventureType.charAt(0).toUpperCase() + adventureType.slice(1)} Adventure Summary
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-400">{stats.mapped}</div>
                        <div className="text-xs text-slate-400">Challenges</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-emerald-400">{stats.totalDuration}min</div>
                        <div className="text-xs text-slate-400">Duration</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-amber-400">{stats.totalPoints}</div>
                        <div className="text-xs text-slate-400">Total Points</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-400">{locations.length}</div>
                        <div className="text-xs text-slate-400">Locations</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-lg font-bold text-slate-200">Challenge Sequence</h5>
                    {generateAdventurePreview().map((mapping, index) => (
                      <div key={mapping.id} className="p-4 rounded-lg border border-slate-600 bg-slate-800/30">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <GamingBadge variant="gold" size="sm">
                              {mapping.revealOrder}
                            </GamingBadge>
                            <h6 className="font-bold text-slate-200">{mapping.challengeName}</h6>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-amber-400">{mapping.points} pts</span>
                            <span className="text-blue-400">{mapping.estimatedDuration}m</span>
                          </div>
                        </div>
                        
                        {mapping.suggestedLocationNames.length > 0 && (
                          <div className="text-sm text-slate-400 mb-2">
                            <strong>Suggested locations:</strong> {mapping.suggestedLocationNames.join(', ')}
                          </div>
                        )}
                        
                        <div className="text-xs text-slate-500 bg-slate-800/40 p-2 rounded">
                          <strong>Hiding instructions:</strong> {mapping.hidingInstructions}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Export Actions */}
                <div className="flex gap-4 pt-4 border-t border-slate-700">
                  <GamingButton
                    variant="outline"
                    size="md"
                    onClick={() => {
                      const previewData = generateAdventurePreview()
                      const dataStr = JSON.stringify(previewData, null, 2)
                      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
                      
                      const exportFileDefaultName = `adventure-${adventureType}-${Date.now()}.json`
                      
                      const linkElement = document.createElement('a')
                      linkElement.setAttribute('href', dataUri)
                      linkElement.setAttribute('download', exportFileDefaultName)
                      linkElement.click()
                    }}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4" />
                    Export Configuration
                  </GamingButton>
                  <GamingButton
                    variant="mystery"
                    size="md"
                    onClick={() => setShowPreview(false)}
                    className="flex-1"
                  >
                    Close Preview
                  </GamingButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}