'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Users, Crown, Shield, Wand2, Sword, Heart, Star, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ADVENTURE_THEMES, type Role, type Participant } from '@/types/adventure'

interface RoleCardProps {
  role: Role
  isSelected: boolean
  onSelect: () => void
  participantCount: number
  isRecommended: boolean
  theme: any
}

const RoleCard = ({ role, isSelected, onSelect, participantCount, isRecommended, theme }: RoleCardProps) => {
  const getRoleIcon = () => {
    const icons = {
      'leader': Crown,
      'warrior': Sword,
      'mage': Wand2,
      'healer': Heart,
      'scout': Star,
      'guardian': Shield
    }
    return icons[role.name.toLowerCase() as keyof typeof icons] || Users
  }

  const Icon = getRoleIcon()

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-300 relative overflow-hidden h-full ${
          isSelected 
            ? 'ring-2 shadow-lg bg-primary/5'
            : 'hover:shadow-md bg-card hover:bg-card/50'
        }`}
        style={{
          borderColor: isSelected ? theme.colors.primary : undefined
        }}
        onClick={onSelect}
      >
        {/* Recommended Badge */}
        <AnimatePresence>
          {isRecommended && (
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -12 }}
              animate={{ opacity: 1, scale: 1, rotate: -12 }}
              className="absolute -top-2 -right-2 z-10"
            >
              <Badge 
                className="bg-secondary text-secondary-foreground font-bold px-2 py-1 shadow-md"
                style={{ backgroundColor: theme.colors.secondary }}
              >
                AI PICK
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* Role Icon */}
              <div 
                className="w-12 h-12 rounded-full center-flex text-white text-lg font-bold"
                style={{ backgroundColor: role.color }}
              >
                <Icon className="w-6 h-6" />
              </div>
              
              <div>
                <CardTitle className="text-lg font-semibold">{role.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    {participantCount}/{role.suggested_count}
                  </Badge>
                  {participantCount >= role.suggested_count && (
                    <Badge variant="secondary" className="text-xs">
                      FULL
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {role.description}
          </p>

          {/* Perks */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Special Abilities
            </p>
            <div className="space-y-1">
              {role.perks.slice(0, 2).map((perk, index) => (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <Star className="w-3 h-3 mt-0.5 text-yellow-500 flex-shrink-0" />
                  <span className="text-muted-foreground">{perk.description}</span>
                </div>
              ))}
              {role.perks.length > 2 && (
                <p className="text-xs text-muted-foreground font-medium">
                  +{role.perks.length - 2} more abilities
                </p>
              )}
            </div>
          </div>

          {/* Score Multipliers */}
          {role.multipliers && role.multipliers.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Bonus Scoring
              </p>
              <div className="flex flex-wrap gap-1">
                {role.multipliers.slice(0, 2).map((multiplier, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {multiplier.multiplier}x {multiplier.condition}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        {/* Selection Indicator */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundColor: `${theme.colors.primary}10` }}
            >
              <div 
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: theme.colors.primary }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

export default function RoleSelectionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionCode = searchParams.get('session')
  const isGuest = searchParams.get('guest') === 'true'

  const [adventure, setAdventure] = useState<any>(null)
  const [roles, setRoles] = useState<Role[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [selectedRoleId, setSelectedRoleId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [teamBalance, setTeamBalance] = useState<Record<string, number>>({})
  const [aiRecommendation, setAiRecommendation] = useState<string>('')

  // Load adventure and role data
  useEffect(() => {
    loadAdventureData()
    if (sessionCode) {
      loadParticipants()
    }
  }, [sessionCode])

  // Calculate team balance and AI recommendations
  useEffect(() => {
    if (roles.length > 0 && participants.length > 0) {
      calculateTeamBalance()
      generateAIRecommendation()
    }
  }, [roles, participants])

  const loadAdventureData = async () => {
    try {
      // Mock adventure data
      const adventureData = {
        id: '1',
        title: 'The Enchanted Forest Quest',
        theme: 'fantasy' as const,
        roles: [
          {
            id: '1',
            adventure_id: '1',
            name: 'Leader',
            description: 'Guide your team through challenges with natural charisma and strategic thinking.',
            color: '#8B5CF6',
            icon_url: null,
            suggested_count: 1,
            perks: [
              { id: '1', name: 'Command Presence', description: 'Can rally team for group challenges', perk_type: 'team_buff' as const, value: 1.2, conditions: [] },
              { id: '2', name: 'Strategic Mind', description: 'Receives hints about optimal paths', perk_type: 'hint_access' as const, value: 1, conditions: [] }
            ],
            multipliers: [
              { condition: 'team challenges', multiplier: 1.5, description: 'Bonus for successful team coordination' }
            ]
          },
          {
            id: '2',
            adventure_id: '1',
            name: 'Warrior',
            description: 'Face physical and combat challenges with courage and determination.',
            color: '#DC2626',
            icon_url: null,
            suggested_count: 2,
            perks: [
              { id: '3', name: 'Combat Expert', description: 'Extra damage in battle challenges', perk_type: 'extra_points' as const, value: 25, conditions: ['combat'] },
              { id: '4', name: 'Protective Stance', description: 'Can shield teammates from penalties', perk_type: 'team_buff' as const, value: 1, conditions: [] }
            ],
            multipliers: [
              { condition: 'physical challenges', multiplier: 2.0, description: 'Double points for strength-based tasks' }
            ]
          },
          {
            id: '3',
            adventure_id: '1',
            name: 'Mage',
            description: 'Harness magical knowledge to solve puzzles and unlock arcane secrets.',
            color: '#0EA5E9',
            icon_url: null,
            suggested_count: 1,
            perks: [
              { id: '5', name: 'Arcane Knowledge', description: 'Can identify magical items and runes', perk_type: 'hint_access' as const, value: 1, conditions: ['magic'] },
              { id: '6', name: 'Spell Mastery', description: 'Bonus points for puzzle solving', perk_type: 'extra_points' as const, value: 30, conditions: ['puzzle'] }
            ],
            multipliers: [
              { condition: 'knowledge challenges', multiplier: 1.8, description: 'Bonus for wisdom-based challenges' }
            ]
          },
          {
            id: '4',
            adventure_id: '1',
            name: 'Healer',
            description: 'Support your team with restoration abilities and team coordination.',
            color: '#10B981',
            icon_url: null,
            suggested_count: 1,
            perks: [
              { id: '7', name: 'Team Recovery', description: 'Can restore team chances after failures', perk_type: 'team_buff' as const, value: 1, conditions: [] },
              { id: '8', name: 'Empathy', description: 'Receives bonus points for helping others', perk_type: 'extra_points' as const, value: 20, conditions: ['cooperation'] }
            ],
            multipliers: [
              { condition: 'team support', multiplier: 2.5, description: 'High bonus for collaborative actions' }
            ]
          },
          {
            id: '5',
            adventure_id: '1',
            name: 'Scout',
            description: 'Use stealth and perception to discover hidden paths and secrets.',
            color: '#059669',
            icon_url: null,
            suggested_count: 2,
            perks: [
              { id: '9', name: 'Eagle Eye', description: 'Can spot hidden QR codes and clues', perk_type: 'hint_access' as const, value: 1, conditions: ['exploration'] },
              { id: '10', name: 'Swift Movement', description: 'Reduced cooldown between challenges', perk_type: 'speed_boost' as const, value: 0.8, conditions: [] }
            ],
            multipliers: [
              { condition: 'exploration', multiplier: 1.6, description: 'Bonus for discovering secrets' }
            ]
          }
        ]
      }

      setAdventure(adventureData)
      setRoles(adventureData.roles)
    } catch (error) {
      console.error('Failed to load adventure data:', error)
    }
  }

  const loadParticipants = async () => {
    try {
      // Mock participants data
      const participantsData: Participant[] = [
        {
          id: '1',
          session_id: sessionCode!,
          user_id: 'user1',
          guest_name: null,
          role_id: '2', // Warrior
          avatar_url: null,
          status: 'waiting',
          score: 0,
          current_scene_id: null,
          progress: { completed_scenes: [], completed_challenges: [], collected_items: [], achievements: [], hint_usage: [], total_score: 0, time_spent_minutes: 0, collaboration_score: 0 },
          joined_at: new Date().toISOString(),
          last_active_at: new Date().toISOString()
        },
        {
          id: '2',
          session_id: sessionCode!,
          user_id: 'user2',
          guest_name: null,
          role_id: '3', // Mage
          avatar_url: null,
          status: 'waiting',
          score: 0,
          current_scene_id: null,
          progress: { completed_scenes: [], completed_challenges: [], collected_items: [], achievements: [], hint_usage: [], total_score: 0, time_spent_minutes: 0, collaboration_score: 0 },
          joined_at: new Date().toISOString(),
          last_active_at: new Date().toISOString()
        }
      ]

      setParticipants(participantsData)
    } catch (error) {
      console.error('Failed to load participants:', error)
    }
  }

  const calculateTeamBalance = () => {
    const balance: Record<string, number> = {}
    
    roles.forEach(role => {
      const count = participants.filter(p => p.role_id === role.id).length
      balance[role.id] = count
    })
    
    setTeamBalance(balance)
  }

  const generateAIRecommendation = () => {
    // Find roles that need more participants
    const neededRoles = roles.filter(role => {
      const currentCount = teamBalance[role.id] || 0
      return currentCount < role.suggested_count
    })

    if (neededRoles.length > 0) {
      // Prioritize by how urgently needed
      const mostNeeded = neededRoles.reduce((prev, current) => {
        const prevNeed = prev.suggested_count - (teamBalance[prev.id] || 0)
        const currentNeed = current.suggested_count - (teamBalance[current.id] || 0)
        return currentNeed > prevNeed ? current : prev
      })
      
      setAiRecommendation(mostNeeded.id)
    } else {
      // All roles filled, recommend based on user preference or balance
      setAiRecommendation('')
    }
  }

  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId)
  }

  const handleConfirmRole = async () => {
    if (!selectedRoleId) return

    setIsLoading(true)
    try {
      // TODO: API call to join session with selected role
      const response = await fetch('/api/sessions/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionCode,
          roleId: selectedRoleId,
          isGuest
        })
      })

      if (response.ok) {
        const result = await response.json()
        
        // Save participant data
        localStorage.setItem('cluequest_participant', JSON.stringify(result.participant))
        
        // Navigate to avatar generation
        router.push(`/avatar-generation?session=${sessionCode}${isGuest ? '&guest=true' : ''}`)
      } else {
        const error = await response.json()
        console.error('Failed to join session:', error)
      }
    } catch (error) {
      console.error('Failed to select role:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!adventure || roles.length === 0) {
    return (
      <div className="min-h-screen center-flex">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p>Loading roles...</p>
        </div>
      </div>
    )
  }

  const theme = ADVENTURE_THEMES[adventure.theme as keyof typeof ADVENTURE_THEMES]
  const totalParticipants = participants.length
  const selectedRole = roles.find(role => role.id === selectedRoleId)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="pt-safe px-4 py-6 bg-card border-b">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Choose Your Role</h1>
            <p className="text-muted-foreground">
              Select a role that matches your playstyle and helps balance the team
            </p>
          </div>

          {/* Team Balance Overview */}
          {totalParticipants > 0 && (
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Team Balance</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {totalParticipants + 1} players
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {roles.map(role => {
                  const count = teamBalance[role.id] || 0
                  const needed = role.suggested_count
                  const percentage = Math.min((count / needed) * 100, 100)
                  const isBalanced = count >= needed
                  
                  return (
                    <div key={role.id} className="text-xs">
                      <div className="flex justify-between mb-1">
                        <span className={isBalanced ? 'text-green-600' : 'text-muted-foreground'}>
                          {role.name}
                        </span>
                        <span className={isBalanced ? 'text-green-600' : 'text-muted-foreground'}>
                          {count}/{needed}
                        </span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-1"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* AI Recommendation */}
          <AnimatePresence>
            {aiRecommendation && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4"
              >
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">AI Recommendation</p>
                    <p className="text-blue-700">
                      Your team needs a <strong>{roles.find(r => r.id === aiRecommendation)?.name}</strong> for optimal balance.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Role Grid */}
      <div className="px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {roles.map(role => (
              <RoleCard
                key={role.id}
                role={role}
                isSelected={selectedRoleId === role.id}
                onSelect={() => handleRoleSelect(role.id)}
                participantCount={teamBalance[role.id] || 0}
                isRecommended={role.id === aiRecommendation}
                theme={theme}
              />
            ))}
          </div>

          {/* Selection Summary & Continue */}
          <AnimatePresence>
            {selectedRole && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 pb-safe shadow-lg"
              >
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full center-flex text-white font-bold"
                        style={{ backgroundColor: selectedRole.color }}
                      >
                        {selectedRole.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold">{selectedRole.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedRole.perks.length} special abilities
                        </p>
                      </div>
                    </div>

                    <Button 
                      onClick={handleConfirmRole}
                      disabled={isLoading}
                      size="lg"
                      className="touch-target"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Joining...</span>
                        </div>
                      ) : (
                        'Confirm Role'
                      )}
                    </Button>
                  </div>

                  {/* Team Balance Warning */}
                  {selectedRole && teamBalance[selectedRole.id] >= selectedRole.suggested_count && (
                    <div className="mt-3 flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-yellow-800">
                        This role is already full. Consider choosing a different role for better team balance.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}