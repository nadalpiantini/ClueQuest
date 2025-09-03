import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Validation schema for adventure updates
const UpdateAdventureSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  category: z.enum(['social_event', 'educational', 'team_building', 'marketing', 'onboarding', 'training', 'entertainment']).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  estimated_duration: z.number().min(5).max(480).optional(),
  theme_name: z.string().optional(),
  theme_config: z.record(z.any()).optional(),
  allows_teams: z.boolean().optional(),
  max_team_size: z.number().min(1).max(20).optional(),
  max_participants: z.number().min(1).max(1000).optional(),
  leaderboard_enabled: z.boolean().optional(),
  ai_personalization: z.boolean().optional(),
  adaptive_difficulty: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  is_public: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'active', 'paused', 'completed', 'archived']).optional()
});

interface RouteParams {
  params: { id: string };
}

// GET /api/adventures/[id] - Get single adventure with complete data
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const includeScenes = searchParams.get('include_scenes') === 'true';
    const includeRoles = searchParams.get('include_roles') === 'true';
    const includeAnalytics = searchParams.get('include_analytics') === 'true';
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Use the optimized RPC function for complete adventure data
    if (includeScenes && includeRoles) {
      const { data: adventureData, error } = await supabase.rpc(
        'get_adventure_complete',
        { adventure_id_param: params.id }
      );
      
      if (error) {
        return NextResponse.json(
          { error: 'Database error', message: error.message },
          { status: 500 }
        );
      }
      
      if (!adventureData) {
        return NextResponse.json(
          { error: 'Not found', message: 'Adventure not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(adventureData);
    }
    
    // Standard query for adventure only
    const { data: adventure, error } = await supabase
      .from('cluequest_adventures')
      .select('*')
      .eq('id', params.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Not found', message: 'Adventure not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: 'Database error', message: error.message },
        { status: 500 }
      );
    }
    
    // Check permissions
    if (!adventure.is_public) {
      const { data: membership } = await supabase
        .from('cluequest_organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('organization_id', adventure.organization_id)
        .eq('is_active', true)
        .single();
      
      if (!membership && adventure.creator_id !== user.id) {
        return NextResponse.json(
          { error: 'Forbidden', message: 'Access denied to this adventure' },
          { status: 403 }
        );
      }
    }
    
    const result: any = { adventure };
    
    // Optionally include scenes
    if (includeScenes) {
      const { data: scenes } = await supabase
        .from('cluequest_scenes')
        .select('*')
        .eq('adventure_id', params.id)
        .order('order_index');
      
      result.scenes = scenes || [];
    }
    
    // Optionally include roles
    if (includeRoles) {
      const { data: roles } = await supabase
        .from('cluequest_adventure_roles')
        .select('*')
        .eq('adventure_id', params.id);
      
      result.roles = roles || [];
    }
    
    // Optionally include analytics
    if (includeAnalytics) {
      const { data: analytics } = await supabase
        .from('cluequest_adventure_metrics')
        .select('*')
        .eq('adventure_id', params.id)
        .single();
      
      result.analytics = analytics;
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Unexpected error in GET /api/adventures/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// PUT /api/adventures/[id] - Update adventure
export async function PUT(request: NextRequest, { params }: RouteParams) {
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
    
    // Check if adventure exists and user has permissions
    const { data: adventure, error: fetchError } = await supabase
      .from('cluequest_adventures')
      .select('id, organization_id, creator_id, status, title')
      .eq('id', params.id)
      .single();
    
    if (fetchError || !adventure) {
      return NextResponse.json(
        { error: 'Not found', message: 'Adventure not found' },
        { status: 404 }
      );
    }
    
    // Check permissions
    const { data: membership } = await supabase
      .from('cluequest_organization_members')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', adventure.organization_id)
      .eq('is_active', true)
      .single();
    
    const canEdit = adventure.creator_id === user.id || 
                   (membership && ['owner', 'admin'].includes(membership.role));
    
    if (!canEdit) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Insufficient permissions to edit this adventure' },
        { status: 403 }
      );
    }
    
    // Validate request body
    const body = await request.json();
    const validatedData = UpdateAdventureSchema.parse(body);
    
    // Prevent status changes if adventure is active
    if (adventure.status === 'active' && validatedData.status && validatedData.status !== 'active') {
      return NextResponse.json(
        { error: 'Conflict', message: 'Cannot modify active adventure. Pause it first.' },
        { status: 409 }
      );
    }
    
    // Store old values for audit
    const oldValues = adventure;
    
    // Update adventure
    const { data: updatedAdventure, error: updateError } = await supabase
      .from('cluequest_adventures')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating adventure:', updateError);
      return NextResponse.json(
        { error: 'Database error', message: updateError.message },
        { status: 500 }
      );
    }
    
    // Log audit event
    await supabase.from('cluequest_audit_logs').insert({
      organization_id: adventure.organization_id,
      user_id: user.id,
      action: 'adventure_updated',
      resource_type: 'adventure',
      resource_id: params.id,
      old_values: oldValues,
      new_values: updatedAdventure
    });
    
    return NextResponse.json({
      adventure: updatedAdventure,
      message: 'Adventure updated successfully'
    });
    
  } catch (error) {
    console.error('Unexpected error in PUT /api/adventures/[id]:', error);
    
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

// DELETE /api/adventures/[id] - Delete adventure
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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
    
    // Check if adventure exists and get current state
    const { data: adventure, error: fetchError } = await supabase
      .from('cluequest_adventures')
      .select('id, organization_id, creator_id, status, title, total_sessions')
      .eq('id', params.id)
      .single();
    
    if (fetchError || !adventure) {
      return NextResponse.json(
        { error: 'Not found', message: 'Adventure not found' },
        { status: 404 }
      );
    }
    
    // Check if there are active sessions
    const { count: activeSessions } = await supabase
      .from('cluequest_game_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('adventure_id', params.id)
      .in('status', ['active', 'starting']);
    
    if (activeSessions && activeSessions > 0) {
      return NextResponse.json(
        { error: 'Conflict', message: 'Cannot delete adventure with active sessions. End sessions first.' },
        { status: 409 }
      );
    }
    
    // Check permissions - only creator or organization owner can delete
    const { data: membership } = await supabase
      .from('cluequest_organization_members')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', adventure.organization_id)
      .eq('is_active', true)
      .single();
    
    const canDelete = adventure.creator_id === user.id || 
                     (membership && membership.role === 'owner');
    
    if (!canDelete) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Only adventure creator or organization owner can delete adventures' },
        { status: 403 }
      );
    }
    
    // If adventure has been used, archive instead of delete
    if (adventure.total_sessions > 0) {
      const { error: archiveError } = await supabase
        .from('cluequest_adventures')
        .update({ 
          status: 'archived',
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id);
      
      if (archiveError) {
        return NextResponse.json(
          { error: 'Database error', message: archiveError.message },
          { status: 500 }
        );
      }
      
      // Log audit event
      await supabase.from('cluequest_audit_logs').insert({
        organization_id: adventure.organization_id,
        user_id: user.id,
        action: 'adventure_archived',
        resource_type: 'adventure',
        resource_id: params.id,
        old_values: adventure,
        new_values: { status: 'archived' }
      });
      
      return NextResponse.json({
        message: 'Adventure archived successfully (has existing sessions)',
        action: 'archived'
      });
    }
    
    // Actually delete if no sessions exist
    const { error: deleteError } = await supabase
      .from('cluequest_adventures')
      .delete()
      .eq('id', params.id);
    
    if (deleteError) {
      console.error('Error deleting adventure:', deleteError);
      return NextResponse.json(
        { error: 'Database error', message: deleteError.message },
        { status: 500 }
      );
    }
    
    // Log audit event
    await supabase.from('cluequest_audit_logs').insert({
      organization_id: adventure.organization_id,
      user_id: user.id,
      action: 'adventure_deleted',
      resource_type: 'adventure',
      resource_id: params.id,
      old_values: adventure
    });
    
    return NextResponse.json({
      message: 'Adventure deleted successfully',
      action: 'deleted'
    });
    
  } catch (error) {
    console.error('Unexpected error in DELETE /api/adventures/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}