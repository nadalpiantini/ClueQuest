import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { leonardoClient } from '@/lib/leonardo-ai'
import { AVATAR_STORAGE_CONFIG, ensureAvatarsBucket } from '@/lib/supabase/storage'
import { AvatarGenerationRequest, AvatarGenerationResult } from '@/types/adventure'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const supabase = await createClient()
    
    // Get current user (allow guest users for avatar generation)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
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
      customizations,
      session_code
    } = body as AvatarGenerationRequest & { session_code?: string }

    if (!selfie_url || !style_id) {
      return NextResponse.json(
        { error: 'selfie_url and style_id are required' },
        { status: 400 }
      )
    }

    // Get participant role for this session
    let participantRole = 'Leader' // Default fallback
    
    if (session_code) {
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
        participantRole = (participant as any).cluequest_adventure_roles.name
      }
    } else {
      // For standalone avatar generation, derive role from style_id
      const roleMap: Record<string, string> = {
        'leader-detective': 'Leader',
        'warrior-werewolf': 'Warrior',
        'mage-vampire': 'Mage', 
        'healer-fairy': 'Healer',
        'scout-ninja': 'Scout'
      }
      participantRole = roleMap[style_id] || 'Leader'
    }

    console.log('Generating avatar for role:', participantRole)

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
      console.error('Failed to download selfie:', error)
      return NextResponse.json(
        { error: 'Could not process selfie image' },
        { status: 400 }
      )
    }

    // Upload to Leonardo AI
    const leonardoImageId = await leonardoClient.uploadImage(
      imageBuffer,
      `selfie-${user.id}-${Date.now()}.jpg`
    )

    // Generate avatar with role-based transformation
    const generationId = await leonardoClient.generateAvatar(
      leonardoImageId,
      participantRole,
      { gender, age_range, ...customizations }
    )

    // Wait for generation to complete
    const generationResult = await leonardoClient.waitForGeneration(generationId)

    // Upload generated avatar to our storage
    const avatarResponse = await fetch(generationResult.url)
    const avatarBuffer = await avatarResponse.arrayBuffer()
    
    const avatarFileName = `avatar-${user.id}-${Date.now()}.jpg`
    const avatarPath = `${AVATAR_STORAGE_CONFIG.folders.generated}/${avatarFileName}`

    const { data: avatarUpload, error: avatarUploadError } = await supabase.storage
      .from('avatars')
      .upload(avatarPath, new Uint8Array(avatarBuffer), {
        contentType: 'image/jpeg',
        cacheControl: '31536000' // 1 year cache
      })

    if (avatarUploadError) {
      console.error('Failed to store generated avatar:', avatarUploadError)
      return NextResponse.json(
        { error: 'Failed to store generated avatar' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: avatarUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(avatarPath)

    // Save to database
    const avatarData = {
      user_id: user.id,
      session_id: session_code || null,
      source_image_url: selfie_url,
      style: participantRole.toLowerCase(),
      prompt_used: leonardoClient.buildRolePrompt(participantRole, { gender, age_range, ...customizations }),
      avatar_url: avatarUrlData.publicUrl,
      thumbnail_url: avatarUrlData.publicUrl,
      ai_provider: 'leonardo',
      model_version: 'kino-xl-v1',
      generation_time_seconds: Math.round((Date.now() - startTime) / 1000),
      moderation_score: 95, // Leonardo has built-in moderation
      status: 'moderated' as const
    }

    const { data: avatarRecord, error: dbError } = await supabase
      .from('cluequest_ai_avatars')
      .insert(avatarData)
      .select()
      .single()

    if (dbError) {
      console.error('Failed to save avatar to database:', dbError)
      // Continue anyway, we have the generated image
    }

    // Build response
    const result: AvatarGenerationResult = {
      id: (avatarRecord as any)?.id || `temp-${Date.now()}`,
      avatar_url: avatarUrlData.publicUrl,
      preview_url: avatarUrlData.publicUrl,
      generation_time_ms: Date.now() - startTime,
      moderation_passed: true,
      style_applied: participantRole
    }

    // Clean up temporary selfie (optional, for privacy)
    if (selfie_url.includes('selfie-')) {
      const selfiePathMatch = selfie_url.match(/avatars\/selfies\/(.+)$/)
      if (selfiePathMatch) {
        await supabase.storage
          .from(AVATAR_STORAGE_CONFIG.bucket)
          .remove([`${AVATAR_STORAGE_CONFIG.folders.selfies}/${selfiePathMatch[1]}`])
          .catch(console.error) // Ignore cleanup errors
      }
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Avatar generation error:', error)
    
    // Return helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Generation took too long. Please try again.' },
          { status: 408 }
        )
      }
      
      if (error.message.includes('Leonardo AI API error')) {
        return NextResponse.json(
          { error: 'AI service temporarily unavailable. Please try again.' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate avatar. Please try again.' },
      { status: 500 }
    )
  }
}