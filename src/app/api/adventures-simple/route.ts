import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body) {
      return NextResponse.json({ error: 'Empty request body' }, { status: 400 })
    }

    const { title, theme, description } = body

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

    // Return mock adventure data for development
    const mockAdventure = {
      id: `dev-adventure-${Date.now()}`,
      title: title,
      theme: theme,
      description: description || `A ${theme} adventure`,
      category: theme,
      difficulty: 'intermediate',
      estimated_duration: 60,
      max_players: 20,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      organization_id: 'default-org-id',
      custom_colors: {},
      narrative: 'ai_generated',
      story_type: 'ai',
      story_framework: 'hero_journey',
      ai_generated: false,
      branching_points: 2,
      generated_story: null,
      roles: [],
      challenge_types: ['trivia', 'puzzle'],
      qr_locations: [],
      ranking: {},
      rewards: {},
      access_mode: 'public',
      device_limits: {}
    }

    return NextResponse.json({
      success: true,
      adventure: mockAdventure,
      message: 'Adventure created successfully'
    })

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Return mock adventures list
  const mockAdventures = [
    {
      id: '1',
      title: 'Fantasy Quest',
      theme: 'fantasy',
      description: 'A magical adventure',
      status: 'published',
      created_at: new Date().toISOString()
    },
    {
      id: '2', 
      title: 'Mystery Investigation',
      theme: 'mystery',
      description: 'Solve the case',
      status: 'published',
      created_at: new Date().toISOString()
    }
  ]

  return NextResponse.json({
    success: true,
    adventures: mockAdventures,
    total: mockAdventures.length
  })
}
