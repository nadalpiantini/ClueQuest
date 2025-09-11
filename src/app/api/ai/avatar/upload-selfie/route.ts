import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AVATAR_STORAGE_CONFIG, ensureAvatarsBucket } from '@/lib/supabase/storage'
import { 
  processAvatarImage, 
  validatePassportPhoto,
  bufferToDataURL 
} from '@/lib/image-processing'
import { FaceValidationError, ImageProcessingError } from '@/types/runware'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user (allow guest users for avatar generation)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // In development mode, allow requests without authentication
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (!isDevelopment && (authError || !user)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('selfie') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Basic file validation
    if (!AVATAR_STORAGE_CONFIG.allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          error: 'Invalid file type', 
          message: 'Please upload a JPEG, PNG, or WebP image file',
          validation: {
            is_valid: false,
            issues: [{ 
              type: 'format', 
              severity: 'error', 
              message: 'Unsupported file format',
              suggestion: 'Use JPEG, PNG, or WebP format'
            }]
          }
        },
        { status: 400 }
      )
    }

    if (file.size > AVATAR_STORAGE_CONFIG.maxFileSize) {
      return NextResponse.json(
        { 
          error: 'File too large', 
          message: 'Image size must be less than 10MB',
          validation: {
            is_valid: false,
            issues: [{ 
              type: 'resolution', 
              severity: 'error', 
              message: 'File size exceeds limit',
              suggestion: 'Compress your image or use a smaller file'
            }]
          }
        },
        { status: 400 }
      )
    }

    // Convert to buffer for processing
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)

    // Process and validate the image for passport photo standards
    let processedImage
    try {
      processedImage = await processAvatarImage(fileBuffer, file.name)
    } catch (error) {
      if (error instanceof ImageProcessingError) {
        return NextResponse.json(
          { 
            error: 'Image processing failed', 
            message: error.message,
            validation: {
              is_valid: false,
              issues: [{ 
                type: 'resolution', 
                severity: 'error', 
                message: error.message,
                suggestion: 'Please upload a higher quality image'
              }]
            }
          },
          { status: 400 }
        )
      }
      throw error
    }

    // Validate passport photo standards
    const validationResult = validatePassportPhoto(processedImage.face_detection)
    
    // If validation fails with errors, reject the photo
    const hasErrors = validationResult.issues.some(issue => issue.severity === 'error')
    if (hasErrors) {
      return NextResponse.json(
        { 
          error: 'Photo does not meet passport standards', 
          message: 'Please upload a clear photo of your face following passport photo guidelines',
          validation: validationResult,
          face_detection: processedImage.face_detection
        },
        { status: 400 }
      )
    }

    // Ensure storage bucket exists
    await ensureAvatarsBucket()

    // Generate unique filename with processed extension
    const timestamp = Date.now()
    const userId = user?.id || `guest-${timestamp}` // Use guest ID if no user in development
    const fileName = `selfie-${userId}-${timestamp}.jpg` // Always save as JPEG after processing
    const filePath = `${AVATAR_STORAGE_CONFIG.folders.selfies}/${fileName}`

    // Use processed image buffer (already optimized to 1024x1024 JPEG)
    const fileToUpload = new Uint8Array(processedImage.buffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, fileToUpload, {
        contentType: 'image/jpeg', // Always JPEG after processing
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      return NextResponse.json(
        { error: 'Failed to upload processed image' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    // Return comprehensive response with validation info
    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      fileName,
      fileSize: processedImage.size_bytes,
      originalFileSize: file.size,
      uploadedAt: new Date().toISOString(),
      
      // Validation results for frontend feedback
      validation: validationResult,
      
      // Face detection results
      face_detection: {
        faces_detected: processedImage.face_detection.faces_detected,
        confidence: processedImage.face_detection.face_confidence,
        quality_score: processedImage.face_detection.quality_score,
        meets_standards: processedImage.face_detection.meets_passport_standards
      },
      
      // Processing info
      processed: {
        width: processedImage.width,
        height: processedImage.height,
        format: processedImage.format,
        optimized: true
      },
      
      // Helpful message for user
      message: validationResult.issues.length > 0 
        ? 'Photo uploaded successfully with some suggestions for improvement'
        : 'Perfect! Your photo meets all passport standards'
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}