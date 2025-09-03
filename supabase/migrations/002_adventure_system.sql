-- ClueQuest Adventure System Extension
-- Extends the existing SaaS foundation with adventure-specific functionality
-- Based on comprehensive mindmap analysis and technical requirements

-- =============================================================================
-- ADVENTURE DOMAIN TYPES
-- =============================================================================

-- Adventure categories for different use cases
CREATE TYPE adventure_category AS ENUM (
    'social_event',     -- Weddings, parties, festivals
    'educational',      -- Classroom activities, learning games
    'team_building',    -- Corporate team building
    'marketing',        -- Brand activations, promotional events
    'onboarding',       -- Employee or student onboarding
    'training',         -- Professional development
    'entertainment'     -- General entertainment events
);

-- Difficulty levels for adventures
CREATE TYPE difficulty_level AS ENUM (
    'beginner',         -- 0-30 minutes, simple challenges
    'intermediate',     -- 30-60 minutes, moderate complexity
    'advanced',         -- 60-120 minutes, complex puzzles
    'expert'           -- 120+ minutes, professional level
);

-- Adventure lifecycle status
CREATE TYPE adventure_status AS ENUM (
    'draft',           -- Being created
    'published',       -- Available for use
    'active',          -- Currently running
    'paused',          -- Temporarily stopped
    'completed',       -- Finished normally
    'archived'         -- Moved to archive
);

-- Game session status
CREATE TYPE session_status AS ENUM (
    'preparing',       -- Setting up session
    'waiting',         -- Waiting for players
    'starting',        -- About to begin
    'active',          -- Game in progress
    'paused',          -- Temporarily paused
    'ending',          -- Wrapping up
    'completed'        -- Finished
);

-- Player status during gameplay
CREATE TYPE player_status AS ENUM (
    'active',          -- Actively playing
    'paused',          -- Temporarily away
    'disconnected',    -- Lost connection
    'completed',       -- Finished adventure
    'eliminated'       -- Removed from game
);

-- Challenge interaction types
CREATE TYPE interaction_type AS ENUM (
    'qr_scan',         -- QR code scanning
    'location_check',  -- GPS location validation
    'photo_upload',    -- Photo challenge submission
    'trivia_question', -- Multiple choice questions
    'audio_response',  -- Audio recording challenges
    'ar_interaction',  -- Augmented reality interactions
    'team_puzzle',     -- Collaborative team challenges
    'time_challenge'   -- Time-based challenges
);

-- AI content types
CREATE TYPE ai_content_type AS ENUM (
    'avatar',          -- Generated player avatars
    'narrative',       -- Story content and dialogue
    'challenge',       -- Dynamic challenge generation
    'hint',           -- AI-generated hints
    'recap'           -- Post-event summaries
);

-- AI content status
CREATE TYPE ai_content_status AS ENUM (
    'generating',      -- In progress
    'generated',       -- Successfully created
    'moderated',       -- Passed content moderation
    'rejected',        -- Failed moderation
    'expired'          -- Cache expired
);

-- =============================================================================
-- ADVENTURE CORE TABLES
-- =============================================================================

-- Adventures: Core adventure definitions
CREATE TABLE cluequest_adventures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic properties
    title TEXT NOT NULL,
    description TEXT,
    category adventure_category NOT NULL,
    difficulty difficulty_level NOT NULL,
    estimated_duration INTEGER DEFAULT 30, -- minutes
    
    -- Theme and branding
    theme_name TEXT DEFAULT 'default',
    theme_config JSONB DEFAULT '{}', -- Colors, fonts, styling
    cover_image_url TEXT,
    background_music_url TEXT,
    
    -- Experience configuration
    settings JSONB DEFAULT '{}',
    security_config JSONB DEFAULT '{}',
    
    -- Multi-player features
    allows_teams BOOLEAN DEFAULT TRUE,
    max_team_size INTEGER DEFAULT 4,
    max_participants INTEGER DEFAULT 50,
    min_participants INTEGER DEFAULT 1,
    
    -- Real-time features
    leaderboard_enabled BOOLEAN DEFAULT TRUE,
    live_tracking BOOLEAN DEFAULT TRUE,
    chat_enabled BOOLEAN DEFAULT FALSE,
    hints_enabled BOOLEAN DEFAULT TRUE,
    
    -- AI features
    ai_personalization BOOLEAN DEFAULT FALSE,
    adaptive_difficulty BOOLEAN DEFAULT FALSE,
    ai_avatars_enabled BOOLEAN DEFAULT TRUE,
    ai_narrative_enabled BOOLEAN DEFAULT FALSE,
    
    -- Accessibility
    offline_mode BOOLEAN DEFAULT TRUE,
    accessibility_features JSONB DEFAULT '[]',
    language_support TEXT[] DEFAULT ARRAY['en'],
    
    -- Lifecycle
    status adventure_status DEFAULT 'draft',
    scheduled_start TIMESTAMPTZ,
    scheduled_end TIMESTAMPTZ,
    tags TEXT[] DEFAULT '{}',
    is_template BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    
    -- Metrics
    total_sessions INTEGER DEFAULT 0,
    total_participants INTEGER DEFAULT 0,
    average_completion_time INTEGER, -- minutes
    completion_rate DECIMAL(5,2) DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adventure scenes: Individual story beats and challenges
CREATE TABLE cluequest_scenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    
    -- Content
    title TEXT NOT NULL,
    description TEXT,
    narrative TEXT, -- Story text or AI-generated content
    narrative_ai_generated BOOLEAN DEFAULT FALSE,
    
    -- Media assets
    image_url TEXT,
    audio_url TEXT,
    video_url TEXT,
    ar_asset_url TEXT, -- 3D model or AR experience
    ar_asset_config JSONB DEFAULT '{}',
    
    -- Interaction configuration
    interaction_type interaction_type NOT NULL,
    completion_criteria JSONB DEFAULT '{}', -- How to complete this scene
    unlock_conditions JSONB DEFAULT '[]', -- Prerequisites to access
    
    -- Location requirements
    location JSONB, -- GeoJSON point
    proximity_radius INTEGER DEFAULT 50, -- meters
    qr_code_required BOOLEAN DEFAULT FALSE,
    qr_token TEXT, -- Generated QR token
    
    -- Challenge settings
    time_limit INTEGER, -- seconds (NULL = no limit)
    max_attempts INTEGER DEFAULT 3,
    hint_cost INTEGER DEFAULT 0, -- Points deducted for hints
    points_reward INTEGER DEFAULT 100,
    
    -- Team coordination
    requires_team BOOLEAN DEFAULT FALSE,
    team_size_required INTEGER DEFAULT 1,
    simultaneous_access BOOLEAN DEFAULT TRUE,
    
    -- Conditional logic
    branching_conditions JSONB DEFAULT '[]',
    failure_action TEXT DEFAULT 'retry' CHECK (failure_action IN ('retry', 'skip', 'end_game')),
    
    -- AI enhancement
    adaptive_hints BOOLEAN DEFAULT FALSE,
    ai_validation BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(adventure_id, order_index)
);

-- Adventure roles: Player roles with special abilities
CREATE TABLE cluequest_adventure_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    
    -- Role definition
    name TEXT NOT NULL,
    description TEXT,
    emoji TEXT, -- Role emoji for display
    color TEXT, -- Hex color code
    
    -- Role abilities/perks
    perks JSONB DEFAULT '[]', -- Special abilities
    point_multiplier DECIMAL(3,2) DEFAULT 1.0,
    hint_discount INTEGER DEFAULT 0, -- Percentage off hint costs
    extra_time INTEGER DEFAULT 0, -- Bonus seconds per challenge
    
    -- Balancing
    max_players INTEGER, -- Limit number of players with this role
    prerequisites JSONB DEFAULT '[]', -- Requirements to select this role
    
    -- Collaboration settings
    can_help_others BOOLEAN DEFAULT FALSE,
    team_leader BOOLEAN DEFAULT FALSE,
    solo_only BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(adventure_id, name)
);

-- =============================================================================
-- GAMEPLAY SESSION TABLES
-- =============================================================================

-- Game sessions: Live instances of adventures
CREATE TABLE cluequest_game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    host_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Session identity
    session_code TEXT NOT NULL UNIQUE, -- Join code for players
    title TEXT, -- Custom session title
    description TEXT,
    
    -- Configuration
    max_participants INTEGER NOT NULL,
    allows_teams BOOLEAN DEFAULT TRUE,
    team_size_limit INTEGER DEFAULT 4,
    auto_start BOOLEAN DEFAULT FALSE,
    
    -- Access control
    is_private BOOLEAN DEFAULT TRUE,
    requires_approval BOOLEAN DEFAULT FALSE,
    password_hash TEXT, -- Optional password protection
    
    -- Timing
    status session_status DEFAULT 'preparing',
    scheduled_start TIMESTAMPTZ,
    actual_start TIMESTAMPTZ,
    scheduled_end TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    
    -- Real-time state
    active_participants INTEGER DEFAULT 0,
    completed_participants INTEGER DEFAULT 0,
    current_scene_id UUID REFERENCES cluequest_scenes(id),
    
    -- Configuration overrides
    setting_overrides JSONB DEFAULT '{}',
    scene_overrides JSONB DEFAULT '{}',
    
    -- Results and analytics
    leaderboard JSONB DEFAULT '[]',
    completion_rate DECIMAL(5,2) DEFAULT 0,
    average_completion_time INTEGER, -- minutes
    total_interactions INTEGER DEFAULT 0,
    
    -- Host controls
    allow_late_join BOOLEAN DEFAULT TRUE,
    pause_enabled BOOLEAN DEFAULT TRUE,
    hint_system_enabled BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player states: Real-time player progress and status
CREATE TABLE cluequest_player_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES cluequest_game_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Player identity
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    ai_avatar_generated BOOLEAN DEFAULT FALSE,
    team_id UUID, -- Self-referencing for team formation
    role_id UUID REFERENCES cluequest_adventure_roles(id),
    
    -- Progress tracking
    current_scene_id UUID REFERENCES cluequest_scenes(id),
    completed_scenes UUID[] DEFAULT '{}',
    scene_start_time TIMESTAMPTZ,
    
    -- Scoring
    total_score INTEGER DEFAULT 0,
    bonus_points INTEGER DEFAULT 0,
    penalty_points INTEGER DEFAULT 0,
    multiplier DECIMAL(3,2) DEFAULT 1.0,
    
    -- Performance metrics
    completion_time INTEGER, -- Total time in seconds
    scenes_completed INTEGER DEFAULT 0,
    hints_used INTEGER DEFAULT 0,
    attempts_failed INTEGER DEFAULT 0,
    perfect_completions INTEGER DEFAULT 0,
    
    -- Real-time status
    status player_status DEFAULT 'active',
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    last_ping_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Location tracking
    current_location JSONB, -- GeoJSON point
    location_accuracy DECIMAL(10,2), -- GPS accuracy in meters
    location_updated_at TIMESTAMPTZ,
    
    -- Device information
    device_info JSONB DEFAULT '{}',
    session_token TEXT, -- For WebSocket authentication
    
    -- Anti-fraud tracking
    suspicious_activity_score INTEGER DEFAULT 0,
    fraud_flags JSONB DEFAULT '[]',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(session_id, user_id)
);

-- Team formations for collaborative gameplay
CREATE TABLE cluequest_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES cluequest_game_sessions(id) ON DELETE CASCADE,
    
    -- Team identity
    name TEXT NOT NULL,
    color TEXT, -- Team color for UI
    emoji TEXT, -- Team emoji
    
    -- Team composition
    leader_id UUID REFERENCES auth.users(id),
    max_members INTEGER DEFAULT 4,
    current_members INTEGER DEFAULT 0,
    
    -- Team progress
    total_score INTEGER DEFAULT 0,
    completed_scenes UUID[] DEFAULT '{}',
    current_scene_id UUID REFERENCES cluequest_scenes(id),
    
    -- Team dynamics
    collaboration_score DECIMAL(5,2) DEFAULT 0,
    communication_rating DECIMAL(3,2) DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    formed_at TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(session_id, name)
);

-- =============================================================================
-- QR SECURITY & ANTI-FRAUD SYSTEM
-- =============================================================================

-- QR codes with security features
CREATE TABLE cluequest_qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id UUID NOT NULL REFERENCES cluequest_scenes(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES cluequest_game_sessions(id) ON DELETE CASCADE,
    
    -- QR identity
    token TEXT NOT NULL UNIQUE,
    display_text TEXT, -- Human-readable text for QR
    
    -- Security features
    hmac_signature TEXT NOT NULL,
    secret_key TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    
    -- Usage tracking
    max_scans INTEGER DEFAULT 1000, -- Limit total scans
    scan_count INTEGER DEFAULT 0,
    unique_scan_count INTEGER DEFAULT 0,
    
    -- Location validation
    required_location JSONB, -- GeoJSON point
    proximity_tolerance INTEGER DEFAULT 50, -- meters
    altitude_tolerance INTEGER DEFAULT 10, -- meters for indoor/outdoor
    
    -- Anti-fraud measures
    rate_limit_per_user INTEGER DEFAULT 1, -- Scans per user
    cooldown_seconds INTEGER DEFAULT 5, -- Between scans
    device_fingerprint_required BOOLEAN DEFAULT TRUE,
    ip_validation_enabled BOOLEAN DEFAULT TRUE,
    
    -- Activation window
    active_from TIMESTAMPTZ DEFAULT NOW(),
    active_until TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- QR scan records with fraud detection
CREATE TABLE cluequest_qr_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_code_id UUID NOT NULL REFERENCES cluequest_qr_codes(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES cluequest_game_sessions(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES cluequest_player_states(id) ON DELETE CASCADE,
    
    -- Scan details
    scanned_at TIMESTAMPTZ DEFAULT NOW(),
    scan_location JSONB, -- GeoJSON point
    location_accuracy DECIMAL(10,2),
    
    -- Device information
    ip_address INET,
    user_agent TEXT,
    device_fingerprint TEXT,
    
    -- Validation results
    is_valid BOOLEAN NOT NULL,
    validation_errors JSONB DEFAULT '[]',
    distance_from_target DECIMAL(10,2), -- meters
    
    -- Anti-fraud analysis
    fraud_risk_score INTEGER DEFAULT 0, -- 0-100
    fraud_indicators JSONB DEFAULT '[]',
    is_suspicious BOOLEAN DEFAULT FALSE,
    
    -- Processing
    processing_time_ms INTEGER,
    points_awarded INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- AI CONTENT MANAGEMENT
-- =============================================================================

-- AI-generated avatars and content
CREATE TABLE cluequest_ai_avatars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES cluequest_game_sessions(id) ON DELETE CASCADE,
    
    -- Generation parameters
    source_image_url TEXT, -- Original selfie (deleted after processing)
    style TEXT NOT NULL, -- 'realistic', 'cartoon', '8bit', 'fantasy'
    prompt_used TEXT NOT NULL,
    
    -- Generated content
    avatar_url TEXT NOT NULL,
    thumbnail_url TEXT,
    metadata JSONB DEFAULT '{}', -- Size, format, etc.
    
    -- AI provider details
    ai_provider TEXT NOT NULL, -- 'openai', 'leonardo', 'readyplayerme'
    model_version TEXT NOT NULL,
    generation_cost DECIMAL(10,4),
    generation_time_seconds INTEGER,
    
    -- Content moderation
    moderation_score INTEGER, -- 0-100 (safety score)
    moderation_flags JSONB DEFAULT '[]',
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES auth.users(id),
    
    -- Usage and lifecycle
    status ai_content_status DEFAULT 'generating',
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI-generated narrative content
CREATE TABLE cluequest_ai_narratives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    scene_id UUID REFERENCES cluequest_scenes(id) ON DELETE CASCADE,
    
    -- Generation input
    theme TEXT NOT NULL,
    tone TEXT NOT NULL, -- 'adventurous', 'mysterious', 'educational', 'corporate'
    target_audience TEXT NOT NULL, -- 'children', 'adults', 'professionals'
    prompt_parameters JSONB NOT NULL,
    
    -- Generated content
    narrative_text TEXT NOT NULL,
    dialogue JSONB DEFAULT '[]', -- Character dialogues
    branching_options JSONB DEFAULT '[]', -- Story branches
    
    -- AI provider details
    ai_provider TEXT NOT NULL,
    model_version TEXT NOT NULL,
    generation_cost DECIMAL(10,4),
    
    -- Quality metrics
    readability_score INTEGER, -- 0-100
    engagement_predicted INTEGER, -- 0-100
    content_length INTEGER, -- Character count
    
    -- Content moderation
    moderation_passed BOOLEAN DEFAULT FALSE,
    inappropriate_content_detected BOOLEAN DEFAULT FALSE,
    bias_score INTEGER DEFAULT 0, -- 0-100
    
    -- Usage tracking
    status ai_content_status DEFAULT 'generating',
    usage_count INTEGER DEFAULT 0,
    user_rating DECIMAL(3,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dynamic challenges generated by AI
CREATE TABLE cluequest_ai_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id UUID NOT NULL REFERENCES cluequest_scenes(id) ON DELETE CASCADE,
    
    -- Challenge content
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'photo_validation', 'audio_recognition')),
    correct_answer TEXT,
    answer_options JSONB DEFAULT '[]', -- For multiple choice
    
    -- Validation rules
    validation_criteria JSONB DEFAULT '{}',
    time_limit INTEGER DEFAULT 60, -- seconds
    difficulty_level INTEGER DEFAULT 5 CHECK (difficulty_level >= 1 AND difficulty_level <= 10),
    
    -- AI generation details
    ai_provider TEXT NOT NULL,
    generation_prompt TEXT,
    generation_cost DECIMAL(10,4),
    
    -- Adaptation tracking
    success_rate DECIMAL(5,2) DEFAULT 0,
    average_completion_time INTEGER,
    hint_request_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Quality control
    human_reviewed BOOLEAN DEFAULT FALSE,
    accuracy_verified BOOLEAN DEFAULT FALSE,
    inappropriate_content BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- AR/VR ASSETS & EXPERIENCES
-- =============================================================================

-- 3D assets for AR experiences
CREATE TABLE cluequest_ar_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    scene_id UUID REFERENCES cluequest_scenes(id) ON DELETE CASCADE,
    
    -- Asset identity
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'creature', 'object', 'environment', 'effect'
    
    -- 3D model files
    model_url TEXT NOT NULL, -- GLB/GLTF file
    thumbnail_url TEXT,
    texture_urls TEXT[] DEFAULT '{}',
    
    -- Technical specifications
    file_size_bytes INTEGER NOT NULL,
    polygon_count INTEGER,
    texture_resolution TEXT,
    ar_framework_compatibility TEXT[] DEFAULT ARRAY['mind-ar', 'a-frame', 'ar.js'],
    
    -- Optimization
    optimized_for_mobile BOOLEAN DEFAULT TRUE,
    compression_level TEXT DEFAULT 'high',
    loading_priority TEXT DEFAULT 'normal' CHECK (loading_priority IN ('low', 'normal', 'high')),
    
    -- AR positioning
    default_scale DECIMAL(5,3) DEFAULT 1.0,
    anchor_type TEXT DEFAULT 'plane' CHECK (anchor_type IN ('marker', 'plane', 'image', 'face', 'world')),
    positioning_config JSONB DEFAULT '{}',
    
    -- Animation and interaction
    has_animations BOOLEAN DEFAULT FALSE,
    animation_config JSONB DEFAULT '{}',
    interaction_enabled BOOLEAN DEFAULT TRUE,
    
    -- Performance tracking
    load_success_rate DECIMAL(5,2) DEFAULT 0,
    average_load_time_ms INTEGER,
    error_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Licensing and usage
    license_type TEXT DEFAULT 'proprietary',
    attribution TEXT,
    usage_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AR experience templates
CREATE TABLE cluequest_ar_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    scene_id UUID NOT NULL REFERENCES cluequest_scenes(id) ON DELETE CASCADE,
    
    -- Experience definition
    name TEXT NOT NULL,
    description TEXT,
    experience_type TEXT NOT NULL CHECK (experience_type IN ('creature_capture', 'object_interaction', 'environment_exploration', 'puzzle_solving')),
    
    -- AR assets used
    primary_asset_id UUID REFERENCES cluequest_ar_assets(id),
    secondary_assets UUID[] DEFAULT '{}',
    
    -- Interaction design
    interaction_script JSONB NOT NULL, -- Step-by-step interaction flow
    success_criteria JSONB NOT NULL,
    failure_conditions JSONB DEFAULT '[]',
    
    -- User guidance
    tutorial_enabled BOOLEAN DEFAULT TRUE,
    help_text TEXT,
    gesture_instructions JSONB DEFAULT '[]',
    
    -- Performance configuration
    max_duration INTEGER DEFAULT 300, -- seconds
    auto_timeout BOOLEAN DEFAULT TRUE,
    resource_cleanup BOOLEAN DEFAULT TRUE,
    
    -- Metrics
    completion_rate DECIMAL(5,2) DEFAULT 0,
    user_satisfaction DECIMAL(3,2) DEFAULT 0,
    error_rate DECIMAL(5,2) DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(scene_id)
);

-- =============================================================================
-- REAL-TIME EVENTS & ANALYTICS
-- =============================================================================

-- Real-time events for live gameplay
CREATE TABLE cluequest_real_time_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES cluequest_game_sessions(id) ON DELETE CASCADE,
    player_id UUID REFERENCES cluequest_player_states(id) ON DELETE CASCADE,
    team_id UUID REFERENCES cluequest_teams(id) ON DELETE CASCADE,
    
    -- Event details
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL,
    event_source TEXT NOT NULL, -- 'player_action', 'system_trigger', 'admin_control'
    
    -- Context
    scene_id UUID REFERENCES cluequest_scenes(id),
    challenge_id UUID REFERENCES cluequest_ai_challenges(id),
    
    -- Timing
    occurred_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    
    -- Broadcasting
    broadcast_to TEXT[] DEFAULT '{}', -- 'all_players', 'team_only', 'admins_only'
    broadcast_sent BOOLEAN DEFAULT FALSE,
    
    -- Performance tracking
    processing_time_ms INTEGER,
    delivery_success BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance analytics for adventures
CREATE TABLE cluequest_adventure_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    
    -- Time period for analytics
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Participation metrics
    total_sessions INTEGER DEFAULT 0,
    total_participants INTEGER DEFAULT 0,
    average_participants_per_session DECIMAL(10,2) DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Performance metrics
    average_completion_time INTEGER, -- minutes
    fastest_completion_time INTEGER,
    slowest_completion_time INTEGER,
    
    -- Engagement metrics
    scenes_completion_rate JSONB DEFAULT '{}', -- Per scene completion rates
    hint_usage_rate DECIMAL(5,2) DEFAULT 0,
    retry_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Quality metrics
    user_satisfaction DECIMAL(3,2) DEFAULT 0,
    nps_score INTEGER, -- Net Promoter Score
    bug_reports INTEGER DEFAULT 0,
    
    -- Technical metrics
    average_load_time_ms INTEGER,
    error_rate DECIMAL(5,2) DEFAULT 0,
    fraud_detection_rate DECIMAL(5,2) DEFAULT 0,
    
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- FRAUD DETECTION & SECURITY
-- =============================================================================

-- Fraud detection patterns and ML models
CREATE TABLE cluequest_fraud_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern_name TEXT NOT NULL UNIQUE,
    pattern_type TEXT NOT NULL CHECK (pattern_type IN ('time_anomaly', 'location_spoofing', 'device_switching', 'behavioral_anomaly')),
    
    -- Detection criteria
    detection_rules JSONB NOT NULL,
    risk_score_weight INTEGER DEFAULT 10, -- How much this pattern contributes to risk score
    auto_action TEXT DEFAULT 'flag' CHECK (auto_action IN ('ignore', 'flag', 'warn', 'suspend')),
    
    -- ML model configuration
    model_config JSONB DEFAULT '{}',
    accuracy_rate DECIMAL(5,2),
    false_positive_rate DECIMAL(5,2),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_trained_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fraud incidents and investigations
CREATE TABLE cluequest_fraud_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES cluequest_game_sessions(id) ON DELETE CASCADE,
    player_id UUID REFERENCES cluequest_player_states(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    
    -- Incident details
    incident_type TEXT NOT NULL,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    confidence_level DECIMAL(5,2) NOT NULL, -- ML model confidence
    
    -- Detection details
    patterns_matched TEXT[] DEFAULT '{}',
    triggering_event_id UUID REFERENCES cluequest_real_time_events(id),
    evidence JSONB NOT NULL,
    
    -- Investigation
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'confirmed', 'false_positive', 'resolved')),
    investigated_by UUID REFERENCES auth.users(id),
    investigation_notes TEXT,
    action_taken TEXT,
    
    -- Resolution
    is_confirmed_fraud BOOLEAN,
    resolution TEXT,
    resolved_at TIMESTAMPTZ,
    
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- PERFORMANCE INDEXES FOR ADVENTURE DOMAIN
-- =============================================================================

-- Adventure indexes for fast queries
CREATE INDEX idx_adventures_org_status ON cluequest_adventures(organization_id, status);
CREATE INDEX idx_adventures_creator ON cluequest_adventures(creator_id, created_at DESC);
CREATE INDEX idx_adventures_category ON cluequest_adventures(category, difficulty, is_public);
CREATE INDEX idx_adventures_scheduled ON cluequest_adventures(scheduled_start, scheduled_end) 
    WHERE status IN ('published', 'active');
CREATE INDEX idx_adventures_public ON cluequest_adventures(is_public, rating DESC) 
    WHERE is_public = TRUE AND status = 'published';

-- Scene indexes for adventure flow
CREATE INDEX idx_scenes_adventure_order ON cluequest_scenes(adventure_id, order_index);
CREATE INDEX idx_scenes_qr_required ON cluequest_scenes(adventure_id) WHERE qr_code_required = TRUE;
CREATE INDEX idx_scenes_location ON cluequest_scenes USING GIST(location) WHERE location IS NOT NULL;
CREATE INDEX idx_scenes_interaction ON cluequest_scenes(interaction_type, adventure_id);

-- Game session indexes for live performance
CREATE INDEX idx_game_sessions_active ON cluequest_game_sessions(status, active_participants DESC) 
    WHERE status IN ('active', 'starting');
CREATE INDEX idx_game_sessions_org ON cluequest_game_sessions(organization_id, created_at DESC);
CREATE INDEX idx_game_sessions_code ON cluequest_game_sessions(session_code) WHERE status != 'completed';
CREATE INDEX idx_game_sessions_scheduled ON cluequest_game_sessions(scheduled_start, status);

-- Player state indexes for real-time queries (CRITICAL PERFORMANCE)
CREATE INDEX idx_player_states_session ON cluequest_player_states(session_id, status);
CREATE INDEX idx_player_states_user ON cluequest_player_states(user_id, session_id);
CREATE INDEX idx_player_states_team ON cluequest_player_states(team_id) WHERE team_id IS NOT NULL;
CREATE INDEX idx_player_states_location ON cluequest_player_states USING GIST(current_location) 
    WHERE current_location IS NOT NULL;
CREATE INDEX idx_player_states_active ON cluequest_player_states(session_id, last_activity_at DESC) 
    WHERE status = 'active';

-- QR security indexes (HIGH-FREQUENCY LOOKUPS)
CREATE INDEX idx_qr_codes_token ON cluequest_qr_codes(token, expires_at) WHERE expires_at > NOW();
CREATE INDEX idx_qr_codes_session ON cluequest_qr_codes(session_id, scene_id);
CREATE INDEX idx_qr_scans_player_time ON cluequest_qr_scans(player_id, scanned_at DESC);
CREATE INDEX idx_qr_scans_session_time ON cluequest_qr_scans(session_id, scanned_at DESC);
CREATE INDEX idx_qr_scans_fraud ON cluequest_qr_scans(is_suspicious, fraud_risk_score DESC) 
    WHERE is_suspicious = TRUE;

-- AI content indexes for caching optimization
CREATE INDEX idx_ai_avatars_user ON cluequest_ai_avatars(user_id, created_at DESC);
CREATE INDEX idx_ai_avatars_session ON cluequest_ai_avatars(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX idx_ai_avatars_style ON cluequest_ai_avatars(style, status) WHERE status = 'moderated';
CREATE INDEX idx_ai_narratives_adventure ON cluequest_ai_narratives(adventure_id, scene_id);
CREATE INDEX idx_ai_challenges_scene ON cluequest_ai_challenges(scene_id, difficulty_level);

-- Real-time event indexes for performance
CREATE INDEX idx_real_time_events_session ON cluequest_real_time_events(session_id, occurred_at DESC);
CREATE INDEX idx_real_time_events_player ON cluequest_real_time_events(player_id, occurred_at DESC);
CREATE INDEX idx_real_time_events_type ON cluequest_real_time_events(event_type, session_id, occurred_at DESC);
CREATE INDEX idx_real_time_events_unprocessed ON cluequest_real_time_events(processed_at) 
    WHERE processed_at IS NULL;

-- Fraud detection indexes for security
CREATE INDEX idx_fraud_incidents_session ON cluequest_fraud_incidents(session_id, detected_at DESC);
CREATE INDEX idx_fraud_incidents_risk ON cluequest_fraud_incidents(risk_score DESC, status);
CREATE INDEX idx_fraud_incidents_pending ON cluequest_fraud_incidents(status, detected_at DESC) 
    WHERE status IN ('pending', 'investigating');

-- Analytics indexes for reporting
CREATE INDEX idx_adventure_analytics_period ON cluequest_adventure_analytics(adventure_id, period_start, period_end);
CREATE INDEX idx_adventure_analytics_org ON cluequest_adventure_analytics(organization_id, period_start DESC);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all new adventure tables
ALTER TABLE cluequest_adventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_adventure_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_player_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_qr_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_ai_avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_ai_narratives ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_ai_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_ar_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_ar_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_real_time_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_adventure_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_fraud_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_fraud_incidents ENABLE ROW LEVEL SECURITY;

-- Adventures: Organization members can manage their adventures
CREATE POLICY "Organization members can view adventures" ON cluequest_adventures
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id 
            FROM cluequest_organization_members 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
        OR is_public = TRUE
    );

CREATE POLICY "Organization admins can manage adventures" ON cluequest_adventures
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id 
            FROM cluequest_organization_members 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin') 
            AND is_active = TRUE
        )
    );

-- Scenes: Linked to adventure permissions
CREATE POLICY "Adventure viewers can see scenes" ON cluequest_scenes
    FOR SELECT USING (
        adventure_id IN (
            SELECT id FROM cluequest_adventures 
            WHERE organization_id IN (
                SELECT organization_id 
                FROM cluequest_organization_members 
                WHERE user_id = auth.uid() AND is_active = TRUE
            ) OR is_public = TRUE
        )
    );

-- Game sessions: Host and participants can access
CREATE POLICY "Session participants can view session" ON cluequest_game_sessions
    FOR SELECT USING (
        host_user_id = auth.uid()
        OR id IN (
            SELECT session_id 
            FROM cluequest_player_states 
            WHERE user_id = auth.uid()
        )
        OR organization_id IN (
            SELECT organization_id 
            FROM cluequest_organization_members 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- Player states: Players can view their own state and session participants
CREATE POLICY "Players can view session player states" ON cluequest_player_states
    FOR SELECT USING (
        user_id = auth.uid()
        OR session_id IN (
            SELECT session_id 
            FROM cluequest_player_states 
            WHERE user_id = auth.uid()
        )
    );

-- QR codes: Session participants can access QR codes
CREATE POLICY "Session participants can access QR codes" ON cluequest_qr_codes
    FOR SELECT USING (
        session_id IN (
            SELECT session_id 
            FROM cluequest_player_states 
            WHERE user_id = auth.uid()
        )
    );

-- AI avatars: Users can view their own avatars
CREATE POLICY "Users can manage own avatars" ON cluequest_ai_avatars
    FOR ALL USING (user_id = auth.uid());

-- Real-time events: Session participants can view events
CREATE POLICY "Session participants can view events" ON cluequest_real_time_events
    FOR SELECT USING (
        session_id IN (
            SELECT session_id 
            FROM cluequest_player_states 
            WHERE user_id = auth.uid()
        )
    );

-- =============================================================================
-- OPTIMIZED RPC FUNCTIONS FOR ADVENTURE GAMEPLAY
-- =============================================================================

-- Get complete adventure data with scenes and roles
CREATE OR REPLACE FUNCTION get_adventure_complete(adventure_id_param UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'adventure', (
            SELECT row_to_json(a) 
            FROM cluequest_adventures a 
            WHERE a.id = adventure_id_param
        ),
        'scenes', (
            SELECT COALESCE(jsonb_agg(
                row_to_json(s) 
                ORDER BY s.order_index
            ), '[]'::jsonb)
            FROM cluequest_scenes s
            WHERE s.adventure_id = adventure_id_param
        ),
        'roles', (
            SELECT COALESCE(jsonb_agg(row_to_json(r)), '[]'::jsonb)
            FROM cluequest_adventure_roles r
            WHERE r.adventure_id = adventure_id_param
        ),
        'ar_assets', (
            SELECT COALESCE(jsonb_agg(row_to_json(ar)), '[]'::jsonb)
            FROM cluequest_ar_assets ar
            WHERE ar.adventure_id = adventure_id_param
        )
    ) INTO result;
    
    RETURN result;
END;
$$;

-- Get live session state for real-time dashboard
CREATE OR REPLACE FUNCTION get_session_live_state(session_id_param UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'session', (
            SELECT row_to_json(gs) 
            FROM cluequest_game_sessions gs 
            WHERE gs.id = session_id_param
        ),
        'players', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', ps.id,
                    'display_name', ps.display_name,
                    'avatar_url', ps.avatar_url,
                    'current_scene', ps.current_scene_id,
                    'total_score', ps.total_score,
                    'status', ps.status,
                    'last_activity', ps.last_activity_at,
                    'location', ps.current_location
                )
                ORDER BY ps.total_score DESC
            ), '[]'::jsonb)
            FROM cluequest_player_states ps
            WHERE ps.session_id = session_id_param
        ),
        'teams', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', t.id,
                    'name', t.name,
                    'total_score', t.total_score,
                    'current_members', t.current_members,
                    'leader_id', t.leader_id
                )
                ORDER BY t.total_score DESC
            ), '[]'::jsonb)
            FROM cluequest_teams t
            WHERE t.session_id = session_id_param AND t.is_active = TRUE
        ),
        'recent_events', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'type', rte.event_type,
                    'data', rte.event_data,
                    'occurred_at', rte.occurred_at,
                    'player_id', rte.player_id
                )
                ORDER BY rte.occurred_at DESC
            ), '[]'::jsonb)
            FROM cluequest_real_time_events rte
            WHERE rte.session_id = session_id_param
            AND rte.occurred_at >= NOW() - INTERVAL '1 hour'
            LIMIT 50
        )
    ) INTO result;
    
    RETURN result;
END;
$$;

-- Generate secure QR token with HMAC
CREATE OR REPLACE FUNCTION generate_secure_qr_token(
    scene_id_param UUID,
    session_id_param UUID,
    expires_in_minutes INTEGER DEFAULT 60
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    token_data JSONB;
    hmac_signature TEXT;
    qr_record RECORD;
BEGIN
    -- Create token payload
    token_data := jsonb_build_object(
        'scene_id', scene_id_param,
        'session_id', session_id_param,
        'timestamp', EXTRACT(EPOCH FROM NOW()),
        'expires_at', EXTRACT(EPOCH FROM (NOW() + (expires_in_minutes * INTERVAL '1 minute'))),
        'nonce', gen_random_uuid()
    );
    
    -- Generate HMAC signature (using PostgreSQL's hmac function)
    hmac_signature := encode(
        hmac(token_data::text::bytea, current_setting('app.qr_secret')::bytea, 'sha256'),
        'hex'
    );
    
    -- Insert QR code record
    INSERT INTO cluequest_qr_codes (
        scene_id,
        session_id,
        token,
        hmac_signature,
        secret_key,
        expires_at,
        required_location
    )
    SELECT 
        scene_id_param,
        session_id_param,
        encode(token_data::text::bytea, 'base64'),
        hmac_signature,
        gen_random_uuid()::text,
        NOW() + (expires_in_minutes * INTERVAL '1 minute'),
        s.location
    FROM cluequest_scenes s
    WHERE s.id = scene_id_param
    RETURNING * INTO qr_record;
    
    RETURN jsonb_build_object(
        'qr_id', qr_record.id,
        'token', qr_record.token,
        'signature', qr_record.hmac_signature,
        'expires_at', qr_record.expires_at,
        'qr_url', format('cluequest://scan?token=%s&sig=%s', qr_record.token, qr_record.hmac_signature)
    );
END;
$$;

-- Validate QR scan with comprehensive security checks
CREATE OR REPLACE FUNCTION validate_qr_scan(
    token_param TEXT,
    signature_param TEXT,
    player_location JSONB,
    ip_address_param INET,
    device_fingerprint TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    qr_record RECORD;
    validation_result JSONB;
    distance_meters DECIMAL(10,2);
    risk_score INTEGER := 0;
    fraud_indicators TEXT[] := '{}';
BEGIN
    -- Find QR code record
    SELECT * INTO qr_record
    FROM cluequest_qr_codes
    WHERE token = token_param AND hmac_signature = signature_param;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'valid', FALSE,
            'error', 'invalid_token',
            'message', 'QR code not found or signature mismatch'
        );
    END IF;
    
    -- Check expiration
    IF qr_record.expires_at < NOW() THEN
        RETURN jsonb_build_object(
            'valid', FALSE,
            'error', 'expired',
            'message', 'QR code has expired'
        );
    END IF;
    
    -- Validate location if required
    IF qr_record.required_location IS NOT NULL AND player_location IS NOT NULL THEN
        -- Calculate distance using PostGIS or simple lat/lng calculation
        distance_meters := ST_Distance(
            ST_GeogFromGeoJSON(qr_record.required_location),
            ST_GeogFromGeoJSON(player_location)
        );
        
        IF distance_meters > qr_record.proximity_tolerance THEN
            -- Increase fraud risk for location mismatch
            risk_score := risk_score + 30;
            fraud_indicators := fraud_indicators || 'location_too_far';
        END IF;
    END IF;
    
    -- Check rate limiting
    IF (
        SELECT COUNT(*) 
        FROM cluequest_qr_scans 
        WHERE qr_code_id = qr_record.id 
        AND scanned_at >= NOW() - INTERVAL '1 minute'
    ) > qr_record.rate_limit_per_user THEN
        risk_score := risk_score + 50;
        fraud_indicators := fraud_indicators || 'rate_limit_exceeded';
    END IF;
    
    -- Record the scan attempt
    INSERT INTO cluequest_qr_scans (
        qr_code_id,
        session_id,
        player_id,
        scan_location,
        ip_address,
        device_fingerprint,
        is_valid,
        validation_errors,
        distance_from_target,
        fraud_risk_score,
        fraud_indicators,
        is_suspicious
    )
    SELECT 
        qr_record.id,
        qr_record.session_id,
        ps.id,
        player_location,
        ip_address_param,
        device_fingerprint,
        risk_score < 70, -- Valid if risk is low
        CASE WHEN risk_score >= 70 THEN to_jsonb(fraud_indicators) ELSE '[]'::jsonb END,
        distance_meters,
        risk_score,
        fraud_indicators,
        risk_score >= 70
    FROM cluequest_player_states ps
    WHERE ps.session_id = qr_record.session_id 
    AND ps.user_id = auth.uid()
    LIMIT 1;
    
    -- Update QR scan count
    UPDATE cluequest_qr_codes 
    SET scan_count = scan_count + 1
    WHERE id = qr_record.id;
    
    RETURN jsonb_build_object(
        'valid', risk_score < 70,
        'risk_score', risk_score,
        'distance_meters', distance_meters,
        'fraud_indicators', fraud_indicators,
        'scene_id', qr_record.scene_id,
        'message', CASE 
            WHEN risk_score < 70 THEN 'Scan successful'
            ELSE 'Scan flagged for review'
        END
    );
END;
$$;

-- =============================================================================
-- TRIGGERS FOR REAL-TIME UPDATES
-- =============================================================================

-- Function to broadcast real-time events
CREATE OR REPLACE FUNCTION broadcast_realtime_event()
RETURNS TRIGGER AS $$
DECLARE
    event_data JSONB;
BEGIN
    -- Determine event type based on table and action
    IF TG_TABLE_NAME = 'cluequest_player_states' THEN
        event_data := jsonb_build_object(
            'type', 'player_state_updated',
            'session_id', COALESCE(NEW.session_id, OLD.session_id),
            'player_id', COALESCE(NEW.user_id, OLD.user_id),
            'data', CASE 
                WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
                ELSE to_jsonb(NEW)
            END
        );
    ELSIF TG_TABLE_NAME = 'cluequest_game_sessions' THEN
        event_data := jsonb_build_object(
            'type', 'session_updated',
            'session_id', COALESCE(NEW.id, OLD.id),
            'data', CASE 
                WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
                ELSE to_jsonb(NEW)
            END
        );
    END IF;
    
    -- Insert real-time event for broadcasting
    INSERT INTO cluequest_real_time_events (
        session_id,
        event_type,
        event_data,
        event_source,
        occurred_at
    ) VALUES (
        (event_data->>'session_id')::UUID,
        event_data->>'type',
        event_data->'data',
        'system_trigger',
        NOW()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply real-time triggers to critical tables
CREATE TRIGGER trigger_player_states_realtime
    AFTER INSERT OR UPDATE OR DELETE ON cluequest_player_states
    FOR EACH ROW EXECUTE FUNCTION broadcast_realtime_event();

CREATE TRIGGER trigger_game_sessions_realtime
    AFTER UPDATE ON cluequest_game_sessions
    FOR EACH ROW EXECUTE FUNCTION broadcast_realtime_event();

-- Update adventure statistics on session completion
CREATE OR REPLACE FUNCTION update_adventure_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE cluequest_adventures 
        SET 
            total_sessions = total_sessions + 1,
            total_participants = total_participants + NEW.active_participants,
            average_completion_time = (
                SELECT AVG(EXTRACT(EPOCH FROM (actual_end - actual_start)) / 60)
                FROM cluequest_game_sessions 
                WHERE adventure_id = NEW.adventure_id 
                AND status = 'completed'
            ),
            completion_rate = NEW.completion_rate,
            updated_at = NOW()
        WHERE id = NEW.adventure_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_adventure_stats
    AFTER UPDATE ON cluequest_game_sessions
    FOR EACH ROW EXECUTE FUNCTION update_adventure_stats();

-- =============================================================================
-- VIEWS FOR COMMON QUERIES
-- =============================================================================

-- Live leaderboard view for real-time updates
CREATE VIEW cluequest_live_leaderboard AS
SELECT 
    ps.session_id,
    ps.user_id,
    ps.display_name,
    ps.avatar_url,
    ps.team_id,
    t.name as team_name,
    ps.total_score,
    ps.bonus_points,
    ps.scenes_completed,
    ps.completion_time,
    ps.hints_used,
    ps.status,
    ps.last_activity_at,
    RANK() OVER (
        PARTITION BY ps.session_id 
        ORDER BY ps.total_score DESC, ps.completion_time ASC
    ) as rank,
    ROW_NUMBER() OVER (
        PARTITION BY ps.session_id 
        ORDER BY ps.last_activity_at DESC
    ) as activity_rank
FROM cluequest_player_states ps
LEFT JOIN cluequest_teams t ON ps.team_id = t.id
WHERE ps.status IN ('active', 'completed');

-- Adventure performance metrics view
CREATE VIEW cluequest_adventure_metrics AS
SELECT 
    a.id as adventure_id,
    a.title,
    a.category,
    a.difficulty,
    a.total_sessions,
    a.total_participants,
    a.completion_rate,
    a.rating,
    COUNT(gs.id) as sessions_last_30_days,
    AVG(gs.completion_rate) as avg_completion_rate,
    AVG(EXTRACT(EPOCH FROM (gs.actual_end - gs.actual_start)) / 60) as avg_session_duration,
    COUNT(DISTINCT ps.user_id) as unique_players_last_30_days
FROM cluequest_adventures a
LEFT JOIN cluequest_game_sessions gs ON a.id = gs.adventure_id 
    AND gs.created_at >= CURRENT_DATE - INTERVAL '30 days'
    AND gs.status = 'completed'
LEFT JOIN cluequest_player_states ps ON gs.id = ps.session_id
GROUP BY a.id, a.title, a.category, a.difficulty, a.total_sessions, a.total_participants, a.completion_rate, a.rating;

-- Security incident summary view
CREATE VIEW cluequest_security_summary AS
SELECT 
    fi.session_id,
    fi.organization_id,
    COUNT(*) as total_incidents,
    COUNT(*) FILTER (WHERE fi.is_confirmed_fraud = TRUE) as confirmed_fraud,
    COUNT(*) FILTER (WHERE fi.status = 'pending') as pending_investigation,
    AVG(fi.risk_score) as average_risk_score,
    MAX(fi.detected_at) as last_incident,
    array_agg(DISTINCT fi.incident_type) as incident_types
FROM cluequest_fraud_incidents fi
WHERE fi.detected_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY fi.session_id, fi.organization_id;

COMMENT ON SCHEMA public IS 'ClueQuest Adventure System - Complete interactive scavenger hunt platform with AI content generation, AR experiences, real-time multiplayer, and enterprise-grade security. Built on proven SaaS patterns with mobile-first optimization.';