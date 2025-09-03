import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Adventure ID is required' },
        { status: 400 }
      )
    }

    // Get adventure details
    const { data: adventure, error: adventureError } = await supabase
      .from('cluequest_adventures')
      .select('*')
      .eq('id', id)
      .single()

    if (adventureError || !adventure) {
      return NextResponse.json(
        { error: 'Adventure not found' },
        { status: 404 }
      )
    }

    // Get adventure roles
    const { data: roles } = await supabase
      .from('cluequest_adventure_roles')
      .select('*')
      .eq('adventure_id', id)

    // Get adventure scenes
    const { data: scenes } = await supabase
      .from('cluequest_scenes')
      .select('*')
      .eq('adventure_id', id)
      .order('order_index')

    // Combine all data
    const adventureWithDetails = {
      ...adventure,
      roles: roles || [],
      scenes: scenes || []
    }

    return NextResponse.json({
      success: true,
      adventure: adventureWithDetails
    })

  } catch (error) {
    console.error('Error fetching adventure:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Adventure ID is required' },
        { status: 400 }
      )
    }

    // Update adventure
    const { data: adventure, error: updateError } = await supabase
      .from('cluequest_adventures')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating adventure:', updateError)
      return NextResponse.json(
        { error: 'Failed to update adventure' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      adventure
    })

  } catch (error) {
    console.error('Error updating adventure:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Adventure ID is required' },
        { status: 400 }
      )
    }

    // Delete adventure (this will cascade to related tables)
    const { error: deleteError } = await supabase
      .from('cluequest_adventures')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting adventure:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete adventure' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Adventure deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting adventure:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

