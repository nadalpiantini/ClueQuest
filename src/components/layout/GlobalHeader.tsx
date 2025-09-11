'use client'

import { ClueQuestLogo } from '@/components/branding/ClueQuestLogo'

interface GlobalHeaderProps {
  className?: string
}

export function GlobalHeader({ className = '' }: GlobalHeaderProps) {
  return (
    <header className={`w-full flex justify-center items-center py-8 ${className}`}>
      <ClueQuestLogo 
        size="3xl" 
        showText={true} 
        className="justify-center"
        priority={true}
      />
    </header>
  )
}
