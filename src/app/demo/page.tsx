/**
 * Gaming Components Demo Page
 * Showcases the premium gaming design system
 */

'use client'

import { useState } from 'react'
import { 
  Users, 
  Trophy, 
  Zap, 
  Search, 
  Lock, 
  Smartphone, 
  Gamepad2,
  Star,
  Shield,
  Target,
  Clock,
  MapPin,
  Eye,
  Play
} from 'lucide-react'

import {
  GamingButton,
  GamingCard,
  HologramContainer,
  GamingText,
  GamingInput,
  GamingProgress,
  GamingBadge,
  GamingLoader,
  GamingStats,
  GamingToast
} from '@/components/ui/gaming-components'

import {
  GamingNav,
  GamingBreadcrumb,
  GamingSidebar
} from '@/components/ui/gaming-navigation'

export default function GamingDemo() {
  const [showToast, setShowToast] = useState(true)
  const [progress, setProgress] = useState(75)

  const sidebarItems = [
    { label: 'Dashboard', href: '/demo', icon: Gamepad2, count: 3 },
    { label: 'Active Quests', href: '/demo/quests', icon: Target, badge: 'NEW' },
    { label: 'Leaderboard', href: '/demo/leaderboard', icon: Trophy },
    { label: 'Team', href: '/demo/team', icon: Users, count: 12 },
    { label: 'Settings', href: '/demo/settings', icon: Shield },
  ]

  const breadcrumbItems = [
    { label: 'ClueQuest', href: '/', icon: Search },
    { label: 'Demo', href: '/demo', icon: Star },
    { label: 'Gaming Components' }
  ]

  const stats = [
    { 
      label: 'Quests Completed', 
      value: '42', 
      icon: <Trophy className="h-8 w-8 text-gaming-gold" />,
      color: 'text-gaming-gold' 
    },
    { 
      label: 'Team Rank', 
      value: '#7', 
      icon: <Users className="h-8 w-8 text-mystery-purple" />,
      color: 'text-mystery-purple' 
    },
    { 
      label: 'Exp Points', 
      value: '15.2K', 
      icon: <Zap className="h-8 w-8 text-emerald-400" />,
      color: 'text-emerald-400' 
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900">
      
      {/* Gaming Navigation */}
      <GamingNav />
      
      {/* Main Layout */}
      <div className="pt-24 flex">
        
        {/* Gaming Sidebar */}
        <div className="hidden lg:block w-80 p-6">
          <GamingSidebar 
            items={sidebarItems} 
            currentPath="/demo"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-8">
          
          {/* Gaming Breadcrumb */}
          <GamingBreadcrumb items={breadcrumbItems} />
          
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h1 className="mystery-title text-4xl md:text-6xl font-black">
                GAMING COMPONENTS
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Experience the <GamingText variant="glow">premium design system</GamingText> powering 
                ClueQuest's cinematic gaming interface.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <GamingButton variant="mystery" size="lg">
                <Play className="h-6 w-6" />
                Begin Adventure
              </GamingButton>
              
              <GamingButton variant="ghost" size="lg">
                <Eye className="h-6 w-6" />
                Watch Demo
              </GamingButton>
              
              <GamingButton variant="outline" size="lg">
                <Search className="h-6 w-6" />
                Explore
              </GamingButton>
            </div>
          </div>

          {/* Gaming Stats */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black gaming-text">LIVE STATISTICS</h2>
            <GamingStats stats={stats} />
          </div>

          {/* Interactive Components Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Gaming Cards Demo */}
            <GamingCard className="p-8 space-y-6">
              <h3 className="text-2xl font-bold gaming-text">GAMING CARDS</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <GamingCard hover glow className="p-6 text-center">
                  <HologramContainer className="mb-4 p-4">
                    <Smartphone className="h-8 w-8 text-gaming-gold mx-auto" />
                  </HologramContainer>
                  <h4 className="font-bold text-gaming-gold mb-2">QR SCANNER</h4>
                  <p className="text-sm text-slate-300">Scan clues to progress</p>
                </GamingCard>
                
                <GamingCard hover className="p-6 text-center">
                  <HologramContainer className="mb-4 p-4">
                    <Users className="h-8 w-8 text-mystery-purple mx-auto" />
                  </HologramContainer>
                  <h4 className="font-bold text-mystery-purple-bright mb-2">TEAM SYNC</h4>
                  <p className="text-sm text-slate-300">Real-time collaboration</p>
                </GamingCard>
              </div>
            </GamingCard>

            {/* Form Components Demo */}
            <GamingCard className="p-8 space-y-6">
              <h3 className="text-2xl font-bold gaming-text">FORM ELEMENTS</h3>
              
              <div className="space-y-4">
                <GamingInput 
                  label="Player Name"
                  placeholder="Enter your gaming alias..."
                  defaultValue="MysteryHunter42"
                />
                
                <GamingInput 
                  label="Team Code" 
                  placeholder="6-digit access code"
                  defaultValue="QST001"
                />
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gaming-gold uppercase tracking-wide">
                    Quest Progress
                  </label>
                  <GamingProgress 
                    value={progress} 
                    label="The Cipher Chamber"
                    showPercentage
                  />
                  <div className="flex gap-2">
                    <GamingButton 
                      size="sm" 
                      onClick={() => setProgress(Math.max(0, progress - 10))}
                    >
                      -10%
                    </GamingButton>
                    <GamingButton 
                      size="sm"
                      onClick={() => setProgress(Math.min(100, progress + 10))}
                    >
                      +10%
                    </GamingButton>
                  </div>
                </div>
              </div>
            </GamingCard>
            
            {/* Badges and Indicators */}
            <GamingCard className="p-8 space-y-6">
              <h3 className="text-2xl font-bold gaming-text">GAMING BADGES</h3>
              
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-slate-300">Status Indicators</h4>
                  <div className="flex flex-wrap gap-3">
                    <GamingBadge variant="gold" pulse>
                      <div className="h-2 w-2 rounded-full bg-gaming-gold animate-ping mr-1"></div>
                      ONLINE
                    </GamingBadge>
                    <GamingBadge variant="purple">
                      <Zap className="h-3 w-3" />
                      AI POWERED
                    </GamingBadge>
                    <GamingBadge variant="emerald">
                      <Shield className="h-3 w-3" />
                      SECURE
                    </GamingBadge>
                    <GamingBadge variant="red">
                      <Clock className="h-3 w-3" />
                      URGENT
                    </GamingBadge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-slate-300">Achievement Badges</h4>
                  <div className="flex flex-wrap gap-3">
                    <GamingBadge variant="gold" size="lg">
                      <Trophy className="h-4 w-4" />
                      CHAMPION
                    </GamingBadge>
                    <GamingBadge variant="purple" size="lg">
                      <Star className="h-4 w-4" />
                      EXPERT
                    </GamingBadge>
                    <GamingBadge variant="emerald" size="lg">
                      <Target className="h-4 w-4" />
                      MASTER
                    </GamingBadge>
                  </div>
                </div>
              </div>
            </GamingCard>

            {/* Loading States */}
            <GamingCard className="p-8 space-y-6">
              <h3 className="text-2xl font-bold gaming-text">LOADING STATES</h3>
              
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <GamingLoader size="lg" />
                  <p className="text-slate-300 font-medium">Initializing Quest...</p>
                </div>
                
                <div className="flex items-center justify-center gap-6">
                  <GamingLoader size="sm" />
                  <GamingLoader size="md" />
                  <GamingLoader size="lg" />
                </div>
                
                <div className="space-y-4">
                  <GamingProgress value={33} label="Loading Adventure Data" />
                  <GamingProgress value={66} label="Connecting to AI Master" />
                  <GamingProgress value={90} label="Preparing Virtual Environment" />
                </div>
              </div>
            </GamingCard>
          </div>

          {/* Text Variants Demo */}
          <GamingCard className="p-8 space-y-6">
            <h3 className="text-2xl font-bold gaming-text">TEXT EFFECTS</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-300 mb-2">Title Effect</h4>
                <GamingText variant="title" className="text-4xl">
                  MYSTERY SOLVED
                </GamingText>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-slate-300 mb-2">Glow Effect</h4>
                <GamingText variant="glow" className="text-2xl">
                  ACHIEVEMENT UNLOCKED
                </GamingText>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-slate-300 mb-2">Normal Text</h4>
                <GamingText variant="normal">
                  Standard readable text for descriptions and content that maintains 
                  the gaming aesthetic while being perfectly legible.
                </GamingText>
              </div>
            </div>
          </GamingCard>

          {/* Live Demo Section */}
          <GamingCard className="p-8 space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-black gaming-text">LIVE GAMING EXPERIENCE</h3>
              <p className="text-slate-300">
                This design system powers ClueQuest's premium gaming interface, 
                delivering 60fps animations and cinematic effects.
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <GamingBadge variant="emerald" pulse size="lg">
                  <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></div>
                  SYSTEM ONLINE
                </GamingBadge>
                
                <GamingBadge variant="gold" size="lg">
                  <Zap className="h-4 w-4" />
                  60 FPS
                </GamingBadge>
                
                <GamingBadge variant="purple" size="lg">
                  <Shield className="h-4 w-4" />
                  ENTERPRISE READY
                </GamingBadge>
              </div>
              
              <div className="pt-6">
                <GamingButton size="xl">
                  <Gamepad2 className="h-6 w-6" />
                  EXPERIENCE THE REVOLUTION
                  <Star className="h-6 w-6" />
                </GamingButton>
              </div>
            </div>
          </GamingCard>
        </div>
      </div>

      {/* Gaming Toast Notification */}
      <div className="fixed bottom-6 right-6 z-50">
        <GamingToast
          title="Gaming System Online"
          description="All components loaded successfully"
          variant="success"
          visible={showToast}
          onClose={() => setShowToast(false)}
        />
      </div>
    </div>
  )
}