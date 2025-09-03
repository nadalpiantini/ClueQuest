import { Database } from './supabase'

// Adventure-specific types extending the core schema
export type Adventure = {
  id: string
  organization_id: string
  title: string
  description: string
  theme: 'fantasy' | 'mystery' | 'corporate' | 'scifi' | 'educational'
  story_data: InkStoryJSON
  roles: Role[]
  scenes: Scene[]
  challenges: Challenge[]
  duration_minutes: number
  max_participants: number
  min_participants: number
  status: 'draft' | 'published' | 'active' | 'completed'
  settings: AdventureSettings
  created_at: string
  updated_at: string
}

export type Session = {
  id: string
  adventure_id: string
  host_user_id: string
  session_code: string
  status: 'waiting' | 'active' | 'paused' | 'completed'
  participants: Participant[]
  start_time: string | null
  end_time: string | null
  current_scene_id: string | null
  settings: SessionSettings
  created_at: string
  updated_at: string
}

export type Participant = {
  id: string
  session_id: string
  user_id: string | null // null for guest users
  guest_name: string | null
  role_id: string
  avatar_url: string | null
  status: 'waiting' | 'active' | 'disconnected' | 'completed'
  score: number
  current_scene_id: string | null
  progress: ParticipantProgress
  joined_at: string
  last_active_at: string
}

export type Role = {
  id: string
  adventure_id: string
  name: string
  description: string
  color: string
  icon_url: string | null
  perks: RolePerk[]
  suggested_count: number
  multipliers: ScoreMultiplier[]
}

export type RolePerk = {
  id: string
  name: string
  description: string
  perk_type: 'speed_boost' | 'hint_access' | 'extra_points' | 'skip_challenge' | 'team_buff'
  value: number
  conditions: string[]
}

export type Scene = {
  id: string
  adventure_id: string
  title: string
  description: string
  location_lat: number | null
  location_lng: number | null
  location_name: string | null
  qr_codes: QRCode[]
  ar_assets: ARAsset[]
  challenges: Challenge[]
  narrative_conditions: InkCondition[]
  unlock_conditions: string[]
  order_index: number
  estimated_duration_minutes: number
}

export type QRCode = {
  id: string
  scene_id: string
  code: string
  secure_hash: string
  location_description: string
  geofence_radius_meters: number | null
  scan_limit: number | null
  scan_count: number
  is_active: boolean
  expires_at: string | null
  created_at: string
}

export type Challenge = {
  id: string
  scene_id: string
  type: 'trivia' | 'photo' | 'audio' | 'puzzle' | 'collaborative' | 'ar_hunt'
  title: string
  description: string
  question: string | null
  options: string[] | null
  correct_answer: string | null
  media_url: string | null
  ar_asset_id: string | null
  time_limit_seconds: number | null
  points_value: number
  difficulty: 'easy' | 'medium' | 'hard'
  accessibility_options: AccessibilityOptions
  ai_generated: boolean
  order_index: number
}

export type ARAsset = {
  id: string
  scene_id: string
  name: string
  asset_type: '3d_model' | 'image' | 'video' | 'audio' | 'animation'
  file_url: string
  preview_url: string | null
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
  trigger_conditions: string[]
  interaction_type: 'view' | 'touch' | 'voice' | 'gesture'
  animation_sequence: string | null
}

export type InkStoryJSON = {
  inkVersion: number
  root: string
  listDefs: Record<string, any>
  variablesState: Record<string, any>
}

export type InkCondition = {
  variable: string
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'contains'
  value: any
  next_scene_id?: string
}

export type AdventureSettings = {
  allow_guest_users: boolean
  require_location: boolean
  enable_ar: boolean
  enable_audio: boolean
  team_formation: 'manual' | 'auto' | 'random'
  scoring_system: 'individual' | 'team' | 'collaborative'
  hint_system: boolean
  social_sharing: boolean
  language_support: string[]
  accessibility_features: string[]
}

export type SessionSettings = {
  auto_start: boolean
  pause_between_scenes: boolean
  allow_late_join: boolean
  hint_cooldown_seconds: number
  challenge_retry_limit: number
  leaderboard_visible: boolean
  progress_sharing: boolean
}

export type ParticipantProgress = {
  completed_scenes: string[]
  completed_challenges: string[]
  collected_items: CollectedItem[]
  achievements: Achievement[]
  hint_usage: HintUsage[]
  total_score: number
  time_spent_minutes: number
  collaboration_score: number
}

export type CollectedItem = {
  id: string
  name: string
  description: string
  rarity: 'common' | 'rare' | 'legendary'
  points_value: number
  collected_at: string
  scene_id: string
}

export type Achievement = {
  id: string
  name: string
  description: string
  badge_url: string
  points_bonus: number
  unlocked_at: string
  category: 'exploration' | 'collaboration' | 'speed' | 'creativity' | 'completion'
}

export type HintUsage = {
  challenge_id: string
  hint_level: number
  used_at: string
  cost: number
}

export type AccessibilityOptions = {
  alt_text_available: boolean
  audio_description: boolean
  large_text_support: boolean
  high_contrast: boolean
  voice_commands: boolean
  haptic_feedback: boolean
  screen_reader_compatible: boolean
}

export type ScoreMultiplier = {
  condition: string
  multiplier: number
  description: string
}

// Real-time event types for WebSocket communication
export type RealtimeEvent = {
  type: 'participant_joined' | 'participant_left' | 'scene_completed' | 'challenge_completed' | 
        'score_updated' | 'hint_used' | 'achievement_unlocked' | 'session_started' | 
        'session_paused' | 'session_completed' | 'message_sent'
  session_id: string
  user_id: string | null
  data: any
  timestamp: string
}

// UI State types
export type GameState = {
  session: Session | null
  participant: Participant | null
  current_scene: Scene | null
  current_challenge: Challenge | null
  leaderboard: LeaderboardEntry[]
  inventory: CollectedItem[]
  achievements: Achievement[]
  is_connected: boolean
  is_loading: boolean
  error: string | null
}

export type LeaderboardEntry = {
  participant_id: string
  name: string
  avatar_url: string | null
  role_name: string
  role_color: string
  score: number
  completed_challenges: number
  position: number
}

// API Response types
export type JoinSessionResponse = {
  session: Session
  participant: Participant
  adventure: Adventure
}

export type QRScanResult = {
  valid: boolean
  qr_code?: QRCode
  scene?: Scene
  challenges?: Challenge[]
  error?: string
  fraud_detected?: boolean
}

export type ChallengeSubmissionResult = {
  correct: boolean
  points_earned: number
  bonus_points: number
  time_bonus: number
  new_achievements: Achievement[]
  next_challenge?: Challenge
  scene_completed: boolean
}

// Avatar generation types
export type AvatarStyle = {
  id: string
  name: string
  description: string
  preview_url: string
  price: number
  category: 'fantasy' | 'modern' | 'futuristic' | 'cartoon'
}

export type AvatarGenerationRequest = {
  selfie_url?: string
  style_id: string
  gender?: 'male' | 'female' | 'non-binary'
  age_range?: 'child' | 'teen' | 'adult' | 'senior'
  customizations: {
    hair_color?: string
    eye_color?: string
    skin_tone?: string
    accessories?: string[]
  }
}

export type AvatarGenerationResult = {
  id: string
  avatar_url: string
  preview_url: string
  generation_time_ms: number
  moderation_passed: boolean
  style_applied: string
}

// Language support
export type SupportedLanguage = {
  code: string
  name: string
  native_name: string
  flag_emoji: string
  rtl: boolean
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', native_name: 'English', flag_emoji: '🇺🇸', rtl: false },
  { code: 'es', name: 'Spanish', native_name: 'Español', flag_emoji: '🇪🇸', rtl: false },
  { code: 'fr', name: 'French', native_name: 'Français', flag_emoji: '🇫🇷', rtl: false },
  { code: 'de', name: 'German', native_name: 'Deutsch', flag_emoji: '🇩🇪', rtl: false },
  { code: 'it', name: 'Italian', native_name: 'Italiano', flag_emoji: '🇮🇹', rtl: false },
  { code: 'pt', name: 'Portuguese', native_name: 'Português', flag_emoji: '🇵🇹', rtl: false },
  { code: 'zh', name: 'Chinese', native_name: '中文', flag_emoji: '🇨🇳', rtl: false },
  { code: 'ja', name: 'Japanese', native_name: '日本語', flag_emoji: '🇯🇵', rtl: false },
  { code: 'ko', name: 'Korean', native_name: '한국어', flag_emoji: '🇰🇷', rtl: false },
  { code: 'ar', name: 'Arabic', native_name: 'العربية', flag_emoji: '🇸🇦', rtl: true },
]

// Theme configurations
export type ThemeConfig = {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  fonts: {
    heading: string
    body: string
  }
  sounds: {
    success: string
    error: string
    notification: string
    ambient: string
  }
  animations: {
    transition_duration: number
    easing: string
  }
}

export const ADVENTURE_THEMES: Record<Adventure['theme'], ThemeConfig> = {
  fantasy: {
    id: 'fantasy',
    name: 'Fantasy Adventure',
    description: 'Magical realms with mystical creatures and ancient mysteries',
    colors: {
      primary: '#8B5CF6', // Purple
      secondary: '#F59E0B', // Golden
      accent: '#10B981', // Emerald
      background: '#1F2937'
    },
    fonts: {
      heading: 'Cinzel',
      body: 'Crimson Text'
    },
    sounds: {
      success: '/sounds/fantasy/success-chime.mp3',
      error: '/sounds/fantasy/error-buzz.mp3',
      notification: '/sounds/fantasy/magic-bell.mp3',
      ambient: '/sounds/fantasy/forest-ambient.mp3'
    },
    animations: {
      transition_duration: 800,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }
  },
  mystery: {
    id: 'mystery',
    name: 'Mystery Detective',
    description: 'Dark alleys, hidden clues, and puzzles to solve',
    colors: {
      primary: '#374151', // Dark Gray
      secondary: '#B91C1C', // Dark Red
      accent: '#F59E0B', // Amber
      background: '#111827'
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Source Serif Pro'
    },
    sounds: {
      success: '/sounds/mystery/success-reveal.mp3',
      error: '/sounds/mystery/error-thud.mp3',
      notification: '/sounds/mystery/detective-bell.mp3',
      ambient: '/sounds/mystery/noir-ambient.mp3'
    },
    animations: {
      transition_duration: 600,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },
  corporate: {
    id: 'corporate',
    name: 'Corporate Challenge',
    description: 'Professional team-building with business scenarios',
    colors: {
      primary: '#0EA5E9', // ClueQuest Blue
      secondary: '#059669', // Professional Green
      accent: '#F59E0B', // Corporate Gold
      background: '#F8FAFC'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    sounds: {
      success: '/sounds/corporate/success-ding.mp3',
      error: '/sounds/corporate/error-beep.mp3',
      notification: '/sounds/corporate/notification.mp3',
      ambient: '/sounds/corporate/office-ambient.mp3'
    },
    animations: {
      transition_duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },
  scifi: {
    id: 'scifi',
    name: 'Sci-Fi Adventure',
    description: 'Futuristic worlds with advanced technology and space exploration',
    colors: {
      primary: '#06B6D4', // Cyan
      secondary: '#8B5CF6', // Purple
      accent: '#F59E0B', // Electric Yellow
      background: '#0F172A'
    },
    fonts: {
      heading: 'Orbitron',
      body: 'Space Mono'
    },
    sounds: {
      success: '/sounds/scifi/success-synth.mp3',
      error: '/sounds/scifi/error-digital.mp3',
      notification: '/sounds/scifi/sci-notification.mp3',
      ambient: '/sounds/scifi/space-ambient.mp3'
    },
    animations: {
      transition_duration: 400,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }
  },
  educational: {
    id: 'educational',
    name: 'Educational Quest',
    description: 'Learning adventures with curriculum integration',
    colors: {
      primary: '#059669', // Education Green
      secondary: '#0EA5E9', // Learning Blue
      accent: '#F59E0B', // Achievement Gold
      background: '#FFFFFF'
    },
    fonts: {
      heading: 'Poppins',
      body: 'Open Sans'
    },
    sounds: {
      success: '/sounds/educational/success-cheer.mp3',
      error: '/sounds/educational/error-gentle.mp3',
      notification: '/sounds/educational/learning-bell.mp3',
      ambient: '/sounds/educational/classroom-ambient.mp3'
    },
    animations: {
      transition_duration: 500,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }
  }
}