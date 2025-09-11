/**
 * ClueQuest Knowledge Base Embeddings
 * Handles OpenAI embedding generation with error handling and caching
 */

interface EmbeddingResult {
  embedding: number[]
  tokens_used: number
  model: string
  cost_estimate: number
}

interface EmbeddingCache {
  [key: string]: {
    result: EmbeddingResult
    timestamp: number
    ttl: number
  }
}

// Simple in-memory cache for embeddings (in production, use Redis)
const embeddingCache: EmbeddingCache = {}
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

export async function generateEmbedding(
  text: string,
  options: {
    model?: string
    useCache?: boolean
    maxRetries?: number
  } = {}
): Promise<EmbeddingResult> {
  const {
    model = 'text-embedding-3-small',
    useCache = true,
    maxRetries = 3
  } = options

  // Normalize text for caching
  const normalizedText = text.trim().toLowerCase()
  const cacheKey = `${model}:${normalizedText}`

  // Check cache first
  if (useCache && embeddingCache[cacheKey]) {
    const cached = embeddingCache[cacheKey]
    if (Date.now() - cached.timestamp < cached.ttl) {
      return cached.result
    } else {
      // Remove expired cache entry
      delete embeddingCache[cacheKey]
    }
  }

  // Validate input
  if (!text || text.length === 0) {
    throw new Error('Text input is required for embedding generation')
  }

  if (text.length > 8000) {
    throw new Error('Text input is too long (max 8000 characters)')
  }

  // Check API key
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured')
  }

  let lastError: Error | null = null

  // Retry logic
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          input: text,
          encoding_format: 'float'
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `OpenAI API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`
        )
      }

      const data = await response.json()

      if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
        throw new Error('Invalid response format from OpenAI API')
      }

      const embedding = data.data[0].embedding

      if (!Array.isArray(embedding) || embedding.length === 0) {
        throw new Error('Invalid embedding format received')
      }

      // Calculate usage and cost
      const tokensUsed = data.usage?.total_tokens || Math.ceil(text.length / 4)
      const costEstimate = calculateEmbeddingCost(tokensUsed, model)

      const result: EmbeddingResult = {
        embedding,
        tokens_used: tokensUsed,
        model,
        cost_estimate: costEstimate
      }

      // Cache the result
      if (useCache) {
        embeddingCache[cacheKey] = {
          result,
          timestamp: Date.now(),
          ttl: CACHE_TTL
        }
      }

      return result

    } catch (error) {
      lastError = error as Error
      console.warn(`Embedding generation attempt ${attempt} failed:`, error)

      // Don't retry on certain errors
      if (error instanceof Error) {
        if (error.message.includes('API key') || 
            error.message.includes('quota') ||
            error.message.includes('billing')) {
          throw error
        }
      }

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw new Error(`Embedding generation failed after ${maxRetries} attempts: ${lastError?.message}`)
}

function calculateEmbeddingCost(tokens: number, model: string): number {
  // Pricing as of 2024 (per 1K tokens)
  const pricing: { [key: string]: number } = {
    'text-embedding-3-small': 0.00002,
    'text-embedding-3-large': 0.00013,
    'text-embedding-ada-002': 0.0001
  }

  const pricePer1K = pricing[model] || pricing['text-embedding-3-small']
  return (tokens / 1000) * pricePer1K
}

export async function generateEmbeddingsBatch(
  texts: string[],
  options: {
    model?: string
    batchSize?: number
    useCache?: boolean
  } = {}
): Promise<EmbeddingResult[]> {
  const {
    model = 'text-embedding-3-small',
    batchSize = 100,
    useCache = true
  } = options

  if (texts.length === 0) {
    return []
  }

  if (texts.length > batchSize) {
    // Process in batches
    const results: EmbeddingResult[] = []
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize)
      const batchResults = await generateEmbeddingsBatch(batch, { model, batchSize, useCache })
      results.push(...batchResults)
    }
    return results
  }

  // Check cache for all texts first
  const results: (EmbeddingResult | null)[] = []
  const textsToProcess: { text: string; index: number }[] = []

  for (let i = 0; i < texts.length; i++) {
    const text = texts[i]
    const normalizedText = text.trim().toLowerCase()
    const cacheKey = `${model}:${normalizedText}`

    if (useCache && embeddingCache[cacheKey]) {
      const cached = embeddingCache[cacheKey]
      if (Date.now() - cached.timestamp < cached.ttl) {
        results[i] = cached.result
        continue
      }
    }

    textsToProcess.push({ text, index: i })
    results[i] = null
  }

  // Process uncached texts
  if (textsToProcess.length > 0) {
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          input: textsToProcess.map(item => item.text),
          encoding_format: 'float'
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `OpenAI API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`
        )
      }

      const data = await response.json()

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format from OpenAI API')
      }

      // Map results back to original positions
      for (let i = 0; i < textsToProcess.length; i++) {
        const item = textsToProcess[i]
        const embeddingData = data.data[i]

        if (!embeddingData || !embeddingData.embedding) {
          throw new Error(`Missing embedding for text at index ${item.index}`)
        }

        const tokensUsed = data.usage?.total_tokens ? 
          Math.ceil(data.usage.total_tokens / textsToProcess.length) : 
          Math.ceil(item.text.length / 4)

        const result: EmbeddingResult = {
          embedding: embeddingData.embedding,
          tokens_used: tokensUsed,
          model,
          cost_estimate: calculateEmbeddingCost(tokensUsed, model)
        }

        results[item.index] = result

        // Cache the result
        if (useCache) {
          const normalizedText = item.text.trim().toLowerCase()
          const cacheKey = `${model}:${normalizedText}`
          embeddingCache[cacheKey] = {
            result,
            timestamp: Date.now(),
            ttl: CACHE_TTL
          }
        }
      }

    } catch (error) {
      console.error('Batch embedding generation failed:', error)
      throw error
    }
  }

  return results.filter((result): result is EmbeddingResult => result !== null)
}

// Utility function to clear cache
export function clearEmbeddingCache(): void {
  Object.keys(embeddingCache).forEach(key => delete embeddingCache[key])
}

// Utility function to get cache stats
export function getEmbeddingCacheStats(): {
  size: number
  entries: number
  oldestEntry: number | null
  newestEntry: number | null
} {
  const entries = Object.values(embeddingCache)
  const timestamps = entries.map(entry => entry.timestamp)
  
  return {
    size: JSON.stringify(embeddingCache).length,
    entries: entries.length,
    oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : null,
    newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : null
  }
}