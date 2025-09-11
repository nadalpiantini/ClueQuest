'use client'

import React, { useState } from 'react'
import { 
  MapPin,
  Target,
  Sticker,
  Map,
  Settings,
  ArrowRight,
  Users
} from 'lucide-react'
import { motion } from 'framer-motion'
import { GamingButton, GamingBadge } from '@/components/ui/gaming-components'
import LocationManager from './LocationManager'
import ChallengeDesigner, { Challenge } from './ChallengeDesigner'
import QRStickerGenerator from './QRStickerGenerator'
import ActivityCoordinator from './ActivityCoordinator'
import { AdventureBuilderErrorBoundary } from './AdventureBuilderErrorBoundary'

interface AdventureActivitiesBuilderProps {
  adventureData: any
  updateAdventureData: (data: any) => void
}

export default function AdventureActivitiesBuilder({
  adventureData,
  updateAdventureData
}: AdventureActivitiesBuilderProps) {
  const [activeTab, setActiveTab] = useState<'locations' | 'challenges' | 'stickers' | 'coordinator'>('locations')

  const tabs = [
    {
      id: 'locations',
      name: 'Locations',
      icon: MapPin,
      description: 'Manage physical locations',
      color: 'amber',
      count: adventureData.locations?.length || 0
    },
    {
      id: 'challenges',
      name: 'Challenges',
      icon: Target,
      description: 'Design puzzles & tasks',
      color: 'purple',
      count: adventureData.challenges?.length || 0
    },
    {
      id: 'stickers',
      name: 'QR Stickers',
      icon: Sticker,
      description: 'Generate physical QR stickers',
      color: 'pink',
      count: adventureData.qrStickers?.length || 0
    },
    {
      id: 'coordinator',
      name: 'Activity Map',
      icon: Map,
      description: 'Connect everything together',
      color: 'blue',
      count: adventureData.activityMappings?.length || 0
    }
  ]

  const getTabCompletion = () => {
    return {
      locations: (adventureData.locations?.length || 0) > 0,
      challenges: (adventureData.challenges?.length || 0) > 0,
      stickers: (adventureData.qrStickers?.length || 0) > 0,
      coordinator: (adventureData.activityMappings?.length || 0) > 0
    }
  }

  const completion = getTabCompletion()
  const overallProgress = Object.values(completion).filter(Boolean).length / Object.keys(completion).length * 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-red-200 mb-3 flex items-center justify-center gap-3">
          <MapPin className="h-8 w-8" />
          Step 4: Adventure Activities
        </h2>
        <p className="text-slate-400 max-w-3xl mx-auto">
          Design your complete adventure experience with our new modular system. 
          Create locations, design challenges, generate QR stickers, and coordinate the perfect activity flow.
        </p>
      </div>

      {/* Adventure Type Selection */}
      <div className="p-6 rounded-xl border border-purple-500/30 bg-purple-500/5">
        <h4 className="text-lg font-bold text-purple-200 mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Adventure Flow Type
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              id: 'linear',
              name: 'Linear Adventure',
              description: 'Participants discover challenges in sequence - perfect for storytelling',
              icon: ArrowRight,
              color: 'amber'
            },
            {
              id: 'parallel',
              name: 'Parallel Adventure', 
              description: 'Multiple challenges available simultaneously - great for teams',
              icon: Users,
              color: 'emerald'
            },
            {
              id: 'hub',
              name: 'Hub Adventure',
              description: 'Central location with branching paths - flexible exploration',
              icon: Target,
              color: 'purple'
            }
          ].map((type) => {
            const Icon = type.icon
            const isSelected = adventureData.adventureType === type.id
            
            return (
              <button
                key={type.id}
                onClick={() => updateAdventureData({
                  ...adventureData,
                  adventureType: type.id as 'linear' | 'parallel' | 'hub'
                })}
                className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                  isSelected
                    ? `border-${type.color}-400 bg-${type.color}-500/20 ring-2 ring-${type.color}-500/20`
                    : 'border-slate-600 bg-slate-800/40 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`h-5 w-5 ${
                    isSelected ? `text-${type.color}-300` : 'text-slate-400'
                  }`} />
                  <span className={`font-semibold ${
                    isSelected ? `text-${type.color}-200` : 'text-slate-200'
                  }`}>
                    {type.name}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">{type.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="p-6 rounded-xl border border-slate-600/50 bg-slate-800/30">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-slate-200">Progress Overview</h4>
          <div className="flex items-center gap-2">
            <div className={`text-lg font-bold ${overallProgress === 100 ? 'text-emerald-400' : overallProgress >= 50 ? 'text-amber-400' : 'text-slate-400'}`}>
              {Math.round(overallProgress)}%
            </div>
            <div className="text-sm text-slate-400">Complete</div>
          </div>
        </div>
        
        <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${overallProgress === 100 ? 'bg-emerald-500' : overallProgress >= 50 ? 'bg-amber-500' : 'bg-slate-500'}`}
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-4 gap-4 text-center">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isComplete = completion[tab.id as keyof typeof completion]
            
            return (
              <div key={tab.id} className={`p-3 rounded-lg border ${isComplete ? `border-${tab.color}-500/30 bg-${tab.color}-500/5` : 'border-slate-600/50 bg-slate-800/20'}`}>
                <Icon className={`h-5 w-5 mx-auto mb-2 ${isComplete ? `text-${tab.color}-400` : 'text-slate-500'}`} />
                <div className={`text-sm font-semibold ${isComplete ? `text-${tab.color}-200` : 'text-slate-400'}`}>
                  {tab.name}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {tab.count} items
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-600">
        <div className="flex overflow-x-auto gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            const isComplete = completion[tab.id as keyof typeof completion]
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-shrink-0 flex items-center gap-3 px-6 py-4 font-medium text-sm transition-all duration-200 border-b-2 ${
                  isActive
                    ? `border-${tab.color}-500 text-${tab.color}-200 bg-${tab.color}-500/5`
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? `text-${tab.color}-400` : 'text-slate-500'}`} />
                <span>{tab.name}</span>
                {tab.count > 0 && (
                  <GamingBadge
                    variant={isActive ? tab.color as any : 'slate'}
                    size="sm"
                  >
                    {tab.count}
                  </GamingBadge>
                )}
                {isComplete && (
                  <div className={`w-2 h-2 rounded-full bg-${tab.color}-500`}></div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content with Error Boundaries */}
      <div className="min-h-[600px]">
        {activeTab === 'locations' && (
          <AdventureBuilderErrorBoundary>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LocationManager
                locations={adventureData.locations || []}
                onLocationsChange={(locations) => updateAdventureData({
                  ...adventureData,
                  locations
                })}
                adventureType={adventureData.adventureType || 'linear'}
                maxLocations={20}
                enableGeofencing={true}
              />
            </motion.div>
          </AdventureBuilderErrorBoundary>
        )}

        {activeTab === 'challenges' && (
          <AdventureBuilderErrorBoundary>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChallengeDesigner
                challenges={adventureData.challenges || []}
                onChallengesChange={(challenges) => updateAdventureData({
                  ...adventureData,
                  challenges
                })}
                maxChallenges={50}
              />
            </motion.div>
          </AdventureBuilderErrorBoundary>
        )}

        {activeTab === 'stickers' && (
          <AdventureBuilderErrorBoundary>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <QRStickerGenerator
                challenges={adventureData.challenges || []}
                adventureId={adventureData.id || crypto.randomUUID()}
                onStickersGenerated={(stickers) => updateAdventureData({
                  ...adventureData,
                  qrStickers: stickers,
                  id: adventureData.id || crypto.randomUUID()
                })}
                existingStickers={adventureData.qrStickers || []}
              />
            </motion.div>
          </AdventureBuilderErrorBoundary>
        )}

        {activeTab === 'coordinator' && (
          <AdventureBuilderErrorBoundary>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ActivityCoordinator
                challenges={adventureData.challenges || []}
                locations={adventureData.locations || []}
                qrStickers={adventureData.qrStickers || []}
                adventureType={adventureData.adventureType || 'linear'}
                onMappingsChange={(mappings) => updateAdventureData({
                  ...adventureData,
                  activityMappings: mappings
                })}
                existingMappings={adventureData.activityMappings || []}
              />
            </motion.div>
          </AdventureBuilderErrorBoundary>
        )}
      </div>

      {/* Next Step Guidance */}
      {overallProgress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-center"
        >
          <div className="text-emerald-200 font-bold text-lg mb-2">
            🎉 Adventure Activities Complete!
          </div>
          <p className="text-emerald-300/80 mb-4">
            Your adventure flow is fully configured with {adventureData.locations?.length || 0} locations, 
            {adventureData.challenges?.length || 0} challenges, {adventureData.qrStickers?.length || 0} QR stickers, 
            and {adventureData.activityMappings?.length || 0} activity mappings.
          </p>
          <p className="text-slate-300 text-sm">
            Ready to proceed to Step 5: Rewards & Security Configuration
          </p>
        </motion.div>
      )}
    </div>
  )
}