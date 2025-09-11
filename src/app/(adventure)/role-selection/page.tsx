'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Users, Crown, Shield, Wand2, Sword, Heart, Star, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ADVENTURE_THEMES, type Role, type Participant } from '@/types/adventure'

// Genre to role category mapping - SURGICALLY PRECISE for perfect thematic coherence
const GENRE_TO_ROLE_CATEGORY_MAP: Record<string, string[]> = {
  // FANTASY: Pure magical and medieval fantasy roles only
  'fantasy': ['Fantasy', 'Mystical', 'Historical'],
  
  // MYSTERY: Investigation and knowledge-based roles only
  'mystery': ['Mystery', 'Academic'],
  
  // DETECTIVE: Same as mystery - focused investigation
  'detective': ['Mystery', 'Academic'],
  
  // SCI-FI: Technology and science roles only
  'sci-fi': ['Tech', 'Academic'],
  
  // HORROR: Supernatural and investigation roles only
  'horror': ['Mystical', 'Mystery'],
  
  // ADVENTURE: Pure exploration and combat roles
  'adventure': ['Adventure', 'Combat'],
  
  // TREASURE-HUNT: Exploration with mystery solving
  'treasure-hunt': ['Adventure', 'Mystery'],
  
  // ESCAPE-ROOM: Problem-solving and technical roles
  'escape-room': ['Academic', 'Tech'],
  
  // PUZZLE: Intellectual and creative problem-solving
  'puzzle': ['Academic', 'Creative'],
  
  // CORPORATE: Business leadership roles only
  'corporate': ['Corporate'],
  
  // EDUCATIONAL: Learning and knowledge roles
  'educational': ['Academic', 'Modern'],
  
  // TEAM-BUILDING: Leadership and support roles
  'team-building': ['Corporate', 'Support'],
  
  // SOCIAL: Creative and supportive roles
  'social': ['Creative', 'Support'],
  
  // ENTERTAINMENT: Diverse fun roles
  'entertainment': ['Creative', 'Fantasy', 'Adventure']
}

// All available roles with their categories (from builder)
const ALL_ROLES = [
  // Fantasy & Magic
  { id: 'wizard', name: 'Wizard', emoji: '🧙‍♂️', description: 'Master of arcane mysteries', perks: ['Additional clues', '1.2x score multiplier', 'Magical vision'], color: 'purple', maxPlayers: 2, category: 'Fantasy' },
  { id: 'sorceress', name: 'Sorceress', emoji: '🧙‍♀️', description: 'Enchantress of elemental forces', perks: ['Elemental insights', 'Weather prediction', 'Nature communication'], color: 'violet', maxPlayers: 2, category: 'Fantasy' },
  { id: 'paladin', name: 'Paladin', emoji: '🛡️', description: 'Holy warrior and protector', perks: ['Divine protection', 'Team healing', 'Evil detection'], color: 'yellow', maxPlayers: 2, category: 'Fantasy' },
  { id: 'rogue', name: 'Rogue', emoji: '🗡️', description: 'Master of stealth and cunning', perks: ['Lockpicking bonus', 'Stealth mode', 'Trap detection'], color: 'gray', maxPlayers: 3, category: 'Fantasy' },
  { id: 'bard', name: 'Bard', emoji: '🎵', description: 'Storyteller and team motivator', perks: ['Team morale boost', 'Story knowledge', 'Persuasion bonus'], color: 'orange', maxPlayers: 2, category: 'Fantasy' },
  { id: 'druid', name: 'Druid', emoji: '🌿', description: 'Nature guardian and shapeshifter', perks: ['Animal communication', 'Plant knowledge', 'Weather sense'], color: 'green', maxPlayers: 2, category: 'Fantasy' },
  
  // Combat & Action
  { id: 'warrior', name: 'Warrior', emoji: '⚔️', description: 'Brave leader of the group', perks: ['Speed bonus points', 'Team leadership', 'Extra endurance'], color: 'red', maxPlayers: 3, category: 'Combat' },
  { id: 'archer', name: 'Archer', emoji: '🏹', description: 'Precision marksman and scout', perks: ['Long-range vision', 'Target accuracy', 'Scouting bonus'], color: 'emerald', maxPlayers: 2, category: 'Combat' },
  { id: 'knight', name: 'Knight', emoji: '🤺', description: 'Honorable champion and tactician', perks: ['Strategic planning', 'Honor bonus', 'Team coordination'], color: 'blue', maxPlayers: 2, category: 'Combat' },
  { id: 'assassin', name: 'Assassin', emoji: '🥷', description: 'Silent eliminator and infiltrator', perks: ['Silent movement', 'Critical strikes', 'Information gathering'], color: 'slate', maxPlayers: 1, category: 'Combat' },
  
  // Investigation & Mystery
  { id: 'detective', name: 'Detective', emoji: '🕵️', description: 'Expert clue investigator', perks: ['Advanced analysis', 'Fraud detection', 'Special intuition'], color: 'amber', maxPlayers: 2, category: 'Mystery' },
  { id: 'forensic', name: 'Forensic Expert', emoji: '🔬', description: 'Scientific crime scene analyst', perks: ['Evidence analysis', 'DNA insights', 'Crime reconstruction'], color: 'cyan', maxPlayers: 2, category: 'Mystery' },
  { id: 'spy', name: 'Secret Agent', emoji: '🕶️', description: 'Undercover intelligence operative', perks: ['Surveillance skills', 'Gadget access', 'Code breaking'], color: 'zinc', maxPlayers: 2, category: 'Mystery' },
  { id: 'reporter', name: 'Investigative Reporter', emoji: '📰', description: 'Truth-seeking journalist', perks: ['Information network', 'Interview skills', 'Research bonus'], color: 'teal', maxPlayers: 3, category: 'Mystery' },
  
  // Intellectual & Academic
  { id: 'scholar', name: 'Scholar', emoji: '📚', description: 'Keeper of ancient secrets', perks: ['Bonus knowledge', 'Clue translation', 'Ancestral wisdom'], color: 'emerald', maxPlayers: 3, category: 'Academic' },
  { id: 'scientist', name: 'Mad Scientist', emoji: '🧪', description: 'Experimental researcher and inventor', perks: ['Invention creation', 'Formula knowledge', 'Lab analysis'], color: 'lime', maxPlayers: 2, category: 'Academic' },
  { id: 'archaeologist', name: 'Archaeologist', emoji: '⛏️', description: 'Ancient artifact specialist', perks: ['Artifact knowledge', 'Historical insights', 'Excavation bonus'], color: 'amber', maxPlayers: 2, category: 'Academic' },
  { id: 'librarian', name: 'Master Librarian', emoji: '📖', description: 'Guardian of knowledge and texts', perks: ['Text deciphering', 'Research speed', 'Memory palace'], color: 'indigo', maxPlayers: 2, category: 'Academic' },
  
  // Technology & Modern
  { id: 'hacker', name: 'Hacker', emoji: '💻', description: 'Digital infiltration expert', perks: ['System access', 'Code breaking', 'Digital forensics'], color: 'green', maxPlayers: 2, category: 'Tech' },
  { id: 'engineer', name: 'Engineer', emoji: '⚙️', description: 'Mechanical systems specialist', perks: ['Device repair', 'Blueprint reading', 'System analysis'], color: 'slate', maxPlayers: 3, category: 'Tech' },
  { id: 'pilot', name: 'Pilot', emoji: '✈️', description: 'Navigation and transport expert', perks: ['Route optimization', 'Vehicle control', 'Emergency maneuvers'], color: 'sky', maxPlayers: 1, category: 'Tech' },
  
  // Support & Healing
  { id: 'medic', name: 'Combat Medic', emoji: '⛑️', description: 'Battlefield healer and support', perks: ['Team healing', 'Injury assessment', 'Emergency response'], color: 'red', maxPlayers: 2, category: 'Support' },
  
  // Corporate & Leadership
  { id: 'ceo', name: 'CEO', emoji: '👔', description: 'Strategic leader and decision maker', perks: ['Executive decisions', 'Resource allocation', 'Team motivation'], color: 'blue', maxPlayers: 1, category: 'Corporate' },
  { id: 'consultant', name: 'Management Consultant', emoji: '💼', description: 'Process optimization expert', perks: ['Efficiency analysis', 'Problem solving', 'Strategic planning'], color: 'purple', maxPlayers: 2, category: 'Corporate' },
  { id: 'negotiator', name: 'Negotiator', emoji: '🤝', description: 'Diplomatic solution finder', perks: ['Conflict resolution', 'Win-win solutions', 'Communication bonus'], color: 'emerald', maxPlayers: 2, category: 'Corporate' },
  
  // Creative & Artistic
  { id: 'artist', name: 'Master Artist', emoji: '🎨', description: 'Creative visionary and pattern recognizer', perks: ['Visual puzzles', 'Creative solutions', 'Pattern recognition'], color: 'pink', maxPlayers: 2, category: 'Creative' },
  { id: 'photographer', name: 'Photographer', emoji: '📸', description: 'Visual storyteller and observer', perks: ['Photo challenges', 'Detail spotting', 'Visual memory'], color: 'purple', maxPlayers: 3, category: 'Creative' },
  { id: 'musician', name: 'Musician', emoji: '🎼', description: 'Sound master and rhythm keeper', perks: ['Audio puzzles', 'Sound patterns', 'Rhythm challenges'], color: 'violet', maxPlayers: 2, category: 'Creative' },
  
  // Survival & Adventure
  { id: 'explorer', name: 'Explorer', emoji: '🧭', description: 'Wilderness survival expert', perks: ['Navigation skills', 'Survival techniques', 'Terrain knowledge'], color: 'yellow', maxPlayers: 2, category: 'Adventure' },
  { id: 'treasure_hunter', name: 'Treasure Hunter', emoji: '🗝️', description: 'Seeker of hidden valuables', perks: ['Hidden object detection', 'Puzzle solving', 'Risk assessment'], color: 'amber', maxPlayers: 2, category: 'Adventure' },
  { id: 'survivor', name: 'Survivor', emoji: '🎯', description: 'Resourceful problem solver', perks: ['Resource management', 'Improvisation', 'Crisis handling'], color: 'orange', maxPlayers: 3, category: 'Adventure' },
  
  // Mystical & Supernatural  
  { id: 'psychic', name: 'Psychic Medium', emoji: '🔮', description: 'Supernatural insight specialist', perks: ['Future glimpses', 'Spirit communication', 'Psychic visions'], color: 'purple', maxPlayers: 1, category: 'Mystical' },
  { id: 'vampire', name: 'Vampire', emoji: '🧛‍♀️', description: 'Night creature with enhanced senses', perks: ['Night vision', 'Enhanced speed', 'Mind influence'], color: 'red', maxPlayers: 1, category: 'Mystical' },
  { id: 'werewolf', name: 'Werewolf', emoji: '🐺', description: 'Shapeshifter with primal instincts', perks: ['Animal senses', 'Tracking abilities', 'Pack coordination'], color: 'gray', maxPlayers: 2, category: 'Mystical' },
  
  // Historical & Classic
  { id: 'pirate', name: 'Pirate Captain', emoji: '🏴‍☠️', description: 'Seafaring treasure hunter', perks: ['Treasure sense', 'Naval knowledge', 'Leadership'], color: 'amber', maxPlayers: 2, category: 'Historical' },
  { id: 'ninja', name: 'Ninja', emoji: '🥷', description: 'Shadow warrior with ancient skills', perks: ['Stealth mastery', 'Ancient wisdom', 'Silent movement'], color: 'slate', maxPlayers: 2, category: 'Historical' },
  { id: 'samurai', name: 'Samurai', emoji: '⚔️', description: 'Honorable warrior with code of ethics', perks: ['Honor bonus', 'Weapon mastery', 'Tactical insight'], color: 'red', maxPlayers: 2, category: 'Historical' },
  
  // Modern Specialists
  { id: 'doctor', name: 'Emergency Doctor', emoji: '👩‍⚕️', description: 'Medical expert and life saver', perks: ['Medical knowledge', 'Emergency care', 'Diagnosis skills'], color: 'red', maxPlayers: 2, category: 'Modern' },
  { id: 'teacher', name: 'Professor', emoji: '👨‍🏫', description: 'Educational guide and mentor', perks: ['Knowledge sharing', 'Learning acceleration', 'Wisdom bonus'], color: 'blue', maxPlayers: 3, category: 'Modern' },
  { id: 'chef', name: 'Master Chef', emoji: '👨‍🍳', description: 'Culinary artist and nutrition expert', perks: ['Food knowledge', 'Recipe creation', 'Taste testing'], color: 'orange', maxPlayers: 2, category: 'Modern' }
]

// Function to get roles filtered by adventure genre
const getRolesForGenre = (genre: string): any[] => {
  const allowedCategories = GENRE_TO_ROLE_CATEGORY_MAP[genre] || []
  return ALL_ROLES.filter(role => allowedCategories.includes(role.category))
}

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
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
              style={{ backgroundColor: role.color }}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-foreground">
                {role.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {participantCount} / {role.suggested_count} players
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
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

function RoleSelectionPageContent() {
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
      // Get adventure genre from URL params or default to fantasy
      const adventureGenre = searchParams.get('genre') || 'fantasy'
      
      // Get roles filtered by genre
      const genreRoles = getRolesForGenre(adventureGenre)
      
      // Convert to the expected format
      const formattedRoles = genreRoles.map((role, index) => ({
        id: role.id,
        adventure_id: '1',
        name: role.name,
        description: role.description,
        color: getColorValue(role.color),
        icon_url: null,
        suggested_count: role.maxPlayers,
        perks: role.perks.map((perk: string, perkIndex: number) => ({
          id: `${role.id}_perk_${perkIndex}`,
          name: perk,
          description: perk,
          perk_type: 'extra_points' as const,
          value: 10,
          conditions: []
        })),
        multipliers: [
          { condition: `${role.category.toLowerCase()} challenges`, multiplier: 1.2, description: `Bonus for ${role.category.toLowerCase()} tasks` }
        ]
      }))

      // Mock adventure data with filtered roles
      const adventureData = {
        id: '1',
        title: `The ${adventureGenre.charAt(0).toUpperCase() + adventureGenre.slice(1)} Adventure`,
        theme: adventureGenre,
        roles: formattedRoles
      }

      setAdventure(adventureData)
      setRoles(formattedRoles)
    } catch (error) {
      console.error('Error loading adventure data:', error)
    }
  }

  // Helper function to convert color names to hex values
  const getColorValue = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      'purple': '#8B5CF6',
      'violet': '#7C3AED',
      'yellow': '#EAB308',
      'gray': '#6B7280',
      'orange': '#F97316',
      'green': '#22C55E',
      'red': '#DC2626',
      'emerald': '#10B981',
      'blue': '#3B82F6',
      'slate': '#64748B',
      'amber': '#F59E0B',
      'cyan': '#06B6D4',
      'zinc': '#71717A',
      'teal': '#14B8A6',
      'lime': '#84CC16',
      'indigo': '#6366F1',
      'sky': '#0EA5E9',
      'pink': '#EC4899'
    }
    return colorMap[colorName] || '#8B5CF6'
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
      console.error('Error loading participants:', error)
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
        
        // Navigate to avatar generation with selected role
        const selectedRole = roles.find(r => r.id === selectedRoleId)
        const roleParam = selectedRole ? `&role=${encodeURIComponent(selectedRole.name)}` : ''
        router.push(`/avatar-generation?session=${sessionCode}${isGuest ? '&guest=true' : ''}${roleParam}`)
      } else {
        const error = await response.json()
        console.error('Error joining session:', error)
      }
    } catch (error) {
      console.error('Error joining session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!adventure || roles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading adventure roles...</p>
        </div>
      </div>
    )
  }

  const theme = ADVENTURE_THEMES[adventure.theme as keyof typeof ADVENTURE_THEMES] || ADVENTURE_THEMES.fantasy

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      style={{
        backgroundImage: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.primary}20 50%, ${theme.colors.background} 100%)`
      }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Choose Your Role
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-300 mb-2"
          >
            {adventure.title}
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400"
          >
            Select a role that matches your playstyle and team needs
          </motion.p>
        </div>

        {/* Team Balance Overview */}
        {participants.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Team Balance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {roles.map(role => {
                const count = teamBalance[role.id] || 0
                const percentage = (count / role.suggested_count) * 100
                return (
                  <div key={role.id} className="text-center">
                    <p className="text-sm text-slate-300 mb-1">{role.name}</p>
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className="h-2 mb-1"
                    />
                    <p className="text-xs text-slate-400">{count}/{role.suggested_count}</p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Roles Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              isSelected={selectedRoleId === role.id}
              onSelect={() => handleRoleSelect(role.id)}
              participantCount={teamBalance[role.id] || 0}
              isRecommended={aiRecommendation === role.id}
              theme={theme}
            />
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-4"
        >
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="px-8 py-3 text-white border-white/30 hover:bg-white/10"
          >
            Back
          </Button>
          <Button
            onClick={handleConfirmRole}
            disabled={!selectedRoleId || isLoading}
            className="px-8 py-3 text-white font-semibold"
            style={{ 
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary
            }}
          >
            {isLoading ? 'Joining...' : 'Confirm Role'}
          </Button>
        </motion.div>

        {/* Help Text */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-slate-400 text-sm">
            <AlertTriangle className="w-4 h-4 inline mr-1" />
            Each role has unique abilities and scoring bonuses. Choose wisely!
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function RoleSelectionPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <RoleSelectionPageContent />
    </React.Suspense>
  )
}