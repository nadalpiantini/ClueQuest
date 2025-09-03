import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Story generation prompts by theme and tone
const STORY_TEMPLATES = {
  mystery: {
    adventurous: "Create a thrilling mystery adventure where participants must solve clues and uncover secrets. Include unexpected twists, challenging puzzles, and collaborative elements that build suspense and excitement.",
    corporate: "Design a professional mystery scenario perfect for team building. Focus on problem-solving, communication, and collaboration while maintaining a business-appropriate tone with engaging challenges.",
    educational: "Develop an educational mystery that teaches while entertaining. Incorporate learning objectives seamlessly into the investigation, making complex concepts accessible through engaging storytelling.",
  },
  fantasy: {
    adventurous: "Craft an epic fantasy quest filled with magical creatures, ancient mysteries, and heroic challenges. Include elements of courage, friendship, and discovery in a richly imagined world.",
    educational: "Create a fantasy adventure that teaches history, literature, or science through magical storytelling. Make learning feel like an enchanted journey of discovery.",
    corporate: "Design a fantasy-themed team building experience that uses mythical elements to promote collaboration, leadership, and creative problem-solving in a professional context.",
  },
  corporate: {
    professional: "Develop a sophisticated corporate challenge that enhances team dynamics, improves communication, and builds trust. Focus on real-world business scenarios and practical skill development.",
    competitive: "Create an engaging corporate competition that motivates teams through friendly rivalry while achieving learning objectives and strengthening workplace relationships.",
    innovative: "Design a forward-thinking corporate experience that encourages creative thinking, innovation, and outside-the-box problem solving in a business context.",
  },
  educational: {
    engaging: "Create an educational adventure that makes learning irresistibly fun. Use interactive elements, discovery-based challenges, and collaborative problem-solving to reinforce key concepts.",
    inspiring: "Develop an educational story that motivates learners and builds confidence. Include moments of achievement, discovery, and personal growth throughout the journey.",
    comprehensive: "Design a thorough educational experience that covers learning objectives systematically while maintaining high engagement through varied activities and challenges.",
  },
}

// Quality level configurations
const QUALITY_CONFIGS = {
  draft: {
    max_tokens: 800,
    temperature: 0.8,
    model: 'gpt-3.5-turbo',
  },
  standard: {
    max_tokens: 1500,
    temperature: 0.7,
    model: 'gpt-4',
  },
  premium: {
    max_tokens: 2500,
    temperature: 0.6,
    model: 'gpt-4',
  },
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
    if (!adventure_data?.title || !generation_prompt) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Get user and organization
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's organization
    const { data: orgMember } = await supabase
      .from('cluequest_organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (!orgMember) {
      return NextResponse.json(
        { success: false, error: 'No organization found' },
        { status: 400 }
      )
    }

    // Create story generation request
    const { data: generation, error: dbError } = await supabase
      .from('cluequest_ai_story_generations')
      .insert({
        adventure_id: adventure_data.id || null, // May be null for new adventures
        user_id: user.id,
        organization_id: orgMember.organization_id,
        component_type,
        generation_prompt,
        user_preferences: {
          story_tone,
          target_audience,
          quality_level,
        },
        adventure_theme: adventure_data.theme || 'mystery',
        target_audience,
        story_tone,
        difficulty_level: adventure_data.difficulty || 'intermediate',
        estimated_duration: adventure_data.duration || 60,
        max_participants: adventure_data.maxPlayers || 10,
        quality_level,
        ai_provider: 'openai',
        model_version: QUALITY_CONFIGS[quality_level as keyof typeof QUALITY_CONFIGS].model,
        status: 'pending',
      })
      .select('id')
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { success: false, error: 'Failed to create generation request' },
        { status: 500 }
      )
    }

    // Start background story generation
    generateStoryInBackground(generation.id, {
      adventure_data,
      generation_prompt,
      story_tone,
      target_audience,
      quality_level,
    })

    return NextResponse.json({
      success: true,
      generation_id: generation.id,
      message: 'Story generation started',
    })

  } catch (error) {
    console.error('Story generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Background story generation function
async function generateStoryInBackground(
  generationId: string,
  params: {
    adventure_data: any
    generation_prompt: string
    story_tone: string
    target_audience: string
    quality_level: string
  }
) {
  const supabase = createClient()
  const startTime = Date.now()

  try {
    // Update status to generating
    await supabase
      .from('cluequest_ai_story_generations')
      .update({ status: 'generating' })
      .eq('id', generationId)

    // Get quality configuration
    const config = QUALITY_CONFIGS[params.quality_level as keyof typeof QUALITY_CONFIGS]

    // Build comprehensive prompt
    const systemPrompt = buildSystemPrompt(params)
    const userPrompt = buildUserPrompt(params)

    // Generate story with OpenAI
    const completion = await openai.chat.completions.create({
      model: config.model,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      max_tokens: config.max_tokens,
      temperature: config.temperature,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    })

    const generatedContent = completion.choices[0]?.message?.content

    if (!generatedContent) {
      throw new Error('No content generated')
    }

    // Parse structured content if possible
    const contentStructure = parseStoryStructure(generatedContent)

    // Calculate metrics
    const contentLength = generatedContent.length
    const readabilityScore = calculateReadabilityScore(generatedContent)
    const engagementScore = calculateEngagementScore(generatedContent, params)
    const generationTime = Math.round((Date.now() - startTime) / 1000)

    // Calculate cost estimate (rough approximation)
    const tokensUsed = completion.usage?.total_tokens || 0
    const estimatedCost = (tokensUsed / 1000) * 0.03 // Rough estimate for GPT-4

    // Update database with results
    const { error: updateError } = await supabase
      .from('cluequest_ai_story_generations')
      .update({
        generated_content: generatedContent,
        content_structure: contentStructure,
        content_length: contentLength,
        readability_score: readabilityScore,
        engagement_score: engagementScore,
        generation_time_seconds: generationTime,
        generation_cost: estimatedCost,
        tokens_used: tokensUsed,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', generationId)

    if (updateError) {
      console.error('Error updating generation:', updateError)
      await supabase
        .from('cluequest_ai_story_generations')
        .update({ 
          status: 'failed',
          error_message: 'Failed to save results',
        })
        .eq('id', generationId)
    }

  } catch (error) {
    console.error('Background generation error:', error)
    
    await supabase
      .from('cluequest_ai_story_generations')
      .update({ 
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })
      .eq('id', generationId)
  }
}

function buildSystemPrompt(params: any): string {
  const { target_audience, story_tone } = params

  return `You are an expert adventure story creator for interactive experiences. Your task is to create engaging, immersive narratives for team-based adventures.

GUIDELINES:
- Target Audience: ${target_audience}
- Story Tone: ${story_tone}
- Create stories that promote collaboration and engagement
- Include clear setup, challenges, and satisfying resolution
- Make the story adaptable for different group sizes
- Ensure content is appropriate and inclusive
- Focus on creating memorable moments and experiences

STRUCTURE YOUR RESPONSE WITH:
1. **Opening Scene** - Set the stage and hook participants
2. **Main Narrative** - The core story with challenges and plot development
3. **Climax & Resolution** - Exciting conclusion that brings everything together
4. **Suggested Challenges** - 3-5 specific activity ideas that fit the story
5. **Character Roles** (if applicable) - Brief descriptions of participant roles

Keep the story engaging, collaborative, and perfectly suited for the specified parameters.`
}

function buildUserPrompt(params: any): string {
  const { adventure_data, generation_prompt } = params

  return `Create an adventure story with these specifications:

**Adventure Details:**
- Title: ${adventure_data.title}
- Theme: ${adventure_data.theme}
- Duration: ${adventure_data.duration} minutes
- Max Participants: ${adventure_data.maxPlayers}
- Type: ${adventure_data.adventureType}

**Story Requirements:**
${generation_prompt}

Please create a compelling, complete adventure narrative that participants will remember long after the experience ends. Make it interactive, engaging, and perfectly suited for the specified group size and duration.`
}

function parseStoryStructure(content: string): any {
  // Simple structure parsing - could be enhanced with more sophisticated NLP
  const structure: any = {
    sections: [],
    character_count: content.length,
    estimated_reading_time: Math.ceil(content.length / 200), // Rough WPM estimate
  }

  // Look for structured sections
  const sectionHeaders = [
    'Opening Scene',
    'Main Narrative', 
    'Climax',
    'Resolution',
    'Suggested Challenges',
    'Character Roles'
  ]

  sectionHeaders.forEach(header => {
    const regex = new RegExp(`\\*\\*${header}\\*\\*|${header}:`, 'i')
    if (regex.test(content)) {
      structure.sections.push(header.toLowerCase().replace(' ', '_'))
    }
  })

  return structure
}

function calculateReadabilityScore(content: string): number {
  // Simple readability calculation based on sentence and word complexity
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const words = content.split(/\s+/).filter(w => w.length > 0)
  
  if (sentences.length === 0 || words.length === 0) return 0

  const avgWordsPerSentence = words.length / sentences.length
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length

  // Flesch Reading Ease approximation (simplified)
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * (avgWordLength / 4.7))
  
  // Convert to 0-100 scale where higher is more readable
  return Math.max(0, Math.min(100, Math.round(score)))
}

function calculateEngagementScore(content: string, params: any): number {
  let score = 50 // Base score

  // Check for engaging elements
  const excitementWords = ['adventure', 'mystery', 'discover', 'challenge', 'exciting', 'thrilling', 'amazing', 'incredible']
  const actionWords = ['explore', 'solve', 'find', 'search', 'investigate', 'uncover', 'reveal']
  const collaborationWords = ['team', 'together', 'collaborate', 'cooperate', 'join', 'unite', 'work with']

  excitementWords.forEach(word => {
    if (content.toLowerCase().includes(word)) score += 3
  })

  actionWords.forEach(word => {
    if (content.toLowerCase().includes(word)) score += 2
  })

  collaborationWords.forEach(word => {
    if (content.toLowerCase().includes(word)) score += 4
  })

  // Bonus for questions (interactive elements)
  const questionCount = (content.match(/\?/g) || []).length
  score += questionCount * 2

  // Bonus for dialogue/character interactions
  const dialogueCount = (content.match(/[""]/g) || []).length
  score += Math.min(dialogueCount / 2, 10)

  // Adjust for target audience appropriateness
  if (params.target_audience === 'children' && /simple|fun|exciting/.test(content.toLowerCase())) {
    score += 10
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}