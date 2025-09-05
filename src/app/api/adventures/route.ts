import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with fallback for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null

export async function POST(request: NextRequest) {
  let body, theme, customColors, narrative, storyType, storyFramework, aiGenerated, 
      branchingPoints, generatedStory, roles, challengeTypes, qrLocations, ranking, 
      rewards, accessMode, deviceLimits, title, description, category, difficulty, estimatedDuration

  try {
    body = await request.json()
    
    if (!body) {
      return NextResponse.json({ error: 'Empty request body' }, { status: 400 })
    }

    // Simple assignment instead of destructuring
    theme = body.theme
    customColors = body.customColors
    narrative = body.narrative
    storyType = body.storyType
    storyFramework = body.storyFramework
    aiGenerated = body.aiGenerated
    branchingPoints = body.branchingPoints
    generatedStory = body.generatedStory
    roles = body.roles
    challengeTypes = body.challengeTypes
    qrLocations = body.qrLocations
    ranking = body.ranking
    rewards = body.rewards
    accessMode = body.accessMode
    deviceLimits = body.deviceLimits
    title = body.title
    description = body.description
    category = body.category
    difficulty = body.difficulty
    estimatedDuration = body.estimatedDuration

    // Validate required fields
    if (!theme || !title) {
      return NextResponse.json(
        { 
          error: 'Missing required fields: theme and title',
          received: { theme, title }
        },
        { status: 400 }
      )
    }

    // Check if we're in development mode or if Supabase is not configured
    const isDevelopment = process.env.NODE_ENV === 'development' || !supabase
    
    if (isDevelopment) {
      // Return mock adventure data for development
      const mockAdventure = {
        id: `dev-adventure-${Date.now()}`,
        title: title,
        theme: theme,
        description: description || `A ${theme} adventure created in development mode`,
        category: category || theme,
        difficulty: difficulty || 'intermediate',
        estimated_duration: estimatedDuration || 60,
        max_players: 20,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        organization_id: 'dev-org-123',
        custom_colors: customColors || {},
        narrative: narrative || 'ai_generated',
        story_type: storyType || 'ai',
        story_framework: storyFramework || 'hero_journey',
        ai_generated: aiGenerated || false,
        branching_points: branchingPoints || 2,
        generated_story: generatedStory || null,
        roles: roles || [],
        challenge_types: challengeTypes || ['trivia', 'puzzle'],
        qr_locations: qrLocations || [],
        ranking: ranking || {},
        rewards: rewards || {},
        access_mode: accessMode || 'public',
        device_limits: deviceLimits || {}
      }

      console.log('🎮 Development mode: Created mock adventure:', mockAdventure.id)
      
      return NextResponse.json({
        success: true,
        adventure: mockAdventure,
        message: 'Adventure created successfully (development mode)'
      })
    }

    // Production mode - use database
    let organizationId: string
    
    try {
      // Check if we can connect to the database first
      const { data: testConnection, error: connectionError } = await supabase
        .from('cluequest_organizations')
        .select('count')
        .limit(1)

      if (connectionError) {
        console.error('Database connection error:', connectionError)
        return NextResponse.json(
          { 
            error: 'Database connection failed', 
            details: connectionError.message,
            hint: 'Check if Supabase is running and migrations are applied'
          },
          { status: 500 }
        )
      }

      // Try to get an existing organization
      const { data: existingOrg, error: selectError } = await supabase
        .from('cluequest_organizations')
        .select('id')
        .limit(1)
        .single()

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Error selecting organization:', selectError)
        return NextResponse.json(
          { 
            error: 'Failed to check existing organizations', 
            details: selectError.message 
          },
          { status: 500 }
        )
      }

      if (existingOrg) {
        organizationId = existingOrg.id
        console.log('Using existing organization:', organizationId)
      } else {
        // Create a default organization if none exists
        const timestamp = Date.now()
        const uniqueSlug = `default-${timestamp}`
        
        const { data: newOrg, error: orgError } = await supabase
          .from('cluequest_organizations')
          .insert({
            name: 'Default Organization',
            slug: uniqueSlug,
            description: 'Default organization for ClueQuest adventures',
            settings: {},
            is_active: true
          })
          .select('id')
          .single()

        if (orgError) {
          console.error('Error creating default organization:', orgError)
          return NextResponse.json(
            { 
              error: 'Failed to create default organization', 
              details: orgError.message,
              hint: 'Check if the cluequest_organizations table exists and has the correct schema'
            },
            { status: 500 }
          )
        }

        organizationId = newOrg.id
        console.log('Created new organization:', organizationId)
      }

    } catch (error) {
      console.error('Organization setup error:', error)
      return NextResponse.json(
        { 
          error: 'Failed to setup organization', 
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }

    // Prepare adventure data
    const adventureData = {
      title: title,
      theme: theme,
      description: description || `A ${theme} adventure`,
      category: category || theme,
      difficulty: difficulty || 'intermediate',
      estimated_duration: estimatedDuration || 60,
      max_players: 20,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      organization_id: organizationId,
      custom_colors: customColors || {},
      narrative: narrative || 'ai_generated',
      story_type: storyType || 'ai',
      story_framework: storyFramework || 'hero_journey',
      ai_generated: aiGenerated || false,
      branching_points: branchingPoints || 2,
      generated_story: generatedStory || null,
      roles: roles || [],
      challenge_types: challengeTypes || ['trivia', 'puzzle'],
      qr_locations: qrLocations || [],
      ranking: ranking || {},
      rewards: rewards || {},
      access_mode: accessMode || 'public',
      device_limits: deviceLimits || {}
    }

    // Insert adventure
    const { data: adventure, error: adventureError } = await supabase
      .from('cluequest_adventures')
      .insert(adventureData)
      .select()
      .single()

    if (adventureError) {
      console.error('Error creating adventure:', adventureError)
      return NextResponse.json(
        { 
          error: 'Failed to create adventure', 
          details: adventureError.message,
          hint: 'Check if the cluequest_adventures table exists and has the correct schema'
        },
        { status: 500 }
      )
    }

    console.log('✅ Adventure created successfully:', adventure.id)

    // Create default roles if none provided
    if (!roles || roles.length === 0) {
      const roleData = ['Leader', 'Detective', 'Scientist', 'Explorer', 'Hacker'].map((roleName, index) => ({
        adventure_id: adventure.id,
        name: roleName,
        description: `The ${roleName} role in this adventure`,
        abilities: [`${roleName.toLowerCase()}_ability_1`, `${roleName.toLowerCase()}_ability_2`],
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][index],
        max_players: 5
      }))

      const { error: roleError } = await supabase
        .from('cluequest_adventure_roles')
        .insert(roleData)

      if (roleError) {
        console.error('Error creating default roles:', roleError)
        // Don't fail the entire request for role creation errors
      }
    }

    // Create default scenes if none provided
    if (!qrLocations || qrLocations.length === 0) {
      const sceneData = [
        { name: 'Scene 1: The Beginning', description: 'The adventure starts here', order: 1 },
        { name: 'Scene 2: The Investigation', description: 'The plot thickens', order: 2 },
        { name: 'Scene 3: The Resolution', description: 'The final confrontation', order: 3 }
      ].map(scene => ({
        adventure_id: adventure.id,
        name: scene.name,
        description: scene.description,
        order: scene.order,
        qr_code: `QR-${adventure.id}-${scene.order}`,
        location_data: {
          latitude: 0,
          longitude: 0,
          address: 'Virtual Location'
        },
        challenges: [],
        is_active: true
      }))

      const { error: sceneError } = await supabase
        .from('cluequest_scenes')
        .insert(sceneData)

      if (sceneError) {
        console.error('Error creating default scenes:', sceneError)
        // Don't fail the entire request for scene creation errors
      }
    }

    return NextResponse.json({
      success: true,
      adventure: adventure,
      message: 'Adventure created successfully'
    })

  } catch (error) {
    console.error('Adventure creation error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  console.log('📖 Fetching adventures list...')
  
  // Check if we're in development mode or if Supabase is not configured
  const isDevelopment = process.env.NODE_ENV === 'development' || !supabase
  
  if (isDevelopment) {
    // Return mock adventures for development
    const mockAdventures = [
      {
        id: 'dev-adventure-1',
        title: 'The Mystery of the Lost Temple',
        theme: 'mystery',
        description: 'A thrilling mystery adventure in development mode',
        status: 'draft',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        organization: { name: 'Development Org' }
      },
      {
        id: 'dev-adventure-2',
        title: 'Corporate Team Building Challenge',
        theme: 'corporate',
        description: 'A corporate team building adventure',
        status: 'published',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        organization: { name: 'Development Org' }
      }
    ]

    return NextResponse.json({
      success: true,
      adventures: mockAdventures,
      total: mockAdventures.length
    })
  }
  
  try {

    const { data: adventures, error } = await supabase
      .from('cluequest_adventures')
      .select(`
        id,
        title,
        description,
        category,
        difficulty,
        estimated_duration,
        theme_name,
        status,
        max_participants,
        total_sessions,
        total_participants,
        completion_rate,
        rating,
        created_at,
        updated_at,
        is_public,
        organization_id
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching adventures:', error)
      return NextResponse.json(
        { error: 'Failed to fetch adventures' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      adventures: adventures || [],
      total: adventures?.length || 0
    })

  } catch (error) {
    console.error('Adventures fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}