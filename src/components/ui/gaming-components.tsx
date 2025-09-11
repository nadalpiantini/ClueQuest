/**
 * Premium Gaming Components Library
 * Cinematic UI components for ClueQuest gaming experience
 * Built for 60fps performance and visual excellence
 */

'use client'

import { ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

// =====================================
// GAMING BUTTON SYSTEM
// =====================================

interface GamingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'mystery' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  children: ReactNode
}

export const GamingButton = forwardRef<HTMLButtonElement, GamingButtonProps>(
  ({ className, variant = 'mystery', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center font-bold uppercase tracking-wide rounded-2xl transition-all duration-300 touch-target overflow-hidden gpu-accelerate"
    
    const variants = {
      mystery: "bg-gradient-to-r from-amber-600 to-orange-500 text-white hover:from-amber-500 hover:to-orange-400 shadow-lg hover:shadow-amber-500/25 ring-2 ring-amber-500/20",
      ghost: "bg-transparent border-2 border-amber-400/40 text-amber-300 hover:border-amber-300 hover:bg-amber-400/10 backdrop-blur-md shadow-lg",
      outline: "bg-transparent border-2 border-purple-400/40 text-purple-300 hover:border-purple-300 hover:bg-purple-400/10 backdrop-blur-md shadow-lg"
    }
    
    const sizes = {
      sm: "px-6 py-3 text-sm gap-2 min-h-[44px]",
      md: "px-8 py-4 text-base gap-3 min-h-[44px]", 
      lg: "px-12 py-6 text-xl gap-4 min-h-[44px]",
      xl: "px-16 py-8 text-2xl gap-5 min-h-[44px]"
    }

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          (disabled || isLoading) && "opacity-50 cursor-not-allowed",
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        <div className="relative z-10 flex items-center gap-inherit">
          {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
          {children}
        </div>
      </button>
    )
  }
)
GamingButton.displayName = "GamingButton"

// =====================================
// GAMING CARD SYSTEM  
// =====================================

interface GamingCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export const GamingCard = ({ children, className, hover = true, glow = false }: GamingCardProps) => {
  return (
    <div className={cn(
      "gaming-card",
      hover && "group",
      glow && "animate-mystery-pulse",
      className
    )}>
      {children}
    </div>
  )
}

// =====================================
// HOLOGRAM EFFECT CONTAINER
// =====================================

interface HologramContainerProps {
  children: ReactNode
  className?: string
  flicker?: boolean
}

export const HologramContainer = ({ children, className, flicker = true }: HologramContainerProps) => {
  return (
    <div className={cn(
      "hologram-effect",
      flicker && "animate-hologram-flicker",
      className
    )}>
      {children}
    </div>
  )
}

// =====================================
// GAMING TEXT EFFECTS
// =====================================

interface GamingTextProps {
  children: ReactNode
  variant?: 'title' | 'glow' | 'normal'
  className?: string
}

export const GamingText = ({ children, variant = 'normal', className }: GamingTextProps) => {
  const variants = {
    title: "mystery-title",
    glow: "gaming-text", 
    normal: "text-slate-200 font-medium"
  }
  
  return (
    <span className={cn(variants[variant], className)}>
      {children}
    </span>
  )
}

// =====================================
// GAMING INPUT SYSTEM
// =====================================

interface GamingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const GamingInput = forwardRef<HTMLInputElement, GamingInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-bold text-gaming-gold uppercase tracking-wide">
            {label}
          </label>
        )}
        <input
          className={cn("gaming-input", error && "border-red-500", className)}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-400 font-medium">
            {error}
          </p>
        )}
      </div>
    )
  }
)
GamingInput.displayName = "GamingInput"

// =====================================
// GAMING PROGRESS BAR
// =====================================

interface GamingProgressProps {
  value: number // 0-100
  label?: string
  showPercentage?: boolean
  className?: string
}

export const GamingProgress = ({ value, label, showPercentage = false, className }: GamingProgressProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="text-slate-300 font-medium">{label}</span>}
          {showPercentage && <span className="text-gaming-gold font-bold">{value}%</span>}
        </div>
      )}
      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-gaming-gold to-mystery-purple animate-clue-reveal transition-all duration-500"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  )
}

// =====================================
// GAMING BADGE SYSTEM
// =====================================

interface GamingBadgeProps {
  children: ReactNode
  variant?: 'gold' | 'purple' | 'emerald' | 'red'
  size?: 'sm' | 'md' | 'lg'
  pulse?: boolean
  className?: string
}

export const GamingBadge = ({ 
  children, 
  variant = 'gold', 
  size = 'md', 
  pulse = false, 
  className 
}: GamingBadgeProps) => {
  const variants = {
    gold: "bg-gaming-gold/20 border-gaming-gold/40 text-gaming-gold",
    purple: "bg-mystery-purple/20 border-mystery-purple/40 text-mystery-purple-bright",
    emerald: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400",
    red: "bg-red-500/20 border-red-500/40 text-red-400"
  }
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm", 
    lg: "px-4 py-2 text-base"
  }
  
  return (
    <div className={cn(
      "inline-flex items-center gap-2 rounded-full border backdrop-blur-sm font-bold",
      variants[variant],
      sizes[size],
      pulse && "animate-mystery-pulse",
      className
    )}>
      {children}
    </div>
  )
}

// =====================================
// GAMING LOADING SPINNER
// =====================================

interface GamingLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const GamingLoader = ({ size = 'md', className }: GamingLoaderProps) => {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-24 w-24"
  }
  
  return (
    <div className={cn("gaming-loader", sizes[size], className)}>
      <div className="absolute inset-1 bg-slate-900 rounded-full" />
    </div>
  )
}

// =====================================
// GAMING STATS DISPLAY
// =====================================

interface GamingStatsProps {
  stats: Array<{
    label: string
    value: string | number
    icon?: ReactNode
    color?: string
  }>
  className?: string
}

export const GamingStats = ({ stats, className }: GamingStatsProps) => {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {stats.map((stat, index) => (
        <GamingCard key={stat.label} className="p-6 text-center">
          <div className="space-y-4">
            {stat.icon && (
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl hologram-effect touch-target">
                {stat.icon}
              </div>
            )}
            <div className="space-y-2">
              <div className={cn(
                "text-3xl font-black gaming-text",
                stat.color || "text-gaming-gold"
              )}>
                {stat.value}
              </div>
              <div className="text-slate-300 font-semibold uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          </div>
        </GamingCard>
      ))}
    </div>
  )
}

// =====================================
// GAMING NOTIFICATION TOAST
// =====================================

interface GamingToastProps {
  title: string
  description?: string
  variant?: 'success' | 'error' | 'warning' | 'info'
  visible?: boolean
  onClose?: () => void
}

export const GamingToast = ({ 
  title, 
  description, 
  variant = 'info', 
  visible = true, 
  onClose 
}: GamingToastProps) => {
  if (!visible) return null
  
  const variants = {
    success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    error: "border-red-500/40 bg-red-500/10 text-red-400", 
    warning: "border-gaming-gold/40 bg-gaming-gold/10 text-gaming-gold",
    info: "border-mystery-purple/40 bg-mystery-purple/10 text-mystery-purple-bright"
  }
  
  return (
    <div className={cn(
      "gaming-card p-4 border-2 backdrop-blur-md animate-escape-entrance",
      variants[variant]
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="font-bold">{title}</div>
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-current hover:opacity-70 transition-opacity"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}