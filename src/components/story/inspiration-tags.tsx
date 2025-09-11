/**
 * Inspiration Tags Component
 * Provides clickable tags to inspire story generation
 */

'use client'

import { useState } from 'react'
import { X, Plus, Sparkles, Brain } from 'lucide-react'

interface InspirationTagsProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  showKnowledgeBase?: boolean
  onKnowledgeBaseToggle?: (enabled: boolean) => void
  knowledgeBaseEnabled?: boolean
  className?: string
}

const inspirationCategories = {
  'Corporate': {
    icon: '🏢',
    tags: ['Office Building', 'Meeting Room', 'CEO Office', 'Conference Hall', 'Break Room', 'Parking Garage', 'Elevator', 'Reception Area']
  },
  'Mystery': {
    icon: '🔍',
    tags: ['Missing Documents', 'Stolen Laptop', 'Secret Code', 'Hidden Message', 'Locked Safe', 'Anonymous Note', 'Security Breach', 'Suspicious Activity']
  },
  'Team Building': {
    icon: '🎯',
    tags: ['Collaboration', 'Problem Solving', 'Communication', 'Leadership', 'Trust Building', 'Time Management', 'Decision Making', 'Creative Thinking']
  },
  'Business': {
    icon: '💼',
    tags: ['Quarterly Report', 'Client Meeting', 'Product Launch', 'Budget Review', 'Market Analysis', 'Strategic Planning', 'Team Performance', 'Company Culture']
  },
  'Technology': {
    icon: '💻',
    tags: ['Computer System', 'Database Access', 'Network Security', 'Software Update', 'Digital Files', 'Online Platform', 'Mobile App', 'Cloud Storage']
  },
  'Time Pressure': {
    icon: '⏰',
    tags: ['Deadline Approaching', 'Urgent Meeting', 'Time Limit', 'Countdown Timer', 'Rush Hour', 'Last Minute', 'Emergency', 'Quick Decision']
  }
}

export function InspirationTags({ 
  selectedTags, 
  onTagsChange, 
  showKnowledgeBase = true,
  onKnowledgeBaseToggle,
  knowledgeBaseEnabled = false,
  className 
}: InspirationTagsProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Corporate')
  const [customTags, setCustomTags] = useState<string[]>([])
  const [customTag, setCustomTag] = useState('')

  const handleTagClick = (tag: string) => {
    const newTags = selectedTags.includes(tag) 
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    
    onTagsChange(newTags)
  }

  const addCustomTag = (tag: string) => {
    if (tag.trim() && !selectedTags.includes(tag.trim()) && !customTags.includes(tag.trim())) {
      const newCustomTags = [...customTags, tag.trim()]
      setCustomTags(newCustomTags)
      onTagsChange?.([...selectedTags, tag.trim()])
    }
  }

  const removeCustomTag = (tag: string) => {
    const newCustomTags = customTags.filter(t => t !== tag)
    setCustomTags(newCustomTags)
    onTagsChange?.(selectedTags.filter(t => t !== tag))
  }

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* Knowledge Base Integration */}
      {showKnowledgeBase && (
        <div className="p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              <h4 className="font-semibold text-purple-200">🧠 Knowledge Base Inspiration</h4>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={knowledgeBaseEnabled}
                onChange={(e) => onKnowledgeBaseToggle?.(e.target.checked)}
              />
              <div className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                knowledgeBaseEnabled 
                  ? 'bg-purple-500' 
                  : 'bg-slate-600'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  knowledgeBaseEnabled ? 'translate-x-5' : 'translate-x-0'
                } mt-0.5 ml-0.5`}></div>
              </div>
            </label>
          </div>
          
          <p className="text-sm text-slate-300 mb-3">
            {knowledgeBaseEnabled 
              ? '✅ AI will draw inspiration from your organization\'s knowledge base while ensuring 100% original content'
              : '🚫 Standard AI generation without knowledge base context'
            }
          </p>
          
          {knowledgeBaseEnabled && (
            <div className="space-y-2">
              <div className="text-xs text-purple-300 font-medium">Originality Level:</div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-slate-700 hover:bg-purple-600 text-xs rounded-full transition-colors">
                  Standard (82% unique)
                </button>
                <button className="px-3 py-1 bg-purple-600 text-xs rounded-full">
                  Strict (85% unique)
                </button>
                <button className="px-3 py-1 bg-slate-700 hover:bg-purple-600 text-xs rounded-full transition-colors">
                  Enterprise (90% unique)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Category Selector */}
      <div>
        <h4 className="text-sm font-semibold text-purple-300 mb-3">🎨 Choose Inspiration Category:</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(inspirationCategories).map(([category, data]) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-purple-500/30 text-purple-200 border border-purple-500/50'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-600 hover:border-purple-500/50 hover:text-purple-300'
              }`}
            >
              <span className="mr-2">{data.icon}</span>
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Tags from Active Category */}
      <div>
        <h4 className="text-sm font-semibold text-purple-300 mb-3">✨ Click to Add Elements:</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {inspirationCategories[activeCategory as keyof typeof inspirationCategories]?.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                selectedTags.includes(tag)
                  ? 'bg-purple-500/30 text-purple-200 border border-purple-500/50'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-600 hover:border-purple-500/50 hover:text-purple-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Tags */}
      <div>
        <h4 className="text-sm font-semibold text-purple-300 mb-3">➕ Add Your Own Elements:</h4>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="e.g., 'conference room', 'missing keys', 'team challenge'"
            className="flex-1 px-3 py-2 bg-slate-900/80 border border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addCustomTag(e.currentTarget.value)
                e.currentTarget.value = ''
              }
            }}
          />
          <button
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement
              addCustomTag(input.value)
              input.value = ''
            }}
            className="px-3 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        {customTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {customTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-2 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-2"
              >
                {tag}
                <button
                  onClick={() => removeCustomTag(tag)}
                  className="hover:text-emerald-200 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Selected Tags Summary */}
      {selectedTags.length > 0 && (
        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-600/50">
          <h4 className="text-sm font-semibold text-emerald-300 mb-2">✅ Selected Elements ({selectedTags.length}):</h4>
          <div className="flex flex-wrap gap-1">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
