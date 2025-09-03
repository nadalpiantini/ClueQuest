import { NextRequest, NextResponse } from 'next/server'
import { 
  getFrameworkById, 
  selectOptimalFramework, 
  generateFrameworkPrompt,
  validateStoryStructure,
  enhanceForCorporateContext,
  enhanceForMysteryContext,
  enhanceForEducationalContext
} from '@/lib/frameworks/story-frameworks'

interface StoryGenerationRequest {
  theme: string
  tone: string
  targetAudience: string
  duration: number
  maxPlayers: number
  framework?: string
  specificElements?: string[]
  customRequirements?: string
}

// Rate limiting for story generation (more expensive than titles)
const storyGenerationAttempts = new Map<string, { count: number, lastAttempt: number }>()

function checkStoryRateLimit(clientIP: string): boolean {
  const now = Date.now()
  const clientData = storyGenerationAttempts.get(clientIP)
  
  if (!clientData) {
    storyGenerationAttempts.set(clientIP, { count: 1, lastAttempt: now })
    return true
  }
  
  // Reset if more than 2 hours have passed
  if (now - clientData.lastAttempt > 7200000) {
    storyGenerationAttempts.set(clientIP, { count: 1, lastAttempt: now })
    return true
  }
  
  // Allow up to 3 story generations per 2 hours (more conservative)
  if (clientData.count >= 3) {
    return false
  }
  
  clientData.count++
  clientData.lastAttempt = now
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!checkStoryRateLimit(clientIP)) {
      return NextResponse.json(
        { 
          error: 'Story generation rate limit exceeded. Please try again in 2 hours.',
          retry_after: '7200 seconds'
        },
        { status: 429 }
      )
    }

    const body: StoryGenerationRequest = await request.json()
    
    const { 
      theme, 
      tone, 
      targetAudience, 
      duration, 
      maxPlayers, 
      framework,
      specificElements = [],
      customRequirements = ''
    } = body
    
    // Validate required fields
    if (!theme || !tone || !targetAudience) {
      return NextResponse.json(
        { error: 'Missing required fields: theme, tone, targetAudience' },
        { status: 400 }
      )
    }

    // Validate duration range
    if (duration < 15 || duration > 180) {
      return NextResponse.json(
        { error: 'Duration must be between 15 and 180 minutes' },
        { status: 400 }
      )
    }

    // Input sanitization
    const sanitizedTheme = theme.slice(0, 100).replace(/[<>]/g, '')
    const sanitizedTone = tone.slice(0, 50).replace(/[<>]/g, '')
    const sanitizedAudience = targetAudience.slice(0, 50).replace(/[<>]/g, '')
    const sanitizedElements = specificElements.slice(0, 10).map(e => e.slice(0, 100).replace(/[<>]/g, ''))

    // Select or get specified framework
    const selectedFramework = framework 
      ? getFrameworkById(framework)
      : selectOptimalFramework(sanitizedTheme, sanitizedAudience, duration, sanitizedElements)

    if (!selectedFramework) {
      return NextResponse.json(
        { error: 'Invalid framework specified or unable to select appropriate framework' },
        { status: 400 }
      )
    }

    // Generate framework-based prompt
    let narrativePrompt = generateFrameworkPrompt(selectedFramework, {
      theme: sanitizedTheme,
      tone: sanitizedTone,
      targetAudience: sanitizedAudience,
      duration,
      maxPlayers,
      specificElements: sanitizedElements
    })

    // Enhance prompt based on context
    if (sanitizedAudience.includes('corporate') || sanitizedAudience.includes('professional')) {
      narrativePrompt = enhanceForCorporateContext(narrativePrompt)
    } else if (sanitizedTheme.includes('mystery') || sanitizedTheme.includes('detective')) {
      narrativePrompt = enhanceForMysteryContext(narrativePrompt)
    } else if (sanitizedAudience.includes('student') || sanitizedAudience.includes('educational')) {
      narrativePrompt = enhanceForEducationalContext(narrativePrompt, sanitizedTheme)
    }

    // Add custom requirements
    if (customRequirements.trim()) {
      narrativePrompt += `\n\nADDITIONAL REQUIREMENTS:\n${customRequirements.slice(0, 500)}`
    }

    // Call DeepSeek API for story generation
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
            content: 'You are a master storyteller and interactive adventure designer with expertise in Joseph Campbell\'s Hero\'s Journey, escape room design, corporate learning, and educational game design. You create engaging, structured narratives that balance entertainment with meaningful objectives. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: narrativePrompt
          }
        ],
        max_tokens: 3000, // More tokens for full story structure
        temperature: 0.75, // Slightly more creative for stories
        top_p: 0.9
      })
    })

    if (!deepSeekResponse.ok) {
      const errorText = await deepSeekResponse.text()
      console.error('DeepSeek API error:', deepSeekResponse.status, errorText)
      
      // Return fallback story structure
      return NextResponse.json({
        story: generateFallbackStory(selectedFramework, {
          theme: sanitizedTheme,
          tone: sanitizedTone,
          targetAudience: sanitizedAudience,
          duration,
          maxPlayers
        }),
        framework: selectedFramework,
        metadata: {
          generated_with: 'fallback_system',
          api_error: 'DeepSeek temporarily unavailable',
          framework_used: selectedFramework.id,
          generation_time: new Date().toISOString()
        }
      })
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
      console.error('Failed to parse DeepSeek response:', parseError)
      console.error('Raw response:', aiResponse)
      
      // Return fallback if parsing fails
      return NextResponse.json({
        story: generateFallbackStory(selectedFramework, {
          theme: sanitizedTheme,
          tone: sanitizedTone,
          targetAudience: sanitizedAudience,
          duration,
          maxPlayers
        }),
        framework: selectedFramework,
        metadata: {
          generated_with: 'fallback_system',
          parse_error: 'AI response format invalid',
          framework_used: selectedFramework.id,
          generation_time: new Date().toISOString()
        }
      })
    }

    // Validate story structure
    const validation = validateStoryStructure(storyStructure, selectedFramework)
    
    // Add quality metrics
    const qualityScore = Math.min(100, validation.score + (storyStructure.narrative_quality_score || 80))

    return NextResponse.json({
      story: storyStructure,
      framework: selectedFramework,
      validation: validation,
      metadata: {
        generated_with: 'deepseek_ai',
        framework_used: selectedFramework.id,
        quality_score: qualityScore,
        generation_time: new Date().toISOString(),
        estimated_cost: 0.05, // Estimate for DeepSeek usage
        content_rating: 'family_friendly',
        target_audience: sanitizedAudience,
        duration_minutes: duration
      }
    })

  } catch (error) {
    console.error('Story generation error:', error)
    
    // Return minimal fallback story
    return NextResponse.json(
      { 
        error: 'Failed to generate story structure',
        fallback_available: true,
        message: 'Please try again or contact support if the issue persists'
      },
      { status: 500 }
    )
  }
}

// Fallback story generator using templates
function generateFallbackStory(framework: any, config: any) {
  return {
    framework_used: framework.id,
    total_estimated_duration: config.duration,
    acts: framework.acts.map((act: any, index: number) => ({
      act_number: index + 1,
      title: act.title,
      narrative_text: `${act.description} - This section will be customized for your ${config.theme} themed adventure with ${config.tone} tone, designed for ${config.targetAudience}.`,
      player_instructions: act.player_objectives,
      branching_choices: act.branching_opportunities?.map((choice: string) => ({
        text: choice,
        leads_to: `Consequence of choosing: ${choice}`
      })) || [],
      duration_minutes: act.duration_minutes,
      success_criteria: [`Complete ${act.title.toLowerCase()} objectives`, 'Maintain team engagement', 'Progress story forward']
    })),
    overall_theme: config.theme,
    difficulty_progression: 'beginner_to_intermediate',
    team_coordination_required: true,
    narrative_quality_score: 75
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'AI Story Generator Ready',
    model: 'DeepSeek Chat',
    frameworks_available: [
      'hero_journey',
      'mystery_structure', 
      'corporate_challenge',
      'educational_adventure'
    ],
    features: [
      'Professional narrative frameworks',
      'Context-aware story generation',
      'Quality validation',
      'Multiple audience support',
      'Fallback story templates'
    ],
    rate_limits: {
      requests_per_2_hours: 3,
      max_duration_minutes: 180
    }
  })
}