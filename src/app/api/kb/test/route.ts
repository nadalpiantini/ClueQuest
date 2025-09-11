import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // Test Supabase connection
    const { data, error } = await supabase
      .from('cluequest_kb_sources')
      .select('*')
      .limit(1)

    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Supabase connection failed',
        error: error.message,
        tables_exist: false
      })
    }

    // Test if tables exist
    const { data: chunks, error: chunksError } = await supabase
      .from('cluequest_kb_chunks')
      .select('count')
      .limit(1)

    const { data: policy, error: policyError } = await supabase
      .from('cluequest_policy')
      .select('*')
      .limit(1)

    return NextResponse.json({
      status: 'success',
      message: 'ClueQuest KB is ready!',
      supabase_connected: true,
      tables_exist: {
        sources: !error,
        chunks: !chunksError,
        policy: !policyError
      },
      sample_data: {
        sources_count: data?.length || 0,
        has_policy: (policy?.length || 0) > 0
      },
      next_steps: [
        '1. Configure OPENAI_API_KEY in .env.local',
        '2. Run SQL setup in Supabase',
        '3. Upload a PDF to docs/ folder',
        '4. Run: node scripts/ingest_kb.mjs ./docs/your-file.pdf "Title" "License" "URL"'
      ]
    })

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'KB test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
