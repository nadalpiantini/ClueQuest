'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ClueQuestLogoProps {
  className?: string
  href?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  priority?: boolean
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8', 
  lg: 'h-12 w-12',
  xl: 'h-20 w-20',
  '2xl': 'h-32 w-32',
  '3xl': 'h-40 w-40',
  '4xl': 'h-48 w-48',
  '5xl': 'h-64 w-64'
}

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-2xl',
  '2xl': 'text-3xl',
  '3xl': 'text-6xl',
  '4xl': 'text-7xl',
  '5xl': 'text-8xl'
}

export function ClueQuestLogo({ 
  className, 
  href = '/', 
  showText = true, 
  size = 'md',
  priority = false 
}: ClueQuestLogoProps) {
  const logoElement = (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <Image
        src="/images/Cluequest_logo.png"
        alt="ClueQuest Logo"
        width={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : size === 'xl' ? 80 : size === '2xl' ? 128 : size === '3xl' ? 160 : size === '4xl' ? 192 : 256}
        height={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : size === 'xl' ? 80 : size === '2xl' ? 128 : size === '3xl' ? 160 : size === '4xl' ? 192 : 256}
        className={cn(sizeClasses[size], 'object-contain')}
        priority={priority}
      />
      {showText && (
        <span className={cn(
          'font-bold bg-gradient-to-r from-amber-400 via-orange-300 to-purple-400 bg-clip-text text-transparent',
          textSizeClasses[size]
        )}>
          ClueQuest
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {logoElement}
      </Link>
    )
  }

  return logoElement
}
