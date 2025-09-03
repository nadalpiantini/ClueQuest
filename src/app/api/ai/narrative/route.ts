import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { aiContentService } from '@/lib/services/ai-content';
import { z } from 'zod';

// Validation schema for narrative generation
const GenerateNarrativeSchema = z.object({
  adventure_id: z.string().uuid(),
  scene_id: z.string().uuid().optional(),
  theme: z.string().min(1).max(100),
  tone: z.enum(['adventurous', 'mysterious', 'educational', 'corporate', 'playful']),
  target_audience: z.enum(['children', 'teens', 'adults', 'professionals']),
  duration: z.enum(['short', 'medium', 'long']).default('medium'),
  branching_points: z.number().min(0).max(5).default(2),
  character_roles: z.array(z.string()).optional(),
  custom_requirements: z.string().max(500).optional()
});

// POST /api/ai/narrative - Generate dynamic narrative content
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Validate request body
    const body = await request.json();
    const validatedData = GenerateNarrativeSchema.parse(body);
    
    // Verify user has access to the adventure
    const { data: adventure, error: adventureError } = await supabase
      .from('cluequest_adventures')
      .select('id, organization_id, creator_id, title, category, ai_narrative_enabled')
      .eq('id', validatedData.adventure_id)
      .single();
    
    if (adventureError || !adventure) {
      return NextResponse.json(
        { error: 'Not found', message: 'Adventure not found' },
        { status: 404 }
      );
    }
    
    // Check permissions - must be adventure creator or organization admin
    const { data: membership } = await supabase
      .from('cluequest_organization_members')
      .select('role, cluequest_subscriptions!inner(cluequest_plans!inner(features))')
      .eq('user_id', user.id)
      .eq('organization_id', adventure.organization_id)
      .eq('is_active', true)
      .single();
    
    const canEdit = adventure.creator_id === user.id || 
                   (membership && ['owner', 'admin'].includes(membership.role));
    
    if (!canEdit) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Insufficient permissions to generate content for this adventure' },
        { status: 403 }
      );
    }
    
    // Check if AI narrative features are enabled
    const plan = membership.cluequest_subscriptions.cluequest_plans;
    if (!plan.features.includes('ai_narrative_generation')) {
      return NextResponse.json(
        { error: 'Feature not available', message: 'AI narrative generation not included in your plan' },
        { status: 402 }
      );
    }
    
    // Check usage limits
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const { count: monthlyUsage } = await supabase
      .from('cluequest_ai_narratives')
      .select('*', { count: 'exact', head: true })
      .eq('adventure_id', validatedData.adventure_id)
      .gte('created_at', currentMonth.toISOString());
    
    const monthlyLimit = plan.features.includes('unlimited_ai') ? 100 : 5;
    
    if ((monthlyUsage || 0) >= monthlyLimit) {
      return NextResponse.json(
        { error: 'Quota exceeded', message: `Monthly AI narrative limit reached (${monthlyLimit})` },
        { status: 429 }
      );
    }
    
    // Check for existing narrative if scene_id provided
    if (validatedData.scene_id) {
      const { data: existingNarrative } = await supabase
        .from('cluequest_ai_narratives')
        .select('id, narrative_text, status')
        .eq('adventure_id', validatedData.adventure_id)
        .eq('scene_id', validatedData.scene_id)
        .eq('status', 'moderated')
        .single();
      
      if (existingNarrative) {
        return NextResponse.json({
          success: true,
          narrative_id: existingNarrative.id,
          cached: true,
          message: 'Using existing narrative for this scene'
        });
      }
    }
    
    // Generate narrative content
    const result = await aiContentService.generateNarrative(
      validatedData.adventure_id,
      {
        theme: validatedData.theme,
        tone: validatedData.tone,
        targetAudience: validatedData.target_audience,
        duration: validatedData.duration,
        branchingPoints: validatedData.branching_points,
        characterRoles: validatedData.character_roles
      },
      validatedData.scene_id
    );
    
    // Record usage for billing
    await supabase.from('cluequest_usage_records').insert({
      organization_id: adventure.organization_id,
      user_id: user.id,
      event_type: 'ai_narrative_generated',
      quantity: 1,
      metadata: {
        adventure_id: validatedData.adventure_id,
        scene_id: validatedData.scene_id,
        theme: validatedData.theme,
        tone: validatedData.tone,
        cost_usd: result.cost_usd,
        word_count: result.narrative_text.split(' ').length
      },
      billing_period_start: currentMonth,
      billing_period_end: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    });
    
    // Create real-time event if this is for an active session
    if (validatedData.scene_id) {
      const { data: activeSession } = await supabase
        .from('cluequest_game_sessions')
        .select('id')
        .eq('adventure_id', validatedData.adventure_id)
        .eq('status', 'active')
        .single();
      
      if (activeSession) {
        await supabase.from('cluequest_real_time_events').insert({
          session_id: activeSession.id,
          event_type: 'narrative_updated',
          event_data: {
            scene_id: validatedData.scene_id,
            narrative_preview: result.narrative_text.substring(0, 100) + '...'
          },
          event_source: 'ai_generation'
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      narrative_id: result.narrative_id,
      narrative_text: result.narrative_text,
      dialogue: result.dialogue,
      branching_options: result.branching_options,
      readability_score: result.readability_score,
      cached: false,
      cost_usd: result.cost_usd,
      message: 'Narrative generated successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Narrative generation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation error', 
          message: 'Invalid request data',
          details: error.errors
        },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      if (error.message.includes('quota') || error.message.includes('limit')) {
        return NextResponse.json(
          { error: 'Quota exceeded', message: error.message },
          { status: 429 }
        );
      }
      
      if (error.message.includes('moderation')) {
        return NextResponse.json(
          { error: 'Content rejected', message: 'Generated content failed moderation' },
          { status: 422 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Narrative generation failed', message: 'Unable to generate narrative at this time' },
      { status: 500 }
    );
  }
}

// GET /api/ai/narrative - Get adventure narratives
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse query parameters
    const adventureId = searchParams.get('adventure_id');
    const sceneId = searchParams.get('scene_id');
    const tone = searchParams.get('tone');
    const status = searchParams.get('status') || 'moderated';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    
    if (!adventureId) {
      return NextResponse.json(
        { error: 'Bad request', message: 'adventure_id parameter required' },
        { status: 400 }
      );
    }
    
    // Verify access to adventure
    const { data: adventure } = await supabase
      .from('cluequest_adventures')
      .select('organization_id, creator_id')
      .eq('id', adventureId)
      .single();
    
    if (!adventure) {
      return NextResponse.json(
        { error: 'Not found', message: 'Adventure not found' },
        { status: 404 }
      );
    }
    
    // Check permissions
    const { data: membership } = await supabase
      .from('cluequest_organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .eq('organization_id', adventure.organization_id)
      .eq('is_active', true)
      .single();
    
    const hasAccess = adventure.creator_id === user.id || membership;
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Access denied to this adventure' },
        { status: 403 }
      );
    }
    
    // Build query
    let query = supabase
      .from('cluequest_ai_narratives')
      .select(`
        id,
        scene_id,
        theme,
        tone,
        target_audience,
        narrative_text,
        dialogue,
        branching_options,
        readability_score,
        engagement_predicted,
        content_length,
        moderation_passed,
        bias_score,
        status,
        usage_count,
        user_rating,
        created_at
      `)
      .eq('adventure_id', adventureId);
    
    // Apply filters
    if (sceneId) {
      query = query.eq('scene_id', sceneId);
    }
    
    if (tone) {
      query = query.eq('tone', tone);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    // Apply ordering and limit
    query = query
      .order('created_at', { ascending: false })
      .limit(limit);
    
    const { data: narratives, error } = await query;
    
    if (error) {
      console.error('Error fetching narratives:', error);
      return NextResponse.json(
        { error: 'Database error', message: error.message },
        { status: 500 }
      );
    }
    
    // Calculate statistics
    const statistics = {
      total_narratives: narratives?.length || 0,
      average_readability: narratives?.length ? 
        narratives.reduce((sum, n) => sum + (n.readability_score || 0), 0) / narratives.length : 0,
      by_tone: narratives?.reduce((acc: any, narrative: any) => {
        acc[narrative.tone] = (acc[narrative.tone] || 0) + 1;
        return acc;
      }, {}) || {},
      by_status: narratives?.reduce((acc: any, narrative: any) => {
        acc[narrative.status] = (acc[narrative.status] || 0) + 1;
        return acc;
      }, {}) || {}
    };
    
    return NextResponse.json({
      narratives: narratives || [],
      statistics,
      adventure_id: adventureId
    });
    
  } catch (error) {
    console.error('Unexpected error in GET /api/ai/narrative:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}