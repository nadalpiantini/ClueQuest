import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Validation schema for QR scan
const QRScanSchema = z.object({
  token: z.string().min(1),
  signature: z.string().min(1),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    accuracy: z.number().min(0).optional(),
    altitude: z.number().optional()
  }),
  device_fingerprint: z.string().optional(),
  timestamp: z.number().optional()
});

interface RouteParams {
  params: { id: string };
}

// POST /api/sessions/[id]/qr-scan - Process QR code scan with security validation
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const startTime = Date.now();
    
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
    const validatedData = QRScanSchema.parse(body);
    
    // Get client IP and user agent for fraud detection
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || '';
    
    // Check if user is a participant in this session
    const { data: playerState, error: playerError } = await supabase
      .from('cluequest_player_states')
      .select(`
        id,
        session_id,
        user_id,
        display_name,
        current_scene_id,
        total_score,
        status,
        last_activity_at,
        suspicious_activity_score
      `)
      .eq('session_id', params.id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();
    
    if (playerError || !playerState) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Not an active participant in this session' },
        { status: 403 }
      );
    }
    
    // Check session status
    const { data: session, error: sessionError } = await supabase
      .from('cluequest_game_sessions')
      .select('id, status, adventure_id')
      .eq('id', params.id)
      .single();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Not found', message: 'Session not found' },
        { status: 404 }
      );
    }
    
    if (session.status !== 'active') {
      return NextResponse.json(
        { error: 'Conflict', message: `Session is not active (current status: ${session.status})` },
        { status: 409 }
      );
    }
    
    // Use the optimized RPC function for QR validation
    const { data: validationResult, error: validationError } = await supabase.rpc(
      'validate_qr_scan',
      {
        token_param: validatedData.token,
        signature_param: validatedData.signature,
        player_location: validatedData.location,
        ip_address_param: clientIP,
        device_fingerprint: validatedData.device_fingerprint || userAgent
      }
    );
    
    if (validationError) {
      console.error('QR validation error:', validationError);
      return NextResponse.json(
        { error: 'Validation failed', message: validationError.message },
        { status: 500 }
      );
    }
    
    const processingTime = Date.now() - startTime;
    
    // If validation failed, return early
    if (!validationResult.valid) {
      return NextResponse.json({
        success: false,
        error: validationResult.error,
        message: validationResult.message,
        risk_score: validationResult.risk_score,
        processing_time_ms: processingTime
      }, { status: 400 });
    }
    
    // Get scene information for progression logic
    const { data: scene, error: sceneError } = await supabase
      .from('cluequest_scenes')
      .select(`
        id,
        adventure_id,
        order_index,
        title,
        points_reward,
        interaction_type,
        completion_criteria,
        unlock_conditions,
        time_limit
      `)
      .eq('id', validationResult.scene_id)
      .single();
    
    if (sceneError || !scene) {
      return NextResponse.json(
        { error: 'Not found', message: 'Scene not found' },
        { status: 404 }
      );
    }
    
    // Check if player has already completed this scene
    const alreadyCompleted = playerState.completed_scenes?.includes(scene.id);
    if (alreadyCompleted) {
      return NextResponse.json({
        success: false,
        error: 'already_completed',
        message: 'You have already completed this challenge',
        scene: {
          id: scene.id,
          title: scene.title
        }
      }, { status: 409 });
    }
    
    // Check unlock conditions
    if (scene.unlock_conditions && Array.isArray(scene.unlock_conditions) && scene.unlock_conditions.length > 0) {
      for (const condition of scene.unlock_conditions) {
        if (condition.required_scenes && Array.isArray(condition.required_scenes)) {
          const hasRequiredScenes = condition.required_scenes.every((reqSceneId: string) =>
            playerState.completed_scenes?.includes(reqSceneId)
          );
          
          if (!hasRequiredScenes) {
            return NextResponse.json({
              success: false,
              error: 'prerequisites_not_met',
              message: 'Complete required challenges first',
              required_scenes: condition.required_scenes
            }, { status: 409 });
          }
        }
      }
    }
    
    // Calculate points awarded (with role multiplier if applicable)
    let pointsAwarded = scene.points_reward || 100;
    
    // Get player role for point multiplier
    const { data: role } = await supabase
      .from('cluequest_adventure_roles')
      .select('point_multiplier')
      .eq('id', playerState.role_id || '')
      .single();
    
    if (role?.point_multiplier) {
      pointsAwarded = Math.round(pointsAwarded * role.point_multiplier);
    }
    
    // Update player state
    const newCompletedScenes = [...(playerState.completed_scenes || []), scene.id];
    const newTotalScore = playerState.total_score + pointsAwarded;
    const newScenesCompleted = playerState.scenes_completed + 1;
    
    const { error: updateError } = await supabase
      .from('cluequest_player_states')
      .update({
        current_scene_id: scene.id,
        completed_scenes: newCompletedScenes,
        total_score: newTotalScore,
        scenes_completed: newScenesCompleted,
        last_activity_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', playerState.id);
    
    if (updateError) {
      console.error('Error updating player state:', updateError);
      return NextResponse.json(
        { error: 'Database error', message: updateError.message },
        { status: 500 }
      );
    }
    
    // Create real-time event for other players and admins
    await supabase.from('cluequest_real_time_events').insert({
      session_id: params.id,
      player_id: playerState.id,
      event_type: 'challenge_completed',
      event_data: {
        scene_id: scene.id,
        scene_title: scene.title,
        points_awarded: pointsAwarded,
        total_score: newTotalScore,
        player_name: playerState.display_name
      },
      event_source: 'player_action'
    });
    
    // Check if this completes the adventure
    const { data: totalScenes } = await supabase
      .from('cluequest_scenes')
      .select('id', { count: 'exact', head: true })
      .eq('adventure_id', session.adventure_id);
    
    const isAdventureComplete = newScenesCompleted >= (totalScenes || 0);
    
    if (isAdventureComplete) {
      // Mark player as completed
      await supabase
        .from('cluequest_player_states')
        .update({
          status: 'completed',
          completion_time: Math.round((Date.now() - new Date(playerState.created_at).getTime()) / 1000)
        })
        .eq('id', playerState.id);
      
      // Create completion event
      await supabase.from('cluequest_real_time_events').insert({
        session_id: params.id,
        player_id: playerState.id,
        event_type: 'adventure_completed',
        event_data: {
          final_score: newTotalScore,
          completion_time: Math.round((Date.now() - new Date(playerState.created_at).getTime()) / 1000),
          scenes_completed: newScenesCompleted,
          player_name: playerState.display_name
        },
        event_source: 'system_trigger'
      });
    }
    
    // Get next scene information
    const { data: nextScene } = await supabase
      .from('cluequest_scenes')
      .select('id, title, description, order_index')
      .eq('adventure_id', session.adventure_id)
      .gt('order_index', scene.order_index)
      .order('order_index')
      .limit(1)
      .single();
    
    return NextResponse.json({
      success: true,
      scan_result: {
        scene: {
          id: scene.id,
          title: scene.title,
          completed: true
        },
        points_awarded: pointsAwarded,
        total_score: newTotalScore,
        scenes_completed: newScenesCompleted,
        adventure_completed: isAdventureComplete,
        next_scene: nextScene || null,
        risk_assessment: {
          risk_score: validationResult.risk_score,
          distance_meters: validationResult.distance_meters,
          fraud_indicators: validationResult.fraud_indicators
        }
      },
      processing_time_ms: processingTime
    });
    
  } catch (error) {
    console.error('Unexpected error in POST /api/sessions/[id]/qr-scan:', error);
    
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