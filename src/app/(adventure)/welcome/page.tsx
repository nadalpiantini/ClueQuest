'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Globe2, Sparkles, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/types/adventure'
import { useDemoAuth } from '@/components/auth/demo-auth-provider'

interface WelcomePageProps {
  searchParams: { session?: string; adventure?: string }
}

export default function WelcomePage({ searchParams }: WelcomePageProps) {
  const router = useRouter()
  const { isDemoAuthenticated, logout: demoLogout } = useDemoAuth()
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(SUPPORTED_LANGUAGES[0])
  const [isLoading, setIsLoading] = useState(false)
  const [adventure, setAdventure] = useState<any>(null)

  // Dynamic adventure content based on theme
  const getThemeContent = () => {
    if (!adventure) {
      return {
        title: 'Welcome to ClueQuest',
        subtitle: 'Your Adventure Awaits',
        description: 'Get ready for an unforgettable interactive experience that blends the physical and digital worlds.',
        backgroundClass: 'from-blue-600 via-purple-600 to-teal-600',
        icon: Sparkles
      }
    }

    switch (adventure.theme) {
      case 'fantasy':
        return {
          title: 'Enter the Mystical Realm',
          subtitle: adventure.title,
          description: 'Embark on a magical journey filled with ancient secrets and mystical creatures.',
          backgroundClass: 'from-purple-600 via-pink-600 to-yellow-500',
          icon: Sparkles
        }
      case 'mystery':
        return {
          title: 'The Investigation Begins',
          subtitle: adventure.title,
          description: 'Uncover hidden clues and solve puzzling mysteries in this thrilling detective adventure.',
          backgroundClass: 'from-gray-800 via-red-900 to-amber-600',
          icon: Globe2
        }
      case 'corporate':
        return {
          title: 'Team Challenge Awaits',
          subtitle: adventure.title,
          description: 'Collaborate with your team to overcome challenges and achieve excellence together.',
          backgroundClass: 'from-blue-600 via-green-600 to-cyan-500',
          icon: Globe2
        }
      case 'scifi':
        return {
          title: 'Mission Briefing',
          subtitle: adventure.title,
          description: 'The future depends on your actions. Prepare for an adventure beyond the stars.',
          backgroundClass: 'from-cyan-400 via-purple-500 to-pink-500',
          icon: Sparkles
        }
      case 'educational':
        return {
          title: 'Learning Adventure',
          subtitle: adventure.title,
          description: 'Discover, learn, and grow through interactive challenges and engaging activities.',
          backgroundClass: 'from-green-500 via-blue-500 to-purple-600',
          icon: Globe2
        }
      default:
        return {
          title: 'Welcome to ClueQuest',
          subtitle: 'Your Adventure Awaits',
          description: 'Get ready for an unforgettable interactive experience.',
          backgroundClass: 'from-blue-600 via-purple-600 to-teal-600',
          icon: Sparkles
        }
    }
  }

  const themeContent = getThemeContent()
  const ThemeIcon = themeContent.icon

  useEffect(() => {
    // Load adventure data if session/adventure ID provided
    if (searchParams.adventure) {
      // TODO: Fetch adventure data from API
      setAdventure({
        id: searchParams.adventure,
        title: 'The Enchanted Quest',
        theme: 'fantasy'
      })
    }
  }, [searchParams])

  const handleEnterAdventure = async () => {
    setIsLoading(true)
    try {
      // Save language preference
      localStorage.setItem('cluequest_language', selectedLanguage.code)
      
      // Navigate to login screen with session data
      if (searchParams.session) {
        router.push(`/login?session=${searchParams.session}&lang=${selectedLanguage.code}`)
      } else {
        router.push(`/login?lang=${selectedLanguage.code}`)
      }
    } catch (error) {
      console.error('Navigation error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLanguageChange = (langCode: string) => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === langCode)
    if (language) {
      setSelectedLanguage(language)
      // TODO: Update UI text dynamically based on language
    }
  }

  const handleLogout = () => {
    demoLogout()
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${themeContent.backgroundClass}`} />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-24 h-24 bg-white/8 rounded-full blur-lg"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 text-white">
        
        {/* Language Selector and Logout */}
        <div className="absolute top-8 right-4 z-20 flex items-center gap-4">
          {/* Language Selector */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Select value={selectedLanguage.code} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="flex items-center gap-2">
                      <span>{lang.flag_emoji}</span>
                      <span>{lang.native_name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Logout Button */}
          {isDemoAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </motion.div>
          )}
        </div>

        {/* Main Content */}
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.8, 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto bg-white/20 rounded-full center-flex backdrop-blur-sm">
              <ThemeIcon className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-balance"
          >
            {themeContent.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl sm:text-2xl lg:text-3xl font-light mb-6 text-white/90 text-balance"
          >
            {themeContent.subtitle}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed text-balance"
          >
            {themeContent.description}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Button
              onClick={handleEnterAdventure}
              disabled={isLoading}
              size="lg"
              className="group bg-white/20 hover:bg-white/30 border-2 border-white/30 hover:border-white/50 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 touch-target-lg px-12 py-4 text-xl font-semibold rounded-full shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Loading...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span>Enter Adventure</span>
                  <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </Button>
          </motion.div>

          {/* Adventure Info Badge (if available) */}
          <AnimatePresence>
            {adventure && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium text-white/90 backdrop-blur-sm"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Adventure Session Active</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-0 right-0 text-center"
        >
          <p className="text-sm text-white/60">
            Tap to begin your interactive adventure
          </p>
        </motion.div>
      </div>
    </div>
  )
}