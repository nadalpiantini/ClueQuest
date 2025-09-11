/**
 * Runware.ai Client for Adventure Image Generation
 * Implements ClueQuest's style bible for consistent image generation
 */

export interface ThemeConfig {
  id: string
  palette: string[]
  content: string
  seed: number
  name: string
}

export const THEME_CONFIGS: Record<string, ThemeConfig> = {
  mystery: {
    id: 'mystery',
    palette: ['#2B1B12', '#3B2417', '#C8772A', '#5A3A22'],
    content: 'classic detective in fedora and trench coat studying clue with magnifying glass, cork board with pinned notes in background, warm amber night ambience, streetlamp glow',
    seed: 222,
    name: 'Detective Caper'
  },
  hacker: {
    id: 'hacker',
    palette: ['#0C1D24', '#0E2D33', '#1BA7A0', '#0E6F6A'],
    content: 'hooded figure at desk with laptop, dual monitors with abstract code blocks and padlock icon, teal glow, dark room, soft rim light on hoodie',
    seed: 111,
    name: 'Hacker Operation'
  },
  fantasy: {
    id: 'fantasy',
    palette: ['#0E3B2F', '#1D5C4B', '#2D8B6F', '#E0D48A'],
    content: 'serene elf profile walking through mystical forest, moon and tiny fairy silhouettes, oversized mushrooms, fireflies, layered forest depth',
    seed: 333,
    name: 'Enchanted Forest'
  },
  corporate: {
    id: 'corporate',
    palette: ['#1A4D4A', '#2C6D66', '#E4B468', '#F0D6A8'],
    content: 'four professionals collaborating around giant puzzle pieces on table, big window with city shapes, tablets/laptop as simple shapes, dynamic gestures',
    seed: 444,
    name: 'Corporate Challenge'
  },
  educational: {
    id: 'educational',
    palette: ['#1C5A4F', '#2E7A6C', '#A6CF9B', '#2B5E59'],
    content: 'teacher with open book pointing to chalkboard on easel showing icons (globe, beaker, lightbulb, puzzle piece), three students taking notes, forest backdrop',
    seed: 555,
    name: 'Educational Adventure'
  }
}

export interface RunwareGenerationOptions {
  themeId?: string
  customContent?: string
  customPalette?: string[]
  seed?: number
  width?: number
  height?: number
  steps?: number
  guidance?: number
}

export class RunwareClient {
  private readonly apiKey: string
  private readonly baseUrl: string

  constructor() {
    this.apiKey = 'N1ePhmFRa0aWiTxxWNdzuPu9grZhhV8s'
    this.baseUrl = 'https://api.runware.ai/v1'
  }

  /**
   * Generate master prompt following ClueQuest's style bible
   */
  private generateMasterPrompt(content: string, themeId?: string): string {
    const themePalette = themeId ? THEME_CONFIGS[themeId]?.palette.join(', ') : 'limited coherent palette'
    
    return `Estilo: flat illustration, clean shapes, soft big shadows, subtle paper grain, cinematic lighting, no text.
Color: limited palette coherent with ${themePalette}. Use square 1:1 composition, mid-shot subject, simple background shapes.

Scene: ${content}

Quality cues: cohesive color grading, gentle vignette, soft rim light, no gradients banding, no noise artifacts.

Hard constraints: square format, no letters, no words, no watermarks, no UI, no logos.`
  }

  /**
   * Generate negative prompt
   */
  private getNegativePrompt(): string {
    return 'text, letters, words, watermark, logo, UI elements, photorealism, 3D render, anime, extra fingers, distorted faces, jpeg artifacts, oversharpen, moiré'
  }

  /**
   * Generate adventure image using Runware API
   */
  async generateAdventureImage(options: RunwareGenerationOptions): Promise<{
    success: boolean
    imageUrl?: string
    error?: string
  }> {
    try {
      const {
        themeId,
        customContent,
        customPalette,
        seed,
        width = 768,
        height = 768,
        steps = 30,
        guidance = 7
      } = options

      // Determine content and seed
      let content = customContent
      let finalSeed = seed

      if (themeId && THEME_CONFIGS[themeId]) {
        const themeConfig = THEME_CONFIGS[themeId]
        content = content || themeConfig.content
        finalSeed = finalSeed || themeConfig.seed
      }

      if (!content) {
        throw new Error('Content is required for image generation')
      }

      const prompt = this.generateMasterPrompt(content, themeId)
      const negativePrompt = this.getNegativePrompt()

      const payload = {
        taskType: 'imageInference',
        taskUUID: crypto.randomUUID(),
        model: 'runware:101@1', // FLUX.1 [pro] model
        positivePrompt: prompt,
        negativePrompt: negativePrompt,
        width,
        height,
        steps,
        guidance,
        sampler: 'DPM++ 2M Karras',
        seed: finalSeed || 123456789,
        safety_checker: true
      }

      console.log('🎨 Generating image with payload:', {
        ...payload,
        prompt: prompt.substring(0, 100) + '...'
      })

      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([payload])
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('❌ Runware API error:', errorData)
        throw new Error(`API error: ${response.status} - ${errorData}`)
      }

      const result = await response.json()
      console.log('✅ Runware API response:', JSON.stringify(result, null, 2))

      // Handle different response formats from Runware API
      if (result.success && result.data && result.data.length > 0) {
        const imageData = result.data[0]
        const imageUrl = imageData.url || imageData.image_url || imageData.imageUrl
        if (imageUrl) {
          return {
            success: true,
            imageUrl: imageUrl
          }
        }
      }

      // Check for direct image URL in response
      if (result.imageUrl || result.image_url || result.url) {
        return {
          success: true,
          imageUrl: result.imageUrl || result.image_url || result.url
        }
      }

      // Check for errors in response
      if (result.errors && result.errors.length > 0) {
        return {
          success: false,
          error: result.errors[0].message || 'API error'
        }
      }

      return {
        success: false,
        error: result.error || 'Unknown generation error - no image URL found in response'
      }

    } catch (error) {
      console.error('❌ Error generating image:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Generate filename following ClueQuest convention
   */
  generateFilename(themeId: string, seed: number, size: number = 768): string {
    const timestamp = Date.now()
    return `theme_${themeId}_${seed}_${size}_${timestamp}.png`
  }

  /**
   * Get theme configuration
   */
  getThemeConfig(themeId: string): ThemeConfig | null {
    return THEME_CONFIGS[themeId] || null
  }

  /**
   * Get all available themes
   */
  getAllThemes(): ThemeConfig[] {
    return Object.values(THEME_CONFIGS)
  }
}