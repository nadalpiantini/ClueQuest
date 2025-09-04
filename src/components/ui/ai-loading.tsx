'use client'

import { motion } from 'framer-motion'
import { Sparkles, Brain, Zap, Wand2 } from 'lucide-react'

interface AILoadingProps {
  message?: string
  variant?: 'default' | 'thinking' | 'generating' | 'processing'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const variants = {
  default: {
    icon: Sparkles,
    messages: [
      'AI is working...',
      'Processing your request...',
      'Generating content...'
    ]
  },
  thinking: {
    icon: Brain,
    messages: [
      'AI is thinking...',
      'Analyzing your request...',
      'Processing information...'
    ]
  },
  generating: {
    icon: Wand2,
    messages: [
      'Generating content...',
      'Creating your content...',
      'Crafting something special...'
    ]
  },
  processing: {
    icon: Zap,
    messages: [
      'Processing...',
      'Working on it...',
      'Almost ready...'
    ]
  }
}

const sizes = {
  sm: {
    icon: 'h-4 w-4',
    text: 'text-sm',
    container: 'py-2'
  },
  md: {
    icon: 'h-6 w-6',
    text: 'text-base',
    container: 'py-4'
  },
  lg: {
    icon: 'h-8 w-8',
    text: 'text-lg',
    container: 'py-6'
  }
}

export default function AILoading({ 
  message, 
  variant = 'default', 
  size = 'md',
  className = ''
}: AILoadingProps) {
  const config = variants[variant]
  const sizeConfig = sizes[size]
  const Icon = config.icon
  
  const displayMessage = message || config.messages[0]

  return (
    <motion.div 
      className={`flex items-center justify-center gap-3 ${sizeConfig.container} ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated Icon */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="relative"
      >
        <Icon className={`${sizeConfig.icon} text-amber-400`} />
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-amber-400/20 blur-sm"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </motion.div>

      {/* Loading Text */}
      <motion.div 
        className={`${sizeConfig.text} text-amber-200 font-medium`}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {displayMessage}
      </motion.div>

      {/* Animated Dots */}
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1 h-1 bg-amber-400 rounded-full"
            animate={{ 
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              delay: i * 0.2,
              ease: "easeInOut" 
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

// Specialized components for common use cases
export function AIThinking({ message, size = 'md', className = '' }: Omit<AILoadingProps, 'variant'>) {
  return <AILoading message={message} variant="thinking" size={size} className={className} />
}

export function AIGenerating({ message, size = 'md', className = '' }: Omit<AILoadingProps, 'variant'>) {
  return <AILoading message={message} variant="generating" size={size} className={className} />
}

export function AIProcessing({ message, size = 'md', className = '' }: Omit<AILoadingProps, 'variant'>) {
  return <AILoading message={message} variant="processing" size={size} className={className} />
}

// Inline loading component for buttons
export function AIButtonLoading({ message = 'Processing...' }: { message?: string }) {
  return (
    <motion.div 
      className="flex items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="h-4 w-4 text-white" />
      </motion.div>
      <span className="text-sm font-medium">{message}</span>
    </motion.div>
  )
}
