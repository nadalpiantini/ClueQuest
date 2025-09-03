'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Palette, 
  Wand2, 
  Sparkles, 
  Eye, 
  Download,
  RefreshCw,
  Settings,
  Zap,
  Brush,
  Layers,
  Type,
  Image as ImageIcon
} from 'lucide-react'

interface GeneratedTheme {
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
  }
  gradients: {
    hero: string
    card: string
    button: string
  }
  fonts: {
    heading: string
    body: string
    accent: string
  }
  imagery: {
    style: string
    suggestions: string[]
  }
  animations: {
    style: string
    duration: string
    easing: string
  }
  category: string
  moodBoard: string[]
}

interface CustomThemeBuilderProps {
  onThemeGenerated: (theme: { id: string, name: string, colors: any, gradients?: any, fonts?: any }) => void
  selectedTheme?: string
}

export default function CustomThemeBuilder({ onThemeGenerated, selectedTheme }: CustomThemeBuilderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTheme, setGeneratedTheme] = useState<GeneratedTheme | null>(null)
  
  const [formData, setFormData] = useState({
    description: '',
    style: 'dark',
    targetAudience: 'adults',
    moodKeywords: [] as string[],
    industryContext: '',
    customRequirements: ''
  })

  const [currentKeyword, setCurrentKeyword] = useState('')

  const styleOptions = [
    { id: 'dark', name: 'Dark & Mysterious', emoji: '🌙', description: 'Colores oscuros y atmosféricos' },
    { id: 'minimalist', name: 'Minimal & Clean', emoji: '✨', description: 'Diseño limpio y espacios abiertos' },
    { id: 'vibrant', name: 'Vibrant & Energetic', emoji: '⚡', description: 'Colores brillantes y dinámicos' },
    { id: 'corporate', name: 'Corporate & Professional', emoji: '💼', description: 'Elegante y empresarial' },
    { id: 'gaming', name: 'Gaming & Futuristic', emoji: '🎮', description: 'Tecnológico y futurista' },
    { id: 'elegant', name: 'Elegant & Sophisticated', emoji: '👑', description: 'Refinado y lujoso' },
    { id: 'retro', name: 'Retro & Vintage', emoji: '📻', description: 'Nostálgico y vintage' },
    { id: 'nature', name: 'Natural & Organic', emoji: '🌿', description: 'Inspirado en la naturaleza' }
  ]

  const audienceOptions = [
    { id: 'adults', name: 'Adultos (25-45)', description: 'Profesionales y adultos' },
    { id: 'young-adults', name: 'Jóvenes (18-25)', description: 'Universitarios y jóvenes profesionales' },
    { id: 'teens', name: 'Adolescentes (13-18)', description: 'Estudiantes de secundaria' },
    { id: 'families', name: 'Familias', description: 'Padres e hijos juntos' },
    { id: 'corporate', name: 'Corporativo', description: 'Equipos de trabajo y empresas' },
    { id: 'gamers', name: 'Gamers', description: 'Entusiastas de videojuegos' }
  ]

  const addKeyword = () => {
    if (currentKeyword.trim() && formData.moodKeywords.length < 8 && !formData.moodKeywords.includes(currentKeyword.trim())) {
      setFormData({
        ...formData,
        moodKeywords: [...formData.moodKeywords, currentKeyword.trim()]
      })
      setCurrentKeyword('')
    }
  }

  const removeKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      moodKeywords: formData.moodKeywords.filter(k => k !== keyword)
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword()
    }
  }

  const generateTheme = async () => {
    if (!formData.description.trim() || formData.moodKeywords.length === 0) {
      alert('Por favor completa la descripción y agrega al menos una palabra clave de ambiente')
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch('/api/ai/theme-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to generate theme')
      }

      const data = await response.json()
      setGeneratedTheme(data.theme)
      setStep(3) // Move to preview step
      
    } catch (error) {
      console.error('Theme generation error:', error)
      alert('Error al generar el tema. Por favor inténtalo de nuevo.')
    }

    setIsGenerating(false)
  }

  const applyTheme = () => {
    if (generatedTheme) {
      const themeForBuilder = {
        id: `custom_${Date.now()}`,
        name: generatedTheme.name,
        colors: generatedTheme.colors,
        gradients: generatedTheme.gradients,
        fonts: generatedTheme.fonts,
        category: generatedTheme.category,
        description: generatedTheme.description,
        isCustom: true
      }
      onThemeGenerated(themeForBuilder)
      setIsOpen(false)
      resetForm()
    }
  }

  const resetForm = () => {
    setStep(1)
    setFormData({
      description: '',
      style: 'dark',
      targetAudience: 'adults',
      moodKeywords: [],
      industryContext: '',
      customRequirements: ''
    })
    setGeneratedTheme(null)
  }

  return (
    <>
      {/* Theme Builder Trigger */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-purple-500/30"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Palette className="h-4 w-4" />
        Crear Tema Personalizado
        <Sparkles className="h-4 w-4 animate-pulse" />
      </motion.button>

      {/* Theme Builder Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Container */}
            <motion.div 
              className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden mx-2 sm:mx-4"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                    <Wand2 className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Custom Theme Builder</h3>
                    <p className="text-xs sm:text-sm text-slate-400">Diseña tu tema perfecto con IA</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {generatedTheme && (
                    <button
                      onClick={resetForm}
                      className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Steps Indicator */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-700">
                <div className="flex items-center justify-center space-x-4 sm:space-x-8">
                  {[
                    { num: 1, title: 'Descripción', icon: Brush },
                    { num: 2, title: 'Estilo & Audiencia', icon: Settings },
                    { num: 3, title: 'Preview & Apply', icon: Eye }
                  ].map((stepItem) => {
                    const Icon = stepItem.icon
                    const isActive = step === stepItem.num
                    const isCompleted = step > stepItem.num
                    
                    return (
                      <div key={stepItem.num} className="flex items-center">
                        <div className={`flex items-center gap-2 ${
                          isActive ? 'text-purple-300' : isCompleted ? 'text-emerald-300' : 'text-slate-500'
                        }`}>
                          <div className={`p-2 rounded-full ${
                            isActive 
                              ? 'bg-purple-500 text-white' 
                              : isCompleted 
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-700 text-slate-400'
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium hidden sm:block">{stepItem.title}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-4 sm:p-6 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 220px)' }}>
                <AnimatePresence mode="wait">
                  {/* Step 1: Description */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      className="space-y-6"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="text-center mb-6">
                        <h4 className="text-lg font-bold text-white mb-2">Describe tu tema ideal</h4>
                        <p className="text-slate-400">Cuéntanos cómo quieres que se vea y se sienta tu aventura</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                          Descripción del tema *
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Ej: Un mundo mágico con colores místicos y elementos de fantasía oscura, inspirado en cuentos de hadas góticos con toques de elegancia medieval..."
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          rows={4}
                          maxLength={300}
                        />
                        <div className="text-xs text-slate-500 mt-1">
                          {formData.description.length}/300 caracteres
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-3">
                          Palabras clave de ambiente *
                        </label>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={currentKeyword}
                              onChange={(e) => setCurrentKeyword(e.target.value)}
                              onKeyPress={handleKeyPress}
                              placeholder="Ej: misterioso, elegante, futurista..."
                              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                              maxLength={50}
                            />
                            <button
                              onClick={addKeyword}
                              disabled={!currentKeyword.trim() || formData.moodKeywords.length >= 8}
                              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 disabled:text-slate-400 text-white rounded text-sm font-medium transition-colors"
                            >
                              Agregar
                            </button>
                          </div>
                          
                          {formData.moodKeywords.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {formData.moodKeywords.map((keyword) => (
                                <span
                                  key={keyword}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/30"
                                >
                                  {keyword}
                                  <button
                                    onClick={() => removeKeyword(keyword)}
                                    className="hover:text-purple-100 transition-colors"
                                  >
                                    ✕
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <div className="text-xs text-slate-500">
                            {formData.moodKeywords.length}/8 palabras clave
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Style & Audience */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      className="space-y-6"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="text-center mb-6">
                        <h4 className="text-lg font-bold text-white mb-2">Estilo y audiencia</h4>
                        <p className="text-slate-400">Personaliza el enfoque y la dirección visual</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-3">
                          Estilo visual
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                          {styleOptions.map((style) => (
                            <motion.button
                              key={style.id}
                              onClick={() => setFormData({ ...formData, style: style.id })}
                              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                                formData.style === style.id
                                  ? 'border-purple-400 bg-purple-500/10'
                                  : 'border-slate-600 bg-slate-800/40 hover:border-purple-500/50'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="text-2xl mb-2">{style.emoji}</div>
                              <div className="text-sm font-bold text-slate-200 mb-1">{style.name}</div>
                              <div className="text-xs text-slate-400">{style.description}</div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-3">
                          Audiencia objetivo
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {audienceOptions.map((audience) => (
                            <motion.button
                              key={audience.id}
                              onClick={() => setFormData({ ...formData, targetAudience: audience.id })}
                              className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                                formData.targetAudience === audience.id
                                  ? 'border-purple-400 bg-purple-500/10'
                                  : 'border-slate-600 bg-slate-800/40 hover:border-purple-500/50'
                              }`}
                              whileHover={{ scale: 1.01 }}
                            >
                              <div className="text-sm font-bold text-slate-200 mb-1">{audience.name}</div>
                              <div className="text-xs text-slate-400">{audience.description}</div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                          Contexto adicional (opcional)
                        </label>
                        <textarea
                          value={formData.industryContext}
                          onChange={(e) => setFormData({ ...formData, industryContext: e.target.value })}
                          placeholder="Ej: Empresa de tecnología, evento corporativo, escape room temático..."
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          rows={2}
                          maxLength={100}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Preview & Apply */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      className="space-y-6"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {generatedTheme ? (
                        <>
                          <div className="text-center mb-6">
                            <h4 className="text-lg font-bold text-white mb-2">{generatedTheme.name}</h4>
                            <p className="text-slate-400">{generatedTheme.description}</p>
                          </div>

                          {/* Color Preview */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="space-y-3">
                              <h5 className="text-sm font-semibold text-slate-300">Colores Principales</h5>
                              {Object.entries(generatedTheme.colors).map(([key, color]) => (
                                <div key={key} className="flex items-center gap-3">
                                  <div 
                                    className="w-8 h-8 rounded-lg border border-slate-600"
                                    style={{ backgroundColor: color }}
                                  ></div>
                                  <div>
                                    <div className="text-xs font-medium text-slate-300 capitalize">{key}</div>
                                    <div className="text-xs text-slate-500 font-mono">{color}</div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="space-y-3">
                              <h5 className="text-sm font-semibold text-slate-300">Tipografías</h5>
                              <div className="space-y-2">
                                <div>
                                  <div className="text-xs text-slate-400">Títulos</div>
                                  <div className="text-sm font-bold text-slate-200" style={{ fontFamily: generatedTheme.fonts.heading }}>
                                    {generatedTheme.fonts.heading}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-slate-400">Texto</div>
                                  <div className="text-sm text-slate-200" style={{ fontFamily: generatedTheme.fonts.body }}>
                                    {generatedTheme.fonts.body}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h5 className="text-sm font-semibold text-slate-300">Mood Board</h5>
                              <div className="flex flex-wrap gap-1">
                                {generatedTheme.moodBoard.map((mood, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs"
                                  >
                                    {mood}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Preview Card */}
                          <div 
                            className="p-6 rounded-xl border-2 transition-all duration-300"
                            style={{ 
                              background: generatedTheme.gradients.card,
                              borderColor: generatedTheme.colors.primary + '40',
                              color: generatedTheme.colors.text
                            }}
                          >
                            <h6 
                              className="text-xl font-bold mb-3"
                              style={{ 
                                color: generatedTheme.colors.primary,
                                fontFamily: generatedTheme.fonts.heading 
                              }}
                            >
                              Vista Previa del Tema
                            </h6>
                            <p className="text-sm mb-4" style={{ fontFamily: generatedTheme.fonts.body }}>
                              Este es un ejemplo de cómo se vería tu tema aplicado en la interfaz de la aventura.
                            </p>
                            <div className="flex gap-3">
                              <button
                                className="px-4 py-2 rounded-lg font-semibold text-sm transition-all"
                                style={{ 
                                  background: generatedTheme.gradients.button,
                                  color: 'white'
                                }}
                              >
                                Botón Principal
                              </button>
                              <button
                                className="px-4 py-2 rounded-lg font-semibold text-sm border transition-all"
                                style={{ 
                                  borderColor: generatedTheme.colors.secondary,
                                  color: generatedTheme.colors.secondary
                                }}
                              >
                                Botón Secundario
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-12">
                          <div className="inline-flex items-center gap-2 text-purple-300">
                            <Sparkles className="h-5 w-5 animate-spin" />
                            <span>Generando tu tema personalizado...</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-t border-slate-700">
                <button
                  onClick={step === 1 ? () => setIsOpen(false) : () => setStep(step - 1)}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-200 rounded-lg font-medium transition-colors"
                >
                  {step === 1 ? 'Cancelar' : 'Anterior'}
                </button>

                <div className="flex items-center gap-3">
                  {step < 3 ? (
                    <button
                      onClick={step === 1 ? () => setStep(2) : generateTheme}
                      disabled={
                        (step === 1 && (!formData.description.trim() || formData.moodKeywords.length === 0)) ||
                        (step === 2 && isGenerating)
                      }
                      className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all"
                    >
                      {step === 2 && isGenerating ? (
                        <>
                          <Sparkles className="h-4 w-4 animate-spin" />
                          Generando...
                        </>
                      ) : step === 2 ? (
                        <>
                          <Wand2 className="h-4 w-4" />
                          Generar Tema
                        </>
                      ) : (
                        <>
                          Siguiente
                          <Zap className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  ) : (
                    generatedTheme && (
                      <button
                        onClick={applyTheme}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-lg font-semibold transition-all"
                      >
                        <Download className="h-4 w-4" />
                        Usar Este Tema
                      </button>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}