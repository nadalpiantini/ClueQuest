'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Camera, X, Flashlight, FlashlightOff, RotateCcw, 
  CheckCircle2, AlertTriangle, MapPin, Clock, Zap,
  Shield, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { QRScanResult } from '@/types/adventure'

type ScanState = 'initializing' | 'scanning' | 'processing' | 'success' | 'error' | 'fraud_detected'

interface ScanSession {
  id: string
  startTime: number
  attempts: number
  lastScanTime?: number
}

function QRScanPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionCode = searchParams.get('session')
  const locationId = searchParams.get('location')
  const isGuest = searchParams.get('guest') === 'true'
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scanState, setScanState] = useState<ScanState>('initializing')
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [flashlightOn, setFlashlightOn] = useState(false)
  const [scanResult, setScanResult] = useState<QRScanResult | null>(null)
  const [error, setError] = useState<string>('')
  const [scanProgress, setScanProgress] = useState(0)
  const [scanSession, setScanSession] = useState<ScanSession>({
    id: `scan_${Date.now()}`,
    startTime: Date.now(),
    attempts: 0
  })
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [geofenceStatus, setGeofenceStatus] = useState<'checking' | 'inside' | 'outside' | 'unavailable'>('checking')

  // Initialize camera and location services
  useEffect(() => {
    initializeCamera()
    getCurrentLocation()
    
    return () => {
      // Cleanup camera stream
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Start QR code scanning when camera is ready
  useEffect(() => {
    if (scanState === 'scanning' && videoRef.current) {
      startQRScanning()
    }
  }, [scanState])

  const initializeCamera = async () => {
    try {
      setScanState('initializing')
      
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'environment', // Rear camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setCameraStream(stream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          setScanState('scanning')
        }
      }
    } catch (error) {
      setError('Camera access denied. Please enable camera permissions.')
      setScanState('error')
    }
  }

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setGeofenceStatus('unavailable')
      return
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        })
      })

      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
      
      // Check geofence if location ID provided
      if (locationId) {
        checkGeofence(position.coords.latitude, position.coords.longitude)
      } else {
        setGeofenceStatus('inside') // Allow scanning without specific location
      }
    } catch (error) {
      setGeofenceStatus('unavailable')
    }
  }

  const checkGeofence = async (lat: number, lng: number) => {
    try {
      // Mock geofence check - in real app, validate against scene location
      const response = await fetch('/api/locations/geofence-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationId,
          userLat: lat,
          userLng: lng,
          sessionCode
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        setGeofenceStatus(result.inside ? 'inside' : 'outside')
      } else {
        setGeofenceStatus('unavailable')
      }
    } catch (error) {
      setGeofenceStatus('unavailable')
    }
  }

  const startQRScanning = () => {
    const scanInterval = setInterval(() => {
      if (videoRef.current && canvasRef.current && scanState === 'scanning') {
        captureAndProcessFrame()
      }
    }, 200) // Scan every 200ms

    return () => clearInterval(scanInterval)
  }

  const captureAndProcessFrame = async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get image data for QR processing
    const imageData = canvas.toDataURL('image/jpeg', 0.8)

    // Process QR code (in real app, use a QR code library like jsQR)
    await processQRCode(imageData)
  }

  const processQRCode = async (imageData: string) => {
    try {
      // Mock QR code detection and processing
      // In real implementation, use jsQR or similar library
      
      // Simulate processing time
      setScanState('processing')
      setScanProgress(30)

      // Increment scan attempts
      setScanSession(prev => ({
        ...prev,
        attempts: prev.attempts + 1,
        lastScanTime: Date.now()
      }))

      // Mock QR scan API call
      const response = await fetch('/api/qr/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrData: 'CQ_SCENE001_mock_hash', // Mock QR data for testing
          sessionCode,
          participantId: isGuest ? 'guest' : 'user',
          location: userLocation,
          deviceInfo: {
            userAgent: navigator.userAgent,
            timestamp: Date.now()
          }
        })
      })

      setScanProgress(70)

      const result: QRScanResult = await response.json()

      setScanProgress(100)

      if (!response.ok) {
        throw new Error(result.error || 'Scan failed')
      }

      // Check for fraud detection
      if (result.fraud_detected) {
        setScanState('fraud_detected')
        setScanResult(result)
        return
      }

      if (result.valid) {
        setScanState('success')
        setScanResult({
          valid: true,
          qr_code: {
            id: 'qr-1',
            scene_id: 'scene-1',
            code: 'QR123456',
            secure_hash: 'hash123',
            location_description: 'Test location',
            geofence_radius_meters: 100,
            scan_limit: 10,
            scan_count: 1,
            is_active: true,
            expires_at: null,
            created_at: new Date().toISOString()
          },
          scene: {
            id: 'scene-1',
            adventure_id: 'adventure-1',
            title: 'Test Scene',
            description: 'Adventure continues...',
            location_lat: null,
            location_lng: null,
            location_name: null,
            qr_codes: [],
            ar_assets: [],
            challenges: [],
            narrative_conditions: [],
            unlock_conditions: [],
            order_index: 1,
            estimated_duration_minutes: 15
          },
          fraud_detected: false
        })
        
        // Auto-navigate to challenges after short delay
        setTimeout(() => {
          router.push(`/adventure/challenges?session=${sessionCode}&scene=scene-1${isGuest ? '&guest=true' : ''}`)
        }, 2000)
      } else {
        throw new Error(result.error || 'Invalid QR code')
      }
    } catch (error: any) {
      setError(error.message || 'Failed to process QR code')
      setScanState('error')
    }
  }

  const generateDeviceFingerprint = (): string => {
    // Generate device fingerprint for fraud detection
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx?.fillText('fingerprint', 10, 10)
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvas.toDataURL()
    }
    
    return btoa(JSON.stringify(fingerprint))
  }

  const toggleFlashlight = async () => {
    if (!cameraStream) return

    try {
      const track = cameraStream.getVideoTracks()[0]
      const capabilities = track.getCapabilities()

      if ('torch' in capabilities) {
        await track.applyConstraints({
          advanced: [{ torch: !flashlightOn } as any]
        })
        setFlashlightOn(!flashlightOn)
      }
    } catch (error) {
    }
  }

  const handleRetry = () => {
    setError('')
    setScanResult(null)
    setScanProgress(0)
    setScanState('scanning')
    setScanSession({
      id: `scan_${Date.now()}`,
      startTime: Date.now(),
      attempts: 0
    })
  }

  const handleClose = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
    }
    router.back()
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      
      {/* Camera View */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          autoPlay
        />
        
        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Scan Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Scan Frame */}
          <div className="relative">
            <div className="w-64 h-64 border-2 border-white rounded-2xl relative">
              {/* Corner Markers */}
              <div className="absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 border-primary rounded-tl-lg"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 border-primary rounded-tr-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 border-primary rounded-bl-lg"></div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-primary rounded-br-lg"></div>
              
              {/* Scanning Animation */}
              <AnimatePresence>
                {scanState === 'scanning' && (
                  <motion.div
                    initial={{ y: -256 }}
                    animate={{ y: 256 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute left-0 right-0 h-1 bg-primary shadow-lg shadow-primary/50"
                  />
                )}
              </AnimatePresence>
            </div>
            
            {/* Instruction Text */}
            <div className="mt-6 text-center">
              <p className="text-white text-lg font-medium mb-2">
                {scanState === 'initializing' && 'Initializing camera...'}
                {scanState === 'scanning' && 'Align QR code within the frame'}
                {scanState === 'processing' && 'Processing QR code...'}
                {scanState === 'success' && 'QR code scanned successfully!'}
                {scanState === 'error' && 'Scan failed'}
                {scanState === 'fraud_detected' && 'Security alert detected'}
              </p>
              
              {/* Geofence Status */}
              <AnimatePresence>
                {geofenceStatus !== 'checking' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-2 text-sm text-white/80 mb-2"
                  >
                    <MapPin className="w-4 h-4" />
                    {geofenceStatus === 'inside' && 'Location verified'}
                    {geofenceStatus === 'outside' && 'Move closer to the location'}
                    {geofenceStatus === 'unavailable' && 'Location services unavailable'}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress Bar */}
              <AnimatePresence>
                {scanState === 'processing' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-64 mx-auto"
                  >
                    <Progress value={scanProgress} className="h-2 bg-white/20" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 pt-safe px-4 py-4 z-20">
        <div className="flex justify-between items-center">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleClose}
            className="bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70 touch-target"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="text-center">
            <p className="text-white text-sm font-medium">QR Scanner</p>
            {sessionCode && (
              <p className="text-white/70 text-xs">Session: {sessionCode}</p>
            )}
          </div>

          <Button
            variant="secondary"
            size="icon"
            onClick={toggleFlashlight}
            className="bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70 touch-target"
          >
            {flashlightOn ? (
              <FlashlightOff className="w-5 h-5" />
            ) : (
              <Flashlight className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="absolute bottom-0 left-0 right-0 pb-safe px-4 py-4 z-20">
        <div className="text-center text-white">
          {scanSession.attempts > 0 && (
            <p className="text-xs text-white/60 mb-2">
              Attempts: {scanSession.attempts} • Session time: {Math.round((Date.now() - scanSession.startTime) / 1000)}s
            </p>
          )}
        </div>
      </div>

      {/* Result Overlays */}
      <AnimatePresence>
        
        {/* Success Overlay */}
        {scanState === 'success' && scanResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-green-900/90 backdrop-blur-sm center-flex z-30"
          >
            <Card className="max-w-sm mx-4 bg-green-50 border-green-200">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full center-flex mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-green-800">QR Code Scanned!</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div>
                  <h3 className="font-semibold text-green-900">{scanResult.scene?.title}</h3>
                  <p className="text-sm text-green-700">{scanResult.scene?.description}</p>
                </div>
                
                {scanResult.challenges && scanResult.challenges.length > 0 && (
                  <div className="flex items-center justify-center gap-2 text-sm text-green-700">
                    <Zap className="w-4 h-4" />
                    <span>{scanResult.challenges.length} challenges await</span>
                  </div>
                )}
                
                <div className="text-xs text-green-600">
                  Redirecting to challenges...
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Error Overlay */}
        {scanState === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-red-900/90 backdrop-blur-sm center-flex z-30"
          >
            <Card className="max-w-sm mx-4 bg-red-50 border-red-200">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full center-flex mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-red-800">Scan Failed</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-sm text-red-700">{error}</p>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleRetry}
                    className="flex-1 touch-target"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleClose}
                    className="flex-1 touch-target"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Fraud Detection Overlay */}
        {scanState === 'fraud_detected' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-orange-900/90 backdrop-blur-sm center-flex z-30"
          >
            <Card className="max-w-sm mx-4 bg-orange-50 border-orange-200">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full center-flex mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-orange-800">Security Alert</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="flex items-start gap-2 text-sm text-orange-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Unusual scanning activity detected. Please contact a game host if you believe this is an error.
                  </p>
                </div>
                
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  className="w-full touch-target"
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function QRScanPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <QRScanPageContent />
    </React.Suspense>
  )
}