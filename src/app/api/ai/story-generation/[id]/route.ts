import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get story generation with all related data
    const { data: generation, error: generationError } = await supabase
      .rpc('get_story_generation_complete', { 
        generation_id_param: params.id 
      })

    if (generationError) {
      console.error('Error fetching generation:', generationError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch generation' },
        { status: 500 }
      )
    }

    if (!generation) {
      return NextResponse.json(
        { success: false, error: 'Generation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      generation: generation.generation,
      iterations: generation.iterations,
      feedback: generation.feedback,
      adventure_context: generation.adventure_context,
    })

  } catch (error) {
    console.error('Error in story generation GET:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}