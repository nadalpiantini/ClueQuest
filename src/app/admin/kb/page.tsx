'use client'

/**
 * ClueQuest Knowledge Base Admin Dashboard
 * Simple administration interface for managing the Knowledge Base
 */

import React, { useState, useEffect } from 'react'
import { Search, Book, FileText, Database, Zap, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface KBSource {
  id: string
  title: string
  description: string
  source_type: string
  content_category: string
  total_chunks: number
  processing_status: string
  created_at: string
  file_size_bytes: number
  page_count: number
  usage_count: number
}

interface SearchResult {
  id: string
  content: string
  similarity: number
  source_title: string
  source_category: string
}

interface DashboardData {
  sources_count: number
  active_chunks: number
  recent_generations: number
  average_originality_score: number
  top_source_categories: Array<{ category: string; count: number }>
  quality_trends: Array<{ date: string; avg_originality: number }>
}

export default function KnowledgeBaseAdmin() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'search' | 'sources'>('dashboard')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [sources, setSources] = useState<KBSource[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load dashboard data
  useEffect(() => {
    loadDashboardData()
    if (activeTab === 'sources') {
      loadSources()
    }
  }, [activeTab])

  const loadDashboardData = async () => {
    try {
      // This would call the dashboard RPC function
      const mockDashboardData: DashboardData = {
        sources_count: 12,
        active_chunks: 1847,
        recent_generations: 23,
        average_originality_score: 87.3,
        top_source_categories: [
          { category: 'adventure_ideas', count: 5 },
          { category: 'puzzle_mechanics', count: 3 },
          { category: 'corporate', count: 2 },
          { category: 'educational', count: 2 }
        ],
        quality_trends: [
          { date: '2025-01-01', avg_originality: 85.2 },
          { date: '2025-01-02', avg_originality: 87.1 },
          { date: '2025-01-03', avg_originality: 88.9 },
          { date: '2025-01-04', avg_originality: 87.3 }
        ]
      }
      setDashboardData(mockDashboardData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setError('Failed to load dashboard data')
    }
  }

  const loadSources = async () => {
    try {
      // Mock data for demo
      const mockSources: KBSource[] = [
        {
          id: '1',
          title: 'Corporate Team Building Guide',
          description: 'Comprehensive guide for corporate team building activities',
          source_type: 'pdf',
          content_category: 'corporate',
          total_chunks: 45,
          processing_status: 'completed',
          created_at: '2025-01-01T10:00:00Z',
          file_size_bytes: 2457600,
          page_count: 67,
          usage_count: 12
        },
        {
          id: '2',
          title: 'Escape Room Design Patterns',
          description: 'Best practices and patterns for designing engaging escape rooms',
          source_type: 'pdf',
          content_category: 'adventure_ideas',
          total_chunks: 67,
          processing_status: 'completed',
          created_at: '2025-01-02T14:30:00Z',
          file_size_bytes: 3840000,
          page_count: 94,
          usage_count: 28
        },
        {
          id: '3',
          title: 'Educational Puzzle Mechanics',
          description: 'Research on puzzle mechanics for educational environments',
          source_type: 'pdf',
          content_category: 'educational',
          total_chunks: 23,
          processing_status: 'processing',
          created_at: '2025-01-04T09:15:00Z',
          file_size_bytes: 1920000,
          page_count: 45,
          usage_count: 0
        }
      ]
      setSources(mockSources)
    } catch (error) {
      console.error('Failed to load sources:', error)
      setError('Failed to load sources')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch('/api/kb/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          limit: 10,
          similarity_threshold: 0.5
        })
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.results || [])
      } else {
        throw new Error('Search failed')
      }
    } catch (error) {
      console.error('Search error:', error)
      setError('Search failed')
    } finally {
      setIsSearching(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'adventure_ideas': 'bg-purple-100 text-purple-800',
      'puzzle_mechanics': 'bg-blue-100 text-blue-800',
      'corporate': 'bg-green-100 text-green-800',
      'educational': 'bg-yellow-100 text-yellow-800',
      'general': 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || colors.general
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
            Knowledge Base Admin
          </h1>
          <p className="text-slate-400">
            Manage your ClueQuest Knowledge Base and monitor content generation
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-800/30 rounded-lg p-1">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { key: 'search', label: 'Search & Test', icon: Search },
            { key: 'sources', label: 'Sources', icon: Database }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === key
                  ? 'bg-amber-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200">
            <AlertCircle className="h-4 w-4 inline mr-2" />
            {error}
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 rounded-lg p-6 border border-amber-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Sources</p>
                    <p className="text-2xl font-bold text-amber-400">
                      {dashboardData?.sources_count || 0}
                    </p>
                  </div>
                  <Book className="h-8 w-8 text-amber-400" />
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-6 border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Active Chunks</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {dashboardData?.active_chunks?.toLocaleString() || 0}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-400" />
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-6 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Recent Generations</p>
                    <p className="text-2xl font-bold text-green-400">
                      {dashboardData?.recent_generations || 0}
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-green-400" />
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-6 border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Avg Originality</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {dashboardData?.average_originality_score?.toFixed(1) || 0}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-400" />
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/20">
              <h3 className="text-xl font-semibold mb-4">Content Categories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {dashboardData?.top_source_categories.map(({ category, count }) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <span className="capitalize">{category.replace('_', ' ')}</span>
                    <span className="font-bold text-amber-400">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            
            {/* Search Interface */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600/20">
              <h3 className="text-xl font-semibold mb-4">Test Knowledge Base Search</h3>
              
              <div className="flex space-x-4 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter your search query..."
                  className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-500 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  {isSearching ? (
                    <Clock className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  <span>Search</span>
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Search Results ({searchResults.length})</h4>
                  {searchResults.map((result, index) => (
                    <div key={result.id} className="p-4 bg-slate-700/30 rounded-lg border-l-4 border-amber-500">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-amber-300">{result.source_title}</h5>
                        <div className="flex items-center space-x-2 text-sm text-slate-400">
                          <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(result.source_category)}`}>
                            {result.source_category}
                          </span>
                          <span>{(result.similarity * 100).toFixed(1)}% match</span>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {result.content.slice(0, 300)}
                        {result.content.length > 300 && '...'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sources Tab */}
        {activeTab === 'sources' && (
          <div className="space-y-6">
            
            {/* Sources List */}
            <div className="bg-slate-800/50 rounded-lg border border-slate-600/20">
              <div className="p-6 border-b border-slate-600/20">
                <h3 className="text-xl font-semibold">Knowledge Base Sources</h3>
                <p className="text-slate-400 text-sm mt-1">
                  Manage and monitor your uploaded documents
                </p>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-amber-400" />
                  <p className="text-slate-400">Loading sources...</p>
                </div>
              ) : sources.length === 0 ? (
                <div className="p-8 text-center">
                  <Database className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                  <p className="text-slate-400">No sources found</p>
                  <p className="text-slate-500 text-sm mt-2">
                    Use the ingestion script to add documents to the knowledge base
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-600/20">
                  {sources.map((source) => (
                    <div key={source.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-medium text-white">{source.title}</h4>
                            {getStatusIcon(source.processing_status)}
                            <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(source.content_category)}`}>
                              {source.content_category}
                            </span>
                          </div>
                          
                          {source.description && (
                            <p className="text-slate-400 mb-3">{source.description}</p>
                          )}
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-slate-500">Chunks:</span>
                              <span className="ml-2 font-medium text-white">{source.total_chunks}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Pages:</span>
                              <span className="ml-2 font-medium text-white">{source.page_count}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Size:</span>
                              <span className="ml-2 font-medium text-white">{formatFileSize(source.file_size_bytes)}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Usage:</span>
                              <span className="ml-2 font-medium text-white">{source.usage_count} times</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right text-sm text-slate-400">
                          <p>{new Date(source.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-600/20">
              <h4 className="font-medium mb-2">Adding New Documents</h4>
              <p className="text-slate-400 text-sm mb-4">
                Use the ingestion script to add new documents to the knowledge base:
              </p>
              <div className="bg-slate-900 rounded p-4 font-mono text-sm text-green-400">
                node scripts/ingest-knowledge-base.mjs ./path/to/document.pdf "Document Title"
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}