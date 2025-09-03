'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('ClueQuest Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 mb-6 ring-2 ring-red-500/30">
            <AlertTriangle className="h-12 w-12 text-red-400" />
          </div>
          <h1 className="text-4xl font-bold text-red-300 mb-4">Mystery Interrupted</h1>
          <p className="text-slate-400 text-lg mb-8">
            Something unexpected happened during your quest.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold px-8 py-4 rounded-full hover:from-amber-700 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl min-h-[44px] touch-target"
          >
            <RefreshCw className="h-5 w-5" />
            Try Again
          </button>
          
          <div>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors min-h-[44px] touch-target"
            >
              <Home className="h-4 w-4" />
              Return to Quest Hub
            </Link>
          </div>
        </div>
        
        {error.digest && (
          <div className="mt-8 p-4 bg-slate-800/50 rounded-lg">
            <div className="text-xs text-slate-500 mb-2">Error ID:</div>
            <code className="text-xs text-slate-400 font-mono">{error.digest}</code>
          </div>
        )}
      </div>
    </div>
  )
}