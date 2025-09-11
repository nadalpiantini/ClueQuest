/**
 * Gesture Enhanced Components
 * Advanced touch interactions for immersive mobile adventure experience
 */

'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight, RotateCw, ZoomIn, ZoomOut } from 'lucide-react'

interface SwipeableCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onTap?: () => void
  className?: string
  disabled?: boolean
}

/**
 * Swipeable Card Component
 * Supports swipe gestures for navigation and interaction
 */
export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  onTap,
  className = '',
  disabled = false
}: SwipeableCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5])
  const rotate = useTransform(x, [-200, 0, 200], [-10, 0, 10])
  const scale = useTransform(x, [-200, 0, 200], [0.9, 1, 0.9])

  const handleDragEnd = useCallback((event: any, info: PanInfo) => {
    setIsDragging(false)
    
    const threshold = 100
    const velocity = info.velocity.x
    const offset = info.offset.x

    // Determine swipe direction based on offset and velocity
    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      if (offset > 0 || velocity > 500) {
        onSwipeRight?.()
      } else {
        onSwipeLeft?.()
      }
    }
    
    // Reset position
    x.set(0)
  }, [onSwipeLeft, onSwipeRight, x])

  const handleTap = useCallback(() => {
    if (!isDragging && onTap) {
      onTap()
    }
  }, [isDragging, onTap])

  return (
    <motion.div
      className={`relative touch-none cursor-grab active:cursor-grabbing ${className}`}
      style={{ x, opacity, rotate, scale }}
      drag={disabled ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.3}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
    >
      {children}
      
      {/* Swipe Indicators */}
      {isDragging && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400"
          >
            <ChevronRight className="w-8 h-8" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400"
          >
            <ChevronLeft className="w-8 h-8" />
          </motion.div>
        </>
      )}
    </motion.div>
  )
}

interface PinchZoomProps {
  children: React.ReactNode
  minZoom?: number
  maxZoom?: number
  initialZoom?: number
  className?: string
}

/**
 * Pinch to Zoom Component
 * Enables pinch gestures for zooming content (maps, images, etc.)
 */
export function PinchZoom({
  children,
  minZoom = 0.5,
  maxZoom = 3,
  initialZoom = 1,
  className = ''
}: PinchZoomProps) {
  const [scale, setScale] = useState(initialZoom)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePinch = useCallback((event: any) => {
    if (event.touches?.length === 2) {
      event.preventDefault()
      
      // Calculate distance between two touches
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      )
      
      // Simple pinch detection (this is a basic implementation)
      // In production, you'd want to use a more robust gesture library
      const newScale = Math.max(minZoom, Math.min(maxZoom, scale * (distance / 100)))
      setScale(newScale)
    }
  }, [scale, minZoom, maxZoom])

  const resetZoom = () => {
    setScale(initialZoom)
    setPosition({ x: 0, y: 0 })
  }

  const zoomIn = () => {
    setScale(prev => Math.min(maxZoom, prev + 0.2))
  }

  const zoomOut = () => {
    setScale(prev => Math.max(minZoom, prev - 0.2))
  }

  return (
    <div className={`relative overflow-hidden ${className}`} ref={containerRef}>
      <motion.div
        style={{
          scale,
          x: position.x,
          y: position.y
        }}
        drag
        dragConstraints={containerRef}
        onTouchMove={handlePinch}
        className="w-full h-full origin-center"
      >
        {children}
      </motion.div>
      
      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={zoomIn}
          className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full center-flex text-white touch-target"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={zoomOut}
          className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full center-flex text-white touch-target"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={resetZoom}
          className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full center-flex text-white touch-target"
          aria-label="Reset zoom"
        >
          <RotateCw className="w-5 h-5" />
        </motion.button>
      </div>
      
      {/* Zoom Indicator */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
        <div className="text-sm text-white font-medium">
          {Math.round(scale * 100)}%
        </div>
      </div>
    </div>
  )
}

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  className?: string
  threshold?: number
}

/**
 * Pull to Refresh Component
 * Enables pull-to-refresh gesture for content updates
 */
export function PullToRefresh({
  onRefresh,
  children,
  className = '',
  threshold = 80
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const y = useMotionValue(0)
  
  const handleDragEnd = useCallback(async (event: any, info: PanInfo) => {
    if (info.offset.y > threshold && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
        y.set(0)
      }
    } else {
      setPullDistance(0)
      y.set(0)
    }
  }, [onRefresh, threshold, isRefreshing, y])

  const handleDrag = useCallback((event: any, info: PanInfo) => {
    if (info.offset.y > 0) {
      setPullDistance(info.offset.y)
      y.set(Math.min(info.offset.y, threshold * 1.5))
    }
  }, [threshold, y])

  const pullProgress = Math.min(pullDistance / threshold, 1)
  const shouldRefresh = pullDistance > threshold

  return (
    <motion.div
      style={{ y }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.3}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      className={`relative ${className}`}
    >
      {/* Pull Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: pullDistance > 20 ? 1 : 0,
          scale: pullProgress,
          rotate: shouldRefresh ? 180 : 0
        }}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full z-10 p-4"
      >
        <div className={`w-12 h-12 rounded-full center-flex backdrop-blur-sm ${
          shouldRefresh 
            ? 'bg-emerald-500/90 text-white' 
            : 'bg-gaming-gold/90 text-white'
        }`}>
          {isRefreshing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RotateCw className="w-6 h-6" />
            </motion.div>
          ) : (
            <ChevronLeft className={`w-6 h-6 transition-transform ${
              shouldRefresh ? 'rotate-90' : '-rotate-90'
            }`} />
          )}
        </div>
      </motion.div>
      
      {children}
    </motion.div>
  )
}

interface LongPressProps {
  onLongPress: () => void
  onPress?: () => void
  children: React.ReactNode
  delay?: number
  className?: string
}

/**
 * Long Press Component
 * Enables long press gestures for context actions
 */
export function LongPress({
  onLongPress,
  onPress,
  children,
  delay = 500,
  className = ''
}: LongPressProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [progress, setProgress] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startPress = useCallback(() => {
    setIsPressed(true)
    setProgress(0)
    
    // Progress animation
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (delay / 50))
        return Math.min(newProgress, 100)
      })
    }, 50)
    
    // Long press trigger
    timeoutRef.current = setTimeout(() => {
      onLongPress()
      setIsPressed(false)
      setProgress(0)
    }, delay)
  }, [onLongPress, delay])

  const endPress = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    if (isPressed && progress < 100) {
      onPress?.()
    }
    
    setIsPressed(false)
    setProgress(0)
  }, [isPressed, progress, onPress])

  return (
    <motion.div
      className={`relative touch-none ${className}`}
      onPointerDown={startPress}
      onPointerUp={endPress}
      onPointerLeave={endPress}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      
      {/* Long Press Progress Indicator */}
      {isPressed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          <svg className="absolute inset-0 w-full h-full">
            <circle
              cx="50%"
              cy="50%"
              r="40%"
              fill="none"
              stroke="rgba(245, 158, 11, 0.3)"
              strokeWidth="4"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="40%"
              fill="none"
              stroke="rgba(245, 158, 11, 0.8)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * progress / 100) }}
              transform="rotate(-90 50% 50%)"
            />
          </svg>
        </motion.div>
      )}
    </motion.div>
  )
}