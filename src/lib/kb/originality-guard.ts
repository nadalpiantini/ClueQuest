/**
 * ClueQuest Originality Guard System
 * Advanced anti-plagiarism protection with multiple similarity metrics
 * Integrated with ClueQuest's AI generation pipeline
 */
// @ts-nocheck

import natural from 'natural'

// Initialize tokenizer once for performance
const tokenizer = new natural.WordTokenizer()

/**
 * Configuration for originality checking
 */
export interface OriginalityConfig {
  maxCosineSimilarity: number      // 0.0 - 1.0 (lower = more strict)
  maxJaccardSimilarity: number     // 0.0 - 1.0 (lower = more strict)
  minOriginalityScore: number      // 0 - 100 (higher = more strict)
  blockSourceDisclosure: boolean   // Block URLs, citations, etc.
  enableSemanticChecks: boolean    // Enable advanced semantic analysis
}

/**
 * Default configuration - conservative settings for production
 */
export const DEFAULT_ORIGINALITY_CONFIG: OriginalityConfig = {
  maxCosineSimilarity: 0.82,
  maxJaccardSimilarity: 0.18,
  minOriginalityScore: 75,
  blockSourceDisclosure: true,
  enableSemanticChecks: true
}

/**
 * Result of originality analysis
 */
export interface OriginalityResult {
  isOriginal: boolean
  overallScore: number              // 0-100 (higher = more original)
  cosineSimilarity: number          // Highest cosine similarity found
  jaccardSimilarity: number         // Highest Jaccard similarity found
  sourceLeakageDetected: boolean    // Whether source info was detected
  similarityBreakdown: SimilarityCheck[]
  recommendations: string[]         // Suggestions for improvement
}

/**
 * Individual similarity check result
 */
export interface SimilarityCheck {
  referenceId: string
  referenceTitle?: string
  cosineSimilarity: number
  jaccardSimilarity: number
  overlappingPhrases: string[]
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
}

/**
 * Reference content for comparison
 */
export interface ReferenceContent {
  id: string
  title?: string
  content: string
  embedding?: number[]              // Pre-computed embedding if available
  category?: string
}

/**
 * Calculate Jaccard similarity using 5-gram analysis
 * More robust than simple word overlap for detecting paraphrasing
 */
export function calculateJaccard5Gram(textA: string, textB: string): number {
  const generateNGrams = (text: string, n: number = 5): Set<string> => {
    const words = tokenizer.tokenize(text.toLowerCase()) || []
    const grams = new Set<string>()
    
    for (let i = 0; i <= words.length - n; i++) {
      grams.add(words.slice(i, i + n).join(' '))
    }
    
    return grams
  }

  const gramsA = generateNGrams(textA)
  const gramsB = generateNGrams(textB)
  
  const intersection = new Set([...gramsA].filter(x => gramsB.has(x)))
  const union = new Set([...gramsA, ...gramsB])
  
  return union.size > 0 ? intersection.size / union.size : 0
}

/**
 * Calculate cosine similarity between two embedding vectors
 */
export function calculateCosineSimilarity(embeddingA: number[], embeddingB: number[]): number {
  if (embeddingA.length !== embeddingB.length) {
    throw new Error('Embedding vectors must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < embeddingA.length; i++) {
    dotProduct += embeddingA[i] * embeddingB[i]
    normA += embeddingA[i] * embeddingA[i]
    normB += embeddingB[i] * embeddingB[i]
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB)
  return denominator === 0 ? 0 : dotProduct / denominator
}

/**
 * Detect potential source leakage (URLs, citations, references)
 */
export function detectSourceLeakage(text: string): boolean {
  const leakagePatterns = [
    // URLs and web references
    /https?:\/\/[^\s]+/i,
    /www\.[^\s]+/i,
    
    // Academic/publication references
    /scribd|academia\.edu|researchgate/i,
    /(chapter|cap[ií]tulo)\s+\d+/i,
    /(page|p[áa]gina)\s+\d+/i,
    /pp\.\s*\d+/i,
    
    // Citation patterns
    /according to|seg[uú]n|fuente:|source:/i,
    /\(.*\d{4}.*\)/,  // Years in parentheses
    /et al\./i,
    /ibid\.|op\. cit\./i,
    
    // Document references
    /documento|document|anexo|appendix/i,
    /figura \d+|figure \d+/i,
    /tabla \d+|table \d+/i,
    
    // Direct quotes indicators
    /"[^"]{50,}"/,     // Long quoted passages
    /textualmente|literally|quote/i
  ]

  return leakagePatterns.some(pattern => pattern.test(text))
}

/**
 * Advanced semantic similarity using natural language processing
 */
export function calculateSemanticSimilarity(textA: string, textB: string): number {
  // Clean and prepare texts
  const cleanA = textA.toLowerCase().replace(/[^\w\s]/g, ' ').trim()
  const cleanB = textB.toLowerCase().replace(/[^\w\s]/g, ' ').trim()
  
  const wordsA = tokenizer.tokenize(cleanA) || []
  const wordsB = tokenizer.tokenize(cleanB) || []
  
  if (wordsA.length === 0 || wordsB.length === 0) return 0
  
  // Calculate TF-IDF similarity (simplified)
  const allWords = new Set([...wordsA, ...wordsB])
  const vectorA: number[] = []
  const vectorB: number[] = []
  
  allWords.forEach(word => {
    const tfA = wordsA.filter(w => w === word).length / wordsA.length
    const tfB = wordsB.filter(w => w === word).length / wordsB.length
    
    vectorA.push(tfA)
    vectorB.push(tfB)
  })
  
  return calculateCosineSimilarity(vectorA, vectorB)
}

/**
 * Identify overlapping phrases between two texts
 */
export function findOverlappingPhrases(textA: string, textB: string, minLength: number = 4): string[] {
  const wordsA = tokenizer.tokenize(textA.toLowerCase()) || []
  const wordsB = tokenizer.tokenize(textB.toLowerCase()) || []
  
  const overlaps: string[] = []
  
  // Find common phrases of different lengths
  for (let len = minLength; len <= Math.min(8, wordsA.length, wordsB.length); len++) {
    for (let i = 0; i <= wordsA.length - len; i++) {
      const phraseA = wordsA.slice(i, i + len).join(' ')
      
      for (let j = 0; j <= wordsB.length - len; j++) {
        const phraseB = wordsB.slice(j, j + len).join(' ')
        
        if (phraseA === phraseB && phraseA.length > 15) {
          overlaps.push(phraseA)
        }
      }
    }
  }
  
  // Remove duplicates and sort by length (longest first)
  return [...new Set(overlaps)].sort((a, b) => b.length - a.length).slice(0, 5)
}

/**
 * Classify risk level based on similarity scores
 */
export function classifyRiskLevel(cosineSim: number, jaccardSim: number): 'low' | 'medium' | 'high' | 'critical' {
  if (cosineSim > 0.9 || jaccardSim > 0.3) return 'critical'
  if (cosineSim > 0.8 || jaccardSim > 0.2) return 'high'
  if (cosineSim > 0.6 || jaccardSim > 0.1) return 'medium'
  return 'low'
}

/**
 * Comprehensive originality check against multiple reference sources
 */
export async function checkOriginality(
  generatedText: string,
  referenceContents: ReferenceContent[],
  config: OriginalityConfig = DEFAULT_ORIGINALITY_CONFIG,
  generatedEmbedding?: number[]
): Promise<OriginalityResult> {
  
  const similarityChecks: SimilarityCheck[] = []
  let maxCosineSimilarity = 0
  let maxJaccardSimilarity = 0
  
  // Check against each reference
  for (const reference of referenceContents) {
    let cosineSim = 0
    
    // Calculate cosine similarity if embeddings are available
    if (generatedEmbedding && reference.embedding) {
      cosineSim = calculateCosineSimilarity(generatedEmbedding, reference.embedding)
    } else if (config.enableSemanticChecks) {
      // Fallback to semantic similarity
      cosineSim = calculateSemanticSimilarity(generatedText, reference.content)
    }
    
    // Calculate Jaccard similarity
    const jaccardSim = calculateJaccard5Gram(generatedText, reference.content)
    
    // Find overlapping phrases
    const overlappingPhrases = findOverlappingPhrases(generatedText, reference.content)
    
    // Classify risk level
    const riskLevel = classifyRiskLevel(cosineSim, jaccardSim)
    
    similarityChecks.push({
      referenceId: reference.id,
      referenceTitle: reference.title,
      cosineSimilarity: cosineSim,
      jaccardSimilarity: jaccardSim,
      overlappingPhrases,
      riskLevel
    })
    
    maxCosineSimilarity = Math.max(maxCosineSimilarity, cosineSim)
    maxJaccardSimilarity = Math.max(maxJaccardSimilarity, jaccardSim)
  }
  
  // Check for source leakage
  const sourceLeakageDetected = config.blockSourceDisclosure && detectSourceLeakage(generatedText)
  
  // Calculate overall originality score
  const cosineScore = Math.max(0, (1 - maxCosineSimilarity) * 100)
  const jaccardScore = Math.max(0, (1 - maxJaccardSimilarity) * 100)
  const leakageScore = sourceLeakageDetected ? 0 : 20
  
  const overallScore = Math.round(
    (cosineScore * 0.4) + 
    (jaccardScore * 0.4) + 
    (leakageScore * 0.2)
  )
  
  // Determine if content passes originality check
  const passesCosineThreashold = maxCosineSimilarity <= config.maxCosineSimilarity
  const passesJaccardThreshold = maxJaccardSimilarity <= config.maxJaccardSimilarity
  const passesScoreThreshold = overallScore >= config.minOriginalityScore
  const passesLeakageCheck = !sourceLeakageDetected
  
  const isOriginal = passesCosineThreashold && 
                    passesJaccardThreshold && 
                    passesScoreThreshold && 
                    passesLeakageCheck
  
  // Generate recommendations
  const recommendations: string[] = []
  if (!passesCosineThreashold) {
    recommendations.push('Content is too semantically similar to reference material. Try rephrasing key concepts.')
  }
  if (!passesJaccardThreshold) {
    recommendations.push('Text contains too many similar phrases. Use different wording and sentence structures.')
  }
  if (sourceLeakageDetected) {
    recommendations.push('Remove references, URLs, or citations. Content should be standalone.')
  }
  if (!passesScoreThreshold) {
    recommendations.push('Increase creativity and originality. Add unique perspectives or examples.')
  }
  
  return {
    isOriginal,
    overallScore,
    cosineSimilarity: maxCosineSimilarity,
    jaccardSimilarity: maxJaccardSimilarity,
    sourceLeakageDetected,
    similarityChecks: similarityChecks as any,
    recommendations
  }
}

/**
 * Generate improvement suggestions based on originality analysis
 */
export function generateImprovementPrompt(result: OriginalityResult, originalPrompt: string): string {
  if (result.isOriginal) {
    return originalPrompt // No changes needed
  }
  
  let improvementInstructions = originalPrompt + '\n\nIMPORTANT ORIGINALITY REQUIREMENTS:\n'
  
  if (result.cosineSimilarity > 0.8) {
    improvementInstructions += '- Use completely different concepts, metaphors, and examples\n'
    improvementInstructions += '- Avoid similar semantic meanings and themes\n'
  }
  
  if (result.jaccardSimilarity > 0.15) {
    improvementInstructions += '- Use entirely different sentence structures and phrasings\n'
    improvementInstructions += '- Avoid repeating word combinations from reference material\n'
  }
  
  if (result.sourceLeakageDetected) {
    improvementInstructions += '- Do not include any URLs, citations, or references\n'
    improvementInstructions += '- Create standalone content without attribution\n'
  }
  
  improvementInstructions += '- Be more creative and add unique personal touches\n'
  improvementInstructions += '- Focus on original storytelling and fresh perspectives\n'
  
  return improvementInstructions
}

/**
 * Utility function to create embeddings using OpenAI API
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured')
  }
  
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text.slice(0, 8000) // Limit text length for API
    })
  })
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data.data[0].embedding
}