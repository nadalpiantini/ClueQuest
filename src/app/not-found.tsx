import Link from 'next/link'
import { Search, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 mb-6 ring-2 ring-amber-500/30">
            <Search className="h-12 w-12 text-amber-400" />
          </div>
          <h1 className="text-4xl font-bold text-amber-300 mb-4">Mystery Not Found</h1>
          <p className="text-slate-400 text-lg mb-8">
            This clue seems to have vanished into the digital shadows.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold px-8 py-4 rounded-full hover:from-amber-700 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl min-h-[44px] touch-target"
          >
            <Home className="h-5 w-5" />
            Return to Quest Hub
          </Link>
          
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </div>
        </div>
        
        <div className="mt-12 text-xs text-slate-500">
          Error 404 - Page not found
        </div>
      </div>
    </div>
  )
}