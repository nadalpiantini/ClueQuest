import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Validation schema for session creation
const CreateSessionSchema = z.object({
  adventure_id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  max_participants: z.number().min(1).max(1000).default(50),
  allows_teams: z.boolean().default(true),
  team_size_limit: z.number().min(1).max(20).default(4),
  is_private: z.boolean().default(true),
  requires_approval: z.boolean().default(false),
  password: z.string().min(4).optional(),
  scheduled_start: z.string().datetime().optional(),
  scheduled_end: z.string().datetime().optional(),
  auto_start: z.boolean().default(false),
  setting_overrides: z.record(z.any()).default({})
});

// Generate unique session code
function generateSessionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// GET /api/sessions - List user's game sessions
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
    const status = searchParams.get('status');
    const adventureId = searchParams.get('adventure_id');
    const role = searchParams.get('role'); // 'host' or 'participant'
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    
    let query = supabase
      .from('cluequest_game_sessions')
      .select(`
        id,
        adventure_id,
        session_code,
        title,
        description,
        max_participants,
        active_participants,
        completed_participants,
        status,
        scheduled_start,
        actual_start,
        scheduled_end,
        actual_end,
        completion_rate,
        created_at,
        updated_at,
        cluequest_adventures!inner(
          title,
          category,
          difficulty,
          estimated_duration
        )
      `);
    
    // Filter by role
    if (role === 'host') {
      query = query.eq('host_user_id', user.id);
    } else if (role === 'participant') {
      // Get sessions where user is a participant
      const { data: participantSessions } = await supabase
        .from('cluequest_player_states')
        .select('session_id')
        .eq('user_id', user.id);
      
      const sessionIds = participantSessions?.map(ps => ps.session_id) || [];
      if (sessionIds.length > 0) {
        query = query.in('id', sessionIds);
      } else {
        // No sessions as participant
        return NextResponse.json({
          sessions: [],
          pagination: { total: 0, limit, offset, hasMore: false }
        });
      }
    } else {
      // Show both hosted and participated sessions
      const { data: participantSessions } = await supabase
        .from('cluequest_player_states')
        .select('session_id')
        .eq('user_id', user.id);
      
      const participantSessionIds = participantSessions?.map(ps => ps.session_id) || [];
      
      query = query.or(
        `host_user_id.eq.${user.id},id.in.(${participantSessionIds.join(',')})`
      );
    }
    
    // Apply additional filters
    if (status) {
      query = query.eq('status', status);
    }
    
    if (adventureId) {
      query = query.eq('adventure_id', adventureId);
    }
    
    // Apply pagination and ordering
    query = query
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    const { data: sessions, error, count } = await query;
    
    if (error) {
      console.error('Error fetching sessions:', error);
      return NextResponse.json(
        { error: 'Database error', message: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      sessions: sessions || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      }
    });
    
  } catch (error) {
    console.error('Unexpected error in GET /api/sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// POST /api/sessions - Create new game session
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
    const validatedData = CreateSessionSchema.parse(body);
    
    // Verify adventure exists and user has permission
    const { data: adventure, error: adventureError } = await supabase
      .from('cluequest_adventures')
      .select('id, organization_id, status, title, max_participants')
      .eq('id', validatedData.adventure_id)
      .single();
    
    if (adventureError || !adventure) {
      return NextResponse.json(
        { error: 'Not found', message: 'Adventure not found' },
        { status: 404 }
      );
    }
    
    if (adventure.status !== 'published') {
      return NextResponse.json(
        { error: 'Conflict', message: 'Can only create sessions for published adventures' },
        { status: 409 }
      );
    }
    
    // Check user permissions for the adventure
    const { data: membership } = await supabase
      .from('cluequest_organization_members')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .eq('organization_id', adventure.organization_id)
      .eq('is_active', true)
      .single();
    
    if (!membership) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Access denied to this adventure' },
        { status: 403 }
      );
    }
    
    // Generate unique session code
    let sessionCode: string;
    let attempts = 0;
    
    do {
      sessionCode = generateSessionCode();
      const { data: existing } = await supabase
        .from('cluequest_game_sessions')
        .select('id')
        .eq('session_code', sessionCode)
        .single();
      
      if (!existing) break;
      attempts++;
      
      if (attempts > 10) {
        return NextResponse.json(
          { error: 'Service error', message: 'Unable to generate unique session code' },
          { status: 500 }
        );
      }
    } while (true);
    
    // Hash password if provided
    let passwordHash: string | null = null;
    if (validatedData.password) {
      const crypto = require('crypto');
      passwordHash = crypto.createHash('sha256').update(validatedData.password).digest('hex');
    }
    
    // Create session
    const { data: session, error: createError } = await supabase
      .from('cluequest_game_sessions')
      .insert({
        adventure_id: validatedData.adventure_id,
        organization_id: adventure.organization_id,
        host_user_id: user.id,
        session_code: sessionCode,
        title: validatedData.title || `${adventure.title} - Session`,
        description: validatedData.description,
        max_participants: Math.min(validatedData.max_participants, adventure.max_participants),
        allows_teams: validatedData.allows_teams,
        team_size_limit: validatedData.team_size_limit,
        is_private: validatedData.is_private,
        requires_approval: validatedData.requires_approval,
        password_hash: passwordHash,
        scheduled_start: validatedData.scheduled_start,
        scheduled_end: validatedData.scheduled_end,
        auto_start: validatedData.auto_start,
        setting_overrides: validatedData.setting_overrides
      })
      .select(`
        *,
        cluequest_adventures!inner(
          title,
          category,
          difficulty,
          estimated_duration
        )
      `)
      .single();
    
    if (createError) {
      console.error('Error creating session:', createError);
      return NextResponse.json(
        { error: 'Database error', message: createError.message },
        { status: 500 }
      );
    }
    
    // Generate initial QR codes for all scenes
    const { data: scenes } = await supabase
      .from('cluequest_scenes')
      .select('id, qr_code_required, location')
      .eq('adventure_id', validatedData.adventure_id)
      .eq('qr_code_required', true);
    
    if (scenes && scenes.length > 0) {
      // Generate QR codes for scenes that require them
      const qrCodes = await Promise.all(
        scenes.map(async (scene) => {
          const { data: qr } = await supabase.rpc(
            'generate_secure_qr_token',
            { 
              scene_id_param: scene.id,
              session_id_param: session.id,
              expires_in_minutes: 240 // 4 hours default
            }
          );
          return qr;
        })
      );
      
      session.qr_codes = qrCodes;
    }
    
    // Log audit event
    await supabase.from('cluequest_audit_logs').insert({
      organization_id: adventure.organization_id,
      user_id: user.id,
      action: 'session_created',
      resource_type: 'game_session',
      resource_id: session.id,
      new_values: session
    });
    
    // Record usage for billing
    await supabase.from('cluequest_usage_records').insert({
      organization_id: adventure.organization_id,
      user_id: user.id,
      event_type: 'session_created',
      quantity: 1,
      billing_period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      billing_period_end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    });
    
    return NextResponse.json({
      session,
      message: 'Game session created successfully',
      session_url: `${process.env.NEXT_PUBLIC_APP_URL}/play/${sessionCode}`
    }, { status: 201 });
    
  } catch (error) {
    console.error('Unexpected error in POST /api/sessions:', error);
    
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