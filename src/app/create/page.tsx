'use client'

import React from 'react'
import { 
  ArrowLeft, 
  Search, 
  Key, 
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  Shield
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import CustomThemeModal from '@/components/create/CustomThemeModal'

function CreatePageContent() {
  const searchParams = useSearchParams()
  const adventureType = searchParams.get('type') || 'corporate'
  
  const [adventureTitle, setAdventureTitle] = useState('')
  const [selectedTheme, setSelectedTheme] = useState('')
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0)
  const [isCustomThemeModalOpen, setIsCustomThemeModalOpen] = useState(false)
  const [customThemes, setCustomThemes] = useState<any[]>([])

  const defaultThemes = [
    { 
      id: 'mystery', 
      name: 'Detective Caper', 
      icon: Search, 
      color: 'amber',
      description: 'Solve crimes and mysteries as a skilled sleuth.',
      profileImage: '/images/adventure-profiles/Detective_adventure_profile.png',
      darkOverlay: 'rgba(15, 23, 42, 0.6)',
      palette: ['#2B1B12', '#3B2417', '#C8772A', '#5A3A22']
    },
    { 
      id: 'fantasy', 
      name: 'Enchanted Forest', 
      icon: Key, 
      color: 'emerald',
      description: 'Fairies, ancient magic, and mystical creatures await.',
      profileImage: '/images/adventure-profiles/Enchanted_adventure_profile.png',
      darkOverlay: 'rgba(6, 95, 70, 0.6)',
      palette: ['#0E3B2F', '#1D5C4B', '#2D8B6F', '#E0D48A']
    },
    { 
      id: 'cyber', 
      name: 'Hacker Operation', 
      icon: Shield, 
      color: 'blue',
      description: 'Infiltrate and manipulate a network of servers and codes.',
      profileImage: '/images/adventure-profiles/Hacker_adventure_profile.png',
      darkOverlay: 'rgba(12, 29, 36, 0.6)',
      palette: ['#0C1D24', '#0E2D33', '#1BA7A0', '#0E6F6A']
    },
    { 
      id: 'corporate', 
      name: 'Corporate Challenge', 
      icon: Users, 
      color: 'purple',
      description: 'Team building through professional mysteries.',
      profileImage: '/images/adventure-profiles/Corporate_adventure_profile.png',
      darkOverlay: 'rgba(26, 77, 74, 0.6)',
      palette: ['#1A4D4A', '#2C6D66', '#E4B468', '#F0D6A8']
    }
  ]

  // Get all themes including custom ones and create button
  const allThemes = [
    ...defaultThemes,
    ...customThemes.map(customTheme => ({
      id: customTheme.id,
      name: customTheme.name,
      icon: Shield,
      color: 'custom',
      description: customTheme.description,
      profileImage: customTheme.profileImage,
      darkOverlay: 'rgba(0, 0, 0, 0.6)',
      palette: customTheme.palette,
      isCustom: true
    })),
    // Add create button as a special theme
    {
      id: 'create-custom',
      name: 'Create Custom Theme',
      icon: Plus,
      color: 'purple',
      description: 'Create your own unique adventure theme',
      profileImage: null, // Will be handled specially
      darkOverlay: 'rgba(147, 51, 234, 0.8)',
      palette: ['#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE'],
      isCreateButton: true
    }
  ]

  const nextTheme = () => {
    setCurrentThemeIndex((prev) => {
      const maxIndex = Math.max(0, allThemes.length - 3)
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
    // Handle create button click
    if (themeId === 'create-custom') {
      setIsCustomThemeModalOpen(true)
      return
    }
    
    // Handle adventure start
    setSelectedTheme(themeId)
    
    // Find the index of the selected theme and center it in the carousel
    const themeIndex = allThemes.findIndex(theme => theme.id === themeId)
    if (themeIndex !== -1) {
      // Center the selected theme in the 3-item view
      const maxIndex = Math.max(0, allThemes.length - 3)
      const centeredIndex = Math.max(0, Math.min(themeIndex - 1, maxIndex))
      setCurrentThemeIndex(centeredIndex)
    }
    
    // TODO: Start the adventure with the selected theme
  }

  // Handle dot navigation
  const goToTheme = (index: number) => {
    // Center the selected theme in the 3-item view
    const maxIndex = Math.max(0, allThemes.length - 3)
    const centeredIndex = Math.max(0, Math.min(index - 1, maxIndex))
    setCurrentThemeIndex(centeredIndex)
    if (allThemes[index]) {
      setSelectedTheme(allThemes[index].id)
    }
  }

  const handleCustomThemeCreated = (newTheme: any) => {
    // Add to custom themes list
    setCustomThemes(prev => {
      const updatedThemes = [...prev, newTheme]
      // Automatically navigate to the new theme after state update
      setTimeout(() => {
        const newIndex = defaultThemes.length + updatedThemes.length - 1
        setCurrentThemeIndex(newIndex)
        setSelectedTheme(newTheme.id)
      }, 0)
      return updatedThemes
    })

  }

  // Sync carousel index when selectedTheme changes
  useEffect(() => {
    if (selectedTheme) {
      const themeIndex = allThemes.findIndex(theme => theme.id === selectedTheme)
      if (themeIndex !== -1 && themeIndex !== currentThemeIndex) {
        setCurrentThemeIndex(themeIndex)
      }
    }
  }, [selectedTheme, allThemes, currentThemeIndex])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden" style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)' }}>
      
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(168,85,247,0.2),transparent_60%),radial-gradient(circle_at_70%_60%,rgba(245,158,11,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
      </div>

      {/* Main Content - Modal Style */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-4xl mx-auto">
          
          {/* Modal Container */}
          <motion.div 
            className="bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            
            {/* Header */}
            <div className="text-center p-8 pb-6">
              <motion.h1 
                className="text-4xl sm:text-5xl font-black tracking-tight mb-6 bg-gradient-to-r from-amber-400 via-orange-300 to-purple-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Create Your Adventure
              </motion.h1>
              
              {/* Title Input */}
              <motion.div 
                className="max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <label className="block text-amber-200 text-sm font-semibold mb-3 text-left">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter adventure title..."
                  value={adventureTitle}
                  onChange={(e) => setAdventureTitle(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-800/80 border border-slate-600/50 rounded-xl text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-lg font-medium transition-all duration-200"
                />
              </motion.div>
            </div>
            
            {/* Theme Carousel */}
            <div className="px-8 pb-8">
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                
                {/* Carousel Container */}
                <div className="relative overflow-hidden rounded-2xl bg-slate-800/20 p-4" style={{ minHeight: '400px' }}>
                  <motion.div 
                    className="flex transition-transform duration-500 ease-out"
                    style={{ 
                      transform: `translateX(-${currentThemeIndex * (100 / 3)}%)`,
                      width: `${allThemes.length * (100 / 3)}%`
                    }}
                  >
                    {allThemes.map((theme, index) => {
                      const Icon = theme.icon
                      const isSelected = selectedTheme === theme.id
                      const isCreateButton = 'isCreateButton' in theme ? theme.isCreateButton : false
                      
                      return (
                        <div 
                          key={theme.id}
                          className="flex-shrink-0 relative cursor-pointer group px-2"
                          onClick={() => selectTheme(theme.id)}
                          style={{ width: `${100 / 3}%` }}
                        >
                          <div 
                            className={`relative aspect-square w-full overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-[1.05] shadow-2xl border-2 cursor-pointer ${
                              isCreateButton 
                                ? 'border-purple-500/50 bg-gradient-to-br from-purple-600/20 to-pink-600/20' 
                                : 'border-slate-600/30 group-hover:border-amber-500/50'
                            }`}
                            style={{
                              backgroundImage: isCreateButton ? 'none' : `url(${theme.profileImage})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              minHeight: '320px',
                              maxHeight: '400px'
                            }}
                          >
                            {/* Dark Overlay */}
                            {!isCreateButton && (
                              <div 
                                className="absolute inset-0 transition-opacity duration-300"
                                style={{ 
                                  background: theme.darkOverlay,
                                  opacity: isSelected ? 0.4 : 0.7
                                }}
                              />
                            )}
                            
                            {/* Content */}
                            <div className={`absolute inset-0 flex flex-col ${isCreateButton ? 'justify-center items-center' : 'justify-end'} p-8 text-white`}>
                              <div className={`${isCreateButton ? 'mb-6' : 'mb-4'}`}>
                                <Icon className={`h-12 w-12 ${isCreateButton ? 'text-purple-300' : 'text-white/90'} mb-3`} />
                              </div>
                              
                              <h3 className={`text-2xl font-bold mb-2 ${isCreateButton ? 'text-purple-200' : 'text-white'}`}>
                                {theme.name}
                              </h3>
                              
                              <p className={`text-base leading-relaxed ${isCreateButton ? 'text-purple-300/90' : 'text-white/90'}`}>
                                {theme.description}
                              </p>
                            </div>
                            
                            {/* Selection Indicator */}
                            {isSelected && !isCreateButton && (
                              <motion.div 
                                className="absolute top-4 right-4 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="w-3 h-3 bg-white rounded-full" />
                              </motion.div>
                            )}
                            
                            {/* Start Adventure Indicator */}
                            {!isCreateButton && (
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
                </div>
                
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
                  disabled={currentThemeIndex > allThemes.length - 3}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 border ${
                    currentThemeIndex > allThemes.length - 3
                      ? 'bg-slate-800/50 border-slate-600/30 cursor-not-allowed' 
                      : 'bg-slate-800/90 hover:bg-slate-700/90 hover:scale-110 border-slate-600/50'
                  }`}
                  aria-label="Next theme"
                >
                  <ChevronRight className={`h-6 w-6 ${currentThemeIndex > allThemes.length - 3 ? 'text-slate-500' : 'text-amber-300'}`} />
                </button>
                
                {/* Dots Indicator */}
                <div className="flex justify-center mt-6 gap-2">
                  {allThemes.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToTheme(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentThemeIndex 
                          ? 'bg-amber-400 w-6' 
                          : 'bg-slate-600 hover:bg-slate-500'
                      }`}
                      aria-label={`Go to theme ${index + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
              
            </div>
          </motion.div>
          
          {/* Back Button */}
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <Link 
              href="/adventure-selection"
              className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Adventure Selection
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Custom Theme Modal */}
      <CustomThemeModal
        isOpen={isCustomThemeModalOpen}
        onClose={() => setIsCustomThemeModalOpen(false)}
        onThemeCreated={handleCustomThemeCreated}
      />
    </div>
  )
}

export default function CreatePage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(168,85,247,0.2),transparent_60%),radial-gradient(circle_at_70%_60%,rgba(245,158,11,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
        </div>

        {/* Loading Content */}
        <div className="relative z-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            {/* Animated Logo/Icon */}
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-purple-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-gradient-to-r from-amber-400 to-purple-400 rounded-full animate-spin"></div>
                <div className="absolute inset-4 bg-slate-900 rounded-full flex items-center justify-center">
                  <Search className="h-6 w-6 text-amber-300 animate-bounce" />
                </div>
              </div>
            </div>

            {/* Loading Text */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-300 to-purple-400 bg-clip-text text-transparent">
                Creating Your Mystery
              </h1>
              <p className="text-slate-300 text-lg">
                Loading adventure builder...
              </p>
            </div>

            {/* Loading Animation */}
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-amber-400 rounded-full animate-bounce"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '0.6s'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="mt-8 w-64 mx-auto">
              <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-purple-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-slate-400 text-sm mt-2">Initializing components...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <CreatePageContent />
    </React.Suspense>
  )
}