import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AVATAR_STORAGE_CONFIG, ensureAvatarsBucket } from '@/lib/supabase/storage'
import { AvatarGenerationRequest, AvatarGenerationResult } from '@/types/adventure'
import { ClueQuestRole, CustomizationOptions, RunwareAPIError } from '@/types/runware'
import { runwareClient } from '@/lib/runware-ai'
import { dataURLToBuffer, createImageVariants } from '@/lib/image-processing'

// Create mock Runware client for development fallback
const createMockRunwareClient = () => ({
  uploadImage: async (imageBuffer: Buffer, filename: string) => {
    return `mock-runware-id-${Date.now()}`
  },
  generateAvatar: async (imageId: string, role: ClueQuestRole, customizations: CustomizationOptions) => {
    return `mock-generation-id-${Date.now()}`
  },
  waitForGeneration: async (generationId: string) => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    return {
      url: `https://via.placeholder.com/1024x1024/8b5cf6/ffffff?text=${encodeURIComponent('Generated Avatar')}`,
      id: `mock-avatar-${Date.now()}`,
      likeCount: 0,
      generated_image_variation_generics: []
    }
  },
  buildRolePrompt: (role: ClueQuestRole, customizations: Record<string, any>) => {
    return `Mock prompt for ${role} with customizations`
  },
  generateAvatarComplete: async (imageBuffer: Buffer, role: ClueQuestRole, customizations: CustomizationOptions) => {
    await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate processing
    return {
      success: true,
      avatar_url: `https://via.placeholder.com/1024x1024/8b5cf6/ffffff?text=${encodeURIComponent(`${role} Avatar`)}`,
      generation_time_ms: 3000,
      model_used: 'mock-model',
      role_applied: role,
      face_preservation_score: 85,
      moderation_passed: true
    }
  }
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const supabase = await createClient()
    
    // Get current user (allow guest users for avatar generation)
    const { data: { user } } = await supabase.auth.getUser()
    
    // In development mode, allow requests without authentication
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (!isDevelopment && !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const {
      selfie_url,
      style_id,
      gender,
      age_range,
      customizations = {},
      session_code
    } = body as AvatarGenerationRequest & { session_code?: string }

    if (!selfie_url || !style_id) {
      return NextResponse.json(
        { error: 'selfie_url and style_id are required' },
        { status: 400 }
      )
    }

    // Get participant role for this session
    let participantRole: ClueQuestRole = 'Leader' // Default fallback
    
    if (session_code && user) {
      // Get participant data from session to determine role
      const { data: participant } = await supabase
        .from('cluequest_player_states')
        .select(`
          role_id,
          cluequest_adventure_roles!inner(name)
        `)
        .eq('user_id', user.id)
        .eq('session_id', session_code)
        .single()
      
      if (participant && (participant as any)?.cluequest_adventure_roles?.name) {
        const roleName = (participant as any).cluequest_adventure_roles.name
        participantRole = (roleName as ClueQuestRole) || 'Leader'
      }
    } else {
      // For standalone avatar generation, derive role from style_id
      const roleMap: Record<string, ClueQuestRole> = {
        'leader-detective': 'Leader',
        'warrior-werewolf': 'Warrior',
        'mage-vampire': 'Mage', 
        'healer-fairy': 'Healer',
        'scout-ninja': 'Scout'
      }
      participantRole = roleMap[style_id] || 'Leader'
    }

    // Build customization options
    const roleCustomizations: CustomizationOptions = {
      gender: gender as any || 'auto',
      age_range: age_range as any || 'auto',
      style_intensity: 'moderate',
      preserve_ethnicity: true,
      enhance_features: true,
      ...customizations
    }


    // Ensure storage bucket exists
    await ensureAvatarsBucket()

    // Download the selfie image
    let imageBuffer: Buffer
    try {
      const imageResponse = await fetch(selfie_url)
      if (!imageResponse.ok) {
        throw new Error('Failed to download selfie image')
      }
      const arrayBuffer = await imageResponse.arrayBuffer()
      imageBuffer = Buffer.from(arrayBuffer)
    } catch (error) {
      return NextResponse.json(
        { error: 'Could not process selfie image' },
        { status: 400 }
      )
    }

    // Try to use Runware AI if available, otherwise use mock
    let aiClient: any
    try {
      if (process.env.RUNWARE_API_KEY && process.env.RUNWARE_API_KEY !== 'placeholder-key-for-development') {
        aiClient = runwareClient
      } else {
        aiClient = createMockRunwareClient()
      }
    } catch (error) {
      aiClient = createMockRunwareClient()
    }

    // Generate avatar using Runware's complete pipeline
    const userId = user?.id || `guest-${Date.now()}`
    let avatarGenerationResult
    
    try {
      if ('generateAvatarComplete' in aiClient) {
        // Use the enhanced complete pipeline for Runware
        avatarGenerationResult = await aiClient.generateAvatarComplete(
          imageBuffer,
          participantRole,
          roleCustomizations
        )
      } else {
        // Fallback to step-by-step generation (mock client)
        const imageId = await aiClient.uploadImage(
          imageBuffer,
          `selfie-${userId}-${Date.now()}.jpg`
        )

        const generationId = await aiClient.generateAvatar(
          imageId,
          participantRole,
          roleCustomizations
        )

        const generationResult = await aiClient.waitForGeneration(generationId)
        
        avatarGenerationResult = {
          success: true,
          avatar_url: generationResult.url,
          generation_time_ms: Date.now() - startTime,
          model_used: aiClient.getModelForRole ? aiClient.getModelForRole(participantRole).model_id : 'mock',
          role_applied: participantRole,
          moderation_passed: true
        }
      }
      
    } catch (error) {
      if (error instanceof RunwareAPIError) {
        return NextResponse.json(
          { error: `Avatar generation failed: ${error.message}` },
          { status: error.statusCode || 500 }
        )
      }
      throw error
    }

    // Check if generation was successful
    if (!avatarGenerationResult.success || !avatarGenerationResult.avatar_url) {
      return NextResponse.json(
        { error: avatarGenerationResult.error || 'Avatar generation failed' },
        { status: 500 }
      )
    }

    // Process the generated avatar URL
    let finalAvatarUrl = avatarGenerationResult.avatar_url
    let storedAvatarPath: string | null = null
    
    // If it's a data URL (base64), store it in Supabase
    if (avatarGenerationResult.avatar_url.startsWith('data:')) {
      try {
        const avatarBuffer = dataURLToBuffer(avatarGenerationResult.avatar_url)
        
        const avatarFileName = `avatar-${userId}-${Date.now()}.jpg`
        const avatarPath = `${AVATAR_STORAGE_CONFIG.folders.generated}/${avatarFileName}`

        const { data: avatarUpload, error: avatarUploadError } = await supabase.storage
          .from('avatars')
          .upload(avatarPath, new Uint8Array(avatarBuffer), {
            contentType: 'image/jpeg',
            cacheControl: '31536000' // 1 year cache
          })

        if (avatarUploadError) {
          return NextResponse.json(
            { error: 'Failed to store generated avatar' },
            { status: 500 }
          )
        }

        // Get public URL
        const { data: avatarUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(avatarPath)
        
        finalAvatarUrl = avatarUrlData.publicUrl
        storedAvatarPath = avatarPath
        
      } catch (error) {
        console.error('Failed to store avatar:', error)
        // Continue with original URL if storage fails
      }
    } else if (avatarGenerationResult.avatar_url.startsWith('http')) {
      // If it's a regular URL, optionally download and store it
      try {
        const avatarResponse = await fetch(avatarGenerationResult.avatar_url)
        const avatarBuffer = await avatarResponse.arrayBuffer()
        
        const avatarFileName = `avatar-${userId}-${Date.now()}.jpg`
        const avatarPath = `${AVATAR_STORAGE_CONFIG.folders.generated}/${avatarFileName}`

        const { data: avatarUpload, error: avatarUploadError } = await supabase.storage
          .from('avatars')
          .upload(avatarPath, new Uint8Array(avatarBuffer), {
            contentType: 'image/jpeg',
            cacheControl: '31536000' // 1 year cache
          })

        if (!avatarUploadError) {
          const { data: avatarUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(avatarPath)
          
          finalAvatarUrl = avatarUrlData.publicUrl
          storedAvatarPath = avatarPath
        }
        
      } catch (error) {
        console.error('Failed to download and store avatar:', error)
        // Continue with original URL if download/storage fails
      }
    }

    // Save to database
    const avatarData = {
      user_id: userId,
      session_id: session_code || null,
      source_image_url: selfie_url,
      style: participantRole.toLowerCase(),
      prompt_used: aiClient.buildRolePrompt ? 
        aiClient.buildRolePrompt(participantRole, roleCustomizations) : 
        `Generated ${participantRole} avatar with Runware.ai`,
      avatar_url: finalAvatarUrl,
      thumbnail_url: finalAvatarUrl,
      ai_provider: 'runware',
      model_version: avatarGenerationResult.model_used || 'flux-1-pro',
      generation_time_seconds: Math.round(avatarGenerationResult.generation_time_ms / 1000),
      moderation_score: avatarGenerationResult.face_preservation_score || 90,
      status: 'moderated' as const
    }

    const { data: avatarRecord, error: dbError } = await supabase
      .from('cluequest_ai_avatars')
      .insert(avatarData as any) // Temporary fix for type inference
      .select()
      .single()

    if (dbError) {
      // Continue anyway, we have the generated image
    }

    // Build response
    const result: AvatarGenerationResult = {
      id: (avatarRecord as any)?.id || `temp-${Date.now()}`,
      avatar_url: finalAvatarUrl,
      preview_url: finalAvatarUrl,
      generation_time_ms: avatarGenerationResult.generation_time_ms,
      moderation_passed: avatarGenerationResult.moderation_passed,
      style_applied: participantRole,
      // Additional Runware-specific data
      model_used: avatarGenerationResult.model_used,
      face_preservation_score: avatarGenerationResult.face_preservation_score,
      role_transformation: `${participantRole} → ${aiClient.getAvailableModels ? aiClient.getAvailableModels()[participantRole]?.style_name : 'Transformed'}`,
      customizations_applied: roleCustomizations
    } as any // Extend the type for additional fields

    // Clean up temporary selfie (optional, for privacy)
    if (selfie_url.includes('selfie-')) {
      const selfiePathMatch = selfie_url.match(/avatars\/selfies\/(.+)$/)
      if (selfiePathMatch) {
        await supabase.storage
          .from(AVATAR_STORAGE_CONFIG.bucket)
          .remove([`${AVATAR_STORAGE_CONFIG.folders.selfies}/${selfiePathMatch[1]}`])
      }
    }

    return NextResponse.json(result)

  } catch (error) {
    
    // Return helpful error messages
    if (error instanceof RunwareAPIError) {
      return NextResponse.json(
        { error: `Runware.ai error: ${error.message}` },
        { status: error.statusCode || 500 }
      )
    }
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Avatar generation took too long. Please try again.' },
          { status: 408 }
        )
      }
      
      if (error.message.includes('Runware') || error.message.includes('API error')) {
        return NextResponse.json(
          { error: 'AI service temporarily unavailable. Please try again.' },
          { status: 503 }
        )
      }
      
      if (error.message.includes('face') || error.message.includes('detection')) {
        return NextResponse.json(
          { error: 'Could not detect face in the uploaded photo. Please try with a clearer image.' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate avatar. Please try again.' },
      { status: 500 }
    )
  }
}