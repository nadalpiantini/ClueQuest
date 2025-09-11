'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Star, 
  Play, 
  Eye,
  Zap,
  Shield,
  BookOpen,
  Building2,
  Search as SearchIcon
} from 'lucide-react'

interface Template {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  estimated_duration: number
  theme_name: string
  theme_config: {
    primary_color: string
    secondary_color: string
    visual_style: string
    background_music?: string
  }
  max_participants: number
  template_id: string
  template_metadata: {
    scene_count: number
    progression_type: string
    puzzle_types: string[]
    character_roles: Array<{
      id: string
      name: string
      color: string
      abilities: string[]
    }>
    learning_objectives: string[]
    special_mechanics: Record<string, any>
  }
  narrative_hook: string
  recommended_group_size: number
  inspiration_sources: string[]
  analytics: {
    instantiation_count: number
    average_rating: number
    completion_rate: number
  }
}

interface TemplateCategory {
  slug: string
  name: string
  description: string
  icon_url?: string
  color_scheme: Record<string, any>
}

interface TemplateSelectorProps {
  onSelectTemplate: (template: Template) => void
  onInstantiateTemplate: (templateId: string, customizations?: any) => void
  className?: string
}

const THEME_ICONS = {
  mystery: SearchIcon,
  fantasy: Zap,
  hacker: Shield,
  corporate: Building2,
  educational: BookOpen
}

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-500',
  intermediate: 'bg-yellow-500', 
  advanced: 'bg-orange-500',
  expert: 'bg-red-500'
}

export default function TemplateSelector({ 
  onSelectTemplate, 
  onInstantiateTemplate,
  className 
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [categories, setCategories] = useState<TemplateCategory[]>([])
  const [availableTags, setAvailableTags] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedTheme, setSelectedTheme] = useState<string>('all')
  const [minDuration, setMinDuration] = useState<number>(0)
  const [maxDuration, setMaxDuration] = useState<number>(120)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  // UI State
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [showTemplateDetail, setShowTemplateDetail] = useState(false)
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)

  useEffect(() => {
    fetchTemplates()
  }, [selectedCategory, selectedDifficulty, minDuration, maxDuration, selectedTags])

  const fetchTemplates = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty)
      if (minDuration > 0) params.append('minDuration', minDuration.toString())
      if (maxDuration < 120) params.append('maxDuration', maxDuration.toString())
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','))

      const response = await fetch(`/api/templates?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch templates')
      }
      
      const data = await response.json()
      setTemplates(data.templates || [])
      setCategories(data.categories || [])
      setAvailableTags(data.available_tags || {})
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const filteredTemplates = templates.filter(template => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        template.title.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.narrative_hook.toLowerCase().includes(query) ||
        template.template_metadata.learning_objectives?.some(obj => 
          obj.toLowerCase().includes(query)
        )
      )
    }
    
    if (selectedTheme !== 'all' && template.theme_name !== selectedTheme) {
      return false
    }
    
    return true
  })

  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    const theme = template.theme_name
    if (!acc[theme]) acc[theme] = []
    acc[theme].push(template)
    return acc
  }, {} as Record<string, Template[]>)

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template)
    setShowTemplateDetail(true)
  }

  const handleInstantiate = async (template: Template) => {
    try {
      await onInstantiateTemplate(template.template_id)
      setShowTemplateDetail(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create adventure')
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchTemplates}>Retry</Button>
      </div>
    )
  }

  return (
    <div className={`template-selector ${className}`}>
      {/* Header & Search */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Choose Your Adventure Template
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Professional escape room experiences designed for maximum engagement
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setFilterPanelOpen(!filterPanelOpen)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {(selectedTags.length > 0 || selectedTheme !== 'all') && (
                <Badge variant="secondary" className="ml-1">
                  {selectedTags.length + (selectedTheme !== 'all' ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search adventures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {filterPanelOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Theme Filter */}
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="All themes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Themes</SelectItem>
                    <SelectItem value="mystery">🕵️ Mystery</SelectItem>
                    <SelectItem value="fantasy">🧙‍♂️ Fantasy</SelectItem>
                    <SelectItem value="hacker">💻 Hacker</SelectItem>
                    <SelectItem value="corporate">🏢 Corporate</SelectItem>
                    <SelectItem value="educational">📚 Educational</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All difficulties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration Range */}
              <div>
                <Label>Duration (minutes)</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    value={minDuration}
                    onChange={(e) => setMinDuration(parseInt(e.target.value) || 0)}
                    placeholder="Min"
                    className="w-20"
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    value={maxDuration}
                    onChange={(e) => setMaxDuration(parseInt(e.target.value) || 120)}
                    placeholder="Max"
                    className="w-20"
                  />
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <Label>Quick Filters</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Object.entries(availableTags).slice(0, 6).map(([type, tags]) =>
                    tags.slice(0, 2).map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                        className="cursor-pointer text-xs"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag.replace('_', ' ')}
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedTags.length > 0 || selectedTheme !== 'all' || selectedDifficulty !== 'all') && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                  {selectedTheme !== 'all' && (
                    <Badge variant="secondary">
                      Theme: {selectedTheme}
                      <button 
                        onClick={() => setSelectedTheme('all')}
                        className="ml-1 hover:bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {selectedDifficulty !== 'all' && (
                    <Badge variant="secondary">
                      Difficulty: {selectedDifficulty}
                      <button 
                        onClick={() => setSelectedDifficulty('all')}
                        className="ml-1 hover:bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {selectedTags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag.replace('_', ' ')}
                      <button 
                        onClick={() => toggleTag(tag)}
                        className="ml-1 hover:bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template Grid by Theme */}
      <Tabs value={selectedTheme === 'all' ? 'all' : selectedTheme} onValueChange={setSelectedTheme}>
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            All
          </TabsTrigger>
          <TabsTrigger value="mystery" className="flex items-center gap-2">
            🕵️ Mystery
          </TabsTrigger>
          <TabsTrigger value="fantasy" className="flex items-center gap-2">
            🧙‍♂️ Fantasy
          </TabsTrigger>
          <TabsTrigger value="hacker" className="flex items-center gap-2">
            💻 Hacker
          </TabsTrigger>
          <TabsTrigger value="corporate" className="flex items-center gap-2">
            🏢 Corporate
          </TabsTrigger>
          <TabsTrigger value="educational" className="flex items-center gap-2">
            📚 Educational
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {Object.entries(groupedTemplates).map(([theme, themeTemplates]) => (
            <div key={theme} className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 capitalize">
                {theme === 'mystery' && '🕵️'}
                {theme === 'fantasy' && '🧙‍♂️'}
                {theme === 'hacker' && '💻'}
                {theme === 'corporate' && '🏢'}
                {theme === 'educational' && '📚'}
                {theme} Adventures
                <Badge variant="outline">{themeTemplates.length}</Badge>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {themeTemplates.map((template) => (
                  <TemplateCard 
                    key={template.id} 
                    template={template} 
                    onClick={() => handleTemplateClick(template)}
                  />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {Object.keys(groupedTemplates).map(theme => (
          <TabsContent key={theme} value={theme}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedTemplates[theme]?.map((template) => (
                <TemplateCard 
                  key={template.id} 
                  template={template} 
                  onClick={() => handleTemplateClick(template)}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No templates match your current filters
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery('')
              setSelectedTheme('all')
              setSelectedDifficulty('all')
              setSelectedTags([])
              setMinDuration(0)
              setMaxDuration(120)
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Template Detail Modal */}
      <Dialog open={showTemplateDetail} onOpenChange={setShowTemplateDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTemplate && (
            <TemplateDetailModal 
              template={selectedTemplate}
              onInstantiate={() => handleInstantiate(selectedTemplate)}
              onClose={() => setShowTemplateDetail(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Template Card Component
function TemplateCard({ template, onClick }: { template: Template; onClick: () => void }) {
  const IconComponent = THEME_ICONS[template.theme_name as keyof typeof THEME_ICONS] || BookOpen
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: template.theme_config.primary_color }}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg leading-tight">{template.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    className={`text-xs ${DIFFICULTY_COLORS[template.difficulty]} text-white`}
                  >
                    {template.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {template.theme_name}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <CardDescription className="text-sm mb-4 line-clamp-2">
            {template.narrative_hook}
          </CardDescription>
          
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {template.estimated_duration}m
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {template.recommended_group_size}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {template.analytics.average_rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {template.template_metadata.puzzle_types?.slice(0, 3).map((type, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {type.replace('_', ' ')}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={onClick} variant="outline" size="sm" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={(e) => {
                e.stopPropagation()
                onClick()
              }}
              size="sm" 
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              Use Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Template Detail Modal Component
function TemplateDetailModal({ 
  template, 
  onInstantiate, 
  onClose 
}: { 
  template: Template
  onInstantiate: () => void
  onClose: () => void 
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: template.theme_config.primary_color }}
          >
            {template.theme_name === 'mystery' && '🕵️'}
            {template.theme_name === 'fantasy' && '🧙‍♂️'}
            {template.theme_name === 'hacker' && '💻'}
            {template.theme_name === 'corporate' && '🏢'}
            {template.theme_name === 'educational' && '📚'}
          </div>
          <div>
            <div>{template.title}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-normal">
              {template.theme_name} • {template.difficulty} • {template.estimated_duration} minutes
            </div>
          </div>
        </DialogTitle>
        <DialogDescription>
          {template.description}
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Story Hook */}
          <div>
            <h4 className="font-semibold mb-2">Adventure Story</h4>
            <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg italic">
              "{template.narrative_hook}"
            </p>
          </div>

          {/* Learning Objectives */}
          {template.template_metadata.learning_objectives?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Learning Objectives</h4>
              <div className="flex flex-wrap gap-2">
                {template.template_metadata.learning_objectives.map((objective, index) => (
                  <Badge key={index} variant="secondary">
                    {objective}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Character Roles */}
          {template.template_metadata.character_roles?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Character Roles</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {template.template_metadata.character_roles.map((role, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div 
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: role.color }}
                    />
                    <div>
                      <div className="font-medium">{role.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {role.abilities.join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="space-y-3">
            <h4 className="font-semibold">Adventure Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{template.estimated_duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Players:</span>
                <span>Up to {template.max_participants}</span>
              </div>
              <div className="flex justify-between">
                <span>Scenes:</span>
                <span>{template.template_metadata.scene_count}</span>
              </div>
              <div className="flex justify-between">
                <span>Difficulty:</span>
                <Badge className={`${DIFFICULTY_COLORS[template.difficulty]} text-white`}>
                  {template.difficulty}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Used:</span>
                <span>{template.analytics.instantiation_count} times</span>
              </div>
              <div className="flex justify-between">
                <span>Rating:</span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {template.analytics.average_rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Puzzle Types */}
          <div>
            <h4 className="font-semibold mb-2">Puzzle Types</h4>
            <div className="flex flex-wrap gap-1">
              {template.template_metadata.puzzle_types?.map((type, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {type.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>

          {/* Special Mechanics */}
          {template.template_metadata.special_mechanics && (
            <div>
              <h4 className="font-semibold mb-2">Special Features</h4>
              <div className="text-sm space-y-1">
                {Object.entries(template.template_metadata.special_mechanics).map(([key, value]) => (
                  <div key={key} className="text-gray-600 dark:text-gray-400">
                    • {key.replace('_', ' ')}: {value}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-4 border-t">
            <Button onClick={onInstantiate} className="w-full" size="lg">
              <Play className="w-4 h-4 mr-2" />
              Create This Adventure
            </Button>
            <Button onClick={onClose} variant="outline" className="w-full">
              Close Preview
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}