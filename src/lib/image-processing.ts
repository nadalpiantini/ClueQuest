/**
 * Image Processing Utilities for ClueQuest Avatar Generation
 * Handles passport photo validation, face detection, and image optimization
 */

import sharp from 'sharp'
import { 
  FaceDetectionResult, 
  ProcessedImage, 
  PhotoValidationResult, 
  PhotoValidationIssue,
  ImageProcessingError 
} from '@/types/runware'

/**
 * Process and validate uploaded image for avatar generation
 * Ensures passport-style photo standards
 */
export async function processAvatarImage(
  imageBuffer: Buffer,
  originalFilename: string
): Promise<ProcessedImage> {
  try {
    // Get image metadata
    const image = sharp(imageBuffer)
    const metadata = await image.metadata()
    
    if (!metadata.width || !metadata.height) {
      throw new ImageProcessingError('Invalid image format', 'processing')
    }

    // Basic validation
    if (metadata.width < 512 || metadata.height < 512) {
      throw new ImageProcessingError('Image too small. Minimum 512x512 pixels required.', 'processing')
    }

    // Convert to RGB and normalize
    const processedBuffer = await image
      .removeAlpha() // Remove transparency
      .resize(1024, 1024, { 
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 90 })
      .toBuffer()

    // Perform face detection
    const faceDetection = await detectFace(processedBuffer)
    
    return {
      buffer: processedBuffer,
      width: 1024,
      height: 1024,
      format: 'jpeg',
      size_bytes: processedBuffer.length,
      face_detection: faceDetection
    }

  } catch (error) {
    if (error instanceof ImageProcessingError) {
      throw error
    }
    throw new ImageProcessingError(`Failed to process image: ${error}`, 'processing')
  }
}

/**
 * Basic face detection using image analysis
 * Note: This is a simplified implementation. For production, consider using
 * a proper face detection library like face-api.js or cloud services
 */
export async function detectFace(imageBuffer: Buffer): Promise<FaceDetectionResult> {
  try {
    const image = sharp(imageBuffer)
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true })
    
    // Simplified face detection based on image characteristics
    // This is a basic implementation - in production, use proper ML models
    
    const qualityMetrics = await analyzeImageQuality(imageBuffer)
    
    // Basic heuristics for face presence and quality
    // In production, replace with actual face detection ML model
    const estimatedFacePresence = await estimateFacePresence(imageBuffer)
    
    return {
      faces_detected: estimatedFacePresence.face_count,
      has_single_face: estimatedFacePresence.face_count === 1,
      face_confidence: estimatedFacePresence.confidence,
      face_bounds: estimatedFacePresence.bounds,
      quality_score: qualityMetrics.overall_quality,
      lighting_quality: qualityMetrics.lighting_score,
      is_frontal: estimatedFacePresence.is_frontal,
      meets_passport_standards: (
        estimatedFacePresence.face_count === 1 &&
        estimatedFacePresence.confidence > 0.7 &&
        qualityMetrics.overall_quality > 60 &&
        qualityMetrics.lighting_score > 50
      )
    }

  } catch (error) {
    // Return safe defaults on detection failure
    return {
      faces_detected: 0,
      has_single_face: false,
      face_confidence: 0,
      quality_score: 0,
      lighting_quality: 0,
      is_frontal: false,
      meets_passport_standards: false
    }
  }
}

/**
 * Analyze image quality metrics
 */
async function analyzeImageQuality(imageBuffer: Buffer) {
  const image = sharp(imageBuffer)
  const stats = await image.stats()
  
  // Calculate brightness and contrast metrics
  const brightness = stats.channels.reduce((sum, channel) => sum + channel.mean, 0) / stats.channels.length
  const contrast = stats.channels.reduce((sum, channel) => sum + (channel as any).std, 0) / stats.channels.length
  
  // Quality scoring (0-100)
  const brightnessScore = Math.max(0, Math.min(100, (brightness / 255) * 100))
  const contrastScore = Math.max(0, Math.min(100, contrast * 2))
  
  // Simple lighting quality assessment
  const isUnderExposed = brightness < 50
  const isOverExposed = brightness > 200
  const hasGoodContrast = contrast > 30
  
  let lightingScore = 50
  if (!isUnderExposed && !isOverExposed && hasGoodContrast) {
    lightingScore = 80
  } else if (isUnderExposed || isOverExposed) {
    lightingScore = 30
  }
  
  return {
    brightness,
    contrast,
    overall_quality: Math.round((brightnessScore + contrastScore) / 2),
    lighting_score: lightingScore
  }
}

/**
 * Simplified face presence estimation
 * In production, replace with actual face detection ML model
 */
async function estimateFacePresence(imageBuffer: Buffer) {
  // This is a placeholder implementation
  // In production, integrate with face-api.js, MediaPipe, or cloud vision API
  
  const image = sharp(imageBuffer)
  const { width, height } = await image.metadata()
  
  // For now, return optimistic defaults
  // This assumes most uploaded photos will contain faces
  return {
    face_count: 1, // Assume single face
    confidence: 0.8, // High confidence assumption
    is_frontal: true, // Assume frontal pose
    bounds: width && height ? {
      x: Math.round(width * 0.25),
      y: Math.round(height * 0.2),
      width: Math.round(width * 0.5),
      height: Math.round(height * 0.6)
    } : undefined
  }
}

/**
 * Validate photo meets passport standards
 */
export function validatePassportPhoto(faceDetection: FaceDetectionResult): PhotoValidationResult {
  const issues: PhotoValidationIssue[] = []
  
  // Check face count
  if (faceDetection.faces_detected === 0) {
    issues.push({
      type: 'face_count',
      severity: 'error',
      message: 'No face detected in the image',
      suggestion: 'Please upload a clear photo showing your face'
    })
  } else if (faceDetection.faces_detected > 1) {
    issues.push({
      type: 'face_count',
      severity: 'error',
      message: 'Multiple faces detected',
      suggestion: 'Please upload a photo with only one person'
    })
  }
  
  // Check face confidence
  if (faceDetection.face_confidence < 0.7) {
    issues.push({
      type: 'face_angle',
      severity: 'warning',
      message: 'Face may not be clearly visible',
      suggestion: 'Ensure your face is clearly visible and facing the camera'
    })
  }
  
  // Check lighting quality
  if (faceDetection.lighting_quality < 40) {
    issues.push({
      type: 'lighting',
      severity: 'warning',
      message: 'Poor lighting detected',
      suggestion: 'Try taking the photo in better lighting conditions'
    })
  }
  
  // Check if frontal
  if (!faceDetection.is_frontal) {
    issues.push({
      type: 'face_angle',
      severity: 'warning',
      message: 'Face may not be facing forward',
      suggestion: 'Look directly at the camera for best results'
    })
  }
  
  // Overall quality check
  if (faceDetection.quality_score < 50) {
    issues.push({
      type: 'resolution',
      severity: 'warning',
      message: 'Image quality could be improved',
      suggestion: 'Use a higher quality camera or better lighting'
    })
  }
  
  // Generate recommendations
  const recommendations = [
    '📸 Use good lighting (natural light works best)',
    '👤 Show only one person in the photo',
    '📐 Face the camera directly',
    '🎯 Keep your head centered in the frame',
    '💡 Avoid shadows on your face',
    '📱 Use a high-quality camera'
  ]
  
  const hasErrors = issues.some(issue => issue.severity === 'error')
  const confidenceScore = faceDetection.meets_passport_standards ? 90 : (hasErrors ? 20 : 70)
  
  return {
    is_valid: !hasErrors,
    issues,
    recommendations,
    confidence_score: confidenceScore
  }
}

/**
 * Create image variants (square, round, banner)
 */
export async function createImageVariants(imageBuffer: Buffer) {
  const variants = {
    profile_sq: '', // 1024x1024 square
    profile_round: '', // Circular mask
    profile_banner: '' // 16:9 banner
  }
  
  try {
    // Square variant (already processed)
    const squareBuffer = await sharp(imageBuffer)
      .resize(1024, 1024, { fit: 'cover' })
      .jpeg({ quality: 90 })
      .toBuffer()
    variants.profile_sq = squareBuffer.toString('base64')
    
    // Round variant with transparent background
    const roundBuffer = await sharp(imageBuffer)
      .resize(1024, 1024, { fit: 'cover' })
      .composite([{
        input: Buffer.from(
          `<svg width="1024" height="1024">
            <defs>
              <mask id="circle">
                <circle cx="512" cy="512" r="512" fill="white"/>
              </mask>
            </defs>
            <rect width="1024" height="1024" fill="black" mask="url(#circle)"/>
           </svg>`
        ),
        blend: 'dest-in'
      }])
      .png()
      .toBuffer()
    variants.profile_round = roundBuffer.toString('base64')
    
    // Banner variant (16:9)
    const bannerBuffer = await sharp(imageBuffer)
      .resize(1920, 1080, { 
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toBuffer()
    variants.profile_banner = bannerBuffer.toString('base64')
    
    return variants
    
  } catch (error) {
    // Return empty variants on error
    return {
      profile_sq: '',
      profile_round: '',
      profile_banner: ''
    }
  }
}

/**
 * Convert buffer to base64 data URL
 */
export function bufferToDataURL(buffer: Buffer, mimeType: string = 'image/jpeg'): string {
  return `data:${mimeType};base64,${buffer.toString('base64')}`
}

/**
 * Convert base64 to buffer
 */
export function dataURLToBuffer(dataURL: string): Buffer {
  const base64Data = dataURL.replace(/^data:[^;]+;base64,/, '')
  return Buffer.from(base64Data, 'base64')
}