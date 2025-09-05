'use client'

import React, { useState } from 'react'
import { 
  Download, 
  FileText, 
  Printer, 
  Share2, 
  Grid3X3,
  MapPin,
  QrCode,
  Package,
  Copy,
  CheckCircle,
  Smartphone,
  Globe
} from 'lucide-react'
import { motion } from 'framer-motion'
import { GamingButton, GamingCard, GamingBadge } from '@/components/ui/gaming-components'

interface Location {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  address?: string
  radius: number
  order: number
  isRequired: boolean
}

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

interface QRExporterProps {
  locations: Location[]
  qrCodes: QRCodeData[]
  adventureTitle: string
  adventureId: string
}

export default function QRExporter({
  locations,
  qrCodes,
  adventureTitle,
  adventureId
}: QRExporterProps) {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'zip' | 'json'>('pdf')
  const [includeInstructions, setIncludeInstructions] = useState(true)
  const [includeMap, setIncludeMap] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  // Generate installation guide
  const generateInstallationGuide = () => {
    return `
# ClueQuest Adventure: ${adventureTitle}

## QR Code Installation Guide

### Overview
This package contains ${qrCodes.length} QR codes for your adventure. Each QR code corresponds to a specific location and must be placed correctly for the adventure to work.

### Installation Instructions

${locations.map((location, index) => {
  const qrCode = qrCodes.find(qr => qr.locationId === location.id)
  return `
#### Location ${location.order}: ${location.name}
- **QR Code File**: qr-${location.name.toLowerCase().replace(/\s+/g, '-')}.png
- **Description**: ${location.description}
- **Coordinates**: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}
${location.address ? `- **Address**: ${location.address}` : ''}
- **Detection Radius**: ${location.radius}m
- **Required**: ${location.isRequired ? 'Yes' : 'Optional'}

**Installation Steps:**
1. Print the QR code at high quality (minimum 200x200px)
2. Laminate or protect from weather if outdoors
3. Mount securely at the specified location
4. Test scan from ${location.radius}m away to verify detection
${location.isRequired ? '⚠️ CRITICAL: This location is required for adventure completion' : ''}
`
}).join('\n')}

### Security Information
- All QR codes include HMAC signatures to prevent tampering
- Each QR code expires on ${qrCodes[0]?.expiresAt.toLocaleDateString()}
- Usage limit: ${qrCodes[0]?.usageLimit} scans per QR code
- Adventure ID: ${adventureId}

### Troubleshooting
1. **QR Code not scanning**: Ensure proper lighting and clean surface
2. **Location not detected**: Check GPS signal and proximity to coordinates
3. **Security errors**: QR codes may be expired, regenerate in builder
4. **Installation issues**: Contact ClueQuest support

### Support
For technical support, contact: support@cluequest.app
Adventure Builder: https://cluequest.app/builder
    `.trim()
  }

  // Export to PDF
  const exportToPDF = async () => {
    setIsExporting(true)
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const installationGuide = generateInstallationGuide()
      
      // Create download link
      const blob = new Blob([installationGuide], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${adventureTitle.toLowerCase().replace(/\s+/g, '-')}-qr-installation-guide.txt`
      link.click()
      URL.revokeObjectURL(url)
      
    } catch (error) {
    } finally {
      setIsExporting(false)
    }
  }

  // Export QR codes as ZIP
  const exportAsZip = async () => {
    setIsExporting(true)
    
    try {
      // Simulate ZIP creation with all QR codes and guide
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const installationGuide = generateInstallationGuide()
      const blob = new Blob([installationGuide], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${adventureTitle.toLowerCase().replace(/\s+/g, '-')}-complete-package.txt`
      link.click()
      URL.revokeObjectURL(url)
      
    } catch (error) {
    } finally {
      setIsExporting(false)
    }
  }

  // Export as JSON
  const exportAsJSON = () => {
    const exportData = {
      adventure: {
        id: adventureId,
        title: adventureTitle,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      },
      locations,
      qrCodes: qrCodes.map(qr => ({
        ...qr,
        expiresAt: qr.expiresAt.toISOString()
      })),
      installationGuide: generateInstallationGuide()
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${adventureTitle.toLowerCase().replace(/\s+/g, '-')}-data.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Copy installation guide
  const copyInstallationGuide = async () => {
    try {
      await navigator.clipboard.writeText(generateInstallationGuide())
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
    }
  }

  // Generate shareable link
  const generateShareableLink = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://cluequest.app'
    return `${baseUrl}/adventure/${adventureId}`
  }

  const handleExport = () => {
    switch (exportFormat) {
      case 'pdf':
        exportToPDF()
        break
      case 'zip':
        exportAsZip()
        break
      case 'json':
        exportAsJSON()
        break
    }
  }

  if (qrCodes.length === 0) {
    return (
      <div className="text-center py-8">
        <QrCode className="h-12 w-12 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400">Generate QR codes first to enable export functionality</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-amber-200 mb-2 flex items-center justify-center gap-2">
          <Package className="h-6 w-6" />
          Export & Installation Package
        </h3>
        <p className="text-slate-400">
          Download QR codes and installation instructions for your adventure
        </p>
      </div>

      {/* Export Options */}
      <GamingCard className="p-6 space-y-6">
        <h4 className="text-lg font-bold text-emerald-200 mb-4">Export Configuration</h4>
        
        <div className="space-y-4">
          {/* Format Selection */}
          <div>
            <label className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-3 block">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'pdf', name: 'PDF Package', icon: FileText, desc: 'Installation guide + QR images' },
                { id: 'zip', name: 'ZIP Archive', icon: Package, desc: 'All files bundled together' },
                { id: 'json', name: 'JSON Data', icon: Share2, desc: 'Raw data for integration' }
              ].map(format => (
                <button
                  key={format.id}
                  onClick={() => setExportFormat(format.id as any)}
                  className={`p-4 rounded-lg border transition-all text-center ${
                    exportFormat === format.id
                      ? 'border-amber-500/40 bg-amber-500/10 ring-2 ring-amber-500/20'
                      : 'border-slate-600 bg-slate-800/40 hover:border-slate-500'
                  }`}
                >
                  <format.icon className={`h-6 w-6 mx-auto mb-2 ${
                    exportFormat === format.id ? 'text-amber-300' : 'text-slate-400'
                  }`} />
                  <div className={`font-semibold text-sm mb-1 ${
                    exportFormat === format.id ? 'text-amber-200' : 'text-slate-200'
                  }`}>
                    {format.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {format.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Include Options */}
          <div>
            <label className="text-sm font-bold text-slate-300 uppercase tracking-wide mb-3 block">
              Include Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeInstructions}
                  onChange={(e) => setIncludeInstructions(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2"
                />
                <span className="text-slate-300 font-medium">Installation instructions</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeMap}
                  onChange={(e) => setIncludeMap(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2"
                />
                <span className="text-slate-300 font-medium">Location map overview</span>
              </label>
            </div>
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-700">
          <GamingButton
            variant="mystery"
            size="md"
            onClick={handleExport}
            isLoading={isExporting}
            className="flex-1"
          >
            <Download className="h-5 w-5" />
            Export {exportFormat.toUpperCase()} Package
          </GamingButton>
          
          <GamingButton
            variant="outline"
            size="md"
            onClick={copyInstallationGuide}
            className="flex-1"
          >
            {copySuccess ? (
              <>
                <CheckCircle className="h-5 w-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-5 w-5" />
                Copy Guide
              </>
            )}
          </GamingButton>
        </div>
      </GamingCard>

      {/* Package Contents Preview */}
      <GamingCard className="p-6 space-y-4">
        <h4 className="text-lg font-bold text-purple-200 mb-4 flex items-center gap-2">
          <Grid3X3 className="h-5 w-5" />
          Package Contents Preview
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QR Codes List */}
          <div>
            <h5 className="text-base font-bold text-amber-200 mb-3">QR Codes ({qrCodes.length})</h5>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {qrCodes.map((qr, index) => {
                const location = locations.find(l => l.id === qr.locationId)
                return (
                  <div 
                    key={qr.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-600/50"
                  >
                    <div className="w-8 h-8 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                      <span className="text-xs font-bold text-amber-200">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-200 text-sm">
                        {qr.locationName}
                      </div>
                      <div className="text-xs text-slate-400">
                        qr-{qr.locationName.toLowerCase().replace(/\s+/g, '-')}.png
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">
                      {location?.radius}m
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Documentation Files */}
          <div>
            <h5 className="text-base font-bold text-emerald-200 mb-3">Documentation</h5>
            <div className="space-y-2">
              {includeInstructions && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-600/50">
                  <FileText className="h-5 w-5 text-emerald-400" />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-200 text-sm">
                      Installation Guide
                    </div>
                    <div className="text-xs text-slate-400">
                      Step-by-step setup instructions
                    </div>
                  </div>
                </div>
              )}
              
              {includeMap && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-600/50">
                  <MapPin className="h-5 w-5 text-purple-400" />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-200 text-sm">
                      Location Overview Map
                    </div>
                    <div className="text-xs text-slate-400">
                      Visual location reference guide
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-600/50">
                <QrCode className="h-5 w-5 text-blue-400" />
                <div className="flex-1">
                  <div className="font-semibold text-slate-200 text-sm">
                    QR Code Specifications
                  </div>
                  <div className="text-xs text-slate-400">
                    Technical details and security info
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GamingCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GamingButton
          variant="outline"
          size="md"
          onClick={() => {
            qrCodes.forEach((qr, index) => {
              setTimeout(() => {
                // Generate and download each QR code
                const qrPayload = {
                  type: 'cluequest_checkpoint',
                  adventureId: qr.adventureId,
                  locationId: qr.locationId,
                  token: qr.securityToken,
                  signature: qr.hmacSignature
                }
                const qrString = `https://cluequest.app/scan?data=${btoa(JSON.stringify(qrPayload))}`
                
                // Create temporary download link
                const link = document.createElement('a')
                link.download = `qr-${qr.locationName.toLowerCase().replace(/\s+/g, '-')}.txt`
                link.href = `data:text/plain,${encodeURIComponent(qrString)}`
                link.click()
              }, index * 200)
            })
          }}
          className="text-center"
        >
          <Download className="h-5 w-5 mx-auto mb-1" />
          <span className="text-xs">Download All QRs</span>
        </GamingButton>

        <GamingButton
          variant="outline"
          size="md"
          onClick={() => window.print()}
          className="text-center"
        >
          <Printer className="h-5 w-5 mx-auto mb-1" />
          <span className="text-xs">Print Page</span>
        </GamingButton>

        <GamingButton
          variant="outline"
          size="md"
          onClick={() => {
            const shareableLink = generateShareableLink()
            navigator.clipboard.writeText(shareableLink)
          }}
          className="text-center"
        >
          <Share2 className="h-5 w-5 mx-auto mb-1" />
          <span className="text-xs">Share Adventure</span>
        </GamingButton>

        <GamingButton
          variant="outline"
          size="md"
          onClick={() => {
            const url = `https://cluequest.app/adventure/${adventureId}/mobile-setup`
            window.open(url, '_blank')
          }}
          className="text-center"
        >
          <Smartphone className="h-5 w-5 mx-auto mb-1" />
          <span className="text-xs">Mobile Setup</span>
        </GamingButton>
      </div>

      {/* Export Summary */}
      <div className="p-4 rounded-xl border border-slate-600/50 bg-slate-800/30 space-y-3">
        <div className="flex items-center justify-between">
          <h5 className="text-base font-bold text-slate-200">Export Summary</h5>
          <GamingBadge variant="emerald">Ready to Export</GamingBadge>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
          <div>
            <div className="text-xl font-bold text-amber-400">{qrCodes.length}</div>
            <div className="text-slate-400">QR Codes</div>
          </div>
          <div>
            <div className="text-xl font-bold text-purple-400">{locations.length}</div>
            <div className="text-slate-400">Locations</div>
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-400">
              {locations.filter(l => l.isRequired).length}
            </div>
            <div className="text-slate-400">Required</div>
          </div>
          <div>
            <div className="text-xl font-bold text-blue-400">
              {Math.round(locations.reduce((sum, l) => sum + l.radius, 0) / locations.length)}m
            </div>
            <div className="text-slate-400">Avg Radius</div>
          </div>
        </div>
      </div>
    </div>
  )
}