import { NextRequest, NextResponse } from 'next/server'

interface TitleGenerationRequest {
  audience: string
  tone: string
  elements: string[]
  adventureType: string
  duration: number
  maxPlayers: number
  theme: string
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const body: TitleGenerationRequest = await request.json()
    
    const { audience, tone, elements, adventureType, duration, maxPlayers, theme } = body
    
    // Validate required fields
    if (!audience || !tone || !theme) {
      return NextResponse.json(
        { error: 'Missing required fields: audience, tone, theme' },
        { status: 400 }
      )
    }

    // Input sanitization
    const sanitizedAudience = audience.slice(0, 50).replace(/[<>]/g, '')
    const sanitizedTone = tone.slice(0, 50).replace(/[<>]/g, '')
    const sanitizedTheme = theme.slice(0, 50).replace(/[<>]/g, '')
    const sanitizedElements = (elements || []).slice(0, 5).map(e => e.slice(0, 100).replace(/[<>]/g, ''))

    // Construct AI prompt based on onboarding data
    const prompt = `Generate 6 creative adventure titles for a ${sanitizedTheme} ${adventureType} experience.

Context:
- Audience: ${sanitizedAudience}
- Tone: ${sanitizedTone}
- Duration: ${duration} minutes
- Max Players: ${maxPlayers}
- Specific Elements: ${sanitizedElements.join(', ') || 'None specified'}

Requirements:
- Titles should be engaging and memorable
- Match the ${tone} tone perfectly
- Appropriate for ${audience}
- Suggest variety in style (short/long, descriptive/mysterious)
- Consider the ${duration}-minute timeframe
- Make titles that would excite ${maxPlayers} people

Return ONLY a JSON array of title objects with this exact structure:
[
  {
    "title": "The Corporate Code Conspiracy",
    "style": "Professional Mystery",
    "reasoning": "Combines corporate setting with intrigue"
  }
]

No additional text, just the JSON array.`

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
            content: 'You are a creative adventure title generator. You understand different audiences, tones, and contexts. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.8,
        top_p: 0.9
      })
    })

    if (!deepSeekResponse.ok) {
      console.error('DeepSeek API error:', deepSeekResponse.status)
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 503 }
      )
    }

    const deepSeekData = await deepSeekResponse.json()
    const aiResponse = deepSeekData.choices[0]?.message?.content

    if (!aiResponse) {
      return NextResponse.json(
        { error: 'No response from AI service' },
        { status: 503 }
      )
    }

    // Parse AI response
    let titleSuggestions
    try {
      titleSuggestions = JSON.parse(aiResponse.trim())
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      return NextResponse.json(
        { error: 'Invalid AI response format' },
        { status: 503 }
      )
    }

    // Validate and sanitize suggestions
    const validatedTitles = titleSuggestions
      .filter((suggestion: any) => 
        suggestion.title && 
        suggestion.style && 
        suggestion.reasoning &&
        suggestion.title.length <= 100
      )
      .slice(0, 6) // Limit to 6 suggestions

    return NextResponse.json({
      titles: validatedTitles,
      metadata: {
        audience,
        tone,
        theme,
        generatedAt: new Date().toISOString(),
        elementsUsed: elements
      }
    })

  } catch (error) {
    console.error('Title generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate titles' },
      { status: 500 }
    )
  }
}

// Rate limiting check (basic implementation)
const titleGenerationAttempts = new Map<string, { count: number, lastAttempt: number }>()

function checkRateLimit(clientIP: string): boolean {
  const now = Date.now()
  const clientData = titleGenerationAttempts.get(clientIP)
  
  if (!clientData) {
    titleGenerationAttempts.set(clientIP, { count: 1, lastAttempt: now })
    return true
  }
  
  // Reset if more than 1 hour has passed
  if (now - clientData.lastAttempt > 3600000) {
    titleGenerationAttempts.set(clientIP, { count: 1, lastAttempt: now })
    return true
  }
  
  // Allow up to 10 requests per hour
  if (clientData.count >= 10) {
    return false
  }
  
  clientData.count++
  clientData.lastAttempt = now
  return true
}

export async function GET() {
  return NextResponse.json({ 
    status: 'AI Title Generator Ready',
    model: 'DeepSeek Chat',
    features: ['Creative titles', 'Context-aware', 'Multi-style generation']
  })
}