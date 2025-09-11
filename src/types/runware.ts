/**
 * Runware.ai API Types for ClueQuest Avatar Generation
 * Handles image-to-image transformations with face preservation
 */

// Runware.ai API Request Types
export interface RunwareGenerationRequest {
  taskType: 'imageInference' | 'videoInference' | 'imageUpscale' | 'imageUpload' | 'imageBackgroundRemoval' | 'imageCaption' | 'imageControlNetPreProcess' | 'promptEnhance' | 'modelUpload' | 'imageMasking' | 'modelSearch' | 'ping' | 'photoMaker' | 'getResponse' | 'accountManagement' | 'modelDelete' | 'audioInference' | 'mediaStorage'
  taskUUID: string // UUIDv4 string
  model: string // AIR identifier (e.g., "runware:101@1")
  model_id: string
  mode: 'txt2img' | 'img2img'
  positivePrompt: string // Runware API expects positivePrompt
  negativePrompt?: string // Runware API expects negativePrompt
  width: number
  height: number
  guidance: number
  steps: number
  seed?: number | null
  strength?: number // For img2img mode (0.1-1.0)
  image?: string // Base64 image for img2img
  face_reference?: string // Base64 image for face preservation
  loras?: LoRAConfig[] // Optional style adapters
}

export interface LoRAConfig {
  model: string
  weight: number
}

// Runware.ai API Response Types  
export interface RunwareGenerationResponse {
  image: string // Base64 encoded result
  generation_id: string
  cost: number
  nsfw_detected: boolean
  processing_time_ms: number
}

export interface RunwareErrorResponse {
  error: string
  code?: string
  details?: any
}

// ClueQuest Role-Based Model Configuration
export type ClueQuestRole = 'Leader' | 'Warrior' | 'Mage' | 'Healer' | 'Scout'

export interface RoleModelConfig {
  role: ClueQuestRole
  model_id: string
  style_name: string
  prompt_template: string
  negative_prompt: string
  strength: number // Face preservation strength
  guidance: number
  steps: number
  loras?: LoRAConfig[]
}

// Face Detection and Validation
export interface FaceDetectionResult {
  faces_detected: number
  has_single_face: boolean
  face_confidence: number
  face_bounds?: {
    x: number
    y: number
    width: number
    height: number
  }
  quality_score: number // 0-100
  lighting_quality: number // 0-100
  is_frontal: boolean
  meets_passport_standards: boolean
}

// Image Processing Results
export interface ProcessedImage {
  buffer: Buffer
  width: number
  height: number
  format: string
  size_bytes: number
  face_detection: FaceDetectionResult
}

// Avatar Generation Pipeline Result
export interface AvatarGenerationPipelineResult {
  success: boolean
  avatar_url?: string
  generation_time_ms: number
  model_used: string
  role_applied: ClueQuestRole
  face_preservation_score?: number
  moderation_passed: boolean
  error?: string
  variants?: {
    profile_sq: string // 1024x1024
    profile_round: string // Circular crop
    profile_banner?: string // 16:9 format
  }
}

// Pipeline Configuration
export interface AvatarPipelineConfig {
  enable_face_restoration: boolean
  generate_variants: boolean
  quality_threshold: number
  max_generation_time_ms: number
  fallback_to_generic: boolean
}

// Model Router Types
export interface ModelRouterResult {
  model_id: string
  prompt: string
  negative_prompt: string
  strength: number
  guidance: number
  steps: number
  loras?: LoRAConfig[]
  estimated_cost: number
}

export interface CustomizationOptions {
  gender?: 'male' | 'female' | 'non-binary' | 'auto'
  age_range?: 'teen' | 'adult' | 'senior' | 'auto'
  style_intensity?: 'subtle' | 'moderate' | 'strong'
  preserve_ethnicity?: boolean
  enhance_features?: boolean
}

// Validation Types
export interface PhotoValidationResult {
  is_valid: boolean
  issues: PhotoValidationIssue[]
  recommendations: string[]
  confidence_score: number
}

export interface PhotoValidationIssue {
  type: 'lighting' | 'face_count' | 'face_angle' | 'resolution' | 'format' | 'background'
  severity: 'error' | 'warning' | 'info'
  message: string
  suggestion?: string
}

// Error Types
export class RunwareAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errorCode?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'RunwareAPIError'
  }
}

export class FaceValidationError extends Error {
  constructor(
    message: string,
    public validationResult: PhotoValidationResult
  ) {
    super(message)
    this.name = 'FaceValidationError'
  }
}

export class ImageProcessingError extends Error {
  constructor(
    message: string,
    public stage: 'upload' | 'detection' | 'processing' | 'generation'
  ) {
    super(message)
    this.name = 'ImageProcessingError'
  }
}