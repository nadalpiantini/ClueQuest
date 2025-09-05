import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const scanSchema = z.object({
  qrData: z.string(),
  sessionCode: z.string(),
  participantId: z.string().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
  deviceInfo: z.object({
    userAgent: z.string(),
    timestamp: z.number()
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = scanSchema.parse(body)
    
    // Mock QR validation with security checks
    const qrValidation = validateQRCode(data.qrData, data.sessionCode, data.location)
    
    if (qrValidation.valid) {
      return NextResponse.json({
        valid: true,
        sceneId: qrValidation.sceneId,
        story: qrValidation.story,
        nextAction: qrValidation.nextAction,
        locationVerified: qrValidation.locationVerified,
        securityChecks: {
          antiReplay: true,
          geofenceCheck: qrValidation.locationVerified,
          sessionValid: true,
          deviceTrusted: true
        }
      })
    } else {
      return NextResponse.json({
        valid: false,
        error: qrValidation.error,
        fraudScore: qrValidation.fraudScore
      }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid QR scan' }, { status: 400 })
  }
}

function validateQRCode(qrData: string, sessionCode: string, location?: { lat: number; lng: number }) {
  // Basic QR format validation
  if (!qrData.startsWith('CQ_')) {
    return {
      valid: false,
      error: 'Invalid QR code format',
      fraudScore: 0.8
    }
  }
  
  // Extract scene info from QR
  const [prefix, sceneId, hash] = qrData.split('_')
  
  if (!sceneId || !hash) {
    return {
      valid: false,
      error: 'Corrupted QR code',
      fraudScore: 0.6
    }
  }
  
  // Mock scene content
  const sceneContent = {
    'SCENE001': {
      story: "You've found the ancient library. The dusty books whisper secrets of old...",
      nextAction: "Search for the golden key hidden among the volumes."
    },
    'SCENE002': {
      story: "The garden maze stretches before you, paths winding in mysterious patterns...",
      nextAction: "Navigate to the center where the fountain holds the next clue."
    },
    'SCENE003': {
      story: "The lighthouse beacon cuts through the fog, revealing hidden symbols...",
      nextAction: "Decode the lighthouse pattern to unlock the treasure chamber."
    }
  }
  
  const scene = sceneContent[sceneId as keyof typeof sceneContent]
  
  return {
    valid: true,
    sceneId,
    story: scene?.story || "You've discovered a mysterious location...",
    nextAction: scene?.nextAction || "Continue your investigation.",
    locationVerified: location ? true : false
  }
}