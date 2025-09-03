'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Wand2, 
  Sparkles, 
  MessageSquare, 
  RefreshCw,
  User,
  Bot,
  Palette,
  Crown,
  Sword
} from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

interface GeneratedCharacter {
  name: string
  emoji: string
  description: string
  perks: string[]
  color: string
  maxPlayers: number
  category: string
  backstory?: string
  personality?: string
  motivation?: string
}

interface CharacterChatDesignerProps {
  onCharacterGenerated: (character: GeneratedCharacter) => void
  selectedTheme?: string
  existingRoles?: string[]
}

export default function CharacterChatDesigner({ 
  onCharacterGenerated, 
  selectedTheme = '',
  existingRoles = []
}: CharacterChatDesignerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      type: 'ai',
      content: `¡Hola! 👋 Soy tu asistente de diseño de personajes. Podemos crear un personaje único para tu aventura ${selectedTheme ? `con temática **${selectedTheme}**` : ''}.\n\n¿Qué tipo de personaje tienes en mente? Puedes describir:\n• Su personalidad y motivaciones\n• Sus habilidades especiales\n• Su apariencia y estilo\n• Su rol en el equipo\n\n¡Empecemos!`,
      timestamp: new Date()
    }
  ])
  const [userInput, setUserInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCharacter, setGeneratedCharacter] = useState<GeneratedCharacter | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!userInput.trim() || isGenerating) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userInput,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setUserInput('')
    setIsGenerating(true)

    try {
      const response = await fetch('/api/ai/character-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userInput,
          conversationHistory: messages.slice(-5), // Last 5 messages for context
          theme: selectedTheme,
          existingRoles
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate response')
      }

      const data = await response.json()
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])

      // If AI generated a complete character, show it
      if (data.character) {
        setGeneratedCharacter(data.character)
      }

    } catch (error) {
      console.error('Chat error:', error)
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Lo siento, hubo un problema con la conexión. ¿Podrías intentar de nuevo? Mientras tanto, puedo sugerir que pienses en qué tipo de personalidad o habilidades te gustaría que tuviera tu personaje.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    }

    setIsGenerating(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const resetChat = () => {
    setMessages([{
      id: 'welcome-reset',
      type: 'ai',
      content: `¡Perfecto! Empecemos de nuevo. 🎭\n\n¿Qué tipo de personaje quieres crear ahora? Podemos explorar diferentes conceptos y personalidades.`,
      timestamp: new Date()
    }])
    setGeneratedCharacter(null)
  }

  const applyCharacter = () => {
    if (generatedCharacter) {
      onCharacterGenerated(generatedCharacter)
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Chat Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-purple-500/30"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <MessageSquare className="h-5 w-5" />
        Diseñar Personaje con IA
        <Sparkles className="h-4 w-4 animate-pulse" />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
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

            {/* Chat Container */}
            <motion.div 
              className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Wand2 className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Diseñador de Personajes IA</h3>
                    <p className="text-sm text-slate-400">Crea personajes únicos colaborando con IA</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetChat}
                    className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.type === 'user' ? 'flex-row-reverse' : ''
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Avatar */}
                    <div className={`p-2 rounded-full ${
                      message.type === 'user' 
                        ? 'bg-blue-500/20' 
                        : 'bg-purple-500/20'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 text-blue-400" />
                      ) : (
                        <Bot className="h-4 w-4 text-purple-400" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`flex-1 max-w-xs sm:max-w-sm ${
                      message.type === 'user' ? 'text-right' : ''
                    }`}>
                      <div className={`p-3 rounded-xl ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-200'
                      }`}>
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Loading State */}
                {isGenerating && (
                  <motion.div
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="p-2 rounded-full bg-purple-500/20">
                      <Bot className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800">
                      <div className="flex items-center gap-2 text-purple-300">
                        <Sparkles className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Creando personaje...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Generated Character Preview */}
              {generatedCharacter && (
                <motion.div 
                  className="mx-4 mb-4 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">{generatedCharacter.emoji}</div>
                    <div>
                      <h4 className="text-lg font-bold text-emerald-200">{generatedCharacter.name}</h4>
                      <p className="text-sm text-emerald-300">{generatedCharacter.category}</p>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-sm mb-3">{generatedCharacter.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-xs text-emerald-400 font-semibold">Habilidades especiales:</div>
                    {generatedCharacter.perks.map((perk, index) => (
                      <div key={index} className="text-xs text-emerald-300 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
                        {perk}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      Máx. {generatedCharacter.maxPlayers} jugadores
                    </div>
                    <button
                      onClick={applyCharacter}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-sm transition-colors"
                    >
                      Usar Personaje
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-slate-700">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Describe tu personaje ideal... ej: 'Un mago joven especializado en pociones de curación'"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      rows={2}
                      disabled={isGenerating}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!userInput.trim() || isGenerating}
                    className={`p-3 rounded-lg font-semibold transition-all duration-200 ${
                      !userInput.trim() || isGenerating
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-500 text-white hover:shadow-purple-500/30'
                    }`}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                  <div>Presiona Enter para enviar, Shift+Enter para nueva línea</div>
                  <div>{userInput.length}/500</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}