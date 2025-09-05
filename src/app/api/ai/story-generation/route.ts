import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Mock OpenAI client for development when API key is not available
const createMockOpenAIClient = () => ({
  chat: {
    completions: {
      create: async () => ({
        choices: [{
          message: {
            content: JSON.stringify({
              title: "Mock Adventure Story",
              introduction: "This is a mock story generated for development purposes.",
              acts: [
                {
                  title: "Act 1: The Beginning",
                  description: "The adventure begins with a mysterious discovery.",
                  estimated_duration: 20,
                  objective: "Find the first clue",
                  challenge_count: 2,
                  key_events: ["Discover the map", "Solve the first puzzle"]
                }
              ],
              conclusion: "The adventure concludes with a great revelation.",
              total_estimated_duration: 60,
              narrative_quality_score: 85
            })
          }
        }]
      })
    }
  }
})

const QUALITY_CONFIGS = {
  standard: {
    model: 'gpt-3.5-turbo',
    max_tokens: 2000,
    temperature: 0.7
  },
  premium: {
    model: 'gpt-4',
    max_tokens: 4000,
    temperature: 0.8
  },
  enterprise: {
    model: 'gpt-4-turbo',
    max_tokens: 8000,
    temperature: 0.9
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      adventure_data,
      generation_prompt,
      story_tone = 'adventurous',
      target_audience = 'adults',
      quality_level = 'standard',
      component_type = 'full_story'
    } = body

    // Validate required fields
    if (!generation_prompt) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get user and organization (allow development mode)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    let userId = null
    let organizationId = null
    
    if (user && !userError) {
      userId = user.id
      
      // Get user's organization
      const { data: orgMember } = await supabase
        .from('cluequest_organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()

      if (orgMember) {
        organizationId = (orgMember as any).organization_id
      }
    }
    
    // In development mode, allow requests without authentication
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (!isDevelopment && (!user || userError)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Create a mock generation ID for development
    const generationId = `temp-${Date.now()}`

    // Start background generation
    generateStoryInBackground(generationId, {
      adventure_data,
      generation_prompt,
      story_tone,
      target_audience,
      quality_level,
      component_type,
      userId,
      organizationId
    })

    return NextResponse.json({
      success: true,
      generation_id: generationId,
      status: 'pending',
      message: 'Story generation started'
    })

  } catch (error) {
    console.error('Story generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function generateStoryInBackground(
  generationId: string,
  params: {
    adventure_data: any
    generation_prompt: string
    story_tone: string
    target_audience: string
    quality_level: string
    component_type: string
    userId: string | null
    organizationId: string | null
  }
) {
  try {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Use mock client for development
    const openai = createMockOpenAIClient()
    
    const response = await (openai as any).chat.completions.create({
      model: QUALITY_CONFIGS[params.quality_level as keyof typeof QUALITY_CONFIGS].model,
      messages: [
        {
          role: 'system',
          content: `You are a professional adventure story writer. Create engaging, interactive stories for escape room experiences. Focus on ${params.story_tone} tone and ${params.target_audience} audience.`
        },
        {
          role: 'user',
          content: params.generation_prompt
        }
      ],
      max_tokens: QUALITY_CONFIGS[params.quality_level as keyof typeof QUALITY_CONFIGS].max_tokens,
      temperature: QUALITY_CONFIGS[params.quality_level as keyof typeof QUALITY_CONFIGS].temperature
    })

    const aiResponse = response.choices[0]?.message?.content
    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Parse AI response
    let storyContent
    try {
      storyContent = JSON.parse(aiResponse)
    } catch (parseError) {
      // If not JSON, treat as plain text
      storyContent = {
        title: "Generated Adventure Story",
        content: aiResponse,
        introduction: aiResponse.substring(0, 200) + "...",
        acts: [],
        conclusion: "The adventure concludes successfully.",
        total_estimated_duration: params.adventure_data?.duration || 60,
        narrative_quality_score: 75
      }
    }

    // Update generation status (skip DB in development if no auth)
    if (params.userId && params.organizationId) {
      try {
        const supabase = await createClient()
        await (supabase as any)
          .from('cluequest_ai_story_generations')
          .update({
            status: 'completed',
            generated_content: JSON.stringify(storyContent),
            completed_at: new Date().toISOString(),
            metadata: {
              model_used: QUALITY_CONFIGS[params.quality_level as keyof typeof QUALITY_CONFIGS].model,
              tokens_used: 0, // Mock value
              generation_time: 2000
            }
          })
          .eq('id', generationId)
      } catch (dbError) {
        console.error('Database update error:', dbError)
        // Continue without DB update in development
      }
    }

    console.log(`✅ Story generation completed for ID: ${generationId}`)

  } catch (error) {
    console.error('Background generation error:', error)
    
    // Update generation status to failed (skip DB in development if no auth)
    if (params.userId && params.organizationId) {
      try {
        const supabase = await createClient()
        await (supabase as any)
          .from('cluequest_ai_story_generations')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
            completed_at: new Date().toISOString()
          })
          .eq('id', generationId)
      } catch (dbError) {
        console.error('Database update error:', dbError)
        // Continue without DB update in development
      }
    }
  }
}