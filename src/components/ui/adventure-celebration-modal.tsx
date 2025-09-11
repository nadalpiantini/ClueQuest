/**
 * Adventure Creation Celebration Modal
 * Simple and elegant success modal using ClueQuest design system
 */

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Trophy, ArrowRight } from 'lucide-react'
import { GamingButton } from './gaming-components'

interface AdventureCelebrationModalProps {
  isOpen: boolean
  onClose: () => void
  adventureTitle: string
  adventureId: string
  status: string
  onViewDashboard?: () => void
}

export function AdventureCelebrationModal({
  isOpen,
  onClose,
  adventureTitle,
  adventureId,
  status,
  onViewDashboard
}: AdventureCelebrationModalProps) {
  const handleViewDashboard = () => {
    onClose()
    if (onViewDashboard) {
      onViewDashboard()
    } else {
      window.location.href = '/dashboard'
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Container with ClueQuest Design */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20 p-8 text-center relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-purple-500 to-emerald-400" />
            
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-lg shadow-emerald-500/30 mb-6"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4 mb-8"
            >
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-400 to-emerald-400">
                ¡Aventura Creada!
              </h1>
              
              <h2 className="text-xl font-bold text-white">
                "{adventureTitle}"
              </h2>
              
              <p className="text-slate-300">
                Tu aventura ha sido creada exitosamente y está lista para la acción
              </p>
            </motion.div>

            {/* Adventure Details */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-3 mb-8"
            >
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-600/30">
                <div className="text-sm text-slate-400 font-medium mb-1">ID de Aventura</div>
                <div className="text-amber-400 font-mono text-sm">{adventureId}</div>
              </div>
              
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-600/30">
                <div className="text-sm text-slate-400 font-medium mb-1">Estado</div>
                <div className="text-emerald-400 font-semibold capitalize">{status}</div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <GamingButton
                onClick={handleViewDashboard}
                variant="mystery"
                size="lg"
                className="group"
              >
                <Trophy className="w-5 h-5" />
                Ver en Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </GamingButton>

              <GamingButton
                onClick={onClose}
                variant="ghost"
                size="lg"
              >
                Continuar Creando
              </GamingButton>
            </motion.div>

            {/* Bottom Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-slate-400">
                Tu aventura está lista para ser compartida y disfrutada por todos los participantes
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
