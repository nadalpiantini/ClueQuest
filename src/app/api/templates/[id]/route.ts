import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id
    const supabase = await createClient()

    // Get template details
    const { data: template, error: templateError } = await supabase
      .from('cluequest_adventures')
      .select(`
        id,
        title,
        description,
        category,
        difficulty,
        estimated_duration,
        theme_name,
        theme_config,
        settings,
        max_participants,
        template_id,
        template_metadata,
        narrative_hook,
        success_criteria,
        failure_handling,
        adaptive_difficulty,
        recommended_group_size,
        inspiration_sources,
        created_at,
        updated_at
      `)
      .eq('template_id', templateId)
      .eq('is_template', true)
      .single()

    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Get template scenes with details
    const { data: scenes, error: scenesError } = await supabase
      .from('cluequest_scenes')
      .select(`
        id,
        name,
        description,
        order_index,
        qr_code,
        location_data,
        challenges,
        advanced_mechanics,
        interaction_types,
        success_criteria,
        failure_handling,
        collaborative_requirements,
        time_pressure_config,
        is_active
      `)
      .eq('adventure_id', template.id)
      .order('order_index')

    // Get template roles
    const { data: roles, error: rolesError } = await supabase
      .from('cluequest_adventure_roles')
      .select(`
        id,
        name,
        description,
        emoji,
        color,
        max_players,
        perks,
        point_multiplier,
        hint_discount,
        extra_time,
        can_help_others,
        team_leader,
        solo_only
      `)
      .eq('adventure_id', template.id)

    // Get template analytics
    const { data: analytics, error: analyticsError } = await supabase
      .from('cluequest_template_analytics')
      .select(`
        instantiation_count,
        completion_rate,
        average_duration_minutes,
        average_rating,
        player_satisfaction_score,
        difficulty_effectiveness,
        engagement_metrics,
        performance_by_theme,
        demographic_breakdown,
        improvement_suggestions
      `)
      .eq('template_id', templateId)
      .order('analytics_date', { ascending: false })
      .limit(1)
      .single()

    // Get template tags
    const { data: tags, error: tagsError } = await supabase
      .from('cluequest_template_tags')
      .select('tag_name, tag_type')
      .eq('template_id', templateId)

    // Get template reviews (last 10)
    const { data: reviews, error: reviewsError } = await supabase
      .from('cluequest_template_reviews')
      .select(`
        id,
        rating,
        review_text,
        pros,
        cons,
        recommended_for,
        difficulty_rating,
        engagement_score,
        replay_value,
        helpful_votes,
        created_at,
        organization_id
      `)
      .eq('template_id', templateId)
      .eq('is_verified', true)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get performance metrics using the function
    const { data: performanceMetrics, error: performanceError } = await supabase
      .rpc('get_template_performance', { p_template_id: templateId })

    // Parse template metadata for better structure
    let parsedMetadata = {}
    try {
      parsedMetadata = typeof template.template_metadata === 'string' 
        ? JSON.parse(template.template_metadata)
        : template.template_metadata || {}
    } catch (e) {
      console.warn('Could not parse template metadata:', e)
    }

    // Structure the response
    const templateDetails = {
      ...template,
      template_metadata: parsedMetadata,
      scenes: scenes || [],
      roles: roles || [],
      tags: tags || [],
      analytics: analytics || {
        instantiation_count: 0,
        completion_rate: 0,
        average_duration_minutes: template.estimated_duration,
        average_rating: 0,
        player_satisfaction_score: 0,
        difficulty_effectiveness: 0,
        engagement_metrics: {},
        performance_by_theme: {},
        demographic_breakdown: {},
        improvement_suggestions: {}
      },
      reviews: reviews || [],
      performance: performanceMetrics?.[0] || {
        instantiation_count: 0,
        avg_completion_rate: 0,
        avg_rating: 0,
        avg_duration_minutes: template.estimated_duration,
        total_participants: 0
      }
    }

    return NextResponse.json({
      success: true,
      template: templateDetails
    })

  } catch (error) {
    console.error('Template details API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id
    const body = await request.json()
    const { action } = body

    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (action === 'review') {
      return handleTemplateReview(supabase, templateId, user.id, body)
    }

    if (action === 'update_analytics') {
      return handleAnalyticsUpdate(supabase, templateId, body)
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Template update API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

async function handleTemplateReview(supabase: any, templateId: string, userId: string, body: any) {
  const {
    rating,
    review_text,
    pros = [],
    cons = [],
    recommended_for = [],
    difficulty_rating,
    engagement_score,
    replay_value,
    organization_id
  } = body

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: 'Rating must be between 1 and 5' },
      { status: 400 }
    )
  }

  if (!organization_id) {
    // Get user's organization
    const { data: profile } = await supabase
      .from('cluequest_profiles')
      .select('organization_id')
      .eq('id', userId)
      .single()
    
    if (!profile?.organization_id) {
      return NextResponse.json(
        { error: 'User organization not found' },
        { status: 400 }
      )
    }
    organization_id = profile.organization_id
  }

  // Insert or update review
  const { data: review, error: reviewError } = await supabase
    .from('cluequest_template_reviews')
    .upsert({
      template_id: templateId,
      organization_id,
      reviewer_id: userId,
      rating,
      review_text,
      pros,
      cons,
      recommended_for,
      difficulty_rating,
      engagement_score,
      replay_value,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'template_id,organization_id,reviewer_id'
    })
    .select()
    .single()

  if (reviewError) {
    return NextResponse.json(
      { error: 'Failed to save review', details: reviewError.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    message: 'Review saved successfully',
    review
  })
}

async function handleAnalyticsUpdate(supabase: any, templateId: string, body: any) {
  const {
    completion_rate,
    duration_minutes,
    player_satisfaction,
    engagement_metrics = {},
    demographics = {}
  } = body

  const today = new Date().toISOString().split('T')[0]

  // Update analytics
  const { data: analytics, error: analyticsError } = await supabase
    .from('cluequest_template_analytics')
    .upsert({
      template_id: templateId,
      analytics_date: today,
      completion_rate: completion_rate || 0,
      average_duration_minutes: duration_minutes || 0,
      player_satisfaction_score: player_satisfaction || 0,
      engagement_metrics,
      demographic_breakdown: demographics,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'template_id,analytics_date'
    })
    .select()
    .single()

  if (analyticsError) {
    return NextResponse.json(
      { error: 'Failed to update analytics', details: analyticsError.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    message: 'Analytics updated successfully',
    analytics
  })
}