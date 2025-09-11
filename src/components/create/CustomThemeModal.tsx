'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Sparkles, 
  Loader2, 
  Image as ImageIcon,
  Palette,
  Wand2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { GenerateAdventureImageRequest, GenerateAdventureImageResponse } from '@/app/api/generate-adventure-image/route'

interface CustomTheme {
  id: string
  name: string
  description: string
  profileImage: string
  palette: string[]
  isCustom: true
}

interface CustomThemeModalProps {
  isOpen: boolean
  onClose: () => void
  onThemeCreated: (theme: CustomTheme) => void
}

export default function CustomThemeModal({ 
  isOpen, 
  onClose, 
  onThemeCreated 
}: CustomThemeModalProps) {
  const [step, setStep] = useState(1) // 1: Form, 2: Generating, 3: Preview
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    content: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTheme, setGeneratedTheme] = useState<CustomTheme | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError(null)
  }

  const generateTheme = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      setError('Please fill in theme name and description')
      return
    }

    setIsGenerating(true)
    setStep(2)
    setError(null)

    try {
      console.log('🎨 Starting custom theme generation...')
      
      const requestData: GenerateAdventureImageRequest = {
        customContent: formData.content.trim() || formData.description.trim(),
        customName: formData.name.trim(),
        customDescription: formData.description.trim(),
        seed: Math.floor(Math.random() * 1000000)
      }

      const response = await fetch('/api/generate-adventure-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const data: GenerateAdventureImageResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate theme image')
      }

      if (!data.imageUrl || !data.themeConfig) {
        throw new Error('Incomplete response from server')
      }

      // Create custom theme object
      const customTheme: CustomTheme = {
        id: `custom_${Date.now()}`,
        name: data.themeConfig.name,
        description: data.themeConfig.description,
        profileImage: data.imageUrl,
        palette: data.themeConfig.palette,
        isCustom: true
      }

      console.log('✅ Custom theme generated:', customTheme)
      setGeneratedTheme(customTheme)
      setStep(3)

    } catch (error) {
      console.error('❌ Theme generation error:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
      setStep(1)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUseTheme = () => {
    if (generatedTheme) {
      onThemeCreated(generatedTheme)
      handleClose()
    }
  }

  const handleClose = () => {
    setStep(1)
    setFormData({ name: '', description: '', content: '' })
    setGeneratedTheme(null)
    setError(null)
    setIsGenerating(false)
    onClose()
  }

  const isFormValid = formData.name.trim() && formData.description.trim()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl mx-4 bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Wand2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Create Custom Theme</h2>
                  <p className="text-sm text-slate-400">Generate a unique adventure theme</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
                disabled={isGenerating}
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Step 1: Form */}
              {step === 1 && (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      Theme Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Space Adventure, Medieval Quest..."
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-slate-200 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-lg font-medium transition-all duration-200"
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      Theme Description
                    </label>
                    <textarea
                      placeholder="Describe your adventure theme... e.g., Explore distant galaxies and solve cosmic mysteries..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-slate-200 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 h-24 resize-none"
                      maxLength={200}
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      This will be used to generate your unique theme image
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      Custom Scene (Optional)
                    </label>
                    <textarea
                      placeholder="Describe specific visual elements... e.g., astronaut looking at distant planets, alien ruins in background..."
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-slate-200 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 h-20 resize-none"
                      maxLength={300}
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      Leave blank to auto-generate from description
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Generating */}
              {step === 2 && (
                <motion.div
                  className="py-12 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                      <Loader2 className="w-16 h-16 text-purple-400 animate-spin" />
                      <ImageIcon className="absolute inset-0 m-auto w-6 h-6 text-purple-300" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    Generating Your Theme
                  </h3>
                  <p className="text-slate-400 mb-6">
                    AI is creating a unique image for "{formData.name}"...
                  </p>

                  <div className="w-64 mx-auto">
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-slate-500 text-sm mt-2">This may take 30-60 seconds</p>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Preview */}
              {step === 3 && generatedTheme && (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                      <h3 className="text-lg font-bold text-emerald-300">
                        Theme Generated Successfully!
                      </h3>
                    </div>
                  </div>

                  {/* Preview Card */}
                  <div className="relative">
                    <div 
                      className="relative h-64 rounded-2xl overflow-hidden"
                      style={{
                        backgroundImage: `url(${generatedTheme.profileImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div 
                        className="absolute inset-0"
                        style={{ 
                          background: 'rgba(0, 0, 0, 0.5)'
                        }}
                      />
                      
                      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                        <h3 className="text-xl font-bold mb-2">
                          {generatedTheme.name}
                        </h3>
                        <p className="text-white/90 text-sm">
                          {generatedTheme.description}
                        </p>
                      </div>
                    </div>

                    {/* Color Palette */}
                    <div className="flex items-center gap-2 mt-4">
                      <Palette className="h-4 w-4 text-slate-400" />
                      <div className="flex gap-2">
                        {generatedTheme.palette.map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border border-slate-600"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-slate-700/50">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-slate-400 hover:text-slate-300 transition-colors"
                disabled={isGenerating}
              >
                Cancel
              </button>

              <div className="flex gap-3">
                {step === 1 && (
                  <button
                    onClick={generateTheme}
                    disabled={!isFormValid}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      isFormValid
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-purple-500/25 hover:scale-105'
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                    Generate Theme
                  </button>
                )}

                {step === 3 && generatedTheme && (
                  <>
                    <button
                      onClick={() => setStep(1)}
                      className="px-4 py-2 text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      Generate Another
                    </button>
                    <button
                      onClick={handleUseTheme}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Use This Theme
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}