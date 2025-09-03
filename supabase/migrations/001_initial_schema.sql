-- ClueQuest Database Schema
-- Multi-tenant SaaS with global market optimization
-- Based on proven patterns from AXIS6, CINETWRK, and production deployments

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- CORE USER MANAGEMENT
-- =============================================================================

-- User profiles extending Supabase Auth
-- CRITICAL: This table uses 'id' column (not user_id) referencing auth.users(id)
CREATE TABLE cluequest_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    country TEXT,
    phone TEXT,
    job_title TEXT,
    company TEXT,
    bio TEXT,
    preferences JSONB DEFAULT '{}',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations for multi-tenant architecture
CREATE TABLE cluequest_organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    website_url TEXT,
    logo_url TEXT,
    industry TEXT,
    company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+')),
    country TEXT,
    timezone TEXT DEFAULT 'UTC',
    settings JSONB DEFAULT '{}',
    billing_email TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    trial_ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization members with roles
CREATE TABLE cluequest_organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    permissions JSONB DEFAULT '[]',
    invited_by UUID REFERENCES auth.users(id),
    invited_at TIMESTAMPTZ,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(organization_id, user_id)
);

-- =============================================================================
-- SUBSCRIPTION & BILLING
-- =============================================================================

-- Subscription plans
CREATE TABLE cluequest_plans (
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
CREATE TABLE cluequest_subscriptions (
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

-- Usage tracking for metered billing
CREATE TABLE cluequest_usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    metadata JSONB DEFAULT '{}',
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    billing_period_start TIMESTAMPTZ NOT NULL,
    billing_period_end TIMESTAMPTZ NOT NULL
);

-- =============================================================================
-- API MANAGEMENT & ANALYTICS
-- =============================================================================

-- API keys for integrations
CREATE TABLE cluequest_api_keys (
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

-- API usage analytics
CREATE TABLE cluequest_api_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id UUID REFERENCES cluequest_api_keys(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER,
    ip_address INET,
    user_agent TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- NOTIFICATION SYSTEM
-- =============================================================================

-- In-app notifications
CREATE TABLE cluequest_notifications (
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

-- Email notification preferences
CREATE TABLE cluequest_notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    email_enabled BOOLEAN DEFAULT TRUE,
    in_app_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT FALSE,
    frequency TEXT DEFAULT 'immediate' CHECK (frequency IN ('immediate', 'daily', 'weekly', 'never')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, organization_id, notification_type)
);

-- =============================================================================
-- AUDIT & SECURITY
-- =============================================================================

-- Comprehensive audit log for compliance and security
CREATE TABLE cluequest_audit_logs (
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

-- Security incidents tracking
CREATE TABLE cluequest_security_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    incident_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
    title TEXT NOT NULL,
    description TEXT,
    affected_users INTEGER DEFAULT 0,
    detection_method TEXT,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- FEATURE FLAGS & EXPERIMENTS
-- =============================================================================

-- Feature flags for progressive rollouts
CREATE TABLE cluequest_feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_enabled BOOLEAN DEFAULT FALSE,
    rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
    conditions JSONB DEFAULT '{}',
    environment TEXT DEFAULT 'production',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User-specific feature flag overrides
CREATE TABLE cluequest_user_feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    feature_flag_id UUID NOT NULL REFERENCES cluequest_feature_flags(id) ON DELETE CASCADE,
    is_enabled BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, feature_flag_id)
);

-- =============================================================================
-- SUPPORT & FEEDBACK
-- =============================================================================

-- Customer support tickets
CREATE TABLE cluequest_support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
    category TEXT,
    assigned_to UUID REFERENCES auth.users(id),
    resolution TEXT,
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support ticket messages/replies
CREATE TABLE cluequest_support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES cluequest_support_tickets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- PERFORMANCE INDEXES (25+ Strategic Indexes)
-- =============================================================================

-- User and profile indexes
CREATE INDEX idx_profiles_email ON cluequest_profiles(email);
CREATE INDEX idx_profiles_last_active ON cluequest_profiles(last_active_at DESC);
CREATE INDEX idx_profiles_onboarding ON cluequest_profiles(onboarding_completed) WHERE onboarding_completed = FALSE;

-- Organization indexes
CREATE INDEX idx_organizations_slug ON cluequest_organizations(slug);
CREATE INDEX idx_organizations_active ON cluequest_organizations(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_organizations_trial ON cluequest_organizations(trial_ends_at) WHERE trial_ends_at IS NOT NULL;

-- Organization member indexes
CREATE INDEX idx_org_members_org_id ON cluequest_organization_members(organization_id);
CREATE INDEX idx_org_members_user_id ON cluequest_organization_members(user_id);
CREATE INDEX idx_org_members_role ON cluequest_organization_members(organization_id, role);
CREATE INDEX idx_org_members_active ON cluequest_organization_members(organization_id) WHERE is_active = TRUE;

-- Subscription indexes
CREATE INDEX idx_subscriptions_org_id ON cluequest_subscriptions(organization_id);
CREATE INDEX idx_subscriptions_status ON cluequest_subscriptions(status);
CREATE INDEX idx_subscriptions_period ON cluequest_subscriptions(current_period_end);
CREATE INDEX idx_subscriptions_stripe ON cluequest_subscriptions(stripe_subscription_id);

-- Usage tracking indexes (partial indexes for performance)
CREATE INDEX idx_usage_records_org_period ON cluequest_usage_records(organization_id, billing_period_start, billing_period_end);
CREATE INDEX idx_usage_records_event ON cluequest_usage_records(event_type, recorded_at DESC);
CREATE INDEX idx_usage_records_recent ON cluequest_usage_records(recorded_at DESC) 
    WHERE recorded_at >= CURRENT_DATE - INTERVAL '30 days';

-- API management indexes
CREATE INDEX idx_api_keys_org_id ON cluequest_api_keys(organization_id);
CREATE INDEX idx_api_keys_user_id ON cluequest_api_keys(user_id);
CREATE INDEX idx_api_keys_active ON cluequest_api_keys(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_api_keys_hash ON cluequest_api_keys(key_hash);

-- API usage indexes (partial for recent data)
CREATE INDEX idx_api_usage_key ON cluequest_api_usage(api_key_id, created_at DESC);
CREATE INDEX idx_api_usage_org_recent ON cluequest_api_usage(organization_id, created_at DESC)
    WHERE created_at >= CURRENT_DATE - INTERVAL '7 days';
CREATE INDEX idx_api_usage_endpoint ON cluequest_api_usage(endpoint, method, status_code);

-- Notification indexes
CREATE INDEX idx_notifications_user_unread ON cluequest_notifications(user_id, created_at DESC) 
    WHERE is_read = FALSE;
CREATE INDEX idx_notifications_org ON cluequest_notifications(organization_id, created_at DESC);

-- Audit log indexes (critical for compliance)
CREATE INDEX idx_audit_logs_org ON cluequest_audit_logs(organization_id, created_at DESC);
CREATE INDEX idx_audit_logs_user ON cluequest_audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON cluequest_audit_logs(action, created_at DESC);
CREATE INDEX idx_audit_logs_resource ON cluequest_audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_severity ON cluequest_audit_logs(severity, created_at DESC) 
    WHERE severity IN ('high', 'critical');

-- Security incident indexes
CREATE INDEX idx_security_incidents_org ON cluequest_security_incidents(organization_id, detected_at DESC);
CREATE INDEX idx_security_incidents_status ON cluequest_security_incidents(status, severity);
CREATE INDEX idx_security_incidents_type ON cluequest_security_incidents(incident_type, detected_at DESC);

-- Support ticket indexes
CREATE INDEX idx_support_tickets_org ON cluequest_support_tickets(organization_id, created_at DESC);
CREATE INDEX idx_support_tickets_user ON cluequest_support_tickets(user_id, created_at DESC);
CREATE INDEX idx_support_tickets_status ON cluequest_support_tickets(status, priority);
CREATE INDEX idx_support_tickets_assigned ON cluequest_support_tickets(assigned_to, status);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE cluequest_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_security_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_user_feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_support_messages ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON cluequest_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON cluequest_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON cluequest_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Organizations: Members can view their organizations
CREATE POLICY "Organization members can view organization" ON cluequest_organizations
    FOR SELECT USING (
        id IN (
            SELECT organization_id 
            FROM cluequest_organization_members 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- Organization members: Users can view members of their organizations
CREATE POLICY "Users can view organization members" ON cluequest_organization_members
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id 
            FROM cluequest_organization_members 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

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

-- Usage records: Organization members can view usage
CREATE POLICY "Organization members can view usage records" ON cluequest_usage_records
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id 
            FROM cluequest_organization_members 
            WHERE user_id = auth.uid() AND is_active = TRUE
        )
    );

-- API keys: Users can manage their organization's API keys
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

-- Support tickets: Users can view their own tickets and organization tickets
CREATE POLICY "Users can view support tickets" ON cluequest_support_tickets
    FOR SELECT USING (
        user_id = auth.uid() 
        OR organization_id IN (
            SELECT organization_id 
            FROM cluequest_organization_members 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin') 
            AND is_active = TRUE
        )
    );

-- =============================================================================
-- OPTIMIZED RPC FUNCTIONS FOR PERFORMANCE
-- =============================================================================

-- Get comprehensive dashboard data in single query
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
        'usage_current_month', (
            SELECT COALESCE(SUM(quantity), 0)
            FROM cluequest_usage_records 
            WHERE organization_id = user_org_id 
            AND billing_period_start >= date_trunc('month', CURRENT_DATE)
        ),
        'active_members', (
            SELECT COUNT(*)
            FROM cluequest_organization_members 
            WHERE organization_id = user_org_id AND is_active = TRUE
        ),
        'unread_notifications', (
            SELECT COUNT(*)
            FROM cluequest_notifications 
            WHERE user_id = auth.uid() AND is_read = FALSE
        ),
        'recent_activities', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'action', action,
                    'created_at', created_at,
                    'user_id', user_id
                )
                ORDER BY created_at DESC
            ), '[]'::jsonb)
            FROM cluequest_audit_logs 
            WHERE organization_id = user_org_id 
            AND created_at >= CURRENT_DATE - INTERVAL '7 days'
            LIMIT 10
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
        'total_usage', COALESCE(SUM(quantity), 0),
        'daily_averages', (
            SELECT COALESCE(jsonb_object_agg(
                recorded_at::date,
                daily_total
            ), '{}'::jsonb)
            FROM (
                SELECT 
                    recorded_at::date,
                    SUM(quantity) as daily_total
                FROM cluequest_usage_records
                WHERE organization_id = org_id
                AND recorded_at::date BETWEEN start_date AND end_date
                GROUP BY recorded_at::date
                ORDER BY recorded_at::date
            ) daily_usage
        ),
        'event_breakdown', (
            SELECT COALESCE(jsonb_object_agg(
                event_type,
                event_count
            ), '{}'::jsonb)
            FROM (
                SELECT 
                    event_type,
                    SUM(quantity) as event_count
                FROM cluequest_usage_records
                WHERE organization_id = org_id
                AND recorded_at::date BETWEEN start_date AND end_date
                GROUP BY event_type
            ) event_usage
        )
    ) INTO result
    FROM cluequest_usage_records
    WHERE organization_id = org_id
    AND recorded_at::date BETWEEN start_date AND end_date;

    RETURN result;
END;
$$;

-- =============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================================================

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON cluequest_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at 
    BEFORE UPDATE ON cluequest_organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_members_updated_at 
    BEFORE UPDATE ON cluequest_organization_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- SAMPLE DATA FOR DEVELOPMENT (Comment out for production)
-- =============================================================================

-- Insert sample plans
INSERT INTO cluequest_plans (name, description, price_monthly, price_yearly, max_users, max_projects, features) VALUES
('Starter', 'Perfect for small teams getting started', 29.00, 290.00, 5, 10, '["basic_analytics", "email_support"]'),
('Professional', 'Advanced features for growing teams', 79.00, 790.00, 25, 100, '["advanced_analytics", "priority_support", "custom_integrations"]'),
('Enterprise', 'Full-featured solution for large organizations', 199.00, 1990.00, NULL, NULL, '["enterprise_analytics", "dedicated_support", "sso", "audit_logs"]');

-- Insert sample feature flags
INSERT INTO cluequest_feature_flags (name, description, is_enabled, rollout_percentage) VALUES
('new_dashboard', 'New dashboard design with improved UX', TRUE, 100),
('advanced_analytics', 'Advanced analytics and reporting features', TRUE, 50),
('api_v2', 'Version 2 of the public API', FALSE, 0),
('mobile_app_integration', 'Integration with mobile applications', TRUE, 25);

COMMENT ON SCHEMA public IS 'ClueQuest production-ready schema with multi-tenant architecture, comprehensive audit logging, and performance optimization. Based on proven patterns from AXIS6 and CINETWRK.';