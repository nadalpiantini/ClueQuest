/**
 * ClueQuest Brand Logo Component
 * Consistent branding across all pages
 */

'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ClueQuestLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  showSubtitle?: boolean
  href?: string
  className?: string
  onClick?: () => void
}

const sizeClasses = {
  sm: {
    container: 'w-8 h-8',
    icon: 'h-4 w-4',
    text: 'text-lg',
    subtitle: 'text-xs'
  },
  md: {
    container: 'w-10 h-10',
    icon: 'h-5 w-5',
    text: 'text-xl',
    subtitle: 'text-xs'
  },
  lg: {
    container: 'w-12 h-12',
    icon: 'h-6 w-6',
    text: 'text-2xl',
    subtitle: 'text-xs'
  },
  xl: {
    container: 'w-16 h-16',
    icon: 'h-8 w-8',
    text: 'text-3xl',
    subtitle: 'text-sm'
  }
}

export function ClueQuestLogo({ 
  size = 'md', 
  showText = true, 
  showSubtitle = false,
  href = '/',
  className,
  onClick
}: ClueQuestLogoProps) {
  const sizeConfig = sizeClasses[size]
  
  const logoContent = (
    <div className={cn(
      "flex items-center gap-3 group",
      className
    )}>
      <div className="relative">
        <div className={cn(
          "bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-xl group-hover:shadow-amber-500/40 transition-all duration-300 group-hover:scale-105",
          sizeConfig.container
        )}>
          <Search className={cn("text-white", sizeConfig.icon)} />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
      </div>
      
      {showText && (
        <div>
          <h1 className={cn(
            "font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-purple-300 tracking-tight",
            sizeConfig.text
          )}>
            ClueQuest
          </h1>
          {showSubtitle && (
            <p className={cn(
              "text-slate-400 font-medium",
              sizeConfig.subtitle
            )}>
              Adventure Platform
            </p>
          )}
        </div>
      )}
    </div>
  )

  if (onClick) {
    return (
      <button onClick={onClick} className="focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded-lg">
        {logoContent}
      </button>
    )
  }

  return (
    <Link href={href} className="focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded-lg">
      {logoContent}
    </Link>
  )
}

// Variants for different contexts
export function ClueQuestLogoHeader({ className }: { className?: string }) {
  return (
    <ClueQuestLogo 
      size="lg" 
      showText={true} 
      showSubtitle={true}
      className={className}
    />
  )
}

export function ClueQuestLogoCompact({ className }: { className?: string }) {
  return (
    <ClueQuestLogo 
      size="sm" 
      showText={true} 
      showSubtitle={false}
      className={className}
    />
  )
}

export function ClueQuestLogoIcon({ className }: { className?: string }) {
  return (
    <ClueQuestLogo 
      size="md" 
      showText={false} 
      showSubtitle={false}
      className={className}
    />
  )
}
