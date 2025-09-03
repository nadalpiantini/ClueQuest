import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      theme,
      customColors,
      narrative,
      storyType,
      storyFramework,
      aiGenerated,
      branchingPoints,
      generatedStory,
      roles,
      challengeTypes,
      qrLocations,
      ranking,
      rewards,
      accessMode,
      deviceLimits,
      title,
      description,
      category,
      difficulty,
      estimatedDuration
    } = body

    // Validate required fields
    if (!theme || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: theme and title' },
        { status: 400 }
      )
    }

    // First, try to get or create a default organization
    let organizationId: string
    
    try {
      // Try to get an existing organization
      const { data: existingOrg } = await supabase
        .from('cluequest_organizations')
        .select('id')
        .limit(1)
        .single()

      if (existingOrg) {
        organizationId = existingOrg.id
      } else {
        // Create a default organization if none exists
        const { data: newOrg, error: orgError } = await supabase
          .from('cluequest_organizations')
          .insert({
            name: 'Default Organization',
            slug: 'default',
            description: 'Default organization for ClueQuest adventures',
            settings: {},
            is_active: true
          })
          .select('id')
          .single()

        if (orgError) {
          console.error('Error creating default organization:', orgError)
          return NextResponse.json(
            { error: 'Failed to create default organization' },
            { status: 500 }
          )
        }

        organizationId = newOrg.id
      }
    } catch (error) {
      console.error('Error handling organization:', error)
      return NextResponse.json(
        { error: 'Failed to handle organization setup' },
        { status: 500 }
      )
    }

    // Create a default creator ID (in production, this should come from auth)
    const defaultCreatorId = '00000000-0000-0000-0000-000000000000'

    // Create adventure record
    const { data: adventure, error: adventureError } = await supabase
      .from('cluequest_adventures')
      .insert({
        organization_id: organizationId,
        creator_id: defaultCreatorId,
        title,
        description: description || `A ${theme} adventure created with ClueQuest`,
        category: category || 'entertainment',
        difficulty: difficulty || 'intermediate',
        estimated_duration: estimatedDuration || 60,
        theme_name: theme,
        theme_config: customColors,
        settings: {
          narrative,
          storyType,
          storyFramework,
          aiGenerated,
          branchingPoints,
          generatedStory,
          roles,
          challengeTypes,
          qrLocations,
          ranking,
          rewards,
          accessMode,
          deviceLimits
        },
        status: 'draft',
        max_participants: 50,
        allows_teams: true,
        max_team_size: 4,
        leaderboard_enabled: ranking !== 'hidden',
        live_tracking: true,
        chat_enabled: false,
        hints_enabled: true,
        ai_personalization: aiGenerated,
        ai_avatars_enabled: true,
        ai_narrative_enabled: aiGenerated,
        offline_mode: true,
        language_support: ['en'],
        tags: [theme, category || 'entertainment'],
        is_template: false,
        is_public: accessMode === 'public'
      })
      .select()
      .single()

    if (adventureError) {
      console.error('Error creating adventure:', adventureError)
      return NextResponse.json(
        { error: 'Failed to create adventure', details: adventureError.message },
        { status: 500 }
      )
    }

    // Create roles if specified
    if (roles && roles.length > 0) {
      const roleData = roles.map((roleId: string) => ({
        adventure_id: adventure.id,
        name: roleId,
        description: `Role: ${roleId}`,
        perks: [],
        point_multiplier: 1.0,
        max_players: 5
      }))

      await supabase
        .from('cluequest_adventure_roles')
        .insert(roleData)
    }

    // Create scenes based on challenge types
    if (challengeTypes && challengeTypes.length > 0) {
      const sceneData = challengeTypes.map((challengeType: string, index: number) => ({
        adventure_id: adventure.id,
        title: `Scene ${index + 1} - ${challengeType}`,
        description: `Challenge type: ${challengeType}`,
        order_index: index + 1,
        interaction_type: challengeType,
        completion_criteria: 'Complete the challenge',
        points_reward: 100,
        narrative_data: {
          type: challengeType,
          description: `Complete the ${challengeType} challenge`
        }
      }))

      await supabase
        .from('cluequest_scenes')
        .insert(sceneData)
    }

    return NextResponse.json({
      success: true,
      adventure: {
        id: adventure.id,
        title: adventure.title,
        theme: adventure.theme_name,
        status: adventure.status,
        created_at: adventure.created_at
      }
    })

  } catch (error) {
    console.error('Error in adventure creation:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { data: adventures, error } = await supabase
      .from('cluequest_adventures')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ adventures })
  } catch (error) {
    console.error('Error fetching adventures:', error)
    return NextResponse.json(
      { error: 'Failed to fetch adventures' },
      { status: 500 }
    )
  }
}
