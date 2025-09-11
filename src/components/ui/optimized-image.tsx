/**
 * Optimized Image Component
 * Advanced image loading with progressive enhancement and performance optimization
 */

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ImageIcon, Loader2 } from 'lucide-react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  fallbackSrc?: string
  placeholder?: 'blur' | 'empty'
  onLoad?: () => void
  onError?: () => void
  quality?: number
  sizes?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  fallbackSrc = '/images/placeholder.png',
  placeholder = 'blur',
  onLoad,
  onError,
  quality = 85,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  // Progressive loading: start with low quality, upgrade to high quality
  const [imageQuality, setImageQuality] = useState(priority ? quality : 20)

  useEffect(() => {
    // Upgrade image quality after initial load for non-priority images
    if (!priority && !isLoading) {
      const timer = setTimeout(() => {
        setImageQuality(quality)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isLoading, priority, quality])

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
    setCurrentSrc(fallbackSrc)
    onError?.()
  }

  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (ctx) {
      // Create a simple gradient blur effect
      const gradient = ctx.createLinearGradient(0, 0, w, h)
      gradient.addColorStop(0, '#1e293b')
      gradient.addColorStop(1, '#334155')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)
    }
    return canvas.toDataURL()
  }

  const blurDataURL = placeholder === 'blur' && width && height 
    ? generateBlurDataURL(width, height) 
    : undefined

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 center-flex bg-slate-800/50 backdrop-blur-sm z-10"
          >
            <div className="center-flex-col space-y-3">
              <Loader2 className="w-8 h-8 text-gaming-gold animate-spin" />
              <div className="text-sm text-slate-300 font-medium">Loading...</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {hasError ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 center-flex bg-slate-800/70 backdrop-blur-sm"
        >
          <div className="center-flex-col space-y-2 text-slate-400">
            <ImageIcon className="w-12 h-12" />
            <div className="text-sm font-medium">Image not available</div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={currentSrc}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            quality={imageQuality}
            sizes={sizes}
            placeholder={blurDataURL ? 'blur' : 'empty'}
            blurDataURL={blurDataURL}
            onLoad={handleLoad}
            onError={handleError}
            className={`transition-all duration-300 ${
              isLoading ? 'scale-105 blur-sm' : 'scale-100 blur-0'
            }`}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }}
          />
        </motion.div>
      )}

      {/* Progressive Enhancement Indicator */}
      {!priority && imageQuality < quality && !isLoading && (
        <div className="absolute bottom-2 right-2 bg-black/50 rounded-full px-2 py-1">
          <div className="text-xs text-white opacity-70">Enhancing...</div>
        </div>
      )}
    </div>
  )
}

/**
 * Adventure Image Component
 * Specialized for adventure-related images with gaming aesthetics
 */
interface AdventureImageProps extends OptimizedImageProps {
  theme?: 'mystery' | 'fantasy' | 'corporate' | 'educational'
  showBadge?: boolean
  badgeText?: string
}

export function AdventureImage({
  theme = 'mystery',
  showBadge = false,
  badgeText,
  className = '',
  ...props
}: AdventureImageProps) {
  const themeStyles = {
    mystery: 'ring-2 ring-gaming-gold/30 shadow-lg shadow-gaming-gold/20',
    fantasy: 'ring-2 ring-mystery-purple/30 shadow-lg shadow-mystery-purple/20',
    corporate: 'ring-2 ring-primary-500/30 shadow-lg shadow-primary-500/20',
    educational: 'ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/20'
  }

  return (
    <div className={`relative rounded-xl overflow-hidden ${themeStyles[theme]} ${className}`}>
      <OptimizedImage {...props} />
      
      {showBadge && badgeText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-3 left-3 bg-gaming-gold/90 backdrop-blur-sm rounded-lg px-3 py-1"
        >
          <div className="text-sm font-bold text-slate-900">{badgeText}</div>
        </motion.div>
      )}
    </div>
  )
}