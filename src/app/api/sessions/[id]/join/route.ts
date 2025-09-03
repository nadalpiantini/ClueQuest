import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Validation schema for joining session
const JoinSessionSchema = z.object({
  display_name: z.string().min(1).max(50),
  role_id: z.string().uuid().optional(),
  team_id: z.string().uuid().optional(),
  password: z.string().optional(),
  device_info: z.object({
    platform: z.string(),
    user_agent: z.string(),
    screen_resolution: z.string().optional(),
    timezone: z.string().optional()
  }).optional()
});

interface RouteParams {
  params: { id: string };
}

// POST /api/sessions/[id]/join - Join a game session
export async function POST(request: NextRequest, { params }: RouteParams) {
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
    const validatedData = JoinSessionSchema.parse(body);
    
    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from('cluequest_game_sessions')
      .select(`
        id,
        adventure_id,
        session_code,
        title,
        status,
        max_participants,
        active_participants,
        allows_teams,
        team_size_limit,
        is_private,
        requires_approval,
        password_hash,
        allow_late_join,
        organization_id,
        host_user_id,
        cluequest_adventures!inner(
          title,
          category,
          difficulty,
          estimated_duration,
          max_participants as adventure_max_participants
        )
      `)
      .eq('id', params.id)
      .single();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Not found', message: 'Session not found' },
        { status: 404 }
      );
    }
    
    // Check if session allows new participants
    if (session.status === 'completed') {
      return NextResponse.json(
        { error: 'Conflict', message: 'Session has already ended' },
        { status: 409 }
      );
    }
    
    if (session.status === 'active' && !session.allow_late_join) {
      return NextResponse.json(
        { error: 'Conflict', message: 'Session has started and late join is disabled' },
        { status: 409 }
      );
    }
    
    if (session.active_participants >= session.max_participants) {
      return NextResponse.json(
        { error: 'Conflict', message: 'Session is full' },
        { status: 409 }
      );
    }
    
    // Check if user is already in the session
    const { data: existingPlayer } = await supabase
      .from('cluequest_player_states')
      .select('id, status')
      .eq('session_id', params.id)
      .eq('user_id', user.id)
      .single();
    
    if (existingPlayer) {
      if (existingPlayer.status === 'active') {
        return NextResponse.json(
          { error: 'Conflict', message: 'Already participating in this session' },
          { status: 409 }
        );
      } else {
        // Reactivate player if they were disconnected
        const { data: reactivatedPlayer, error: reactivateError } = await supabase
          .from('cluequest_player_states')
          .update({
            status: 'active',
            display_name: validatedData.display_name,
            last_activity_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPlayer.id)
          .select()
          .single();
        
        if (reactivateError) {
          return NextResponse.json(
            { error: 'Database error', message: reactivateError.message },
            { status: 500 }
          );
        }
        
        return NextResponse.json({
          success: true,
          player_state: reactivatedPlayer,
          session: session,
          message: 'Rejoined session successfully'
        });
      }
    }
    
    // Validate password if session is password protected
    if (session.password_hash && validatedData.password) {
      const crypto = require('crypto');
      const providedPasswordHash = crypto.createHash('sha256').update(validatedData.password).digest('hex');
      
      if (providedPasswordHash !== session.password_hash) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Incorrect password' },
          { status: 401 }
        );
      }
    } else if (session.password_hash && !validatedData.password) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Password required' },
        { status: 401 }
      );
    }
    
    // Validate role selection
    let selectedRole = null;
    if (validatedData.role_id) {
      const { data: role, error: roleError } = await supabase
        .from('cluequest_adventure_roles')
        .select('*')
        .eq('id', validatedData.role_id)
        .eq('adventure_id', session.adventure_id)
        .single();
      
      if (roleError || !role) {
        return NextResponse.json(
          { error: 'Invalid role', message: 'Selected role not found for this adventure' },
          { status: 400 }
        );
      }
      
      // Check role availability
      if (role.max_players) {
        const { count: currentRolePlayers } = await supabase
          .from('cluequest_player_states')
          .select('*', { count: 'exact', head: true })
          .eq('session_id', params.id)
          .eq('role_id', role.id)
          .eq('status', 'active');
        
        if ((currentRolePlayers || 0) >= role.max_players) {
          return NextResponse.json(
            { error: 'Conflict', message: `Role "${role.name}" is full` },
            { status: 409 }
          );
        }
      }
      
      selectedRole = role;
    }
    
    // Handle team assignment
    let teamId = validatedData.team_id;
    if (session.allows_teams && validatedData.team_id) {
      const { data: team, error: teamError } = await supabase
        .from('cluequest_teams')
        .select('id, current_members, max_members')
        .eq('id', validatedData.team_id)
        .eq('session_id', params.id)
        .eq('is_active', true)
        .single();
      
      if (teamError || !team) {
        return NextResponse.json(
          { error: 'Invalid team', message: 'Selected team not found' },
          { status: 400 }
        );
      }
      
      if (team.current_members >= team.max_members) {
        return NextResponse.json(
          { error: 'Conflict', message: 'Selected team is full' },
          { status: 409 }
        );
      }
    }
    
    // Get user profile for avatar
    const { data: profile } = await supabase
      .from('cluequest_profiles')
      .select('avatar_url, full_name')
      .eq('id', user.id)
      .single();
    
    // Generate session token for WebSocket authentication
    const crypto = require('crypto');
    const sessionToken = crypto.randomBytes(32).toString('hex');
    
    // Create player state
    const { data: playerState, error: createError } = await supabase
      .from('cluequest_player_states')
      .insert({
        session_id: params.id,
        user_id: user.id,
        display_name: validatedData.display_name,
        avatar_url: profile?.avatar_url,
        team_id: teamId,
        role_id: validatedData.role_id,
        device_info: validatedData.device_info || {},
        session_token: sessionToken,
        status: 'active'
      })
      .select(`
        id,
        session_id,
        user_id,
        display_name,
        avatar_url,
        team_id,
        role_id,
        current_scene_id,
        total_score,
        status,
        session_token,
        created_at
      `)
      .single();
    
    if (createError) {
      console.error('Error creating player state:', createError);
      return NextResponse.json(
        { error: 'Database error', message: createError.message },
        { status: 500 }
      );
    }
    
    // Update session active participant count
    const { error: updateSessionError } = await supabase
      .from('cluequest_game_sessions')
      .update({
        active_participants: session.active_participants + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id);
    
    if (updateSessionError) {
      console.error('Error updating session participant count:', updateSessionError);
    }
    
    // Update team member count if joining a team
    if (teamId) {
      const { error: teamUpdateError } = await supabase
        .from('cluequest_teams')
        .update({
          current_members: supabase.raw('current_members + 1'),
          updated_at: new Date().toISOString()
        })
        .eq('id', teamId);
      
      if (teamUpdateError) {
        console.error('Error updating team member count:', teamUpdateError);
      }
    }
    
    // Create real-time event
    await supabase.from('cluequest_real_time_events').insert({
      session_id: params.id,
      player_id: playerState.id,
      event_type: 'player_joined',
      event_data: {
        player_name: validatedData.display_name,
        role_name: selectedRole?.name,
        team_id: teamId
      },
      event_source: 'player_action'
    });
    
    // Log audit event
    await supabase.from('cluequest_audit_logs').insert({
      organization_id: session.organization_id,
      user_id: user.id,
      action: 'session_joined',
      resource_type: 'game_session',
      resource_id: params.id,
      new_values: {
        player_id: playerState.id,
        display_name: validatedData.display_name,
        role_id: validatedData.role_id,
        team_id: teamId
      }
    });
    
    // Get initial scene to start with
    const { data: firstScene } = await supabase
      .from('cluequest_scenes')
      .select('id, title, description, interaction_type, order_index')
      .eq('adventure_id', session.adventure_id)
      .order('order_index')
      .limit(1)
      .single();
    
    return NextResponse.json({
      success: true,
      player_state: playerState,
      session: {
        id: session.id,
        title: session.title,
        adventure: session.cluequest_adventures,
        allows_teams: session.allows_teams,
        team_size_limit: session.team_size_limit
      },
      role: selectedRole,
      first_scene: firstScene,
      websocket_auth: {
        session_token: sessionToken,
        connection_url: `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'}/session/${params.id}`
      },
      message: 'Successfully joined session'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Unexpected error in POST /api/sessions/[id]/join:', error);
    
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