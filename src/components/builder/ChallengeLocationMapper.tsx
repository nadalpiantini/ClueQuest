'use client'

import React, { useState, useEffect } from 'react'
import { 
  MapPin, 
  Target, 
  ArrowRight, 
  Link as LinkIcon, 
  Unlink,
  CheckCircle,
  Clock,
  Users,
  Zap,
  Brain,
  Camera,
  Lock,
  Unlock,
  AlertCircle,
  Shuffle,
  RotateCcw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GamingButton, GamingCard, GamingBadge, GamingProgress } from '@/components/ui/gaming-components'

interface Challenge {
  id: string
  type: 'riddle' | 'photo' | 'question' | 'scan' | 'location' | 'team'
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  points: number
  timeLimit?: number // minutes
  isOptional: boolean
}

interface Location {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  order: number
  isRequired: boolean
}

interface ChallengeLocationMapping {
  id: string
  challengeId: string
  locationId: string
  unlockConditions: UnlockCondition[]
  progressiveHints: ProgressiveHint[]
  isStartingPoint: boolean
  completionRewards: number
}

interface UnlockCondition {
  type: 'location_proximity' | 'previous_challenge' | 'qr_scan' | 'time_window' | 'team_size'
  parameters: Record<string, any>
  description: string
}

interface ProgressiveHint {
  delayMinutes: number
  hint: string
  penaltyPoints: number
}

interface ChallengeLocationMapperProps {
  challenges: Challenge[]
  locations: Location[]
  mappings: ChallengeLocationMapping[]
  onMappingsChange: (mappings: ChallengeLocationMapping[]) => void
  adventureType: 'linear' | 'parallel' | 'hub'
}

export default function ChallengeLocationMapper({
  challenges,
  locations,
  mappings,
  onMappingsChange,
  adventureType = 'linear'
}: ChallengeLocationMapperProps) {
  const [selectedMapping, setSelectedMapping] = useState<ChallengeLocationMapping | null>(null)
  const [isCreatingMapping, setIsCreatingMapping] = useState(false)
  const [flowPreview, setFlowPreview] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const challengeTypeIcons = {
    riddle: Brain,
    photo: Camera,
    question: Target,
    scan: MapPin,
    location: MapPin,
    team: Users
  }

  const challengeTypeColors = {
    riddle: 'purple',
    photo: 'emerald', 
    question: 'blue',
    scan: 'amber',
    location: 'amber',
    team: 'red'
  } as const

  // Create new mapping
  const createMapping = () => {
    const newMapping: ChallengeLocationMapping = {
      id: crypto.randomUUID(),
      challengeId: '',
      locationId: '',
      unlockConditions: [],
      progressiveHints: [],
      isStartingPoint: mappings.length === 0,
      completionRewards: 10
    }
    setSelectedMapping(newMapping)
    setIsCreatingMapping(true)
  }

  // Save mapping
  const saveMapping = (mapping: ChallengeLocationMapping) => {
    const updatedMappings = mappings.find(m => m.id === mapping.id)
      ? mappings.map(m => m.id === mapping.id ? mapping : m)
      : [...mappings, mapping]

    onMappingsChange(updatedMappings)
    setSelectedMapping(null)
    setIsCreatingMapping(false)
  }

  // Delete mapping
  const deleteMapping = (mappingId: string) => {
    const updatedMappings = mappings.filter(m => m.id !== mappingId)
    onMappingsChange(updatedMappings)
  }

  // Validate adventure flow
  const validateFlow = () => {
    const errors: string[] = []
    
    // Check if we have at least one starting point
    const startingPoints = mappings.filter(m => m.isStartingPoint)
    if (startingPoints.length === 0 && mappings.length > 0) {
      errors.push('No starting point defined. Mark at least one mapping as a starting point.')
    }
    
    // Check for orphaned challenges
    const mappedChallenges = mappings.map(m => m.challengeId)
    const unmappedChallenges = challenges.filter(c => !mappedChallenges.includes(c.id))
    if (unmappedChallenges.length > 0) {
      errors.push(`${unmappedChallenges.length} challenges are not mapped to locations.`)
    }
    
    // Check for orphaned locations
    const mappedLocations = mappings.map(m => m.locationId)
    const unmappedLocations = locations.filter(l => !mappedLocations.includes(l.id))
    if (unmappedLocations.length > 0) {
      errors.push(`${unmappedLocations.length} locations don't have challenges assigned.`)
    }

    // Check circular dependencies for linear flow
    if (adventureType === 'linear') {
      // Simplified validation - in production would check full dependency graph
      if (mappings.length > 1 && startingPoints.length > 1) {
        errors.push('Linear adventures should have only one starting point.')
      }
    }

    setValidationErrors(errors)
    return errors.length === 0
  }

  // Auto-generate linear flow
  const generateLinearFlow = () => {
    if (challenges.length === 0 || locations.length === 0) return

    const newMappings: ChallengeLocationMapping[] = challenges
      .slice(0, Math.min(challenges.length, locations.length))
      .map((challenge, index) => {
        const location = locations[index]
        const isFirst = index === 0
        const previousChallenge = index > 0 ? challenges[index - 1] : null
        
        return {
          id: crypto.randomUUID(),
          challengeId: challenge.id,
          locationId: location.id,
          unlockConditions: isFirst ? [] : [
            {
              type: 'previous_challenge',
              parameters: { challengeId: previousChallenge!.id },
              description: `Complete "${previousChallenge!.title}" first`
            },
            {
              type: 'qr_scan',
              parameters: { locationId: location.id },
              description: `Scan QR code at ${location.name}`
            }
          ],
          progressiveHints: [
            {
              delayMinutes: 5,
              hint: `Head to ${location.name} and look for the QR code`,
              penaltyPoints: 2
            },
            {
              delayMinutes: 10,
              hint: `The challenge at ${location.name} is: ${challenge.description}`,
              penaltyPoints: 5
            }
          ],
          isStartingPoint: isFirst,
          completionRewards: challenge.points
        }
      })

    onMappingsChange(newMappings)
  }

  useEffect(() => {
    validateFlow()
  }, [mappings, challenges, locations, adventureType])

  const getChallenge = (challengeId: string) => challenges.find(c => c.id === challengeId)
  const getLocation = (locationId: string) => locations.find(l => l.id === locationId)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-emerald-200 mb-3 flex items-center justify-center gap-3">
          <LinkIcon className="h-7 w-7" />
          Challenge-Location Mapping
        </h3>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Connect challenges to specific locations and define the adventure flow. Set up progressive unlocks and hint systems.
        </p>
      </div>

      {/* Adventure Flow Type */}
      <div className="p-6 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-4">
        <h4 className="text-lg font-bold text-blue-200 flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Adventure Flow: {adventureType.charAt(0).toUpperCase() + adventureType.slice(1)}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className={`p-3 rounded-lg border ${
            adventureType === 'linear' 
              ? 'border-amber-500/40 bg-amber-500/10' 
              : 'border-slate-600/50 bg-slate-800/30'
          }`}>
            <div className="font-bold text-amber-200 mb-1">Linear Flow</div>
            <div className="text-slate-400">Challenges unlock in sequence</div>
          </div>
          <div className={`p-3 rounded-lg border ${
            adventureType === 'parallel' 
              ? 'border-emerald-500/40 bg-emerald-500/10' 
              : 'border-slate-600/50 bg-slate-800/30'
          }`}>
            <div className="font-bold text-emerald-200 mb-1">Parallel Flow</div>
            <div className="text-slate-400">Multiple challenges available</div>
          </div>
          <div className={`p-3 rounded-lg border ${
            adventureType === 'hub' 
              ? 'border-purple-500/40 bg-purple-500/10' 
              : 'border-slate-600/50 bg-slate-800/30'
          }`}>
            <div className="font-bold text-purple-200 mb-1">Hub Flow</div>
            <div className="text-slate-400">Central location with branches</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 items-center">
        <GamingButton
          variant="mystery"
          size="md"
          onClick={createMapping}
          disabled={challenges.length === 0 || locations.length === 0}
        >
          <LinkIcon className="h-4 w-4" />
          Create Mapping
        </GamingButton>

        <GamingButton
          variant="outline"
          size="md"
          onClick={generateLinearFlow}
          disabled={challenges.length === 0 || locations.length === 0}
        >
          <Shuffle className="h-4 w-4" />
          Auto-Generate Linear Flow
        </GamingButton>

        <GamingButton
          variant="ghost"
          size="md"
          onClick={() => setFlowPreview(!flowPreview)}
          disabled={mappings.length === 0}
        >
          {flowPreview ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          {flowPreview ? 'Hide' : 'Preview'} Flow
        </GamingButton>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border border-red-500/40 bg-red-500/10"
        >
          <div className="flex items-center gap-2 text-red-300 font-bold mb-2">
            <AlertCircle className="h-5 w-5" />
            Flow Validation Issues
          </div>
          <ul className="space-y-1 text-sm text-red-200">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Flow Preview */}
      <AnimatePresence>
        {flowPreview && mappings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <GamingCard className="p-6 space-y-6">
              <h4 className="text-lg font-bold text-emerald-200 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Adventure Flow Preview
              </h4>

              <div className="space-y-4">
                {mappings
                  .sort((a, b) => {
                    if (a.isStartingPoint) return -1
                    if (b.isStartingPoint) return 1
                    return 0
                  })
                  .map((mapping, index) => {
                    const challenge = getChallenge(mapping.challengeId)
                    const location = getLocation(mapping.locationId)
                    
                    if (!challenge || !location) return null

                    return (
                      <motion.div
                        key={mapping.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-lg border border-slate-600/50 bg-slate-800/30"
                      >
                        <div className="flex items-center gap-3">
                          {mapping.isStartingPoint && (
                            <GamingBadge variant="emerald" size="sm">
                              START
                            </GamingBadge>
                          )}
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                            <span className="text-sm font-bold text-amber-200">
                              {index + 1}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="font-semibold text-slate-200">
                              {challenge.title}
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-500" />
                            <div className="font-semibold text-amber-200">
                              {location.name}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {challenge.type}
                            </div>
                            <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              {challenge.points} pts
                            </div>
                            {challenge.timeLimit && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {challenge.timeLimit}m
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {mapping.unlockConditions.length > 0 && (
                            <GamingBadge variant="purple" size="sm">
                              <Lock className="h-3 w-3" />
                              {mapping.unlockConditions.length} conditions
                            </GamingBadge>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
              </div>
            </GamingCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mappings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mappings.map((mapping, index) => {
          const challenge = getChallenge(mapping.challengeId)
          const location = getLocation(mapping.locationId)
          
          if (!challenge || !location) return null

          const ChallengeIcon = challengeTypeIcons[challenge.type] || Target

          return (
            <motion.div
              key={mapping.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <GamingCard className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      {mapping.isStartingPoint && (
                        <GamingBadge variant="emerald" size="sm">
                          START
                        </GamingBadge>
                      )}
                      <GamingBadge 
                        variant={challengeTypeColors[challenge.type]} 
                        size="sm"
                      >
                        <ChallengeIcon className="h-3 w-3" />
                        {challenge.type}
                      </GamingBadge>
                    </div>
                    
                    <h5 className="text-lg font-bold text-amber-200">
                      {challenge.title}
                    </h5>
                    <div className="text-sm text-purple-300 font-medium">
                      at {location.name}
                    </div>
                  </div>
                  
                  <div className="text-right text-xs text-slate-400">
                    <div>{challenge.points} points</div>
                    {challenge.timeLimit && <div>{challenge.timeLimit}m limit</div>}
                  </div>
                </div>

                {/* Unlock Conditions */}
                {mapping.unlockConditions.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-300">Unlock Conditions:</div>
                    <div className="space-y-1">
                      {mapping.unlockConditions.map((condition, idx) => (
                        <div 
                          key={idx}
                          className="text-xs text-slate-400 flex items-center gap-2 p-2 rounded bg-slate-800/40"
                        >
                          <Lock className="h-3 w-3" />
                          {condition.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progressive Hints */}
                {mapping.progressiveHints.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-300">Progressive Hints:</div>
                    <div className="space-y-1">
                      {mapping.progressiveHints.map((hint, idx) => (
                        <div 
                          key={idx}
                          className="text-xs text-slate-400 flex items-center justify-between p-2 rounded bg-slate-800/40"
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            After {hint.delayMinutes}min: {hint.hint}
                          </div>
                          <div className="text-red-300 font-semibold">
                            -{hint.penaltyPoints}pts
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-slate-700/50">
                  <GamingButton
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedMapping(mapping)
                      setIsCreatingMapping(true)
                    }}
                    className="flex-1 text-xs"
                  >
                    Edit
                  </GamingButton>
                  <GamingButton
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMapping(mapping.id)}
                    className="flex-1 text-xs border-red-500/40 text-red-400"
                  >
                    Delete
                  </GamingButton>
                </div>
              </GamingCard>
            </motion.div>
          )
        })}

        {/* Empty State */}
        {mappings.length === 0 && (
          <div className="col-span-2 text-center py-16">
            <LinkIcon className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-slate-300 mb-2">
              No mappings created yet
            </h4>
            <p className="text-slate-500 mb-6">
              Connect challenges to locations to create your adventure flow
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <GamingButton
                variant="mystery"
                onClick={createMapping}
                disabled={challenges.length === 0 || locations.length === 0}
              >
                <LinkIcon className="h-5 w-5" />
                Create First Mapping
              </GamingButton>
              
              <GamingButton
                variant="outline"
                onClick={generateLinearFlow}
                disabled={challenges.length === 0 || locations.length === 0}
              >
                <Shuffle className="h-5 w-5" />
                Auto-Generate Flow
              </GamingButton>
            </div>
          </div>
        )}
      </div>

      {/* Validation Summary */}
      {mappings.length > 0 && (
        <div className="p-6 rounded-xl border border-slate-600/50 bg-slate-800/30 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Flow Validation
            </h4>
            
            {validationErrors.length === 0 ? (
              <GamingBadge variant="emerald">
                <CheckCircle className="h-3 w-3" />
                Valid Flow
              </GamingBadge>
            ) : (
              <GamingBadge variant="red">
                <AlertCircle className="h-3 w-3" />
                {validationErrors.length} Issues
              </GamingBadge>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-amber-400">{mappings.length}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Total Mappings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">
                {mappings.filter(m => m.isStartingPoint).length}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Starting Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {mappings.reduce((sum, m) => sum + m.unlockConditions.length, 0)}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Unlock Conditions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {mappings.reduce((sum, m) => sum + m.completionRewards, 0)}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">Total Points</div>
            </div>
          </div>
        </div>
      )}

      {/* Mapping Editor Modal */}
      <AnimatePresence>
        {isCreatingMapping && selectedMapping && (
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
                  <h3 className="text-xl font-bold text-emerald-200">
                    Create Challenge-Location Mapping
                  </h3>
                  <button
                    onClick={() => {
                      setIsCreatingMapping(false)
                      setSelectedMapping(null)
                    }}
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Challenge Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-amber-300 uppercase tracking-wide mb-3 block">
                      Select Challenge
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {challenges.map(challenge => {
                        const Icon = challengeTypeIcons[challenge.type] || Target
                        const isSelected = selectedMapping.challengeId === challenge.id
                        
                        return (
                          <button
                            key={challenge.id}
                            onClick={() => setSelectedMapping({
                              ...selectedMapping,
                              challengeId: challenge.id,
                              completionRewards: challenge.points
                            })}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              isSelected
                                ? 'border-amber-500/40 bg-amber-500/10'
                                : 'border-slate-600/50 bg-slate-800/30 hover:border-amber-500/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="h-4 w-4 text-amber-400" />
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-slate-200 text-sm">
                                  {challenge.title}
                                </div>
                                <div className="text-xs text-slate-400 truncate">
                                  {challenge.type} • {challenge.points} points
                                </div>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Location Selection */}
                  <div>
                    <label className="text-sm font-bold text-purple-300 uppercase tracking-wide mb-3 block">
                      Select Location
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {locations.map(location => {
                        const isSelected = selectedMapping.locationId === location.id
                        
                        return (
                          <button
                            key={location.id}
                            onClick={() => setSelectedMapping({
                              ...selectedMapping,
                              locationId: location.id
                            })}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              isSelected
                                ? 'border-purple-500/40 bg-purple-500/10'
                                : 'border-slate-600/50 bg-slate-800/30 hover:border-purple-500/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <MapPin className="h-4 w-4 text-purple-400" />
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-slate-200 text-sm">
                                  {location.name}
                                </div>
                                <div className="text-xs text-slate-400 truncate">
                                  Order #{location.order}
                                </div>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Mapping Configuration */}
                {selectedMapping.challengeId && selectedMapping.locationId && (
                  <div className="space-y-4 p-4 rounded-xl border border-slate-600/50 bg-slate-800/20">
                    <h5 className="text-base font-bold text-slate-200">Mapping Configuration</h5>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                        <input
                          type="checkbox"
                          checked={selectedMapping.isStartingPoint}
                          onChange={(e) => setSelectedMapping({
                            ...selectedMapping,
                            isStartingPoint: e.target.checked
                          })}
                          className="w-4 h-4 text-emerald-500 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2"
                        />
                        Starting point
                      </label>

                      <div>
                        <label className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-2 block">
                          Completion Rewards
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={selectedMapping.completionRewards}
                          onChange={(e) => setSelectedMapping({
                            ...selectedMapping,
                            completionRewards: parseInt(e.target.value) || 0
                          })}
                          className="w-full px-3 py-2 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-slate-700">
                  <GamingButton
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsCreatingMapping(false)
                      setSelectedMapping(null)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </GamingButton>
                  <GamingButton
                    variant="mystery"
                    size="sm"
                    onClick={() => saveMapping(selectedMapping)}
                    disabled={!selectedMapping.challengeId || !selectedMapping.locationId}
                    className="flex-1"
                  >
                    Save Mapping
                  </GamingButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Requirements Check */}
      {(challenges.length === 0 || locations.length === 0) && (
        <div className="text-center py-16">
          <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-amber-200 mb-2">
            Prerequisites Required
          </h4>
          <p className="text-slate-400 mb-6">
            You need both challenges and locations to create mappings
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-sm">
            <div className={`p-3 rounded-lg border ${
              challenges.length > 0 
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                : 'border-red-500/40 bg-red-500/10 text-red-200'
            }`}>
              <div className="font-bold">Challenges</div>
              <div>{challenges.length} available</div>
            </div>
            <div className={`p-3 rounded-lg border ${
              locations.length > 0 
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                : 'border-red-500/40 bg-red-500/10 text-red-200'
            }`}>
              <div className="font-bold">Locations</div>
              <div>{locations.length} available</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}