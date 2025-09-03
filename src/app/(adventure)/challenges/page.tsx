'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  CheckCircle2, X, Clock, Zap, Volume2, VolumeX, 
  Camera, Mic, MicOff, HelpCircle, FastForward, Play,
  Upload, Sparkles, Users, Trophy, ArrowRight, RotateCcw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Challenge, ChallengeSubmissionResult, AccessibilityOptions } from '@/types/adventure'
import { formatTimeRemaining, vibrate } from '@/lib/utils'
import { useAdventure } from '@/components/adventure/adventure-provider'
import { useRealtime } from '@/components/adventure/realtime-provider'
import Image from 'next/image'

type ChallengeState = 'loading' | 'active' | 'submitting' | 'completed' | 'failed' | 'skipped'
type MediaRecordingState = 'idle' | 'recording' | 'uploading'

function ChallengesPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionCode = searchParams.get('session')
  const sceneId = searchParams.get('scene')
  const isGuest = searchParams.get('guest') === 'true'
  
  const { state: adventureState } = useAdventure()
  const { sendEvent } = useRealtime()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0)
  const [challengeState, setChallengeState] = useState<ChallengeState>('loading')
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [submissionResult, setSubmissionResult] = useState<ChallengeSubmissionResult | null>(null)
  const [mediaRecording, setMediaRecording] = useState<MediaRecordingState>('idle')
  const [recordedMedia, setRecordedMedia] = useState<Blob | null>(null)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [hintUsed, setHintUsed] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [score, setScore] = useState(0)
  const [achievements, setAchievements] = useState<any[]>([])

  // Load challenges for the scene
  useEffect(() => {
    if (sceneId) {
      loadSceneChallenges(sceneId)
    }
  }, [sceneId])

  // Timer countdown
  useEffect(() => {
    if (challengeState === 'active' && timeRemaining && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev && prev <= 1) {
            handleTimeUp()
            return 0
          }
          return prev ? prev - 1 : 0
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [challengeState, timeRemaining])

  const loadSceneChallenges = async (sceneId: string) => {
    try {
      setChallengeState('loading')
      
      // Mock challenge data - in real app, fetch from API
      const challengeData: Challenge[] = [
        {
          id: '1',
          scene_id: sceneId,
          type: 'trivia',
          title: 'Forest Wisdom',
          description: 'Test your knowledge of the enchanted forest',
          question: 'What magical creature is known as the guardian of ancient oak trees?',
          options: ['Pixie', 'Dryad', 'Sprite', 'Fairy'],
          correct_answer: 'Dryad',
          media_url: '/images/fantasy/ancient-tree.jpg',
          ar_asset_id: null,
          time_limit_seconds: 60,
          points_value: 100,
          difficulty: 'medium',
          accessibility_options: {
            alt_text_available: true,
            audio_description: true,
            large_text_support: true,
            high_contrast: false,
            voice_commands: false,
            haptic_feedback: true,
            screen_reader_compatible: true
          },
          ai_generated: true,
          order_index: 0
        },
        {
          id: '2',
          scene_id: sceneId,
          type: 'photo',
          title: 'Capture the Magic',
          description: 'Take a photo showing the mystical elements around you',
          question: 'Capture an image that shows three different types of magical elements in the scene',
          options: null,
          correct_answer: null,
          media_url: null,
          ar_asset_id: null,
          time_limit_seconds: 120,
          points_value: 150,
          difficulty: 'easy',
          accessibility_options: {
            alt_text_available: true,
            audio_description: true,
            large_text_support: true,
            high_contrast: false,
            voice_commands: true,
            haptic_feedback: true,
            screen_reader_compatible: true
          },
          ai_generated: false,
          order_index: 1
        },
        {
          id: '3',
          scene_id: sceneId,
          type: 'collaborative',
          title: 'Team Spell',
          description: 'Work together to cast a powerful enchantment',
          question: 'Each team member must contribute one word to complete the ancient spell',
          options: null,
          correct_answer: null,
          media_url: null,
          ar_asset_id: null,
          time_limit_seconds: 180,
          points_value: 200,
          difficulty: 'hard',
          accessibility_options: {
            alt_text_available: true,
            audio_description: true,
            large_text_support: true,
            high_contrast: false,
            voice_commands: true,
            haptic_feedback: true,
            screen_reader_compatible: true
          },
          ai_generated: true,
          order_index: 2
        }
      ]

      setChallenges(challengeData)
      setChallengeState('active')
      
      // Set timer if challenge has time limit
      if (challengeData[0].time_limit_seconds) {
        setTimeRemaining(challengeData[0].time_limit_seconds)
      }

    } catch (error) {
      console.error('Failed to load challenges:', error)
      setChallengeState('failed')
    }
  }

  const handleTimeUp = () => {
    setChallengeState('failed')
    setSubmissionResult({
      correct: false,
      points_earned: 0,
      bonus_points: 0,
      time_bonus: 0,
      new_achievements: [],
      scene_completed: false
    })
    
    vibrate([200, 100, 200]) // Time up vibration
  }

  const handleSubmission = async () => {
    const currentChallenge = challenges[currentChallengeIndex]
    if (!currentChallenge) return

    setChallengeState('submitting')

    try {
      let submissionData: any = {
        challengeId: currentChallenge.id,
        sessionCode,
        participantId: adventureState.participant?.id,
        timeRemaining: timeRemaining || 0,
        hintUsed,
        retryCount
      }

      // Add answer based on challenge type
      switch (currentChallenge.type) {
        case 'trivia':
          submissionData.answer = selectedOption || userAnswer
          break
        case 'photo':
          submissionData.photoData = recordedMedia
          break
        case 'audio':
          submissionData.audioData = recordedMedia
          break
        case 'collaborative':
          submissionData.teamAnswer = userAnswer
          break
        default:
          submissionData.answer = userAnswer
      }

      // Mock submission - in real app, submit to API
      const response = await fetch('/api/challenges/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      })

      const result: ChallengeSubmissionResult = await response.json()

      if (response.ok) {
        setSubmissionResult(result)
        setScore(prev => prev + result.points_earned + result.bonus_points + result.time_bonus)
        
        if (result.new_achievements.length > 0) {
          setAchievements(prev => [...prev, ...result.new_achievements])
        }

        setChallengeState('completed')
        
        // Send realtime event
        sendEvent({
          type: 'challenge_completed',
          session_id: sessionCode!,
          user_id: adventureState.participant?.user_id || null,
          data: {
            challenge_id: currentChallenge.id,
            points_earned: result.points_earned,
            completed_at: Date.now()
          }
        })

        // Auto-advance after delay or show next challenge
        setTimeout(() => {
          if (result.scene_completed || currentChallengeIndex === challenges.length - 1) {
            // Scene completed - go to next scene or completion
            router.push(`/adventure-hub?session=${sessionCode}${isGuest ? '&guest=true' : ''}`)
          } else {
            advanceToNextChallenge()
          }
        }, 3000)

      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      console.error('Challenge submission failed:', error)
      setChallengeState('failed')
      setSubmissionResult({
        correct: false,
        points_earned: 0,
        bonus_points: 0,
        time_bonus: 0,
        new_achievements: [],
        scene_completed: false
      })
    }
  }

  const advanceToNextChallenge = () => {
    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex(prev => prev + 1)
      setChallengeState('active')
      setUserAnswer('')
      setSelectedOption('')
      setRecordedMedia(null)
      setHintUsed(false)
      setRetryCount(0)
      setSubmissionResult(null)
      
      const nextChallenge = challenges[currentChallengeIndex + 1]
      if (nextChallenge.time_limit_seconds) {
        setTimeRemaining(nextChallenge.time_limit_seconds)
      }
    }
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    setChallengeState('active')
    setUserAnswer('')
    setSelectedOption('')
    setSubmissionResult(null)
    
    const currentChallenge = challenges[currentChallengeIndex]
    if (currentChallenge.time_limit_seconds) {
      setTimeRemaining(currentChallenge.time_limit_seconds)
    }
  }

  const handleFastForward = () => {
    setChallengeState('skipped')
    
    // Send skip event
    sendEvent({
      type: 'challenge_completed',
      session_id: sessionCode!,
      user_id: adventureState.participant?.user_id || null,
      data: {
        challenge_id: challenges[currentChallengeIndex].id,
        skipped: true,
        completed_at: Date.now()
      }
    })

    setTimeout(() => {
      if (currentChallengeIndex === challenges.length - 1) {
        router.push(`/adventure-hub?session=${sessionCode}${isGuest ? '&guest=true' : ''}`)
      } else {
        advanceToNextChallenge()
      }
    }, 1500)
  }

  const handleMediaCapture = async (type: 'photo' | 'audio') => {
    if (type === 'photo') {
      fileInputRef.current?.click()
    } else {
      startAudioRecording()
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setRecordedMedia(file)
    }
  }

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const chunks: Blob[] = []
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setRecordedMedia(blob)
        setMediaRecording('idle')
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setMediaRecording('recording')
      
      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop()
        }
      }, 30000)
    } catch (error) {
      console.error('Failed to start audio recording:', error)
    }
  }

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }

  const handleHintRequest = () => {
    setHintUsed(true)
    // Show hint modal or inline hint
  }

  if (challenges.length === 0) {
    return (
      <div className="min-h-screen center-flex bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p>Loading challenges...</p>
        </div>
      </div>
    )
  }

  const currentChallenge = challenges[currentChallengeIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      
      {/* Header */}
      <div className="pt-safe px-4 py-4 bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <motion.h1 
          className="text-2xl font-black text-purple-900 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Adventure Challenge
        </motion.h1>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg center-flex">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold">{currentChallenge.title}</h1>
              <p className="text-sm text-muted-foreground">
                Challenge {currentChallengeIndex + 1} of {challenges.length}
              </p>
            </div>
          </div>

          {/* Timer */}
          {timeRemaining !== null && (
            <div className={`text-right ${timeRemaining < 20 ? 'text-red-600' : 'text-muted-foreground'}`}>
              <div className="text-2xl font-mono font-bold">
                {formatTimeRemaining(timeRemaining)}
              </div>
              <div className="text-xs">remaining</div>
            </div>
          )}
        </div>

        {/* Progress */}
        <Progress value={(currentChallengeIndex / challenges.length) * 100} className="h-2" />
      </div>

      {/* Challenge Content */}
      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Challenge Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {currentChallenge.title}
                    <Badge variant="outline" className="text-xs">
                      {currentChallenge.difficulty}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentChallenge.description}
                  </p>
                </div>
                
                <div className="text-right">
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                    <Trophy className="w-3 h-3 mr-1" />
                    {currentChallenge.points_value} pts
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Media */}
              {currentChallenge.media_url && (
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={currentChallenge.media_url}
                    alt={currentChallenge.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Question */}
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="font-medium text-lg">{currentChallenge.question}</p>
              </div>

              {/* Challenge Interface */}
              <AnimatePresence mode="wait">
                {challengeState === 'active' && (
                  <motion.div
                    key="challenge-interface"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    
                    {/* Trivia Options */}
                    {currentChallenge.type === 'trivia' && currentChallenge.options && (
                      <div className="grid grid-cols-1 gap-2">
                        {currentChallenge.options.map((option, index) => (
                          <Button
                            key={option}
                            variant={selectedOption === option ? "default" : "outline"}
                            onClick={() => setSelectedOption(option)}
                            className="justify-start text-left h-auto py-3 px-4 touch-target"
                          >
                            <span className="w-6 h-6 rounded-full bg-primary/10 center-flex text-sm font-bold mr-3">
                              {String.fromCharCode(65 + index)}
                            </span>
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Text Input */}
                    {(['puzzle', 'collaborative'].includes(currentChallenge.type) || 
                      (currentChallenge.type === 'trivia' && !currentChallenge.options)) && (
                      <Input
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Enter your answer..."
                        className="touch-target text-lg"
                        autoFocus
                      />
                    )}

                    {/* Photo Challenge */}
                    {currentChallenge.type === 'photo' && (
                      <div className="text-center space-y-4">
                        {recordedMedia ? (
                          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                            <Image
                              src={URL.createObjectURL(recordedMedia)}
                              alt="Captured photo"
                              fill
                              className="object-cover"
                            />
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setRecordedMedia(null)}
                              className="absolute top-2 right-2"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Button
                              onClick={() => handleMediaCapture('photo')}
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
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                    )}

                    {/* Audio Challenge */}
                    {currentChallenge.type === 'audio' && (
                      <div className="text-center space-y-4">
                        {mediaRecording === 'recording' ? (
                          <div className="space-y-4">
                            <div className="w-20 h-20 bg-red-500 rounded-full center-flex mx-auto animate-pulse">
                              <Mic className="w-10 h-10 text-white" />
                            </div>
                            <p className="text-sm text-muted-foreground">Recording...</p>
                            <Button onClick={stopAudioRecording} variant="outline" className="touch-target">
                              Stop Recording
                            </Button>
                          </div>
                        ) : recordedMedia ? (
                          <div className="space-y-4">
                            <div className="w-20 h-20 bg-green-500 rounded-full center-flex mx-auto">
                              <CheckCircle2 className="w-10 h-10 text-white" />
                            </div>
                            <p className="text-sm text-muted-foreground">Audio recorded</p>
                            <Button
                              onClick={() => setRecordedMedia(null)}
                              variant="outline"
                              size="sm"
                              className="touch-target"
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Re-record
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleMediaCapture('audio')}
                            size="lg"
                            className="w-32 h-32 rounded-full touch-target-lg"
                          >
                            <Mic className="w-12 h-12" />
                          </Button>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Submission Result */}
                {(challengeState === 'completed' || challengeState === 'failed' || challengeState === 'skipped') && submissionResult && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4"
                  >
                    <div className={`w-20 h-20 rounded-full center-flex mx-auto ${
                      challengeState === 'completed' && submissionResult.correct
                        ? 'bg-green-500' 
                        : challengeState === 'skipped'
                          ? 'bg-gray-500'
                          : 'bg-red-500'
                    }`}>
                      {challengeState === 'completed' && submissionResult.correct ? (
                        <CheckCircle2 className="w-10 h-10 text-white" />
                      ) : challengeState === 'skipped' ? (
                        <FastForward className="w-10 h-10 text-white" />
                      ) : (
                        <X className="w-10 h-10 text-white" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold">
                        {challengeState === 'completed' && submissionResult.correct && 'Correct!'}
                        {challengeState === 'failed' && 'Incorrect'}
                        {challengeState === 'skipped' && 'FastForwardped'}
                      </h3>
                      
                      {submissionResult.correct && (
                        <div className="space-y-2 mt-4">
                          <div className="flex items-center justify-center gap-4 text-sm">
                            <span className="text-green-600">+{submissionResult.points_earned} pts</span>
                            {submissionResult.time_bonus > 0 && (
                              <span className="text-blue-600">+{submissionResult.time_bonus} time bonus</span>
                            )}
                            {submissionResult.bonus_points > 0 && (
                              <span className="text-purple-600">+{submissionResult.bonus_points} bonus</span>
                            )}
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            Total: {submissionResult.points_earned + submissionResult.time_bonus + submissionResult.bonus_points} points
                          </div>
                        </div>
                      )}

                      {submissionResult.new_achievements.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">New Achievements!</p>
                          <div className="space-y-1">
                            {submissionResult.new_achievements.map((achievement, index) => (
                              <Badge key={index} className="bg-yellow-100 text-yellow-800">
                                <Sparkles className="w-3 h-3 mr-1" />
                                {achievement.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              {challengeState === 'active' && (
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSubmission}
                    disabled={
                      (currentChallenge.type === 'trivia' && !selectedOption && !userAnswer) ||
                      (currentChallenge.type === 'photo' && !recordedMedia) ||
                      (currentChallenge.type === 'audio' && !recordedMedia) ||
                      (['puzzle', 'collaborative'].includes(currentChallenge.type) && !userAnswer.trim())
                    }
                    className="flex-1 touch-target-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Submit Answer
                  </Button>
                  
                  <Button
                    onClick={handleHintRequest}
                    variant="outline"
                    disabled={hintUsed}
                    className="touch-target-lg"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    onClick={handleFastForward}
                    variant="ghost"
                    className="touch-target-lg"
                  >
                    <FastForward className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {challengeState === 'submitting' && (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                  <p>Checking your answer...</p>
                </div>
              )}

              {challengeState === 'failed' && retryCount < 2 && (
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleRetry} className="flex-1 touch-target">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button onClick={handleFastForward} variant="outline" className="touch-target">
                    FastForward
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Summary */}
          <Card className="bg-primary/5">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{score}</div>
                  <div className="text-xs text-muted-foreground">Total Points</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{currentChallengeIndex}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{achievements.length}</div>
                  <div className="text-xs text-muted-foreground">Achievements</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ChallengesPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen center-flex bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p>Loading challenges...</p>
        </div>
      </div>
    }>
      <ChallengesPageContent />
    </React.Suspense>
  )
}