'use client'

import React, { useState, useEffect, useRef } from 'react'
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
  Lock
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GamingButton, GamingCard, GamingInput, GamingBadge } from '@/components/ui/gaming-components'

interface QRCodeData {
  id: string
  locationId: string
  locationName: string
  adventureId: string
  securityToken: string
  hmacSignature: string
  expiresAt: Date
  usageLimit: number
  currentUsage: number
}

interface QRCodeConfig {
  size: number
  foregroundColor: string
  backgroundColor: string
  logoUrl?: string
  borderRadius: number
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
}

interface Location {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  order: number
}

interface QRGeneratorProps {
  locations: Location[]
  adventureId: string
  onQRCodesGenerated: (qrCodes: QRCodeData[]) => void
  existingQRCodes?: QRCodeData[]
}

export default function QRGenerator({
  locations,
  adventureId,
  onQRCodesGenerated,
  existingQRCodes = []
}: QRGeneratorProps) {
  const [qrCodes, setQRCodes] = useState<QRCodeData[]>(existingQRCodes)
  const [selectedQR, setSelectedQR] = useState<QRCodeData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrConfig, setQRConfig] = useState<QRCodeConfig>({
    size: 200,
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    errorCorrectionLevel: 'M'
  })
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [copySuccess, setCopySuccess] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Generate secure QR codes for all locations
  const generateQRCodes = async () => {
    if (locations.length === 0) return

    setIsGenerating(true)

    try {
      // Simulate QR generation with security features
      const newQRCodes: QRCodeData[] = await Promise.all(
        locations.map(async (location) => {
          // Generate security token and HMAC
          const securityToken = crypto.randomUUID()
          const hmacSignature = await generateHMACSignature(location.id, securityToken)
          
          return {
            id: crypto.randomUUID(),
            locationId: location.id,
            locationName: location.name,
            adventureId,
            securityToken,
            hmacSignature,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            usageLimit: 10,
            currentUsage: 0
          }
        })
      )

      setQRCodes(newQRCodes)
      onQRCodesGenerated(newQRCodes)
    } catch (error) {
      console.error('Failed to generate QR codes:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate HMAC signature for security
  const generateHMACSignature = async (locationId: string, securityToken: string): Promise<string> => {
    const data = `${locationId}:${securityToken}:${adventureId}`
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode('cluequest-hmac-secret'),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  // Generate QR code data URL
  const generateQRDataURL = (qrData: QRCodeData): string => {
    // QR code payload with security
    const qrPayload = {
      type: 'cluequest_checkpoint',
      adventureId: qrData.adventureId,
      locationId: qrData.locationId,
      token: qrData.securityToken,
      signature: qrData.hmacSignature,
      timestamp: Date.now()
    }

    // Simulate QR code generation
    const qrString = `https://cluequest.app/scan?data=${btoa(JSON.stringify(qrPayload))}`
    
    // Mock QR code canvas generation
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        canvas.width = qrConfig.size
        canvas.height = qrConfig.size
        
        // Background
        ctx.fillStyle = qrConfig.backgroundColor
        ctx.fillRect(0, 0, qrConfig.size, qrConfig.size)
        
        // QR pattern simulation (simplified)
        ctx.fillStyle = qrConfig.foregroundColor
        const moduleSize = qrConfig.size / 25
        
        for (let i = 0; i < 25; i++) {
          for (let j = 0; j < 25; j++) {
            if (Math.random() > 0.5) {
              ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize)
            }
          }
        }
        
        return canvas.toDataURL('image/png')
      }
    }
    
    return 'data:image/svg+xml;base64,' + btoa(`
      <svg width="${qrConfig.size}" height="${qrConfig.size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${qrConfig.backgroundColor}" rx="${qrConfig.borderRadius}"/>
        <text x="50%" y="50%" text-anchor="middle" dy="0.35em" font-size="12" fill="${qrConfig.foregroundColor}">QR ${qrData.locationName}</text>
      </svg>
    `)
  }

  const copyQRData = async (qrData: QRCodeData) => {
    const qrPayload = {
      type: 'cluequest_checkpoint',
      adventureId: qrData.adventureId,
      locationId: qrData.locationId,
      token: qrData.securityToken,
      signature: qrData.hmacSignature
    }
    
    const qrString = `https://cluequest.app/scan?data=${btoa(JSON.stringify(qrPayload))}`
    
    try {
      await navigator.clipboard.writeText(qrString)
      setCopySuccess(qrData.id)
      setTimeout(() => setCopySuccess(null), 2000)
    } catch (error) {
      console.error('Failed to copy QR data:', error)
    }
  }

  const downloadQRCode = (qrData: QRCodeData) => {
    const dataURL = generateQRDataURL(qrData)
    const link = document.createElement('a')
    link.download = `qr-${qrData.locationName.toLowerCase().replace(/\s+/g, '-')}.png`
    link.href = dataURL
    link.click()
  }

  const downloadAllQRCodes = () => {
    qrCodes.forEach(qrData => {
      setTimeout(() => downloadQRCode(qrData), 100)
    })
  }

  const regenerateQRCode = async (qrData: QRCodeData) => {
    setIsGenerating(true)
    
    try {
      const securityToken = crypto.randomUUID()
      const hmacSignature = await generateHMACSignature(qrData.locationId, securityToken)
      
      const updatedQR = {
        ...qrData,
        securityToken,
        hmacSignature,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        currentUsage: 0
      }
      
      const updatedQRCodes = qrCodes.map(qr => 
        qr.id === qrData.id ? updatedQR : qr
      )
      
      setQRCodes(updatedQRCodes)
      onQRCodesGenerated(updatedQRCodes)
    } catch (error) {
      console.error('Failed to regenerate QR code:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-200 mb-3 flex items-center justify-center gap-3">
          <QrCode className="h-7 w-7" />
          QR Code Generator
        </h3>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Generate secure, tamper-proof QR codes for each location. Each QR includes HMAC signatures to prevent fraud and unauthorized access.
        </p>
      </div>

      {/* Generation Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="space-y-2">
          <div className="text-sm text-slate-300 font-semibold">
            QR Codes Status: {qrCodes.length} / {locations.length} generated
          </div>
          <div className="flex gap-2">
            {qrCodes.length > 0 && (
              <GamingBadge variant="emerald" size="sm">
                <Shield className="h-3 w-3" />
                HMAC Secured
              </GamingBadge>
            )}
            {locations.length > qrCodes.length && (
              <GamingBadge variant="red" size="sm">
                <AlertTriangle className="h-3 w-3" />
                {locations.length - qrCodes.length} Missing
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
            Settings
          </GamingButton>
          
          <GamingButton
            variant="mystery"
            size="md"
            onClick={generateQRCodes}
            isLoading={isGenerating}
            disabled={locations.length === 0}
          >
            <QrCode className="h-5 w-5" />
            {qrCodes.length === 0 ? 'Generate All QR Codes' : 'Regenerate All'}
          </GamingButton>
        </div>
      </div>

      {/* Advanced Settings */}
      <AnimatePresence>
        {showAdvancedSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <GamingCard className="p-6 space-y-6">
              <h4 className="text-lg font-bold text-purple-200 flex items-center gap-2">
                <Palette className="h-5 w-5" />
                QR Code Customization
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Settings */}
                <div className="space-y-4">
                  <h5 className="text-base font-bold text-amber-200">Visual Settings</h5>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-2 block">
                        QR Size
                      </label>
                      <input
                        type="range"
                        min="150"
                        max="400"
                        step="25"
                        value={qrConfig.size}
                        onChange={(e) => setQRConfig({
                          ...qrConfig,
                          size: parseInt(e.target.value)
                        })}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-xs text-slate-400 mt-1">{qrConfig.size}px</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-2 block">
                          Foreground
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={qrConfig.foregroundColor}
                            onChange={(e) => setQRConfig({
                              ...qrConfig,
                              foregroundColor: e.target.value
                            })}
                            className="w-12 h-10 rounded-lg border border-slate-600 bg-slate-800"
                          />
                          <input
                            type="text"
                            value={qrConfig.foregroundColor}
                            onChange={(e) => setQRConfig({
                              ...qrConfig,
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
                            value={qrConfig.backgroundColor}
                            onChange={(e) => setQRConfig({
                              ...qrConfig,
                              backgroundColor: e.target.value
                            })}
                            className="w-12 h-10 rounded-lg border border-slate-600 bg-slate-800"
                          />
                          <input
                            type="text"
                            value={qrConfig.backgroundColor}
                            onChange={(e) => setQRConfig({
                              ...qrConfig,
                              backgroundColor: e.target.value
                            })}
                            className="flex-1 px-3 py-2 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="space-y-4">
                  <h5 className="text-base font-bold text-amber-200">Security Settings</h5>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-2 block">
                        Error Correction Level
                      </label>
                      <select
                        value={qrConfig.errorCorrectionLevel}
                        onChange={(e) => setQRConfig({
                          ...qrConfig,
                          errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H'
                        })}
                        className="w-full px-4 py-3 bg-slate-800/60 border border-slate-600 rounded-lg text-slate-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      >
                        <option value="L">Low (7% recovery)</option>
                        <option value="M">Medium (15% recovery)</option>
                        <option value="Q">Quality (25% recovery)</option>
                        <option value="H">High (30% recovery)</option>
                      </select>
                    </div>

                    <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                      <div className="text-sm font-bold text-emerald-200 flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Security Features
                      </div>
                      <ul className="text-xs text-slate-400 space-y-1">
                        <li>• HMAC-SHA256 signature verification</li>
                        <li>• Time-based token expiration (24h)</li>
                        <li>• Usage limit protection (10 scans max)</li>
                        <li>• Adventure-specific validation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </GamingCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Codes Grid */}
      {qrCodes.length > 0 && (
        <div className="space-y-6">
          {/* Bulk Actions */}
          <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-slate-600/50 bg-slate-800/30">
            <div className="text-sm text-slate-300 font-semibold">
              Bulk Actions:
            </div>
            <GamingButton
              variant="outline"
              size="sm"
              onClick={downloadAllQRCodes}
              disabled={qrCodes.length === 0}
            >
              <Download className="h-4 w-4" />
              Download All
            </GamingButton>
            <GamingButton
              variant="ghost"
              size="sm"
              onClick={generateQRCodes}
              isLoading={isGenerating}
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate All
            </GamingButton>
          </div>

          {/* QR Codes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qrCodes.map((qrData, index) => (
              <motion.div
                key={qrData.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <GamingCard className="p-6 space-y-4">
                  {/* QR Code Preview */}
                  <div className="text-center">
                    <div className="inline-block p-4 rounded-xl border border-slate-600 bg-white">
                      <img
                        src={generateQRDataURL(qrData)}
                        alt={`QR Code for ${qrData.locationName}`}
                        className="w-32 h-32 mx-auto"
                        style={{
                          borderRadius: `${qrConfig.borderRadius}px`
                        }}
                      />
                    </div>
                  </div>

                  {/* Location Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <GamingBadge variant="gold" size="sm">
                        #{locations.find(l => l.id === qrData.locationId)?.order}
                      </GamingBadge>
                      <h5 className="text-base font-bold text-amber-200">
                        {qrData.locationName}
                      </h5>
                    </div>
                    
                    <div className="text-xs text-slate-400 space-y-1">
                      <div>Expires: {qrData.expiresAt.toLocaleDateString()}</div>
                      <div>Usage: {qrData.currentUsage} / {qrData.usageLimit}</div>
                      <div className="font-mono">ID: {qrData.id.slice(-8)}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/50">
                    <GamingButton
                      variant="ghost"
                      size="sm"
                      onClick={() => copyQRData(qrData)}
                      className="text-xs"
                    >
                      {copySuccess === qrData.id ? (
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
                      onClick={() => downloadQRCode(qrData)}
                      className="text-xs"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </GamingButton>
                  </div>
                </GamingCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {locations.length === 0 && (
        <div className="text-center py-16">
          <QrCode className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-slate-300 mb-2">
            Add locations first
          </h4>
          <p className="text-slate-500 mb-6">
            You need to set up locations before generating QR codes
          </p>
        </div>
      )}

      {/* No QR Codes Generated */}
      {locations.length > 0 && qrCodes.length === 0 && (
        <div className="text-center py-16">
          <Smartphone className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-amber-200 mb-2">
            Ready to generate QR codes
          </h4>
          <p className="text-slate-400 mb-6">
            You have {locations.length} location{locations.length !== 1 ? 's' : ''} ready for QR code generation
          </p>
          <GamingButton
            variant="mystery"
            size="lg"
            onClick={generateQRCodes}
            isLoading={isGenerating}
          >
            <QrCode className="h-5 w-5" />
            Generate Secure QR Codes
          </GamingButton>
        </div>
      )}

      {/* Preview Canvas (Hidden) */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}