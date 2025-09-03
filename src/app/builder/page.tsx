'use client'

import { 
  ArrowLeft, 
  ArrowRight,
  Search, 
  Eye, 
  Users,
  Trophy,
  Settings,
  Palette,
  BookOpen,
  MapPin,
  Shield,
  Wand2,
  Crown,
  Sword,
  Sparkles,
  Camera,
  Mic,
  Puzzle,
  Clock,
  Gift,
  Lock,
  Key,
  Smartphone
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function AdventureBuilderPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [adventureData, setAdventureData] = useState({
    // Step 1: Theme
    theme: '',
    customColors: {
      primary: '#f59e0b',
      secondary: '#8b5cf6',
      accent: '#10b981'
    },
    
    // Step 2: Narrative  
    narrative: '',
    storyType: '',
    aiGenerated: false,
    branchingPoints: 2,
    
    // Step 3: Roles
    roles: [] as string[],
    
    // Step 4: Challenges
    challengeTypes: [] as string[],
    qrLocations: [] as string[],
    
    // Step 5: Rewards & Security
    ranking: 'public',
    rewards: [] as string[],
    accessMode: 'private',
    deviceLimits: 1
  })

  // Wizard steps according to mindmap
  const wizardSteps = [
    { id: 1, title: 'Tema', description: 'Seleccionar plantilla o crear tema personalizado', icon: Palette },
    { id: 2, title: 'Narrativa', description: 'Elegir historia prehecha o generar nueva con IA', icon: BookOpen },
    { id: 3, title: 'Roles', description: 'Definir roles disponibles y perks', icon: Users },
    { id: 4, title: 'Retos', description: 'Seleccionar tipos de retos y generar códigos QR', icon: MapPin },
    { id: 5, title: 'Premios y Seguridad', description: 'Establecer ranking, recompensas y accesos', icon: Shield }
  ]

  // Themes from mindmap (fantasía, misterio, corporativo, sci-fi, educativo)
  const themes = [
    {
      id: 'fantasy',
      name: 'Bosque Encantado',
      description: 'Hadas, duendes y criaturas mágicas',
      colors: { primary: '#8b5cf6', secondary: '#06b6d4', accent: '#10b981' },
      preview: '🧚‍♀️ Una aventura mágica llena de criaturas místicas...'
    },
    {
      id: 'mystery',
      name: 'Operación Hacker',
      description: 'Espionaje corporativo y códigos secretos',
      colors: { primary: '#f59e0b', secondary: '#ef4444', accent: '#6366f1' },
      preview: '🕵️ Infiltra la corporación y descubre los secretos...'
    },
    {
      id: 'detective',
      name: 'Juego de Detectives',
      description: 'Resolver crímenes y encontrar pistas',
      colors: { primary: '#64748b', secondary: '#f59e0b', accent: '#dc2626' },
      preview: '🔍 Un crimen ha ocurrido, encuentra al culpable...'
    },
    {
      id: 'corporate',
      name: 'Desafío Corporativo',
      description: 'Team building profesional',
      colors: { primary: '#0ea5e9', secondary: '#22c55e', accent: '#f59e0b' },
      preview: '💼 Colabora con tu equipo para resolver desafíos...'
    },
    {
      id: 'educational',
      name: 'Aventura Educativa',
      description: 'Aprendizaje gamificado',
      colors: { primary: '#10b981', secondary: '#8b5cf6', accent: '#f59e0b' },
      preview: '📚 Aprende mientras resuelves misterios educativos...'
    }
  ]

  // Pre-made stories from mindmap
  const preMadeStories = [
    {
      id: 'enchanted_forest',
      title: 'El Bosque Encantado',
      theme: 'fantasy',
      description: 'Las criaturas mágicas han perdido sus poderes. Ayúdalas a recuperarlos.',
      duration: 45,
      scenes: 8
    },
    {
      id: 'hacker_operation',
      title: 'Operación Hacker',
      theme: 'mystery',
      description: 'Infiltra la corporación corrupta y expone sus secretos antes de que sea tarde.',
      duration: 60,
      scenes: 10
    },
    {
      id: 'detective_game',
      title: 'El Detective del Museo',
      theme: 'detective',
      description: 'Una valiosa obra de arte ha desaparecido. Encuentra las pistas y atrapa al ladrón.',
      duration: 50,
      scenes: 12
    }
  ]

  // Adventure roles with perks (from mindmap)
  const adventureRoles = [
    {
      id: 'wizard',
      name: 'Mago',
      emoji: '🧙‍♂️',
      description: 'Maestro de los misterios arcanos',
      perks: ['Pistas adicionales', 'Multiplicador x1.2', 'Visión mágica'],
      color: 'purple',
      maxPlayers: 2
    },
    {
      id: 'warrior',
      name: 'Guerrero',
      emoji: '⚔️',
      description: 'Líder valiente del grupo',
      perks: ['Más puntos por rapidez', 'Liderazgo de equipo', 'Resistencia extra'],
      color: 'red',
      maxPlayers: 3
    },
    {
      id: 'detective',
      name: 'Detective',
      emoji: '🕵️',
      description: 'Investigador experto en pistas',
      perks: ['Análisis avanzado', 'Detección de fraude', 'Intuición especial'],
      color: 'amber',
      maxPlayers: 2
    },
    {
      id: 'scholar',
      name: 'Erudito',
      emoji: '📚',
      description: 'Conocedor de secretos antiguos',
      perks: ['Conocimiento bonus', 'Traducción de pistas', 'Sabiduría ancestral'],
      color: 'emerald',
      maxPlayers: 3
    }
  ]

  // Challenge types from mindmap
  const challengeTypes = [
    {
      id: 'trivia',
      name: 'Trivia Generada por IA',
      description: 'Preguntas dinámicas adaptadas al tema',
      icon: Eye,
      color: 'purple'
    },
    {
      id: 'photo',
      name: 'Foto-Prueba con IA',
      description: 'Validación visual de objetos específicos',
      icon: Camera,
      color: 'amber'
    },
    {
      id: 'audio',
      name: 'Audio Secreto',
      description: 'Pistas sonoras y reconocimiento de voz',
      icon: Mic,
      color: 'emerald'
    },
    {
      id: 'collaborative',
      name: 'Puzzles Colaborativos',
      description: 'Desafíos que requieren trabajo en equipo',
      icon: Users,
      color: 'red'
    }
  ]

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
              Crear Tu Aventura
            </h1>
            
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Asistente paso a paso para crear experiencias inmersivas sin programación
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
                      Paso 1: Tema Visual
                    </h2>
                    <p className="text-slate-400">
                      Elige una plantilla temática o personaliza tu propia experiencia visual
                    </p>
                  </div>

                  {/* Theme Templates */}
                  <div>
                    <h3 className="text-xl font-semibold text-slate-300 mb-6">Plantillas Preconfiguradas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {themes.map((theme) => (
                        <motion.button
                          key={theme.id}
                          onClick={() => setAdventureData({ 
                            ...adventureData, 
                            theme: theme.id,
                            customColors: theme.colors 
                          })}
                          className={`p-6 rounded-xl border transition-all duration-200 text-left ${
                            adventureData.theme === theme.id
                              ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-500/20'
                              : 'border-slate-600 bg-slate-800/40 hover:border-amber-500/50'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <h4 className="text-lg font-bold text-slate-200 mb-2">{theme.name}</h4>
                          <p className="text-slate-400 text-sm mb-3">{theme.description}</p>
                          <div className="text-xs text-slate-500 italic">
                            {theme.preview}
                          </div>
                          
                          {/* Color Preview */}
                          <div className="flex items-center gap-2 mt-4">
                            <div 
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: theme.colors.primary }}
                            ></div>
                            <div 
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: theme.colors.secondary }}
                            ></div>
                            <div 
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: theme.colors.accent }}
                            ></div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Theme Option */}
                  <div className="p-6 rounded-xl border border-purple-500/30 bg-purple-500/5">
                    <h4 className="text-lg font-bold text-purple-200 mb-3 flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Constructor de Temas Personalizado
                    </h4>
                    <p className="text-slate-400 text-sm mb-4">
                      Crea tu propio tema personalizado con colores, fuentes y fondos únicos
                    </p>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition-colors">
                      <Wand2 className="h-4 w-4" />
                      Próximamente
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: NARRATIVA */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-purple-200 mb-3 flex items-center justify-center gap-3">
                      <BookOpen className="h-8 w-8" />
                      Paso 2: Narrativa e Historia
                    </h2>
                    <p className="text-slate-400">
                      Selecciona una historia predefinida o genera una nueva con IA
                    </p>
                  </div>

                  {/* Story Options */}
                  <div className="grid grid-cols-1 gap-6">
                    
                    {/* Pre-made Stories */}
                    <div>
                      <h3 className="text-xl font-semibold text-slate-300 mb-4">Historias Prehechas</h3>
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
                                  <span>📍 {story.scenes} escenas</span>
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
                        IA Generativa de Historias
                      </h4>
                      <p className="text-slate-400 text-sm mb-4">
                        La IA crea una narrativa completa basada en tus parámetros (tema, tono, duración)
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <select className="px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg text-slate-300">
                          <option>Tono: Aventurero</option>
                          <option>Tono: Misterioso</option>
                          <option>Tono: Educativo</option>
                          <option>Tono: Corporativo</option>
                        </select>
                        
                        <select className="px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg text-slate-300">
                          <option>Duración: Corta</option>
                          <option>Duración: Mediana</option>
                          <option>Duración: Larga</option>
                        </select>
                      </div>
                      
                      <button 
                        onClick={() => setAdventureData({ 
                          ...adventureData, 
                          narrative: 'ai_generated',
                          storyType: 'ai',
                          aiGenerated: true 
                        })}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        Generar con IA
                      </button>
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
                      Paso 3: Roles y Personajes
                    </h2>
                    <p className="text-slate-400">
                      Define los roles disponibles y sus habilidades especiales
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {adventureRoles.map((role) => (
                      <motion.div
                        key={role.id}
                        className={`p-6 rounded-xl border transition-all duration-200 cursor-pointer ${
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
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{role.emoji}</div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-slate-200 mb-2">{role.name}</h4>
                            <p className="text-slate-400 text-sm mb-3">{role.description}</p>
                            
                            <div className="space-y-2">
                              <div className="text-xs text-slate-500 font-semibold">Perks especiales:</div>
                              <div className="space-y-1">
                                {role.perks.map((perk, index) => (
                                  <div key={index} className={`text-xs text-${role.color}-300 flex items-center gap-2`}>
                                    <div className={`h-1.5 w-1.5 rounded-full bg-${role.color}-400`}></div>
                                    {perk}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mt-3 text-xs text-slate-500">
                              Máximo {role.maxPlayers} jugadores
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {adventureData.roles.length > 0 && (
                    <motion.div 
                      className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="text-emerald-200 font-semibold mb-2">
                        ✅ {adventureData.roles.length} roles seleccionados
                      </div>
                      <div className="text-emerald-300 text-sm">
                        Los jugadores podrán elegir entre estos roles al unirse a la aventura
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
                      Paso 4: Retos y Códigos QR
                    </h2>
                    <p className="text-slate-400">
                      Configura los tipos de desafíos y genera códigos QR seguros
                    </p>
                  </div>

                  {/* Challenge Types Selection */}
                  <div>
                    <h3 className="text-xl font-semibold text-slate-300 mb-6">Tipos de Retos</h3>
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
                      Generación de Códigos QR
                    </h4>
                    <p className="text-slate-400 text-sm mb-4">
                      Los códigos QR se generarán automáticamente con firmas HMAC para prevenir fraude
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Número de QRs</label>
                        <input 
                          type="number" 
                          min="3" 
                          max="20" 
                          defaultValue="8"
                          className="w-full px-3 py-2 bg-slate-800/80 border border-slate-600 rounded text-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">Duración (horas)</label>
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
                      Paso 5: Premios y Seguridad
                    </h2>
                    <p className="text-slate-400">
                      Configura recompensas, acceso y medidas de seguridad
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Ranking & Rewards */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-slate-300">Ranking y Premios</h3>
                      
                      <div>
                        <label className="block text-sm text-slate-400 mb-3">Visibilidad del Ranking</label>
                        <div className="space-y-2">
                          {[
                            { id: 'public', label: 'Público en tiempo real' },
                            { id: 'final', label: 'Solo al final' },
                            { id: 'hidden', label: 'Oculto siempre' }
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
                        <label className="block text-sm text-slate-400 mb-3">Recompensas Digitales</label>
                        <div className="space-y-2">
                          {[
                            { id: 'badges', label: 'Badges y certificados' },
                            { id: 'nft', label: 'NFTs coleccionables (beta)' },
                            { id: 'points', label: 'Sistema de puntos' }
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
                      <h3 className="text-lg font-semibold text-slate-300">Seguridad y Acceso</h3>
                      
                      <div>
                        <label className="block text-sm text-slate-400 mb-3">Modo de Acceso</label>
                        <div className="space-y-2">
                          {[
                            { id: 'private', label: 'Privado (solo por invitación)', icon: Lock },
                            { id: 'public', label: 'Público (código de acceso)', icon: Key }
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
                        <label className="block text-sm text-slate-400 mb-3">Límite de Dispositivos</label>
                        <select 
                          value={adventureData.deviceLimits}
                          onChange={(e) => setAdventureData({ ...adventureData, deviceLimits: parseInt(e.target.value) })}
                          className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600 rounded-lg text-slate-300"
                        >
                          <option value={1}>1 dispositivo por usuario</option>
                          <option value={2}>2 dispositivos por usuario</option>
                          <option value={3}>3 dispositivos por usuario</option>
                          <option value={0}>Sin límite</option>
                        </select>
                      </div>

                      {/* MFA Option */}
                      <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="text-red-500" />
                          <Shield className="h-4 w-4 text-red-400" />
                          <span className="text-red-200 font-semibold">Autenticación Multifactor</span>
                        </label>
                        <p className="text-slate-400 text-xs mt-2 ml-7">
                          Para anfitriones y usuarios con permisos avanzados
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
              Anterior
            </button>
            
            {currentStep === 5 ? (
              <Link 
                href="/dashboard"
                onClick={() => alert('🎉 ¡Aventura creada exitosamente!\n\nEn producción, esto se guardaría en Supabase y generaría los QR codes.')}
                className="btn-primary px-8 py-3 text-lg font-bold shadow-xl hover:shadow-emerald-500/40"
              >
                <Trophy className="h-6 w-6" />
                Crear Aventura
              </Link>
            ) : (
              <button
                onClick={nextStep}
                className="btn-primary px-6 py-3"
              >
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </motion.div>

          {/* Preview Panel */}
          <motion.div 
            className="mt-12 card p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <h3 className="text-lg font-bold text-purple-200 mb-4">Vista Previa de la Aventura</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div>
                <div className="text-slate-500">Tema</div>
                <div className="text-slate-200 font-semibold capitalize">
                  {adventureData.theme || 'No seleccionado'}
                </div>
              </div>
              
              <div>
                <div className="text-slate-500">Narrativa</div>
                <div className="text-slate-200 font-semibold">
                  {adventureData.narrative ? 'Configurada' : 'Pendiente'}
                </div>
              </div>
              
              <div>
                <div className="text-slate-500">Roles</div>
                <div className="text-slate-200 font-semibold">
                  {adventureData.roles.length} disponibles
                </div>
              </div>
              
              <div>
                <div className="text-slate-500">Retos</div>
                <div className="text-slate-200 font-semibold">
                  {adventureData.challengeTypes.length} tipos
                </div>
              </div>
              
              <div>
                <div className="text-slate-500">Acceso</div>
                <div className="text-slate-200 font-semibold capitalize">
                  {adventureData.accessMode}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}