import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      overall_rating,
      creativity_rating,
      coherence_rating,
      theme_fit_rating,
      engagement_rating,
      feedback,
      liked_aspects,
      disliked_aspects,
      suggestions_for_improvement,
      would_use_again,
      would_recommend,
      approved = false
    } = body

    const supabase = await createClient()

    // Get user (allow guest users in development mode)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    // In development mode, allow requests without authentication
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (!isDevelopment && (userError || !user)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify the generation belongs to the user (skip in development mode if no user)
    if (user) {
      const { data: generation, error: generationError } = await supabase
        .from('cluequest_ai_story_generations')
        .select('id, user_id')
        .eq('id', params.id)
        .single()

      if (generationError || !generation) {
        return NextResponse.json(
          { success: false, error: 'Generation not found' },
          { status: 404 }
        )
      }

      if ((generation as any).user_id !== user.id) {
        return NextResponse.json(
          { success: false, error: 'Access denied' },
          { status: 403 }
        )
      }
    }

    // Create or update feedback (skip database operations in development mode if no user)
    let feedbackResult = null
    
    if (user) {
      const { data: existingFeedback } = await supabase
        .from('cluequest_ai_story_feedback')
        .select('id')
        .eq('generation_id', params.id)
        .eq('user_id', user.id)
        .single()

      const feedbackData = {
        generation_id: params.id,
        user_id: user.id,
        overall_rating,
        creativity_rating,
        coherence_rating,
        theme_fit_rating,
        engagement_rating,
        liked_aspects: liked_aspects || [],
        disliked_aspects: disliked_aspects || [],
        suggestions_for_improvement,
        would_use_again,
        would_recommend,
      }

      if (existingFeedback) {
        // Update existing feedback
        feedbackResult = await supabase
          .from('cluequest_ai_story_feedback')
          .update(feedbackData)
          .eq('id', existingFeedback.id)
          .select()
      } else {
        // Create new feedback
        feedbackResult = await supabase
          .from('cluequest_ai_story_feedback')
          .insert(feedbackData)
          .select()
      }

      if (feedbackResult.error) {
        return NextResponse.json(
          { success: false, error: 'Failed to save feedback' },
          { status: 500 }
        )
      }
    }

    // Update the generation record with user rating and approval status (skip in development mode if no user)
    if (user) {
      const generationUpdateData: any = {}
      
      if (overall_rating) {
        generationUpdateData.user_rating = overall_rating
      }
      
      if (feedback) {
        generationUpdateData.user_feedback = feedback
      }
      
      if (approved) {
        generationUpdateData.is_user_approved = true
        generationUpdateData.status = 'approved'
        generationUpdateData.applied_to_adventure = true
        generationUpdateData.applied_at = new Date().toISOString()
      }

      if (Object.keys(generationUpdateData).length > 0) {
        generationUpdateData.updated_at = new Date().toISOString()
        
        const { error: updateError } = await supabase
          .from('cluequest_ai_story_generations')
          .update(generationUpdateData)
          .eq('id', params.id)

        if (updateError) {
          return NextResponse.json(
            { success: false, error: 'Failed to update generation' },
            { status: 500 }
          )
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback saved successfully',
      feedback: feedbackResult?.data?.[0],
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}