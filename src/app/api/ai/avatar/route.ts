import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { aiContentService } from '@/lib/services/ai-content';
import { z } from 'zod';

// Validation schema for avatar generation
const GenerateAvatarSchema = z.object({
  source_image_url: z.string().url(),
  style: z.enum(['realistic', 'cartoon', '8bit', 'fantasy', 'cyberpunk', 'medieval']),
  theme: z.string().optional(),
  mood: z.enum(['adventurous', 'mysterious', 'playful', 'serious']).optional(),
  custom_prompt: z.string().max(200).optional(),
  session_id: z.string().uuid().optional()
});

// POST /api/ai/avatar - Generate AI avatar from selfie
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
    
    // Check user's organization subscription for AI features
    const { data: membership } = await supabase
      .from('cluequest_organization_members')
      .select(`
        organization_id,
        cluequest_subscriptions!inner(
          status,
          cluequest_plans!inner(
            features
          )
        )
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();
    
    if (!membership) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'No active organization membership' },
        { status: 403 }
      );
    }
    
    const subscription = membership.cluequest_subscriptions;
    const plan = subscription.cluequest_plans;
    
    // Check if AI features are enabled
    if (!plan.features.includes('ai_avatar_generation')) {
      return NextResponse.json(
        { error: 'Feature not available', message: 'AI avatar generation not included in your plan' },
        { status: 402 } // Payment required
      );
    }
    
    // Check usage limits
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const { count: monthlyUsage } = await supabase
      .from('cluequest_ai_avatars')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', currentMonth.toISOString());
    
    const monthlyLimit = plan.features.includes('unlimited_ai') ? 1000 : 10;
    
    if ((monthlyUsage || 0) >= monthlyLimit) {
      return NextResponse.json(
        { error: 'Quota exceeded', message: `Monthly AI avatar limit reached (${monthlyLimit})` },
        { status: 429 }
      );
    }
    
    // Validate request body
    const body = await request.json();
    const validatedData = GenerateAvatarSchema.parse(body);
    
    // Check if we already have a cached avatar for similar parameters
    const cacheKey = `${user.id}_${validatedData.style}_${validatedData.theme || 'default'}_${validatedData.mood || 'default'}`;
    const { data: cachedAvatar } = await supabase
      .from('cluequest_ai_avatars')
      .select('id, avatar_url, thumbnail_url, status')
      .eq('user_id', user.id)
      .eq('style', validatedData.style)
      .eq('status', 'moderated')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (cachedAvatar) {
      // Return cached avatar to save costs
      return NextResponse.json({
        success: true,
        avatar_id: cachedAvatar.id,
        avatar_url: cachedAvatar.avatar_url,
        thumbnail_url: cachedAvatar.thumbnail_url,
        cached: true,
        generation_time_seconds: 0,
        cost_usd: 0,
        message: 'Using cached avatar from recent generation'
      });
    }
    
    // Generate new avatar
    const result = await aiContentService.generateAvatar(
      user.id,
      validatedData.source_image_url,
      {
        style: validatedData.style,
        theme: validatedData.theme,
        mood: validatedData.mood,
        customPrompt: validatedData.custom_prompt,
        enableModeration: true
      },
      validatedData.session_id
    );
    
    // Record usage for billing
    await supabase.from('cluequest_usage_records').insert({
      organization_id: membership.organization_id,
      user_id: user.id,
      event_type: 'ai_avatar_generated',
      quantity: 1,
      metadata: {
        style: validatedData.style,
        cost_usd: result.cost_usd,
        generation_time: result.generation_time_seconds
      },
      billing_period_start: currentMonth,
      billing_period_end: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    });
    
    return NextResponse.json({
      success: true,
      avatar_id: result.avatar_id,
      avatar_url: result.avatar_url,
      thumbnail_url: result.thumbnail_url,
      cached: false,
      generation_time_seconds: result.generation_time_seconds,
      cost_usd: result.cost_usd,
      moderation_passed: result.moderation_result.approved,
      message: result.moderation_result.approved 
        ? 'Avatar generated successfully'
        : 'Avatar generated but requires review'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Avatar generation error:', error);
    
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
      if (error.message.includes('quota')) {
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
      { error: 'Avatar generation failed', message: 'Unable to generate avatar at this time' },
      { status: 500 }
    );
  }
}

// GET /api/ai/avatar - Get user's avatars
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
    const sessionId = searchParams.get('session_id');
    const style = searchParams.get('style');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const includeRejected = searchParams.get('include_rejected') === 'true';
    
    // Build query
    let query = supabase
      .from('cluequest_ai_avatars')
      .select(`
        id,
        style,
        avatar_url,
        thumbnail_url,
        generation_cost,
        generation_time_seconds,
        moderation_score,
        status,
        usage_count,
        created_at
      `)
      .eq('user_id', user.id);
    
    // Apply filters
    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }
    
    if (style) {
      query = query.eq('style', style);
    }
    
    if (!includeRejected) {
      query = query.in('status', ['moderated', 'generated']);
    }
    
    // Apply ordering and limit
    query = query
      .order('created_at', { ascending: false })
      .limit(limit);
    
    const { data: avatars, error } = await query;
    
    if (error) {
      console.error('Error fetching avatars:', error);
      return NextResponse.json(
        { error: 'Database error', message: error.message },
        { status: 500 }
      );
    }
    
    // Get usage statistics
    const { data: usageStats } = await supabase
      .from('cluequest_ai_avatars')
      .select('style, status')
      .eq('user_id', user.id);
    
    const statistics = {
      total_generated: usageStats?.length || 0,
      by_style: usageStats?.reduce((acc: any, avatar: any) => {
        acc[avatar.style] = (acc[avatar.style] || 0) + 1;
        return acc;
      }, {}) || {},
      by_status: usageStats?.reduce((acc: any, avatar: any) => {
        acc[avatar.status] = (acc[avatar.status] || 0) + 1;
        return acc;
      }, {}) || {}
    };
    
    return NextResponse.json({
      avatars: avatars || [],
      statistics,
      total_count: usageStats?.length || 0
    });
    
  } catch (error) {
    console.error('Unexpected error in GET /api/ai/avatar:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}