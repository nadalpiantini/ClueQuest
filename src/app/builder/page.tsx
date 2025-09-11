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
  Settings,
  Target,
  Search,
  ChevronLeft,
  Plus,
  Zap,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import { GlobalHeader } from '@/components/layout/GlobalHeader'
import { premadeStories } from '@/data/premade-stories'
import { extendedPremadeStories } from '@/data/premade-stories-extended'
import { additionalPremadeStories } from '@/data/premade-stories-additional'
import { useRouter, useSearchParams } from 'next/navigation'
import { getAllFrameworks } from '@/lib/frameworks/story-frameworks'
import CharacterChatDesigner from '@/components/ai/CharacterChatDesigner'
import AIGenerating from '@/components/ui/ai-loading'
import CustomThemeBuilder from '@/components/ai/CustomThemeBuilder'
// New modular Step 4 components
import AdventureActivitiesBuilder from '@/components/builder/AdventureActivitiesBuilder'
import { adventurePersistence } from '@/lib/services/adventure-persistence'
import { AdventureCelebrationModal } from '@/components/ui/adventure-celebration-modal'
import CustomThemeModal from '@/components/create/CustomThemeModal'
import type { Challenge } from '@/types/adventure'

function AdventureBuilderPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get initial step from URL or default to 1
  const getInitialStep = () => {
    const stepFromUrl = searchParams.get('step')
    const parsedStep = stepFromUrl ? parseInt(stepFromUrl) : 1
    return parsedStep >= 1 && parsedStep <= 5 ? parsedStep : 1
  }
  
  const [currentStep, setCurrentStep] = useState(getInitialStep())
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showStoryPreview, setShowStoryPreview] = useState(false)
  const [adventureType, setAdventureType] = useState<string | null>(null)
  const frameworks = getAllFrameworks()

  // Update URL when step changes
  const updateStepInUrl = (step: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('step', step.toString())
    
    
    router.push(`/builder?${params.toString()}`, { scroll: false })
  }

  // Enhanced step navigation with URL updates
  const navigateToStep = (step: number) => {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step)
      updateStepInUrl(step)
    }
  }

  // Sync step with URL changes (browser back/forward buttons)
  useEffect(() => {
    const stepFromUrl = getInitialStep()
    if (stepFromUrl !== currentStep) {
      setCurrentStep(stepFromUrl)
    }
  }, [searchParams])

  // Update URL on initial load if no step parameter exists
  useEffect(() => {
    if (!searchParams.get('step')) {
      updateStepInUrl(1)
    }
  }, [])

  // Get adventure type from URL parameters
  useEffect(() => {
    const typeFromUrl = searchParams.get('adventureType')
    if (typeFromUrl) {
      setAdventureType(typeFromUrl)
      console.log('🔍 Adventure Type set from URL:', typeFromUrl)
    }
  }, [searchParams])

  // Load adventure data from localStorage with backward compatibility
  const loadAdventureData = () => {
    if (typeof window === 'undefined') return null
    
    try {
      const saved = localStorage.getItem('cluequest-builder-data')
      if (saved) {
        const parsedData = JSON.parse(saved)
        
        // 🔄 MIGRATION: Convert old data structure to new structure
        const migratedData = migrateAdventureData(parsedData)
        
        return migratedData
      }
    } catch (error) {
      console.warn('Failed to load adventure data from localStorage:', error)
    }
    return null
  }

  // Migration function to convert old data structure to new structure
  const migrateAdventureData = (oldData: any) => {
    // If it already has the new structure, return as-is
    if (oldData.challenges && !oldData.challengeTypes) {
      return oldData
    }

    console.info('🔄 Migrating adventure data to new structure...')
    
    const migratedData = { ...oldData }

    // Convert challengeTypes (string[]) to challenges (Challenge[])
    if (oldData.challengeTypes && Array.isArray(oldData.challengeTypes)) {
      migratedData.challenges = oldData.challengeTypes.map((typeId: string, index: number) => ({
        id: crypto.randomUUID(),
        name: `${typeId.charAt(0).toUpperCase() + typeId.slice(1)} Challenge`,
        description: `Migrated ${typeId} challenge from previous version`,
        type: typeId,
        difficulty: 'medium',
        points: 15,
        hints: [],
        instructions: `Complete this ${typeId} challenge`,
        successMessage: '🎉 Challenge completed!',
        failureMessage: '❌ Try again!',
        typeData: {},
        tags: [typeId, 'migrated'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      
      // Remove old field
      delete migratedData.challengeTypes
    } else {
      migratedData.challenges = []
    }

    // Convert qrLocations to qrStickers (this is more complex as it requires challenge mapping)
    if (oldData.qrCodes && Array.isArray(oldData.qrCodes)) {
      migratedData.qrStickers = oldData.qrCodes.map((qr: any, index: number) => {
        const challenge = migratedData.challenges[index] || migratedData.challenges[0]
        
        return {
          id: qr.id || crypto.randomUUID(),
          name: `Sticker: ${qr.locationName || `Location ${index + 1}`}`,
          challengeId: challenge?.id || crypto.randomUUID(),
          challengeName: challenge?.name || `Challenge ${index + 1}`,
          securityToken: qr.securityToken || crypto.randomUUID(),
          hmacSignature: qr.hmacSignature || '',
          expiresAt: qr.expiresAt ? new Date(qr.expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          usageLimit: qr.usageLimit || 100,
          currentUsage: qr.currentUsage || 0,
          qrCodeDataURL: '',
          stickerStyle: {
            backgroundColor: '#FFFFFF',
            foregroundColor: '#000000', 
            borderColor: '#E2E8F0',
            size: 150,
            borderRadius: 12
          },
          printSettings: {
            paperSize: 'a4',
            stickersPerPage: 12,
            includeText: true,
            includeInstructions: false
          },
          isActive: true,
          createdAt: new Date(),
          scannedCount: 0
        }
      })
      
      // Remove old fields
      delete migratedData.qrCodes
      delete migratedData.qrLocations
    } else {
      migratedData.qrStickers = []
    }

    // Convert challengeLocationMappings to activityMappings
    if (oldData.challengeLocationMappings) {
      migratedData.activityMappings = []
      delete migratedData.challengeLocationMappings
    } else {
      migratedData.activityMappings = []
    }

    // Ensure all new fields exist with defaults
    migratedData.challenges = migratedData.challenges || []
    migratedData.qrStickers = migratedData.qrStickers || []
    migratedData.activityMappings = migratedData.activityMappings || []

    console.info('✅ Migration completed successfully')
    
    return migratedData
  }

  // Initialize adventure data with default values or loaded data
  const getInitialAdventureData = () => {
    const defaultData = {
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
      
      // Step 4: New modular structure
      locations: [] as any[],
      challenges: [] as Challenge[],
      qrStickers: [] as any[],
      activityMappings: [] as any[],
      adventureType: 'linear' as 'linear' | 'parallel' | 'hub',
      
      // Step 5: Rewards & Security
      ranking: 'public',
      rewards: [] as string[],
      accessMode: 'private',
      deviceLimits: 1
    }

    return defaultData
  }

  const [adventureData, setAdventureData] = useState(getInitialAdventureData())
  const [isHydrated, setIsHydrated] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isAutoSaving, setIsAutoSaving] = useState(false)

  // Load data from localStorage after hydration
  useEffect(() => {
    const savedData = loadAdventureData()
    if (savedData) {
      setAdventureData(prevData => ({ ...prevData, ...savedData }))
    }
    setIsHydrated(true)
  }, [])

  // Enhanced auto-save with debouncing and visual feedback
  const saveAdventureData = async (data: typeof adventureData, showFeedback = false) => {
    if (typeof window === 'undefined') return
    
    try {
      setIsAutoSaving(true)
      
      // Don't save temporary states like isGeneratingStory
      const dataToSave = {
        ...data,
        isGeneratingStory: false,
        lastAutoSaved: new Date().toISOString()
      }
      
      // Save to localStorage for immediate persistence
      localStorage.setItem('cluequest-builder-data', JSON.stringify(dataToSave))
      setLastSaved(new Date())
      
      // Auto-save to Supabase if adventure has title and locations (indicates serious progress)
      if (data.title?.trim() && (data.locations?.length || 0) > 0) {
        try {
          const result = await adventurePersistence.saveAdventure(data as any)
          if (result.success) {
            if (showFeedback) {
              // Show success feedback
              console.log('✅ Adventure auto-saved successfully')
            }
          }
        } catch (supabaseError) {
          // Continue with localStorage only
          console.warn('Supabase auto-save failed, using localStorage only:', supabaseError)
        }
      }
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setIsAutoSaving(false)
    }
  }

  // Debounced auto-save to prevent excessive saves
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)
  
  const debouncedSave = (data: typeof adventureData) => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }
    
    const timeout = setTimeout(() => {
      saveAdventureData(data)
    }, 2000) // Save after 2 seconds of inactivity
    
    setSaveTimeout(timeout)
  }

  // Enhanced setAdventureData that also saves to localStorage with debouncing
  const updateAdventureData = (newData: typeof adventureData) => {
    setAdventureData(newData)
    debouncedSave(newData)
  }

  // Adventure themes with professional images
  const themes = [
    { 
      id: 'mystery', 
      name: 'Detective Caper', 
      icon: Search, 
      color: 'amber',
      description: 'Solve crimes and mysteries as a skilled sleuth.',
      profileImage: '/images/adventure-profiles/Detective_adventure_profile.png',
      darkOverlay: 'rgba(15, 23, 42, 0.6)',
      palette: ['#2B1B12', '#3B2417', '#C8772A', '#5A3A22'],
      colors: { primary: '#C8772A', secondary: '#3B2417', accent: '#5A3A22' },
      preview: '🔍 Solve crimes and mysteries as a skilled sleuth.'
    },
    { 
      id: 'fantasy', 
      name: 'Enchanted Forest', 
      icon: Key, 
      color: 'emerald',
      description: 'Fairies, ancient magic, and mystical creatures await.',
      profileImage: '/images/adventure-profiles/Enchanted_adventure_profile.png',
      darkOverlay: 'rgba(6, 95, 70, 0.6)',
      palette: ['#0E3B2F', '#1D5C4B', '#2D8B6F', '#E0D48A'],
      colors: { primary: '#2D8B6F', secondary: '#1D5C4B', accent: '#E0D48A' },
      preview: '🧚‍♀️ Fairies, ancient magic, and mystical creatures await.'
    },
    { 
      id: 'hacker', 
      name: 'Hacker Operation', 
      icon: Shield, 
      color: 'blue',
      description: 'Infiltrate and manipulate a network of servers and codes.',
      profileImage: '/images/adventure-profiles/Hacker_adventure_profile.png',
      darkOverlay: 'rgba(12, 29, 36, 0.6)',
      palette: ['#0C1D24', '#0E2D33', '#1BA7A0', '#0E6F6A'],
      colors: { primary: '#1BA7A0', secondary: '#0E2D33', accent: '#0E6F6A' },
      preview: '💻 Infiltrate and manipulate a network of servers and codes.'
    },
    { 
      id: 'corporate', 
      name: 'Corporate Challenge', 
      icon: Users, 
      color: 'purple',
      description: 'Team building through professional mysteries.',
      profileImage: '/images/adventure-profiles/Corporate_adventure_profile.png',
      darkOverlay: 'rgba(26, 77, 74, 0.6)',
      palette: ['#1A4D4A', '#2A5D5A', '#3A6D6A', '#4A7D7A'],
      colors: { primary: '#3A6D6A', secondary: '#2A5D5A', accent: '#4A7D7A' },
      preview: '🏢 Team building through professional mysteries.'
    },
    { 
      id: 'sci-fi', 
      name: 'Space Station', 
      icon: Zap, 
      color: 'cyan',
      description: 'Navigate through futuristic technology and alien encounters.',
      profileImage: '/images/adventure-profiles/Sci-fi_adventure_profile.png',
      darkOverlay: 'rgba(6, 78, 59, 0.6)',
      palette: ['#064E3B', '#065F46', '#059669', '#10B981'],
      colors: { primary: '#059669', secondary: '#065F46', accent: '#10B981' },
      preview: '🚀 Navigate through futuristic technology and alien encounters.'
    },
    { 
      id: 'horror', 
      name: 'Haunted Manor', 
      icon: AlertTriangle, 
      color: 'red',
      description: 'Face supernatural forces in a spine-chilling adventure.',
      profileImage: '/images/adventure-profiles/Horror_adventure_profile.png',
      darkOverlay: 'rgba(127, 29, 29, 0.6)',
      palette: ['#7F1D1D', '#991B1B', '#DC2626', '#EF4444'],
      colors: { primary: '#DC2626', secondary: '#991B1B', accent: '#EF4444' },
      preview: '👻 Face supernatural forces in a spine-chilling adventure.'
    },
    { 
      id: 'educational', 
      name: 'Learning Adventure', 
      icon: BookOpen, 
      color: 'green',
      description: 'Educational challenges that make learning fun and interactive.',
      profileImage: '/images/adventure-profiles/Educational_adventure_profile.png',
      darkOverlay: 'rgba(6, 78, 59, 0.6)',
      palette: ['#064E3B', '#065F46', '#059669', '#10B981'],
      colors: { primary: '#059669', secondary: '#065F46', accent: '#10B981' },
      preview: '📚 Educational challenges that make learning fun and interactive.'
    }
  ]

  // State for custom themes
  const [customThemes, setCustomThemes] = useState<any[]>([])

  // Get all themes including custom ones and create custom theme button
  const allThemes = [
    ...themes, 
    ...customThemes.map(customTheme => ({
      ...customTheme,
      icon: Shield,
      color: 'custom',
      darkOverlay: 'rgba(0, 0, 0, 0.6)',
      isCustom: true,
      colors: {
        primary: customTheme.palette?.[0] || '#666',
        secondary: customTheme.palette?.[1] || '#444', 
        accent: customTheme.palette?.[2] || '#888'
      }
    })),
    {
      id: 'create-custom',
      name: 'Create Custom Theme',
      description: 'Design your own unique theme',
      icon: Plus,
      color: 'slate',
      darkOverlay: 'rgba(0, 0, 0, 0.7)',
      isCustom: false,
      isCreateButton: true,
      colors: {
        primary: '#64748b',
        secondary: '#475569',
        accent: '#334155'
      }
    }
  ]

  const handleCustomThemeCreated = (newTheme: any) => {
    setCustomThemes(prev => [...prev, newTheme])
    
    const themeToAdd = {
      ...newTheme,
      icon: Shield,
      color: 'custom',
      darkOverlay: 'rgba(0, 0, 0, 0.6)',
      isCustom: true,
      colors: {
        primary: newTheme.colors?.primary || '#8b5cf6',
        secondary: newTheme.colors?.secondary || '#06b6d4', 
        accent: newTheme.colors?.accent || '#f59e0b'
      }
    }
    
    setCurrentThemeIndex(allThemes.length)
    updateAdventureData({ 
      ...adventureData, 
      theme: newTheme.id,
      customColors: themeToAdd.colors
    })
  }



  // Auto-save when adventure data changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveAdventureData(adventureData)
    }, 1000) // Save 1 second after last change

    return () => clearTimeout(timeoutId)
  }, [adventureData])

  // Clear saved data function for debugging/reset
  const clearSavedData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cluequest-builder-data')
      window.location.reload()
    }
  }

  const [isCreatingAdventure, setIsCreatingAdventure] = useState(false)
  const [showCelebrationModal, setShowCelebrationModal] = useState(false)
  const [createdAdventure, setCreatedAdventure] = useState<{
    title: string
    id: string
    status: string
  } | null>(null)
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0)
  const [isCustomThemeModalOpen, setIsCustomThemeModalOpen] = useState(false)

  // Handle adventure creation
  const handleCreateAdventure = async () => {
    if (!adventureData.title?.trim() || !adventureData.theme) {
      alert('Please complete the adventure title and theme before creating the adventure.')
      return
    }

    setIsCreatingAdventure(true)

    try {
      const response = await fetch('/api/adventures-simple', {
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
          challenges: adventureData.challenges || [],
          qrStickers: adventureData.qrStickers || [],
          activityMappings: adventureData.activityMappings || [],
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
        setCreatedAdventure({
          title: result.adventure.title,
          id: result.adventure.id,
          status: result.adventure.status
        })
        setShowCelebrationModal(true)
      } else {
        throw new Error(result.error || 'Failed to create adventure')
      }

    } catch (error) {
      alert(`Error creating adventure: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsCreatingAdventure(false)
    }
  }

  // Wizard steps according to mindmap with completion tracking
  const wizardSteps = [
    { 
      id: 1, 
      title: 'Theme', 
      description: 'Select template or create custom theme', 
      icon: Palette,
      estimatedTime: '2-3 min',
      requiredFields: ['title', 'theme']
    },
    { 
      id: 2, 
      title: 'Story', 
      description: 'Choose pre-made story or generate new with AI', 
      icon: BookOpen,
      estimatedTime: '3-5 min',
      requiredFields: ['narrative', 'storyType']
    },
    { 
      id: 3, 
      title: 'Roles', 
      description: 'Define available roles and perks', 
      icon: Users,
      estimatedTime: '2-4 min',
      requiredFields: ['roles']
    },
    { 
      id: 4, 
      title: 'Challenges', 
      description: 'Select challenge types and generate QR codes', 
      icon: MapPin,
      estimatedTime: '5-10 min',
      requiredFields: ['locations', 'challenges']
    },
    { 
      id: 5, 
      title: 'Rewards & Security', 
      description: 'Set ranking, rewards and access controls', 
      icon: Shield,
      estimatedTime: '2-3 min',
      requiredFields: ['ranking', 'accessMode']
    }
  ]

  // Calculate step completion status
  const getStepCompletion = (step: typeof wizardSteps[0]) => {
    const requiredFields = step.requiredFields
    const completedFields = requiredFields.filter(field => {
      const value = adventureData[field as keyof typeof adventureData]
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return value && value.toString().trim() !== ''
    })
    
    return {
      isCompleted: completedFields.length === requiredFields.length,
      progress: (completedFields.length / requiredFields.length) * 100,
      completedFields: completedFields.length,
      totalFields: requiredFields.length
    }
  }


  // Combine all pre-made stories
  const allPremadeStories = [...premadeStories, ...extendedPremadeStories, ...additionalPremadeStories]

  // Map adventure types to story themes
  const getThemesForAdventureType = (type: string | null): string[] => {
    if (!type) return []
    
    switch (type) {
      case 'corporate':
        return ['corporate']
      case 'educational':
        return ['educational']
      case 'social':
        // For social adventures, include themes that work well for social events
        return ['mystery', 'fantasy', 'hacker']
      default:
        return []
    }
  }

  // Filter themes based on adventure type
  const getFilteredThemes = () => {
    // Only filter if adventureType is set (client-side)
    if (!adventureType) {
      console.log('🔍 No adventure type set, showing all themes')
      return allThemes
    }
    
    const allowedThemes = getThemesForAdventureType(adventureType)
    if (allowedThemes.length === 0) {
      console.log('🔍 No allowed themes for type:', adventureType)
      return allThemes
    }
    
    // Filter themes that match the adventure type, plus always include custom theme button
    const filtered = allThemes.filter(theme => 
      theme.isCreateButton || allowedThemes.includes(theme.id)
    )
    
    // Debug logging
    console.log('🔍 Theme Filtering Debug:', {
      adventureType,
      allowedThemes,
      allThemesCount: allThemes.length,
      filteredCount: filtered.length,
      filteredThemes: filtered.map(t => ({ id: t.id, name: t.name, isCreateButton: t.isCreateButton }))
    })
    
    return filtered
  }

  const filteredThemes = useMemo(() => getFilteredThemes(), [adventureType, allThemes])

  // Sync carousel index with selected theme when adventure data loads
  useEffect(() => {
    if (adventureData.theme && filteredThemes.length > 0) {
      const themeIndex = filteredThemes.findIndex(theme => theme.id === adventureData.theme)
      if (themeIndex !== -1) {
        const maxIndex = Math.max(0, filteredThemes.length - 3)
        let centeredIndex = themeIndex - 1
        
        if (centeredIndex < 0) {
          centeredIndex = 0
        }
        
        if (centeredIndex > maxIndex) {
          centeredIndex = maxIndex
        }
        
        setCurrentThemeIndex(centeredIndex)
      }
    }
  }, [adventureData.theme, filteredThemes.length])

  // Carousel navigation functions
  const nextTheme = () => {
    setCurrentThemeIndex((prev) => {
      const maxIndex = Math.max(0, filteredThemes.length - 3)
      const nextIndex = Math.min(prev + 1, maxIndex)
      return nextIndex
    })
  }

  const prevTheme = () => {
    setCurrentThemeIndex((prev) => {
      const prevIndex = Math.max(prev - 1, 0)
      return prevIndex
    })
  }

  const selectTheme = (themeId: string) => {
    if (themeId === 'create-custom') {
      setIsCustomThemeModalOpen(true)
      return
    }
    const theme = allThemes.find(t => t.id === themeId)
    updateAdventureData({ 
      ...adventureData, 
      theme: themeId,
      customColors: theme?.colors
    })
    const themeIndex = filteredThemes.findIndex(theme => theme.id === themeId)
    if (themeIndex !== -1) {
      // Center the selected theme in the carousel (showing 3 items at a time)
      const maxIndex = Math.max(0, filteredThemes.length - 3)
      // Calculate the index to center the selected theme
      // For a 3-item carousel, we want the selected item to be in the middle (position 1)
      let centeredIndex = themeIndex - 1
      
      // Ensure we don't go below 0
      if (centeredIndex < 0) {
        centeredIndex = 0
      }
      
      // Ensure we don't exceed the maximum index
      if (centeredIndex > maxIndex) {
        centeredIndex = maxIndex
      }
      
      setCurrentThemeIndex(centeredIndex)
    }
  }

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
  // (Themes are now combined in allThemes definition above)

  // Genre to role category mapping (same as role-selection page)
  const GENRE_TO_ROLE_CATEGORY_MAP: Record<string, string[]> = {
    'fantasy': ['Fantasy', 'Mystical', 'Historical'],
    'mystery': ['Mystery', 'Academic'],
    'detective': ['Mystery', 'Academic'],
    'sci-fi': ['Tech', 'Academic'],
    'horror': ['Mystical', 'Mystery'],
    'adventure': ['Adventure', 'Combat'],
    'treasure-hunt': ['Adventure', 'Mystery'],
    'escape-room': ['Academic', 'Tech'],
    'puzzle': ['Academic', 'Creative'],
    'corporate': ['Corporate'],
    'educational': ['Academic', 'Modern'],
    'team-building': ['Corporate', 'Support'],
    'social': ['Creative', 'Support'],
    'entertainment': ['Creative', 'Fantasy', 'Adventure']
  }

  // Get unique categories for filtering based on selected genre
  const availableCategories = adventureData.theme && GENRE_TO_ROLE_CATEGORY_MAP[adventureData.theme]
    ? GENRE_TO_ROLE_CATEGORY_MAP[adventureData.theme]
    : Array.from(new Set(adventureRoles.map(role => role.category)))
  
  const categories = ['All', ...availableCategories]

  // Combine predefined and custom characters
  const allCharacters = [...adventureRoles, ...(adventureData.customCharacters || [])]

  // Filter characters by adventure genre first, then by selected category
  const genreFilteredCharacters = adventureData.theme && GENRE_TO_ROLE_CATEGORY_MAP[adventureData.theme]
    ? allCharacters.filter(char => GENRE_TO_ROLE_CATEGORY_MAP[adventureData.theme].includes(char.category))
    : allCharacters

  // Filter characters by selected category
  const filteredCharacters = selectedCategory === 'All' 
    ? genreFilteredCharacters 
    : genreFilteredCharacters.filter(char => char.category === selectedCategory)

  // Handle AI-generated characters
  const handleCustomCharacterCreated = (character: any) => {
    const newCharacter = {
      id: `custom_${Date.now()}`,
      ...character,
      isCustom: true
    }
    updateAdventureData({
      ...adventureData,
      customCharacters: [...(adventureData.customCharacters || []), newCharacter]
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
      setAdventureData({ 
        ...adventureData, 
        isGeneratingStory: false 
      })
      alert('Story generation failed. Please try again or select a pre-made story.')
    }
  }

  const nextStep = () => {
    if (currentStep < 5) {
      navigateToStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      navigateToStep(currentStep - 1)
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
        <div className="flex items-center justify-between">
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>

          {/* Auto-save Status */}
          <div className="flex items-center gap-2 text-sm">
            {isAutoSaving ? (
              <div className="flex items-center gap-2 text-amber-400">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span>Saving...</span>
              </div>
            ) : lastSaved ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              </div>
            ) : null}
          </div>

          {/* Navigable Breadcrumbs */}
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="text-slate-500">Quick Jump:</span>
            {wizardSteps.map((step, index) => {
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              const completion = getStepCompletion(step)
              
              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => navigateToStep(step.id)}
                    className={`px-3 py-1 rounded-lg transition-all duration-200 relative ${
                      isActive 
                        ? 'bg-amber-500 text-white font-semibold'
                        : isCompleted 
                        ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                        : completion.progress > 0
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50'
                    }`}
                    title={`${step.title}: ${step.description} (${step.estimatedTime}) - ${completion.completedFields}/${completion.totalFields} completed`}
                  >
                    {step.id}. {step.title}
                    {completion.progress > 0 && completion.progress < 100 && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-400/50 rounded-full">
                        <div 
                          className="h-full bg-blue-400 rounded-full transition-all duration-300"
                          style={{ width: `${completion.progress}%` }}
                        />
                      </div>
                    )}
                  </button>
                  
                  {index < wizardSteps.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-slate-600 mx-1" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
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
            
            <GlobalHeader />
            
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-amber-400 via-orange-300 to-purple-400 bg-clip-text text-transparent">
              Create Your Adventure
            </h1>
            
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Step-by-step wizard to create immersive experiences without programming
            </p>

            {/* DEBUG: Current step indicator */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 space-y-2">
                <div className="px-3 py-1 bg-slate-800/50 rounded text-xs text-slate-400">
                  🔧 DEBUG: Step {currentStep}/5 | URL: {isHydrated && typeof window !== 'undefined' ? (window.location.pathname + window.location.search) : '/builder?step=' + currentStep}
                </div>
                
                <div className="flex items-center gap-2 justify-center flex-wrap">
                  <span className="text-xs text-slate-500">Direct URLs:</span>
                  {[1, 2, 3, 4, 5].map(step => (
                    <button
                      key={step}
                      onClick={() => {
                        const url = `/builder?step=${step}`
                        if (typeof window !== 'undefined') {
                          navigator.clipboard.writeText(window.location.origin + url)
                          alert(`URL copied: ${window.location.origin + url}`)
                        }
                      }}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        step === currentStep 
                          ? 'bg-amber-600 text-white' 
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                      title={`Copy URL for step ${step}`}
                    >
                      📋 {step}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-xs text-slate-500">Data:</span>
                  <div className="flex items-center gap-1 text-xs text-emerald-400">
                    💾 Auto-saved ({isHydrated ? (adventureData.title || 'Untitled') : 'Loading...'})
                  </div>
                  <button
                    onClick={clearSavedData}
                    className="px-2 py-1 rounded text-xs bg-red-600 text-white hover:bg-red-500 transition-colors"
                    title="Clear saved data and restart"
                  >
                    🗑️ Reset
                  </button>
                </div>
              </div>
            )}
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
              const completion = getStepCompletion(step)
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <motion.button 
                        onClick={() => navigateToStep(step.id)}
                        className={`relative mb-3 p-4 rounded-full transition-all duration-300 cursor-pointer ${
                          isActive 
                            ? 'bg-amber-500 ring-4 ring-amber-500/30 scale-110 shadow-2xl' 
                            : isCompleted 
                            ? 'bg-emerald-500 shadow-xl hover:bg-emerald-400'
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                        whileHover={{ scale: isActive ? 1.15 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title={`Go to ${step.title}`}
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
                      </motion.button>
                      
                      <div className="text-center max-w-24">
                        <div className={`text-sm font-bold mb-1 ${
                          isActive ? 'text-amber-300' : isCompleted ? 'text-emerald-300' : 'text-slate-500'
                        }`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-slate-500 leading-tight">
                          {step.description}
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs text-slate-600">⏱️ {step.estimatedTime}</span>
                            {completion.progress > 0 && (
                              <span className={`text-xs ${completion.isCompleted ? 'text-emerald-400' : 'text-blue-400'}`}>
                                {completion.completedFields}/{completion.totalFields} ✓
                              </span>
                            )}
                          </div>
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
                      onChange={(e) => updateAdventureData({ ...adventureData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                    {isHydrated && adventureData.title && (
                      <p className="text-emerald-400 text-sm mt-2">
                        ✨ Great title! This will be displayed prominently to participants
                      </p>
                    )}
                  </div>

                  {/* Selected Theme Preview */}
                  {adventureData.theme && (() => {
                    const selectedTheme = allThemes.find(theme => theme.id === adventureData.theme)
                    if (!selectedTheme) return null
                    
                    return (
                      <div className="p-6 rounded-xl border border-amber-500/30 bg-amber-500/5">
                        <h4 className="text-lg font-bold text-amber-200 mb-3 flex items-center gap-2">
                          <Palette className="h-5 w-5" />
                          Selected Theme
                        </h4>
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-20 h-20 rounded-xl overflow-hidden border-2 border-amber-500/30"
                            style={{
                              backgroundImage: selectedTheme.profileImage ? `url(${selectedTheme.profileImage})` : 'none',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              background: selectedTheme.profileImage ? 'none' : `linear-gradient(135deg, ${selectedTheme.palette?.[0] || '#666'}, ${selectedTheme.palette?.[1] || '#444'})`
                            }}
                          >
                            {!selectedTheme.profileImage && (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="text-2xl">🎨</div>
                              </div>
                            )}
                          </div>
                          <div>
                            <h5 className="text-white font-semibold text-lg">{selectedTheme.name}</h5>
                            <p className="text-slate-400 text-sm">{selectedTheme.description}</p>
                            {adventureType && (
                              <p className="text-amber-400 text-xs mt-1">
                                Perfect for {adventureType} adventures
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })()}

                  {/* Theme Carousel */}
                  <div>
                    <h3 className="text-xl font-semibold text-slate-300 mb-6">
                      Adventure Themes
                      <span className="text-sm text-slate-500 font-normal ml-2">
                        ({filteredThemes.length} total)
                        {adventureType && (
                          <span className="text-amber-400 ml-2">
                            • Filtered for {adventureType} adventures
                          </span>
                        )}
                      </span>
                    </h3>
                    
                    {/* Carousel Container */}
                    <div className="relative overflow-hidden rounded-2xl bg-slate-800/20 p-4" style={{ minHeight: '400px' }}>
                      <motion.div 
                        className="flex transition-transform duration-500 ease-out"
                        style={{ 
                          transform: `translateX(-${currentThemeIndex * (100 / 3)}%)`,
                          width: `${Math.max(filteredThemes.length, 3) * (100 / 3)}%`
                        }}
                      >
                          {filteredThemes.map((theme, index) => {
                            const Icon = theme.icon || Shield
                            const isSelected = adventureData.theme === theme.id
                            
                            return (
                              <div 
                                key={theme.id}
                                className="flex-shrink-0 relative cursor-pointer group px-2"
                                onClick={() => selectTheme(theme.id)}
                                style={{ width: `${100 / 3}%` }}
                              >
                                <div 
                                  className={`relative aspect-square w-full overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-[1.05] shadow-2xl border-2 cursor-pointer ${
                                    theme.isCreateButton
                                      ? 'border-purple-500/50 bg-gradient-to-br from-purple-600/20 to-pink-600/20'
                                      : 'border-slate-600/30 group-hover:border-amber-500/50'
                                  }`}
                                  style={{
                                    backgroundImage: theme.isCreateButton ? 'none' : (theme.profileImage ? `url(${theme.profileImage})` : 'none'),
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    minHeight: '320px',
                                    maxHeight: '400px',
                                    background: theme.isCreateButton ? 'none' : (theme.profileImage ? 'none' : `linear-gradient(135deg, ${theme.palette?.[0] || '#666'}, ${theme.palette?.[1] || '#444'})`)
                                  }}
                                >
                                  {/* Dark Overlay */}
                                  {!theme.isCreateButton && (
                                    <div 
                                      className="absolute inset-0 transition-opacity duration-300"
                                      style={{ 
                                        background: theme.darkOverlay,
                                        opacity: isSelected ? 0.4 : 0.7
                                      }}
                                    />
                                  )}
                                  
                                  {/* Content */}
                                  <div className={`absolute inset-0 flex flex-col ${theme.isCreateButton ? 'justify-center items-center' : 'justify-end'} p-8 text-white`}>
                                    <div className={`${theme.isCreateButton ? 'mb-6' : 'mb-4'}`}>
                                      <Icon className={`h-12 w-12 ${theme.isCreateButton ? 'text-purple-300' : 'text-white/90'} mb-3`} />
                                    </div>
                                    
                                    <h3 className={`text-2xl font-bold mb-2 ${theme.isCreateButton ? 'text-purple-200' : 'text-white'}`}>
                                      {theme.name}
                                    </h3>
                                    
                                    <p className={`text-base leading-relaxed ${theme.isCreateButton ? 'text-purple-300/90' : 'text-white/90'}`}>
                                      {theme.description}
                                    </p>
                                  </div>
                                  
                                  {/* Selection Indicator */}
                                  {isSelected && !theme.isCreateButton && (
                                    <motion.div 
                                      className="absolute top-4 right-4 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      <div className="w-3 h-3 bg-white rounded-full" />
                                    </motion.div>
                                  )}
                                  
                                  {/* Custom Theme Badge */}
                                  {theme.isCustom && (
                                    <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                      AI
                                    </div>
                                  )}
                                  
                                  {/* Start Adventure Indicator */}
                                  {!theme.isCreateButton && (
                                    <motion.div
                                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                                      initial={{ opacity: 0 }}
                                      whileHover={{ opacity: 1 }}
                                    >
                                      <div className="text-center">
                                        <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                          <div className="w-6 h-6 bg-white rounded-full" />
                                        </div>
                                        <p className="text-white font-bold text-lg">Start Adventure</p>
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </motion.div>
                      
                      {/* Navigation Arrows */}
                      <button
                        onClick={prevTheme}
                        disabled={currentThemeIndex === 0}
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 border ${
                          currentThemeIndex === 0 
                            ? 'bg-slate-800/50 border-slate-600/30 cursor-not-allowed' 
                            : 'bg-slate-800/90 hover:bg-slate-700/90 hover:scale-110 border-slate-600/50'
                        }`}
                        aria-label="Previous theme"
                      >
                        <ChevronLeft className={`h-6 w-6 ${currentThemeIndex === 0 ? 'text-slate-500' : 'text-amber-300'}`} />
                      </button>
                      
                      <button
                        onClick={nextTheme}
                        disabled={currentThemeIndex > filteredThemes.length - 3}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 border ${
                          currentThemeIndex > filteredThemes.length - 3
                            ? 'bg-slate-800/50 border-slate-600/30 cursor-not-allowed' 
                            : 'bg-slate-800/90 hover:bg-slate-700/90 hover:scale-110 border-slate-600/50'
                        }`}
                        aria-label="Next theme"
                      >
                        <ChevronRight className={`h-6 w-6 ${currentThemeIndex > filteredThemes.length - 3 ? 'text-slate-500' : 'text-amber-300'}`} />
                      </button>
                      
                      {/* Dots Indicator */}
                      <div className="flex justify-center mt-6 gap-2">
                        {Array.from({ length: Math.max(1, filteredThemes.length - 2) }, (_, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              const maxIndex = Math.max(0, filteredThemes.length - 3)
                              const centeredIndex = Math.max(0, Math.min(index, maxIndex))
                              setCurrentThemeIndex(centeredIndex)
                              if (filteredThemes[index + 1]) {
                                updateAdventureData({ 
                                  ...adventureData, 
                                  theme: filteredThemes[index + 1].id,
                                  customColors: filteredThemes[index + 1]?.colors
                                })
                              }
                            }}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                              index === currentThemeIndex 
                                ? 'bg-amber-400 w-6' 
                                : 'bg-slate-600 hover:bg-slate-500'
                            }`}
                            aria-label={`Go to theme ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI Theme Builder */}
                  <div className="p-6 rounded-xl border border-purple-500/30 bg-purple-500/5 mt-8">
                    <h4 className="text-lg font-bold text-purple-200 mb-3 flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      AI Theme Generator
                    </h4>
                    <p className="text-slate-400 text-sm mb-4">
                      Design unique and personalized themes using artificial intelligence
                    </p>
                    
                    <CustomThemeBuilder 
                      onThemeGenerated={handleCustomThemeCreated}
                      selectedTheme={adventureData.theme}
                    />
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

                  {/* Selected Theme Display */}
                  {adventureData.theme && (() => {
                    const selectedTheme = allThemes.find(theme => theme.id === adventureData.theme)
                    if (!selectedTheme) return null
                    
                    return (
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-slate-300 mb-4 text-center">
                          Selected Adventure Theme
                        </h3>
                        <div className="flex justify-center">
                          <div className="relative w-64 h-40 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/30">
                            {selectedTheme.profileImage ? (
                              <img
                                src={selectedTheme.profileImage}
                                alt={selectedTheme.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div 
                                className="w-full h-full flex items-center justify-center"
                                style={{
                                  background: `linear-gradient(135deg, ${selectedTheme.palette?.[0] || '#666'}, ${selectedTheme.palette?.[1] || '#444'})`
                                }}
                              >
                                <div className="text-center text-white">
                                  <div className="text-4xl mb-2">🎨</div>
                                  <div className="text-sm font-semibold">{selectedTheme.name}</div>
                                </div>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                              <h4 className="text-white font-bold text-lg">{selectedTheme.name}</h4>
                              <p className="text-white/80 text-sm">{selectedTheme.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })()}

                  {/* Story Options */}
                  <div className="grid grid-cols-1 gap-6">
                    
                    {/* Pre-made Stories */}
                    <div>
                      <h3 className="text-xl font-semibold text-slate-300 mb-4">Pre-made Stories</h3>
                      <div className="space-y-4">
                        {allPremadeStories
                          .filter(story => {
                            // Filter by adventure type if specified
                            if (adventureType) {
                              const allowedThemes = getThemesForAdventureType(adventureType)
                              if (allowedThemes.length > 0 && !allowedThemes.includes(story.theme)) {
                                return false
                              }
                            }
                            // Filter by selected theme - only show stories that match the selected theme
                            if (adventureData.theme && story.theme !== adventureData.theme) {
                              return false
                            }
                            return true
                          })
                          .map((story) => (
                          <motion.div
                            key={story.id}
                            className={`w-full p-6 rounded-xl border transition-all duration-200 ${
                              adventureData.narrative === story.id
                                ? 'border-purple-400 bg-purple-500/10 ring-2 ring-purple-500/20'
                                : 'border-slate-600 bg-slate-800/40 hover:border-purple-500/50'
                            }`}
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex items-start gap-4">
                              <div className="relative w-40 h-32 rounded-lg overflow-hidden bg-slate-700/50 flex-shrink-0">
                                {story.image ? (
                                  <img
                                    src={story.image}
                                    alt={story.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <BookOpen className="h-6 w-6 text-purple-300" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-bold text-slate-200 mb-2">{story.title}</h4>
                                <p className="text-slate-400 text-sm mb-3">{story.description}</p>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                  <span>⏱️ {story.duration} min</span>
                                  <span>📍 {story.scenes} scenes</span>
                                  <span className="capitalize">🎭 {story.theme}</span>
                                </div>
                                <div className="flex gap-2 mt-4">
                                  <button
                                    onClick={() => setAdventureData({ 
                                      ...adventureData, 
                                      narrative: story.id,
                                      storyType: 'premade' 
                                    })}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                      adventureData.narrative === story.id
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    }`}
                                  >
                                    {adventureData.narrative === story.id ? 'Selected' : 'Select'}
                                  </button>
                                  <button
                                    onClick={() => window.open(`/story/${story.id}`, '_blank')}
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-all duration-200 border border-blue-500/30"
                                  >
                                    View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
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
                        onClick={() => {
                          generateAIStory().catch(error => {
                            console.error('Error generating AI story:', error)
                            alert('Story generation failed. Please try again.')
                          })
                        }}
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
                          <AIGenerating 
                            message="Generating Story..."
                            size="sm"
                            className="text-white"
                          />
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
                      Choose predefined roles or design unique characters with AI
                    </p>
                  </div>

                  {/* AI Character Designer */}
                  <div className="p-6 rounded-xl border border-purple-500/30 bg-purple-500/5 mb-8">
                    <h4 className="text-lg font-bold text-purple-200 mb-3 flex items-center gap-2">
                      <Wand2 className="h-5 w-5" />
                      AI Character Designer
                    </h4>
                    <p className="text-slate-400 text-sm mb-4">
                      Chat with AI to create unique and personalized characters for your adventure
                    </p>
                    
                    <CharacterChatDesigner 
                      onCharacterGenerated={handleCustomCharacterCreated}
                      selectedTheme={adventureData.theme}
                      existingRoles={adventureData.roles || []}
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-slate-300 mb-3">Filter by category</h4>
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
                      Available Characters 
                      <span className="text-sm text-slate-500 font-normal">
                        ({filteredCharacters.length} total)
                      </span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredCharacters.map((role) => (
                        <motion.div
                          key={role.id}
                          className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer relative ${
                            (adventureData.roles as string[] || []).includes(role.id)
                              ? `border-${role.color}-400 bg-${role.color}-500/10 ring-2 ring-${role.color}-500/20`
                              : `border-slate-600 bg-slate-800/40 hover:border-${role.color}-500/50`
                          }`}
                          onClick={() => {
                            const currentRoles = adventureData.roles as string[] || []
                            const roles = currentRoles.includes(role.id)
                              ? currentRoles.filter(r => r !== role.id)
                              : [...currentRoles, role.id]
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
                                      +{role.perks.length - 2} more
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
                  {(adventureData.roles?.length || 0) > 0 && (
                    <motion.div 
                      className="p-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="text-emerald-200 font-semibold mb-2">
                        ✅ {adventureData.roles?.length || 0} roles selected
                      </div>
                      <div className="text-emerald-300 text-sm mb-3">
                        Players will be able to choose from these roles when joining the adventure
                      </div>
                      
                      {/* Selected Roles List */}
                      <div className="flex flex-wrap gap-2">
                        {(adventureData.roles || []).map(roleId => {
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

              {/* STEP 4: ADVENTURE ACTIVITIES (NEW MODULAR DESIGN) */}
              {currentStep === 4 && (
                <AdventureActivitiesBuilder 
                  adventureData={adventureData}
                  updateAdventureData={updateAdventureData}
                />
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
            className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors min-h-[44px] ${
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
                onClick={() => {
                  handleCreateAdventure().catch(error => {
                    console.error('Error creating adventure:', error)
                    alert('Adventure creation failed. Please try again.')
                  })
                }}
                disabled={!adventureData.title?.trim() || !adventureData.theme || isCreatingAdventure}
                className={`w-full sm:w-auto px-8 py-3 text-lg font-bold shadow-xl transition-all min-h-[44px] ${
                  !adventureData.title?.trim() || !adventureData.theme || isCreatingAdventure
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
                disabled={currentStep === 1 && !adventureData.title?.trim()}
                className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-all min-h-[44px] ${
                  currentStep === 1 && !adventureData.title?.trim()
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
              {isHydrated && adventureData.title && (
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
                    {adventureData.roles?.length || 0} available
                  </div>
                </div>
                
                <div>
                  <div className="text-slate-500">Challenges</div>
                  <div className="text-slate-200 font-semibold">
                    {(adventureData.challenges?.length || 0)} challenges
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
                    {(adventureData.customThemes?.length || 0) > 0 && (
                      <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="text-xs text-purple-400 mb-2">Custom AI Themes Generated</div>
                        <div className="space-y-2">
                          {(adventureData.customThemes || []).map((theme, index) => (
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

                      {/* Selected Premade Story Image */}
                      {adventureData.narrative && adventureData.storyType === 'premade' && (() => {
                        const selectedStory = allPremadeStories.find(story => story.id === adventureData.narrative)
                        if (selectedStory && selectedStory.image) {
                          return (
                            <div className="mt-3">
                              <div className="text-xs text-slate-400 mb-2">Story Preview</div>
                              <div className="relative w-full h-24 rounded-lg overflow-hidden">
                                <img
                                  src={selectedStory.image}
                                  alt={selectedStory.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-2 left-2 right-2">
                                  <div className="text-white text-xs font-medium truncate">{selectedStory.title}</div>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      })()}
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
                {(adventureData.roles?.length || 0) > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-slate-300 border-b border-slate-700 pb-2">Characters & Roles</h4>
                    
                    <div className="p-4 bg-slate-800/40 rounded-lg">
                      <div className="text-xs text-slate-400 mb-3">Selected Roles ({adventureData.roles?.length || 0})</div>
                      <div className="flex flex-wrap gap-2">
                        {(adventureData.roles || []).map(roleId => {
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
                    {(adventureData.customCharacters?.length || 0) > 0 && (
                      <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="text-xs text-purple-400 mb-2">Custom AI Characters Created</div>
                        <div className="space-y-2">
                          {(adventureData.customCharacters || []).map((char, index) => (
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
                {(adventureData.challenges?.length || 0) > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-slate-300 border-b border-slate-700 pb-2">Challenges & Activities</h4>
                    
                    <div className="p-4 bg-slate-800/40 rounded-lg">
                      <div className="text-xs text-slate-400 mb-3">Selected Challenge Types</div>
                      <div className="space-y-2">
                        {(adventureData.challenges || []).map((challenge: any, index: number) => {
                          if (!challenge) return null
                          
                          return (
                            <div key={challenge.id || index} className="flex items-center gap-3">
                              <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                              <div>
                                <div className="text-slate-300 text-sm font-medium">{challenge.name || `Challenge ${index + 1}`}</div>
                                <div className="text-xs text-slate-500">{challenge.type || 'Unknown'} • {challenge.difficulty || 'medium'} • {challenge.points || 0} pts</div>
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

      {/* Adventure Creation Celebration Modal */}
      {createdAdventure && (
        <AdventureCelebrationModal
          isOpen={showCelebrationModal}
          onClose={() => setShowCelebrationModal(false)}
          adventureTitle={createdAdventure.title}
          adventureId={createdAdventure.id}
          status={createdAdventure.status}
          onViewDashboard={() => {
            setShowCelebrationModal(false)
            window.location.href = '/dashboard'
          }}
        />
      )}
    </div>
  )
}

export default function AdventureBuilderPage() {
  return <AdventureBuilderPageContent />
}