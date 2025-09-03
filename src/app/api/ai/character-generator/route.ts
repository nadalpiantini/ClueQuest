import { NextRequest, NextResponse } from 'next/server'

interface CharacterGenerationRequest {
  userMessage: string
  conversationHistory: Array<{
    id: string
    type: 'user' | 'ai'
    content: string
    timestamp: Date
  }>
  theme?: string
  existingRoles?: string[]
}

interface GeneratedCharacter {
  name: string
  emoji: string
  description: string
  perks: string[]
  color: string
  maxPlayers: number
  category: string
  backstory?: string
  personality?: string
  motivation?: string
}

// Rate limiting for character generation
const characterGenerationAttempts = new Map<string, { count: number, lastAttempt: number }>()

function checkCharacterRateLimit(clientIP: string): boolean {
  const now = Date.now()
  const clientData = characterGenerationAttempts.get(clientIP)
  
  if (!clientData) {
    characterGenerationAttempts.set(clientIP, { count: 1, lastAttempt: now })
    return true
  }
  
  // Reset if more than 1 hour has passed
  if (now - clientData.lastAttempt > 3600000) {
    characterGenerationAttempts.set(clientIP, { count: 1, lastAttempt: now })
    return true
  }
  
  // Allow up to 10 character generations per hour
  if (clientData.count >= 10) {
    return false
  }
  
  clientData.count++
  clientData.lastAttempt = now
  return true
}

function buildCharacterPrompt(userMessage: string, theme: string, existingRoles: string[], conversationHistory: any[]): string {
  const contextualInfo = theme ? `La aventura tiene temática: ${theme}` : 'Aventura de tema libre'
  const existingRolesInfo = existingRoles.length > 0 
    ? `Roles ya existentes: ${existingRoles.join(', ')}` 
    : 'No hay roles previos'

  return `Eres un diseñador de personajes experto para aventuras interactivas y escape rooms. Tu trabajo es ayudar a crear personajes únicos, balanceados y atractivos.

CONTEXTO:
- ${contextualInfo}
- ${existingRolesInfo}
- Conversación previa: ${conversationHistory.slice(-3).map(msg => `${msg.type}: ${msg.content}`).join('\n')}

SOLICITUD DEL USUARIO: "${userMessage}"

INSTRUCCIONES:
1. Si el usuario está explorando ideas, haz preguntas para entender mejor lo que quiere
2. Si el usuario ha dado suficiente información, genera un personaje completo
3. Asegúrate de que el personaje sea único y no repetir roles existentes
4. El personaje debe ser apropiado para la temática seleccionada
5. Siempre responde en español de manera conversacional y amigable

FORMATO DE RESPUESTA:
- Si necesitas más información: Responde con preguntas específicas y sugerencias
- Si puedes generar el personaje: Responde explicando el personaje creado + JSON del personaje

EJEMPLO DE JSON PARA PERSONAJE COMPLETO:
{
  "character": {
    "name": "Nombre del Personaje",
    "emoji": "🎭",
    "description": "Descripción breve y atractiva",
    "perks": ["Habilidad 1", "Habilidad 2", "Habilidad 3"],
    "color": "purple",
    "maxPlayers": 2,
    "category": "Fantasy",
    "backstory": "Historia personal del personaje",
    "personality": "Rasgos de personalidad",
    "motivation": "¿Qué lo motiva?"
  }
}

COLORES DISPONIBLES: red, blue, green, yellow, purple, pink, indigo, cyan, emerald, amber, orange, lime, violet, sky, slate, zinc, teal, gray

Responde de manera natural y colaborativa, como si fueras un diseñador experto ayudando a crear el personaje perfecto.`
}

function detectCharacterInPrompt(aiResponse: string): GeneratedCharacter | null {
  try {
    // Look for JSON in the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*"character"[\s\S]*\}/)
    if (!jsonMatch) return null

    const jsonData = JSON.parse(jsonMatch[0])
    return jsonData.character || null
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!checkCharacterRateLimit(clientIP)) {
      return NextResponse.json(
        { 
          error: 'Character generation rate limit exceeded. Please try again in 1 hour.',
          retry_after: '3600 seconds'
        },
        { status: 429 }
      )
    }

    const body: CharacterGenerationRequest = await request.json()
    
    const { 
      userMessage, 
      conversationHistory = [],
      theme = '', 
      existingRoles = []
    } = body
    
    // Validate required fields
    if (!userMessage || userMessage.trim().length === 0) {
      return NextResponse.json(
        { error: 'User message is required' },
        { status: 400 }
      )
    }

    // Input sanitization
    const sanitizedMessage = userMessage.slice(0, 500).replace(/[<>]/g, '')
    const sanitizedTheme = theme.slice(0, 100).replace(/[<>]/g, '')

    // Build the conversation prompt
    const characterPrompt = buildCharacterPrompt(
      sanitizedMessage, 
      sanitizedTheme, 
      existingRoles,
      conversationHistory
    )

    // Call DeepSeek API for character generation
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
            content: 'Eres un diseñador de personajes experto para juegos y aventuras interactivas. Creas personajes únicos, balanceados y atractivos. Siempre respondes en español de manera amigable y conversacional.'
          },
          {
            role: 'user',
            content: characterPrompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.8, // More creative for character design
        top_p: 0.9
      })
    })

    if (!deepSeekResponse.ok) {
      const errorText = await deepSeekResponse.text()
      console.error('DeepSeek API error:', deepSeekResponse.status, errorText)
      
      return NextResponse.json({
        response: 'Lo siento, hay un problema temporal con la generación de personajes. ¿Podrías describir más detalles sobre el tipo de personaje que quieres? Por ejemplo: ¿debería ser más enfocado en combate, magia, investigación o apoyo al equipo?',
        character: null,
        metadata: {
          generated_with: 'fallback_response',
          error: 'API temporarily unavailable'
        }
      })
    }

    const deepSeekData = await deepSeekResponse.json()
    const aiResponse = deepSeekData.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from DeepSeek API')
    }

    // Try to extract character data if present
    const generatedCharacter = detectCharacterInPrompt(aiResponse)

    // Clean up the response text (remove JSON if present)
    let cleanResponse = aiResponse
    if (generatedCharacter) {
      cleanResponse = aiResponse.replace(/\{[\s\S]*"character"[\s\S]*\}/g, '').trim()
    }

    return NextResponse.json({
      response: cleanResponse || '¡Excelente! He creado tu personaje personalizado. ¿Qué te parece?',
      character: generatedCharacter,
      metadata: {
        generated_with: 'deepseek_ai',
        generation_time: new Date().toISOString(),
        theme_used: sanitizedTheme,
        existing_roles_count: existingRoles.length
      }
    })

  } catch (error) {
    console.error('Character generation error:', error)
    
    return NextResponse.json(
      { 
        response: 'Disculpa, hubo un problema técnico. ¿Podrías intentar de nuevo? Mientras tanto, puedo ayudarte con ideas para tu personaje si me das más detalles sobre lo que buscas.',
        character: null,
        error: 'Failed to generate character'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'AI Character Generator Ready',
    model: 'DeepSeek Chat',
    features: [
      'Interactive character design chat',
      'Theme-aware character generation',
      'Unique role creation',
      'Conversational development process',
      'Spanish language support'
    ],
    rate_limits: {
      requests_per_hour: 10,
      max_message_length: 500
    },
    supported_categories: [
      'Fantasy', 'Combat', 'Mystery', 'Academic', 
      'Tech', 'Corporate', 'Creative', 'Adventure', 
      'Mystical', 'Historical', 'Modern', 'Support'
    ]
  })
}