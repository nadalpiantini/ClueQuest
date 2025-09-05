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

  // Enable skip after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setCanSkip(true), 10000)
    return () => clearTimeout(timer)
  }, [])

  const handleSelfieUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('Image size must be less than 10MB')
      return
    }

    setSelfieFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setSelfiePreview(e.target?.result as string)
      setStep('style')
    }
    reader.readAsDataURL(file)
    setError('')
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="pt-safe px-4 py-6">
        <div className="max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full center-flex mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Create Your Avatar</h1>
            <p className="text-muted-foreground">
              Generate a personalized avatar to represent you in the adventure
            </p>
            
            {/* Show selected role */}
            {selectedRoleName && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                <span className="text-sm font-medium text-primary">
                  Role: {selectedRoleName}
                </span>
                <span className="text-sm text-primary/70">
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
                    className="text-sm text-muted-foreground hover:text-foreground"
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
                  className={`w-8 h-8 rounded-full center-flex text-sm font-semibold ${
                    step === stepName 
                      ? 'bg-primary text-primary-foreground' 
                      : ['upload', 'style', 'preview'].indexOf(step) > index
                        ? 'bg-green-500 text-white'
                        : 'bg-muted text-muted-foreground'
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
                    className={`w-16 h-1 mx-2 ${
                      ['upload', 'style', 'preview'].indexOf(step) > index
                        ? 'bg-green-500'
                        : 'bg-muted'
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
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-2 text-destructive">
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
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Upload Your Photo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    {/* Upload Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button
                        onClick={handleCameraCapture}
                        variant="outline"
                        className="h-24 flex-col gap-2 touch-target"
                      >
                        <Camera className="w-8 h-8" />
                        <span>Take Photo</span>
                      </Button>
                      
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="h-24 flex-col gap-2 touch-target"
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

                    {/* Info */}
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700 mb-2">
                        📸 <strong>Pro Tip:</strong> Best results with good lighting and clear face visibility
                      </p>
                      <p className="text-xs text-blue-600">
                        Your photo is processed securely and deleted after avatar generation
                      </p>
                    </div>
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
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Choose Your Style</CardTitle>
                  </CardHeader>
                  <CardContent>
                    
                    {/* Selfie Preview */}
                    {selfiePreview && (
                      <div className="text-center mb-6">
                        <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border-2 border-border">
                          <Image
                            src={selfiePreview}
                            alt="Your photo"
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">Your photo</p>
                      </div>
                    )}

                    {/* Role-specific style explanation */}
                    {selectedRoleName && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg mb-4">
                        <p className="text-sm text-blue-700">
                          🎭 <strong>Role-Based Transformation:</strong> As a {selectedRoleName}, you'll transform into a {selectedStyle.name}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Your transformation style has been automatically selected based on your adventure role
                        </p>
                      </div>
                    )}

                    {/* Style Grid - Show only role-specific style if coming from role selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      {(selectedRoleName ? [selectedStyle] : AVATAR_STYLES).map(style => (
                        <Card
                          key={style.id}
                          className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                            selectedStyle.id === style.id
                              ? 'ring-2 ring-primary shadow-md'
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => handleStyleSelect(style)}
                        >
                          <CardContent className="p-4">
                            <div className="aspect-square bg-muted rounded-lg mb-3 center-flex">
                              <Sparkles className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold text-sm mb-1">{style.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{style.description}</p>
                            <Badge variant="secondary" className="text-xs">
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
                        className="w-full touch-target"
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
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Customize Your Avatar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    {/* Preview Section */}
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full center-flex mx-auto mb-4 relative">
                        <Sparkles className="w-16 h-16 text-purple-600" />
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
                        <Badge className="bg-primary text-primary-foreground">{selectedStyle.name}</Badge>
                        {selectedRoleName && (
                          <p className="text-sm font-medium text-primary">
                            Adventure Role: {selectedRoleName}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedRoleName 
                          ? `You'll be transformed into a ${selectedStyle.name} based on your ${selectedRoleName} role`
                          : 'Preview will be available after generation'
                        }
                      </p>
                    </div>

                    {/* Customization Options */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Gender</label>
                        <Select onValueChange={(value) => handleCustomization('gender', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Auto-detect" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto">Auto-detect</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="non-binary">Non-binary</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Age Range</label>
                        <Select onValueChange={(value) => handleCustomization('age_range', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Auto-detect" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto">Auto-detect</SelectItem>
                            <SelectItem value="teen">Teen</SelectItem>
                            <SelectItem value="adult">Adult</SelectItem>
                            <SelectItem value="senior">Senior</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Generate Button */}
                    <Button
                      onClick={startGeneration}
                      disabled={isGenerating}
                      className="w-full touch-target-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
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
                <Card>
                  <CardContent className="p-8">
                    <AIGenerating 
                      message="Creating Your Avatar"
                      size="lg"
                      className="mb-6"
                    />
                    
                    <p className="text-muted-foreground mb-6">
                      AI is crafting your personalized avatar...
                    </p>
                    
                    <Progress value={generationProgress} className="mb-4" />
                    <p className="text-sm text-muted-foreground">
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
                <Card className="border-yellow-200">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full center-flex mx-auto mb-4">
                      <AlertTriangle className="w-8 h-8 text-yellow-600" />
                    </div>
                    
                    <h2 className="text-xl font-bold mb-2">Content Moderation</h2>
                    <p className="text-muted-foreground mb-6">
                      Your photo didn't pass our content moderation. Please try with a different photo or use a generic avatar.
                    </p>
                    
                    <div className="flex gap-3 justify-center">
                      <Button variant="outline" onClick={handleRetry} className="touch-target">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                      </Button>
                      <Button onClick={handleSkip} className="touch-target">
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
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-32 h-32 bg-muted rounded-full center-flex mx-auto mb-6 overflow-hidden">
                      <Image
                        src={generationResult.avatar_url}
                        alt="Your generated avatar"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    
                    <h2 className="text-xl font-bold mb-2">Avatar Ready!</h2>
                    <p className="text-muted-foreground mb-6">
                      Your personalized avatar has been created successfully.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button variant="outline" onClick={handleRetry} className="touch-target">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Generate New
                      </Button>
                      <Button onClick={handleComplete} className="touch-target">
                        <Check className="w-4 h-4 mr-2" />
                        Continue to Adventure
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-4">
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
      <div className="min-h-screen center-flex bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p>Loading avatar generator...</p>
        </div>
      </div>
    }>
      <AvatarGenerationPageContent />
    </React.Suspense>
  )
}