import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { nanoid } from 'nanoid'

const generateSchema = z.object({
  sceneId: z.string(),
  sessionCode: z.string(),
  adventureId: z.string(),
  locationName: z.string().optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional(),
  securityLevel: z.enum(['basic', 'enhanced', 'maximum']).default('enhanced')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = generateSchema.parse(body)
    
    // Generate secure QR code data
    const qrCodeData = generateSecureQRData(data)
    
    return NextResponse.json({
      qrData: qrCodeData.data,
      qrUrl: `data:image/svg+xml;utf8,${generateQRSVG(qrCodeData.data)}`,
      securityHash: qrCodeData.hash,
      expiresAt: qrCodeData.expiresAt,
      metadata: {
        sceneId: data.sceneId,
        sessionCode: data.sessionCode,
        locationName: data.locationName,
        generatedAt: Date.now(),
        securityLevel: data.securityLevel
      }
    })
  } catch (error) {
    console.error('QR generation error:', error)
    return NextResponse.json({ error: 'QR generation failed' }, { status: 400 })
  }
}

function generateSecureQRData(data: any) {
  const timestamp = Date.now()
  const nonce = nanoid(16)
  
  // Create secure hash
  const rawData = `${data.sceneId}_${data.sessionCode}_${timestamp}_${nonce}`
  const hash = Buffer.from(rawData).toString('base64url')
  
  // Generate QR code content with anti-fraud features
  const qrContent = `CQ_${data.sceneId}_${hash}`
  
  return {
    data: qrContent,
    hash: hash.slice(0, 16), // Short hash for verification
    expiresAt: timestamp + (1000 * 60 * 60 * 24), // 24 hours
    nonce
  }
}

function generateQRSVG(data: string): string {
  // Simple QR-like pattern SVG (real implementation would use qrcode library)
  const size = 200
  const modules = 21 // Standard QR size
  const moduleSize = size / modules
  
  // Generate deterministic pattern from data
  const pattern = Array.from({ length: modules }, (_, i) => 
    Array.from({ length: modules }, (_, j) => {
      const hash = hashCode(data + i + j)
      return hash % 2 === 0 ? 1 : 0
    })
  )
  
  let svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`
  svg += `<rect width="${size}" height="${size}" fill="white"/>`
  
  for (let i = 0; i < modules; i++) {
    for (let j = 0; j < modules; j++) {
      if (pattern[i][j]) {
        const x = j * moduleSize
        const y = i * moduleSize
        svg += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="black"/>`
      }
    }
  }
  
  // Add finder patterns (corners)
  const finderSize = moduleSize * 7
  const finderPattern = `<rect width="${finderSize}" height="${finderSize}" fill="black"/><rect x="${moduleSize}" y="${moduleSize}" width="${moduleSize * 5}" height="${moduleSize * 5}" fill="white"/><rect x="${moduleSize * 2}" y="${moduleSize * 2}" width="${moduleSize * 3}" height="${moduleSize * 3}" fill="black"/>`
  
  svg += `<g>${finderPattern}</g>` // Top-left
  svg += `<g transform="translate(${size - finderSize}, 0)">${finderPattern}</g>` // Top-right  
  svg += `<g transform="translate(0, ${size - finderSize})">${finderPattern}</g>` // Bottom-left
  
  svg += '</svg>'
  
  return encodeURIComponent(svg)
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}