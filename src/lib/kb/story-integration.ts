/**
 * ClueQuest Knowledge Base + Story Generation Integration
 * Enhances AI story generation with KB context while ensuring originality
 */

import { createClient } from '@supabase/supabase-js'
import { generateEmbedding } from '@/lib/kb/embeddings'
import { checkOriginality, type ReferenceContent, DEFAULT_ORIGINALITY_CONFIG } from '@/lib/kb/originality-guard'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Configuration for KB-enhanced story generation
 */
export interface KBStoryConfig {
  useKBContext: boolean           // Whether to use KB for inspiration
  organizationId?: string         // Organization for KB filtering
  maxContextChunks: number        // Max number of KB chunks to use
  contextRelevanceThreshold: number // Minimum similarity for context
  originalityChecks: boolean      // Enable originality validation
  maxRegenerationAttempts: number // Max attempts to achieve originality
}

export const DEFAULT_KB_STORY_CONFIG: KBStoryConfig = {
  useKBContext: true,
  maxContextChunks: 6,
  contextRelevanceThreshold: 0.6,
  originalityChecks: true,
  maxRegenerationAttempts: 3
}

/**
 * Enhanced story generation request
 */
export interface EnhancedStoryRequest {
  theme: string
  tone: string
  targetAudience: string
  duration: number
  maxPlayers: number
  framework?: string
  specificElements?: string[]
  customRequirements?: string
  kbConfig?: Partial<KBStoryConfig>
}

/**
 * KB-enhanced story generation result
 */
export interface EnhancedStoryResult {
  story: any                     // Generated story structure
  framework: any                 // Framework used
  metadata: {
    generated_with: string
    framework_used: string
    generation_time: string
    kb_context_used: boolean
    context_sources: number
    originality_verified: boolean
    originality_score?: number
    attempts_made: number
  }
  context_info?: {
    sources_consulted: string[]
    relevance_scores: number[]
    total_context_length: number
  }
  originality_analysis?: {
    is_original: boolean
    overall_score: number
    recommendations: string[]
  }
}

/**
 * Retrieve relevant context from knowledge base for story generation
 */
export async function getStoryContext(
  theme: string,
  tone: string,
  targetAudience: string,
  specificElements: string[] = [],
  config: KBStoryConfig
): Promise<{
  contextChunks: any[]
  referenceContents: ReferenceContent[]
  contextSummary: string
}> {
  
  if (!config.useKBContext) {
    return {
      contextChunks: [],
      referenceContents: [],
      contextSummary: ''
    }
  }

  try {
    // Build context query
    const contextQuery = [
      theme,
      tone,
      targetAudience,
      ...specificElements
    ].filter(Boolean).join(' ')

    // Generate embedding for context search
    const embeddingResult = await generateEmbedding(contextQuery)
    const queryEmbedding = embeddingResult.embedding

    // Search knowledge base
    const { data: contextChunks, error: searchError } = await supabase
      .rpc('match_kb_chunks_safe', {
        query_embedding: queryEmbedding,
        organization_id_param: config.organizationId,
        match_count: config.maxContextChunks,
        similarity_threshold: config.contextRelevanceThreshold
      })

    if (searchError || !contextChunks) {
      console.warn('KB context search failed:', searchError)
      return {
        contextChunks: [],
        referenceContents: [],
        contextSummary: ''
      }
    }

    // Convert to reference content format
    const referenceContents: ReferenceContent[] = contextChunks.map((chunk: any) => ({
      id: chunk.id,
      title: chunk.source_title,
      content: chunk.content,
      category: chunk.source_category
    }))

    // Create context summary (inspiration material)
    const contextSummary = contextChunks
      .map((chunk: any, index: number) => 
        `Context ${index + 1} (${chunk.source_category}): ${chunk.content.slice(0, 400)}...`
      )
      .join('\n\n---\n\n')

    return {
      contextChunks,
      referenceContents,
      contextSummary
    }

  } catch (error) {
    console.error('Failed to retrieve story context:', error)
    return {
      contextChunks: [],
      referenceContents: [],
      contextSummary: ''
    }
  }
}

/**
 * Enhance story generation prompt with KB context
 */
export function enhancePromptWithContext(
  originalPrompt: string,
  contextSummary: string,
  originalityMode: boolean = true
): string {
  
  if (!contextSummary.trim()) {
    return originalPrompt
  }

  const enhancedPrompt = `${originalPrompt}

CONTEXTUAL INSPIRATION (FOR REFERENCE ONLY):
The following content is provided as loose inspiration. Your task is to create completely original content that may draw thematic inspiration but must NOT copy, paraphrase, or closely follow any of this material:

${contextSummary}

${originalityMode ? `
CRITICAL ORIGINALITY REQUIREMENTS:
1. Create 100% original content - no direct copying or close paraphrasing
2. Use completely different examples, names, and specific details
3. If inspired by themes, express them in entirely new ways
4. Avoid any recognizable phrases or sentence structures from the reference material
5. Create unique storylines that feel fresh and original
6. Focus on your own creative interpretation rather than following reference patterns

` : ''}
Your response must be entirely original while potentially drawing broad thematic inspiration from the context provided.`

  return enhancedPrompt
}

/**
 * Generate story with KB integration and originality checks
 */
export async function generateKBEnhancedStory(
  request: EnhancedStoryRequest,
  frameworks: {
    getFrameworkById: Function
    selectOptimalFramework: Function
    generateFrameworkPrompt: Function
    validateStoryStructure: Function
  }
): Promise<EnhancedStoryResult> {
  
  const startTime = Date.now()
  const config = { ...DEFAULT_KB_STORY_CONFIG, ...request.kbConfig }
  
  try {
    // Step 1: Get KB context if enabled
    const { contextChunks, referenceContents, contextSummary } = await getStoryContext(
      request.theme,
      request.tone,
      request.targetAudience,
      request.specificElements,
      config
    )

    // Step 2: Select framework (existing logic)
    const selectedFramework = request.framework 
      ? frameworks.getFrameworkById(request.framework)
      : frameworks.selectOptimalFramework(
          request.theme, 
          request.targetAudience, 
          request.duration, 
          request.specificElements || []
        )

    if (!selectedFramework) {
      throw new Error('Invalid or no suitable framework found')
    }

    // Step 3: Generate enhanced prompt
    let narrativePrompt = frameworks.generateFrameworkPrompt(selectedFramework, {
      theme: request.theme,
      tone: request.tone,
      targetAudience: request.targetAudience,
      duration: request.duration,
      maxPlayers: request.maxPlayers,
      specificElements: request.specificElements || []
    })

    // Enhance with KB context
    narrativePrompt = enhancePromptWithContext(
      narrativePrompt,
      contextSummary,
      config.originalityChecks
    )

    // Add custom requirements
    if (request.customRequirements?.trim()) {
      narrativePrompt += `\n\nADDITIONAL REQUIREMENTS:\n${request.customRequirements.slice(0, 500)}`
    }

    // Step 4: Generate story with multiple attempts for originality
    let attempts = 0
    let finalStory: any = null
    let originalityResult: any = null

    while (attempts < config.maxRegenerationAttempts && !finalStory) {
      attempts++

      // Adjust creativity based on attempt number
      const temperature = 0.75 + (attempts - 1) * 0.05

      try {
        // Call DeepSeek API
        const deepSeekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
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
                content: 'You are a master storyteller and interactive adventure designer with expertise in creating completely original content. You create engaging, structured narratives that are entirely unique and original. Always respond with valid JSON only.'
              },
              {
                role: 'user',
                content: narrativePrompt
              }
            ],
            max_tokens: 3000,
            temperature,
            top_p: 0.9
          })
        })

        if (!deepSeekResponse.ok) {
          throw new Error(`DeepSeek API error: ${deepSeekResponse.statusText}`)
        }

        const deepSeekData = await deepSeekResponse.json()
        const aiResponse = deepSeekData.choices[0]?.message?.content

        if (!aiResponse) {
          throw new Error('No response from DeepSeek API')
        }

        // Parse AI response
        let storyStructure
        try {
          storyStructure = JSON.parse(aiResponse.trim())
        } catch (parseError) {
          throw new Error('Invalid JSON response from AI')
        }

        // Step 5: Check originality if enabled and we have reference content
        if (config.originalityChecks && referenceContents.length > 0) {
          
          const storyText = JSON.stringify(storyStructure)
          
          // Generate embedding for originality check
          let contentEmbedding: number[] = []
          try {
            const embeddingResult = await generateEmbedding(storyText)
            contentEmbedding = embeddingResult.embedding
          } catch (error) {
            console.warn('Failed to generate embedding for originality check:', error)
          }

          // Get organization's originality policy
          let originalityConfig = { ...DEFAULT_ORIGINALITY_CONFIG }
          if (config.organizationId) {
            const { data: policyData } = await supabase
              .from('cluequest_kb_policies')
              .select('*')
              .eq('organization_id', config.organizationId)
              .eq('is_active', true)
              .single()
            
            if (policyData) {
              originalityConfig.maxCosineSimilarity = policyData.max_similarity_threshold || 0.82
              originalityConfig.maxJaccardSimilarity = policyData.max_jaccard_threshold || 0.18
              originalityConfig.minOriginalityScore = policyData.min_originality_score || 75
            }
          }

          originalityResult = await checkOriginality(
            storyText,
            referenceContents,
            originalityConfig,
            contentEmbedding
          )

          if (!originalityResult.isOriginal && attempts < config.maxRegenerationAttempts) {
            // Enhance prompt for next attempt
            narrativePrompt = enhancePromptWithContext(
              narrativePrompt + `\n\nIMPORTANT: Previous attempt was too similar to reference material. Be even more creative and original in your approach. Use completely different concepts, examples, and narrative structures.`,
              contextSummary,
              true
            )
            continue // Try again
          }
        }

        // Validate story structure (existing logic)
        const validation = frameworks.validateStoryStructure(storyStructure, selectedFramework)
        
        finalStory = storyStructure
        break

      } catch (generationError) {
        console.error(`Story generation attempt ${attempts} failed:`, generationError)
        
        if (attempts === config.maxRegenerationAttempts) {
          // Return fallback if all attempts failed
          finalStory = generateFallbackStory(selectedFramework, request)
          break
        }
      }
    }

    // Step 6: Store generation record if using KB
    if (config.useKBContext && finalStory) {
      try {
        await supabase
          .from('cluequest_kb_generations')
          .insert({
            organization_id: config.organizationId,
            query_text: `${request.theme} ${request.tone} ${request.targetAudience}`,
            generation_intent: 'story_inspiration',
            context_parameters: {
              theme: request.theme,
              tone: request.tone,
              target_audience: request.targetAudience,
              duration: request.duration,
              framework: selectedFramework.id
            },
            retrieved_chunks_ids: contextChunks.map((c: any) => c.id),
            generated_content: JSON.stringify(finalStory),
            content_structure: finalStory,
            originality_score: originalityResult?.overallScore || null,
            similarity_checks: originalityResult?.similarityChecks || [],
            passed_originality_check: originalityResult?.isOriginal !== false,
            regeneration_count: attempts - 1,
            ai_provider: 'deepseek',
            model_version: 'deepseek-chat',
            status: 'completed'
          })
      } catch (insertError) {
        console.warn('Failed to store KB generation record:', insertError)
      }
    }

    // Build response
    const result: EnhancedStoryResult = {
      story: finalStory,
      framework: selectedFramework,
      metadata: {
        generated_with: config.useKBContext ? 'kb_enhanced_ai' : 'standard_ai',
        framework_used: selectedFramework.id,
        generation_time: new Date().toISOString(),
        kb_context_used: config.useKBContext && contextChunks.length > 0,
        context_sources: contextChunks.length,
        originality_verified: config.originalityChecks && originalityResult !== null,
        originality_score: originalityResult?.overallScore,
        attempts_made: attempts
      }
    }

    if (config.useKBContext && contextChunks.length > 0) {
      result.context_info = {
        sources_consulted: contextChunks.map((c: any) => c.source_title),
        relevance_scores: contextChunks.map((c: any) => c.similarity),
        total_context_length: contextSummary.length
      }
    }

    if (originalityResult) {
      result.originality_analysis = {
        is_original: originalityResult.isOriginal,
        overall_score: originalityResult.overallScore,
        recommendations: originalityResult.recommendations
      }
    }

    return result

  } catch (error) {
    console.error('KB-enhanced story generation failed:', error)
    
    // Return fallback
    return {
      story: generateFallbackStory(
        { id: 'basic', title: 'Basic Story', acts: [] },
        request
      ),
      framework: { id: 'basic', title: 'Basic Story' },
      metadata: {
        generated_with: 'fallback_system',
        framework_used: 'basic',
        generation_time: new Date().toISOString(),
        kb_context_used: false,
        context_sources: 0,
        originality_verified: false,
        attempts_made: 1
      }
    }
  }
}

/**
 * Generate fallback story (simplified version)
 */
function generateFallbackStory(framework: any, request: EnhancedStoryRequest): any {
  return {
    framework_used: framework.id,
    total_estimated_duration: request.duration,
    acts: [
      {
        act_number: 1,
        title: 'Introduction',
        narrative_text: `Welcome to your ${request.theme} adventure! This experience is designed for ${request.targetAudience} with a ${request.tone} atmosphere.`,
        player_instructions: 'Gather your team and prepare for an engaging experience.',
        duration_minutes: Math.floor(request.duration / 3)
      },
      {
        act_number: 2,
        title: 'Main Challenge',
        narrative_text: 'Work together to overcome the central challenge and discover the secrets within.',
        player_instructions: 'Collaborate, communicate, and think creatively to progress.',
        duration_minutes: Math.floor(request.duration * 0.6)
      },
      {
        act_number: 3,
        title: 'Resolution',
        narrative_text: 'Bring together everything you\'ve learned to reach the triumphant conclusion.',
        player_instructions: 'Apply your discoveries to achieve victory!',
        duration_minutes: Math.ceil(request.duration * 0.1)
      }
    ],
    overall_theme: request.theme,
    difficulty_progression: 'beginner_to_intermediate',
    team_coordination_required: true,
    narrative_quality_score: 70
  }
}