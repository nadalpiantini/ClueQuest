'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  Wand2, 
  Clock, 
  Star,
  Copy,
  RefreshCw,
  Check,
  X,
  Eye,
  Edit,
  Download,
  Heart,
  Zap,
  BookOpen,
  Users
} from 'lucide-react'
import AIGenerating from '@/components/ui/ai-loading'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

type StoryGenerationStatus = 'pending' | 'generating' | 'completed' | 'failed' | 'reviewing' | 'approved' | 'rejected'

type StoryGeneration = {
  id: string
  status: StoryGenerationStatus
  generated_content?: string
  content_structure?: any
  readability_score?: number
  engagement_score?: number
  generation_time_seconds?: number
  user_rating?: number
  created_at: string
  completed_at?: string
}

type AdventureData = {
  title: string
  theme: string
  duration: number
  maxPlayers: number
  adventureType: string
}

interface StoryGenerationModalProps {
  isOpen: boolean
  onClose: () => void
  onStoryApprove: (story: string) => void
  adventureData: AdventureData
}

export default function StoryGenerationModal({
  isOpen,
  onClose,
  onStoryApprove,
  adventureData
}: StoryGenerationModalProps) {
  const [currentGeneration, setCurrentGeneration] = useState<StoryGeneration | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationPrompt, setGenerationPrompt] = useState('')
  const [storyTone, setStoryTone] = useState('adventurous')
  const [targetAudience, setTargetAudience] = useState('adults')
  const [qualityLevel, setQualityLevel] = useState('standard')
  const [userFeedback, setUserFeedback] = useState('')
  const [userRating, setUserRating] = useState<number | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  // Generate default prompt based on adventure data
  useEffect(() => {
    if (adventureData && !generationPrompt) {
      const defaultPrompt = `Create an engaging ${adventureData.theme} adventure story for "${adventureData.title}". 
The adventure should accommodate ${adventureData.maxPlayers} participants and take approximately ${adventureData.duration} minutes to complete. 
Make it suitable for ${adventureData.adventureType} settings with exciting challenges and memorable moments.`
      setGenerationPrompt(defaultPrompt)
    }
  }, [adventureData, generationPrompt])

  const handleGenerateStory = async () => {
    if (!generationPrompt.trim()) return

    setIsGenerating(true)
    setCurrentGeneration({
      id: `temp-${Date.now()}`,
      status: 'generating',
      created_at: new Date().toISOString()
    })

    try {
      const response = await fetch('/api/ai/story-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adventure_data: adventureData,
          generation_prompt: generationPrompt,
          story_tone: storyTone,
          target_audience: targetAudience,
          quality_level: qualityLevel,
          component_type: 'full_story'
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Poll for completion
        pollGenerationStatus(result.generation_id)
      } else {
        setCurrentGeneration({
          ...currentGeneration!,
          status: 'failed'
        })
      }
    } catch (error) {
      setCurrentGeneration({
        ...currentGeneration!,
        status: 'failed'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const pollGenerationStatus = async (generationId: string) => {
    const maxAttempts = 60 // 1 minute with 1-second intervals
    let attempts = 0

    const poll = async () => {
      try {
        const response = await fetch(`/api/ai/story-generation/${generationId}`)
        const result = await response.json()

        if (result.generation) {
          setCurrentGeneration(result.generation)

          if (result.generation.status === 'completed') {
            return // Stop polling
          } else if (result.generation.status === 'failed') {
            return // Stop polling
          }
        }

        attempts++
        if (attempts < maxAttempts) {
          setTimeout(poll, 1000) // Poll every second
        }
      } catch (error) {
      }
    }

    poll()
  }

  const handleRegenerateStory = () => {
    setCurrentGeneration(null)
    setUserRating(null)
    setUserFeedback('')
    handleGenerateStory()
  }

  const handleApproveStory = async () => {
    if (!currentGeneration?.generated_content) return

    setIsApplying(true)

    try {
      // Submit user rating and feedback if provided
      if (userRating || userFeedback) {
        await fetch(`/api/ai/story-generation/${currentGeneration.id}/feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            overall_rating: userRating,
            feedback: userFeedback,
            approved: true
          }),
        })
      }

      // Apply story to adventure
      onStoryApprove(currentGeneration.generated_content)
      
      setCurrentGeneration({
        ...currentGeneration,
        status: 'approved'
      })

      // Close modal after brief success state
      setTimeout(() => {
        onClose()
        setCurrentGeneration(null)
      }, 1500)
    } catch (error) {
    } finally {
      setIsApplying(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusColor = (status: StoryGenerationStatus) => {
    switch (status) {
      case 'generating': return 'blue'
      case 'completed': return 'green'
      case 'failed': return 'red'
      case 'approved': return 'emerald'
      case 'rejected': return 'orange'
      default: return 'gray'
    }
  }

  const getStatusIcon = (status: StoryGenerationStatus) => {
    switch (status) {
      case 'generating': return <Wand2 className="h-4 w-4 animate-spin" />
      case 'completed': return <Check className="h-4 w-4" />
      case 'failed': return <X className="h-4 w-4" />
      case 'approved': return <Heart className="h-4 w-4" />
      case 'rejected': return <RefreshCw className="h-4 w-4" />
      default: return <Sparkles className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border-amber-500/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-200 flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-amber-400" />
            AI Story Generator
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Generate an engaging narrative for your adventure using AI
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            
            {/* Left Panel - Configuration */}
            <div className="space-y-6 overflow-y-auto pr-2">
              
              {/* Adventure Context */}
              <Card className="bg-slate-800/50 border-slate-600/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-200 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Adventure Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Title:</span>
                    <span className="text-slate-200 font-semibold">{adventureData.title || 'Untitled'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Theme:</span>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                      {adventureData.theme}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span className="text-slate-200">{adventureData.duration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Max Players:</span>
                    <span className="text-slate-200 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {adventureData.maxPlayers}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Story Configuration */}
              <Card className="bg-slate-800/50 border-slate-600/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-amber-200">Story Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Generation Prompt */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Story Prompt
                    </label>
                    <Textarea
                      value={generationPrompt}
                      onChange={(e) => setGenerationPrompt(e.target.value)}
                      placeholder="Describe the kind of story you want to generate..."
                      className="min-h-[100px] bg-slate-900/80 border-slate-600 text-slate-200 placeholder:text-slate-500 focus:border-amber-500"
                    />
                  </div>

                  {/* Story Settings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Story Tone
                      </label>
                      <Select value={storyTone} onValueChange={setStoryTone}>
                        <SelectTrigger className="bg-slate-900/80 border-slate-600 text-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="adventurous">Adventurous</SelectItem>
                          <SelectItem value="mysterious">Mysterious</SelectItem>
                          <SelectItem value="educational">Educational</SelectItem>
                          <SelectItem value="corporate">Corporate</SelectItem>
                          <SelectItem value="fun">Fun & Light</SelectItem>
                          <SelectItem value="dramatic">Dramatic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Target Audience
                      </label>
                      <Select value={targetAudience} onValueChange={setTargetAudience}>
                        <SelectTrigger className="bg-slate-900/80 border-slate-600 text-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="children">Children (8-12)</SelectItem>
                          <SelectItem value="teens">Teenagers (13-17)</SelectItem>
                          <SelectItem value="adults">Adults (18+)</SelectItem>
                          <SelectItem value="professionals">Professionals</SelectItem>
                          <SelectItem value="families">Mixed Families</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Quality Level
                    </label>
                    <Select value={qualityLevel} onValueChange={setQualityLevel}>
                      <SelectTrigger className="bg-slate-900/80 border-slate-600 text-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft (Fast & Basic)</SelectItem>
                        <SelectItem value="standard">Standard (Balanced)</SelectItem>
                        <SelectItem value="premium">Premium (High Quality)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                </CardContent>
              </Card>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateStory}
                disabled={isGenerating || !generationPrompt.trim()}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 h-auto"
              >
                {isGenerating ? (
                  <>
                    <Wand2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating Story...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Story
                  </>
                )}
              </Button>
            </div>

            {/* Right Panel - Generated Story Results */}
            <div className="overflow-y-auto pr-2">
              <AnimatePresence mode="wait">
                {currentGeneration ? (
                  <motion.div
                    key={currentGeneration.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    
                    {/* Generation Status */}
                    <Card className="bg-slate-800/50 border-slate-600/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-emerald-200 flex items-center gap-3">
                          <Zap className="h-5 w-5 text-emerald-400" />
                          Generation Status
                          <Badge 
                            variant="secondary" 
                            className={`ml-auto bg-${getStatusColor(currentGeneration.status)}-500/20 text-${getStatusColor(currentGeneration.status)}-300`}
                          >
                            {getStatusIcon(currentGeneration.status)}
                            {currentGeneration.status.replace('_', ' ')}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      
                      {currentGeneration.generation_time_seconds && (
                        <CardContent className="pt-0">
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Clock className="h-4 w-4" />
                            Generated in {currentGeneration.generation_time_seconds}s
                          </div>
                        </CardContent>
                      )}
                    </Card>

                    {/* Generated Content */}
                    {currentGeneration.status === 'generating' && (
                      <Card className="bg-slate-800/50 border-slate-600/30">
                        <CardContent className="py-8">
                          <div className="text-center">
                            <AIGenerating 
                              message="Crafting your adventure story..."
                              size="lg"
                              className="mb-4"
                            />
                            <p className="text-slate-500 text-sm mt-2">
                              This usually takes 15-45 seconds
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {currentGeneration.status === 'completed' && currentGeneration.generated_content && (
                      <Card className="bg-slate-800/50 border-slate-600/30">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg text-green-200">Generated Story</CardTitle>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(currentGeneration.generated_content!)}
                                className="border-slate-600 hover:bg-slate-700"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRegenerateStory}
                                className="border-slate-600 hover:bg-slate-700"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Quality Metrics */}
                          {(currentGeneration.readability_score || currentGeneration.engagement_score) && (
                            <div className="flex items-center gap-4 mt-2">
                              {currentGeneration.readability_score && (
                                <div className="flex items-center gap-1 text-sm text-slate-400">
                                  <Eye className="h-4 w-4" />
                                  Readability: {currentGeneration.readability_score}/100
                                </div>
                              )}
                              {currentGeneration.engagement_score && (
                                <div className="flex items-center gap-1 text-sm text-slate-400">
                                  <Zap className="h-4 w-4" />
                                  Engagement: {currentGeneration.engagement_score}/100
                                </div>
                              )}
                            </div>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="bg-slate-900/80 rounded-lg p-4 max-h-80 overflow-y-auto">
                            <div className="text-slate-200 whitespace-pre-line text-sm leading-relaxed">
                              {currentGeneration.generated_content}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {currentGeneration.status === 'failed' && (
                      <Card className="bg-red-900/20 border-red-500/30">
                        <CardContent className="py-6 text-center">
                          <X className="h-8 w-8 text-red-400 mx-auto mb-3" />
                          <p className="text-red-300 font-medium">Generation Failed</p>
                          <p className="text-red-400/80 text-sm mt-1">
                            Please try again or modify your prompt
                          </p>
                          <Button
                            onClick={handleRegenerateStory}
                            variant="outline"
                            className="mt-4 border-red-500/50 hover:bg-red-500/10 text-red-300"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Again
                          </Button>
                        </CardContent>
                      </Card>
                    )}

                    {/* User Feedback Section */}
                    {currentGeneration.status === 'completed' && currentGeneration.generated_content && (
                      <Card className="bg-slate-800/50 border-slate-600/30">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-blue-200">Rate This Story</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          
                          {/* Star Rating */}
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Overall Rating
                            </label>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => setUserRating(star)}
                                  className={`p-1 transition-colors ${
                                    userRating && star <= userRating
                                      ? 'text-amber-400'
                                      : 'text-slate-600 hover:text-amber-400'
                                  }`}
                                >
                                  <Star className="h-6 w-6" fill={
                                    userRating && star <= userRating ? 'currentColor' : 'none'
                                  } />
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Feedback Text */}
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Feedback (Optional)
                            </label>
                            <Textarea
                              value={userFeedback}
                              onChange={(e) => setUserFeedback(e.target.value)}
                              placeholder="What did you like? What could be improved?"
                              className="bg-slate-900/80 border-slate-600 text-slate-200 placeholder:text-slate-500"
                              rows={3}
                            />
                          </div>

                        </CardContent>
                      </Card>
                    )}

                    {/* Action Buttons */}
                    {currentGeneration.status === 'completed' && currentGeneration.generated_content && (
                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={handleApproveStory}
                          disabled={isApplying}
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold"
                        >
                          {isApplying ? (
                            <>
                              <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                              Applying...
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Use This Story
                            </>
                          )}
                        </Button>
                        
                        <Button
                          onClick={handleRegenerateStory}
                          variant="outline"
                          className="border-slate-600 hover:bg-slate-700 text-slate-300"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Regenerate
                        </Button>
                      </div>
                    )}

                    {currentGeneration.status === 'approved' && (
                      <Card className="bg-emerald-900/20 border-emerald-500/30">
                        <CardContent className="py-6 text-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <Heart className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
                          </motion.div>
                          <p className="text-emerald-300 font-medium">Story Applied Successfully!</p>
                          <p className="text-emerald-400/80 text-sm mt-1">
                            Your adventure now has an engaging narrative
                          </p>
                        </CardContent>
                      </Card>
                    )}

                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <Sparkles className="h-12 w-12 text-amber-400/50 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">
                      Configure your story settings and click "Generate Story" to begin
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-600/30" />
        
        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-slate-600 hover:bg-slate-700 text-slate-300"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}