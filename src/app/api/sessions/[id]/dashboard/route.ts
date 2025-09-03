import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: { id: string };
}

// GET /api/sessions/[id]/dashboard - Get real-time session dashboard data
export async function GET(request: NextRequest, { params }: RouteParams) {
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
    
    // Check if user has access to this session (host or participant)
    const { data: session, error: sessionError } = await supabase
      .from('cluequest_game_sessions')
      .select(`
        id,
        adventure_id,
        host_user_id,
        session_code,
        title,
        status,
        max_participants,
        active_participants,
        completed_participants,
        scheduled_start,
        actual_start,
        scheduled_end,
        completion_rate,
        cluequest_adventures!inner(
          title,
          category,
          difficulty,
          estimated_duration,
          total_sessions
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
    
    // Check if user is host or participant
    const isHost = session.host_user_id === user.id;
    
    if (!isHost) {
      const { data: playerState } = await supabase
        .from('cluequest_player_states')
        .select('id')
        .eq('session_id', params.id)
        .eq('user_id', user.id)
        .single();
      
      if (!playerState) {
        return NextResponse.json(
          { error: 'Forbidden', message: 'Access denied to this session' },
          { status: 403 }
        );
      }
    }
    
    // Use optimized RPC function for live session state
    const { data: liveState, error: stateError } = await supabase.rpc(
      'get_session_live_state',
      { session_id_param: params.id }
    );
    
    if (stateError) {
      console.error('Error getting live session state:', stateError);
      return NextResponse.json(
        { error: 'Database error', message: stateError.message },
        { status: 500 }
      );
    }
    
    // Get scene progression data
    const { data: scenes, error: scenesError } = await supabase
      .from('cluequest_scenes')
      .select(`
        id,
        order_index,
        title,
        description,
        interaction_type,
        points_reward,
        qr_code_required
      `)
      .eq('adventure_id', session.adventure_id)
      .order('order_index');
    
    if (scenesError) {
      console.error('Error getting scenes:', scenesError);
      return NextResponse.json(
        { error: 'Database error', message: scenesError.message },
        { status: 500 }
      );
    }
    
    // Calculate scene completion statistics
    const sceneStats = scenes?.map(scene => {
      const completedByPlayers = liveState.players?.filter((player: any) => 
        player.completed_scenes?.includes(scene.id)
      ).length || 0;
      
      const totalPlayers = liveState.players?.length || 0;
      
      return {
        scene_id: scene.id,
        title: scene.title,
        order_index: scene.order_index,
        completed_by: completedByPlayers,
        completion_rate: totalPlayers > 0 ? (completedByPlayers / totalPlayers) * 100 : 0,
        points_reward: scene.points_reward,
        interaction_type: scene.interaction_type
      };
    }) || [];
    
    // Get recent activities (last 50 events)
    const { data: recentActivities, error: activitiesError } = await supabase
      .from('cluequest_real_time_events')
      .select(`
        event_type,
        event_data,
        occurred_at,
        cluequest_player_states!inner(
          display_name,
          avatar_url
        )
      `)
      .eq('session_id', params.id)
      .order('occurred_at', { ascending: false })
      .limit(50);
    
    if (activitiesError) {
      console.error('Error getting recent activities:', activitiesError);
    }
    
    // Calculate session performance metrics
    const sessionMetrics = {
      total_participants: liveState.players?.length || 0,
      active_participants: liveState.players?.filter((p: any) => p.status === 'active').length || 0,
      completed_participants: liveState.players?.filter((p: any) => p.status === 'completed').length || 0,
      average_score: liveState.players?.length > 0 ? 
        (liveState.players.reduce((sum: number, p: any) => sum + (p.total_score || 0), 0) / liveState.players.length) : 0,
      highest_score: Math.max(...(liveState.players?.map((p: any) => p.total_score || 0) || [0])),
      total_scenes: scenes?.length || 0,
      average_completion_rate: sceneStats.reduce((sum, stat) => sum + stat.completion_rate, 0) / Math.max(sceneStats.length, 1),
      session_duration_minutes: session.actual_start ? 
        Math.round((Date.now() - new Date(session.actual_start).getTime()) / (1000 * 60)) : 0
    };
    
    // Host-only data (sensitive information)
    const hostData = isHost ? {
      fraud_alerts: liveState.players?.filter((p: any) => p.suspicious_activity_score > 50) || [],
      recent_scans: await getRecentQRScans(supabase, params.id),
      performance_issues: await checkPerformanceIssues(supabase, params.id)
    } : {};
    
    return NextResponse.json({
      session: liveState.session,
      adventure: session.cluequest_adventures,
      players: liveState.players || [],
      teams: liveState.teams || [],
      scene_progression: sceneStats,
      recent_activities: recentActivities || [],
      metrics: sessionMetrics,
      is_host: isHost,
      ...hostData
    });
    
  } catch (error) {
    console.error('Unexpected error in GET /api/sessions/[id]/dashboard:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation error', 
          message: 'Invalid request parameters',
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

// Helper function to get recent QR scans for fraud monitoring
async function getRecentQRScans(supabase: any, sessionId: string) {
  const { data: recentScans } = await supabase
    .from('cluequest_qr_scans')
    .select(`
      scanned_at,
      is_valid,
      fraud_risk_score,
      distance_from_target,
      cluequest_player_states!inner(display_name),
      cluequest_scenes!inner(title)
    `)
    .eq('session_id', sessionId)
    .gte('scanned_at', new Date(Date.now() - 10 * 60 * 1000).toISOString()) // Last 10 minutes
    .order('scanned_at', { ascending: false });
  
  return recentScans || [];
}

// Helper function to check for performance issues
async function checkPerformanceIssues(supabase: any, sessionId: string) {
  const issues = [];
  
  // Check for players with connection issues
  const { data: inactivePlayers } = await supabase
    .from('cluequest_player_states')
    .select('display_name, last_activity_at, status')
    .eq('session_id', sessionId)
    .eq('status', 'active')
    .lt('last_activity_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()); // No activity for 5 minutes
  
  if (inactivePlayers && inactivePlayers.length > 0) {
    issues.push({
      type: 'inactive_players',
      count: inactivePlayers.length,
      details: inactivePlayers
    });
  }
  
  // Check for high fraud risk scores
  const { data: suspiciousActivity } = await supabase
    .from('cluequest_fraud_incidents')
    .select('risk_score, incident_type')
    .eq('session_id', sessionId)
    .gte('detected_at', new Date(Date.now() - 30 * 60 * 1000).toISOString()) // Last 30 minutes
    .gt('risk_score', 70);
  
  if (suspiciousActivity && suspiciousActivity.length > 0) {
    issues.push({
      type: 'fraud_alerts',
      count: suspiciousActivity.length,
      avg_risk_score: suspiciousActivity.reduce((sum, incident) => sum + incident.risk_score, 0) / suspiciousActivity.length
    });
  }
  
  return issues;
}