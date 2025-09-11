import { NextRequest, NextResponse } from 'next/server'

interface ThemeGenerationRequest {
  description: string
  style: string
  targetAudience: string
  moodKeywords: string[]
  industryContext?: string
  customRequirements?: string
}

interface GeneratedTheme {
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
  }
  gradients: {
    hero: string
    card: string
    button: string
  }
  fonts: {
    heading: string
    body: string
    accent: string
  }
  imagery: {
    style: string
    suggestions: string[]
  }
  animations: {
    style: string
    duration: string
    easing: string
  }
  category: string
  moodBoard: string[]
}

// Rate limiting for theme generation
const themeGenerationAttempts = new Map<string, { count: number, lastAttempt: number }>()

function checkThemeRateLimit(clientIP: string): boolean {
  const now = Date.now()
  const clientData = themeGenerationAttempts.get(clientIP)
  
  if (!clientData) {
    themeGenerationAttempts.set(clientIP, { count: 1, lastAttempt: now })
    return true
  }
  
  // Reset if more than 1 hour has passed
  if (now - clientData.lastAttempt > 3600000) {
    themeGenerationAttempts.set(clientIP, { count: 1, lastAttempt: now })
    return true
  }
  
  // Allow up to 8 theme generations per hour
  if (clientData.count >= 8) {
    return false
  }
  
  clientData.count++
  clientData.lastAttempt = now
  return true
}

function buildThemePrompt(request: ThemeGenerationRequest): string {
  return `You are an expert UI/UX designer specialized in design systems and visual themes for interactive applications and games.

USER REQUEST:
- Description: "${request.description}"
- Style: "${request.style}"
- Target Audience: "${request.targetAudience}"
- Mood Keywords: ${request.moodKeywords.join(', ')}
${request.industryContext ? `- Industry Context: ${request.industryContext}` : ''}
${request.customRequirements ? `- Special Requirements: ${request.customRequirements}` : ''}

INSTRUCTIONS:
Create a complete and cohesive visual theme that perfectly captures the described essence. The theme must be:
1. Visually attractive and professional
2. Appropriate for interactive adventures/escape rooms
3. Accessible (WCAG AA contrast)
4. Modern and responsive

RESPOND ONLY WITH VALID JSON:

{
  "name": "Descriptive theme name",
  "description": "Brief and attractive description (1-2 sentences)",
  "colors": {
    "primary": "#hexcolor (main color for buttons, links)",
    "secondary": "#hexcolor (secondary color for accents)",
    "accent": "#hexcolor (emphasis and highlight color)",
    "background": "#hexcolor (main dark background)",
    "surface": "#hexcolor (cards and elevated surfaces)",
    "text": "#hexcolor (main text, must contrast well)"
  },
  "gradients": {
    "hero": "linear-gradient(...) for hero sections",
    "card": "linear-gradient(...) for cards",
    "button": "linear-gradient(...) for main buttons"
  },
  "fonts": {
    "heading": "Font for titles (e.g: 'Inter', 'Poppins')",
    "body": "Font for text (e.g: 'Inter', 'Source Sans Pro')",
    "accent": "Decorative font for accents"
  },
  "imagery": {
    "style": "Recommended visual style",
    "suggestions": ["visual element 1", "visual element 2", "visual element 3"]
  },
  "animations": {
    "style": "Animation style (elegant, energetic, subtle)",
    "duration": "Typical duration (e.g: '300ms', '500ms')",
    "easing": "Animation curve (e.g: 'ease-out', 'cubic-bezier(0.4, 0, 0.2, 1)')"
  },
  "category": "Theme category (Fantasy, Corporate, Tech, etc.)",
  "moodBoard": ["keyword 1", "keyword 2", "keyword 3", "keyword 4"]
}

IMPORTANT: 
- All colors in hexadecimal format
- Colors must have good contrast for accessibility
- The theme must be cohesive and professional
- Respond ONLY with valid JSON, no additional text`
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!checkThemeRateLimit(clientIP)) {
      return NextResponse.json(
        { 
          error: 'Theme generation rate limit exceeded. Please try again in 1 hour.',
          retry_after: '3600 seconds'
        },
        { status: 429 }
      )
    }

    const body: ThemeGenerationRequest = await request.json()
    
    const { 
      description, 
      style, 
      targetAudience, 
      moodKeywords,
      industryContext,
      customRequirements
    } = body
    
    // Validate required fields
    if (!description || !style || !targetAudience || !moodKeywords?.length) {
      return NextResponse.json(
        { error: 'Missing required fields: description, style, targetAudience, moodKeywords' },
        { status: 400 }
      )
    }

    // Input sanitization
    const sanitizedDescription = description.slice(0, 300).replace(/[<>]/g, '')
    const sanitizedStyle = style.slice(0, 50).replace(/[<>]/g, '')
    const sanitizedAudience = targetAudience.slice(0, 100).replace(/[<>]/g, '')
    const sanitizedKeywords = moodKeywords.slice(0, 10).map(k => k.slice(0, 50).replace(/[<>]/g, ''))

    // Build the theme generation prompt
    const themePrompt = buildThemePrompt({
      description: sanitizedDescription,
      style: sanitizedStyle,
      targetAudience: sanitizedAudience,
      moodKeywords: sanitizedKeywords,
      industryContext: industryContext?.slice(0, 100).replace(/[<>]/g, ''),
      customRequirements: customRequirements?.slice(0, 300).replace(/[<>]/g, '')
    })

    // Call DeepSeek API for theme generation
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
            content: 'You are an expert UI/UX designer specialized in design systems. You create cohesive and accessible visual themes. ALWAYS respond only with valid JSON.'
          },
          {
            role: 'user',
            content: themePrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7, // Creative but consistent
        top_p: 0.9
      })
    })

    if (!deepSeekResponse.ok) {
      const errorText = await deepSeekResponse.text()
      
      // Return fallback theme
      return NextResponse.json({
        theme: generateFallbackTheme(sanitizedDescription, sanitizedStyle),
        metadata: {
          generated_with: 'fallback_system',
          api_error: 'DeepSeek temporarily unavailable',
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
    let themeData: GeneratedTheme
    try {
      themeData = JSON.parse(aiResponse.trim())
    } catch (parseError) {
      
      // Return fallback theme if parsing fails
      return NextResponse.json({
        theme: generateFallbackTheme(sanitizedDescription, sanitizedStyle),
        metadata: {
          generated_with: 'fallback_system',
          parse_error: 'AI response format invalid',
          generation_time: new Date().toISOString()
        }
      })
    }

    // Validate theme structure
    if (!validateThemeStructure(themeData)) {
      return NextResponse.json({
        theme: generateFallbackTheme(sanitizedDescription, sanitizedStyle),
        metadata: {
          generated_with: 'fallback_system',
          validation_error: 'Generated theme structure invalid',
          generation_time: new Date().toISOString()
        }
      })
    }

    return NextResponse.json({
      theme: themeData,
      metadata: {
        generated_with: 'deepseek_ai',
        generation_time: new Date().toISOString(),
        request_keywords: sanitizedKeywords,
        style_requested: sanitizedStyle,
        audience: sanitizedAudience
      }
    })

  } catch (error) {
    
    return NextResponse.json(
      { 
        error: 'Failed to generate theme',
        message: 'Please try again or contact support if the issue persists'
      },
      { status: 500 }
    )
  }
}

function validateThemeStructure(theme: any): boolean {
  return theme && 
         theme.name && 
         theme.colors && 
         theme.colors.primary && 
         theme.colors.secondary && 
         theme.colors.accent &&
         theme.gradients &&
         theme.fonts &&
         theme.category
}

function generateFallbackTheme(description: string, style: string): GeneratedTheme {
  // Determine fallback colors based on style
  const styleColorMap: Record<string, any> = {
    'dark': { primary: '#8b5cf6', secondary: '#06b6d4', accent: '#f59e0b' },
    'minimalist': { primary: '#6366f1', secondary: '#10b981', accent: '#f59e0b' },
    'vibrant': { primary: '#ec4899', secondary: '#3b82f6', accent: '#10b981' },
    'corporate': { primary: '#0ea5e9', secondary: '#64748b', accent: '#f59e0b' },
    'gaming': { primary: '#8b5cf6', secondary: '#ec4899', accent: '#06b6d4' }
  }

  const colors = styleColorMap[style.toLowerCase()] || styleColorMap['dark']

  return {
    name: `Custom ${style} Theme`,
    description: `A ${style} theme inspired by: ${description}`,
    colors: {
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9'
    },
    gradients: {
      hero: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
      card: `linear-gradient(135deg, ${colors.secondary}10, ${colors.accent}05)`,
      button: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      accent: 'Inter'
    },
    imagery: {
      style: `${style} visual elements`,
      suggestions: ['Custom graphics', 'Themed illustrations', 'Cohesive iconography']
    },
    animations: {
      style: 'smooth',
      duration: '300ms',
      easing: 'ease-out'
    },
    category: 'Custom',
    moodBoard: [description.split(' ')[0] || 'adventure', style, 'interactive', 'engaging']
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'AI Theme Generator Ready',
    model: 'DeepSeek Chat',
    features: [
      'Custom visual theme generation',
      'Complete design system creation',
      'Color palette optimization',
      'Typography recommendations',
      'Animation style suggestions',
      'Accessibility-focused design'
    ],
    rate_limits: {
      requests_per_hour: 8,
      max_description_length: 300
    },
    supported_styles: [
      'dark', 'minimalist', 'vibrant', 'corporate', 
      'gaming', 'elegant', 'futuristic', 'retro'
    ]
  })
}