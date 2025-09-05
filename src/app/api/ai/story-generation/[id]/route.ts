import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const generationId = params.id
    
    // In development mode, return mock data for temp IDs
    if (generationId.startsWith('temp-')) {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return NextResponse.json({
        generation: {
          id: generationId,
          status: 'completed',
          generated_content: JSON.stringify({
            title: "Mock Adventure Story",
            introduction: "This is a mock story generated for development purposes. The adventure begins with a mysterious discovery that leads the team through a series of challenging puzzles and exciting revelations.",
            acts: [
              {
                title: "Act 1: The Discovery",
                description: "The team discovers an ancient artifact that holds the key to solving the mystery.",
                estimated_duration: 20,
                objective: "Decipher the artifact's symbols",
                challenge_count: 2,
                key_events: ["Find the artifact", "Solve the first puzzle", "Unlock the hidden chamber"]
              },
              {
                title: "Act 2: The Investigation",
                description: "Deeper into the mystery, the team uncovers clues that reveal the true nature of their quest.",
                estimated_duration: 25,
                objective: "Piece together the clues",
                challenge_count: 3,
                key_events: ["Follow the trail", "Decode the messages", "Navigate the maze"]
              },
              {
                title: "Act 3: The Resolution",
                description: "The final confrontation where all pieces come together in an epic conclusion.",
                estimated_duration: 15,
                objective: "Complete the final challenge",
                challenge_count: 1,
                key_events: ["Face the final boss", "Solve the ultimate puzzle", "Claim the treasure"]
              }
            ],
            conclusion: "The adventure concludes with the team successfully solving the mystery and discovering the hidden treasure. Their teamwork and problem-solving skills have led them to victory!",
            total_estimated_duration: 60,
            narrative_quality_score: 85,
            themes: ["mystery", "teamwork", "problem-solving", "adventure"],
            difficulty_level: "intermediate",
            target_audience: "adults"
          }),
          created_at: new Date(Date.now() - 5000).toISOString(),
          completed_at: new Date().toISOString(),
          generation_time_seconds: 3,
          readability_score: 82,
          engagement_score: 88
        }
      })
    }

    // For real IDs, try to get from database
    const supabase = await createClient()
    
    // Get user (allow development mode)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    // In development mode, allow requests without authentication
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (!isDevelopment && (!user || userError)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Try to get generation from database
    try {
      const { data: generation, error } = await supabase
        .from('cluequest_ai_story_generations')
        .select('*')
        .eq('id', generationId)
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Generation not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ generation })

    } catch (dbError) {
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}