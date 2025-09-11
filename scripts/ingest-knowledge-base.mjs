#!/usr/bin/env node

/**
 * ClueQuest Knowledge Base Document Ingestion Script
 * Processes PDFs and documents into the ClueQuest KB with embeddings
 * Integrated with ClueQuest's architecture and security model
 */

import fs from 'fs'
import path from 'path'
import pdf from 'pdf-parse'
import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(level, message) {
  const timestamp = new Date().toISOString()
  const colorMap = {
    info: colors.cyan,
    success: colors.green,
    warning: colors.yellow,
    error: colors.red,
    progress: colors.blue
  }
  
  console.log(`${colorMap[level] || colors.reset}[${timestamp}] ${level.toUpperCase()}: ${message}${colors.reset}`)
}

// Configuration
const CONFIG = {
  MAX_CHUNK_SIZE: 3000,
  CHUNK_OVERLAP: 300,
  MIN_CHUNK_SIZE: 100,
  MAX_FILE_SIZE_MB: 50,
  SUPPORTED_EXTENSIONS: ['.pdf'],
  BATCH_SIZE: 10, // Process embeddings in batches
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000
}

// Initialize Supabase client
function initializeSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !serviceRoleKey) {
    throw new Error('Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.')
  }
  
  return createClient(url, serviceRoleKey)
}

// Initialize OpenAI for embeddings
function validateOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OpenAI configuration. Please set OPENAI_API_KEY environment variable.')
  }
}

/**
 * Generate embeddings using OpenAI API
 */
async function generateEmbedding(text, retryCount = 0) {
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text.slice(0, 8000) // Limit text length
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    
    if (!data.data?.[0]?.embedding) {
      throw new Error('Invalid response from OpenAI API')
    }

    return {
      embedding: data.data[0].embedding,
      tokens_used: data.usage?.total_tokens || 0
    }

  } catch (error) {
    if (retryCount < CONFIG.RETRY_ATTEMPTS) {
      log('warning', `Embedding generation failed, retrying (${retryCount + 1}/${CONFIG.RETRY_ATTEMPTS}): ${error.message}`)
      await sleep(CONFIG.RETRY_DELAY * (retryCount + 1))
      return generateEmbedding(text, retryCount + 1)
    }
    
    throw new Error(`Failed to generate embedding after ${CONFIG.RETRY_ATTEMPTS} attempts: ${error.message}`)
  }
}

/**
 * Sleep utility
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Chunk text into smaller segments with overlap
 */
function chunkText(text, maxChars = CONFIG.MAX_CHUNK_SIZE, overlap = CONFIG.CHUNK_OVERLAP) {
  if (!text || text.length < CONFIG.MIN_CHUNK_SIZE) {
    return []
  }

  const chunks = []
  let start = 0

  while (start < text.length) {
    let end = Math.min(start + maxChars, text.length)
    
    // Try to break at sentence boundaries
    if (end < text.length) {
      const lastSentence = text.lastIndexOf('.', end)
      const lastParagraph = text.lastIndexOf('\n\n', end)
      const breakPoint = Math.max(lastSentence, lastParagraph)
      
      if (breakPoint > start + maxChars * 0.7) {
        end = breakPoint + 1
      }
    }
    
    const chunk = text.slice(start, end).trim()
    
    if (chunk.length >= CONFIG.MIN_CHUNK_SIZE) {
      chunks.push(chunk)
    }
    
    // Calculate next start position with overlap
    start = Math.max(start + maxChars - overlap, end - overlap)
    
    if (start >= text.length) break
  }

  return chunks
}

/**
 * Extract text from PDF
 */
async function extractPDFText(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath)
    const data = await pdf(dataBuffer)
    
    if (!data.text || data.text.trim().length < CONFIG.MIN_CHUNK_SIZE) {
      throw new Error('PDF contains no extractable text or text is too short')
    }
    
    // Clean and normalize text
    const cleanText = data.text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s{2,}/g, ' ')
      .trim()
    
    return {
      text: cleanText,
      metadata: {
        pages: data.numpages,
        info: data.info || {}
      }
    }
    
  } catch (error) {
    throw new Error(`Failed to extract PDF text: ${error.message}`)
  }
}

/**
 * Create source record in database
 */
async function createSourceRecord(supabase, {
  organizationId = null,
  userId = null,
  title,
  description = '',
  filePath,
  contentCategory = 'general',
  isPublic = false,
  licenseType = 'internal',
  licenseNote = '',
  fileStats,
  pdfMetadata
}) {
  
  const sourceData = {
    organization_id: organizationId,
    user_id: userId,
    title: title.slice(0, 200),
    description: description.slice(0, 1000),
    source_type: 'pdf',
    source_url: null,
    file_path: filePath,
    file_size_bytes: fileStats.size,
    page_count: pdfMetadata.pages,
    language: 'en', // Could be auto-detected
    content_category: contentCategory,
    processing_status: 'processing',
    extraction_method: 'pdf_parse',
    is_active: true,
    is_public: isPublic,
    license_type: licenseType,
    license_note: licenseNote
  }

  const { data, error } = await supabase
    .from('cluequest_kb_sources')
    .insert(sourceData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create source record: ${error.message}`)
  }

  return data
}

/**
 * Process chunks and generate embeddings in batches
 */
async function processChunks(supabase, sourceId, chunks) {
  let processedChunks = 0
  let totalTokensUsed = 0
  const batchSize = CONFIG.BATCH_SIZE
  
  log('info', `Processing ${chunks.length} chunks in batches of ${batchSize}`)

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize)
    const batchPromises = []

    for (let j = 0; j < batch.length; j++) {
      const chunkIndex = i + j
      const chunk = batch[j]
      
      batchPromises.push(
        generateEmbedding(chunk).then(async ({ embedding, tokens_used }) => {
          totalTokensUsed += tokens_used
          
          const { error } = await supabase
            .from('cluequest_kb_chunks')
            .insert({
              source_id: sourceId,
              chunk_index: chunkIndex,
              content: chunk,
              content_length: chunk.length,
              word_count: chunk.split(/\s+/).length,
              embedding: embedding,
              chunk_type: 'content'
            })

          if (error) {
            throw new Error(`Failed to insert chunk ${chunkIndex}: ${error.message}`)
          }

          processedChunks++
          
          if (processedChunks % 5 === 0 || processedChunks === chunks.length) {
            log('progress', `Processed ${processedChunks}/${chunks.length} chunks (${Math.round(processedChunks / chunks.length * 100)}%)`)
          }
          
          return chunkIndex
        })
      )
    }

    // Wait for batch to complete
    try {
      await Promise.all(batchPromises)
      log('info', `Completed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)}`)
    } catch (error) {
      log('error', `Batch processing failed: ${error.message}`)
      throw error
    }

    // Small delay between batches to avoid rate limiting
    if (i + batchSize < chunks.length) {
      await sleep(1000)
    }
  }

  return { processedChunks, totalTokensUsed }
}

/**
 * Update source record with completion status
 */
async function completeSourceRecord(supabase, sourceId, chunkCount) {
  const { error } = await supabase
    .from('cluequest_kb_sources')
    .update({
      processing_status: 'completed',
      total_chunks: chunkCount,
      processed_at: new Date().toISOString()
    })
    .eq('id', sourceId)

  if (error) {
    throw new Error(`Failed to update source record: ${error.message}`)
  }
}

/**
 * Main ingestion function
 */
async function ingestDocument({
  filePath,
  title,
  description = '',
  contentCategory = 'general',
  organizationId = null,
  userId = null,
  isPublic = false,
  licenseType = 'internal',
  licenseNote = ''
}) {
  
  const startTime = Date.now()
  
  try {
    log('info', `Starting ingestion of: ${filePath}`)
    
    // Validate file
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`)
    }

    const fileStats = fs.statSync(filePath)
    if (fileStats.size > CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024) {
      throw new Error(`File too large: ${fileStats.size / 1024 / 1024:.1f}MB (max: ${CONFIG.MAX_FILE_SIZE_MB}MB)`)
    }

    const fileExt = path.extname(filePath).toLowerCase()
    if (!CONFIG.SUPPORTED_EXTENSIONS.includes(fileExt)) {
      throw new Error(`Unsupported file type: ${fileExt}. Supported: ${CONFIG.SUPPORTED_EXTENSIONS.join(', ')}`)
    }

    // Initialize services
    const supabase = initializeSupabase()
    validateOpenAI()

    // Extract text
    log('info', 'Extracting text from PDF...')
    const { text, metadata: pdfMetadata } = await extractPDFText(filePath)
    log('success', `Extracted ${text.length} characters from ${pdfMetadata.pages} pages`)

    // Create chunks
    log('info', 'Creating text chunks...')
    const chunks = chunkText(text)
    if (chunks.length === 0) {
      throw new Error('No valid chunks generated from document')
    }
    log('success', `Created ${chunks.length} chunks`)

    // Create source record
    log('info', 'Creating source record...')
    const sourceRecord = await createSourceRecord(supabase, {
      organizationId,
      userId,
      title,
      description,
      filePath,
      contentCategory,
      isPublic,
      licenseType,
      licenseNote,
      fileStats,
      pdfMetadata
    })
    log('success', `Created source record with ID: ${sourceRecord.id}`)

    // Process chunks with embeddings
    log('info', 'Generating embeddings and storing chunks...')
    const { processedChunks, totalTokensUsed } = await processChunks(supabase, sourceRecord.id, chunks)
    
    // Update source record as completed
    await completeSourceRecord(supabase, sourceRecord.id, processedChunks)

    const totalTime = Date.now() - startTime
    const estimatedCost = totalTokensUsed * 0.00001 // Rough cost estimate

    log('success', '🎉 Ingestion completed successfully!')
    log('info', `📊 Statistics:`)
    log('info', `   - Total chunks: ${processedChunks}`)
    log('info', `   - Total tokens used: ${totalTokensUsed.toLocaleString()}`)
    log('info', `   - Estimated cost: $${estimatedCost.toFixed(4)}`)
    log('info', `   - Processing time: ${(totalTime / 1000).toFixed(1)}s`)
    log('info', `   - Source ID: ${sourceRecord.id}`)

    return {
      success: true,
      sourceId: sourceRecord.id,
      chunksProcessed: processedChunks,
      tokensUsed: totalTokensUsed,
      processingTimeMs: totalTime,
      estimatedCost
    }

  } catch (error) {
    log('error', `❌ Ingestion failed: ${error.message}`)
    throw error
  }
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
${colors.bright}ClueQuest Knowledge Base Ingestion Tool${colors.reset}

Usage:
  node scripts/ingest-knowledge-base.mjs <pdf-file> <title> [options]

Arguments:
  <pdf-file>    Path to the PDF file to ingest
  <title>       Title for the document in the knowledge base

Options:
  --description <text>     Description of the document
  --category <category>    Content category (adventure_ideas, puzzle_mechanics, story_frameworks, educational, corporate, general)
  --organization <id>      Organization ID (UUID)
  --user <id>             User ID (UUID)
  --public                Make document publicly accessible
  --license <type>        License type (internal, creative_commons, commercial)
  --license-note <note>   Additional license information
  --help, -h              Show this help message

Examples:
  # Basic ingestion
  node scripts/ingest-knowledge-base.mjs ./docs/team-building-guide.pdf "Team Building Activities"

  # With full metadata
  node scripts/ingest-knowledge-base.mjs \\
    ./docs/escape-room-design.pdf \\
    "Escape Room Design Guide" \\
    --description "Comprehensive guide for designing engaging escape rooms" \\
    --category adventure_ideas \\
    --organization 12345678-1234-1234-1234-123456789012 \\
    --license creative_commons \\
    --public

Environment Variables Required:
  NEXT_PUBLIC_SUPABASE_URL     - Supabase project URL
  SUPABASE_SERVICE_ROLE_KEY    - Supabase service role key
  OPENAI_API_KEY              - OpenAI API key for embeddings

${colors.bright}Categories:${colors.reset}
  adventure_ideas    - Adventure concepts and storylines
  puzzle_mechanics   - Puzzle designs and mechanics
  story_frameworks   - Narrative structures and templates
  educational       - Educational content and materials
  corporate         - Corporate team building materials
  general          - General reference material
`)
    process.exit(0)
  }

  if (args.length < 2) {
    log('error', 'Missing required arguments. Use --help for usage information.')
    process.exit(1)
  }

  const filePath = path.resolve(args[0])
  const title = args[1]
  
  // Parse options
  const options = {
    description: '',
    contentCategory: 'general',
    organizationId: null,
    userId: null,
    isPublic: false,
    licenseType: 'internal',
    licenseNote: ''
  }

  for (let i = 2; i < args.length; i++) {
    switch (args[i]) {
      case '--description':
        options.description = args[++i] || ''
        break
      case '--category':
        const category = args[++i]
        if (['adventure_ideas', 'puzzle_mechanics', 'story_frameworks', 'educational', 'corporate', 'general'].includes(category)) {
          options.contentCategory = category
        } else {
          log('warning', `Invalid category: ${category}. Using 'general'.`)
        }
        break
      case '--organization':
        options.organizationId = args[++i] || null
        break
      case '--user':
        options.userId = args[++i] || null
        break
      case '--public':
        options.isPublic = true
        break
      case '--license':
        options.licenseType = args[++i] || 'internal'
        break
      case '--license-note':
        options.licenseNote = args[++i] || ''
        break
    }
  }

  try {
    await ingestDocument({
      filePath,
      title,
      ...options
    })
    
    log('success', '✨ Document successfully added to ClueQuest Knowledge Base!')
    process.exit(0)
    
  } catch (error) {
    log('error', `💥 Fatal error: ${error.message}`)
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Unexpected error:', error)
    process.exit(1)
  })
}

export { ingestDocument, chunkText, generateEmbedding }