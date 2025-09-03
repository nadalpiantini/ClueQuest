'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronRight, SkipForward, Volume2, VolumeX, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ADVENTURE_THEMES } from '@/types/adventure'
import Image from 'next/image'

interface StorySegment {
  id: string
  text: string
  media?: {
    type: 'image' | 'video' | 'audio'
    url: string
    alt?: string
  }
  duration: number // milliseconds for auto-advance
  skipAfter?: number // allow skip after this time
}

export default function IntroStoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionCode = searchParams.get('session')
  const isGuest = searchParams.get('guest') === 'true'

  const [adventure, setAdventure] = useState<any>(null)
  const [storySegments, setStorySegments] = useState<StorySegment[]>([])
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [canSkip, setCanSkip] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)

  // Load adventure data and generate story
  useEffect(() => {
    loadAdventureStory()
  }, [sessionCode])

  // Progress and auto-advance logic
  useEffect(() => {
    if (!isPlaying || currentSegmentIndex >= storySegments.length) return

    const currentSegment = storySegments[currentSegmentIndex]
    if (!currentSegment) return

    let startTime = Date.now()
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const segmentProgress = Math.min((elapsed / currentSegment.duration) * 100, 100)
      setProgress(segmentProgress)

      // Enable skip after skipAfter time
      if (currentSegment.skipAfter && elapsed > currentSegment.skipAfter) {
        setCanSkip(true)
      }

      // Auto-advance to next segment
      if (elapsed >= currentSegment.duration) {
        advanceToNextSegment()
      }
    }, 50)

    return () => clearInterval(progressInterval)
  }, [currentSegmentIndex, isPlaying, storySegments])

  const loadAdventureStory = async () => {
    try {
      // Mock adventure data - in real app, fetch from API
      const adventureData = {
        id: '1',
        title: 'The Enchanted Forest Quest',
        theme: 'fantasy' as const,
        description: 'Embark on a magical journey through an ancient forest filled with mystical creatures and hidden treasures.',
        story_data: {},
        settings: {
          allow_guest_users: true,
          language_support: ['en', 'es']
        }
      }

      setAdventure(adventureData)

      // Generate AI-adapted story segments based on user interaction patterns
      const segments = await generateStorySegments(adventureData, userInteracted)
      setStorySegments(segments)
      
      // Enable skip after 3 seconds for impatient users
      setTimeout(() => setCanSkip(true), 3000)
    } catch (error) {
      console.error('Failed to load adventure story:', error)
      // Fallback to role selection if story fails
      router.push(`/role-selection?session=${sessionCode}`)
    }
  }

  const generateStorySegments = async (adventure: { theme: 'educational' | 'fantasy' | 'corporate' | 'mystery' | 'scifi'; title: string }, isImpatientUser: boolean): Promise<StorySegment[]> => {
    // AI adaptation: shorter segments for impatient users
    const baseDuration = isImpatientUser ? 3000 : 5000
    const theme = ADVENTURE_THEMES[adventure.theme]

    return [
      {
        id: '1',
        text: `Welcome to ${adventure.title}. Long ago, in a realm where magic flows like rivers and ancient trees whisper secrets...`,
        media: {
          type: 'image',
          url: '/images/fantasy/enchanted-forest-intro.jpg',
          alt: 'Mystical forest with glowing trees'
        },
        duration: baseDuration,
        skipAfter: 2000
      },
      {
        id: '2', 
        text: 'A darkness has begun to spread, threatening to consume all the magic in the land. Only a brave group of adventurers can restore the balance.',
        media: {
          type: 'image',
          url: '/images/fantasy/dark-shadow.jpg',
          alt: 'Dark shadows spreading over a magical landscape'
        },
        duration: baseDuration,
        skipAfter: 2000
      },
      {
        id: '3',
        text: 'You have been chosen for this quest. Each of you possesses unique abilities that will be crucial to success. Are you ready to accept this destiny?',
        media: {
          type: 'image',
          url: '/images/fantasy/chosen-heroes.jpg',
          alt: 'Silhouettes of heroes against a magical backdrop'
        },
        duration: baseDuration,
        skipAfter: 2000
      },
      {
        id: '4',
        text: 'Your adventure begins now. Choose your role wisely, for the fate of the realm rests in your hands.',
        duration: baseDuration,
        skipAfter: 1500
      }
    ]
  }

  const advanceToNextSegment = () => {
    if (currentSegmentIndex < storySegments.length - 1) {
      setCurrentSegmentIndex(prev => prev + 1)
      setProgress(0)
      setCanSkip(false)
    } else {
      // Story complete, move to role selection
      completeIntroStory()
    }
  }

  const skipToEnd = () => {
    setUserInteracted(true)
    completeIntroStory()
  }

  const completeIntroStory = () => {
    // Save that intro was viewed
    localStorage.setItem('cluequest_intro_viewed', 'true')
    
    // Navigate to role selection
    if (sessionCode) {
      router.push(`/role-selection?session=${sessionCode}${isGuest ? '&guest=true' : ''}`)
    } else {
      router.push(`/role-selection${isGuest ? '?guest=true' : ''}`)
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev)
  }

  const toggleAudio = () => {
    setAudioEnabled(prev => !prev)
    // TODO: Control background audio
  }

  if (!adventure || storySegments.length === 0) {
    return (
      <div className="min-h-screen center-flex bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p>Loading your adventure...</p>
        </div>
      </div>
    )
  }

  const currentSegment = storySegments[currentSegmentIndex]
  const theme = ADVENTURE_THEMES[adventure.theme as keyof typeof ADVENTURE_THEMES]

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
      }}
    >
      {/* Background Media */}
      <AnimatePresence mode="wait">
        {currentSegment?.media && (
          <motion.div
            key={currentSegment.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {currentSegment.media.type === 'image' && (
              <Image
                src={currentSegment.media.url}
                alt={currentSegment.media.alt || ''}
                fill
                className="object-cover"
                priority
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header Controls */}
        <div className="flex justify-between items-center p-4 pt-safe">
          {/* Progress */}
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <span>{currentSegmentIndex + 1}</span>
            <span>/</span>
            <span>{storySegments.length}</span>
          </div>

          {/* Audio Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAudio}
              className="text-white/80 hover:text-white hover:bg-white/10 touch-target"
            >
              {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlayPause}
              className="text-white/80 hover:text-white hover:bg-white/10 touch-target"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-2">
          <Progress 
            value={progress} 
            className="h-1 bg-white/20"
          />
        </div>

        {/* Story Content */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSegment.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ 
                duration: 0.6,
                ease: 'easeOut'
              }}
              className="text-center max-w-2xl mx-auto"
            >
              <p 
                className="text-lg sm:text-xl lg:text-2xl text-white leading-relaxed text-balance"
                style={{ fontFamily: theme.fonts.body }}
              >
                {currentSegment.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Controls */}
        <div className="p-6 pb-safe">
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            
            {/* Skip Button */}
            <AnimatePresence>
              {canSkip && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Button
                    variant="ghost"
                    onClick={skipToEnd}
                    className="text-white/70 hover:text-white hover:bg-white/10 touch-target"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Skip Story
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Continue Button */}
            <motion.div
              animate={{
                scale: canSkip ? [1, 1.05, 1] : 1,
                transition: {
                  duration: 2,
                  repeat: canSkip ? Infinity : 0,
                  ease: "easeInOut"
                }
              }}
            >
              <Button
                onClick={advanceToNextSegment}
                className="bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white/50 text-white backdrop-blur-sm touch-target-lg"
              >
                {currentSegmentIndex === storySegments.length - 1 ? (
                  <div className="flex items-center gap-2">
                    <span>Begin Quest</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Continue</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Tap Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-center mt-4"
          >
            <p className="text-xs text-white/50">
              Tap anywhere to advance or wait for auto-continue
            </p>
          </motion.div>
        </div>
      </div>

      {/* Tap to Advance Overlay */}
      <div 
        className="absolute inset-0 z-5"
        onClick={advanceToNextSegment}
      />
    </div>
  )
}