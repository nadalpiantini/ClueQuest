-- ClueQuest QR Codes Structure Fix
-- Handles the simplified QR codes table structure and adds missing columns

-- =============================================================================
-- QR CODES STRUCTURE ENHANCEMENT
-- =============================================================================

-- Add missing columns to cluequest_qr_codes table (conditional)
DO $$
BEGIN
    -- Add session_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'session_id'
    ) THEN
        ALTER TABLE cluequest_qr_codes 
        ADD COLUMN session_id UUID;
        RAISE NOTICE 'Added session_id column to cluequest_qr_codes';
    END IF;
    
    -- Add token column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'token'
    ) THEN
        ALTER TABLE cluequest_qr_codes 
        ADD COLUMN token TEXT UNIQUE;
        RAISE NOTICE 'Added token column to cluequest_qr_codes';
    END IF;
    
    -- Add display_text column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'display_text'
    ) THEN
        ALTER TABLE cluequest_qr_codes 
        ADD COLUMN display_text TEXT;
        RAISE NOTICE 'Added display_text column to cluequest_qr_codes';
    END IF;
    
    -- Add hmac_signature column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'hmac_signature'
    ) THEN
        ALTER TABLE cluequest_qr_codes 
        ADD COLUMN hmac_signature TEXT;
        RAISE NOTICE 'Added hmac_signature column to cluequest_qr_codes';
    END IF;
    
    -- Add secret_key column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'secret_key'
    ) THEN
        ALTER TABLE cluequest_qr_codes 
        ADD COLUMN secret_key TEXT;
        RAISE NOTICE 'Added secret_key column to cluequest_qr_codes';
    END IF;
    
    -- Add expires_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'expires_at'
    ) THEN
        ALTER TABLE cluequest_qr_codes 
        ADD COLUMN expires_at TIMESTAMPTZ;
        RAISE NOTICE 'Added expires_at column to cluequest_qr_codes';
    END IF;
    
    -- Add max_scans column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'max_scans'
    ) THEN
        ALTER TABLE cluequest_qr_codes 
        ADD COLUMN max_scans INTEGER DEFAULT 1000;
        RAISE NOTICE 'Added max_scans column to cluequest_qr_codes';
    END IF;
    
    -- Add unique_scan_count column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'unique_scan_count'
    ) THEN
        ALTER TABLE cluequest_qr_codes 
        ADD COLUMN unique_scan_count INTEGER DEFAULT 0;
        RAISE NOTICE 'Added unique_scan_count column to cluequest_qr_codes';
    END IF;
    
    -- Add required_location column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'required_location'
    ) THEN
        ALTER TABLE cluequest_qr_codes 
        ADD COLUMN required_location JSONB;
        RAISE NOTICE 'Added required_location column to cluequest_qr_codes';
    END IF;
    
    -- Add proximity_tolerance column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'proximity_tolerance'
    ) THEN
        ALTER TABLE cluequest_qr_codes 
        ADD COLUMN proximity_tolerance INTEGER DEFAULT 50;
        RAISE NOTICE 'Added proximity_tolerance column to cluequest_qr_codes';
    END IF;
    
    -- Add altitude_tolerance column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'altitude_tolerance'
    ) THEN
        ALTER TABLE cluequest_qr_codes 
        ADD COLUMN altitude_tolerance INTEGER DEFAULT 10;
        RAISE NOTICE 'Added altitude_tolerance column to cluequest_qr_codes';
    END IF;
    
    -- Add rate_limit_per_user column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'rate_limit_per_user'
    ) THEN
        ALTER TABLE cluequest_qr_codes 
        ADD COLUMN rate_limit_per_user INTEGER DEFAULT 1;
        RAISE NOTICE 'Added rate_limit_per_user column to cluequest_qr_codes';
    END IF;
    
    -- Add cooldown_seconds column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'cooldown_seconds'
    ) THEN
        ALTER TABLE cluequest_qr_codes 
        ADD COLUMN cooldown_seconds INTEGER DEFAULT 5;
        RAISE NOTICE 'Added cooldown_seconds column to cluequest_qr_codes';
    END IF;
    
    -- Add device_fingerprint_required column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'device_fingerprint_required'
    ) THEN
        ALTER TABLE cluequest_qr_codes 
        ADD COLUMN device_fingerprint_required BOOLEAN DEFAULT TRUE;
        RAISE NOTICE 'Added device_fingerprint_required column to cluequest_qr_codes';
    END IF;
    
    -- Add ip_validation_enabled column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'ip_validation_enabled'
    ) THEN
        ALTER TABLE cluequest_qr_codes 
        ADD COLUMN ip_validation_enabled BOOLEAN DEFAULT TRUE;
        RAISE NOTICE 'Added ip_validation_enabled column to cluequest_qr_codes';
    END IF;
    
    -- Add active_from column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'active_from'
    ) THEN
        ALTER TABLE cluequest_qr_codes 
        ADD COLUMN active_from TIMESTAMPTZ DEFAULT NOW();
        RAISE NOTICE 'Added active_from column to cluequest_qr_codes';
    END IF;
    
    -- Add active_until column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'active_until'
    ) THEN
        ALTER TABLE cluequest_qr_codes 
        ADD COLUMN active_until TIMESTAMPTZ;
        RAISE NOTICE 'Added active_until column to cluequest_qr_codes';
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE cluequest_qr_codes 
        ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column to cluequest_qr_codes';
    END IF;
    
    -- Add status column if it doesn't exist (this was in the original 006 migration)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE cluequest_qr_codes 
        ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired', 'revoked'));
        RAISE NOTICE 'Added status column to cluequest_qr_codes';
    END IF;
    
    RAISE NOTICE 'QR codes table structure enhancement completed';
END $$;

-- =============================================================================
-- FOREIGN KEY CONSTRAINTS (CONDITIONAL)
-- =============================================================================

-- Add foreign key constraints only if the referenced tables exist
DO $$
BEGIN
    -- Add FK constraint for session_id if cluequest_game_sessions exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cluequest_game_sessions') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'cluequest_qr_codes_session_id_fkey'
        ) THEN
            ALTER TABLE cluequest_qr_codes 
            ADD CONSTRAINT cluequest_qr_codes_session_id_fkey 
            FOREIGN KEY (session_id) REFERENCES cluequest_game_sessions(id) ON DELETE CASCADE;
            RAISE NOTICE 'Added FK constraint for session_id';
        END IF;
    ELSE
        RAISE NOTICE 'cluequest_game_sessions table does not exist - skipping session_id FK constraint';
    END IF;
END $$;

-- =============================================================================
-- INDEXES (CONDITIONAL)
-- =============================================================================

-- Create indexes only if the columns exist
DO $$
BEGIN
    -- QR codes status index with expires_at (if both columns exist)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'status'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'expires_at'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_qr_codes_status_expires ON cluequest_qr_codes(status, expires_at) WHERE status = 'active';
        RAISE NOTICE 'Created QR codes status index with expires_at';
    END IF;
    
    -- QR codes status index without expires_at (if only status exists)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'status'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'expires_at'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_qr_codes_status_simple ON cluequest_qr_codes(status) WHERE status = 'active';
        RAISE NOTICE 'Created QR codes status index without expires_at';
    END IF;
    
    -- QR codes token index (if token column exists)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'token'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_qr_codes_token ON cluequest_qr_codes(token);
        RAISE NOTICE 'Created QR codes token index';
    END IF;
    
    -- QR codes scene_id index
    CREATE INDEX IF NOT EXISTS idx_qr_codes_scene ON cluequest_qr_codes(scene_id);
    RAISE NOTICE 'Created QR codes scene_id index';
    
    -- QR codes session_id index (if session_id column exists)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'session_id'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_qr_codes_session ON cluequest_qr_codes(session_id);
        RAISE NOTICE 'Created QR codes session_id index';
    END IF;
END $$;

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
-- TRIGGERS
-- =============================================================================

-- Update timestamps trigger for QR codes
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'updated_at'
    ) THEN
        -- Drop trigger if it exists, then recreate
        DROP TRIGGER IF EXISTS update_qr_codes_updated_at ON cluequest_qr_codes;
        CREATE TRIGGER update_qr_codes_updated_at 
            BEFORE UPDATE ON cluequest_qr_codes
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Created update trigger for QR codes';
    END IF;
END $$;

COMMENT ON SCHEMA public IS 'ClueQuest QR Codes Structure Fix - Enhances simplified QR codes table with complete structure from migration 002.';
