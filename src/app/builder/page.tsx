'use client'

import { 
  ArrowLeft, 
  ArrowRight,
  Eye, 
  Users,
  Trophy,
  Palette,
  BookOpen,
  MapPin,
  Shield,
  Wand2,
  Sparkles,
  Camera,
  Mic,
  Lock,
  Key,
  Smartphone,
  X,
  Play,
  ChevronRight,
  Settings
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { getAllFrameworks } from '@/lib/frameworks/story-frameworks'
import CharacterChatDesigner from '@/components/ai/CharacterChatDesigner'
import CustomThemeBuilder from '@/components/ai/CustomThemeBuilder'

export default function AdventureBuilderPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showStoryPreview, setShowStoryPreview] = useState(false)
  const frameworks = getAllFrameworks()
  const [adventureData, setAdventureData] = useState({
    // Step 1: Theme
    title: '',
    theme: '',
    customThemes: [] as any[],
    customColors: {
      primary: '#f59e0b',
      secondary: '#8b5cf6',
      accent: '#10b981'
    },
    
    // Step 2: Narrative  
    narrative: '',
    storyType: '',
    storyFramework: 'hero_journey',
    aiGenerated: false,
    branchingPoints: 2,
    generatedStory: null as any,
    isGeneratingStory: false,
    
    // Step 3: Roles
    roles: [] as string[],
    customCharacters: [] as any[],
    
    // Step 4: Challenges
    challengeTypes: [] as string[],
    qrLocations: [] as string[],
    
    // Step 5: Rewards & Security
    ranking: 'public',
    rewards: [] as string[],
    accessMode: 'private',
    deviceLimits: 1
  })

  const [isCreatingAdventure, setIsCreatingAdventure] = useState(false)

  // Handle adventure creation
  const handleCreateAdventure = async () => {
    if (!adventureData.title.trim() || !adventureData.theme) {
      alert('Please complete the adventure title and theme before creating the adventure.')
      return
    }

    setIsCreatingAdventure(true)

    try {
      const response = await fetch('/api/adventures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: adventureData.title,
          theme: adventureData.theme,
          customColors: adventureData.customColors,
          narrative: adventureData.narrative,
          storyType: adventureData.storyType,
          storyFramework: adventureData.storyFramework,
          aiGenerated: adventureData.aiGenerated,
          branchingPoints: adventureData.branchingPoints,
          generatedStory: adventureData.generatedStory,
          roles: adventureData.roles,
          challengeTypes: adventureData.challengeTypes,
          qrLocations: adventureData.qrLocations,
          ranking: adventureData.ranking,
          rewards: adventureData.rewards,
          accessMode: adventureData.accessMode,
          deviceLimits: adventureData.deviceLimits,
          category: adventureData.theme,
          difficulty: 'intermediate',
          estimatedDuration: 60
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create adventure')
      }

      const result = await response.json()
      
      if (result.success) {
        alert(`🎉 Adventure "${result.adventure.title}" created successfully!\n\nAdventure ID: ${result.adventure.id}\nStatus: ${result.adventure.status}\n\nYou can now view and manage your adventure from the dashboard.`)
        window.location.href = '/dashboard'
      } else {
        throw new Error(result.error || 'Failed to create adventure')
      }

    } catch (error) {
      console.error('Error creating adventure:', error)
      alert(`Error creating adventure: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsCreatingAdventure(false)
    }
  }

  // Wizard steps according to mindmap
  const wizardSteps = [
    { id: 1, title: 'Theme', description: 'Select template or create custom theme', icon: Palette },
    { id: 2, title: 'Story', description: 'Choose pre-made story or generate new with AI', icon: BookOpen },
    { id: 3, title: 'Roles', description: 'Define available roles and perks', icon: Users },
    { id: 4, title: 'Challenges', description: 'Select challenge types and generate QR codes', icon: MapPin },
    { id: 5, title: 'Rewards & Security', description: 'Set ranking, rewards and access controls', icon: Shield }
  ]

  // Themes from mindmap (fantasy, mystery, corporate, sci-fi, educational)
  const themes = [
    {
      id: 'fantasy',
      name: 'Enchanted Forest',
      description: 'Fairies, elves and magical creatures',
      colors: { primary: '#8b5cf6', secondary: '#06b6d4', accent: '#10b981' },
      preview: '🧚‍♀️ A magical adventure full of mystical creatures...'
    },
    {
      id: 'mystery',
      name: 'Hacker Operation',
      description: 'Corporate espionage and secret codes',
      colors: { primary: '#f59e0b', secondary: '#ef4444', accent: '#6366f1' },
      preview: '🕵️ Infiltrate the corporation and uncover secrets...'
    },
    {
      id: 'detective',
      name: 'Detective Game',
      description: 'Solve crimes and find clues',
      colors: { primary: '#64748b', secondary: '#f59e0b', accent: '#dc2626' },
      preview: '🔍 A crime has occurred, find the culprit...'
    },
    {
      id: 'corporate',
      name: 'Corporate Challenge',
      description: 'Professional team building',
      colors: { primary: '#0ea5e9', secondary: '#22c55e', accent: '#f59e0b' },
      preview: '💼 Collaborate with your team to solve challenges...'
    },
    {
      id: 'educational',
      name: 'Educational Adventure',
      description: 'Gamified learning experience',
      colors: { primary: '#10b981', secondary: '#8b5cf6', accent: '#f59e0b' },
      preview: '📚 Learn while solving educational mysteries...'
    }
  ]

  // Pre-made stories from mindmap
  const preMadeStories = [
    {
      id: 'enchanted_forest',
      title: 'The Enchanted Forest',
      theme: 'fantasy',
      description: 'Magical creatures have lost their powers. Help them recover their abilities.',
      duration: 45,
      scenes: 8
    },
    {
      id: 'hacker_operation',
      title: 'Hacker Operation',
      theme: 'mystery',
      description: 'Infiltrate the corrupt corporation and expose their secrets before it\'s too late.',
      duration: 60,
      scenes: 10
    },
    {
      id: 'detective_game',
      title: 'The Museum Detective',
      theme: 'detective',
      description: 'A valuable artwork has disappeared. Find the clues and catch the thief.',
      duration: 50,
      scenes: 12
    }
  ]

  // Adventure roles with perks (expanded collection)
  const adventureRoles = [
    // Fantasy & Magic
    {
      id: 'wizard',
      name: 'Wizard',
      emoji: '🧙‍♂️',
      description: 'Master of arcane mysteries',
      perks: ['Additional clues', '1.2x score multiplier', 'Magical vision'],
      color: 'purple',
      maxPlayers: 2,
      category: 'Fantasy'
    },
    {
      id: 'sorceress',
      name: 'Sorceress',
      emoji: '🧙‍♀️',
      description: 'Enchantress of elemental forces',
      perks: ['Elemental insights', 'Weather prediction', 'Nature communication'],
      color: 'violet',
      maxPlayers: 2,
      category: 'Fantasy'
    },
    {
      id: 'paladin',
      name: 'Paladin',
      emoji: '🛡️',
      description: 'Holy warrior and protector',
      perks: ['Divine protection', 'Team healing', 'Evil detection'],
      color: 'yellow',
      maxPlayers: 2,
      category: 'Fantasy'
    },
    {
      id: 'rogue',
      name: 'Rogue',
      emoji: '🗡️',
      description: 'Master of stealth and cunning',
      perks: ['Lockpicking bonus', 'Stealth mode', 'Trap detection'],
      color: 'gray',
      maxPlayers: 3,
      category: 'Fantasy'
    },
    {
      id: 'bard',
      name: 'Bard',
      emoji: '🎵',
      description: 'Storyteller and team motivator',
      perks: ['Team morale boost', 'Story knowledge', 'Persuasion bonus'],
      color: 'orange',
      maxPlayers: 2,
      category: 'Fantasy'
    },
    {
      id: 'druid',
      name: 'Druid',
      emoji: '🌿',
      description: 'Nature guardian and shapeshifter',
      perks: ['Animal communication', 'Plant knowledge', 'Weather sense'],
      color: 'green',
      maxPlayers: 2,
      category: 'Fantasy'
    },
    
    // Combat & Action
    {
      id: 'warrior',
      name: 'Warrior',
      emoji: '⚔️',
      description: 'Brave leader of the group',
      perks: ['Speed bonus points', 'Team leadership', 'Extra endurance'],
      color: 'red',
      maxPlayers: 3,
      category: 'Combat'
    },
    {
      id: 'archer',
      name: 'Archer',
      emoji: '🏹',
      description: 'Precision marksman and scout',
      perks: ['Long-range vision', 'Target accuracy', 'Scouting bonus'],
      color: 'emerald',
      maxPlayers: 2,
      category: 'Combat'
    },
    {
      id: 'knight',
      name: 'Knight',
      emoji: '🤺',
      description: 'Honorable champion and tactician',
      perks: ['Strategic planning', 'Honor bonus', 'Team coordination'],
      color: 'blue',
      maxPlayers: 2,
      category: 'Combat'
    },
    {
      id: 'assassin',
      name: 'Assassin',
      emoji: '🥷',
      description: 'Silent eliminator and infiltrator',
      perks: ['Silent movement', 'Critical strikes', 'Information gathering'],
      color: 'slate',
      maxPlayers: 1,
      category: 'Combat'
    },
    
    // Investigation & Mystery
    {
      id: 'detective',
      name: 'Detective',
      emoji: '🕵️',
      description: 'Expert clue investigator',
      perks: ['Advanced analysis', 'Fraud detection', 'Special intuition'],
      color: 'amber',
      maxPlayers: 2,
      category: 'Mystery'
    },
    {
      id: 'forensic',
      name: 'Forensic Expert',
      emoji: '🔬',
      description: 'Scientific crime scene analyst',
      perks: ['Evidence analysis', 'DNA insights', 'Crime reconstruction'],
      color: 'cyan',
      maxPlayers: 2,
      category: 'Mystery'
    },
    {
      id: 'spy',
      name: 'Secret Agent',
      emoji: '🕶️',
      description: 'Undercover intelligence operative',
      perks: ['Surveillance skills', 'Gadget access', 'Code breaking'],
      color: 'zinc',
      maxPlayers: 2,
      category: 'Mystery'
    },
    {
      id: 'reporter',
      name: 'Investigative Reporter',
      emoji: '📰',
      description: 'Truth-seeking journalist',
      perks: ['Information network', 'Interview skills', 'Research bonus'],
      color: 'teal',
      maxPlayers: 3,
      category: 'Mystery'
    },
    
    // Intellectual & Academic
    {
      id: 'scholar',
      name: 'Scholar',
      emoji: '📚',
      description: 'Keeper of ancient secrets',
      perks: ['Bonus knowledge', 'Clue translation', 'Ancestral wisdom'],
      color: 'emerald',
      maxPlayers: 3,
      category: 'Academic'
    },
    {
      id: 'scientist',
      name: 'Mad Scientist',
      emoji: '🧪',
      description: 'Experimental researcher and inventor',
      perks: ['Invention creation', 'Formula knowledge', 'Lab analysis'],
      color: 'lime',
      maxPlayers: 2,
      category: 'Academic'
    },
    {
      id: 'archaeologist',
      name: 'Archaeologist',
      emoji: '⛏️',
      description: 'Ancient artifact specialist',
      perks: ['Artifact knowledge', 'Historical insights', 'Excavation bonus'],
      color: 'amber',
      maxPlayers: 2,
      category: 'Academic'
    },
    {
      id: 'librarian',
      name: 'Master Librarian',
      emoji: '📖',
      description: 'Guardian of knowledge and texts',
      perks: ['Text deciphering', 'Research speed', 'Memory palace'],
      color: 'indigo',
      maxPlayers: 2,
      category: 'Academic'
    },
    
    // Technology & Modern
    {
      id: 'hacker',
      name: 'Hacker',
      emoji: '💻',
      description: 'Digital infiltration expert',
      perks: ['System access', 'Code breaking', 'Digital forensics'],
      color: 'green',
      maxPlayers: 2,
      category: 'Tech'
    },
    {
      id: 'engineer',
      name: 'Engineer',
      emoji: '⚙️',
      description: 'Mechanical systems specialist',
      perks: ['Device repair', 'Blueprint reading', 'System analysis'],
      color: 'slate',
      maxPlayers: 3,
      category: 'Tech'
    },
    {
      id: 'pilot',
      name: 'Pilot',
      emoji: '✈️',
      description: 'Navigation and transport expert',
      perks: ['Route optimization', 'Vehicle control', 'Emergency maneuvers'],
      color: 'sky',
      maxPlayers: 1,
      category: 'Tech'
    },
    {
      id: 'medic',
      name: 'Combat Medic',
      emoji: '⛑️',
      description: 'Battlefield healer and support',
      perks: ['Team healing', 'Injury assessment', 'Emergency response'],
      color: 'red',
      maxPlayers: 2,
      category: 'Support'
    },
    
    // Corporate & Leadership
    {
      id: 'ceo',
      name: 'CEO',
      emoji: '👔',
      description: 'Strategic leader and decision maker',
      perks: ['Executive decisions', 'Resource allocation', 'Team motivation'],
      color: 'blue',
      maxPlayers: 1,
      category: 'Corporate'
    },
    {
      id: 'consultant',
      name: 'Management Consultant',
      emoji: '💼',
      description: 'Process optimization expert',
      perks: ['Efficiency analysis', 'Problem solving', 'Strategic planning'],
      color: 'purple',
      maxPlayers: 2,
      category: 'Corporate'
    },
    {
      id: 'negotiator',
      name: 'Negotiator',
      emoji: '🤝',
      description: 'Diplomatic solution finder',
      perks: ['Conflict resolution', 'Win-win solutions', 'Communication bonus'],
      color: 'emerald',
      maxPlayers: 2,
      category: 'Corporate'
    },
    
    // Creative & Artistic
    {
      id: 'artist',
      name: 'Master Artist',
      emoji: '🎨',
      description: 'Creative visionary and pattern recognizer',
      perks: ['Visual puzzles', 'Creative solutions', 'Pattern recognition'],
      color: 'pink',
      maxPlayers: 2,
      category: 'Creative'
    },
    {
      id: 'photographer',
      name: 'Photographer',
      emoji: '📸',
      description: 'Visual storyteller and observer',
      perks: ['Photo challenges', 'Detail spotting', 'Visual memory'],
      color: 'purple',
      maxPlayers: 3,
      category: 'Creative'
    },
    {
      id: 'musician',
      name: 'Musician',
      emoji: '🎼',
      description: 'Sound master and rhythm keeper',
      perks: ['Audio puzzles', 'Sound patterns', 'Rhythm challenges'],
      color: 'violet',
      maxPlayers: 2,
      category: 'Creative'
    },
    
    // Survival & Adventure
    {
      id: 'explorer',
      name: 'Explorer',
      emoji: '🧭',
      description: 'Wilderness survival expert',
      perks: ['Navigation skills', 'Survival techniques', 'Terrain knowledge'],
      color: 'yellow',
      maxPlayers: 2,
      category: 'Adventure'
    },
    {
      id: 'treasure_hunter',
      name: 'Treasure Hunter',
      emoji: '🗝️',
      description: 'Seeker of hidden valuables',
      perks: ['Hidden object detection', 'Puzzle solving', 'Risk assessment'],
      color: 'amber',
      maxPlayers: 2,
      category: 'Adventure'
    },
    {
      id: 'survivor',
      name: 'Survivor',
      emoji: '🎯',
      description: 'Resourceful problem solver',
      perks: ['Resource management', 'Improvisation', 'Crisis handling'],
      color: 'orange',
      maxPlayers: 3,
      category: 'Adventure'
    },
    
    // Mystical & Supernatural  
    {
      id: 'psychic',
      name: 'Psychic Medium',
      emoji: '🔮',
      description: 'Supernatural insight specialist',
      perks: ['Future glimpses', 'Spirit communication', 'Psychic visions'],
      color: 'purple',
      maxPlayers: 1,
      category: 'Mystical'
    },
    {
      id: 'vampire',
      name: 'Vampire',
      emoji: '🧛‍♀️',
      description: 'Night creature with enhanced senses',
      perks: ['Night vision', 'Enhanced speed', 'Mind influence'],
      color: 'red',
      maxPlayers: 1,
      category: 'Mystical'
    },
    {
      id: 'werewolf',
      name: 'Werewolf',
      emoji: '🐺',
      description: 'Shapeshifter with primal instincts',
      perks: ['Animal senses', 'Tracking abilities', 'Pack coordination'],
      color: 'gray',
      maxPlayers: 2,
      category: 'Mystical'
    },
    
    // Historical & Classic
    {
      id: 'pirate',
      name: 'Pirate Captain',
      emoji: '🏴‍☠️',
      description: 'Seafaring treasure hunter',
      perks: ['Treasure sense', 'Naval knowledge', 'Leadership'],
      color: 'amber',
      maxPlayers: 2,
      category: 'Historical'
    },
    {
      id: 'ninja',
      name: 'Ninja',
      emoji: '🥷',
      description: 'Shadow warrior with ancient skills',
      perks: ['Stealth mastery', 'Ancient wisdom', 'Silent movement'],
      color: 'slate',
      maxPlayers: 2,
      category: 'Historical'
    },
    {
      id: 'samurai',
      name: 'Samurai',
      emoji: '⚔️',
      description: 'Honorable warrior with code of ethics',
      perks: ['Honor bonus', 'Weapon mastery', 'Tactical insight'],
      color: 'red',
      maxPlayers: 2,
      category: 'Historical'
    },
    
    // Modern Specialists
    {
      id: 'doctor',
      name: 'Emergency Doctor',
      emoji: '👩‍⚕️',
      description: 'Medical expert and life saver',
      perks: ['Medical knowledge', 'Emergency care', 'Diagnosis skills'],
      color: 'red',
      maxPlayers: 2,
      category: 'Modern'
    },
    {
      id: 'teacher',
      name: 'Professor',
      emoji: '👨‍🏫',
      description: 'Educational guide and mentor',
      perks: ['Knowledge sharing', 'Learning acceleration', 'Wisdom bonus'],
      color: 'blue',
      maxPlayers: 3,
      category: 'Modern'
    },
    {
      id: 'chef',
      name: 'Master Chef',
      emoji: '👨‍🍳',
      description: 'Culinary artist and nutrition expert',
      perks: ['Food knowledge', 'Recipe creation', 'Taste testing'],
      color: 'orange',
      maxPlayers: 2,
      category: 'Modern'
    }
  ]

  // Combine predefined and custom themes
  const allThemes = [...themes, ...adventureData.customThemes]

  // Handle AI-generated themes
  const handleCustomThemeCreated = (theme: any) => {
    const newTheme = {
      ...theme,
      isCustom: true
    }
    setAdventureData({
      ...adventureData,
      customThemes: [...adventureData.customThemes, newTheme],
      theme: newTheme.id, // Auto-select the new custom theme
      customColors: newTheme.colors
    })
  }

  // Get unique categories for filtering
  const categories = ['All', ...Array.from(new Set(adventureRoles.map(role => role.category)))]

  // Combine predefined and custom characters
  const allCharacters = [...adventureRoles, ...adventureData.customCharacters]

  // Filter characters by selected category
  const filteredCharacters = selectedCategory === 'All' 
    ? allCharacters 
    : allCharacters.filter(char => char.category === selectedCategory)

  // Handle AI-generated characters
  const handleCustomCharacterCreated = (character: any) => {
    const newCharacter = {
      id: `custom_${Date.now()}`,
      ...character,
      isCustom: true
    }
    setAdventureData({
      ...adventureData,
      customCharacters: [...adventureData.customCharacters, newCharacter]
    })
  }

  // Challenge types from mindmap
  const challengeTypes = [
    {
      id: 'trivia',
      name: 'AI-Generated Trivia',
      description: 'Dynamic questions adapted to theme',
      icon: Eye,
      color: 'purple'
    },
    {
      id: 'photo',
      name: 'AI Photo Challenge',
      description: 'Visual validation of specific objects',
      icon: Camera,
      color: 'amber'
    },
    {
      id: 'audio',
      name: 'Secret Audio',
      description: 'Sound clues and voice recognition',
      icon: Mic,
      color: 'emerald'
    },
    {
      id: 'collaborative',
      name: 'Collaborative Puzzles',
      description: 'Challenges requiring teamwork',
      icon: Users,
      color: 'red'
    }
  ]

  const generateAIStory = async () => {
    setAdventureData({ ...adventureData, isGeneratingStory: true })
    
    try {
      const response = await fetch('/api/ai/story-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: adventureData.theme,
          tone: 'adventurous',
          targetAudience: 'adults',
          duration: 60,
          maxPlayers: 20,
          framework: adventureData.storyFramework,
          specificElements: ['team collaboration', 'progressive challenges']
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate story')
      }

      const storyData = await response.json()
      
      setAdventureData({ 
        ...adventureData, 
        generatedStory: storyData.story,
        narrative: 'ai_generated',
        storyType: 'ai',
        aiGenerated: true,
        isGeneratingStory: false
      })
      
    } catch (error) {
      console.error('Story generation failed:', error)
      setAdventureData({ 
        ...adventureData, 
        isGeneratingStory: false 
      })
      alert('Story generation failed. Please try again or select a pre-made story.')
    }
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
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
          href="/dashboard"
          className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors font-semibold"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </Link>
      </nav>
      
      <main className="relative z-20 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 px-6 py-3 text-sm font-semibold text-amber-300 ring-2 ring-amber-500/30 backdrop-blur-xl border border-amber-500/20">
              <Wand2 className="h-4 w-4 animate-pulse" />
              Adventure Builder Wizard
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-amber-400 via-orange-300 to-purple-400 bg-clip-text text-transparent">
              Create Your Adventure
            </h1>
            
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Step-by-step wizard to create immersive experiences without programming
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {wizardSteps.map((step, index) => {
                const Icon = step.icon
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id
                const isConnected = index < wizardSteps.length - 1
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <motion.div 
                        className={`relative mb-3 p-4 rounded-full transition-all duration-300 ${
                          isActive 
                            ? 'bg-amber-500 ring-4 ring-amber-500/30 scale-110 shadow-2xl' 
                            : isCompleted 
                            ? 'bg-emerald-500 shadow-xl'
                            : 'bg-slate-700'
                        }`}
                        whileHover={{ scale: isActive ? 1.15 : 1.05 }}
                      >
                        <Icon className={`h-6 w-6 ${
                          isActive || isCompleted ? 'text-white' : 'text-slate-400'
                        }`} />
                        
                        {isActive && (
                          <motion.div 
                            className="absolute inset-0 bg-amber-400/30 rounded-full"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </motion.div>
                      
                      <div className="text-center max-w-24">
                        <div className={`text-sm font-bold mb-1 ${
                          isActive ? 'text-amber-300' : isCompleted ? 'text-emerald-300' : 'text-slate-500'
                        }`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-slate-500 leading-tight">
                          {step.description}
                        </div>
                      </div>
                    </div>
                    
                    {isConnected && (
                      <div className={`h-1 w-16 mx-4 rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-emerald-500' : 'bg-slate-700'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="card p-8 mb-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              
              {/* STEP 1: TEMA */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-amber-200 mb-3 flex items-center justify-center gap-3">
                      <Palette className="h-8 w-8" />
                      Step 1: Visual Theme
                    </h2>
                    <p className="text-slate-400">
                      Choose a themed template or customize your own visual experience
                    </p>
                  </div>

                  {/* Adventure Title */}
                  <div className="p-6 rounded-xl border border-amber-500/30 bg-amber-500/5">
                    <h4 className="text-lg font-bold text-amber-200 mb-3 flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Adventure Title
                    </h4>
                    <p className="text-slate-400 text-sm mb-4">
                      Give your adventure a memorable name that will excite participants
                    </p>
                    <input
                      type="text"
                      placeholder="Enter adventure title..."
                      value={adventureData.title}
                      onChange={(e) => setAdventureData({ ...adventureData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                    {adventureData.title && (
                      <p className="text-emerald-400 text-sm mt-2">
                        ✨ Great title! This will be displayed prominently to participants
                      </p>
                    )}
                  </div>

                  {/* AI Theme Builder */}
                  <div className="p-6 rounded-xl border border-purple-500/30 bg-purple-500/5 mb-8">
                    <h4 className="text-lg font-bold text-purple-200 mb-3 flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      AI Theme Generator
                    </h4>
                    <p className="text-slate-400 text-sm mb-4">
                      Diseña temas únicos y personalizados usando inteligencia artificial
                    </p>
                    
                    <CustomThemeBuilder 
                      onThemeGenerated={handleCustomThemeCreated}
                      selectedTheme={adventureData.theme}
                    />
                  </div>

                  {/* Theme Templates */}
                  <div>
                    <h3 className="text-xl font-semibold text-slate-300 mb-6">
                      Temas Disponibles
                      <span className="text-sm text-slate-500 font-normal ml-2">
                        ({allThemes.length} total)
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {allThemes.map((theme) => (
                        <motion.button
                          key={theme.id}
                          onClick={() => setAdventureData({ 
                            ...adventureData, 
                            theme: theme.id,
                            customColors: theme.colors 
                          })}
                          className={`p-5 rounded-xl border transition-all duration-200 text-left relative ${
                            adventureData.theme === theme.id
                              ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-500/20'
                              : 'border-slate-600 bg-slate-800/40 hover:border-amber-500/50'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          layout
                        >
                          {/* Custom Theme Badge */}
                          {theme.isCustom && (
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              IA
                            </div>
                          )}
                          
                          <h4 className="text-lg font-bold text-slate-200 mb-2">{theme.name}</h4>
                          <p className="text-slate-400 text-sm mb-3">{theme.description}</p>
                          
                          {!theme.isCustom && theme.preview && (
                            <div className="text-xs text-slate-500 italic mb-3">
                              {theme.preview}
                            </div>
                          )}
                          
                          {theme.isCustom && theme.category && (
                            <div className="text-xs text-purple-400 font-medium mb-3">
                              Categoría: {theme.category}
                            </div>
                          )}
                          
                          {/* Color Preview */}
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-slate-500"
                              style={{ backgroundColor: theme.colors.primary }}
                            ></div>
                            <div 
                              className="w-4 h-4 rounded-full border border-slate-500"
                              style={{ backgroundColor: theme.colors.secondary }}
                            ></div>
                            <div 
                              className="w-4 h-4 rounded-full border border-slate-500"
                              style={{ backgroundColor: theme.colors.accent }}
                            ></div>
                            {theme.isCustom && (
                              <span className="ml-2 text-xs text-purple-400">
                                🤖 Generado con IA
                              </span>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: NARRATIVA */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-purple-200 mb-3 flex items-center justify-center gap-3">
                      <BookOpen className="h-8 w-8" />
                      Step 2: Story & Narrative
                    </h2>
                    <p className="text-slate-400">
                      Select a pre-defined story or generate a new one with AI
                    </p>
                  </div>

                  {/* Story Options */}
                  <div className="grid grid-cols-1 gap-6">
                    
                    {/* Pre-made Stories */}
                    <div>
                      <h3 className="text-xl font-semibold text-slate-300 mb-4">Pre-made Stories</h3>
                      <div className="space-y-4">
                        {preMadeStories
                          .filter(story => !adventureData.theme || story.theme === adventureData.theme)
                          .map((story) => (
                          <motion.button
                            key={story.id}
                            onClick={() => setAdventureData({ 
                              ...adventureData, 
                              narrative: story.id,
                              storyType: 'premade' 
                            })}
                            className={`w-full p-6 rounded-xl border transition-all duration-200 text-left ${
                              adventureData.narrative === story.id
                                ? 'border-purple-400 bg-purple-500/10 ring-2 ring-purple-500/20'
                                : 'border-slate-600 bg-slate-800/40 hover:border-purple-500/50'
                            }`}
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex items-start gap-4">
                              <div className="p-3 rounded-lg bg-purple-500/20">
                                <BookOpen className="h-6 w-6 text-purple-300" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-bold text-slate-200 mb-2">{story.title}</h4>
                                <p className="text-slate-400 text-sm mb-3">{story.description}</p>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                  <span>⏱️ {story.duration} min</span>
                                  <span>📍 {story.scenes} scenes</span>
                                  <span className="capitalize">🎭 {story.theme}</span>
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* AI Generated Story Option */}
                    <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                      <h4 className="text-lg font-bold text-emerald-200 mb-3 flex items-center gap-2">
                        <Wand2 className="h-5 w-5" />
                        AI Story Generation
                      </h4>
                      <p className="text-slate-400 text-sm mb-4">
                        AI creates a complete narrative using proven storytelling frameworks (Hero's Journey, Mystery Structure, Corporate Learning)
                      </p>
                      
                      {/* Framework Selection */}
                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm text-slate-400 mb-2">Story Framework</label>
                          <select 
                            value={adventureData.storyFramework}
                            onChange={(e) => setAdventureData({ ...adventureData, storyFramework: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg text-slate-300"
                          >
                            {frameworks.map((framework) => (
                              <option key={framework.id} value={framework.id}>
                                {framework.name} - {framework.description}
                              </option>
                            ))}
                          </select>
                          <p className="text-xs text-slate-500 mt-1">
                            Each framework optimizes for different objectives and audiences
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <select className="px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg text-slate-300">
                            <option value="adventurous">Tone: Adventurous</option>
                            <option value="mysterious">Tone: Mysterious</option>
                            <option value="educational">Tone: Educational</option>
                            <option value="corporate">Tone: Corporate</option>
                          </select>
                          
                          <select className="px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg text-slate-300">
                            <option value="60">Duration: 60 min</option>
                            <option value="30">Duration: 30 min</option>
                            <option value="45">Duration: 45 min</option>
                            <option value="90">Duration: 90 min</option>
                            <option value="120">Duration: 120 min</option>
                          </select>
                        </div>
                      </div>
                      
                      <button 
                        onClick={generateAIStory}
                        disabled={adventureData.isGeneratingStory || !adventureData.theme}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                          adventureData.isGeneratingStory
                            ? 'bg-emerald-600/50 text-white cursor-wait'
                            : !adventureData.theme
                            ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-500/30 shadow-lg'
                        }`}
                      >
                        {adventureData.isGeneratingStory ? (
                          <>
                            <Sparkles className="h-4 w-4 animate-spin" />
                            Generating Story...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-4 w-4" />
                            Generate with DeepSeek AI
                          </>
                        )}
                      </button>
                      
                      {/* Generated Story Preview */}
                      {adventureData.generatedStory && (
                        <div className="mt-6 p-4 rounded-lg bg-slate-800/60 border border-emerald-500/20">
                          <h5 className="text-emerald-300 font-semibold mb-2">✨ AI Generated Story Structure</h5>
                          <div className="space-y-2 text-sm">
                            <div className="text-slate-300">
                              <span className="text-emerald-400">Framework:</span> {adventureData.generatedStory.framework_used}
                            </div>
                            <div className="text-slate-300">
                              <span className="text-emerald-400">Acts:</span> {adventureData.generatedStory.acts?.length || 0} story segments
                            </div>
                            <div className="text-slate-300">
                              <span className="text-emerald-400">Duration:</span> {adventureData.generatedStory.total_estimated_duration} minutes
                            </div>
                            <div className="text-slate-300">
                              <span className="text-emerald-400">Quality Score:</span> {adventureData.generatedStory.narrative_quality_score || 'Calculating...'}/100
                            </div>
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="text-xs text-slate-500">
                              ✅ Story generated successfully using professional narrative framework
                            </div>
                            
                            <button
                              onClick={() => setShowStoryPreview(true)}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all duration-200 hover:shadow-emerald-500/30 shadow-lg"
                            >
                              <Eye className="h-4 w-4" />
                              View Full Story
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {!adventureData.theme && (
                        <p className="text-xs text-amber-400 mt-3">
                          ⚠️ Please select a theme first to enable AI generation
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: ROLES */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-emerald-200 mb-3 flex items-center justify-center gap-3">
                      <Users className="h-8 w-8" />
                      Step 3: Roles & Characters
                    </h2>
                    <p className="text-slate-400">
                      Elige roles predefinidos o diseña personajes únicos con IA
                    </p>
                  </div>

                  {/* AI Character Designer */}
                  <div className="p-6 rounded-xl border border-purple-500/30 bg-purple-500/5 mb-8">
                    <h4 className="text-lg font-bold text-purple-200 mb-3 flex items-center gap-2">
                      <Wand2 className="h-5 w-5" />
                      Diseñador de Personajes con IA
                    </h4>
                    <p className="text-slate-400 text-sm mb-4">
                      Chatea con la IA para crear personajes únicos y personalizados para tu aventura
                    </p>
                    
                    <CharacterChatDesigner 
                      onCharacterGenerated={handleCustomCharacterCreated}
                      selectedTheme={adventureData.theme}
                      existingRoles={adventureData.roles}
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-slate-300 mb-3">Filtrar por categoría</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                            selectedCategory === category
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          {category} 
                          {category !== 'All' && (
                            <span className="ml-2 text-xs opacity-70">
                              ({adventureRoles.filter(role => role.category === category).length})
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Characters Grid */}
                  <div>
                    <h4 className="text-lg font-semibold text-slate-300 mb-4">
                      Personajes disponibles 
                      <span className="text-sm text-slate-500 font-normal">
                        ({filteredCharacters.length} total)
                      </span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredCharacters.map((role) => (
                        <motion.div
                          key={role.id}
                          className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer relative ${
                            (adventureData.roles as string[]).includes(role.id)
                              ? `border-${role.color}-400 bg-${role.color}-500/10 ring-2 ring-${role.color}-500/20`
                              : `border-slate-600 bg-slate-800/40 hover:border-${role.color}-500/50`
                          }`}
                          onClick={() => {
                            const roles = (adventureData.roles as string[]).includes(role.id)
                              ? (adventureData.roles as string[]).filter(r => r !== role.id)
                              : [...(adventureData.roles as string[]), role.id]
                            setAdventureData({ ...adventureData, roles })
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          layout
                        >
                          {/* Custom Character Badge */}
                          {role.isCustom && (
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              IA
                            </div>
                          )}
                          
                          <div className="flex items-start gap-3">
                            <div className="text-3xl flex-shrink-0">{role.emoji}</div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-lg font-bold text-slate-200 mb-1 truncate">{role.name}</h5>
                              <div className="text-xs text-slate-500 mb-2 capitalize">{role.category}</div>
                              <p className="text-slate-400 text-sm mb-3 leading-tight">{role.description}</p>
                              
                              <div className="space-y-1">
                                <div className="text-xs text-slate-500 font-semibold">Perks:</div>
                                <div className="space-y-1">
                                  {role.perks.slice(0, 2).map((perk: string, index: number) => (
                                    <div key={index} className={`text-xs text-${role.color}-300 flex items-center gap-2`}>
                                      <div className={`h-1 w-1 rounded-full bg-${role.color}-400 flex-shrink-0`}></div>
                                      <span className="truncate">{perk}</span>
                                    </div>
                                  ))}
                                  {role.perks.length > 2 && (
                                    <div className="text-xs text-slate-500">
                                      +{role.perks.length - 2} más
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mt-2 text-xs text-slate-500">
                                Max {role.maxPlayers} players
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Selected Roles Summary */}
                  {adventureData.roles.length > 0 && (
                    <motion.div 
                      className="p-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="text-emerald-200 font-semibold mb-2">
                        ✅ {adventureData.roles.length} roles seleccionados
                      </div>
                      <div className="text-emerald-300 text-sm mb-3">
                        Los jugadores podrán elegir entre estos roles al unirse a la aventura
                      </div>
                      
                      {/* Selected Roles List */}
                      <div className="flex flex-wrap gap-2">
                        {adventureData.roles.map(roleId => {
                          const role = allCharacters.find(r => r.id === roleId)
                          if (!role) return null
                          
                          return (
                            <span 
                              key={roleId}
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-${role.color}-500/20 text-${role.color}-300 border border-${role.color}-500/30`}
                            >
                              <span>{role.emoji}</span>
                              <span>{role.name}</span>
                              {role.isCustom && <span className="text-purple-400">🤖</span>}
                            </span>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 4: RETOS */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-red-200 mb-3 flex items-center justify-center gap-3">
                      <MapPin className="h-8 w-8" />
                      Step 4: Challenges & QR Codes
                    </h2>
                    <p className="text-slate-400">
                      Configure challenge types and generate secure QR codes
                    </p>
                  </div>

                  {/* Challenge Types Selection */}
                  <div>
                    <h3 className="text-xl font-semibold text-slate-300 mb-6">Challenge Types</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {challengeTypes.map((challenge) => {
                        const Icon = challenge.icon
                        
                        return (
                          <motion.button
                            key={challenge.id}
                            onClick={() => {
                              const challenges = adventureData.challengeTypes.includes(challenge.id)
                                ? adventureData.challengeTypes.filter(c => c !== challenge.id)
                                : [...adventureData.challengeTypes, challenge.id]
                              setAdventureData({ ...adventureData, challengeTypes: challenges })
                            }}
                            className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                              adventureData.challengeTypes.includes(challenge.id)
                                ? `border-${challenge.color}-400 bg-${challenge.color}-500/10`
                                : 'border-slate-600 bg-slate-800/40 hover:border-slate-500'
                            }`}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Icon className={`h-5 w-5 text-${challenge.color}-400`} />
                              <span className="font-semibold text-slate-200">{challenge.name}</span>
                            </div>
                            <p className="text-slate-400 text-sm">{challenge.description}</p>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  {/* QR Code Generation */}
                  <div className="p-6 rounded-xl border border-amber-500/30 bg-amber-500/5">
                    <h4 className="text-lg font-bold text-amber-200 mb-3 flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      QR Code Generation
                    </h4>
                    <p className="text-slate-400 text-sm mb-4">
                      QR codes will be automatically generated with HMAC signatures to prevent fraud
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Number of QRs</label>
                        <input 
                          type="number" 
                          min="3" 
                          max="20" 
                          defaultValue="8"
                          className="w-full px-3 py-2 bg-slate-800/80 border border-slate-600 rounded text-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Duration (hours)</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="24" 
                          defaultValue="4"
                          className="w-full px-3 py-2 bg-slate-800/80 border border-slate-600 rounded text-slate-200 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: PREMIOS Y SEGURIDAD */}
              {currentStep === 5 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-red-200 mb-3 flex items-center justify-center gap-3">
                      <Shield className="h-8 w-8" />
                      Step 5: Rewards & Security
                    </h2>
                    <p className="text-slate-400">
                      Configure rewards, access and security measures
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Ranking & Rewards */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-slate-300">Ranking & Rewards</h3>
                      
                      <div>
                        <label className="block text-sm text-slate-400 mb-3">Ranking Visibility</label>
                        <div className="space-y-2">
                          {[
                            { id: 'public', label: 'Public real-time' },
                            { id: 'final', label: 'Only at the end' },
                            { id: 'hidden', label: 'Always hidden' }
                          ].map((option) => (
                            <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                              <input 
                                type="radio"
                                name="ranking"
                                value={option.id}
                                checked={adventureData.ranking === option.id}
                                onChange={(e) => setAdventureData({ ...adventureData, ranking: e.target.value })}
                                className="text-amber-500"
                              />
                              <span className="text-slate-300">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Digital Rewards */}
                      <div>
                        <label className="block text-sm text-slate-400 mb-3">Digital Rewards</label>
                        <div className="space-y-2">
                          {[
                            { id: 'badges', label: 'Badges and certificates' },
                            { id: 'nft', label: 'Collectible NFTs (beta)' },
                            { id: 'points', label: 'Points system' }
                          ].map((reward) => (
                            <label key={reward.id} className="flex items-center gap-3 cursor-pointer">
                              <input 
                                type="checkbox"
                                className="text-emerald-500"
                              />
                              <span className="text-slate-300">{reward.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Security & Access */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-slate-300">Security & Access</h3>
                      
                      <div>
                        <label className="block text-sm text-slate-400 mb-3">Access Mode</label>
                        <div className="space-y-2">
                          {[
                            { id: 'private', label: 'Private (invitation only)', icon: Lock },
                            { id: 'public', label: 'Public (access code)', icon: Key }
                          ].map((mode) => {
                            const Icon = mode.icon
                            return (
                              <label key={mode.id} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-800/30">
                                <input 
                                  type="radio"
                                  name="access"
                                  value={mode.id}
                                  checked={adventureData.accessMode === mode.id}
                                  onChange={(e) => setAdventureData({ ...adventureData, accessMode: e.target.value })}
                                  className="text-purple-500"
                                />
                                <Icon className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-300">{mode.label}</span>
                              </label>
                            )
                          })}
                        </div>
                      </div>

                      {/* Device Limits */}
                      <div>
                        <label className="block text-sm text-slate-400 mb-3">Device Limit</label>
                        <select 
                          value={adventureData.deviceLimits}
                          onChange={(e) => setAdventureData({ ...adventureData, deviceLimits: parseInt(e.target.value) })}
                          className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg text-slate-300"
                        >
                          <option value={1}>1 device per user</option>
                          <option value={2}>2 devices per user</option>
                          <option value={3}>3 devices per user</option>
                          <option value={0}>No limit</option>
                        </select>
                      </div>

                      {/* MFA Option */}
                      <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="text-red-500" />
                          <Shield className="h-4 w-4 text-red-400" />
                          <span className="text-red-200 font-semibold">Multi-Factor Authentication</span>
                        </label>
                        <p className="text-slate-400 text-xs mt-2 ml-7">
                          For hosts and users with advanced permissions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentStep === 1 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>
            
            {currentStep === 5 ? (
              <button 
                onClick={handleCreateAdventure}
                disabled={!adventureData.title.trim() || !adventureData.theme || isCreatingAdventure}
                className={`px-8 py-3 text-lg font-bold shadow-xl transition-all ${
                  !adventureData.title.trim() || !adventureData.theme || isCreatingAdventure
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    : 'btn-primary hover:shadow-emerald-500/40'
                }`}
              >
                {isCreatingAdventure ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Trophy className="h-6 w-6" />
                    Create Adventure
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={currentStep === 1 && !adventureData.title.trim()}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentStep === 1 && !adventureData.title.trim()
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </motion.div>

          {/* Comprehensive Adventure Overview */}
          <motion.div 
            className="mt-12 space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {/* Quick Overview */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-purple-200 mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Adventure Overview
              </h3>
              
              {/* Title Preview */}
              {adventureData.title && (
                <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20">
                  <div className="text-slate-400 text-sm mb-2">Adventure Title</div>
                  <div className="text-2xl font-bold text-amber-300">{adventureData.title}</div>
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <div className="text-slate-500">Theme</div>
                  <div className="text-slate-200 font-semibold capitalize">
                    {adventureData.theme || 'Not selected'}
                  </div>
                </div>
                
                <div>
                  <div className="text-slate-500">Story</div>
                  <div className="text-slate-200 font-semibold">
                    {adventureData.narrative ? 'Configured' : 'Pending'}
                  </div>
                </div>
                
                <div>
                  <div className="text-slate-500">Roles</div>
                  <div className="text-slate-200 font-semibold">
                    {adventureData.roles.length} available
                  </div>
                </div>
                
                <div>
                  <div className="text-slate-500">Challenges</div>
                  <div className="text-slate-200 font-semibold">
                    {adventureData.challengeTypes.length} types
                  </div>
                </div>
                
                <div>
                  <div className="text-slate-500">Access</div>
                  <div className="text-slate-200 font-semibold capitalize">
                    {adventureData.accessMode}
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Configuration View */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-emerald-200 mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Complete Configuration
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Theme Details */}
                {adventureData.theme && (
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-slate-300 border-b border-slate-700 pb-2">Theme & Visual</h4>
                    
                    {/* Selected Theme */}
                    <div className="p-4 bg-slate-800/40 rounded-lg">
                      <div className="text-xs text-slate-400 mb-1">Selected Theme</div>
                      <div className="text-slate-200 font-medium capitalize mb-2">{adventureData.theme}</div>
                      
                      {/* Theme Colors */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Colors:</span>
                        <div 
                          className="w-4 h-4 rounded-full border border-slate-500"
                          style={{ backgroundColor: adventureData.customColors.primary }}
                        ></div>
                        <div 
                          className="w-4 h-4 rounded-full border border-slate-500"
                          style={{ backgroundColor: adventureData.customColors.secondary }}
                        ></div>
                        <div 
                          className="w-4 h-4 rounded-full border border-slate-500"
                          style={{ backgroundColor: adventureData.customColors.accent }}
                        ></div>
                      </div>
                    </div>

                    {/* Custom Themes */}
                    {adventureData.customThemes.length > 0 && (
                      <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="text-xs text-purple-400 mb-2">Custom AI Themes Generated</div>
                        <div className="space-y-2">
                          {adventureData.customThemes.map((theme, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <span className="text-purple-300">🤖</span>
                              <span className="text-slate-300">{theme.name}</span>
                              <span className="text-xs text-slate-500">({theme.category})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Story Details */}
                {(adventureData.narrative || adventureData.generatedStory) && (
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-slate-300 border-b border-slate-700 pb-2">Story & Narrative</h4>
                    
                    {/* Story Type */}
                    <div className="p-4 bg-slate-800/40 rounded-lg">
                      <div className="text-xs text-slate-400 mb-1">Story Type</div>
                      <div className="text-slate-200 font-medium mb-2">
                        {adventureData.storyType === 'ai' ? '🤖 AI Generated' : 
                         adventureData.storyType === 'premade' ? '📖 Pre-made Story' : 
                         'Not Selected'}
                      </div>
                      
                      {adventureData.storyFramework && (
                        <div className="text-xs text-slate-400">
                          Framework: <span className="text-slate-300">{adventureData.storyFramework}</span>
                        </div>
                      )}
                    </div>

                    {/* AI Generated Story Details */}
                    {adventureData.generatedStory && (
                      <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <div className="text-xs text-emerald-400 mb-2">AI Story Generated</div>
                        <div className="space-y-1 text-sm">
                          <div className="text-slate-300">
                            <span className="text-emerald-400">Acts:</span> {adventureData.generatedStory.acts?.length || 0}
                          </div>
                          <div className="text-slate-300">
                            <span className="text-emerald-400">Duration:</span> {adventureData.generatedStory.total_estimated_duration} min
                          </div>
                          <div className="text-slate-300">
                            <span className="text-emerald-400">Quality:</span> {adventureData.generatedStory.narrative_quality_score || 'N/A'}/100
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Roles Details */}
                {adventureData.roles.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-slate-300 border-b border-slate-700 pb-2">Characters & Roles</h4>
                    
                    <div className="p-4 bg-slate-800/40 rounded-lg">
                      <div className="text-xs text-slate-400 mb-3">Selected Roles ({adventureData.roles.length})</div>
                      <div className="flex flex-wrap gap-2">
                        {adventureData.roles.map(roleId => {
                          const role = allCharacters.find(r => r.id === roleId)
                          if (!role) return null
                          
                          return (
                            <span 
                              key={roleId}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${role.color}-500/20 text-${role.color}-300 border border-${role.color}-500/30`}
                            >
                              <span>{role.emoji}</span>
                              <span>{role.name}</span>
                              {role.isCustom && <span className="text-purple-400">🤖</span>}
                            </span>
                          )
                        })}
                      </div>
                    </div>

                    {/* Custom Characters */}
                    {adventureData.customCharacters.length > 0 && (
                      <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="text-xs text-purple-400 mb-2">Custom AI Characters Created</div>
                        <div className="space-y-2">
                          {adventureData.customCharacters.map((char, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <span className="text-2xl">{char.emoji}</span>
                              <div>
                                <div className="text-slate-300 font-medium">{char.name}</div>
                                <div className="text-xs text-slate-500">{char.category} • {char.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Challenges Details */}
                {adventureData.challengeTypes.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-slate-300 border-b border-slate-700 pb-2">Challenges & Activities</h4>
                    
                    <div className="p-4 bg-slate-800/40 rounded-lg">
                      <div className="text-xs text-slate-400 mb-3">Selected Challenge Types</div>
                      <div className="space-y-2">
                        {adventureData.challengeTypes.map(challengeId => {
                          const challenge = challengeTypes.find(c => c.id === challengeId)
                          if (!challenge) return null
                          
                          return (
                            <div key={challengeId} className="flex items-center gap-3">
                              <challenge.icon className={`h-4 w-4 text-${challenge.color}-400`} />
                              <div>
                                <div className="text-slate-300 text-sm font-medium">{challenge.name}</div>
                                <div className="text-xs text-slate-500">{challenge.description}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Security & Access */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-slate-300 border-b border-slate-700 pb-2">Security & Access</h4>
                  
                  <div className="p-4 bg-slate-800/40 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Access Mode:</span>
                      <span className={`text-sm font-medium ${
                        adventureData.accessMode === 'private' ? 'text-amber-300' : 'text-emerald-300'
                      }`}>
                        {adventureData.accessMode === 'private' ? '🔒 Private' : '🔑 Public'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Ranking:</span>
                      <span className="text-sm text-slate-300 capitalize">{adventureData.ranking}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Device Limit:</span>
                      <span className="text-sm text-slate-300">
                        {adventureData.deviceLimits === 0 ? 'No limit' : `${adventureData.deviceLimits} per user`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Story Preview Modal */}
      <AnimatePresence>
        {showStoryPreview && adventureData.generatedStory && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStoryPreview(false)}
          >
            <motion.div 
              className="bg-slate-900 border border-slate-600 rounded-xl max-w-4xl max-h-[90vh] w-full overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-gradient-to-r from-emerald-900/20 to-purple-900/20">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-emerald-600">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-emerald-200">AI Generated Story</h2>
                    <p className="text-sm text-slate-400">
                      Framework: {adventureData.generatedStory.framework_used} • 
                      Duration: {adventureData.generatedStory.total_estimated_duration} min • 
                      Quality: {adventureData.generatedStory.narrative_quality_score || '75'}/100
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowStoryPreview(false)}
                  className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Story Title and Introduction */}
                <div className="mb-8 p-6 rounded-lg bg-slate-800/60 border border-emerald-500/20">
                  <h3 className="text-2xl font-bold text-emerald-200 mb-3">
                    {adventureData.generatedStory.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {adventureData.generatedStory.introduction}
                  </p>
                  
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-emerald-400">Theme:</span>
                      <div className="text-slate-200 font-semibold capitalize">
                        {adventureData.theme}
                      </div>
                    </div>
                    <div>
                      <span className="text-emerald-400">Players:</span>
                      <div className="text-slate-200 font-semibold">
                        {adventureData.generatedStory.recommended_player_count || '4-8'}
                      </div>
                    </div>
                    <div>
                      <span className="text-emerald-400">Difficulty:</span>
                      <div className="text-slate-200 font-semibold capitalize">
                        {adventureData.generatedStory.difficulty_level || 'Intermediate'}
                      </div>
                    </div>
                    <div>
                      <span className="text-emerald-400">Acts:</span>
                      <div className="text-slate-200 font-semibold">
                        {adventureData.generatedStory.acts?.length || 0} segments
                      </div>
                    </div>
                  </div>
                </div>

                {/* Story Acts/Segments */}
                <div className="space-y-6">
                  <h4 className="text-xl font-bold text-purple-200 mb-4 flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Story Timeline
                  </h4>
                  
                  {adventureData.generatedStory.acts?.map((act: any, index: number) => (
                    <motion.div 
                      key={index}
                      className="p-5 rounded-lg bg-slate-800/40 border border-slate-600 hover:border-purple-500/30 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 flex items-center justify-center font-bold text-white text-sm">
                            {index + 1}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h5 className="text-lg font-semibold text-purple-200 mb-2">
                            {act.title || `Act ${index + 1}`}
                          </h5>
                          
                          <p className="text-slate-300 mb-4 leading-relaxed">
                            {act.description}
                          </p>
                          
                          {/* Act Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-purple-400 text-xs font-semibold block mb-1">Duration</span>
                              <div className="text-slate-300">
                                {act.estimated_duration || Math.floor((adventureData.generatedStory.total_estimated_duration || 60) / (adventureData.generatedStory.acts?.length || 1))} min
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-purple-400 text-xs font-semibold block mb-1">Objective</span>
                              <div className="text-slate-300">
                                {act.objective || 'Complete challenges'}
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-purple-400 text-xs font-semibold block mb-1">Challenges</span>
                              <div className="text-slate-300">
                                {act.challenge_count || '2-3'} challenges
                              </div>
                            </div>
                          </div>

                          {/* Key Events/Milestones */}
                          {act.key_events && (
                            <div className="mt-4">
                              <span className="text-purple-400 text-xs font-semibold block mb-2">Key Events</span>
                              <div className="space-y-1">
                                {act.key_events.map((event: string, eventIndex: number) => (
                                  <div key={eventIndex} className="flex items-center gap-2 text-slate-400 text-sm">
                                    <ChevronRight className="h-3 w-3 text-purple-500 flex-shrink-0" />
                                    <span>{event}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Conclusion */}
                {adventureData.generatedStory.conclusion && (
                  <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-emerald-900/20 to-purple-900/20 border border-emerald-500/20">
                    <h4 className="text-lg font-bold text-emerald-200 mb-3">Conclusion</h4>
                    <p className="text-slate-300 leading-relaxed">
                      {adventureData.generatedStory.conclusion}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t border-slate-700 p-6 bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-400">
                    This story structure will guide your adventure and can be customized further.
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowStoryPreview(false)}
                      className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                    >
                      Close
                    </button>
                    
                    <button 
                      onClick={() => {
                        setShowStoryPreview(false)
                        setCurrentStep(3) // Move to next step
                      }}
                      className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all hover:shadow-emerald-500/30 shadow-lg"
                    >
                      Continue to Roles
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}