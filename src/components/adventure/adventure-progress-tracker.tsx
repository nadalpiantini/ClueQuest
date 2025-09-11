/**
 * Adventure Progress Tracker
 * Persistent progress tracking with visual feedback for enhanced engagement
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Clock, Lock, Star, Trophy, Zap } from 'lucide-react'
import { GamingProgress, GamingBadge } from '@/components/ui/gaming-components'

interface ProgressStep {
  id: string
  title: string
  status: 'completed' | 'current' | 'locked' | 'available'
  points?: number
  estimatedTime?: number
  completedAt?: Date
}

interface AdventureProgressTrackerProps {
  adventureId: string
  steps: ProgressStep[]
  totalPoints: number
  earnedPoints: number
  onStepClick?: (stepId: string) => void
  className?: string
}

export function AdventureProgressTracker({
  adventureId,
  steps,
  totalPoints,
  earnedPoints,
  onStepClick,
  className
}: AdventureProgressTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  
  const completedSteps = steps.filter(step => step.status === 'completed').length
  const progressPercentage = (completedSteps / steps.length) * 100
  const currentStep = steps.find(step => step.status === 'current')
  
  // Trigger celebration animation when progress increases
  useEffect(() => {
    setAnimationKey(prev => prev + 1)
  }, [completedSteps])

  const getStepIcon = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />
      case 'current':
        return <Zap className="w-5 h-5 text-gaming-gold animate-pulse" />
      case 'locked':
        return <Lock className="w-5 h-5 text-slate-500" />
      default:
        return <Clock className="w-5 h-5 text-slate-400" />
    }
  }

  const getStepStyles = (step: ProgressStep) => {
    const baseStyles = "relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer touch-target"
    
    switch (step.status) {
      case 'completed':
        return `${baseStyles} bg-emerald-500/10 border-emerald-500/40 hover:bg-emerald-500/20`
      case 'current':
        return `${baseStyles} bg-gaming-gold/10 border-gaming-gold/60 ring-2 ring-gaming-gold/30 hover:bg-gaming-gold/20`
      case 'available':
        return `${baseStyles} bg-slate-800/50 border-slate-600/40 hover:bg-slate-700/60 hover:border-slate-500/60`
      default:
        return `${baseStyles} bg-slate-900/50 border-slate-700/30 opacity-60 cursor-not-allowed`
    }
  }

  return (
    <div className={`gaming-card p-6 ${className}`}>
      {/* Header with Progress Summary */}
      <div 
        className="flex items-center justify-between mb-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gaming-gold to-mystery-purple center-flex">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Adventure Progress</h3>
            <p className="text-sm text-slate-300">
              {completedSteps} of {steps.length} completed
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xl font-bold text-gaming-gold">
            {earnedPoints}/{totalPoints}
          </div>
          <div className="text-sm text-slate-400">points</div>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="mb-6">
        <GamingProgress 
          value={progressPercentage} 
          label="Overall Progress"
          showPercentage={true}
          className="mb-3"
        />
        
        {/* Current Step Indicator */}
        {currentStep && (
          <motion.div
            key={animationKey}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-sm text-gaming-gold"
          >
            <Zap className="w-4 h-4 animate-pulse" />
            <span>Current: {currentStep.title}</span>
            {currentStep.estimatedTime && (
              <GamingBadge variant="gold" size="sm">
                {currentStep.estimatedTime}min
              </GamingBadge>
            )}
          </motion.div>
        )}
      </div>

      {/* Detailed Steps List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={getStepStyles(step)}
                onClick={() => step.status !== 'locked' && onStepClick?.(step.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg center-flex bg-slate-700/50">
                      {getStepIcon(step)}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{step.title}</div>
                      {step.completedAt && (
                        <div className="text-xs text-slate-400">
                          Completed {step.completedAt.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {step.points && (
                      <GamingBadge 
                        variant={step.status === 'completed' ? 'emerald' : 'gold'}
                        size="sm"
                      >
                        {step.points} pts
                      </GamingBadge>
                    )}
                    {step.estimatedTime && step.status !== 'completed' && (
                      <GamingBadge variant="purple" size="sm">
                        {step.estimatedTime}min
                      </GamingBadge>
                    )}
                  </div>
                </div>

                {/* Step completion animation */}
                {step.status === 'completed' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full center-flex"
                  >
                    <Star className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Celebration */}
      {progressPercentage === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-gaming-gold/20 border border-emerald-500/40 text-center"
        >
          <Trophy className="w-8 h-8 text-gaming-gold mx-auto mb-2" />
          <div className="text-lg font-bold text-white">Adventure Complete!</div>
          <div className="text-sm text-emerald-400">
            You've earned {earnedPoints} points
          </div>
        </motion.div>
      )}
    </div>
  )
}