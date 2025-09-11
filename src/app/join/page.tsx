'use client'

import { 
  ArrowLeft, 
  Search, 
  Users,
  ArrowRight,
  Eye,
  Smartphone,
  Trophy,
  Star,
  Zap,
  MessageCircle,
  HelpCircle,
  Package,
  Target,
  Clock,
  Shield,
  Lightbulb,
  Heart,
  Compass,
  Map,
  Camera,
  Volume2,
  Settings,
  LogOut,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Crown,
  Sparkles,
  Gem
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

// Types for Game State (Guest View Only)
interface GuestGameState {
  sessionId: string
  sessionCode: string
  adventureTitle: string
  adventureTheme: string
  playerName: string
  playerId: string
  
  // Personal Player State - What only I can see
  personalState: {
    health: number
    maxHealth: number
    energy: number
    maxEnergy: number
    score: number
    level: number
    inventory: InventoryItem[]
    achievements: Achievement[]
    hintTokens: number
    specialAbilities: string[]
  }
  
  // Current Challenge - Only what's happening now
  currentChallenge: {
    id: string
    title: string
    description: string
    type: 'puzzle' | 'photo' | 'riddle' | 'collaboration' | 'exploration'
    timeLimit?: number
    timeRemaining?: number
    difficulty: 'easy' | 'medium' | 'hard'
    points: number
    hintsAvailable: number
    requiresTeamwork: boolean
    status: 'active' | 'completed' | 'failed'
  } | null
  
  // Team Info - Only if I'm in a team
  team?: {
    id: string
    name: string
    color: string
    members: TeamMember[]
    teamScore: number
    teamLevel: number
    sharedInventory: InventoryItem[]
    teamAchievements: Achievement[]
  }
  
  // Public Leaderboard - Limited view
  leaderboard: {
    myPosition: number
    totalPlayers: number
    nearbyPlayers: LeaderboardEntry[] // Only players close to my position
    topPlayers: LeaderboardEntry[] // Only top 3
    myTeamPosition?: number
    totalTeams?: number
  }
  
  // Game Session Info
  sessionInfo: {
    status: 'waiting' | 'active' | 'paused' | 'completed'
    phase: string // e.g., "Scene 1: The Investigation Begins"
    estimatedTimeRemaining: number
    totalChallengesCompleted: number
    // Deliberately NOT showing total challenges (preserve mystery)
  }
  
  // Communication
  messages: ChatMessage[]
  notifications: GameNotification[]
}

interface InventoryItem {
  id: string
  name: string
  description: string
  icon: string
  quantity: number
  rarity: 'common' | 'rare' | 'legendary'
  type: 'tool' | 'clue' | 'key' | 'bonus'
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'legendary'
  points: number
  unlockedAt: string
}

interface TeamMember {
  id: string
  name: string
  avatar?: string
  status: 'online' | 'offline' | 'away'
  role?: string
  currentActivity?: string
}

interface LeaderboardEntry {
  position: number
  name: string
  avatar?: string
  score: number
  level: number
  teamName?: string
  isMe?: boolean
  isTeammate?: boolean
}

interface ChatMessage {
  id: string
  from: string
  message: string
  timestamp: string
  type: 'team' | 'system' | 'hint'
}

interface GameNotification {
  id: string
  type: 'achievement' | 'hint' | 'warning' | 'system'
  title: string
  message: string
  timestamp: string
  read: boolean
}

export default function JoinPage() {
  // Join form states
  const [sessionCode, setSessionCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  
  // Game states
  const [gameMode, setGameMode] = useState<'join' | 'game'>('join')
  const [gameState, setGameState] = useState<GuestGameState | null>(null)
  const [selectedTab, setSelectedTab] = useState<'challenge' | 'inventory' | 'team' | 'leaderboard'>('challenge')
  
  // Game panel states
  const [showHints, setShowHints] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [challengeAnswer, setChallengeAnswer] = useState('')
  const [chatMessage, setChatMessage] = useState('')

  // Handle dev mode auto-fill from URL params
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const urlParams = new URLSearchParams(window.location.search)
    const devMode = urlParams.get('dev')
    const autoCode = urlParams.get('code')
    const autoName = urlParams.get('name')
    
    if (devMode === 'guest' || devMode === 'auto') {
      // Auto-fill for dev mode
      const code = autoCode || 'DEMO01'
      const name = autoName || 'DevGuest'
      
      setSessionCode(code)
      setPlayerName(name)
      
      // Auto-join in dev mode
      if (devMode === 'guest') {
        setTimeout(() => {
          const mockState = createMockGameState(code, name)
          setGameState(mockState)
          setGameMode('game')
        }, 100)
      }
    }
  }, [])

  // Mock data for demonstration
  const createMockGameState = (code: string, name: string): GuestGameState => ({
    sessionId: 'session_123',
    sessionCode: code,
    adventureTitle: 'The Vanished Scientist Mystery',
    adventureTheme: 'mystery',
    playerName: name,
    playerId: 'player_456',
    
    personalState: {
      health: 85,
      maxHealth: 100,
      energy: 60,
      maxEnergy: 100,
      score: 2450,
      level: 3,
      inventory: [
        { id: '1', name: 'Magnifying Glass', description: 'Reveals hidden clues', icon: '🔍', quantity: 1, rarity: 'common', type: 'tool' },
        { id: '2', name: 'Mysterious Key', description: 'Opens locked doors', icon: '🗝️', quantity: 1, rarity: 'rare', type: 'key' },
        { id: '3', name: 'Lab Notes', description: 'Dr. Chen\'s research notes', icon: '📋', quantity: 1, rarity: 'legendary', type: 'clue' },
        { id: '4', name: 'Energy Drink', description: 'Restores 25 energy points', icon: '⚡', quantity: 3, rarity: 'common', type: 'bonus' },
      ],
      achievements: [
        { id: '1', title: 'First Clue', description: 'Found your first piece of evidence', icon: '🎯', rarity: 'common', points: 100, unlockedAt: '2 min ago' },
        { id: '2', title: 'Team Player', description: 'Successfully collaborated with teammates', icon: '🤝', rarity: 'rare', points: 250, unlockedAt: '5 min ago' },
      ],
      hintTokens: 2,
      specialAbilities: ['Enhanced Observation', 'Quick Thinking']
    },
    
    currentChallenge: {
      id: 'challenge_789',
      title: 'The Locked Laboratory',
      description: 'Dr. Chen\'s laboratory is secured with a complex cipher lock. Use the clues you\'ve gathered to determine the correct sequence.',
      type: 'puzzle',
      timeLimit: 600, // 10 minutes
      timeRemaining: 420, // 7 minutes left
      difficulty: 'medium',
      points: 500,
      hintsAvailable: 1,
      requiresTeamwork: false,
      status: 'active'
    },
    
    team: {
      id: 'team_red',
      name: 'The Detectives',
      color: '#ef4444',
      members: [
        { id: 'player_456', name: name, status: 'online', currentActivity: 'Solving puzzle' },
        { id: 'player_789', name: 'Sarah', status: 'online', role: 'Navigator', currentActivity: 'Searching for clues' },
        { id: 'player_101', name: 'Marcus', status: 'away', role: 'Analyst', currentActivity: 'Away' },
      ],
      teamScore: 7200,
      teamLevel: 4,
      sharedInventory: [
        { id: 'shared_1', name: 'Team Radio', description: 'Communicate across distances', icon: '📻', quantity: 1, rarity: 'rare', type: 'tool' },
        { id: 'shared_2', name: 'Evidence Board', description: 'Organize discovered clues', icon: '📋', quantity: 1, rarity: 'legendary', type: 'tool' },
      ],
      teamAchievements: [
        { id: 'team_1', title: 'Perfect Collaboration', description: 'All team members contributed to solution', icon: '👥', rarity: 'legendary', points: 1000, unlockedAt: '10 min ago' }
      ]
    },
    
    leaderboard: {
      myPosition: 7,
      totalPlayers: 24,
      nearbyPlayers: [
        { position: 5, name: 'Alex K.', score: 2680, level: 3, teamName: 'Code Breakers' },
        { position: 6, name: 'Emma R.', score: 2520, level: 3, teamName: 'Mystery Inc.' },
        { position: 7, name: name, score: 2450, level: 3, teamName: 'The Detectives', isMe: true },
        { position: 8, name: 'Sarah', score: 2380, level: 3, teamName: 'The Detectives', isTeammate: true },
        { position: 9, name: 'Jordan P.', score: 2200, level: 2, teamName: 'Night Owls' },
      ],
      topPlayers: [
        { position: 1, name: 'Lightning⚡', score: 4200, level: 5, teamName: 'Speed Demons' },
        { position: 2, name: 'MasterMind', score: 3850, level: 4, teamName: 'Brain Trust' },
        { position: 3, name: 'Sherlock_2024', score: 3600, level: 4, teamName: 'Logic Lords' },
      ],
      myTeamPosition: 3,
      totalTeams: 8
    },
    
    sessionInfo: {
      status: 'active',
      phase: 'Scene 2: The Investigation Deepens',
      estimatedTimeRemaining: 45, // minutes
      totalChallengesCompleted: 6
      // Deliberately not showing total challenges
    },
    
    messages: [
      { id: '1', from: 'Sarah', message: 'I found something in the chemistry lab!', timestamp: '2 min ago', type: 'team' },
      { id: '2', from: 'System', message: 'New challenge unlocked: The Locked Laboratory', timestamp: '3 min ago', type: 'system' },
      { id: '3', from: 'Marcus', message: 'The pattern in those equations might be important', timestamp: '5 min ago', type: 'team' },
    ],
    
    notifications: [
      { id: '1', type: 'achievement', title: 'New Achievement!', message: 'You unlocked "Team Player"', timestamp: '5 min ago', read: false },
      { id: '2', type: 'hint', title: 'Hint Available', message: 'A hint is available for the current challenge', timestamp: '7 min ago', read: true },
    ]
  })

  const handleJoinAdventure = async () => {
    if (!sessionCode || !playerName) return
    
    setIsJoining(true)
    
    // Simulate API call delay (faster in dev mode)
    const delay = process.env.NODE_ENV === 'development' ? 500 : 2000
    await new Promise(resolve => setTimeout(resolve, delay))
    
    // Create mock game state and transition to game mode
    const mockState = createMockGameState(sessionCode, playerName)
    setGameState(mockState)
    setGameMode('game')
    setIsJoining(false)
  }

  const handleLeaveGame = () => {
    setGameMode('join')
    setGameState(null)
    setSessionCode('')
    setPlayerName('')
  }

  const handleChallengeSubmit = () => {
    if (!challengeAnswer.trim()) return
    
    // Simulate challenge submission
    alert(`🎯 Answer submitted: "${challengeAnswer}"\n\nIn production, this would be validated by the game engine.`)
    setChallengeAnswer('')
  }

  const handleUseHint = () => {
    if (!gameState?.currentChallenge || gameState.currentChallenge.hintsAvailable === 0) return
    
    alert(`💡 Hint: Look for patterns in the chemical formulas. The periodic table might hold the key!\n\nHints remaining: ${gameState.currentChallenge.hintsAvailable - 1}`)
  }

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return
    
    // Simulate sending message
    alert(`📨 Message sent to team: "${chatMessage}"`)
    setChatMessage('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(168,85,247,0.2),transparent_60%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
      </div>

      <AnimatePresence mode="wait">
        {gameMode === 'join' ? (
          /* ========================================
             JOIN MODE - Entry Form  
          ======================================== */
          <motion.div 
            key="join-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative z-20"
          >
            {/* Navigation */}
            <nav className="p-6">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors font-semibold"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Home
              </Link>
            </nav>
            
            <main className="px-4 py-16 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl">
                
                {/* Header */}
                <motion.div 
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-500/20 to-purple-500/20 px-6 py-3 text-lg font-semibold text-emerald-300 ring-2 ring-emerald-500/30 backdrop-blur-xl border border-emerald-500/20 shadow-xl">
                    <Users className="h-5 w-5" />
                    Join Adventure
                    <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping"></div>
                  </div>
                  
                  <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-emerald-400 via-amber-300 to-purple-400 bg-clip-text text-transparent">
                    Enter the Mystery
                  </h1>
                  
                  <p className="text-xl text-slate-300 leading-relaxed">
                    Join an existing adventure with your session code
                  </p>
                </motion.div>

                {/* Join Form */}
                <motion.div 
                  className="card p-8 mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <div className="space-y-6">
                    
                    {/* Session Code Input */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">
                        Adventure Code
                      </label>
                      <input
                        type="text"
                        placeholder="Enter 6-digit code (e.g., MYSTIC)"
                        value={sessionCode}
                        onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                        className="w-full px-6 py-4 text-xl font-mono bg-slate-900/80 border-2 border-slate-600 rounded-xl text-amber-100 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/20 transition-all duration-300"
                        maxLength={6}
                        disabled={isJoining}
                      />
                      <p className="mt-2 text-xs text-slate-500">
                        Get the code from your adventure host
                      </p>
                    </div>

                    {/* Player Name Input */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your display name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="w-full px-6 py-4 text-lg bg-slate-900/80 border-2 border-slate-600 rounded-xl text-purple-100 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-300"
                        maxLength={30}
                        disabled={isJoining}
                      />
                      <p className="mt-2 text-xs text-slate-500">
                        This will be visible to other players
                      </p>
                    </div>

                    {/* Join Button */}
                    <motion.button
                      onClick={handleJoinAdventure}
                      disabled={!sessionCode || !playerName || isJoining}
                      className={`w-full btn-primary text-xl font-black py-5 shadow-2xl transition-all duration-300 ${
                        sessionCode && playerName && !isJoining
                          ? 'hover:shadow-emerald-500/40 hover:scale-105' 
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      whileHover={sessionCode && playerName && !isJoining ? { scale: 1.02 } : {}}
                      whileTap={sessionCode && playerName && !isJoining ? { scale: 0.98 } : {}}
                    >
                      {isJoining ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          Joining Adventure...
                          <div className="w-6 h-6"></div>
                        </>
                      ) : (
                        <>
                          <Users className="h-6 w-6" />
                          Join Adventure
                          <ArrowRight className="h-6 w-6" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Quick Access */}
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <p className="text-slate-400 mb-6">
                    Don't have a code? Create your own adventure
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                    <Link 
                      href="/dashboard"
                      className="btn-primary text-lg font-bold px-8 py-4 shadow-xl hover:shadow-amber-500/40"
                    >
                      <Search className="h-5 w-5" />
                      Create Adventure
                    </Link>
                    
                    <Link 
                      href="/demo"
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-600/50 hover:border-slate-500 font-semibold transition-all duration-200 hover:scale-105"
                    >
                      <Eye className="h-5 w-5" />
                      Watch Demo
                    </Link>
                    
                    {/* Dev Quick Access */}
                    {process.env.NODE_ENV === 'development' && (
                      <button
                        onClick={() => {
                          const code = 'QUICK'
                          const name = 'DevTest'
                          setSessionCode(code)
                          setPlayerName(name)
                          setTimeout(() => {
                            const mockState = createMockGameState(code, name)
                            setGameState(mockState)
                            setGameMode('game')
                          }, 100)
                        }}
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border border-purple-500/30 hover:border-purple-400/50 font-semibold transition-all duration-200 hover:scale-105"
                      >
                        <Zap className="h-5 w-5" />
                        🚀 Quick Game Panel
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            </main>
          </motion.div>
        ) : (
          /* ========================================
             GAME MODE - Player Panel
          ======================================== */
          <motion.div 
            key="game-mode"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative z-20 h-full"
          >
            {/* Game Header */}
            <div className="bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50">
              <div className="px-4 py-4">
                <div className="flex items-center justify-between">
                  {/* Player Info */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                        {gameState?.playerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{gameState?.playerName}</div>
                        <div className="text-xs text-slate-400">Level {gameState?.personalState.level} • Rank #{gameState?.leaderboard.myPosition}</div>
                      </div>
                    </div>
                    
                    {/* Health & Energy Bars */}
                    <div className="flex items-center gap-4 ml-6">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-400" />
                        <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
                            style={{ width: `${(gameState?.personalState.health || 0) / (gameState?.personalState.maxHealth || 100) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-red-400 font-mono">{gameState?.personalState.health}/{gameState?.personalState.maxHealth}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-400" />
                        <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                            style={{ width: `${(gameState?.personalState.energy || 0) / (gameState?.personalState.maxEnergy || 100) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-blue-400 font-mono">{gameState?.personalState.energy}/{gameState?.personalState.maxEnergy}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Session Info */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-amber-300 font-bold text-lg">{gameState?.personalState.score.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">Points</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-emerald-300 font-bold">{gameState?.sessionInfo.phase}</div>
                      <div className="text-xs text-slate-400">{gameState?.sessionInfo.estimatedTimeRemaining} min left</div>
                    </div>
                    
                    {/* Notifications */}
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                      {gameState?.notifications?.filter(n => !n.read).length > 0 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                      )}
                    </button>
                    
                    {/* Leave Game */}
                    <button
                      onClick={handleLeaveGame}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-slate-800/50 border-b border-slate-700/50">
              <div className="px-4">
                <div className="flex space-x-1">
                  {[
                    { key: 'challenge', label: 'Current Challenge', icon: Target },
                    { key: 'inventory', label: 'Inventory', icon: Package },
                    { key: 'team', label: 'Team', icon: Users },
                    { key: 'leaderboard', label: 'Leaderboard', icon: Trophy }
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTab(key as any)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200 border-b-2 ${
                        selectedTab === key
                          ? 'text-amber-300 border-amber-400'
                          : 'text-slate-400 border-transparent hover:text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Game Panel Content */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {selectedTab === 'challenge' && (
                  /* ==========================================
                     CHALLENGE TAB - Current puzzle/task
                  ========================================== */
                  <motion.div
                    key="challenge"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 h-full overflow-y-auto"
                  >
                    {gameState?.currentChallenge ? (
                      <div className="max-w-4xl mx-auto space-y-6">
                        {/* Challenge Header */}
                        <div className="card p-6 border-amber-500/20">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h2 className="text-2xl font-black text-amber-200 mb-2">
                                {gameState.currentChallenge.title}
                              </h2>
                              <div className="flex items-center gap-4 mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  gameState.currentChallenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                                  gameState.currentChallenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                  'bg-red-500/20 text-red-300'
                                }`}>
                                  {gameState.currentChallenge.difficulty.toUpperCase()}
                                </span>
                                <span className="text-amber-300 font-bold">+{gameState.currentChallenge.points} points</span>
                                {gameState.currentChallenge.requiresTeamwork && (
                                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold">
                                    TEAM CHALLENGE
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {gameState.currentChallenge.timeRemaining && (
                              <div className="text-center">
                                <div className="text-3xl font-black text-red-300 font-mono">
                                  {Math.floor(gameState.currentChallenge.timeRemaining / 60)}:{(gameState.currentChallenge.timeRemaining % 60).toString().padStart(2, '0')}
                                </div>
                                <div className="text-xs text-slate-400">Time Remaining</div>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-slate-300 leading-relaxed text-lg">
                            {gameState.currentChallenge.description}
                          </p>
                        </div>

                        {/* Challenge Input */}
                        <div className="card p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <Target className="w-6 h-6 text-purple-400" />
                            <h3 className="text-xl font-bold text-purple-200">Your Answer</h3>
                          </div>
                          
                          <div className="flex gap-4">
                            <input
                              type="text"
                              placeholder="Enter your solution..."
                              value={challengeAnswer}
                              onChange={(e) => setChallengeAnswer(e.target.value)}
                              className="flex-1 px-4 py-3 bg-slate-800/60 border-2 border-slate-600 rounded-xl text-slate-200 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none transition-all"
                            />
                            <button
                              onClick={handleChallengeSubmit}
                              disabled={!challengeAnswer.trim()}
                              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                                challengeAnswer.trim()
                                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:scale-105 shadow-lg'
                                  : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              Submit
                            </button>
                          </div>
                        </div>

                        {/* Hints & Help */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="card p-4">
                            <button
                              onClick={handleUseHint}
                              disabled={gameState.currentChallenge.hintsAvailable === 0}
                              className={`w-full flex items-center gap-3 p-4 rounded-lg transition-all ${
                                gameState.currentChallenge.hintsAvailable > 0
                                  ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30'
                                  : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              <Lightbulb className="w-5 h-5" />
                              <div className="text-left">
                                <div className="font-semibold">Use Hint</div>
                                <div className="text-xs">
                                  {gameState.currentChallenge.hintsAvailable} remaining • Costs {gameState.personalState.hintTokens} tokens
                                </div>
                              </div>
                            </button>
                          </div>
                          
                          <div className="card p-4">
                            <div className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-lg">
                              <MessageCircle className="w-5 h-5 text-blue-400" />
                              <div>
                                <div className="font-semibold text-blue-300">Team Chat</div>
                                <div className="text-xs text-slate-400">Coordinate with teammates</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-green-300 mb-2">No Active Challenge</h3>
                          <p className="text-slate-400">Waiting for the next mystery to unfold...</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {selectedTab === 'inventory' && (
                  /* ==========================================
                     INVENTORY TAB - Personal items
                  ========================================== */
                  <motion.div
                    key="inventory"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 h-full overflow-y-auto"
                  >
                    <div className="max-w-4xl mx-auto space-y-6">
                      {/* Personal Inventory */}
                      <div className="card p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <Package className="w-6 w-6 text-purple-400" />
                          <h2 className="text-2xl font-black text-purple-200">My Inventory</h2>
                          <div className="ml-auto px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold">
                            {gameState?.personalState.inventory.length} items
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {gameState?.personalState.inventory.map((item) => (
                            <div key={item.id} className={`p-4 rounded-xl border-2 transition-all hover:scale-105 cursor-pointer ${
                              item.rarity === 'legendary' ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30' :
                              item.rarity === 'rare' ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30' :
                              'bg-slate-800/30 border-slate-600/30'
                            }`}>
                              <div className="text-3xl mb-2">{item.icon}</div>
                              <div className="text-sm font-bold text-slate-200 mb-1">{item.name}</div>
                              <div className="text-xs text-slate-400 mb-2">{item.description}</div>
                              {item.quantity > 1 && (
                                <div className="text-xs font-bold text-amber-400">×{item.quantity}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Team Shared Inventory */}
                      {gameState?.team && (
                        <div className="card p-6">
                          <div className="flex items-center gap-3 mb-6">
                            <Users className="w-6 w-6 text-red-400" />
                            <h2 className="text-2xl font-black text-red-200">Team Inventory</h2>
                            <div className="ml-auto px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm font-semibold">
                              Shared with {gameState.team.name}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {gameState.team.sharedInventory.map((item) => (
                              <div key={item.id} className={`p-4 rounded-xl border-2 transition-all hover:scale-105 cursor-pointer ${
                                item.rarity === 'legendary' ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30' :
                                item.rarity === 'rare' ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30' :
                                'bg-slate-800/30 border-slate-600/30'
                              }`}>
                                <div className="text-3xl mb-2">{item.icon}</div>
                                <div className="text-sm font-bold text-slate-200 mb-1">{item.name}</div>
                                <div className="text-xs text-slate-400 mb-2">{item.description}</div>
                                {item.quantity > 1 && (
                                  <div className="text-xs font-bold text-amber-400">×{item.quantity}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Achievements */}
                      <div className="card p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <Star className="w-6 w-6 text-amber-400" />
                          <h2 className="text-2xl font-black text-amber-200">Recent Achievements</h2>
                        </div>
                        
                        <div className="space-y-3">
                          {gameState?.personalState.achievements.map((achievement) => (
                            <div key={achievement.id} className={`p-4 rounded-xl border-l-4 ${
                              achievement.rarity === 'legendary' ? 'bg-yellow-500/10 border-l-yellow-400' :
                              achievement.rarity === 'rare' ? 'bg-purple-500/10 border-l-purple-400' :
                              'bg-slate-800/30 border-l-slate-400'
                            }`}>
                              <div className="flex items-center gap-4">
                                <div className="text-2xl">{achievement.icon}</div>
                                <div className="flex-1">
                                  <div className="font-bold text-slate-200">{achievement.title}</div>
                                  <div className="text-sm text-slate-400">{achievement.description}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-amber-300 font-bold">+{achievement.points}</div>
                                  <div className="text-xs text-slate-500">{achievement.unlockedAt}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedTab === 'team' && (
                  /* ==========================================
                     TEAM TAB - Collaborate with teammates
                  ========================================== */
                  <motion.div
                    key="team"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 h-full overflow-y-auto"
                  >
                    <div className="max-w-4xl mx-auto space-y-6">
                      {gameState?.team ? (
                        <>
                          {/* Team Header */}
                          <div className="card p-6 border-red-500/20">
                            <div className="flex items-center gap-4 mb-4">
                              <div 
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                style={{ backgroundColor: gameState.team.color }}
                              >
                                {gameState.team.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h2 className="text-2xl font-black text-red-200">{gameState.team.name}</h2>
                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                  <span>Team Level {gameState.team.teamLevel}</span>
                                  <span>•</span>
                                  <span>Rank #{gameState.leaderboard.myTeamPosition} of {gameState.leaderboard.totalTeams}</span>
                                  <span>•</span>
                                  <span className="text-amber-400 font-bold">{gameState.team.teamScore.toLocaleString()} points</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Team Members */}
                          <div className="card p-6">
                            <h3 className="text-xl font-bold text-slate-200 mb-4">Team Members</h3>
                            <div className="space-y-3">
                              {gameState.team.members.map((member) => (
                                <div key={member.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/30">
                                  <div className={`w-3 h-3 rounded-full ${
                                    member.status === 'online' ? 'bg-green-400' :
                                    member.status === 'away' ? 'bg-yellow-400' :
                                    'bg-slate-500'
                                  }`} />
                                  <div className="flex-1">
                                    <div className="font-semibold text-slate-200">
                                      {member.name}
                                      {member.id === gameState.playerId && <span className="text-amber-400 ml-2">(You)</span>}
                                    </div>
                                    <div className="text-sm text-slate-400">
                                      {member.role && `${member.role} • `}{member.currentActivity}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Team Chat */}
                          <div className="card p-6">
                            <h3 className="text-xl font-bold text-slate-200 mb-4">Team Chat</h3>
                            
                            <div className="bg-slate-900/50 rounded-lg p-4 h-64 overflow-y-auto mb-4">
                              <div className="space-y-3">
                                {gameState.messages.filter(m => m.type === 'team' || m.type === 'system').map((message) => (
                                  <div key={message.id} className={`flex gap-3 ${message.from === gameState.playerName ? 'flex-row-reverse' : ''}`}>
                                    <div className={`max-w-xs p-3 rounded-lg ${
                                      message.type === 'system' ? 'bg-blue-500/20 text-blue-200 mx-auto' :
                                      message.from === gameState.playerName ? 'bg-purple-500/20 text-purple-100' :
                                      'bg-slate-700/50 text-slate-200'
                                    }`}>
                                      {message.type !== 'system' && (
                                        <div className="text-xs text-slate-400 mb-1">{message.from}</div>
                                      )}
                                      <div>{message.message}</div>
                                      <div className="text-xs text-slate-500 mt-1">{message.timestamp}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex gap-3">
                              <input
                                type="text"
                                placeholder="Send a message to your team..."
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                className="flex-1 px-4 py-2 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none"
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              />
                              <button
                                onClick={handleSendMessage}
                                disabled={!chatMessage.trim()}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                  chatMessage.trim()
                                    ? 'bg-purple-600 text-white hover:bg-purple-500'
                                    : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                                }`}
                              >
                                Send
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-12">
                          <Users className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-slate-400 mb-2">No Team Assigned</h3>
                          <p className="text-slate-500">You're playing solo in this adventure</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {selectedTab === 'leaderboard' && (
                  /* ==========================================
                     LEADERBOARD TAB - Rankings (limited view)
                  ========================================== */
                  <motion.div
                    key="leaderboard"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 h-full overflow-y-auto"
                  >
                    <div className="max-w-4xl mx-auto space-y-6">
                      
                      {/* Top Players */}
                      <div className="card p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <Crown className="w-6 h-6 text-amber-400" />
                          <h2 className="text-2xl font-black text-amber-200">Top Performers</h2>
                        </div>
                        
                        <div className="space-y-3">
                          {gameState?.leaderboard.topPlayers.map((player, index) => (
                            <div key={player.position} className={`p-4 rounded-lg flex items-center gap-4 ${
                              index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-amber-500/30' :
                              index === 1 ? 'bg-gradient-to-r from-slate-400/20 to-slate-500/20 border border-slate-500/30' :
                              'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30'
                            }`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                index === 0 ? 'bg-amber-500 text-black' :
                                index === 1 ? 'bg-slate-400 text-black' :
                                'bg-orange-500 text-black'
                              }`}>
                                {player.position}
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-slate-200">{player.name}</div>
                                <div className="text-sm text-slate-400">
                                  Level {player.level} • {player.teamName}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-amber-300">{player.score.toLocaleString()}</div>
                                <div className="text-xs text-slate-400">points</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* My Position & Nearby */}
                      <div className="card p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <Target className="w-6 h-6 text-purple-400" />
                          <h2 className="text-2xl font-black text-purple-200">Your Position</h2>
                          <div className="ml-auto text-sm text-slate-400">
                            Rank {gameState?.leaderboard.myPosition} of {gameState?.leaderboard.totalPlayers}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {gameState?.leaderboard.nearbyPlayers.map((player) => (
                            <div key={player.position} className={`p-3 rounded-lg flex items-center gap-4 transition-all ${
                              player.isMe ? 'bg-purple-500/20 border border-purple-500/50 scale-105' :
                              player.isTeammate ? 'bg-red-500/10 border border-red-500/30' :
                              'bg-slate-800/30 hover:bg-slate-800/50'
                            }`}>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                                player.isMe ? 'bg-purple-500 text-white' :
                                'bg-slate-600 text-slate-300'
                              }`}>
                                {player.position}
                              </div>
                              <div className="flex-1">
                                <div className={`font-semibold ${
                                  player.isMe ? 'text-purple-200' :
                                  player.isTeammate ? 'text-red-300' :
                                  'text-slate-200'
                                }`}>
                                  {player.name}
                                  {player.isMe && <span className="text-amber-400 ml-2">(You)</span>}
                                  {player.isTeammate && <span className="text-red-400 ml-2">(Teammate)</span>}
                                </div>
                                <div className="text-sm text-slate-400">
                                  Level {player.level} • {player.teamName}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-amber-300">{player.score.toLocaleString()}</div>
                                <div className="text-xs text-slate-400">points</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}