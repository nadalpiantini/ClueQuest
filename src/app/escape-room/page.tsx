import { 
  ArrowLeft, 
  Search, 
  Lock, 
  Key, 
  Puzzle, 
  Clock, 
  Users,
  MapPin,
  Smartphone,
  Eye,
  Trophy,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default function EscapeRoomPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 relative overflow-hidden">
      {/* Escape Room Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(168,85,247,0.15),transparent_70%),radial-gradient(circle_at_70%_60%,rgba(255,191,0,0.1),transparent_70%)]" />
      
      {/* Floating Clue Elements */}
      <div className="absolute top-16 left-8 text-purple-400/30 animate-float">
        <Lock className="h-10 w-10 rotate-12" />
      </div>
      <div className="absolute top-32 right-12 text-amber-400/30 animate-bounce delay-1000">
        <Key className="h-8 w-8 -rotate-45" />
      </div>
      <div className="absolute bottom-32 left-16 text-purple-400/30 animate-pulse delay-2000">
        <Puzzle className="h-12 w-12 rotate-45" />
      </div>
      <div className="absolute bottom-48 right-8 text-amber-400/30 animate-float delay-500">
        <Search className="h-9 w-9 -rotate-12" />
      </div>
      
      {/* Navigation */}
      <nav className="relative z-20 p-6">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Mystery
        </Link>
      </nav>
      
      {/* Main Content */}
      <main className="relative z-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-500/10 to-amber-500/10 px-6 py-3 text-sm font-medium text-purple-300 ring-1 ring-purple-500/20 backdrop-blur-sm border border-purple-500/10">
              <Eye className="h-4 w-4 animate-pulse" />
              Escape Room Technology
              <div className="h-2 w-2 rounded-full bg-purple-400 animate-ping"></div>
            </div>
            
            <h1 className="mb-6 bg-gradient-to-r from-purple-400 via-amber-300 to-purple-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl">
              Virtual Escape Rooms
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Transform any venue into an immersive escape room experience using ClueQuest's 
              advanced QR scanning, AI storytelling, and real-time collaboration technology.
            </p>
          </div>
          
          {/* How It Works */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-purple-200 mb-12">How The Mystery Unfolds</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Step 1: Setup */}
              <div className="relative">
                <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm ring-1 ring-purple-500/20">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-full p-3 ring-4 ring-purple-500/20">
                      <span className="text-white font-bold text-lg">1</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 mb-4">
                      <Lock className="h-8 w-8 text-purple-400" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-purple-200 mb-4">Create Mystery</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Design your escape room story with our no-code builder. 
                    AI generates unique narratives, characters, and clues.
                  </p>
                </div>
              </div>
              
              {/* Step 2: Deploy */}
              <div className="relative">
                <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm ring-1 ring-amber-500/20">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-amber-600 to-orange-500 rounded-full p-3 ring-4 ring-amber-500/20">
                      <span className="text-white font-bold text-lg">2</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 mb-4">
                      <MapPin className="h-8 w-8 text-amber-400" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-amber-200 mb-4">Deploy Clues</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Place secure QR codes throughout your venue. 
                    Each code unlocks the next chapter of the mystery.
                  </p>
                </div>
              </div>
              
              {/* Step 3: Play */}
              <div className="relative">
                <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm ring-1 ring-emerald-500/20">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full p-3 ring-4 ring-emerald-500/20">
                      <span className="text-white font-bold text-lg">3</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 mb-4">
                      <Users className="h-8 w-8 text-emerald-400" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-emerald-200 mb-4">Solve Together</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Teams collaborate in real-time, solving puzzles, 
                    racing against the clock on live leaderboards.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features Showcase */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-amber-200 mb-12">Advanced Escape Room Features</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left: Feature List */}
              <div className="space-y-6">
                
                <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-700/30 backdrop-blur-sm ring-1 ring-purple-500/20">
                  <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg p-3">
                    <Smartphone className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-200 mb-2">Mobile-First Design</h3>
                    <p className="text-slate-300 text-sm">
                      Players use their smartphones to scan QR codes, submit solutions, and communicate with teammates.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-700/30 backdrop-blur-sm ring-1 ring-amber-500/20">
                  <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg p-3">
                    <Eye className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-200 mb-2">AI Mystery Master</h3>
                    <p className="text-slate-300 text-sm">
                      Dynamic storylines adapt to player choices. AI generates unique puzzles and provides intelligent hints.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-700/30 backdrop-blur-sm ring-1 ring-emerald-500/20">
                  <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg p-3">
                    <Trophy className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-200 mb-2">Real-Time Competition</h3>
                    <p className="text-slate-300 text-sm">
                      Live leaderboards, team coordination, and instant scoring create thrilling competitive experiences.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-700/30 backdrop-blur-sm ring-1 ring-red-500/20">
                  <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-lg p-3">
                    <Zap className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-200 mb-2">Enterprise Security</h3>
                    <p className="text-slate-300 text-sm">
                      HMAC-secured QR codes prevent cheating. ML fraud detection ensures fair play.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Right: Visual Demo */}
              <div className="relative">
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm ring-1 ring-amber-500/30 border border-amber-500/20 overflow-hidden">
                  
                  {/* Simulated Phone Interface */}
                  <div className="bg-slate-900 rounded-2xl p-6 ring-2 ring-slate-700">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="flex-1 text-center">
                        <span className="text-amber-300 text-sm font-semibold">Mystery Quest</span>
                      </div>
                    </div>
                    
                    {/* Simulated Interface */}
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-purple-600/20 to-purple-500/20 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Search className="h-4 w-4 text-purple-400" />
                          <span className="text-purple-200 text-sm font-semibold">Current Clue</span>
                        </div>
                        <p className="text-slate-300 text-xs">
                          "Find the ancient key hidden where time stands still..."
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-amber-600/20 to-amber-500/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-amber-400" />
                            <span className="text-amber-200 text-sm font-semibold">Team Score</span>
                          </div>
                          <span className="text-amber-300 font-bold">2,450 pts</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-slate-800 rounded-full h-2">
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full w-3/4"></div>
                          </div>
                          <span className="text-slate-400 text-xs">Rank #2</span>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-emerald-600/20 to-emerald-500/20 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Clock className="h-4 w-4 text-emerald-400" />
                          <span className="text-emerald-200 text-sm font-semibold">Time Remaining</span>
                        </div>
                        <div className="text-emerald-300 font-mono text-lg">23:47</div>
                      </div>
                      
                      <button className="w-full bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg py-3 text-white font-semibold flex items-center justify-center gap-2 hover:from-purple-500 hover:to-purple-400 transition-all duration-200">
                        <Smartphone className="h-4 w-4" />
                        Scan Next QR Code
                      </button>
                    </div>
                  </div>
                  
                  {/* Floating Elements Around Phone */}
                  <div className="absolute -top-2 -left-2 text-purple-400/50 animate-pulse">
                    <Key className="h-6 w-6 rotate-45" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 text-amber-400/50 animate-bounce delay-1000">
                    <Puzzle className="h-5 w-5 -rotate-45" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Use Cases */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-amber-200 mb-12">Perfect For Any Venue</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Corporate Events */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm ring-1 ring-purple-500/20 hover:ring-purple-400/40 transition-all duration-300 hover:scale-105">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-7 w-7 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-purple-200">Corporate Retreats</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Transform team building into an engaging mystery adventure. 
                  Build collaboration while solving complex challenges together.
                </p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Team collaboration metrics</li>
                  <li>• Leadership emergence tracking</li>
                  <li>• Slack/Teams integration</li>
                </ul>
              </div>
              
              {/* Weddings & Events */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm ring-1 ring-amber-500/20 hover:ring-amber-400/40 transition-all duration-300 hover:scale-105">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="h-7 w-7 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-amber-200">Weddings & Parties</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Create unforgettable entertainment for guests. 
                  Personalized themes and stories for special celebrations.
                </p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Custom romantic themes</li>
                  <li>• Guest collaboration games</li>
                  <li>• Photo memories integration</li>
                </ul>
              </div>
              
              {/* Educational */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm ring-1 ring-emerald-500/20 hover:ring-emerald-400/40 transition-all duration-300 hover:scale-105">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Eye className="h-7 w-7 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-emerald-200">Educational Quests</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Gamify learning with interactive mystery adventures. 
                  Students solve problems while exploring subjects.
                </p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Curriculum integration</li>
                  <li>• Progress tracking</li>
                  <li>• LMS compatibility</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Technology Showcase */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-purple-200 mb-8">Powered by Advanced Technology</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
              <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-700/20 backdrop-blur-sm ring-1 ring-purple-500/10">
                <Search className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                <div className="text-sm text-slate-300 font-semibold">QR Security</div>
              </div>
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-700/20 backdrop-blur-sm ring-1 ring-amber-500/10">
                <Eye className="h-8 w-8 text-amber-400 mx-auto mb-3" />
                <div className="text-sm text-slate-300 font-semibold">AI Stories</div>
              </div>
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-700/20 backdrop-blur-sm ring-1 ring-emerald-500/10">
                <MapPin className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
                <div className="text-sm text-slate-300 font-semibold">GPS Tracking</div>
              </div>
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-700/20 backdrop-blur-sm ring-1 ring-red-500/10">
                <Zap className="h-8 w-8 text-red-400 mx-auto mb-3" />
                <div className="text-sm text-slate-300 font-semibold">Real-Time</div>
              </div>
            </div>
            
            <Link 
              href="/"
              className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:from-purple-500 hover:to-purple-400 hover:scale-105 touch-target"
            >
              <Key className="h-5 w-5 animate-pulse" />
              Start Your Mystery
              <ArrowLeft className="h-5 w-5 rotate-180 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}