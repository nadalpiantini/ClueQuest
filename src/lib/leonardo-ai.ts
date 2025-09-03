/**
 * Leonardo AI API Client for ClueQuest Avatar Generation
 * Handles image-to-image transformations with character reference
 */

interface LeonardoGenerationRequest {
  height: number
  width: number
  modelId: string
  prompt: string
  presetStyle?: string
  photoReal?: boolean
  photoRealVersion?: string
  alchemy?: boolean
  init_image_id?: string
  init_strength?: number
  controlnets?: Array<{
    initImageId: string
    initImageType: 'UPLOADED' | 'GENERATED'
    preprocessorId: number
    strengthType: 'Low' | 'Mid' | 'High'
  }>
  num_images?: number
}

interface LeonardoGenerationResponse {
  sdGenerationJob: {
    generationId: string
    apiCreditCost: number
  }
}

interface LeonardoUploadResponse {
  uploadInitImage: {
    id: string
    url: string
  }
}

interface LeonardoImageResult {
  url: string
  id: string
  likeCount: number
  generated_image_variation_generics: any[]
}

interface LeonardoGenerationResult {
  generations_by_pk: {
    generated_images: LeonardoImageResult[]
    id: string
    status: 'PENDING' | 'COMPLETE' | 'FAILED'
    createdAt: string
    prompt: string
    modelId: string
  }
}

export class LeonardoAIClient {
  private apiKey: string | undefined
  private baseUrl = 'https://cloud.leonardo.ai/api/rest/v1'

  constructor() {
    this.apiKey = process.env.LEONARDO_AI_API_KEY
  }

  private checkApiKey() {
    if (!this.apiKey) {
      throw new Error('LEONARDO_AI_API_KEY environment variable is required')
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    this.checkApiKey()
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'authorization': `Bearer ${this.apiKey}`,
        'accept': 'application/json',
        'content-type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Leonardo AI API error: ${response.status} - ${errorData}`)
    }

    return response.json()
  }

  /**
   * Upload an image to Leonardo AI for use as reference
   */
  async uploadImage(imageBuffer: Buffer, filename: string): Promise<string> {
    // Get upload URL
    const uploadResponse = await this.makeRequest('/init-image', {
      method: 'POST',
      body: JSON.stringify({
        extension: filename.split('.').pop()?.toLowerCase() || 'jpg'
      })
    })

    const { uploadInitImage } = uploadResponse as LeonardoUploadResponse

    // Upload the actual file
    const formData = new FormData()
    const blob = new Blob([new Uint8Array(imageBuffer)], { type: 'image/jpeg' })
    formData.append('file', blob, filename)

    await fetch(uploadInitImage.url, {
      method: 'POST',
      body: formData,
    })

    return uploadInitImage.id
  }

  /**
   * Generate avatar with role-based character transformation
   */
  async generateAvatar(
    initImageId: string,
    role: string,
    customizations: Record<string, any> = {}
  ): Promise<string> {
    const prompt = this.buildRolePrompt(role, customizations)
    
    const generationRequest: LeonardoGenerationRequest = {
      height: 1024,
      width: 1024,
      modelId: "aa77f04e-3eec-4034-9c07-d0f619684628", // Leonardo Kino XL
      prompt,
      presetStyle: "CINEMATIC",
      photoReal: true,
      photoRealVersion: "v2",
      alchemy: true,
      controlnets: [
        {
          initImageId,
          initImageType: 'UPLOADED',
          preprocessorId: 133, // Character Reference
          strengthType: 'High'
        }
      ],
      num_images: 1
    }

    const response = await this.makeRequest('/generations', {
      method: 'POST',
      body: JSON.stringify(generationRequest)
    })

    const result = response as LeonardoGenerationResponse
    return result.sdGenerationJob.generationId
  }

  /**
   * Check generation status and get result
   */
  async getGenerationResult(generationId: string): Promise<LeonardoImageResult | null> {
    const response = await this.makeRequest(`/generations/${generationId}`)
    const result = response as LeonardoGenerationResult
    
    if (result.generations_by_pk.status === 'COMPLETE') {
      return result.generations_by_pk.generated_images[0] || null
    }
    
    return null
  }

  /**
   * Build role-specific prompts for character transformation
   */
  buildRolePrompt(role: string, customizations: Record<string, any>): string {
    const basePrompts: Record<string, string> = {
      'Leader': 'elegant detective character, noble commanding presence, sophisticated formal attire, intelligent eyes, confident posture, dramatic lighting, photorealistic portrait, high detail, professional',
      
      'Warrior': 'fierce werewolf warrior character, powerful muscular build, battle-ready stance, intense fierce eyes, rugged armor details, epic fantasy lighting, photorealistic portrait, high detail, intimidating',
      
      'Mage': 'mystical vampire sorcerer character, elegant dark robes, arcane symbols, piercing magical eyes, ethereal aura, mysterious shadows, photorealistic portrait, high detail, enchanting',
      
      'Healer': 'luminous fairy healer character, gentle radiant aura, flowing robes, kind compassionate eyes, magical healing energy, soft golden lighting, photorealistic portrait, high detail, serene',
      
      'Scout': 'stealthy ninja explorer character, agile build, tactical gear, sharp observant eyes, ready stance, dynamic shadows, photorealistic portrait, high detail, alert'
    }

    let prompt = basePrompts[role] || basePrompts['Leader']

    // Add customizations
    if (customizations.gender) {
      prompt += `, ${customizations.gender} character`
    }
    
    if (customizations.age_range) {
      const ageMap = {
        'teen': 'youthful teenage',
        'adult': 'mature adult', 
        'senior': 'wise elder'
      }
      prompt += `, ${ageMap[customizations.age_range] || 'adult'} appearance`
    }

    // Add quality and style modifiers
    prompt += ', studio quality, 8K resolution, trending on artstation, masterpiece'

    return prompt
  }

  /**
   * Poll for generation completion with timeout
   */
  async waitForGeneration(generationId: string, maxWaitMs: number = 60000): Promise<LeonardoImageResult> {
    const startTime = Date.now()
    
    while (Date.now() - startTime < maxWaitMs) {
      const result = await this.getGenerationResult(generationId)
      
      if (result) {
        return result
      }
      
      // Wait 2 seconds before next check
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    throw new Error('Generation timeout - please try again')
  }
}

// Export a client instance - API key validation happens at runtime
export const leonardoClient = new LeonardoAIClient()