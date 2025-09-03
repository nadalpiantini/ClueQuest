'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Trophy, Medal, Star, Share2, Download, Users, Clock, 
  Target, Zap, Crown, Award, PartyPopper, Sparkles,
  CheckCircle2, Home, RotateCcw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LeaderboardEntry, Achievement, Session, Participant } from '@/types/adventure'
import { formatDuration, formatScore } from '@/lib/utils'
import { useAdventure } from '@/components/adventure/adventure-provider'
import Image from 'next/image'

interface AdventureStats {
  total_time: number
  challenges_completed: number
  scenes_visited: number
  team_collaboration_score: number
  individual_achievements: Achievement[]
  team_achievements: Achievement[]
  final_score: number
  bonus_points: number
}

interface CertificateData {
  participant_name: string
  adventure_title: string
  completion_date: string
  final_score: number
  position: number
  total_participants: number
  special_recognitions: string[]
}

export default function RankingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionCode = searchParams.get('session')
  const isGuest = searchParams.get('guest') === 'true'
  
  const { state: adventureState } = useAdventure()

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [adventureStats, setAdventureStats] = useState<AdventureStats | null>(null)
  const [showCelebration, setShowCelebration] = useState(true)
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null)
  const [showCertificate, setShowCertificate] = useState(false)
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    loadRankingData()
    
    // Hide celebration after animation
    const timer = setTimeout(() => setShowCelebration(false), 5000)
    return () => clearTimeout(timer)
  }, [sessionCode])

  const loadRankingData = async () => {
    try {
      // Mock ranking data - in real app, fetch from API
      const rankingData: LeaderboardEntry[] = [
        {
          participant_id: '1',
          name: 'Alex the Explorer',
          avatar_url: '/images/avatars/avatar1.jpg',
          role_name: 'Scout',
          role_color: '#059669',
          score: 2850,
          completed_challenges: 18,
          position: 1
        },
        {
          participant_id: '2',
          name: 'Maya Spellcaster',
          avatar_url: '/images/avatars/avatar2.jpg',
          role_name: 'Mage',
          role_color: '#0EA5E9',
          score: 2720,
          completed_challenges: 17,
          position: 2
        },
        {
          participant_id: adventureState.participant?.id || '3',
          name: adventureState.participant?.guest_name || 'You',
          avatar_url: adventureState.participant?.avatar_url || '/images/avatars/default.jpg',
          role_name: 'Warrior',
          role_color: '#DC2626',
          score: 2650,
          completed_challenges: 16,
          position: 3
        },
        {
          participant_id: '4',
          name: 'Sam the Healer',
          avatar_url: '/images/avatars/avatar4.jpg',
          role_name: 'Healer',
          role_color: '#10B981',
          score: 2480,
          completed_challenges: 15,
          position: 4
        },
        {
          participant_id: '5',
          name: 'Jordan Guardian',
          avatar_url: '/images/avatars/avatar5.jpg',
          role_name: 'Guardian',
          role_color: '#8B5CF6',
          score: 2350,
          completed_challenges: 14,
          position: 5
        }
      ]

      setLeaderboard(rankingData)

      // Mock adventure stats
      const stats: AdventureStats = {
        total_time: 145, // minutes
        challenges_completed: 16,
        scenes_visited: 8,
        team_collaboration_score: 92,
        individual_achievements: [
          { id: '1', name: 'First Explorer', description: 'First to complete a scene', badge_url: '/badges/first.svg', points_bonus: 50, unlocked_at: new Date().toISOString(), category: 'exploration' },
          { id: '2', name: 'Puzzle Master', description: 'Solved 5 puzzles perfectly', badge_url: '/badges/puzzle.svg', points_bonus: 100, unlocked_at: new Date().toISOString(), category: 'creativity' },
          { id: '3', name: 'Team Player', description: 'Helped teammates 10 times', badge_url: '/badges/team.svg', points_bonus: 75, unlocked_at: new Date().toISOString(), category: 'collaboration' }
        ],
        team_achievements: [
          { id: '4', name: 'Dream Team', description: 'Perfect team collaboration', badge_url: '/badges/dream-team.svg', points_bonus: 200, unlocked_at: new Date().toISOString(), category: 'collaboration' }
        ],
        final_score: 2650,
        bonus_points: 325
      }

      setAdventureStats(stats)

      // Generate certificate data
      const userPosition = rankingData.find(p => p.participant_id === adventureState.participant?.id)?.position || 3
      const certificate: CertificateData = {
        participant_name: adventureState.participant?.guest_name || 'Adventurer',
        adventure_title: 'The Enchanted Forest Quest',
        completion_date: new Date().toLocaleDateString(),
        final_score: stats.final_score,
        position: userPosition,
        total_participants: rankingData.length,
        special_recognitions: []
      }

      // Add special recognitions based on performance
      if (userPosition === 1) {
        certificate.special_recognitions.push('🏆 Champion Adventurer')
      }
      if (userPosition <= 3) {
        certificate.special_recognitions.push('🥉 Podium Finisher')
      }
      if (stats.team_collaboration_score >= 90) {
        certificate.special_recognitions.push('🤝 Exceptional Team Player')
      }
      if (stats.challenges_completed >= 15) {
        certificate.special_recognitions.push('🎯 Challenge Master')
      }
      if (stats.individual_achievements.length >= 3) {
        certificate.special_recognitions.push('⭐ Achievement Hunter')
      }

      // Always add at least one recognition
      if (certificate.special_recognitions.length === 0) {
        certificate.special_recognitions.push('🌟 Dedicated Adventurer')
      }

      setCertificateData(certificate)

    } catch (error) {
      console.error('Failed to load ranking data:', error)
    }
  }

  const getPodiumIcon = (position: number) => {
    const icons = {
      1: <Crown className="w-6 h-6 text-yellow-500" />,
      2: <Medal className="w-6 h-6 text-gray-400" />,
      3: <Award className="w-6 h-6 text-amber-600" />
    }
    return icons[position as keyof typeof icons] || <Trophy className="w-6 h-6 text-muted-foreground" />
  }

  const getPositionGradient = (position: number) => {
    const gradients = {
      1: 'from-yellow-400 to-yellow-600',
      2: 'from-gray-300 to-gray-500',
      3: 'from-amber-400 to-amber-600'
    }
    return gradients[position as keyof typeof gradients] || 'from-slate-300 to-slate-500'
  }

  const handleShareResults = async () => {
    if (navigator.share && certificateData) {
      try {
        await navigator.share({
          title: `ClueQuest Adventure Complete!`,
          text: `I just completed "${certificateData.adventure_title}" and finished #${certificateData.position} out of ${certificateData.total_participants} players! 🏆`,
          url: window.location.href
        })
      } catch (error) {
        // Fallback to copying to clipboard
        copyResultsToClipboard()
      }
    } else {
      copyResultsToClipboard()
    }
  }

  const copyResultsToClipboard = () => {
    if (!certificateData) return
    
    const text = `🏆 ClueQuest Adventure Complete!\n\nI just finished "${certificateData.adventure_title}" and placed #${certificateData.position} out of ${certificateData.total_participants} adventurers!\n\nFinal Score: ${formatScore(certificateData.final_score)} points\n\nJoin me on ClueQuest for your own epic adventure!`
    
    navigator.clipboard.writeText(text)
  }

  const generateCertificate = async () => {
    if (!certificateData) return
    
    setIsGeneratingCertificate(true)
    
    try {
      // In a real app, this would generate a PDF certificate
      const response = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...certificateData,
          sessionCode,
          participantId: adventureState.participant?.id
        })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `ClueQuest-Certificate-${certificateData.participant_name.replace(/\s+/g, '-')}.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to generate certificate:', error)
    } finally {
      setIsGeneratingCertificate(false)
    }
  }

  const handlePlayAgain = () => {
    router.push(`/welcome?session=${sessionCode}`)
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600 relative overflow-hidden">
      
      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {/* Confetti Effect */}
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  rotate: 0,
                  scale: Math.random() * 0.5 + 0.5
                }}
                animate={{
                  y: window.innerHeight + 20,
                  rotate: 360,
                  transition: {
                    duration: Math.random() * 3 + 2,
                    ease: "easeOut"
                  }
                }}
                style={{
                  backgroundColor: ['#fbbf24', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][i % 5]
                }}
              />
            ))}
            
            {/* Success Message */}
            <div className="absolute inset-0 center-flex">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 20,
                  delay: 0.5 
                }}
                className="text-center text-white"
              >
                <PartyPopper className="w-16 h-16 mx-auto mb-4" />
                <h1 className="text-4xl font-bold mb-2">Adventure Complete!</h1>
                <p className="text-xl opacity-90">Congratulations, brave adventurer!</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 pt-safe px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-400" />
              <h1 className="text-3xl font-bold mb-2">Final Rankings</h1>
              <p className="text-lg opacity-90">The Enchanted Forest Quest</p>
            </motion.div>
          </div>

          {/* Podium */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 items-end justify-items-center">
                  
                  {/* 2nd Place */}
                  {leaderboard[1] && (
                    <div className="text-center">
                      <div className={`w-16 h-12 bg-gradient-to-t ${getPositionGradient(2)} rounded-t-lg mb-2`} />
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 mb-2 mx-auto">
                        <Image
                          src={leaderboard[1].avatar_url || '/images/avatars/default.jpg'}
                          alt={leaderboard[1].name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div className="text-white text-sm font-medium">{leaderboard[1].name}</div>
                      <div className="text-white/80 text-xs">{formatScore(leaderboard[1].score)} pts</div>
                    </div>
                  )}

                  {/* 1st Place */}
                  {leaderboard[0] && (
                    <div className="text-center">
                      <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-1" />
                      <div className={`w-20 h-16 bg-gradient-to-t ${getPositionGradient(1)} rounded-t-lg mb-2`} />
                      <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-yellow-400 mb-2 mx-auto">
                        <Image
                          src={leaderboard[0].avatar_url || '/images/avatars/default.jpg'}
                          alt={leaderboard[0].name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="text-white text-lg font-bold">{leaderboard[0].name}</div>
                      <div className="text-yellow-400 font-medium">{formatScore(leaderboard[0].score)} pts</div>
                      <Badge className="bg-yellow-400 text-yellow-900 text-xs mt-1">
                        <Crown className="w-3 h-3 mr-1" />
                        Champion
                      </Badge>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {leaderboard[2] && (
                    <div className="text-center">
                      <div className={`w-16 h-10 bg-gradient-to-t ${getPositionGradient(3)} rounded-t-lg mb-2`} />
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 mb-2 mx-auto">
                        <Image
                          src={leaderboard[2].avatar_url || '/images/avatars/default.jpg'}
                          alt={leaderboard[2].name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div className="text-white text-sm font-medium">{leaderboard[2].name}</div>
                      <div className="text-white/80 text-xs">{formatScore(leaderboard[2].score)} pts</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Full Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Full Rankings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.participant_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6 + index * 0.1 }}
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      entry.participant_id === adventureState.participant?.id
                        ? 'bg-white/20 ring-2 ring-white/30'
                        : 'bg-white/5'
                    }`}
                  >
                    <div className="flex-shrink-0 text-center min-w-[2rem]">
                      {getPodiumIcon(entry.position)}
                      <div className="text-white/80 text-xs font-medium">#{entry.position}</div>
                    </div>
                    
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30">
                      <Image
                        src={entry.avatar_url || '/images/avatars/default.jpg'}
                        alt={entry.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-white font-medium">{entry.name}</div>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge 
                          variant="outline" 
                          className="text-xs border-white/30 text-white/80"
                          style={{ backgroundColor: `${entry.role_color}20` }}
                        >
                          {entry.role_name}
                        </Badge>
                        <span className="text-white/60">{entry.completed_challenges} challenges</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-white font-bold">{formatScore(entry.score)}</div>
                      <div className="text-white/60 text-xs">points</div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Personal Stats */}
          {adventureStats && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Your Adventure Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{formatDuration(adventureStats.total_time)}</div>
                      <div className="text-white/60 text-xs">Total Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{adventureStats.challenges_completed}</div>
                      <div className="text-white/60 text-xs">Challenges</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{adventureStats.scenes_visited}</div>
                      <div className="text-white/60 text-xs">Scenes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{adventureStats.team_collaboration_score}%</div>
                      <div className="text-white/60 text-xs">Teamwork</div>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="space-y-4">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Your Achievements
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {adventureStats.individual_achievements.map((achievement) => (
                        <div 
                          key={achievement.id}
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                        >
                          <Star className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-white font-medium text-sm">{achievement.name}</div>
                            <div className="text-white/60 text-xs">{achievement.description}</div>
                          </div>
                          <div className="text-yellow-400 text-xs font-medium">
                            +{achievement.points_bonus}pts
                          </div>
                        </div>
                      ))}
                    </div>

                    {adventureStats.team_achievements.length > 0 && (
                      <div className="pt-4 border-t border-white/20">
                        <h4 className="text-white/80 font-medium text-sm mb-3">Team Achievements</h4>
                        {adventureStats.team_achievements.map((achievement) => (
                          <div 
                            key={achievement.id}
                            className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20"
                          >
                            <Users className="w-8 h-8 text-green-400 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="text-white font-medium text-sm">{achievement.name}</div>
                              <div className="text-white/60 text-xs">{achievement.description}</div>
                            </div>
                            <div className="text-green-400 text-xs font-medium">
                              +{achievement.points_bonus}pts
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Certificate Preview */}
          {certificateData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full center-flex mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-yellow-900" />
                  </div>
                  
                  <div className="text-white space-y-2">
                    <h3 className="text-xl font-bold">Congratulations!</h3>
                    <p className="text-white/80">
                      You completed <strong>{certificateData.adventure_title}</strong>
                    </p>
                    <p className="text-lg">
                      Final Position: <strong className="text-yellow-400">#{certificateData.position}</strong> out of {certificateData.total_participants} adventurers
                    </p>
                  </div>

                  {certificateData.special_recognitions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-white font-medium">Special Recognition</h4>
                      <div className="flex flex-wrap justify-center gap-2">
                        {certificateData.special_recognitions.map((recognition, index) => (
                          <Badge key={index} className="bg-yellow-100 text-yellow-800">
                            {recognition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              onClick={handleShareResults}
              className="flex-1 bg-white/20 hover:bg-white/30 border border-white/30 text-white touch-target"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Results
            </Button>

            <Button
              onClick={generateCertificate}
              disabled={isGeneratingCertificate}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-yellow-900 touch-target"
            >
              {isGeneratingCertificate ? (
                <div className="w-4 h-4 border-2 border-yellow-900/30 border-t-yellow-900 rounded-full animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Get Certificate
            </Button>

            <Button
              onClick={handlePlayAgain}
              variant="outline"
              className="flex-1 border-white/30 text-white hover:bg-white/10 touch-target"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>

            <Button
              onClick={handleGoHome}
              variant="outline"
              className="flex-1 border-white/30 text-white hover:bg-white/10 touch-target"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6 }}
            className="text-center text-white/60 text-sm pb-safe"
          >
            <p className="mb-2">Thank you for playing ClueQuest!</p>
            <p>Share your adventure with friends and create new memories together.</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}