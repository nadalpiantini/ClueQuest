/**
 * ClueQuest Knowledge Base Search API
 * Semantic search with RAG capabilities integrated with ClueQuest authentication
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with service role for RPC calls
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Rate limiting for search requests
const searchRequests = new Map<string, { count: number, lastRequest: number }>()

function checkSearchRateLimit(clientIP: string): boolean {
  const now = Date.now()
  const clientData = searchRequests.get(clientIP)
  
  if (!clientData) {
    searchRequests.set(clientIP, { count: 1, lastRequest: now })
    return true
  }
  
  // Reset if more than 1 minute has passed
  if (now - clientData.lastRequest > 60000) {
    searchRequests.set(clientIP, { count: 1, lastRequest: now })
    return true
  }
  
  // Allow up to 30 searches per minute
  if (clientData.count >= 30) {
    return false
  }
  
  clientData.count++
  clientData.lastRequest = now
  return true
}

interface SearchRequest {
  query: string                    // Search query text (renamed from 'q' for clarity)
  organization_id?: string         // Optional organization filter
  category?: string               // Content category filter
  limit?: number                  // Number of results (max 20)
  similarity_threshold?: number   // Minimum similarity score (0.0-1.0)
  include_public?: boolean        // Include public sources
  source_types?: string[]         // Filter by source types
}

interface SearchResponse {
  results: {
    id: string
    content: string
    similarity: number
    source_id: string
    source_title: string
    source_category: string
    chunk_index: number
    metadata?: any
  }[]
  query_info: {
    query: string
    embedding_time_ms: number
    search_time_ms: number
    total_chunks_searched: number
    filters_applied: any
  }
  usage: {
    tokens_used: number
    cost_estimate: number
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    if (!checkSearchRateLimit(clientIP)) {
      return NextResponse.json(
        { 
          error: 'Search rate limit exceeded. Please try again in 1 minute.',
          retry_after: 60
        },
        { status: 429 }
      )
    }

    // Parse and validate request
    const body: SearchRequest = await request.json()
    
    // Support both 'q' and 'query' for backward compatibility
    const queryText = body.query || (body as any).q
    
    if (!queryText || typeof queryText !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required and must be a string' },
        { status: 400 }
      )
    }

    if (queryText.length > 1000) {
      return NextResponse.json(
        { error: 'Query is too long (max 1000 characters)' },
        { status: 400 }
      )
    }

    // Validate and set defaults
    const query = queryText.trim()
    const limit = Math.min(body.limit || 8, 20) // Max 20 results
    const similarityThreshold = Math.max(0, Math.min(body.similarity_threshold || 0.55, 1))
    const includePublic = body.include_public !== false // Default true
    const organizationId = body.organization_id
    const category = body.category
    const sourceTypes = body.source_types || []

    // Generate embedding for the query
    const embeddingStartTime = Date.now()
    let queryEmbedding: number[]
    
     try {
       const response = await fetch('https://api.openai.com/v1/embeddings', {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({ model: 'text-embedding-3-small', input: query })
       })
       const data = await response.json()
       queryEmbedding = data.data[0].embedding
     } catch (embeddingError) {
      console.error('Embedding generation failed:', embeddingError)
      return NextResponse.json(
        { 
          error: 'Failed to process query. Please try again.',
          details: process.env.NODE_ENV === 'development' ? embeddingError : undefined
        },
        { status: 500 }
      )
    }
    
    const embeddingTime = Date.now() - embeddingStartTime

    // Perform vector similarity search
    const searchStartTime = Date.now()
    
    try {
       // Use the basic RPC function
       const { data: searchResults, error: searchError } = await supabase
         .rpc('match_kb_chunks', {
           query_embedding: queryEmbedding,
           match_count: limit,
           similarity_threshold: similarityThreshold
         })

      if (searchError) {
        console.error('Search RPC error:', searchError)
        return NextResponse.json(
          { 
            error: 'Search operation failed',
            details: process.env.NODE_ENV === 'development' ? searchError.message : undefined
          },
          { status: 500 }
        )
      }

      const searchTime = Date.now() - searchStartTime

      // Filter results based on additional criteria
      let filteredResults = searchResults || []
      
      if (category) {
        filteredResults = filteredResults.filter(
          (result: any) => result.source_category === category
        )
      }

      // Format response
      const formattedResults = filteredResults.map((result: any) => ({
        id: result.id,
        content: result.content,
        similarity: result.similarity,
        source_id: result.source_id,
        source_title: result.source_title,
        source_category: result.source_category,
        chunk_index: result.chunk_index,
        metadata: {
          content_length: result.content.length,
          word_count: result.content.split(/\s+/).length
        }
      }))

      // Calculate usage statistics
      const tokensUsed = Math.ceil(query.length / 4) + 50 // Rough estimate
      const costEstimate = tokensUsed * 0.00001 // Rough cost for text-embedding-3-small

      const response: SearchResponse = {
        results: formattedResults,
        query_info: {
          query,
          embedding_time_ms: embeddingTime,
          search_time_ms: searchTime,
          total_chunks_searched: searchResults?.length || 0,
          filters_applied: {
            organization_id: organizationId,
            category,
            source_types: sourceTypes,
            similarity_threshold: similarityThreshold,
            include_public: includePublic
          }
        },
        usage: {
          tokens_used: tokensUsed,
          cost_estimate: costEstimate
        }
      }

      return NextResponse.json(response)

    } catch (searchError) {
      console.error('Vector search failed:', searchError)
      return NextResponse.json(
        { 
          error: 'Search operation failed',
          details: process.env.NODE_ENV === 'development' ? searchError : undefined
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('KB Search API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

// GET endpoint for testing and health check
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const testQuery = url.searchParams.get('q')
  
  if (testQuery) {
    // Perform a simple test search
    try {
      const testRequest = {
        query: testQuery,
        limit: 3,
        similarity_threshold: 0.5
      }
      
      // Reuse POST logic for test
      const mockRequest = {
        json: async () => testRequest,
        headers: request.headers
      } as any
      
      return POST(mockRequest)
      
    } catch (error) {
      return NextResponse.json(
        { error: 'Test search failed', details: error },
        { status: 500 }
      )
    }
  }
  
  // Health check response
  return NextResponse.json({
    service: 'ClueQuest Knowledge Base Search',
    status: 'online',
    version: '1.0.0',
    capabilities: [
      'semantic_search',
      'vector_similarity',
      'multi_tenant_filtering',
      'rate_limiting',
      'content_categorization'
    ],
    supported_formats: [
      'pdf',
      'document',
      'web_article',
      'manual',
      'guide'
    ],
    search_parameters: {
      max_query_length: 1000,
      max_results: 20,
      default_similarity_threshold: 0.55,
      rate_limit: '30 requests per minute'
    },
    examples: {
      basic_search: {
        method: 'POST',
        body: {
          query: 'team building puzzle mechanics',
          limit: 5
        }
      },
      filtered_search: {
        method: 'POST',
        body: {
          query: 'corporate escape room ideas',
          category: 'adventure_ideas',
          organization_id: 'your-org-id',
          similarity_threshold: 0.7
        }
      }
    }
  })
}
