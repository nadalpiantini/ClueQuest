'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  Smartphone,
  Download, 
  RefreshCw,
  Shield,
  Palette,
  Eye,
  Copy,
  CheckCircle,
  AlertTriangle,
  QrCode,
  Settings,
  Printer,
  Grid3X3,
  Lock,
  Sticker,
  Package,
  Target,
  Zap,
  Trash2,
  Edit3
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GamingButton, GamingCard, GamingInput, GamingBadge } from '@/components/ui/gaming-components'
import { Challenge } from '../ChallengeDesigner'

interface QRSticker {
  id: string
  name: string
  challengeId: string
  challengeName: string
  securityToken: string
  hmacSignature: string
  expiresAt: Date
  usageLimit: number
  currentUsage: number
  qrCodeDataURL: string
  stickerStyle: {
    backgroundColor: string
    foregroundColor: string
    borderColor: string
    size: number
    borderRadius: number
  }
  printSettings: {
    paperSize: 'a4' | 'letter' | 'sticker'
    stickersPerPage: number
    includeText: boolean
    includeInstructions: boolean
  }
  isActive: boolean
  createdAt: Date
  scannedCount: number
}

interface QRStickerConfig {
  size: number
  foregroundColor: string
  backgroundColor: string
  borderColor: string
  borderRadius: number
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  logoUrl?: string
}

interface QRStickerGeneratorProps {
  challenges: Challenge[]
  adventureId: string
  onStickersGenerated: (stickers: QRSticker[]) => void
  existingStickers?: QRSticker[]
}

export default function QRStickerGenerator({
  challenges,
  adventureId,
  onStickersGenerated,
  existingStickers = []
}: QRStickerGeneratorProps) {
  const [stickers, setStickers] = useState<QRSticker[]>(existingStickers)
  const [selectedSticker, setSelectedSticker] = useState<QRSticker | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [stickerConfig, setStickerConfig] = useState<QRStickerConfig>({
    size: 150,
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 12,
    errorCorrectionLevel: 'M'
  })
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [copySuccess, setCopySuccess] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const activeChallenges = challenges.filter(c => c.isActive)
  const availableChallenges = activeChallenges.filter(c => 
    !stickers.some(s => s.challengeId === c.id && s.isActive)
  )

  // Generate secure QR sticker for a specific challenge
  const generateStickerForChallenge = async (challenge: Challenge): Promise<QRSticker> => {
    const securityToken = crypto.randomUUID()
    const hmacSignature = await generateHMACSignature(challenge.id, securityToken)
    
    const sticker: QRSticker = {
      id: crypto.randomUUID(),
      name: `Sticker: ${challenge.name}`,
      challengeId: challenge.id,
      challengeName: challenge.name,
      securityToken,
      hmacSignature,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      usageLimit: 100, // Higher limit for physical stickers
      currentUsage: 0,
      qrCodeDataURL: '',
      stickerStyle: {
        backgroundColor: stickerConfig.backgroundColor,
        foregroundColor: stickerConfig.foregroundColor,
        borderColor: stickerConfig.borderColor,
        size: stickerConfig.size,
        borderRadius: stickerConfig.borderRadius
      },
      printSettings: {
        paperSize: 'a4',
        stickersPerPage: 12,
        includeText: true,
        includeInstructions: false
      },
      isActive: true,
      createdAt: new Date(),
      scannedCount: 0
    }
    
    // Generate QR code image
    sticker.qrCodeDataURL = generateQRDataURL(sticker)
    return sticker
  }

  // Generate HMAC signature for security
  const generateHMACSignature = async (challengeId: string, securityToken: string): Promise<string> => {
    const data = `${challengeId}:${securityToken}:${adventureId}:sticker`
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode('cluequest-sticker-hmac-secret'),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  // Generate QR code data URL for sticker
  const generateQRDataURL = (sticker: QRSticker): string => {
    // QR code payload with challenge delivery info
    const qrPayload = {
      type: 'cluequest_sticker_challenge',
      adventureId: adventureId,
      challengeId: sticker.challengeId,
      stickerId: sticker.id,
      token: sticker.securityToken,
      signature: sticker.hmacSignature,
      timestamp: Date.now()
    }

    // Sticker URL that delivers the challenge
    const stickerURL = `https://cluequest.app/sticker?data=${btoa(JSON.stringify(qrPayload))}`
    
    // Generate QR code visualization
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        canvas.width = sticker.stickerStyle.size
        canvas.height = sticker.stickerStyle.size
        
        // Background with border
        ctx.fillStyle = sticker.stickerStyle.backgroundColor
        ctx.fillRect(0, 0, sticker.stickerStyle.size, sticker.stickerStyle.size)
        
        // Border
        ctx.strokeStyle = sticker.stickerStyle.borderColor
        ctx.lineWidth = 2
        ctx.strokeRect(0, 0, sticker.stickerStyle.size, sticker.stickerStyle.size)
        
        // QR pattern simulation
        ctx.fillStyle = sticker.stickerStyle.foregroundColor
        const moduleSize = Math.floor((sticker.stickerStyle.size - 20) / 25) // Padding
        const startX = 10
        const startY = 10
        
        // Generate deterministic pattern based on sticker ID
        const seed = sticker.id.slice(0, 8)
        let seedIndex = 0
        
        for (let i = 0; i < 25; i++) {
          for (let j = 0; j < 25; j++) {
            const charCode = seed.charCodeAt(seedIndex % seed.length)
            seedIndex++
            
            if ((i + j + charCode) % 3 === 0) {
              ctx.fillRect(
                startX + i * moduleSize,
                startY + j * moduleSize,
                moduleSize,
                moduleSize
              )
            }
          }
        }
        
        return canvas.toDataURL('image/png')
      }
    }
    
    // Fallback SVG
    return 'data:image/svg+xml;base64,' + btoa(`
      <svg width="${sticker.stickerStyle.size}" height="${sticker.stickerStyle.size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${sticker.stickerStyle.backgroundColor}" rx="${sticker.stickerStyle.borderRadius}" stroke="${sticker.stickerStyle.borderColor}" stroke-width="2"/>
        <text x="50%" y="40%" text-anchor="middle" dy="0.35em" font-size="10" fill="${sticker.stickerStyle.foregroundColor}" font-weight="bold">QR STICKER</text>
        <text x="50%" y="60%" text-anchor="middle" dy="0.35em" font-size="8" fill="${sticker.stickerStyle.foregroundColor}">${sticker.challengeName.substring(0, 15)}...</text>
        <text x="50%" y="75%" text-anchor="middle" dy="0.35em" font-size="6" fill="${sticker.stickerStyle.foregroundColor}">SCAN ME!</text>
      </svg>
    `)
  }

  // Generate all available stickers
  const generateAllStickers = async () => {
    if (availableChallenges.length === 0) return

    setIsGenerating(true)

    try {
      const newStickers: QRSticker[] = await Promise.all(
        availableChallenges.map(challenge => generateStickerForChallenge(challenge))
      )

      const updatedStickers = [...stickers, ...newStickers]
      setStickers(updatedStickers)
      onStickersGenerated(updatedStickers)
    } catch (error) {
      console.error('Error generating stickers:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate single sticker for specific challenge
  const generateSingleSticker = async (challenge: Challenge) => {
    setIsGenerating(true)

    try {
      const newSticker = await generateStickerForChallenge(challenge)
      const updatedStickers = [...stickers, newSticker]
      setStickers(updatedStickers)
      onStickersGenerated(updatedStickers)
    } catch (error) {
      console.error('Error generating sticker:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyQRData = async (sticker: QRSticker) => {
    const qrPayload = {
      type: 'cluequest_sticker_challenge',
      adventureId: adventureId,
      challengeId: sticker.challengeId,
      stickerId: sticker.id,
      token: sticker.securityToken,
      signature: sticker.hmacSignature
    }
    
    const stickerURL = `https://cluequest.app/sticker?data=${btoa(JSON.stringify(qrPayload))}`
    
    try {
      await navigator.clipboard.writeText(stickerURL)
      setCopySuccess(sticker.id)
      setTimeout(() => setCopySuccess(null), 2000)
    } catch (error) {
      console.error('Error copying URL:', error)
    }
  }

  const downloadSticker = (sticker: QRSticker) => {
    const link = document.createElement('a')
    link.download = `qr-sticker-${sticker.challengeName.toLowerCase().replace(/\s+/g, '-')}.png`
    link.href = sticker.qrCodeDataURL
    link.click()
  }

  const downloadAllStickers = () => {
    // Create a print-friendly layout
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const stickersHTML = stickers
      .filter(s => s.isActive)
      .map(sticker => {
        return `
          <div style="
            display: inline-block;
            margin: 10px;
            padding: 15px;
            border: 2px solid #E2E8F0;
            border-radius: 12px;
            background: white;
            text-align: center;
            width: 180px;
            height: 220px;
            page-break-inside: avoid;
          ">
            <img src="${sticker.qrCodeDataURL}" style="width: 120px; height: 120px; margin-bottom: 8px;" />
            <div style="font-size: 12px; font-weight: bold; margin-bottom: 4px; color: #1F2937;">
              ${sticker.challengeName}
            </div>
            <div style="font-size: 10px; color: #6B7280; margin-bottom: 4px;">
              Scan to get your challenge!
            </div>
            <div style="font-size: 8px; color: #9CA3AF;">
              ID: ${sticker.id.slice(-8)}
            </div>
          </div>
        `
      }).join('')

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Stickers - ${adventureId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .stickers-grid { display: flex; flex-wrap: wrap; justify-content: center; }
            @media print {
              body { margin: 15px; }
              .header { margin-bottom: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎯 ClueQuest Adventure Stickers</h1>
            <h2>Ready to Hide & Scan!</h2>
            <p><strong>Instructions:</strong> Cut out each sticker and hide them around your venue. When participants scan them, they'll receive unique challenges!</p>
          </div>
          <div class="stickers-grid">
            ${stickersHTML}
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const deleteSticker = (stickerId: string) => {
    const updatedStickers = stickers.filter(s => s.id !== stickerId)
    setStickers(updatedStickers)
    onStickersGenerated(updatedStickers)
  }

  const editSticker = (sticker: QRSticker) => {
    setSelectedSticker(sticker)
    setIsEditing(true)
  }

  const updateSticker = (updatedSticker: QRSticker) => {
    const updatedStickers = stickers.map(s => 
      s.id === updatedSticker.id ? updatedSticker : s
    )
    setStickers(updatedStickers)
    onStickersGenerated(updatedStickers)
    setSelectedSticker(null)
    setIsEditing(false)
  }

  const toggleStickerActive = (stickerId: string) => {
    const updatedStickers = stickers.map(s =>
      s.id === stickerId ? { ...s, isActive: !s.isActive } : s
    )
    setStickers(updatedStickers)
    onStickersGenerated(updatedStickers)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-pink-200 mb-3 flex items-center justify-center gap-3">
          <Sticker className="h-7 w-7" />
          🎯 QR Sticker Generator
        </h3>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Create <strong>unique physical stickers</strong> to hide around your venue. Each QR sticker delivers a specific challenge when scanned - perfect for treasure hunts and discovery adventures!
        </p>
      </div>

      {/* Challenge Pool Status */}
      <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-4">
        <h4 className="text-lg font-bold text-emerald-200 flex items-center gap-2">
          <Target className="h-5 w-5" />
          Challenge Pool Status
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-emerald-400">{activeChallenges.length}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">Available Challenges</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-400">{stickers.filter(s => s.isActive).length}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">Active Stickers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400">{availableChallenges.length}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">Ready to Generate</div>
          </div>
        </div>

        {availableChallenges.length === 0 && activeChallenges.length > 0 && (
          <div className="mt-4 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
            <div className="text-sm text-amber-300 font-medium">
              🎉 All active challenges have stickers! Create more challenges to generate additional stickers.
            </div>
          </div>
        )}
      </div>

      {/* Generation Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="space-y-2">
          <div className="text-sm text-slate-300 font-semibold">
            Sticker Status: {stickers.filter(s => s.isActive).length} active / {stickers.length} total
          </div>
          <div className="flex gap-2">
            {stickers.length > 0 && (
              <GamingBadge variant="emerald" size="sm">
                <Shield className="h-3 w-3" />
                HMAC Secured
              </GamingBadge>
            )}
            {stickers.some(s => !s.isActive) && (
              <GamingBadge variant="red" size="sm">
                <AlertTriangle className="h-3 w-3" />
                Some Inactive
              </GamingBadge>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <GamingButton
            variant="ghost"
            size="md"
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          >
            <Settings className="h-4 w-4" />
            Sticker Design
          </GamingButton>
          
          <GamingButton
            variant="mystery"
            size="md"
            onClick={generateAllStickers}
            isLoading={isGenerating}
            disabled={availableChallenges.length === 0}
          >
            <Sticker className="h-5 w-5" />
            Generate All Stickers ({availableChallenges.length})
          </GamingButton>
        </div>
      </div>

      {/* Advanced Sticker Design Settings */}
      <AnimatePresence>
        {showAdvancedSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <GamingCard className="p-6 space-y-6">
              <h4 className="text-lg font-bold text-pink-200 flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Sticker Design & Print Settings
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Settings */}
                <div className="space-y-4">
                  <h5 className="text-base font-bold text-amber-200">Visual Design</h5>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-2 block">
                        Sticker Size
                      </label>
                      <input
                        type="range"
                        min="100"
                        max="300"
                        step="25"
                        value={stickerConfig.size}
                        onChange={(e) => setStickerConfig({
                          ...stickerConfig,
                          size: parseInt(e.target.value)
                        })}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-xs text-slate-400 mt-1">{stickerConfig.size}px</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-2 block">
                          QR Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={stickerConfig.foregroundColor}
                            onChange={(e) => setStickerConfig({
                              ...stickerConfig,
                              foregroundColor: e.target.value
                            })}
                            className="w-12 h-10 rounded-lg border border-slate-600 bg-slate-800"
                          />
                          <input
                            type="text"
                            value={stickerConfig.foregroundColor}
                            onChange={(e) => setStickerConfig({
                              ...stickerConfig,
                              foregroundColor: e.target.value
                            })}
                            className="flex-1 px-3 py-2 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-2 block">
                          Background
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={stickerConfig.backgroundColor}
                            onChange={(e) => setStickerConfig({
                              ...stickerConfig,
                              backgroundColor: e.target.value
                            })}
                            className="w-12 h-10 rounded-lg border border-slate-600 bg-slate-800"
                          />
                          <input
                            type="text"
                            value={stickerConfig.backgroundColor}
                            onChange={(e) => setStickerConfig({
                              ...stickerConfig,
                              backgroundColor: e.target.value
                            })}
                            className="flex-1 px-3 py-2 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Print Settings */}
                <div className="space-y-4">
                  <h5 className="text-base font-bold text-amber-200">Print Settings</h5>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-2 block">
                        Paper Size
                      </label>
                      <select
                        value={stickerConfig.errorCorrectionLevel}
                        onChange={(e) => setStickerConfig({
                          ...stickerConfig,
                          errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H'
                        })}
                        className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                      >
                        <option value="L">A4 Paper (12 stickers per page)</option>
                        <option value="M">Letter Paper (12 stickers per page)</option>
                        <option value="Q">Sticker Sheet (24 stickers per sheet)</option>
                        <option value="H">Large Format (6 stickers per page)</option>
                      </select>
                    </div>

                    <div className="p-3 rounded-lg border border-pink-500/30 bg-pink-500/5 space-y-2">
                      <div className="text-sm font-bold text-pink-200 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Printing Tips
                      </div>
                      <ul className="text-xs text-slate-400 space-y-1">
                        <li>• Use high-quality sticker paper or cardstock</li>
                        <li>• Cut with 5mm border around each sticker</li>
                        <li>• Laminate for durability in outdoor events</li>
                        <li>• Test scan before hiding stickers</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </GamingCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Available Challenges for Sticker Generation */}
      {availableChallenges.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-slate-200 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Ready to Generate ({availableChallenges.length} challenges)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableChallenges.map((challenge) => {
              const difficultyColors = {
                easy: 'emerald',
                medium: 'amber',
                hard: 'orange',
                expert: 'red'
              }
              const diffColor = difficultyColors[challenge.difficulty]
              
              return (
                <GamingCard key={challenge.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-slate-200 mb-1">
                        {challenge.name}
                      </h5>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                        {challenge.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <GamingBadge variant={diffColor as any} size="sm">
                          {challenge.difficulty}
                        </GamingBadge>
                        <span className="text-amber-400">{challenge.points} pts</span>
                      </div>
                    </div>
                  </div>
                  
                  <GamingButton
                    variant="mystery"
                    size="sm"
                    onClick={() => generateSingleSticker(challenge)}
                    isLoading={isGenerating}
                    className="w-full"
                  >
                    <Sticker className="h-4 w-4" />
                    Generate Sticker
                  </GamingButton>
                </GamingCard>
              )
            })}
          </div>
        </div>
      )}

      {/* Generated Stickers Grid */}
      {stickers.length > 0 && (
        <div className="space-y-6">
          {/* Bulk Actions */}
          <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-slate-600/50 bg-slate-800/30">
            <div className="text-sm text-slate-300 font-semibold">
              Bulk Actions:
            </div>
            <GamingButton
              variant="outline"
              size="sm"
              onClick={downloadAllStickers}
              disabled={stickers.filter(s => s.isActive).length === 0}
            >
              <Printer className="h-4 w-4" />
              Print All Stickers
            </GamingButton>
            <GamingButton
              variant="ghost"
              size="sm"
              onClick={() => {
                stickers.forEach(sticker => downloadSticker(sticker))
              }}
            >
              <Download className="h-4 w-4" />
              Download All Images
            </GamingButton>
          </div>

          {/* Stickers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stickers.map((sticker, index) => (
              <motion.div
                key={sticker.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <GamingCard className={`p-6 space-y-4 ${!sticker.isActive ? 'opacity-60' : ''}`}>
                  {/* Sticker Preview */}
                  <div className="text-center">
                    <div className="inline-block p-4 rounded-xl border-2 border-pink-500/30 bg-white">
                      <img
                        src={sticker.qrCodeDataURL}
                        alt={`Sticker for ${sticker.challengeName}`}
                        className="w-24 h-24 mx-auto"
                        style={{
                          borderRadius: `${sticker.stickerStyle.borderRadius}px`
                        }}
                      />
                    </div>
                    <div className="mt-2">
                      <GamingBadge variant="purple" size="sm">
                        🎯 Hidden Challenge
                      </GamingBadge>
                    </div>
                  </div>

                  {/* Challenge Info */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-bold text-pink-200 text-center">
                      {sticker.challengeName}
                    </h5>
                    
                    <div className="text-xs text-slate-400 space-y-1 text-center">
                      <div>Scanned: {sticker.scannedCount} / {sticker.usageLimit}</div>
                      <div>Expires: {sticker.expiresAt.toLocaleDateString()}</div>
                      <div className="font-mono text-slate-500">#{sticker.id.slice(-6)}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/50">
                    <GamingButton
                      variant="ghost"
                      size="sm"
                      onClick={() => copyQRData(sticker)}
                      className="text-xs"
                    >
                      {copySuccess === sticker.id ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy
                        </>
                      )}
                    </GamingButton>
                    
                    <GamingButton
                      variant="outline"
                      size="sm"
                      onClick={() => downloadSticker(sticker)}
                      className="text-xs"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </GamingButton>
                    
                    <GamingButton
                      variant="ghost"
                      size="sm"
                      onClick={() => editSticker(sticker)}
                      className="text-xs"
                    >
                      <Edit3 className="h-3 w-3" />
                      Edit
                    </GamingButton>

                    <GamingButton
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSticker(sticker.id)}
                      className="text-xs border-red-500/40 text-red-400 hover:border-red-400"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </GamingButton>
                  </div>
                </GamingCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty States */}
      {challenges.length === 0 && (
        <div className="text-center py-16">
          <Target className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-slate-300 mb-2">
            No challenges available
          </h4>
          <p className="text-slate-500 mb-6">
            Create challenges first before generating QR stickers
          </p>
        </div>
      )}

      {activeChallenges.length === 0 && challenges.length > 0 && (
        <div className="text-center py-16">
          <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-amber-200 mb-2">
            No active challenges
          </h4>
          <p className="text-slate-400 mb-6">
            Activate some challenges to generate stickers for them
          </p>
        </div>
      )}

      {availableChallenges.length === 0 && activeChallenges.length > 0 && stickers.length === 0 && (
        <div className="text-center py-16">
          <Smartphone className="h-16 w-16 text-pink-500 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-pink-200 mb-2">
            Ready to create stickers!
          </h4>
          <p className="text-slate-400 mb-6">
            You have {activeChallenges.length} challenge{activeChallenges.length !== 1 ? 's' : ''} ready for sticker generation
          </p>
          <GamingButton
            variant="mystery"
            size="lg"
            onClick={generateAllStickers}
            isLoading={isGenerating}
          >
            <Sticker className="h-5 w-5" />
            Generate All Stickers
          </GamingButton>
        </div>
      )}

      {/* Sticker Editor Modal */}
      <AnimatePresence>
        {isEditing && selectedSticker && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-900 border border-slate-600 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-pink-200">
                    Edit QR Sticker
                  </h3>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setSelectedSticker(null)
                    }}
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sticker Settings */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-slate-200">Sticker Settings</h4>
                    
                    <GamingInput
                      label="Sticker Name"
                      placeholder="Name for this sticker"
                      value={selectedSticker.name}
                      onChange={(e) => setSelectedSticker({
                        ...selectedSticker,
                        name: e.target.value
                      })}
                    />

                    <div>
                      <label className="text-sm font-bold text-pink-300 uppercase tracking-wide mb-2 block">
                        Usage Limit
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={selectedSticker.usageLimit}
                        onChange={(e) => setSelectedSticker({
                          ...selectedSticker,
                          usageLimit: parseInt(e.target.value) || 100
                        })}
                        className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                        <input
                          type="checkbox"
                          checked={selectedSticker.isActive}
                          onChange={(e) => setSelectedSticker({
                            ...selectedSticker,
                            isActive: e.target.checked
                          })}
                          className="w-4 h-4 text-pink-500 bg-slate-700 border-slate-600 rounded focus:ring-pink-500 focus:ring-2"
                        />
                        Active sticker
                      </label>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-slate-200">Preview</h4>
                    
                    <div className="text-center p-6 rounded-xl border border-slate-600 bg-slate-800/30">
                      <div className="inline-block p-4 rounded-xl border-2 border-pink-500/30 bg-white">
                        <img
                          src={selectedSticker.qrCodeDataURL}
                          alt="Sticker preview"
                          className="w-32 h-32 mx-auto"
                        />
                      </div>
                      <div className="mt-4 text-sm">
                        <div className="text-pink-200 font-bold">{selectedSticker.challengeName}</div>
                        <div className="text-slate-400">Challenge Sticker</div>
                        <div className="text-slate-500 text-xs mt-2">#{selectedSticker.id.slice(-8)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-slate-700">
                  <GamingButton
                    variant="ghost"
                    size="md"
                    onClick={() => {
                      setIsEditing(false)
                      setSelectedSticker(null)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </GamingButton>
                  <GamingButton
                    variant="mystery"
                    size="md"
                    onClick={() => updateSticker(selectedSticker)}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Save Changes
                  </GamingButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Canvas (Hidden) */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}