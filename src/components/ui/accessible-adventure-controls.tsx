/**
 * Accessible Adventure Controls
 * Enhanced accessibility for adventure interactions with comprehensive ARIA support
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Volume2, VolumeX, Eye, EyeOff, RotateCcw, Settings, 
  Plus, Minus, Pause, Play, SkipForward, HelpCircle
} from 'lucide-react'
import { GamingButton, GamingCard } from './gaming-components'

interface AccessibilitySettings {
  soundEnabled: boolean
  highContrast: boolean
  reducedMotion: boolean
  fontSize: 'small' | 'medium' | 'large' | 'xl'
  screenReaderMode: boolean
  autoplay: boolean
}

interface AccessibleAdventureControlsProps {
  onSettingsChange?: (settings: AccessibilitySettings) => void
  showFloatingControls?: boolean
  className?: string
}

export function AccessibleAdventureControls({
  onSettingsChange,
  showFloatingControls = true,
  className
}: AccessibleAdventureControlsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>({
    soundEnabled: true,
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
    screenReaderMode: false,
    autoplay: true
  })

  const containerRef = useRef<HTMLDivElement>(null)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('cluequest-accessibility')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(parsed)
        onSettingsChange?.(parsed)
      } catch {
        // Invalid saved settings, use defaults
      }
    }
  }, [onSettingsChange])

  // Save settings to localStorage and apply to document
  useEffect(() => {
    localStorage.setItem('cluequest-accessibility', JSON.stringify(settings))
    
    // Apply settings to document
    const root = document.documentElement
    
    // High contrast mode
    if (settings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }
    
    // Font size
    root.classList.remove('font-small', 'font-medium', 'font-large', 'font-xl')
    root.classList.add(`font-${settings.fontSize}`)
    
    onSettingsChange?.(settings)
  }, [settings, onSettingsChange])

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const resetToDefaults = () => {
    const defaults: AccessibilitySettings = {
      soundEnabled: true,
      highContrast: false,
      reducedMotion: false,
      fontSize: 'medium',
      screenReaderMode: false,
      autoplay: true
    }
    setSettings(defaults)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
      // Alt + A to open accessibility controls
      if (e.altKey && e.key === 'a') {
        e.preventDefault()
        setIsOpen(!isOpen)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <>
      {/* Floating Accessibility Button */}
      {showFloatingControls && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-20 left-4 z-50"
        >
          <GamingButton
            onClick={() => setIsOpen(!isOpen)}
            variant="ghost"
            size="lg"
            className="rounded-full shadow-lg bg-slate-800/90 backdrop-blur-sm"
            aria-label="Open accessibility controls (Alt + A)"
            aria-expanded={isOpen}
            aria-controls="accessibility-panel"
          >
            <Settings className="w-6 h-6" />
          </GamingButton>
        </motion.div>
      )}

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed left-4 top-1/2 -translate-y-1/2 z-50 w-80 max-h-[80vh] overflow-y-auto"
              ref={containerRef}
              id="accessibility-panel"
              role="dialog"
              aria-labelledby="accessibility-title"
              aria-modal="true"
            >
              <GamingCard className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 id="accessibility-title" className="text-xl font-bold text-gaming-gold">
                    Accessibility Settings
                  </h2>
                  <GamingButton
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="sm"
                    aria-label="Close accessibility panel"
                  >
                    ✕
                  </GamingButton>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <GamingButton
                      onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                      variant={settings.soundEnabled ? "mystery" : "ghost"}
                      size="sm"
                      className="w-full"
                      aria-pressed={settings.soundEnabled}
                    >
                      {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      Sound
                    </GamingButton>

                    <GamingButton
                      onClick={() => updateSetting('highContrast', !settings.highContrast)}
                      variant={settings.highContrast ? "mystery" : "ghost"}
                      size="sm"
                      className="w-full"
                      aria-pressed={settings.highContrast}
                    >
                      {settings.highContrast ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      Contrast
                    </GamingButton>

                    <GamingButton
                      onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                      variant={settings.reducedMotion ? "mystery" : "ghost"}
                      size="sm"
                      className="w-full"
                      aria-pressed={settings.reducedMotion}
                    >
                      {settings.reducedMotion ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      Motion
                    </GamingButton>

                    <GamingButton
                      onClick={resetToDefaults}
                      variant="outline"
                      size="sm"
                      className="w-full"
                      aria-label="Reset to default settings"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </GamingButton>
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Font Size</h3>
                  <div className="flex items-center gap-3">
                    <GamingButton
                      onClick={() => {
                        const sizes = ['small', 'medium', 'large', 'xl'] as const
                        const currentIndex = sizes.indexOf(settings.fontSize)
                        if (currentIndex > 0) {
                          updateSetting('fontSize', sizes[currentIndex - 1])
                        }
                      }}
                      variant="ghost"
                      size="sm"
                      disabled={settings.fontSize === 'small'}
                      aria-label="Decrease font size"
                    >
                      <Minus className="w-4 h-4" />
                    </GamingButton>

                    <div className="flex-1 text-center">
                      <div className="text-sm text-slate-400">Current size</div>
                      <div className="font-bold text-gaming-gold capitalize">
                        {settings.fontSize}
                      </div>
                    </div>

                    <GamingButton
                      onClick={() => {
                        const sizes = ['small', 'medium', 'large', 'xl'] as const
                        const currentIndex = sizes.indexOf(settings.fontSize)
                        if (currentIndex < sizes.length - 1) {
                          updateSetting('fontSize', sizes[currentIndex + 1])
                        }
                      }}
                      variant="ghost"
                      size="sm"
                      disabled={settings.fontSize === 'xl'}
                      aria-label="Increase font size"
                    >
                      <Plus className="w-4 h-4" />
                    </GamingButton>
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Advanced</h3>
                  
                  <label className="flex items-center gap-3 cursor-pointer touch-target">
                    <input
                      type="checkbox"
                      checked={settings.screenReaderMode}
                      onChange={(e) => updateSetting('screenReaderMode', e.target.checked)}
                      className="w-5 h-5 rounded bg-slate-700 border-2 border-slate-600 checked:bg-gaming-gold checked:border-gaming-gold"
                      aria-describedby="screen-reader-desc"
                    />
                    <div>
                      <div className="font-medium text-white">Screen Reader Mode</div>
                      <div id="screen-reader-desc" className="text-sm text-slate-400">
                        Enhanced descriptions and navigation
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer touch-target">
                    <input
                      type="checkbox"
                      checked={settings.autoplay}
                      onChange={(e) => updateSetting('autoplay', e.target.checked)}
                      className="w-5 h-5 rounded bg-slate-700 border-2 border-slate-600 checked:bg-gaming-gold checked:border-gaming-gold"
                      aria-describedby="autoplay-desc"
                    />
                    <div>
                      <div className="font-medium text-white">Auto-advance</div>
                      <div id="autoplay-desc" className="text-sm text-slate-400">
                        Automatically proceed through adventure steps
                      </div>
                    </div>
                  </label>
                </div>

                {/* Help Text */}
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-600/30">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-gaming-gold flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-slate-300">
                      <strong>Keyboard Shortcuts:</strong>
                      <ul className="mt-2 space-y-1 text-slate-400">
                        <li>• Alt + A: Open accessibility controls</li>
                        <li>• Tab: Navigate between elements</li>
                        <li>• Space/Enter: Activate buttons</li>
                        <li>• Escape: Close dialogs</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </GamingCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

/**
 * Skip Link Component
 * Allows keyboard users to skip to main content
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 
                 bg-gaming-gold text-slate-900 px-4 py-2 rounded-lg font-bold
                 focus:outline-none focus:ring-2 focus:ring-gaming-gold focus:ring-offset-2"
    >
      Skip to main content
    </a>
  )
}

/**
 * Live Region for Dynamic Content Announcements
 */
export function LiveRegion({ children, priority = 'polite' }: { 
  children: React.ReactNode
  priority?: 'polite' | 'assertive' 
}) {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  )
}