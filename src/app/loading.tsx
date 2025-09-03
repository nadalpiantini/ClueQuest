import { Search, Puzzle, Lock, Key } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="relative mb-8">
          {/* Animated mystery icons */}
          <div className="relative inline-block">
            <Search className="h-16 w-16 text-amber-400 animate-spin" />
            <div className="absolute -top-2 -right-2">
              <Key className="h-6 w-6 text-purple-400 animate-bounce" />
            </div>
            <div className="absolute -bottom-2 -left-2">
              <Lock className="h-6 w-6 text-orange-400 animate-pulse" />
            </div>
            <div className="absolute top-0 -left-4">
              <Puzzle className="h-5 w-5 text-emerald-400 animate-ping" />
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-amber-300 mb-4">
          Solving Mystery...
        </h2>
        
        <p className="text-slate-400 text-lg mb-8">
          Preparing your adventure experience
        </p>
        
        {/* Loading bar */}
        <div className="w-64 h-2 bg-slate-800 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse"></div>
        </div>
        
        <div className="mt-6 text-sm text-slate-500">
          Loading ClueQuest...
        </div>
      </div>
    </div>
  )
}