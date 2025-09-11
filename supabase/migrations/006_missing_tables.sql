-- ClueQuest Missing Tables Migration
-- Completes the database schema with missing tables and columns

-- =============================================================================
-- MISSING CORE TABLES
-- =============================================================================

-- User activities tracking
CREATE TABLE IF NOT EXISTS cluequest_user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    activity_data JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adventure participations tracking
CREATE TABLE IF NOT EXISTS cluequest_adventure_participations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID, -- Will add FK constraint later if cluequest_game_sessions exists
    participation_type TEXT DEFAULT 'player' CHECK (participation_type IN ('player', 'spectator', 'host', 'co_host')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    completion_status TEXT DEFAULT 'active' CHECK (completion_status IN ('active', 'completed', 'abandoned', 'disqualified')),
    final_score INTEGER DEFAULT 0,
    completion_time INTEGER, -- seconds
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(adventure_id, user_id, session_id)
);

-- User scores tracking
CREATE TABLE IF NOT EXISTS cluequest_user_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    adventure_id UUID REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    session_id UUID, -- Will add FK constraint later if cluequest_game_sessions exists
    score_type TEXT NOT NULL CHECK (score_type IN ('total', 'scene', 'bonus', 'penalty', 'team')),
    score_value INTEGER NOT NULL DEFAULT 0,
    score_source TEXT, -- 'qr_scan', 'challenge_completion', 'hint_used', etc.
    metadata JSONB DEFAULT '{}',
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- MISSING COLUMNS
-- =============================================================================

-- Add status column to QR codes table
ALTER TABLE cluequest_qr_codes 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired', 'revoked'));

-- =============================================================================
-- PERFORMANCE INDEXES
-- =============================================================================

-- User activities indexes
CREATE INDEX IF NOT EXISTS idx_user_activities_user ON cluequest_user_activities(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_org ON cluequest_user_activities(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON cluequest_user_activities(activity_type, created_at DESC);

-- Adventure participations indexes
CREATE INDEX IF NOT EXISTS idx_adventure_participations_user ON cluequest_adventure_participations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_adventure_participations_adventure ON cluequest_adventure_participations(adventure_id, completion_status);
CREATE INDEX IF NOT EXISTS idx_adventure_participations_session ON cluequest_adventure_participations(session_id, completion_status);

-- User scores indexes
CREATE INDEX IF NOT EXISTS idx_user_scores_user ON cluequest_user_scores(user_id, earned_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_scores_adventure ON cluequest_user_scores(adventure_id, score_type);
CREATE INDEX IF NOT EXISTS idx_user_scores_session ON cluequest_user_scores(session_id, score_type);

-- QR codes status index (conditional - only if expires_at column exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'expires_at'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_qr_codes_status ON cluequest_qr_codes(status, expires_at) WHERE status = 'active';
        RAISE NOTICE 'QR codes status index created with expires_at column';
    ELSE
        CREATE INDEX IF NOT EXISTS idx_qr_codes_status_simple ON cluequest_qr_codes(status) WHERE status = 'active';
        RAISE NOTICE 'QR codes status index created without expires_at column';
    END IF;
END $$;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on new tables
ALTER TABLE cluequest_user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_adventure_participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_user_scores ENABLE ROW LEVEL SECURITY;

-- User activities policies
DROP POLICY IF EXISTS "Users can view own activities" ON cluequest_user_activities;
CREATE POLICY "Users can view own activities" ON cluequest_user_activities
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own activities" ON cluequest_user_activities;
CREATE POLICY "Users can insert own activities" ON cluequest_user_activities
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Adventure participations policies
DROP POLICY IF EXISTS "Users can view own participations" ON cluequest_adventure_participations;
CREATE POLICY "Users can view own participations" ON cluequest_adventure_participations
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own participations" ON cluequest_adventure_participations;
CREATE POLICY "Users can insert own participations" ON cluequest_adventure_participations
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- User scores policies
DROP POLICY IF EXISTS "Users can view own scores" ON cluequest_user_scores;
CREATE POLICY "Users can view own scores" ON cluequest_user_scores
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own scores" ON cluequest_user_scores;
CREATE POLICY "Users can insert own scores" ON cluequest_user_scores
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================================================

-- Update timestamps trigger for participations
DROP TRIGGER IF EXISTS update_adventure_participations_updated_at ON cluequest_adventure_participations;
CREATE TRIGGER update_adventure_participations_updated_at 
    BEFORE UPDATE ON cluequest_adventure_participations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Get user activity summary
CREATE OR REPLACE FUNCTION get_user_activity_summary(user_id_param UUID, days_back INTEGER DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_activities', COUNT(*),
        'activity_types', (
            SELECT COALESCE(jsonb_object_agg(activity_type, type_count), '{}'::jsonb)
            FROM (
                SELECT activity_type, COUNT(*) as type_count
                FROM cluequest_user_activities
                WHERE user_id = user_id_param
                AND created_at >= CURRENT_DATE - (days_back || ' days')::INTERVAL
                GROUP BY activity_type
            ) activity_breakdown
        ),
        'recent_activities', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'type', activity_type,
                    'data', activity_data,
                    'created_at', created_at
                )
                ORDER BY created_at DESC
            ), '[]'::jsonb)
            FROM cluequest_user_activities
            WHERE user_id = user_id_param
            AND created_at >= CURRENT_DATE - (days_back || ' days')::INTERVAL
            LIMIT 10
        )
    ) INTO result
    FROM cluequest_user_activities
    WHERE user_id = user_id_param
    AND created_at >= CURRENT_DATE - (days_back || ' days')::INTERVAL;
    
    RETURN result;
END;
$$;

-- Get user score summary
CREATE OR REPLACE FUNCTION get_user_score_summary(user_id_param UUID, days_back INTEGER DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_score', COALESCE(SUM(score_value), 0),
        'score_breakdown', (
            SELECT COALESCE(jsonb_object_agg(score_type, type_total), '{}'::jsonb)
            FROM (
                SELECT score_type, SUM(score_value) as type_total
                FROM cluequest_user_scores
                WHERE user_id = user_id_param
                AND earned_at >= CURRENT_DATE - (days_back || ' days')::INTERVAL
                GROUP BY score_type
            ) score_breakdown
        ),
        'recent_scores', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'type', score_type,
                    'value', score_value,
                    'source', score_source,
                    'earned_at', earned_at
                )
                ORDER BY earned_at DESC
            ), '[]'::jsonb)
            FROM cluequest_user_scores
            WHERE user_id = user_id_param
            AND earned_at >= CURRENT_DATE - (days_back || ' days')::INTERVAL
            LIMIT 10
        )
    ) INTO result
    FROM cluequest_user_scores
    WHERE user_id = user_id_param
    AND earned_at >= CURRENT_DATE - (days_back || ' days')::INTERVAL;
    
    RETURN result;
END;
$$;

-- =============================================================================
-- CONDITIONAL FOREIGN KEY CONSTRAINTS
-- =============================================================================

-- Add foreign key constraints only if the referenced tables exist
DO $$
BEGIN
    -- Add FK constraint for cluequest_game_sessions if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cluequest_game_sessions') THEN
        -- Add FK constraint to adventure_participations
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'cluequest_adventure_participations_session_id_fkey'
        ) THEN
            ALTER TABLE cluequest_adventure_participations 
            ADD CONSTRAINT cluequest_adventure_participations_session_id_fkey 
            FOREIGN KEY (session_id) REFERENCES cluequest_game_sessions(id) ON DELETE CASCADE;
        END IF;
        
        -- Add FK constraint to user_scores
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'cluequest_user_scores_session_id_fkey'
        ) THEN
            ALTER TABLE cluequest_user_scores 
            ADD CONSTRAINT cluequest_user_scores_session_id_fkey 
            FOREIGN KEY (session_id) REFERENCES cluequest_game_sessions(id) ON DELETE CASCADE;
        END IF;
        
        RAISE NOTICE 'Foreign key constraints added for cluequest_game_sessions';
    ELSE
        RAISE NOTICE 'cluequest_game_sessions table does not exist - skipping FK constraints';
    END IF;
END $$;

COMMENT ON SCHEMA public IS 'ClueQuest Missing Tables Migration - Completes the database schema with user activities, participations, scores tracking, and QR code status management.';
