'use client'

import { 
  Search, 
  Plus,
  Eye,
  Users,
  Trophy,
  Clock,
  MapPin,
  Settings,
  Play,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const adventures = [
    {
      id: '1',
      title: 'Corporate Team Mystery',
      type: 'Corporate',
      status: 'Active',
      players: 24,
      created: '2 days ago',
      color: 'amber'
    },
    {
      id: '2', 
      title: 'Birthday Party Quest',
      type: 'Social',
      status: 'Completed',
      players: 12,
      created: '1 week ago',
      color: 'purple'
    },
    {
      id: '3',
      title: 'Science Learning Hunt',
      type: 'Educational', 
      status: 'Draft',
      players: 0,
      created: '3 days ago',
      color: 'emerald'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(168,85,247,0.15),transparent_60%),radial-gradient(circle_at_75%_75%,rgba(245,158,11,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />
      </div>
      
      <main className="relative z-20 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          {/* Header */}
          <motion.div 
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-2 bg-gradient-to-r from-amber-400 via-orange-300 to-purple-400 bg-clip-text text-transparent">
                Adventure Dashboard
              </h1>
              <p className="text-lg text-slate-400">
                Manage your mystery experiences and view live statistics
              </p>
            </div>
            
            <Link 
              href="/create"
              className="btn-primary text-lg font-bold px-8 py-4 shadow-xl hover:shadow-amber-500/40 mt-6 sm:mt-0"
            >
              <Plus className="h-6 w-6" />
              Create Adventure
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="card p-6 border-amber-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Search className="h-5 w-5 text-amber-400" />
                <span className="text-amber-200 font-semibold">Total Adventures</span>
              </div>
              <div className="text-3xl font-black text-amber-300">12</div>
            </div>
            
            <div className="card p-6 border-purple-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-5 w-5 text-purple-400" />
                <span className="text-purple-200 font-semibold">Active Players</span>
              </div>
              <div className="text-3xl font-black text-purple-300">156</div>
            </div>
            
            <div className="card p-6 border-emerald-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="h-5 w-5 text-emerald-400" />
                <span className="text-emerald-200 font-semibold">Completed</span>
              </div>
              <div className="text-3xl font-black text-emerald-300">34</div>
            </div>
            
            <div className="card p-6 border-red-500/20">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-5 w-5 text-red-400" />
                <span className="text-red-200 font-semibold">Success Rate</span>
              </div>
              <div className="text-3xl font-black text-red-300">94%</div>
            </div>
          </motion.div>

          {/* Adventures List */}
          <motion.div 
            className="card p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-amber-200">Your Adventures</h2>
              
              <div className="flex items-center gap-4">
                <select className="px-4 py-2 bg-slate-800/80 border border-slate-600 rounded-lg text-slate-300 text-sm">
                  <option>All Types</option>
                  <option>Corporate</option>
                  <option>Social</option>
                  <option>Educational</option>
                </select>
                
                <select className="px-4 py-2 bg-slate-800/80 border border-slate-600 rounded-lg text-slate-300 text-sm">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Draft</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {adventures.map((adventure, index) => (
                <motion.div
                  key={adventure.id}
                  className={`p-6 rounded-xl bg-gradient-to-r from-slate-800/60 to-slate-700/40 border border-${adventure.color}-500/20 hover:border-${adventure.color}-400/40 transition-all duration-200 hover:scale-[1.02]`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br from-${adventure.color}-500/30 to-${adventure.color}-600/30`}>
                        <Search className={`h-6 w-6 text-${adventure.color}-300`} />
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-slate-200 mb-1">
                          {adventure.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>{adventure.type}</span>
                          <span>•</span>
                          <span>{adventure.players} players</span>
                          <span>•</span>
                          <span>{adventure.created}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        adventure.status === 'Active' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : adventure.status === 'Draft'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                      }`}>
                        {adventure.status}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {adventure.status === 'Active' && (
                          <button className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors">
                          <Settings className="h-4 w-4" />
                        </button>
                        
                        {adventure.status !== 'Completed' && (
                          <button className="p-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors">
                            <Play className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link 
              href="/create"
              className="card p-6 hover:scale-105 transition-all duration-200 border-amber-500/20 hover:border-amber-400/40 group"
            >
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20">
                  <Plus className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-amber-200 mb-2">New Adventure</h3>
                <p className="text-slate-400 text-sm">Create a mystery experience from scratch</p>
              </div>
            </Link>
            
            <Link 
              href="/join"
              className="card p-6 hover:scale-105 transition-all duration-200 border-purple-500/20 hover:border-purple-400/40 group"
            >
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-purple-200 mb-2">Join Quest</h3>
                <p className="text-slate-400 text-sm">Enter a session code to join adventure</p>
              </div>
            </Link>
            
            <Link 
              href="/analytics"
              className="card p-6 hover:scale-105 transition-all duration-200 border-emerald-500/20 hover:border-emerald-400/40 group"
            >
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20">
                  <BarChart3 className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-emerald-200 mb-2">Analytics</h3>
                <p className="text-slate-400 text-sm">View performance and engagement metrics</p>
              </div>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  )
}