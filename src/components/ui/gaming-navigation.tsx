/**
 * Gaming Navigation System
 * Cinematic navigation components for ClueQuest
 */

'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { 
  Search, 
  Lock, 
  User, 
  Settings, 
  Trophy, 
  Gamepad2,
  Menu,
  X,
  Zap,
  Shield,
  Star
} from 'lucide-react'
import { GamingButton, GamingBadge } from './gaming-components'

interface GamingNavProps {
  className?: string
}

export const GamingNav = ({ className }: GamingNavProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Adventures', href: '/adventures', icon: Gamepad2 },
    { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { label: 'My Quests', href: '/quests', icon: User },
    { label: 'Premium', href: '/premium', icon: Star, badge: 'NEW' },
  ]

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isScrolled 
        ? "bg-slate-900/95 backdrop-blur-md border-b border-gaming-gold/20" 
        : "bg-transparent",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Gaming Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="mystery-button p-2 rounded-xl">
              <Search className="h-6 w-6" />
            </div>
            <div className="gaming-text text-xl font-black tracking-wider">
              CLUEQUEST
            </div>
            <GamingBadge variant="emerald" size="sm" pulse>
              <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
              LIVE
            </GamingBadge>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const { label, href, icon: Icon, badge } = item
              return (
                <a
                  key={label}
                  href={href}
                  className="group relative flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-gaming-gold transition-colors duration-200"
                >
                  <Icon className="h-5 w-5 group-hover:animate-gaming-bounce" />
                  <span className="font-semibold">{label}</span>
                  {badge && (
                    <GamingBadge variant="gold" size="sm" className="ml-2">
                      {badge}
                    </GamingBadge>
                  )}
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-lg bg-gaming-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </a>
              )
            })}
          </div>

          {/* Gaming Actions */}
          <div className="hidden md:flex items-center gap-4">
            <GamingButton variant="ghost" size="sm">
              <Lock className="h-4 w-4" />
              Login
            </GamingButton>
            
            <GamingButton size="sm">
              <Zap className="h-4 w-4" />
              Start Quest
            </GamingButton>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mystery-button p-3 rounded-xl"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden gaming-card mx-4 mt-4 p-6 animate-escape-entrance">
          <div className="space-y-4">
            {navItems.map((item) => {
              const { label, href, icon: Icon, badge } = item
              return (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gaming-gold/10 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 text-gaming-gold" />
                  <span className="text-slate-200 font-semibold flex-1">{label}</span>
                  {badge && (
                    <GamingBadge variant="gold" size="sm">
                      {badge}
                    </GamingBadge>
                  )}
                </a>
              )
            })}
            
            <div className="pt-4 border-t border-gaming-gold/20 space-y-3">
              <GamingButton variant="ghost" size="md" className="w-full">
                <Lock className="h-4 w-4" />
                Login
              </GamingButton>
              
              <GamingButton size="md" className="w-full">
                <Zap className="h-4 w-4" />
                Start Quest
              </GamingButton>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

// =====================================
// GAMING BREADCRUMB SYSTEM
// =====================================

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<any>
}

interface GamingBreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export const GamingBreadcrumb = ({ items, className }: GamingBreadcrumbProps) => {
  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const { label, href, icon: Icon } = item
        
        return (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && (
              <div className="text-gaming-gold/50">→</div>
            )}
            
            {href && !isLast ? (
              <a
                href={href}
                className="flex items-center gap-2 text-slate-400 hover:text-gaming-gold transition-colors duration-200"
              >
                {Icon && <Icon className="h-4 w-4" />}
                {label}
              </a>
            ) : (
              <div className={cn(
                "flex items-center gap-2",
                isLast ? "text-gaming-gold font-semibold" : "text-slate-400"
              )}>
                {Icon && <Icon className="h-4 w-4" />}
                {label}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// =====================================
// GAMING SIDEBAR NAVIGATION
// =====================================

interface SidebarItem {
  label: string
  href: string
  icon: React.ComponentType<any>
  badge?: string
  count?: number
}

interface GamingSidebarProps {
  items: SidebarItem[]
  currentPath: string
  className?: string
}

export const GamingSidebar = ({ items, currentPath, className }: GamingSidebarProps) => {
  return (
    <div className={cn("gaming-card p-6 space-y-2", className)}>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="mystery-button p-2 rounded-lg">
            <Gamepad2 className="h-5 w-5" />
          </div>
          <h3 className="gaming-text font-bold">NAVIGATION</h3>
        </div>
      </div>
      
      {items.map((item) => {
        const { label, href, icon: Icon, badge, count } = item
        const isActive = currentPath === href
        
        return (
          <a
            key={label}
            href={href}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group",
              isActive 
                ? "bg-gaming-gold/20 border border-gaming-gold/40 text-gaming-gold" 
                : "text-slate-300 hover:bg-gaming-gold/10 hover:text-gaming-gold"
            )}
          >
            <Icon className={cn(
              "h-5 w-5 transition-transform duration-200",
              isActive && "animate-mystery-pulse",
              !isActive && "group-hover:animate-gaming-bounce"
            )} />
            
            <span className="font-semibold flex-1">{label}</span>
            
            {badge && (
              <GamingBadge variant="gold" size="sm">
                {badge}
              </GamingBadge>
            )}
            
            {count && count > 0 && (
              <div className="bg-mystery-purple/20 border border-mystery-purple/40 text-mystery-purple-bright px-2 py-1 rounded-full text-xs font-bold">
                {count}
              </div>
            )}
          </a>
        )
      })}
    </div>
  )
}

// =====================================
// GAMING FOOTER NAVIGATION
// =====================================

interface GamingFooterNavProps {
  className?: string
}

export const GamingFooterNav = ({ className }: GamingFooterNavProps) => {
  const footerLinks = [
    { label: 'Adventures', href: '/adventures' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'Support', href: '/support' },
    { label: 'API Docs', href: '/docs' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ]

  return (
    <div className={cn("border-t border-gaming-gold/20 pt-8", className)}>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {footerLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-slate-400 hover:text-gaming-gold transition-colors duration-200 font-medium text-center"
          >
            {link.label}
          </a>
        ))}
      </div>
      
      <div className="mt-8 pt-8 border-t border-gaming-gold/10 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-500">
          <Shield className="h-4 w-4" />
          <span className="text-sm">
            © 2025 ClueQuest. Built for mystery solvers worldwide.
          </span>
        </div>
      </div>
    </div>
  )
}