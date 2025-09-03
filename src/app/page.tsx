'use client'

import { 
  Search, 
  Lock, 
  Key, 
  Puzzle, 
  Eye,
  Users,
  Smartphone,
  Trophy,
  Zap,
  Brain,
  Map,
  ArrowRight,
  PlayCircle
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      
      {/* Cinematic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.3),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      </div>

      {/* Floating Mystery Elements */}
      <div className="absolute top-20 left-10 text-amber-400/20 animate-pulse">
        <Key className="h-12 w-12 rotate-12" />
      </div>
      <div className="absolute top-40 right-20 text-purple-400/20 animate-bounce">
        <Lock className="h-10 w-10 -rotate-12" />
      </div>
      <div className="absolute bottom-40 left-20 text-amber-400/20 animate-pulse">
        <Search className="h-14 w-14 rotate-45" />
      </div>
      <div className="absolute bottom-60 right-10 text-purple-400/20 animate-bounce">
        <Puzzle className="h-8 w-8 -rotate-45" />
      </div>
      
      {/* Test rápido (cuadro rojo) - Should be RED if Tailwind works */}
      <div className="w-10 h-10 bg-red-500 fixed top-4 right-4 z-50" />
      
      <main className="relative z-20">
        
        {/* Hero Section */}
        <div className="flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl text-center">
            
            {/* Gaming Badge */}
            <motion.div 
              className="mb-12 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 px-8 py-4 text-lg font-semibold text-amber-300 ring-2 ring-amber-500/30 backdrop-blur-xl border border-amber-500/20 shadow-2xl"
              initial={{ opacity: 0.3, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
            >
              <Eye className="h-6 w-6 animate-spin" />
              Ultimate Mystery Platform
              <div className="h-3 w-3 rounded-full bg-amber-400 animate-ping"></div>
            </motion.div>

            {/* Cinematic Title */}
            <motion.div 
              className="relative mb-12"
              initial={{ opacity: 0.5, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-black tracking-tight mb-6 bg-gradient-to-r from-amber-400 via-orange-300 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
                CLUE<span className="text-purple-400">QUEST</span>
              </h1>
              
              {/* Decorative Icons */}
              <div className="absolute -top-8 -left-12 text-amber-400/40 animate-pulse">
                <Search className="h-16 w-16 rotate-12" />
              </div>
              <div className="absolute -top-4 -right-16 text-purple-400/40 animate-bounce">
                <Lock className="h-14 w-14 -rotate-12" />
              </div>
            </motion.div>

            {/* Subtitle */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-purple-200 mb-4">
                Interactive Escape Room Adventures
              </h2>
              <h3 className="text-xl sm:text-2xl text-slate-300 font-medium max-w-4xl mx-auto">
                Transform Any Venue Into An Immersive Mystery Experience
              </h3>
            </motion.div>
            
            {/* Description */}
            <motion.p 
              className="mb-16 text-lg text-slate-400 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Create interactive scavenger hunts with AI-generated stories, secure QR codes, 
              real-time team collaboration, and immersive AR experiences. Perfect for corporate events, 
              educational adventures, and unforgettable celebrations.
            </motion.p>

            {/* Features Grid */}
            <motion.div 
              className="mb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              
              {/* QR Hunt */}
              <div className="card group p-8 ring-1 ring-amber-500/30 border-amber-500/20 hover:scale-105 hover:shadow-amber-500/20 transition-all duration-300">
                <div className="mb-6">
                  <div className="rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 p-4 shadow-lg group-hover:scale-110 transition-transform">
                    <Smartphone className="h-10 w-10 text-amber-300" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-400 animate-pulse"></div>
                </div>
                <h3 className="text-xl font-bold text-amber-100 mb-3">QR Mystery Hunt</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Secure QR codes unlock story chapters with anti-fraud protection.
                </p>
              </div>

              {/* Team Play */}
              <div className="card group p-8 ring-1 ring-purple-500/30 border-purple-500/20 hover:scale-105 hover:shadow-purple-500/20 transition-all duration-300">
                <div className="mb-6">
                  <div className="rounded-2xl bg-gradient-to-br from-purple-500/30 to-indigo-500/30 p-4 shadow-lg group-hover:scale-110 transition-transform">
                    <Users className="h-10 w-10 text-purple-300" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-purple-100 mb-3">Team Collaboration</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Real-time team formation and puzzle solving together.
                </p>
              </div>

              {/* AI Mystery */}
              <div className="card group p-8 ring-1 ring-emerald-500/30 border-emerald-500/20 hover:scale-105 hover:shadow-emerald-500/20 transition-all duration-300">
                <div className="mb-6">
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 p-4 shadow-lg group-hover:scale-110 transition-transform">
                    <Brain className="h-10 w-10 text-emerald-300" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-emerald-400/10 animate-pulse"></div>
                </div>
                <h3 className="text-xl font-bold text-emerald-100 mb-3">AI Storytelling</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Dynamic narratives and avatars generated by AI.
                </p>
              </div>

              {/* Live Competition */}
              <div className="card group p-8 ring-1 ring-red-500/30 border-red-500/20 hover:scale-105 hover:shadow-red-500/20 transition-all duration-300">
                <div className="mb-6">
                  <div className="rounded-2xl bg-gradient-to-br from-red-500/30 to-pink-500/30 p-4 shadow-lg group-hover:scale-110 transition-transform">
                    <Trophy className="h-10 w-10 text-red-300" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-red-100 mb-3">Live Leaderboards</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Real-time scoring and team competition.
                </p>
              </div>
            </motion.div>

            {/* Main CTAs */}
            <motion.div 
              className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center mt-16"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <a 
                href="/adventure-selection" 
                className="btn-primary group relative text-2xl font-black px-12 py-6 shadow-2xl hover:shadow-amber-500/40 overflow-hidden touch-target"
                aria-label="Begin Mystery Quest - Start your adventure"
              >
                <Search className="h-8 w-8 animate-pulse" />
                <span>Begin Mystery Quest</span>
                <ArrowRight className="h-8 w-8 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a 
                href="/join" 
                className="group inline-flex items-center gap-4 rounded-2xl bg-slate-800/90 px-12 py-6 text-2xl font-bold text-amber-200 ring-2 ring-amber-500/40 backdrop-blur-xl border border-amber-500/30 touch-target hover:scale-105 hover:shadow-amber-500/20 transition-all duration-300"
                aria-label="Join Existing Adventure - Join an ongoing mystery quest"
              >
                <Users className="h-8 w-8" />
                Join Existing Adventure
              </a>
            </motion.div>
          </div>
        </div>

        {/* Gaming Stats */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-purple-300 mb-6">
                Global Mystery Network
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Join mystery solvers worldwide creating unforgettable adventures
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
              
              <motion.div 
                className="text-center p-10 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-xl ring-1 ring-amber-500/20 hover:ring-amber-400/40 shadow-2xl hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/30 mb-6 shadow-xl">
                  <Users className="h-10 w-10 text-amber-300" />
                </div>
                <div className="text-5xl font-black text-amber-300 mb-3">100K+</div>
                <div className="text-slate-400 font-semibold">Mystery Solvers</div>
              </motion.div>
              
              <motion.div 
                className="text-center p-10 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-xl ring-1 ring-purple-500/20 hover:ring-purple-400/40 shadow-2xl hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/30 to-indigo-500/30 mb-6 shadow-xl">
                  <Map className="h-10 w-10 text-purple-300" />
                </div>
                <div className="text-5xl font-black text-purple-300 mb-3">95+</div>
                <div className="text-slate-400 font-semibold">Countries</div>
              </motion.div>
              
              <motion.div 
                className="text-center p-10 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-xl ring-1 ring-emerald-500/20 hover:ring-emerald-400/40 shadow-2xl hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 mb-6 shadow-xl">
                  <Zap className="h-10 w-10 text-emerald-300 animate-pulse" />
                </div>
                <div className="text-5xl font-black text-emerald-300 mb-3">24/7</div>
                <div className="text-slate-400 font-semibold">Global Adventures</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Premium Testimonial */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div 
              className="relative p-12 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-2xl ring-2 ring-amber-500/30 border border-amber-500/20 shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Floating Badge */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-amber-600 to-orange-500 rounded-full p-4 shadow-2xl animate-pulse">
                  <Puzzle className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <blockquote className="text-2xl text-slate-200 text-center leading-relaxed mb-8 font-medium">
                "ClueQuest transformed our corporate retreat into an unforgettable mystery adventure. 
                Teams were collaborating like never before, and the AI-generated storylines 
                kept everyone engaged for hours. Pure magic!"
              </blockquote>
              
              <div className="text-center">
                <div className="text-amber-300 font-bold text-lg">Sarah Chen</div>
                <div className="text-slate-400">Head of People Operations, TechCorp</div>
                <div className="mt-4 flex items-center justify-center gap-1">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Gaming Footer */}
      <footer className="relative z-20 border-t border-amber-500/30 bg-gradient-to-br from-slate-950/90 to-slate-900/90 backdrop-blur-2xl py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-amber-600 to-orange-500 rounded-2xl p-3 shadow-xl">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-purple-300">
                  ClueQuest
                </h3>
              </div>
              
              <p className="text-slate-300 leading-relaxed text-lg max-w-lg mb-6">
                The world's premier platform for interactive mystery adventures. 
                Transform any space into an immersive escape room experience.
              </p>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 text-emerald-400 text-sm font-semibold">
                  <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></div>
                  Platform Live
                </div>
                <div className="text-slate-500 text-sm">Global adventures active</div>
              </div>
            </div>
            
            {/* Links */}
            <div>
              <h4 className="text-amber-300 font-bold text-lg mb-6 flex items-center gap-3">
                <Puzzle className="h-5 w-5" />
                Adventures
              </h4>
              <ul className="space-y-3 text-slate-400">
                <li className="hover:text-amber-300 transition-colors cursor-pointer text-sm font-medium min-h-[44px] flex items-center">Corporate Events</li>
                <li className="hover:text-amber-300 transition-colors cursor-pointer text-sm font-medium min-h-[44px] flex items-center">Educational Hunts</li>
                <li className="hover:text-amber-300 transition-colors cursor-pointer text-sm font-medium min-h-[44px] flex items-center">Social Events</li>
                <li className="hover:text-amber-300 transition-colors cursor-pointer text-sm font-medium min-h-[44px] flex items-center">Weddings</li>
                <li className="hover:text-amber-300 transition-colors cursor-pointer text-sm font-medium min-h-[44px] flex items-center">Festivals</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-purple-300 font-bold text-lg mb-6 flex items-center gap-3">
                <Key className="h-5 w-5" />
                Company
              </h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="/about" className="hover:text-purple-300 transition-colors text-sm font-medium min-h-[44px] flex items-center" aria-label="About ClueQuest">About Quest</a></li>
                <li><a href="/privacy" className="hover:text-purple-300 transition-colors text-sm font-medium min-h-[44px] flex items-center" aria-label="Privacy Policy">Privacy</a></li>
                <li><a href="/terms" className="hover:text-purple-300 transition-colors text-sm font-medium min-h-[44px] flex items-center" aria-label="Terms of Service">Terms</a></li>
                <li><a href="/contact" className="hover:text-purple-300 transition-colors text-sm font-medium min-h-[44px] flex items-center" aria-label="Contact Support">Contact</a></li>
                <li><a href="/careers" className="hover:text-purple-300 transition-colors text-sm font-medium min-h-[44px] flex items-center" aria-label="Career Opportunities">Careers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-amber-500/20">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <p className="text-slate-400 mb-6 lg:mb-0 text-center lg:text-left">
                © 2025 ClueQuest. Crafted with 🔍 for mystery solvers worldwide.
              </p>
              
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold hover:text-emerald-400 transition-colors">
                  <Lock className="h-4 w-4" />
                  Enterprise Security
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold hover:text-amber-400 transition-colors">
                  <Eye className="h-4 w-4" />
                  AI-Powered
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold hover:text-purple-400 transition-colors">
                  <Trophy className="h-4 w-4" />
                  Global Leader
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}