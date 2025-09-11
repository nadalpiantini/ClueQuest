'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Camera, Upload, Shuffle, Check, X, Sparkles, AlertTriangle, RefreshCw } from 'lucide-react'
import AIGenerating from '@/components/ui/ai-loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AvatarStyle, AvatarGenerationRequest, AvatarGenerationResult } from '@/types/adventure'
import Image from 'next/image'

type GenerationStep = 'upload' | 'style' | 'preview' | 'generating' | 'complete' | 'moderation'

const AVATAR_STYLES: AvatarStyle[] = [
  {
    id: 'leader-detective',
    name: 'Noble Detective',
    description: 'Elegant detective with commanding presence',
    preview_url: '/images/avatars/leader-detective-preview.jpg',
    price: 0,
    category: 'fantasy'
  },
  {
    id: 'warrior-werewolf',
    name: 'Werewolf Warrior',
    description: 'Fierce werewolf with battle-ready stance',
    preview_url: '/images/avatars/warrior-werewolf-preview.jpg',
    price: 0,
    category: 'fantasy'
  },
  {
    id: 'mage-vampire',
    name: 'Mystic Vampire',
    description: 'Ethereal vampire sorcerer with arcane powers',
    preview_url: '/images/avatars/mage-vampire-preview.jpg',
    price: 0,
    category: 'fantasy'
  },
  {
    id: 'healer-fairy',
    name: 'Luminous Fairy',
    description: 'Radiant fairy healer with gentle aura',
    preview_url: '/images/avatars/healer-fairy-preview.jpg',
    price: 0,
    category: 'fantasy'
  },
  {
    id: 'scout-ninja',
    name: 'Shadow Scout',
    description: 'Stealthy ninja explorer with keen senses',
    preview_url: '/images/avatars/scout-ninja-preview.jpg',
    price: 0,
    category: 'fantasy'
  }
]

function AvatarGenerationPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionCode = searchParams.get('session')
  const isGuest = searchParams.get('guest') === 'true'
  const selectedRoleName = searchParams.get('role') // Get pre-selected role
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<GenerationStep>('upload')
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [selfiePreview, setSelfiePreview] = useState<string>('')
  // Auto-select style based on role
  const getStyleForRole = (roleName: string | null): AvatarStyle => {
    if (!roleName) return AVATAR_STYLES[0]
    
    const roleStyleMap: Record<string, string> = {
      'Leader': 'leader-detective',
      'Warrior': 'warrior-werewolf', 
      'Mage': 'mage-vampire',
      'Healer': 'healer-fairy',
      'Scout': 'scout-ninja'
    }
    
    const styleId = roleStyleMap[roleName]
    return AVATAR_STYLES.find(style => style.id === styleId) || AVATAR_STYLES[0]
  }

  const initialStyle = getStyleForRole(selectedRoleName)
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>(initialStyle)
  const [generationRequest, setGenerationRequest] = useState<AvatarGenerationRequest>({
    style_id: initialStyle.id,
    customizations: {}
  })
  const [generationResult, setGenerationResult] = useState<AvatarGenerationResult | null>(null)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string>('')
  const [moderationFailed, setModerationFailed] = useState(false)
  const [canSkip, setCanSkip] = useState(false)
  const [validationFeedback, setValidationFeedback] = useState<any>(null)
  const [isValidating, setIsValidating] = useState(false)

  // Enable skip after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setCanSkip(true), 10000)
    return () => clearTimeout(timer)
  }, [])

  const handleSelfieUpload = async (file: File) => {
    setIsValidating(true)
    setError('')
    setValidationFeedback(null)
    
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      setIsValidating(false)
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('Image size must be less than 10MB')
      setIsValidating(false)
      return
    }

    // Show preview immediately
    const reader = new FileReader()
    reader.onload = (e) => {
      setSelfiePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload and validate the image
    try {
      const formData = new FormData()
      formData.append('selfie', file)
      
      const uploadResponse = await fetch('/api/ai/avatar/upload-selfie', {
        method: 'POST',
        body: formData
      })
      
      const result = await uploadResponse.json()
      
      if (uploadResponse.ok) {
        setSelfieFile(file)
        setValidationFeedback(result)
        
        // Show validation results but continue to next step
        setTimeout(() => {
          setStep('style')
        }, 1500) // Give time to read validation feedback
        
      } else {
        setError(result.message || result.error || 'Upload failed')
        setValidationFeedback(result.validation)
      }
      
    } catch (error) {
      setError('Failed to validate photo. Please try again.')
    } finally {
      setIsValidating(false)
    }
  }

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      })
      
      // TODO: Implement camera capture UI
      // For now, trigger file input
      fileInputRef.current?.click()
      
      // Stop the stream
      stream.getTracks().forEach(track => track.stop())
    } catch (error) {
      setError('Camera access denied. Please upload a photo instead.')
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleSelfieUpload(file)
    }
  }

  const handleStyleSelect = (style: AvatarStyle) => {
    setSelectedStyle(style)
    setGenerationRequest(prev => ({
      ...prev,
      style_id: style.id
    }))
    setStep('preview')
  }

  const handleCustomization = (key: string, value: string) => {
    setGenerationRequest(prev => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        [key]: value
      }
    }))
  }

  const startGeneration = async () => {
    setIsGenerating(true)
    setStep('generating')
    setError('')
    setGenerationProgress(0)

    let progressInterval: NodeJS.Timeout | null = null

    try {
      // Simulate generation progress
      progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 95) {
            if (progressInterval) clearInterval(progressInterval)
            return 95
          }
          return prev + Math.random() * 15
        })
      }, 500)

      // Upload selfie to temporary storage
      let selfieUrl = ''
      if (selfieFile) {
        const formData = new FormData()
        formData.append('selfie', selfieFile)
        
        const uploadResponse = await fetch('/api/ai/avatar/upload-selfie', {
          method: 'POST',
          body: formData
        })
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          selfieUrl = uploadResult.url
        }
      }

      // Generate avatar
      const generationResponse = await fetch('/api/ai/avatar/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...generationRequest,
          selfie_url: selfieUrl,
          session_code: sessionCode
        })
      })

      const result = await generationResponse.json()

      if (!generationResponse.ok) {
        throw new Error(result.error || 'Generation failed')
      }

      if (progressInterval) clearInterval(progressInterval)
      setGenerationProgress(100)

      // Check moderation
      if (!result.moderation_passed) {
        setModerationFailed(true)
        setStep('moderation')
        return
      }

      setGenerationResult(result)
      setStep('complete')

      // Save avatar to participant data
      const participantData = JSON.parse(localStorage.getItem('cluequest_participant') || '{}')
      participantData.avatar_url = result.avatar_url
      localStorage.setItem('cluequest_participant', JSON.stringify(participantData))

    } catch (error: any) {
      setError(error.message || 'Generation failed. Please try again.')
      setIsGenerating(false)
      setStep('preview')
      if (progressInterval) clearInterval(progressInterval)
    }
  }

  const handleComplete = () => {
    // Navigate to QR map/adventure hub
    if (sessionCode) {
      router.push(`/adventure-hub?session=${sessionCode}${isGuest ? '&guest=true' : ''}`)
    } else {
      router.push(`/adventure-hub${isGuest ? '?guest=true' : ''}`)
    }
  }

  const handleSkip = () => {
    // Use generic avatar and continue
    const participantData = JSON.parse(localStorage.getItem('cluequest_participant') || '{}')
    participantData.avatar_url = `/images/avatars/generic-${Math.floor(Math.random() * 5) + 1}.jpg`
    localStorage.setItem('cluequest_participant', JSON.stringify(participantData))
    handleComplete()
  }

  const handleRetry = () => {
    setError('')
    setModerationFailed(false)
    setGenerationResult(null)
    setStep('upload')
    setSelfieFile(null)
    setSelfiePreview('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden" style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)' }}>
      
      {/* Cinematic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.3),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

      {/* Floating Mystery Elements */}
      <div className="absolute top-20 left-10 text-amber-400/20 animate-pulse">
        <Sparkles className="h-12 w-12 rotate-12" />
      </div>
      <div className="absolute top-40 right-20 text-purple-400/20 animate-bounce">
        <Camera className="h-10 w-10 -rotate-12" />
      </div>
      <div className="absolute bottom-40 left-20 text-amber-400/20 animate-pulse">
        <Upload className="h-14 w-14 rotate-45" />
      </div>
      <div className="absolute bottom-60 right-10 text-purple-400/20 animate-bounce">
        <Shuffle className="h-8 w-8 -rotate-45" />
      </div>

      <div className="relative z-20 pt-safe px-4 py-6">
        <div className="max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-purple-500 rounded-full center-flex mx-auto mb-4 shadow-2xl ring-2 ring-amber-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-purple-300">Create Your Avatar</h1>
            <p className="text-slate-300">
              Generate a personalized avatar to represent you in the adventure
            </p>
            
            {/* Show selected role */}
            {selectedRoleName && (
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-full ring-2 ring-amber-500/30 backdrop-blur-xl border border-amber-500/20">
                <span className="text-sm font-medium text-amber-300">
                  Role: {selectedRoleName}
                </span>
                <span className="text-sm text-purple-300">
                  → {selectedStyle.name}
                </span>
              </div>
            )}
            
            {/* Skip Option */}
            <AnimatePresence>
              {canSkip && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2"
                >
                  <Button
                    variant="ghost"
                    onClick={handleSkip}
                    className="text-sm text-slate-400 hover:text-amber-300 transition-colors"
                  >
                    Skip avatar creation
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {['upload', 'style', 'preview', 'complete'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full center-flex text-sm font-semibold ring-2 ${
                    step === stepName 
                      ? 'bg-gradient-to-r from-amber-500 to-purple-500 text-white ring-amber-500/50 shadow-lg' 
                      : ['upload', 'style', 'preview'].indexOf(step) > index
                        ? 'bg-emerald-500 text-white ring-emerald-500/50'
                        : 'bg-slate-700 text-slate-400 ring-slate-600'
                  }`}
                >
                  {['upload', 'style', 'preview'].indexOf(step) > index ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 3 && (
                  <div 
                    className={`w-16 h-1 mx-2 rounded-full ${
                      ['upload', 'style', 'preview'].indexOf(step) > index
                        ? 'bg-emerald-500'
                        : 'bg-slate-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            
            {/* Upload Step */}
            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="bg-slate-800/50 backdrop-blur-xl border-amber-500/20 ring-1 ring-amber-500/30 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-center text-amber-100">Upload Your Photo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    {/* Upload Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button
                        onClick={handleCameraCapture}
                        variant="outline"
                        className="h-24 flex-col gap-2 touch-target bg-slate-700/50 border-amber-500/30 text-amber-200 hover:bg-amber-500/20 hover:border-amber-400/50 transition-all duration-300"
                      >
                        <Camera className="w-8 h-8" />
                        <span>Take Photo</span>
                      </Button>
                      
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="h-24 flex-col gap-2 touch-target bg-slate-700/50 border-purple-500/30 text-purple-200 hover:bg-purple-500/20 hover:border-purple-400/50 transition-all duration-300"
                      >
                        <Upload className="w-8 h-8" />
                        <span>Upload Photo</span>
                      </Button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {/* Passport Photo Guidelines */}
                    <div className="text-center p-4 bg-slate-700/30 rounded-lg space-y-3 backdrop-blur-xl border border-amber-500/20">
                      <div>
                        <p className="text-sm text-amber-300 mb-2 font-semibold">
                          📸 <strong>Upload Passport-Style Photo</strong>
                        </p>
                        <p className="text-xs text-slate-300 mb-3">
                          For best avatar generation results, follow these guidelines:
                        </p>
                      </div>
                      
                      {/* Guidelines Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2 text-emerald-300 bg-emerald-500/20 px-2 py-1 rounded border border-emerald-500/30">
                          ✅ <span>Face camera directly</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-300 bg-emerald-500/20 px-2 py-1 rounded border border-emerald-500/30">
                          ✅ <span>Good natural lighting</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-300 bg-emerald-500/20 px-2 py-1 rounded border border-emerald-500/30">
                          ✅ <span>Only one person visible</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-300 bg-emerald-500/20 px-2 py-1 rounded border border-emerald-500/30">
                          ✅ <span>Clear, unblocked face</span>
                        </div>
                      </div>
                      
                      {/* Avoid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2 text-red-300 bg-red-500/20 px-2 py-1 rounded border border-red-500/30">
                          ❌ <span>Dark sunglasses/hats</span>
                        </div>
                        <div className="flex items-center gap-2 text-red-300 bg-red-500/20 px-2 py-1 rounded border border-red-500/30">
                          ❌ <span>Group photos</span>
                        </div>
                      </div>
                      
                      <div className="border-t border-amber-500/30 pt-2">
                        <p className="text-xs text-amber-300">
                          🔒 Your photo is processed securely and automatically deleted after avatar generation
                        </p>
                      </div>
                    </div>

                    {/* Validation Loading */}
                    {isValidating && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg backdrop-blur-xl"
                      >
                        <div className="flex items-center gap-2 text-amber-300">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Camera className="w-4 h-4" />
                          </motion.div>
                          <span className="text-sm font-medium">Validating your photo...</span>
                        </div>
                        <p className="text-xs text-amber-200 mt-1">
                          Checking photo quality and face detection
                        </p>
                      </motion.div>
                    )}

                    {/* Validation Feedback */}
                    {validationFeedback && !isValidating && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4"
                      >
                        <div className={`p-4 rounded-lg border backdrop-blur-xl ${
                          validationFeedback.validation?.is_valid 
                            ? 'bg-emerald-500/10 border-emerald-500/30' 
                            : 'bg-amber-500/10 border-amber-500/30'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            {validationFeedback.validation?.is_valid ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-amber-400" />
                            )}
                            <span className={`text-sm font-medium ${
                              validationFeedback.validation?.is_valid 
                                ? 'text-emerald-300' 
                                : 'text-amber-300'
                            }`}>
                              {validationFeedback.message}
                            </span>
                          </div>
                          
                          {validationFeedback.face_detection && (
                            <div className="text-xs space-y-1 text-slate-300">
                              <div className="flex justify-between">
                                <span>Faces detected:</span>
                                <span className="font-medium text-amber-300">
                                  {validationFeedback.face_detection.faces_detected}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Detection confidence:</span>
                                <span className="font-medium text-amber-300">
                                  {Math.round(validationFeedback.face_detection.confidence * 100)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Quality score:</span>
                                <span className="font-medium text-amber-300">
                                  {validationFeedback.face_detection.quality_score}/100
                                </span>
                              </div>
                            </div>
                          )}

                          {validationFeedback.validation?.issues?.length > 0 && (
                            <div className="mt-3 text-xs">
                              <p className="font-medium mb-1 text-amber-300">Suggestions for improvement:</p>
                              <ul className="space-y-1">
                                {validationFeedback.validation.issues.slice(0, 3).map((issue: any, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-amber-400">•</span>
                                    <span className="text-amber-200">{issue.suggestion || issue.message}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Style Selection Step */}
            {step === 'style' && (
              <motion.div
                key="style"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="bg-slate-800/50 backdrop-blur-xl border-purple-500/20 ring-1 ring-purple-500/30 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-center text-purple-100">Choose Your Style</CardTitle>
                  </CardHeader>
                  <CardContent>
                    
                    {/* Selfie Preview */}
                    {selfiePreview && (
                      <div className="text-center mb-6">
                        <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border-2 border-amber-500/50 ring-2 ring-amber-500/30">
                          <Image
                            src={selfiePreview}
                            alt="Your photo"
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <p className="text-sm text-slate-300 mt-2">Your photo</p>
                      </div>
                    )}

                    {/* Role-specific style explanation */}
                    {selectedRoleName && (
                      <div className="text-center p-3 bg-slate-700/30 rounded-lg mb-4 backdrop-blur-xl border border-purple-500/20">
                        <p className="text-sm text-purple-300">
                          🎭 <strong>Role-Based Transformation:</strong> As a {selectedRoleName}, you'll transform into a {selectedStyle.name}
                        </p>
                        <p className="text-xs text-slate-300 mt-1">
                          Your transformation style has been automatically selected based on your adventure role
                        </p>
                      </div>
                    )}

                    {/* Style Grid - Show only role-specific style if coming from role selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      {(selectedRoleName ? [selectedStyle] : AVATAR_STYLES).map(style => (
                        <Card
                          key={style.id}
                          className={`cursor-pointer transition-all duration-200 hover:scale-105 bg-slate-700/30 backdrop-blur-xl border ${
                            selectedStyle.id === style.id
                              ? 'ring-2 ring-amber-500/50 border-amber-500/50 shadow-lg shadow-amber-500/20'
                              : 'border-slate-600/50 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20'
                          }`}
                          onClick={() => handleStyleSelect(style)}
                        >
                          <CardContent className="p-4">
                            <div className="aspect-square bg-gradient-to-br from-slate-600/50 to-slate-700/50 rounded-lg mb-3 center-flex border border-slate-500/30">
                              <Sparkles className="w-8 h-8 text-amber-400" />
                            </div>
                            <h3 className="font-semibold text-sm mb-1 text-slate-200">{style.name}</h3>
                            <p className="text-xs text-slate-300 mb-2">{style.description}</p>
                            <Badge className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {style.category}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Random Style Button - Only show if no role pre-selected */}
                    {!selectedRoleName && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          const randomStyle = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)]
                          handleStyleSelect(randomStyle)
                        }}
                        className="w-full touch-target bg-slate-700/50 border-purple-500/30 text-purple-200 hover:bg-purple-500/20 hover:border-purple-400/50 transition-all duration-300"
                      >
                        <Shuffle className="w-4 h-4 mr-2" />
                        Surprise Me!
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Preview Step */}
            {step === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="bg-slate-800/50 backdrop-blur-xl border-emerald-500/20 ring-1 ring-emerald-500/30 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-center text-emerald-100">Customize Your Avatar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    {/* Preview Section */}
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-amber-500/30 to-purple-500/30 rounded-full center-flex mx-auto mb-4 relative ring-2 ring-amber-500/50 shadow-2xl">
                        <Sparkles className="w-16 h-16 text-amber-400" />
                        {/* Selfie preview overlay */}
                        {selfiePreview && (
                          <div className="absolute inset-0 rounded-full overflow-hidden opacity-30">
                            <Image
                              src={selfiePreview}
                              alt="Your photo preview"
                              width={128}
                              height={128}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 mb-4">
                        <Badge className="bg-gradient-to-r from-amber-500 to-purple-500 text-white border-0 shadow-lg">{selectedStyle.name}</Badge>
                        {selectedRoleName && (
                          <p className="text-sm font-medium text-amber-300">
                            Adventure Role: {selectedRoleName}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-slate-300">
                        {selectedRoleName 
                          ? `You'll be transformed into a ${selectedStyle.name} based on your ${selectedRoleName} role`
                          : 'Preview will be available after generation'
                        }
                      </p>
                    </div>

                    {/* Customization Options */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block text-slate-200">Gender</label>
                        <Select onValueChange={(value) => handleCustomization('gender', value)}>
                          <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-slate-200">
                            <SelectValue placeholder="Auto-detect" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value="auto" className="text-slate-200">Auto-detect</SelectItem>
                            <SelectItem value="male" className="text-slate-200">Male</SelectItem>
                            <SelectItem value="female" className="text-slate-200">Female</SelectItem>
                            <SelectItem value="non-binary" className="text-slate-200">Non-binary</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block text-slate-200">Age Range</label>
                        <Select onValueChange={(value) => handleCustomization('age_range', value)}>
                          <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-slate-200">
                            <SelectValue placeholder="Auto-detect" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value="auto" className="text-slate-200">Auto-detect</SelectItem>
                            <SelectItem value="teen" className="text-slate-200">Teen</SelectItem>
                            <SelectItem value="adult" className="text-slate-200">Adult</SelectItem>
                            <SelectItem value="senior" className="text-slate-200">Senior</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Generate Button */}
                    <Button
                      onClick={startGeneration}
                      disabled={isGenerating}
                      className="w-full touch-target-lg bg-gradient-to-r from-amber-500 to-purple-500 hover:from-amber-600 hover:to-purple-600 text-white shadow-2xl ring-2 ring-amber-500/30 hover:ring-amber-400/50 transition-all duration-300"
                    >
                      {isGenerating ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-5 h-5 mr-2" />
                          </motion.div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate My Avatar
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Generating Step */}
            {step === 'generating' && (
              <motion.div
                key="generating"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <Card className="bg-slate-800/50 backdrop-blur-xl border-amber-500/20 ring-1 ring-amber-500/30 shadow-2xl">
                  <CardContent className="p-8">
                    <AIGenerating 
                      message="Creating Your Avatar"
                      size="lg"
                      className="mb-6"
                    />
                    
                    <p className="text-slate-300 mb-6">
                      AI is crafting your personalized avatar...
                    </p>
                    
                    <Progress value={generationProgress} className="mb-4" />
                    <p className="text-sm text-slate-300">
                      {Math.round(generationProgress)}% complete
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Moderation Failed Step */}
            {step === 'moderation' && (
              <motion.div
                key="moderation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="bg-slate-800/50 backdrop-blur-xl border-yellow-500/20 ring-1 ring-yellow-500/30 shadow-2xl">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-full center-flex mx-auto mb-4 ring-2 ring-yellow-500/30">
                      <AlertTriangle className="w-8 h-8 text-yellow-400" />
                    </div>
                    
                    <h2 className="text-xl font-bold mb-2 text-yellow-200">Content Moderation</h2>
                    <p className="text-slate-300 mb-6">
                      Your photo didn't pass our content moderation. Please try with a different photo or use a generic avatar.
                    </p>
                    
                    <div className="flex gap-3 justify-center">
                      <Button variant="outline" onClick={handleRetry} className="touch-target bg-slate-700/50 border-yellow-500/30 text-yellow-200 hover:bg-yellow-500/20 hover:border-yellow-400/50 transition-all duration-300">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                      </Button>
                      <Button onClick={handleSkip} className="touch-target bg-gradient-to-r from-amber-500 to-purple-500 hover:from-amber-600 hover:to-purple-600 text-white shadow-lg">
                        Use Generic Avatar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Complete Step */}
            {step === 'complete' && generationResult && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="bg-slate-800/50 backdrop-blur-xl border-emerald-500/20 ring-1 ring-emerald-500/30 shadow-2xl">
                  <CardContent className="p-8 text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-500/30 to-purple-500/30 rounded-full center-flex mx-auto mb-6 overflow-hidden ring-2 ring-emerald-500/50 shadow-2xl">
                      <Image
                        src={generationResult.avatar_url}
                        alt="Your generated avatar"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    
                    <h2 className="text-xl font-bold mb-2 text-emerald-200">Avatar Ready!</h2>
                    <p className="text-slate-300 mb-6">
                      Your personalized avatar has been created successfully.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button variant="outline" onClick={handleRetry} className="touch-target bg-slate-700/50 border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Generate New
                      </Button>
                      <Button onClick={handleComplete} className="touch-target bg-gradient-to-r from-amber-500 to-purple-500 hover:from-amber-600 hover:to-purple-600 text-white shadow-lg">
                        <Check className="w-4 h-4 mr-2" />
                        Continue to Adventure
                      </Button>
                    </div>
                    
                    <p className="text-xs text-slate-400 mt-4">
                      Generated in {generationResult.generation_time_ms}ms
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default function AvatarGenerationPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen center-flex bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading avatar generator...</p>
        </div>
      </div>
    }>
      <AvatarGenerationPageContent />
    </React.Suspense>
  )
}