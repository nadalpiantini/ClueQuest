import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const minDuration = searchParams.get('minDuration')
    const maxDuration = searchParams.get('maxDuration')
    const tags = searchParams.get('tags')?.split(',') || []

    const supabase = await createClient()

    // Build query for templates
    let query = supabase
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
        max_participants,
        template_id,
        template_metadata,
        narrative_hook,
        recommended_group_size,
        inspiration_sources,
        created_at,
        updated_at
      `)
      .eq('is_template', true)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }

    if (minDuration) {
      query = query.gte('estimated_duration', parseInt(minDuration))
    }

    if (maxDuration) {
      query = query.lte('estimated_duration', parseInt(maxDuration))
    }

    const { data: templates, error } = await query

    if (error) {
      console.error('Template fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch templates', details: error.message },
        { status: 500 }
      )
    }

    // Filter by tags if specified
    let filteredTemplates = templates || []
    if (tags.length > 0) {
      // Get templates that have any of the specified tags
      const { data: templateTags } = await supabase
        .from('cluequest_template_tags')
        .select('template_id')
        .in('tag_name', tags)

      const templateIdsWithTags = new Set(templateTags?.map((t: any) => t.template_id) || [])
      filteredTemplates = filteredTemplates.filter(template => 
        templateIdsWithTags.has((template as any).template_id)
      )
    }

    // Get template analytics for each template
    const templateIds = filteredTemplates.map((t: any) => t.template_id)
    const { data: analytics } = await supabase
      .from('cluequest_template_analytics')
      .select('template_id, instantiation_count, average_rating, completion_rate')
      .in('template_id', templateIds)

    const analyticsMap = new Map(
      analytics?.map((a: any) => [a.template_id, a]) || []
    )

    // Enrich templates with analytics data
    const enrichedTemplates = filteredTemplates.map(template => ({
      ...(template as any),
      analytics: analyticsMap.get((template as any).template_id) || {
        instantiation_count: 0,
        average_rating: 0,
        completion_rate: 0
      }
    }))

    // Get available categories and themes for filtering
    const { data: categories } = await supabase
      .from('cluequest_template_categories')
      .select('slug, name, description, icon_url, color_scheme')
      .eq('is_active', true)
      .order('sort_order')

    // Get available tags
    const { data: availableTags } = await supabase
      .from('cluequest_template_tags')
      .select('tag_name, tag_type')
      .in('template_id', templateIds)

    const tagsByType = availableTags?.reduce((acc: any, tag: any) => {
      if (!acc[tag.tag_type]) acc[tag.tag_type] = []
      if (!acc[tag.tag_type].includes(tag.tag_name)) {
        acc[tag.tag_type].push(tag.tag_name)
      }
      return acc
    }, {} as Record<string, string[]>) || {}

    return NextResponse.json({
      success: true,
      templates: enrichedTemplates,
      categories: categories || [],
      available_tags: tagsByType,
      filters: {
        category,
        difficulty,
        minDuration,
        maxDuration,
        tags
      },
      total: enrichedTemplates.length
    })

  } catch (error) {
    console.error('Templates API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'instantiate') {
      return handleTemplateInstantiation(request, body)
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "instantiate" to create adventure from template.' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Templates POST error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

async function handleTemplateInstantiation(request: NextRequest, body: any) {
  const {
    template_id,
    title,
    customizations = {},
    organization_id
  } = body

  if (!template_id) {
    return NextResponse.json(
      { error: 'template_id is required' },
      { status: 400 }
    )
  }

  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's organization if not provided
    let finalOrgId = organization_id
    if (!finalOrgId) {
      const { data: profile } = await supabase
        .from('cluequest_profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single()
      
      finalOrgId = (profile as any)?.organization_id
    }

    if (!finalOrgId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      )
    }

    // Use the database function to instantiate template
    const { data: result, error: instantiateError } = await supabase
      .rpc('instantiate_template', {
        p_template_id: template_id,
        p_organization_id: finalOrgId,
        p_creator_id: user.id,
        p_customizations: customizations,
        p_title: title || null
      } as any)

    if (instantiateError) {
      console.error('Template instantiation error:', instantiateError)
      return NextResponse.json(
        { 
          error: 'Failed to instantiate template',
          details: instantiateError.message 
        },
        { status: 500 }
      )
    }

    const newAdventureId = result

    // Get the newly created adventure with full details
    const { data: adventure, error: fetchError } = await supabase
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
        max_participants,
        status,
        template_id,
        original_template_id,
        template_metadata,
        narrative_hook,
        success_criteria,
        failure_handling,
        adaptive_difficulty,
        recommended_group_size,
        created_at,
        updated_at
      `)
      .eq('id', newAdventureId)
      .single()

    if (fetchError) {
      console.error('Adventure fetch error:', fetchError)
      return NextResponse.json(
        { 
          error: 'Adventure created but failed to retrieve details',
          adventure_id: newAdventureId 
        },
        { status: 500 }
      )
    }

    // Update template analytics
    const today = new Date().toISOString().split('T')[0]
    await (supabase
      .from('cluequest_template_analytics')
      .upsert({
        template_id: template_id,
        analytics_date: today,
        instantiation_count: 1
      } as any, {
        onConflict: 'template_id,analytics_date'
      }))

    return NextResponse.json({
      success: true,
      message: 'Template instantiated successfully',
      adventure: adventure,
      template_instance: {
        template_id,
        adventure_id: newAdventureId,
        customizations,
        created_at: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Template instantiation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to instantiate template',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}