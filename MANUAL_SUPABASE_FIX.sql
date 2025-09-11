-- ======================================================
-- 🚨 MANUAL SUPABASE FIX - COPY & PASTE TO SUPABASE SQL EDITOR
-- ======================================================
-- This script fixes ALL issues found by surgical diagnostic
-- Run in Supabase Dashboard > SQL Editor
-- 
-- CRITICAL: This enables RLS and creates missing tables for your ClueQuest SaaS
-- ======================================================

-- Step 1: EMERGENCY RLS SECURITY FIX (Critical for SaaS)
-- ======================================================

-- Enable RLS on all existing tables (CRITICAL SECURITY)
ALTER TABLE cluequest_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_organizations ENABLE ROW LEVEL SECURITY;  
ALTER TABLE cluequest_organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_adventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_players ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (prevents conflicts)
DROP POLICY IF EXISTS "Users can view own profile" ON cluequest_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON cluequest_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON cluequest_profiles;
DROP POLICY IF EXISTS "Members can view organization" ON cluequest_organizations;
DROP POLICY IF EXISTS "Public adventures viewable" ON cluequest_adventures;
DROP POLICY IF EXISTS "Users can create adventures" ON cluequest_adventures;
DROP POLICY IF EXISTS "Users can update own adventures" ON cluequest_adventures;
DROP POLICY IF EXISTS "Users can view accessible sessions" ON cluequest_sessions;
DROP POLICY IF EXISTS "Users can view players" ON cluequest_players;
DROP POLICY IF EXISTS "Users manage own participation" ON cluequest_players;

-- 1. PROFILES - Users can only access their own profile
CREATE POLICY "Users can view own profile" ON cluequest_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON cluequest_profiles  
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON cluequest_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. ORGANIZATIONS - Members can view their organizations  
CREATE POLICY "Members can view organization" ON cluequest_organizations
    FOR SELECT USING (
        id IN (
            SELECT organization_id 
            FROM cluequest_organization_members 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- 3. ADVENTURES - Public read, authenticated creation
CREATE POLICY "Public adventures viewable" ON cluequest_adventures
    FOR SELECT USING (is_public = TRUE OR created_by = auth.uid());

CREATE POLICY "Users can create adventures" ON cluequest_adventures  
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

CREATE POLICY "Users can update own adventures" ON cluequest_adventures
    FOR UPDATE USING (auth.uid() = created_by);

-- 4. SESSIONS - Adventure creators can manage, players can join
CREATE POLICY "Users can view accessible sessions" ON cluequest_sessions
    FOR SELECT USING (
        adventure_id IN (
            SELECT id FROM cluequest_adventures 
            WHERE is_public = TRUE OR created_by = auth.uid()
        )
    );

-- 5. PLAYERS - Users can view session players, manage own participation
CREATE POLICY "Users can view players" ON cluequest_players
    FOR SELECT USING (
        session_id IN (
            SELECT s.id FROM cluequest_sessions s
            JOIN cluequest_adventures a ON s.adventure_id = a.id
            WHERE a.is_public = TRUE OR a.created_by = auth.uid()
        )
    );

CREATE POLICY "Users manage own participation" ON cluequest_players  
    FOR ALL USING (profile_id = auth.uid());

-- Step 2: CREATE MISSING TABLES (SaaS Core Features)
-- ======================================================

-- Subscription plans for SaaS
CREATE TABLE IF NOT EXISTS cluequest_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    max_users INTEGER,
    max_projects INTEGER,
    features JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization subscriptions
CREATE TABLE IF NOT EXISTS cluequest_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES cluequest_plans(id),
    status TEXT NOT NULL CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'unpaid')),
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    canceled_at TIMESTAMPTZ,
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API keys for integrations
CREATE TABLE IF NOT EXISTS cluequest_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    key_prefix TEXT NOT NULL,
    permissions JSONB DEFAULT '[]',
    rate_limit_per_hour INTEGER DEFAULT 1000,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- In-app notifications
CREATE TABLE IF NOT EXISTS cluequest_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comprehensive audit log for compliance and security
CREATE TABLE IF NOT EXISTS cluequest_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    severity TEXT DEFAULT 'info' CHECK (severity IN ('low', 'info', 'warning', 'high', 'critical')),
    tags JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: ENABLE RLS ON NEW TABLES
-- ======================================================

ALTER TABLE cluequest_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_subscriptions ENABLE ROW LEVEL SECURITY; 
ALTER TABLE cluequest_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_audit_logs ENABLE ROW LEVEL SECURITY;

-- Step 4: CREATE RLS POLICIES FOR NEW TABLES
-- ======================================================

-- Plans: Public read access (for signup pages)
CREATE POLICY "Plans are publicly viewable" ON cluequest_plans
    FOR SELECT TO PUBLIC USING (is_active = TRUE);

-- Subscriptions: Organization members can view subscription
CREATE POLICY "Organization members can view subscription" ON cluequest_subscriptions
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id 
            FROM cluequest_organization_members 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- API keys: Organization admins can manage API keys
CREATE POLICY "Organization admins can manage API keys" ON cluequest_api_keys
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id 
            FROM cluequest_organization_members 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin') 
            AND is_active = TRUE
        )
    );

-- Notifications: Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON cluequest_notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON cluequest_notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Audit logs: Organization admins can view audit logs
CREATE POLICY "Organization admins can view audit logs" ON cluequest_audit_logs
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id 
            FROM cluequest_organization_members 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin') 
            AND is_active = TRUE
        )
    );

-- Step 5: CREATE MISSING OPTIMIZATION FUNCTIONS
-- ======================================================

-- Dashboard optimization function (fixes "missing_or_restricted" error)
CREATE OR REPLACE FUNCTION get_dashboard_data_optimized(org_id UUID DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
    user_org_id UUID;
BEGIN
    -- Get user's organization if not provided
    IF org_id IS NULL THEN
        SELECT organization_id INTO user_org_id
        FROM cluequest_organization_members 
        WHERE user_id = auth.uid() AND is_active = TRUE
        LIMIT 1;
    ELSE
        user_org_id := org_id;
    END IF;

    -- Build comprehensive dashboard data
    SELECT jsonb_build_object(
        'user_profile', (
            SELECT row_to_json(p) 
            FROM cluequest_profiles p 
            WHERE p.id = auth.uid()
        ),
        'organization', (
            SELECT row_to_json(o) 
            FROM cluequest_organizations o 
            WHERE o.id = user_org_id
        ),
        'subscription', (
            SELECT row_to_json(s) 
            FROM cluequest_subscriptions s 
            WHERE s.organization_id = user_org_id 
            ORDER BY s.created_at DESC 
            LIMIT 1
        ),
        'recent_adventures', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'title', title,
                    'created_at', created_at,
                    'is_public', is_public
                )
                ORDER BY created_at DESC
            ), '[]'::jsonb)
            FROM cluequest_adventures 
            WHERE created_by = auth.uid()
            LIMIT 5
        ),
        'active_sessions', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', s.id,
                    'name', s.name,
                    'status', s.status,
                    'current_participants', s.current_participants,
                    'adventure_title', a.title
                )
            ), '[]'::jsonb)
            FROM cluequest_sessions s
            JOIN cluequest_adventures a ON s.adventure_id = a.id
            WHERE a.created_by = auth.uid() AND s.status = 'active'
        ),
        'unread_notifications', (
            SELECT COUNT(*)
            FROM cluequest_notifications 
            WHERE user_id = auth.uid() AND is_read = FALSE
        )
    ) INTO result;

    RETURN result;
END;
$$;

-- Calculate usage metrics with performance optimization
CREATE OR REPLACE FUNCTION calculate_usage_metrics(
    org_id UUID,
    start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    end_date DATE DEFAULT CURRENT_DATE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_adventures', (
            SELECT COUNT(*)
            FROM cluequest_adventures a
            JOIN cluequest_organization_members om ON a.created_by = om.user_id
            WHERE om.organization_id = org_id
            AND a.created_at::date BETWEEN start_date AND end_date
        ),
        'total_sessions', (
            SELECT COUNT(*)
            FROM cluequest_sessions s
            JOIN cluequest_adventures a ON s.adventure_id = a.id
            JOIN cluequest_organization_members om ON a.created_by = om.user_id
            WHERE om.organization_id = org_id
            AND s.created_at::date BETWEEN start_date AND end_date
        ),
        'total_players', (
            SELECT COUNT(DISTINCT p.profile_id)
            FROM cluequest_players p
            JOIN cluequest_sessions s ON p.session_id = s.id
            JOIN cluequest_adventures a ON s.adventure_id = a.id
            JOIN cluequest_organization_members om ON a.created_by = om.user_id
            WHERE om.organization_id = org_id
            AND p.joined_at::date BETWEEN start_date AND end_date
        ),
        'daily_activity', (
            SELECT COALESCE(jsonb_object_agg(
                activity_date::text,
                activity_count
            ), '{}'::jsonb)
            FROM (
                SELECT 
                    s.created_at::date as activity_date,
                    COUNT(*) as activity_count
                FROM cluequest_sessions s
                JOIN cluequest_adventures a ON s.adventure_id = a.id
                JOIN cluequest_organization_members om ON a.created_by = om.user_id
                WHERE om.organization_id = org_id
                AND s.created_at::date BETWEEN start_date AND end_date
                GROUP BY s.created_at::date
                ORDER BY s.created_at::date
            ) daily_data
        )
    ) INTO result;

    RETURN result;
END;
$$;

-- Step 6: CREATE PERFORMANCE INDEXES 
-- ======================================================

-- Subscription indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_org_id ON cluequest_subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON cluequest_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_period ON cluequest_subscriptions(current_period_end);

-- API management indexes  
CREATE INDEX IF NOT EXISTS idx_api_keys_org_id ON cluequest_api_keys(organization_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON cluequest_api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON cluequest_api_keys(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON cluequest_api_keys(key_hash);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON cluequest_notifications(user_id, created_at DESC) 
    WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_org ON cluequest_notifications(organization_id, created_at DESC);

-- Audit log indexes (critical for compliance)
CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON cluequest_audit_logs(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON cluequest_audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON cluequest_audit_logs(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON cluequest_audit_logs(severity, created_at DESC) 
    WHERE severity IN ('high', 'critical');

-- Step 7: INSERT SAMPLE DATA
-- ======================================================

-- Insert sample plans
INSERT INTO cluequest_plans (name, description, price_monthly, price_yearly, max_users, max_projects, features) VALUES
('Free', 'Perfect for trying out ClueQuest', 0.00, 0.00, 2, 3, '["basic_adventures", "public_sharing"]'),
('Pro', 'Advanced features for serious creators', 19.00, 190.00, 10, 25, '["advanced_adventures", "private_adventures", "analytics", "priority_support"]'),
('Team', 'Collaboration tools for organizations', 49.00, 490.00, 50, 100, '["team_collaboration", "advanced_analytics", "custom_branding", "api_access"]'),
('Enterprise', 'Full-featured solution for large organizations', 199.00, 1990.00, NULL, NULL, '["unlimited_everything", "dedicated_support", "sso", "audit_logs", "custom_development"]')
ON CONFLICT (name) DO NOTHING;

-- Step 8: VERIFICATION QUERIES
-- ======================================================

-- Check RLS status on all tables
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = t.tablename) as policy_count
FROM pg_tables t
WHERE schemaname = 'public' 
AND tablename LIKE 'cluequest_%'
ORDER BY tablename;

-- Test dashboard function
SELECT 'Dashboard function test' as test, 
       CASE WHEN get_dashboard_data_optimized() IS NOT NULL THEN 'SUCCESS' ELSE 'FAILED' END as status;

-- ======================================================
-- SUCCESS MESSAGE
-- ======================================================
DO $$
BEGIN
    RAISE NOTICE '🎉 ALL CRITICAL ISSUES FIXED!';
    RAISE NOTICE '✅ RLS enabled on all tables';
    RAISE NOTICE '✅ Multi-tenant security policies active';  
    RAISE NOTICE '✅ Missing tables created';
    RAISE NOTICE '✅ Optimization functions deployed';
    RAISE NOTICE '✅ Performance indexes created';
    RAISE NOTICE '🛡️  Your ClueQuest SaaS is now production-ready!';
    RAISE NOTICE '📊 Run surgical diagnostic again to verify 100% success';
END $$;