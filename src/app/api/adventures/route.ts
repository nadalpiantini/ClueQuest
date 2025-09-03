import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Validation schema for adventure creation
const CreateAdventureSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  category: z.enum(['social_event', 'educational', 'team_building', 'marketing', 'onboarding', 'training', 'entertainment']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  estimated_duration: z.number().min(5).max(480).default(30),
  theme_name: z.string().default('default'),
  theme_config: z.record(z.any()).default({}),
  allows_teams: z.boolean().default(true),
  max_team_size: z.number().min(1).max(20).default(4),
  max_participants: z.number().min(1).max(1000).default(50),
  leaderboard_enabled: z.boolean().default(true),
  ai_personalization: z.boolean().default(false),
  adaptive_difficulty: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  is_public: z.boolean().default(false)
});

const UpdateAdventureSchema = CreateAdventureSchema.partial();

// GET /api/adventures - List user's adventures
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
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const status = searchParams.get('status') || 'published';
    const isPublic = searchParams.get('public') === 'true';
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Build query
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
        allows_teams,
        max_participants,
        status,
        rating,
        review_count,
        total_sessions,
        total_participants,
        completion_rate,
        is_public,
        tags,
        created_at,
        updated_at,
        creator_id,
        organization_id
      `);
    
    // Apply filters
    if (!isPublic) {
      // Show user's organization adventures
      query = query.or(`creator_id.eq.${user.id},is_public.eq.true`);
    } else {
      // Show only public adventures
      query = query.eq('is_public', true);
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    // Apply pagination and ordering
    query = query
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    const { data: adventures, error } = await query;
    
    if (error) {
      console.error('Error fetching adventures:', error);
      return NextResponse.json(
        { error: 'Database error', message: error.message },
        { status: 500 }
      );
    }
    
    // Calculate total count for pagination
    const { count } = await supabase
      .from('cluequest_adventures')
      .select('*', { count: 'exact', head: true })
      .eq('status', status);
    
    return NextResponse.json({
      adventures,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      }
    });
    
  } catch (error) {
    console.error('Unexpected error in GET /api/adventures:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// POST /api/adventures - Create new adventure
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
    
    // Get user's organization
    const { data: membership } = await supabase
      .from('cluequest_organization_members')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();
    
    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Insufficient permissions to create adventures' },
        { status: 403 }
      );
    }
    
    // Validate request body
    const body = await request.json();
    const validatedData = CreateAdventureSchema.parse(body);
    
    // Create adventure
    const { data: adventure, error } = await supabase
      .from('cluequest_adventures')
      .insert({
        ...validatedData,
        creator_id: user.id,
        organization_id: membership.organization_id
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating adventure:', error);
      return NextResponse.json(
        { error: 'Database error', message: error.message },
        { status: 500 }
      );
    }
    
    // Log audit event
    await supabase.from('cluequest_audit_logs').insert({
      organization_id: membership.organization_id,
      user_id: user.id,
      action: 'adventure_created',
      resource_type: 'adventure',
      resource_id: adventure.id,
      new_values: adventure
    });
    
    return NextResponse.json({
      adventure,
      message: 'Adventure created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Unexpected error in POST /api/adventures:', error);
    
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
    
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}