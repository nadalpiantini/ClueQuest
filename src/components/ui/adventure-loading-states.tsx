/**
 * Adventure Loading States
 * Cinematic loading experiences that maintain engagement during transitions
 */

'use client'

import { motion } from 'framer-motion'
import { Loader2, Search, Lock, Key, Compass, MapPin, Camera } from 'lucide-react'

interface LoadingStateProps {
  message?: string
  submessage?: string
  progress?: number
  className?: string
}

/**
 * QR Scanner Loading
 */
export function QRScannerLoading({ message = "Activating Scanner...", className }: LoadingStateProps) {
  return (
    <div className={`center-flex-col space-y-6 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="relative w-20 h-20"
      >
        <div className="absolute inset-0 border-4 border-gaming-gold/30 rounded-xl"></div>
        <div className="absolute inset-2 border-4 border-gaming-gold/60 rounded-lg"></div>
        <Camera className="absolute inset-0 m-auto w-8 h-8 text-gaming-gold" />
      </motion.div>
      
      <div className="text-center space-y-2">
        <div className="text-lg font-bold text-gaming-gold">{message}</div>
        <div className="text-sm text-slate-400">Point camera at QR code</div>
      </div>
      
      {/* Scanning Animation */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="h-1 w-32 bg-gradient-to-r from-transparent via-gaming-gold to-transparent"
      />
    </div>
  )
}

/**
 * Adventure Loading
 */
export function AdventureLoading({ 
  message = "Preparing Adventure...", 
  submessage, 
  progress,
  className 
}: LoadingStateProps) {
  return (
    <div className={`center-flex-col space-y-8 p-8 ${className}`}>
      {/* Animated Adventure Elements */}
      <div className="relative w-32 h-32">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-gaming-gold/30 rounded-full"
        />
        
        {/* Inner ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 border-4 border-mystery-purple/40 rounded-full"
        />
        
        {/* Center icons */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360] 
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 center-flex"
        >
          <Search className="w-12 h-12 text-gaming-gold" />
        </motion.div>
        
        {/* Floating elements */}
        <motion.div
          animate={{ 
            y: [-10, 10, -10],
            x: [10, -10, 10],
            rotate: [0, 360]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-2 -right-2 text-mystery-purple/60"
        >
          <Key className="w-6 h-6" />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [10, -10, 10],
            x: [-10, 10, -10],
            rotate: [0, -360]
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute -bottom-2 -left-2 text-gaming-gold/60"
        >
          <Lock className="w-6 h-6" />
        </motion.div>
      </div>
      
      {/* Loading Text */}
      <div className="text-center space-y-3">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl font-bold text-gaming-gold"
        >
          {message}
        </motion.div>
        
        {submessage && (
          <div className="text-slate-400 max-w-sm">{submessage}</div>
        )}
      </div>
      
      {/* Progress Bar */}
      {typeof progress === 'number' && (
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm text-slate-400">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-gaming-gold to-mystery-purple"
            />
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Location Loading
 */
export function LocationLoading({ message = "Getting Location...", className }: LoadingStateProps) {
  return (
    <div className={`center-flex-col space-y-6 ${className}`}>
      <div className="relative w-24 h-24">
        {/* Radar effect */}
        <motion.div
          animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 border-2 border-emerald-500/60 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="absolute inset-2 border-2 border-emerald-500/40 rounded-full"
        />
        
        {/* Center pin */}
        <div className="absolute inset-0 center-flex">
          <MapPin className="w-8 h-8 text-emerald-500" />
        </div>
        
        {/* Rotating compass */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute -top-2 -right-2"
        >
          <Compass className="w-6 h-6 text-emerald-400" />
        </motion.div>
      </div>
      
      <div className="text-center space-y-2">
        <div className="text-lg font-bold text-emerald-400">{message}</div>
        <div className="text-sm text-slate-400">This helps provide location-based features</div>
      </div>
    </div>
  )
}

/**
 * AI Generation Loading
 */
export function AIGenerationLoading({ 
  message = "Generating with AI...", 
  submessage = "Creating personalized content",
  className 
}: LoadingStateProps) {
  return (
    <div className={`center-flex-col space-y-6 ${className}`}>
      {/* AI Brain Animation */}
      <div className="relative w-20 h-20">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 border-4 border-mystery-purple/40 rounded-full"
        />
        
        {/* Neural network effect */}
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-2 center-flex"
        >
          <div className="w-12 h-12 relative">
            {/* Neural nodes */}
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-mystery-purple rounded-full -translate-x-1/2" />
            <div className="absolute bottom-0 left-1/4 w-2 h-2 bg-mystery-purple rounded-full -translate-x-1/2" />
            <div className="absolute bottom-0 right-1/4 w-2 h-2 bg-mystery-purple rounded-full translate-x-1/2" />
            <div className="absolute top-1/2 left-0 w-2 h-2 bg-mystery-purple rounded-full -translate-y-1/2" />
            <div className="absolute top-1/2 right-0 w-2 h-2 bg-mystery-purple rounded-full -translate-y-1/2" />
            
            {/* Connecting lines */}
            <svg className="absolute inset-0 w-full h-full">
              <motion.line
                x1="50%" y1="0%"
                x2="25%" y2="100%"
                stroke="currentColor"
                strokeWidth="1"
                className="text-mystery-purple/60"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.line
                x1="50%" y1="0%"
                x2="75%" y2="100%"
                stroke="currentColor"
                strokeWidth="1"
                className="text-mystery-purple/60"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </svg>
          </div>
        </motion.div>
      </div>
      
      <div className="text-center space-y-2">
        <div className="text-lg font-bold text-mystery-purple-bright">{message}</div>
        <div className="text-sm text-slate-400">{submessage}</div>
      </div>
      
      {/* Thinking dots */}
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              delay: i * 0.2 
            }}
            className="w-2 h-2 bg-mystery-purple-bright rounded-full"
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Simple Spinner
 */
export function SimpleSpinner({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <Loader2 className={`animate-spin text-gaming-gold ${className}`} />
  )
}