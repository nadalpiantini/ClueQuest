/**
 * ClueQuest Knowledge Base Original Content Generation API
 * RAG-powered content generation with enterprise-grade originality guarantees
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateEmbedding } from '@/lib/kb/embeddings'
import { checkOriginality, generateImprovementPrompt, type ReferenceContent, DEFAULT_ORIGINALITY_CONFIG } from '@/lib/kb/originality-guard'

// Initialize Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Rate limiting for generation requests (more restrictive than search)
const generationRequests = new Map<string, { count: number, lastRequest: number }>()

function checkGenerationRateLimit(clientIP: string): boolean {
  const now = Date.now()
  const clientData = generationRequests.get(clientIP)
  
  if (!clientData) {
    generationRequests.set(clientIP, { count: 1, lastRequest: now })
    return true
  }
  
  // Reset if more than 10 minutes has passed
  if (now - clientData.lastRequest > 600000) {
    generationRequests.set(clientIP, { count: 1, lastRequest: now })
    return true
  }
  
  // Allow up to 5 generations per 10 minutes
  if (clientData.count >= 5) {
    return false
  }
  
  clientData.count++
  clientData.lastRequest = now
  return true
}

interface GenerationRequest {
  theme: string                    // Adventure theme or topic
  context: string                  // Specific requirements or context
  generation_type: 'story' | 'puzzle_mechanics' | 'team_building' | 'educational' | 'general'
  tone?: string                   // 'professional', 'fun', 'mysterious', 'educational'
  target_audience?: string        // 'adults', 'children', 'professionals', 'students'
  organization_id?: string        // Organization for context filtering
  max_length?: number            // Maximum content length
  creativity_level?: number      // 0.1-1.0 (higher = more creative/less similar)
  originality_requirements?: {
    max_similarity?: number      // Override default similarity threshold
    require_attribution?: boolean
    strict_mode?: boolean
  }
}

interface GenerationResponse {
  success: boolean
  generated_content?: {
    title: string
    content: string
    structure: any
    suggestions?: string[]
  }
  originality_analysis: {
    is_original: boolean
    overall_score: number
    similarity_breakdown: any[]
    recommendations: string[]
  }
  generation_info: {
    attempts: number
    total_time_ms: number
    context_sources: number
    ai_provider: string
    cost_estimate: number
  }
  error?: string
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    if (!checkGenerationRateLimit(clientIP)) {
      return NextResponse.json(
        { 
          error: 'Generation rate limit exceeded. Please try again in 10 minutes.',
          retry_after: 600
        },
        { status: 429 }
      )
    }

    // Parse and validate request
    const body: GenerationRequest = await request.json()
    
    if (!body.theme || typeof body.theme !== 'string') {
      return NextResponse.json(
        { error: 'Theme parameter is required and must be a string' },
        { status: 400 }
      )
    }

    if (!body.context || typeof body.context !== 'string') {
      return NextResponse.json(
        { error: 'Context parameter is required and must be a string' },
        { status: 400 }
      )
    }

    // Validate and set defaults
    const theme = body.theme.trim()
    const context = body.context.trim()
    const generationType = body.generation_type || 'general'
    const tone = body.tone || 'professional'
    const targetAudience = body.target_audience || 'adults'
    const organizationId = body.organization_id
    const maxLength = Math.min(body.max_length || 2000, 5000)
    const creativityLevel = Math.max(0.1, Math.min(body.creativity_level || 0.7, 1.0))

    // Get organization's originality policy
    let originalityConfig = { ...DEFAULT_ORIGINALITY_CONFIG }
    
    if (organizationId) {
      const { data: policyData } = await supabase
        .from('cluequest_kb_policies')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .single()
      
      if (policyData) {
        originalityConfig.maxCosineSimilarity = policyData.max_similarity_threshold || 0.82
        originalityConfig.maxJaccardSimilarity = policyData.max_jaccard_threshold || 0.18
        originalityConfig.minOriginalityScore = policyData.min_originality_score || 75
        originalityConfig.blockSourceDisclosure = policyData.block_source_disclosure !== false
      }
    }

    // Override with request-specific requirements
    if (body.originality_requirements) {
      if (body.originality_requirements.max_similarity) {
        originalityConfig.maxCosineSimilarity = body.originality_requirements.max_similarity
      }
      if (body.originality_requirements.strict_mode) {
        originalityConfig.maxCosineSimilarity = 0.75
        originalityConfig.maxJaccardSimilarity = 0.15
        originalityConfig.minOriginalityScore = 85
      }
    }

    // Step 1: Retrieve relevant context from knowledge base
    const contextQuery = `${theme} ${context} ${generationType}`.trim()
    
    let contextEmbedding: number[]
    try {
      const embeddingResult = await generateEmbedding(contextQuery)
      contextEmbedding = embeddingResult.embedding
    } catch (error) {
      console.error('Context embedding failed:', error)
      return NextResponse.json(
        { error: 'Failed to process context. Please try again.' },
        { status: 500 }
      )
    }

    // Retrieve context chunks
    const { data: contextChunks, error: retrievalError } = await supabase
      .rpc('match_kb_chunks_safe', {
        query_embedding: contextEmbedding,
        organization_id_param: organizationId,
        match_count: 8,
        similarity_threshold: 0.55
      })

    if (retrievalError) {
      console.error('Context retrieval failed:', retrievalError)
      return NextResponse.json(
        { error: 'Failed to retrieve context information' },
        { status: 500 }
      )
    }

    const referenceContents: ReferenceContent[] = (contextChunks || []).map((chunk: any) => ({
      id: chunk.id,
      title: chunk.source_title,
      content: chunk.content,
      category: chunk.source_category
    }))

    // Step 2: Generate content with multiple attempts for originality
    let attempts = 0
    const maxAttempts = 4
    let finalContent: any = null
    let originalityResult: any = null

    while (attempts < maxAttempts && !finalContent) {
      attempts++
      
      // Build generation prompt
      let prompt = buildGenerationPrompt(
        theme, 
        context, 
        generationType, 
        tone, 
        targetAudience, 
        maxLength,
        creativityLevel + (attempts - 1) * 0.1 // Increase creativity with each attempt
      )

      // Add context from KB but don't make it too obvious
      if (referenceContents.length > 0) {
        const contextSummary = referenceContents
          .map(ref => ref.content.slice(0, 300))
          .join('\n\n---\n\n')
        
        prompt += `\n\nGENERAL INSPIRATION (DO NOT COPY):\nUse these concepts as loose inspiration only. Create completely original content:\n\n${contextSummary}`
      }

      // If this is a retry, add improvement instructions
      if (attempts > 1 && originalityResult) {
        prompt = generateImprovementPrompt(originalityResult, prompt)
      }

      try {
        // Use existing DeepSeek configuration from ClueQuest
        const aiResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer sk-cc0b6236d5494183a3a19a0e26323506`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: 'You are a creative content generator specializing in original adventure and educational content. Always create completely original work that draws inspiration but never copies from reference material. Respond with valid JSON only.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: Math.min(maxLength * 2, 4000),
            temperature: creativityLevel,
            top_p: 0.9
          })
        })

        if (!aiResponse.ok) {
          throw new Error(`AI generation failed: ${aiResponse.statusText}`)
        }

        const aiData = await aiResponse.json()
        const generatedText = aiData.choices[0]?.message?.content

        if (!generatedText) {
          throw new Error('No content generated by AI')
        }

        // Parse AI response
        let parsedContent
        try {
          parsedContent = JSON.parse(generatedText.trim())
        } catch (parseError) {
          // If JSON parsing fails, treat as plain text
          parsedContent = {
            title: `${theme} - ${generationType}`,
            content: generatedText,
            structure: { type: 'plain_text' }
          }
        }

        // Step 3: Check originality
        const generatedContentText = [
          parsedContent.title,
          parsedContent.content,
          JSON.stringify(parsedContent.structure || {})
        ].filter(Boolean).join('\n\n')

        // Generate embedding for originality check
        let contentEmbedding: number[]
        try {
          const embeddingResult = await generateEmbedding(generatedContentText)
          contentEmbedding = embeddingResult.embedding
        } catch (error) {
          console.error('Content embedding for originality check failed:', error)
          contentEmbedding = []
        }

        originalityResult = await checkOriginality(
          generatedContentText,
          referenceContents,
          originalityConfig,
          contentEmbedding
        )

        if (originalityResult.isOriginal) {
          // Success! Store the generation record
          const { data: generationRecord, error: insertError } = await supabase
            .from('cluequest_kb_generations')
            .insert({
              organization_id: organizationId,
              user_id: null, // Would need auth context to set this
              query_text: contextQuery,
              generation_intent: generationType,
              context_parameters: {
                theme,
                context,
                tone,
                target_audience: targetAudience,
                max_length: maxLength,
                creativity_level: creativityLevel
              },
              retrieved_chunks_ids: contextChunks?.map((c: any) => c.id) || [],
              generated_content: generatedContentText,
              content_structure: parsedContent,
              originality_score: originalityResult.overallScore,
              similarity_checks: originalityResult.similarityChecks,
              passed_originality_check: true,
              regeneration_count: attempts - 1,
              ai_provider: 'deepseek',
              model_version: 'deepseek-chat',
              status: 'completed',
              quality_score: Math.min(100, originalityResult.overallScore + 10) // Bonus for creativity
            })
            .select()
            .single()

          if (insertError) {
            console.error('Failed to store generation record:', insertError)
            // Continue anyway, don't fail the request
          }

          finalContent = parsedContent
          break
        }

      } catch (generationError) {
        console.error(`Generation attempt ${attempts} failed:`, generationError)
        
        if (attempts === maxAttempts) {
          return NextResponse.json(
            { 
              error: 'Failed to generate content after multiple attempts',
              details: process.env.NODE_ENV === 'development' ? generationError : undefined
            },
            { status: 500 }
          )
        }
      }
    }

    const totalTime = Date.now() - startTime

    if (!finalContent) {
      return NextResponse.json({
        success: false,
        originality_analysis: originalityResult || {
          is_original: false,
          overall_score: 0,
          similarity_breakdown: [],
          recommendations: ['Unable to generate sufficiently original content. Try adjusting the theme or requirements.']
        },
        generation_info: {
          attempts,
          total_time_ms: totalTime,
          context_sources: referenceContents.length,
          ai_provider: 'deepseek',
          cost_estimate: attempts * 0.05
        },
        error: 'Could not generate sufficiently original content within originality constraints'
      } as GenerationResponse, { status: 409 })
    }

    // Success response
    const response: GenerationResponse = {
      success: true,
      generated_content: {
        title: finalContent.title,
        content: finalContent.content,
        structure: finalContent.structure,
        suggestions: finalContent.suggestions || []
      },
      originality_analysis: {
        is_original: originalityResult.isOriginal,
        overall_score: originalityResult.overallScore,
        similarity_breakdown: originalityResult.similarityChecks,
        recommendations: originalityResult.recommendations
      },
      generation_info: {
        attempts,
        total_time_ms: totalTime,
        context_sources: referenceContents.length,
        ai_provider: 'deepseek',
        cost_estimate: attempts * 0.05
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('KB Generation API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      generation_info: {
        attempts: 0,
        total_time_ms: Date.now() - startTime,
        context_sources: 0,
        ai_provider: 'deepseek',
        cost_estimate: 0
      },
      originality_analysis: {
        is_original: false,
        overall_score: 0,
        similarity_breakdown: [],
        recommendations: []
      }
    } as GenerationResponse, { status: 500 })
  }
}

function buildGenerationPrompt(
  theme: string,
  context: string,
  generationType: string,
  tone: string,
  targetAudience: string,
  maxLength: number,
  creativityLevel: number
): string {
  const basePrompt = `Create completely original ${generationType} content with these specifications:

THEME: ${theme}
CONTEXT: ${context}
TONE: ${tone}
TARGET AUDIENCE: ${targetAudience}
MAX LENGTH: ${maxLength} characters
CREATIVITY LEVEL: ${creativityLevel * 100}% (higher = more unique and creative)

CRITICAL REQUIREMENTS:
1. Create 100% original content - no copying from any source
2. Use completely unique examples, names, and scenarios
3. Avoid any direct quotes or recognizable phrases
4. Make it engaging and appropriate for ${targetAudience}
5. Maintain ${tone} tone throughout
6. Stay within ${maxLength} character limit

RESPONSE FORMAT (JSON):
{
  "title": "Compelling and unique title",
  "content": "Main content body - original and engaging",
  "structure": {
    "type": "${generationType}",
    "sections": ["section1", "section2"],
    "key_elements": ["element1", "element2"]
  },
  "suggestions": ["Optional implementation tip 1", "Optional tip 2"]
}`

  return basePrompt
}

// GET endpoint for status and examples
export async function GET() {
  return NextResponse.json({
    service: 'ClueQuest Knowledge Base Content Generation',
    status: 'online',
    version: '1.0.0',
    features: [
      'rag_powered_generation',
      'originality_guarantee',
      'multi_attempt_optimization',
      'context_aware_creation',
      'enterprise_compliance'
    ],
    generation_types: [
      'story',
      'puzzle_mechanics',
      'team_building',
      'educational',
      'general'
    ],
    originality_controls: {
      max_similarity_threshold: '0.82 (configurable per organization)',
      jaccard_threshold: '0.18 (phrase overlap detection)',
      min_originality_score: '75/100 (configurable)',
      source_leakage_detection: 'enabled',
      multi_attempt_optimization: 'up to 4 attempts'
    },
    rate_limits: {
      requests_per_10_minutes: 5,
      max_content_length: 5000,
      max_attempts_per_generation: 4
    },
    example_request: {
      theme: 'Corporate Team Building',
      context: 'Indoor office environment, 1 hour duration, 8 participants',
      generation_type: 'team_building',
      tone: 'professional',
      target_audience: 'professionals',
      creativity_level: 0.8
    }
  })
}