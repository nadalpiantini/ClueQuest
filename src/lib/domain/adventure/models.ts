// Adventure Domain Models - Core Business Entities
// Part of ClueQuest Hexagonal Architecture

export interface Adventure {
  id: string;
  organizationId: string;
  creatorId: string;
  
  // Basic Properties
  title: string;
  description: string;
  category: AdventureCategory;
  difficulty: DifficultyLevel;
  estimatedDuration: number; // minutes
  
  // Experience Configuration
  settings: AdventureSettings;
  scenes: Scene[];
  roles: Role[];
  
  // QR & Security
  qrCodes: QRCode[];
  securityConfig: SecurityConfig;
  
  // Real-time Features
  allowsTeams: boolean;
  maxParticipants: number;
  leaderboardEnabled: boolean;
  
  // Lifecycle
  status: AdventureStatus;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Scene {
  id: string;
  adventureId: string;
  orderIndex: number;
  
  // Content
  title: string;
  description: string;
  narrative: string; // AI-generated story content
  
  // Media Assets
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  arAssetUrl?: string; // 3D model or AR experience
  
  // Challenges & Interactions
  challenges: Challenge[];
  interactionType: InteractionType;
  
  // Progression Logic
  completionCriteria: CompletionCriteria;
  unlockConditions: UnlockCondition[];
  
  // Location & Context
  location?: GeoLocation;
  qrCodeRequired: boolean;
  timeLimit?: number; // seconds
  
  // AI Enhancement
  aiPersonalization: PersonalizationSettings;
}

export interface Challenge {
  id: string;
  sceneId: string;
  type: ChallengeType;
  
  // Challenge Content
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer: string | string[];
  
  // Difficulty & Scoring
  difficulty: DifficultyLevel;
  pointValue: number;
  hintText?: string;
  
  // AI Features
  adaptiveDifficulty: boolean;
  personalizedContent: boolean;
}

export interface QRCode {
  id: string;
  adventureId: string;
  sceneId: string;
  
  // Security
  token: string; // HMAC-signed token
  hmacSignature: string;
  expiresAt: Date;
  
  // Metadata
  generatedAt: Date;
  usageCount: number;
  maxUsage?: number;
  
  // Validation
  location?: GeoLocation;
  proximityRadius?: number; // meters
  
  // Anti-fraud
  ipRestrictions?: string[];
  deviceFingerprint?: string;
  rateLimit: RateLimitConfig;
}

export interface Role {
  id: string;
  adventureId: string;
  
  // Role Definition  
  name: string;
  description: string;
  color: string; // hex color for UI
  
  // Permissions & Abilities
  permissions: RolePermission[];
  specialAbilities: SpecialAbility[];
  
  // AI Avatar
  aiAvatarConfig: AvatarConfig;
  personalityTraits: PersonalityTrait[];
  
  // Progression
  unlockableScenes: string[]; // scene IDs
  bonusPointMultiplier: number;
}

// Enums and Type Definitions

export enum AdventureCategory {
  EDUCATIONAL = 'educational',
  TEAM_BUILDING = 'team_building', 
  MARKETING = 'marketing',
  ONBOARDING = 'onboarding',
  TRAINING = 'training',
  ENTERTAINMENT = 'entertainment',
  CUSTOM = 'custom'
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate', 
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum AdventureStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export enum ChallengeType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  PHOTO_UPLOAD = 'photo_upload',
  QR_SCAN = 'qr_scan',
  AR_INTERACTION = 'ar_interaction',
  LOCATION_CHECK = 'location_check',
  TIME_CHALLENGE = 'time_challenge'
}

export enum InteractionType {
  TAP_TO_CONTINUE = 'tap_to_continue',
  QR_SCAN_REQUIRED = 'qr_scan_required',
  CHALLENGE_REQUIRED = 'challenge_required',
  TEAM_COORDINATION = 'team_coordination',
  AR_EXPERIENCE = 'ar_experience',
  LOCATION_ARRIVAL = 'location_arrival'
}

export enum RolePermission {
  VIEW_HINTS = 'view_hints',
  SKIP_CHALLENGES = 'skip_challenges',
  VIEW_LEADERBOARD = 'view_leaderboard',
  COORDINATE_TEAM = 'coordinate_team',
  ACCESS_AR_FEATURES = 'access_ar_features',
  GENERATE_QR_CODES = 'generate_qr_codes'
}

// Complex Type Interfaces

export interface AdventureSettings {
  // Gameplay
  allowTeams: boolean;
  maxTeamSize: number;
  allowIndividualPlay: boolean;
  
  // Progression
  linearProgression: boolean; // false = open world style
  allowBacktracking: boolean;
  saveProgressEnabled: boolean;
  
  // Real-time Features
  liveLeaderboard: boolean;
  realTimeHints: boolean;
  teamChat: boolean;
  
  // AI Personalization
  aiPersonalization: boolean;
  adaptiveDifficulty: boolean;
  dynamicNarrative: boolean;
  
  // Security & Anti-fraud
  strictGeolocation: boolean;
  deviceFingerprinting: boolean;
  antiCheatMeasures: AntiCheatConfig;
}

export interface SecurityConfig {
  // QR Code Security
  hmacSecret: string;
  tokenExpiration: number; // minutes
  maxQRUsage: number;
  
  // Location Validation
  geoFencing: boolean;
  proximityTolerance: number; // meters
  altitudeValidation: boolean;
  
  // Anti-fraud
  ipWhitelist?: string[];
  deviceFingerprinting: boolean;
  suspiciousActivityDetection: boolean;
  
  // Rate Limiting
  qrScanRateLimit: RateLimitConfig;
  challengeSubmissionLimit: RateLimitConfig;
}

export interface CompletionCriteria {
  type: 'all_challenges' | 'minimum_score' | 'time_limit' | 'custom';
  minimumScore?: number;
  timeLimit?: number; // seconds
  requiredChallenges?: string[]; // challenge IDs
  customLogic?: string; // JSONLogic expression
}

export interface UnlockCondition {
  type: 'scene_completion' | 'score_threshold' | 'time_elapsed' | 'team_consensus';
  requiredScenes?: string[];
  minimumScore?: number;
  timeDelay?: number; // seconds
  teamVoteThreshold?: number; // percentage
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy: number; // meters
  timestamp: Date;
}

export interface PersonalizationSettings {
  adaptToPlayerSkill: boolean;
  personalizeNarrative: boolean;
  customizeVisuals: boolean;
  adjustDifficulty: boolean;
  learningStyleAdaptation: boolean;
}

export interface AvatarConfig {
  baseModel: string; // DALL-E generated base
  customizations: AvatarCustomization[];
  voiceSettings: VoiceConfig;
  animationSet: string[];
}

export interface PersonalityTrait {
  name: string;
  value: number; // -1 to 1 scale
  description: string;
}

export interface SpecialAbility {
  id: string;
  name: string;
  description: string;
  cooldown: number; // seconds
  usageLimit?: number;
  effectType: 'hint' | 'skip' | 'bonus_points' | 'team_boost';
}

export interface AntiCheatConfig {
  timeThresholds: {
    minSceneTime: number; // seconds
    maxSceneTime: number; // seconds
    suspiciousFastCompletion: number;
  };
  behaviorAnalysis: {
    trackMouseMovements: boolean;
    trackKeystrokes: boolean;
    detectAutomation: boolean;
  };
  fraudDetection: {
    duplicateDeviceDetection: boolean;
    vpnDetection: boolean;
    locationSpoofingDetection: boolean;
  };
}

export interface RateLimitConfig {
  maxAttempts: number;
  windowSize: number; // seconds
  blockDuration: number; // seconds
  escalationFactor: number;
}

export interface AvatarCustomization {
  category: 'appearance' | 'clothing' | 'accessories' | 'expressions';
  property: string;
  value: string;
}

export interface VoiceConfig {
  voiceId: string;
  speed: number; // 0.5 to 2.0
  pitch: number; // -20 to 20
  volume: number; // 0.0 to 1.0
  language: string;
  accent?: string;
}

// Domain Events for Event Sourcing

export interface AdventureDomainEvent {
  id: string;
  adventureId: string;
  type: string;
  payload: any;
  timestamp: Date;
  userId?: string;
  version: number;
}

export interface AdventureCreatedEvent extends AdventureDomainEvent {
  type: 'adventure.created';
  payload: {
    adventure: Adventure;
    creatorId: string;
  };
}

export interface SceneCompletedEvent extends AdventureDomainEvent {
  type: 'scene.completed';
  payload: {
    sceneId: string;
    userId: string;
    completionTime: number;
    score: number;
    attempts: number;
  };
}

export interface QRCodeScannedEvent extends AdventureDomainEvent {
  type: 'qr_code.scanned';
  payload: {
    qrCodeId: string;
    sceneId: string;
    userId: string;
    location?: GeoLocation;
    deviceInfo: DeviceInfo;
    timestamp: Date;
  };
}

export interface DeviceInfo {
  userAgent: string;
  fingerprint: string;
  ipAddress: string;
  platform: string;
  screenResolution: string;
}

// Value Objects

export class AdventureId {
  constructor(private readonly value: string) {
    if (!value || value.length < 10) {
      throw new Error('Adventure ID must be at least 10 characters');
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: AdventureId): boolean {
    return this.value === other.value;
  }
}

export class HMACToken {
  constructor(
    private readonly token: string,
    private readonly signature: string,
    private readonly expiresAt: Date
  ) {}

  isValid(): boolean {
    return new Date() < this.expiresAt;
  }

  toString(): string {
    return `${this.token}.${this.signature}`;
  }

  static fromString(tokenString: string): HMACToken {
    const [token, signature] = tokenString.split('.');
    if (!token || !signature) {
      throw new Error('Invalid HMAC token format');
    }
    // In real implementation, would decode expiration from token
    return new HMACToken(token, signature, new Date(Date.now() + 3600000));
  }
}

// Factory Pattern for Adventure Creation

export class AdventureFactory {
  static createBasicAdventure(
    organizationId: string,
    creatorId: string,
    title: string,
    category: AdventureCategory
  ): Adventure {
    return {
      id: crypto.randomUUID(),
      organizationId,
      creatorId,
      title,
      description: '',
      category,
      difficulty: DifficultyLevel.BEGINNER,
      estimatedDuration: 30,
      settings: this.defaultSettings(),
      scenes: [],
      roles: [],
      qrCodes: [],
      securityConfig: this.defaultSecurityConfig(),
      allowsTeams: true,
      maxParticipants: 50,
      leaderboardEnabled: true,
      status: AdventureStatus.DRAFT,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private static defaultSettings(): AdventureSettings {
    return {
      allowTeams: true,
      maxTeamSize: 4,
      allowIndividualPlay: true,
      linearProgression: true,
      allowBacktracking: false,
      saveProgressEnabled: true,
      liveLeaderboard: true,
      realTimeHints: false,
      teamChat: true,
      aiPersonalization: false,
      adaptiveDifficulty: false,
      dynamicNarrative: false,
      strictGeolocation: false,
      deviceFingerprinting: true,
      antiCheatMeasures: {
        timeThresholds: {
          minSceneTime: 5,
          maxSceneTime: 3600,
          suspiciousFastCompletion: 10,
        },
        behaviorAnalysis: {
          trackMouseMovements: false,
          trackKeystrokes: false,
          detectAutomation: true,
        },
        fraudDetection: {
          duplicateDeviceDetection: true,
          vpnDetection: false,
          locationSpoofingDetection: false,
        },
      },
    };
  }

  private static defaultSecurityConfig(): SecurityConfig {
    return {
      hmacSecret: crypto.randomUUID(),
      tokenExpiration: 60,
      maxQRUsage: 10,
      geoFencing: false,
      proximityTolerance: 50,
      altitudeValidation: false,
      deviceFingerprinting: true,
      suspiciousActivityDetection: true,
      qrScanRateLimit: {
        maxAttempts: 10,
        windowSize: 60,
        blockDuration: 300,
        escalationFactor: 2,
      },
      challengeSubmissionLimit: {
        maxAttempts: 3,
        windowSize: 60,
        blockDuration: 180,
        escalationFactor: 1.5,
      },
    };
  }
}