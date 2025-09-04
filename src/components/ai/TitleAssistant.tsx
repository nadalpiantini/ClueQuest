'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Users,
  Heart,
  Briefcase,
  GraduationCap,
  Zap,
  Search,
  Smile,
  Clock,
  MapPin,
  Copy,
  Check
} from 'lucide-react'
import AIGenerating from '@/components/ui/ai-loading'

interface TitleSuggestion {
  title: string
  style: string
  reasoning: string
}

interface OnboardingData {
  audience: string
  tone: string
  elements: string[]
  adventureType: string
  duration: number
  maxPlayers: number
  theme: string
}

interface TitleAssistantProps {
  isOpen: boolean
  onClose: () => void
  onTitleSelect: (title: string) => void
  currentData: {
    theme: string
    duration: number
    maxPlayers: number
    adventureType: string
  }
}

export default function TitleAssistant({ isOpen, onClose, onTitleSelect, currentData }: TitleAssistantProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({
    ...currentData
  })
  const [titleSuggestions, setTitleSuggestions] = useState<TitleSuggestion[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedTitleIndex, setCopiedTitleIndex] = useState<number | null>(null)

  const audiences = [
    { id: 'corporate', label: 'Corporate Team', icon: Briefcase, description: 'Professional team building' },
    { id: 'friends', label: 'Friend Group', icon: Users, description: 'Social entertainment' },
    { id: 'family', label: 'Family Event', icon: Heart, description: 'All-ages fun' },
    { id: 'students', label: 'Educational', icon: GraduationCap, description: 'Learning experience' }
  ]

  const tones = [
    { id: 'mysterious', label: 'Mysterious', icon: Search, description: 'Dark, intriguing atmosphere' },
    { id: 'adventurous', label: 'Adventurous', icon: Zap, description: 'Action-packed excitement' },
    { id: 'professional', label: 'Professional', icon: Briefcase, description: 'Business-appropriate' },
    { id: 'fun', label: 'Fun & Playful', icon: Smile, description: 'Light-hearted and engaging' }
  ]

  const elementOptions = [
    'Location-specific clues', 'Time pressure challenges', 'Team collaboration puzzles',
    'Historical themes', 'Technology integration', 'Physical movement required',
    'Logical deduction', 'Creative problem solving', 'Storytelling elements'
  ]

  const generateTitles = useCallback(async () => {
    if (!onboardingData.audience || !onboardingData.tone) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/title-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData)
      })

      if (!response.ok) {
        throw new Error('Failed to generate titles')
      }

      const data = await response.json()
      setTitleSuggestions(data.titles || [])
      setCurrentStep(4)
    } catch (error) {
      console.error('Title generation failed:', error)
      // Fallback titles if API fails
      setTitleSuggestions([
        {
          title: "The Ultimate Mystery Challenge",
          style: "Classic Adventure",
          reasoning: "Timeless appeal that works for any audience"
        },
        {
          title: `${onboardingData.theme === 'corporate' ? 'Corporate' : 'Epic'} Quest Adventure`,
          style: "Theme-Based",
          reasoning: "Directly incorporates selected theme"
        }
      ])
      setCurrentStep(4)
    } finally {
      setIsGenerating(false)
    }
  }, [onboardingData])

  const handleElementToggle = (element: string) => {
    const elements = onboardingData.elements || []
    const newElements = elements.includes(element)
      ? elements.filter(e => e !== element)
      : [...elements, element]
    
    setOnboardingData({ ...onboardingData, elements: newElements })
  }

  const handleTitleCopy = (title: string, index: number) => {
    navigator.clipboard.writeText(title)
    setCopiedTitleIndex(index)
    setTimeout(() => setCopiedTitleIndex(null), 2000)
  }

  const resetAndClose = () => {
    setCurrentStep(1)
    setOnboardingData({ ...currentData })
    setTitleSuggestions([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={resetAndClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-amber-500/30 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-amber-500/10 to-purple-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Sparkles className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-amber-200">AI Title Assistant</h2>
                  <p className="text-sm text-slate-400">Step {currentStep} of {currentStep === 4 ? 4 : 3}</p>
                </div>
              </div>
              <button
                onClick={resetAndClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <AnimatePresence mode="wait">
              {/* Step 1: Audience Selection */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-amber-200 mb-2">Who's your audience?</h3>
                    <p className="text-slate-400 text-sm mb-6">
                      This helps us understand the right tone and complexity level
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {audiences.map((audience) => {
                      const Icon = audience.icon
                      const isSelected = onboardingData.audience === audience.id
                      
                      return (
                        <button
                          key={audience.id}
                          onClick={() => setOnboardingData({ ...onboardingData, audience: audience.id })}
                          className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                            isSelected
                              ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-500/20'
                              : 'border-slate-600 bg-slate-800/40 hover:border-amber-500/50'
                          }`}
                        >
                          <Icon className={`h-6 w-6 mb-3 ${
                            isSelected ? 'text-amber-300' : 'text-slate-400'
                          }`} />
                          <div className={`font-semibold mb-1 ${
                            isSelected ? 'text-amber-200' : 'text-slate-300'
                          }`}>
                            {audience.label}
                          </div>
                          <div className="text-xs text-slate-500">
                            {audience.description}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Tone Selection */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-purple-200 mb-2">What's the vibe?</h3>
                    <p className="text-slate-400 text-sm mb-6">
                      Choose the atmosphere and energy level for your adventure
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tones.map((tone) => {
                      const Icon = tone.icon
                      const isSelected = onboardingData.tone === tone.id
                      
                      return (
                        <button
                          key={tone.id}
                          onClick={() => setOnboardingData({ ...onboardingData, tone: tone.id })}
                          className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                            isSelected
                              ? 'border-purple-400 bg-purple-500/10 ring-2 ring-purple-500/20'
                              : 'border-slate-600 bg-slate-800/40 hover:border-purple-500/50'
                          }`}
                        >
                          <Icon className={`h-6 w-6 mb-3 ${
                            isSelected ? 'text-purple-300' : 'text-slate-400'
                          }`} />
                          <div className={`font-semibold mb-1 ${
                            isSelected ? 'text-purple-200' : 'text-slate-300'
                          }`}>
                            {tone.label}
                          </div>
                          <div className="text-xs text-slate-500">
                            {tone.description}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Elements Selection */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold text-emerald-200 mb-2">Special elements?</h3>
                    <p className="text-slate-400 text-sm mb-6">
                      Select any specific features you want to highlight (optional)
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {elementOptions.map((element) => {
                      const isSelected = (onboardingData.elements || []).includes(element)
                      
                      return (
                        <button
                          key={element}
                          onClick={() => handleElementToggle(element)}
                          className={`p-3 rounded-lg border transition-all duration-200 text-left text-sm ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-500/10 ring-2 ring-emerald-500/20 text-emerald-200'
                              : 'border-slate-600 bg-slate-800/40 hover:border-emerald-500/50 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              isSelected ? 'bg-emerald-400' : 'bg-slate-500'
                            }`} />
                            {element}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  
                  <div className="text-xs text-slate-500 text-center">
                    Select any that apply • You can skip this step
                  </div>
                </motion.div>
              )}

              {/* Step 4: Generated Titles */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {isGenerating ? (
                    <div className="text-center py-12">
                      <AIGenerating 
                        message="Crafting perfect titles..."
                        size="lg"
                        className="mb-6"
                      />
                      <div className="text-slate-400 text-sm">
                        Our AI is analyzing your preferences to create engaging titles
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-lg font-bold text-emerald-200 mb-2">Your AI-Generated Titles</h3>
                        <p className="text-slate-400 text-sm mb-6">
                          Click any title to use it, or get inspired to create your own
                        </p>
                      </div>
                      
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {titleSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-lg bg-slate-800/60 border border-slate-600/30 hover:border-amber-500/30 transition-all duration-200 group"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="text-amber-200 font-semibold mb-1 group-hover:text-amber-100 transition-colors">
                                  {suggestion.title}
                                </h4>
                                <div className="text-xs text-purple-300 mb-2">
                                  {suggestion.style}
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                  {suggestion.reasoning}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleTitleCopy(suggestion.title, index)}
                                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                  title="Copy title"
                                >
                                  {copiedTitleIndex === index ? (
                                    <Check className="h-4 w-4 text-emerald-400" />
                                  ) : (
                                    <Copy className="h-4 w-4 text-slate-400" />
                                  )}
                                </button>
                                
                                <button
                                  onClick={() => {
                                    onTitleSelect(suggestion.title)
                                    resetAndClose()
                                  }}
                                  className="px-3 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold transition-colors"
                                >
                                  Use This
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          {!isGenerating && (
            <div className="p-6 border-t border-slate-700/50 bg-slate-800/30">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : resetAndClose()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {currentStep > 1 ? 'Previous' : 'Cancel'}
                </button>
                
                {currentStep < 3 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={
                      (currentStep === 1 && !onboardingData.audience) ||
                      (currentStep === 2 && !onboardingData.tone)
                    }
                    className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      (currentStep === 1 && !onboardingData.audience) ||
                      (currentStep === 2 && !onboardingData.tone)
                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-600 text-white hover:shadow-amber-500/30 shadow-lg'
                    }`}
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : currentStep === 3 ? (
                  <button
                    onClick={generateTitles}
                    disabled={isGenerating}
                    className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg ${
                      isGenerating 
                        ? 'bg-emerald-600 text-emerald-200 cursor-not-allowed' 
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-emerald-500/30'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="h-4 w-4" />
                        </motion.div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Titles
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={generateTitles}
                    disabled={isGenerating}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                      isGenerating 
                        ? 'bg-purple-600 text-purple-200 cursor-not-allowed' 
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="h-4 w-4" />
                        </motion.div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate More
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}