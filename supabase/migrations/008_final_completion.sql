-- ClueQuest Final Completion Migration
-- Completes the database setup with missing function and final touches

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
-- TRIGGERS (IDEMPOTENT)
-- =============================================================================

-- Update timestamps trigger for QR codes (idempotent)
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

-- Update timestamps trigger for participations (idempotent)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'cluequest_adventure_participations'
    ) THEN
        DROP TRIGGER IF EXISTS update_adventure_participations_updated_at ON cluequest_adventure_participations;
        CREATE TRIGGER update_adventure_participations_updated_at 
            BEFORE UPDATE ON cluequest_adventure_participations
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Created update trigger for adventure participations';
    END IF;
END $$;

-- =============================================================================
-- POLICIES RLS (IDEMPOTENT)
-- =============================================================================

-- User activities policies (idempotent)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'cluequest_user_activities'
    ) THEN
        DROP POLICY IF EXISTS "Users can view own activities" ON cluequest_user_activities;
        CREATE POLICY "Users can view own activities" ON cluequest_user_activities
            FOR SELECT USING (user_id = auth.uid());

        DROP POLICY IF EXISTS "Users can insert own activities" ON cluequest_user_activities;
        CREATE POLICY "Users can insert own activities" ON cluequest_user_activities
            FOR INSERT WITH CHECK (user_id = auth.uid());
        
        RAISE NOTICE 'Created RLS policies for user activities';
    END IF;
END $$;

-- Adventure participations policies (idempotent)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'cluequest_adventure_participations'
    ) THEN
        DROP POLICY IF EXISTS "Users can view own participations" ON cluequest_adventure_participations;
        CREATE POLICY "Users can view own participations" ON cluequest_adventure_participations
            FOR SELECT USING (user_id = auth.uid());

        DROP POLICY IF EXISTS "Users can insert own participations" ON cluequest_adventure_participations;
        CREATE POLICY "Users can insert own participations" ON cluequest_adventure_participations
            FOR INSERT WITH CHECK (user_id = auth.uid());
        
        RAISE NOTICE 'Created RLS policies for adventure participations';
    END IF;
END $$;

-- User scores policies (idempotent)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'cluequest_user_scores'
    ) THEN
        DROP POLICY IF EXISTS "Users can view own scores" ON cluequest_user_scores;
        CREATE POLICY "Users can view own scores" ON cluequest_user_scores
            FOR SELECT USING (user_id = auth.uid());

        DROP POLICY IF EXISTS "Users can insert own scores" ON cluequest_user_scores;
        CREATE POLICY "Users can insert own scores" ON cluequest_user_scores
            FOR INSERT WITH CHECK (user_id = auth.uid());
        
        RAISE NOTICE 'Created RLS policies for user scores';
    END IF;
END $$;

-- =============================================================================
-- FINAL VERIFICATION
-- =============================================================================

-- Verify all components are working
DO $$
DECLARE
    table_count INTEGER;
    function_exists BOOLEAN;
    trigger_count INTEGER;
    policy_count INTEGER;
BEGIN
    -- Count tables
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_name LIKE 'cluequest_%';
    
    -- Check function exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.routines 
        WHERE routine_name = 'update_updated_at_column'
    ) INTO function_exists;
    
    -- Count triggers
    SELECT COUNT(*) INTO trigger_count
    FROM information_schema.triggers 
    WHERE trigger_name LIKE '%updated_at%';
    
    -- Count policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE tablename LIKE 'cluequest_%';
    
    RAISE NOTICE '=== FINAL VERIFICATION ===';
    RAISE NOTICE 'Tables: %', table_count;
    RAISE NOTICE 'Function exists: %', function_exists;
    RAISE NOTICE 'Triggers: %', trigger_count;
    RAISE NOTICE 'Policies: %', policy_count;
    
    IF table_count >= 10 AND function_exists AND trigger_count >= 2 AND policy_count >= 6 THEN
        RAISE NOTICE '🎉 MIGRATION COMPLETED SUCCESSFULLY!';
        RAISE NOTICE 'Database is ready for production';
    ELSE
        RAISE NOTICE '⚠️ Some components may be missing';
    END IF;
END $$;

COMMENT ON SCHEMA public IS 'ClueQuest Final Completion Migration - Completes database setup with idempotent operations for triggers, policies, and functions.';
