-- 26 Template System Enhancement for ClueQuest
-- Implements comprehensive template system for 25 professional adventures
-- Based on escape room best practices and mobile-first design

BEGIN;

-- =============================================================================
-- TEMPLATE SYSTEM ENHANCEMENTS
-- =============================================================================

-- Extend adventures table for template support
ALTER TABLE cluequest_adventures ADD COLUMN IF NOT EXISTS template_id TEXT;
ALTER TABLE cluequest_adventures ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT FALSE;
ALTER TABLE cluequest_adventures ADD COLUMN IF NOT EXISTS template_metadata JSONB DEFAULT '{}';
ALTER TABLE cluequest_adventures ADD COLUMN IF NOT EXISTS original_template_id TEXT;
ALTER TABLE cluequest_adventures ADD COLUMN IF NOT EXISTS customization_level INTEGER DEFAULT 0; -- 0=none, 1=basic, 2=moderate, 3=extensive

-- Add template-specific fields to existing tables
ALTER TABLE cluequest_adventures ADD COLUMN IF NOT EXISTS inspiration_sources TEXT[];
ALTER TABLE cluequest_adventures ADD COLUMN IF NOT EXISTS narrative_hook TEXT;
ALTER TABLE cluequest_adventures ADD COLUMN IF NOT EXISTS success_criteria JSONB DEFAULT '{}';
ALTER TABLE cluequest_adventures ADD COLUMN IF NOT EXISTS failure_handling JSONB DEFAULT '{}';
ALTER TABLE cluequest_adventures ADD COLUMN IF NOT EXISTS adaptive_difficulty BOOLEAN DEFAULT FALSE;
ALTER TABLE cluequest_adventures ADD COLUMN IF NOT EXISTS recommended_group_size INTEGER DEFAULT 4;

-- Template instantiation tracking
CREATE TABLE IF NOT EXISTS cluequest_template_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id TEXT NOT NULL,
    adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customizations JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    usage_stats JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Template categories for better organization
CREATE TABLE IF NOT EXISTS cluequest_template_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    color_scheme JSONB DEFAULT '{}',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Template tags for discovery and filtering
CREATE TABLE IF NOT EXISTS cluequest_template_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id TEXT NOT NULL,
    tag_name TEXT NOT NULL,
    tag_type TEXT DEFAULT 'general', -- general, skill, technology, theme, difficulty
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (template_id, tag_name)
);

-- Template reviews and ratings
CREATE TABLE IF NOT EXISTS cluequest_template_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id TEXT NOT NULL,
    organization_id UUID NOT NULL REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    pros TEXT[],
    cons TEXT[],
    recommended_for TEXT[], -- age_groups, team_sizes, use_cases
    difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
    engagement_score INTEGER CHECK (engagement_score >= 1 AND engagement_score <= 5),
    replay_value INTEGER CHECK (replay_value >= 1 AND replay_value <= 5),
    is_verified BOOLEAN DEFAULT FALSE,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- ADVANCED MECHANICS SUPPORT
-- =============================================================================

-- Enhanced scene mechanics
ALTER TABLE cluequest_scenes ADD COLUMN IF NOT EXISTS advanced_mechanics JSONB DEFAULT '{}';
ALTER TABLE cluequest_scenes ADD COLUMN IF NOT EXISTS interaction_types TEXT[] DEFAULT '{}';
ALTER TABLE cluequest_scenes ADD COLUMN IF NOT EXISTS success_criteria JSONB DEFAULT '{}';
ALTER TABLE cluequest_scenes ADD COLUMN IF NOT EXISTS failure_handling JSONB DEFAULT '{}';
ALTER TABLE cluequest_scenes ADD COLUMN IF NOT EXISTS collaborative_requirements JSONB DEFAULT '{}';
ALTER TABLE cluequest_scenes ADD COLUMN IF NOT EXISTS biometric_challenges JSONB DEFAULT '{}';
ALTER TABLE cluequest_scenes ADD COLUMN IF NOT EXISTS gesture_controls JSONB DEFAULT '{}';
ALTER TABLE cluequest_scenes ADD COLUMN IF NOT EXISTS voice_interactions JSONB DEFAULT '{}';
ALTER TABLE cluequest_scenes ADD COLUMN IF NOT EXISTS environmental_triggers JSONB DEFAULT '{}';
ALTER TABLE cluequest_scenes ADD COLUMN IF NOT EXISTS time_pressure_config JSONB DEFAULT '{}';

-- Challenge type enhancements
CREATE TYPE IF NOT EXISTS challenge_interaction_type AS ENUM (
    'touch', 'voice', 'gesture', 'biometric', 'collaborative',
    'sequential', 'environmental', 'ar_spatial', 'qr_scan', 'photo_analysis'
);

ALTER TABLE cluequest_challenges ADD COLUMN IF NOT EXISTS interaction_type challenge_interaction_type DEFAULT 'touch';
ALTER TABLE cluequest_challenges ADD COLUMN IF NOT EXISTS collaboration_required BOOLEAN DEFAULT FALSE;
ALTER TABLE cluequest_challenges ADD COLUMN IF NOT EXISTS min_participants INTEGER DEFAULT 1;
ALTER TABLE cluequest_challenges ADD COLUMN IF NOT EXISTS max_participants INTEGER DEFAULT 10;
ALTER TABLE cluequest_challenges ADD COLUMN IF NOT EXISTS sequence_requirements JSONB DEFAULT '{}';
ALTER TABLE cluequest_challenges ADD COLUMN IF NOT EXISTS biometric_config JSONB DEFAULT '{}';
ALTER TABLE cluequest_challenges ADD COLUMN IF NOT EXISTS gesture_patterns JSONB DEFAULT '{}';
ALTER TABLE cluequest_challenges ADD COLUMN IF NOT EXISTS voice_commands TEXT[];
ALTER TABLE cluequest_challenges ADD COLUMN IF NOT EXISTS environmental_conditions JSONB DEFAULT '{}';

-- =============================================================================
-- THEME-SPECIFIC ENHANCEMENTS
-- =============================================================================

-- Mystery theme specific
CREATE TABLE IF NOT EXISTS cluequest_mystery_elements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    evidence_chain JSONB DEFAULT '{}',
    character_relationships JSONB DEFAULT '{}',
    timeline_events JSONB DEFAULT '{}',
    red_herrings JSONB DEFAULT '{}',
    revelation_sequence JSONB DEFAULT '{}',
    forensic_tools TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fantasy theme specific
CREATE TABLE IF NOT EXISTS cluequest_fantasy_elements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    magic_systems JSONB DEFAULT '{}',
    creature_interactions JSONB DEFAULT '{}',
    elemental_mechanics JSONB DEFAULT '{}',
    artifact_powers JSONB DEFAULT '{}',
    realm_transitions JSONB DEFAULT '{}',
    spell_components TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hacker theme specific
CREATE TABLE IF NOT EXISTS cluequest_hacker_elements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    network_topologies JSONB DEFAULT '{}',
    security_protocols JSONB DEFAULT '{}',
    code_challenges JSONB DEFAULT '{}',
    data_structures JSONB DEFAULT '{}',
    encryption_methods JSONB DEFAULT '{}',
    system_vulnerabilities JSONB DEFAULT '{}',
    hacking_tools TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Corporate theme specific
CREATE TABLE IF NOT EXISTS cluequest_corporate_elements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    business_scenarios JSONB DEFAULT '{}',
    decision_matrices JSONB DEFAULT '{}',
    stakeholder_maps JSONB DEFAULT '{}',
    financial_models JSONB DEFAULT '{}',
    negotiation_frameworks JSONB DEFAULT '{}',
    leadership_challenges JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Educational theme specific
CREATE TABLE IF NOT EXISTS cluequest_educational_elements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    learning_objectives TEXT[] NOT NULL,
    curriculum_alignment JSONB DEFAULT '{}',
    assessment_criteria JSONB DEFAULT '{}',
    knowledge_domains TEXT[],
    skill_development JSONB DEFAULT '{}',
    progress_tracking JSONB DEFAULT '{}',
    remediation_paths JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- ANALYTICS AND ASSESSMENT
-- =============================================================================

-- Template performance tracking
CREATE TABLE IF NOT EXISTS cluequest_template_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id TEXT NOT NULL,
    analytics_date DATE DEFAULT CURRENT_DATE,
    instantiation_count INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    average_duration_minutes INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    player_satisfaction_score DECIMAL(3,2) DEFAULT 0,
    difficulty_effectiveness DECIMAL(3,2) DEFAULT 0,
    engagement_metrics JSONB DEFAULT '{}',
    performance_by_theme JSONB DEFAULT '{}',
    demographic_breakdown JSONB DEFAULT '{}',
    improvement_suggestions JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(template_id, analytics_date)
);

-- Learning outcomes tracking (for educational adventures)
CREATE TABLE IF NOT EXISTS cluequest_learning_outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES cluequest_game_sessions(id) ON DELETE CASCADE,
    participant_id UUID NOT NULL,
    learning_objective TEXT NOT NULL,
    mastery_level INTEGER CHECK (mastery_level >= 0 AND mastery_level <= 100),
    evidence_artifacts JSONB DEFAULT '{}',
    assessment_scores JSONB DEFAULT '{}',
    time_to_mastery_minutes INTEGER,
    peer_collaboration_score INTEGER,
    instructor_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Template system indexes
CREATE INDEX IF NOT EXISTS idx_adventures_template_id ON cluequest_adventures(template_id) WHERE template_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_adventures_is_template ON cluequest_adventures(is_template) WHERE is_template = true;
CREATE INDEX IF NOT EXISTS idx_template_instances_template_id ON cluequest_template_instances(template_id);
CREATE INDEX IF NOT EXISTS idx_template_instances_organization ON cluequest_template_instances(organization_id, created_at);
CREATE INDEX IF NOT EXISTS idx_template_tags_lookup ON cluequest_template_tags(tag_name, tag_type);
CREATE INDEX IF NOT EXISTS idx_template_reviews_rating ON cluequest_template_reviews(template_id, rating, created_at);

-- Advanced mechanics indexes
CREATE INDEX IF NOT EXISTS idx_scenes_interaction_types ON cluequest_scenes USING GIN(interaction_types);
CREATE INDEX IF NOT EXISTS idx_challenges_interaction_type ON cluequest_challenges(interaction_type);
CREATE INDEX IF NOT EXISTS idx_challenges_collaboration ON cluequest_challenges(collaboration_required) WHERE collaboration_required = true;

-- Theme-specific indexes
CREATE INDEX IF NOT EXISTS idx_mystery_elements_adventure ON cluequest_mystery_elements(adventure_id);
CREATE INDEX IF NOT EXISTS idx_fantasy_elements_adventure ON cluequest_fantasy_elements(adventure_id);
CREATE INDEX IF NOT EXISTS idx_hacker_elements_adventure ON cluequest_hacker_elements(adventure_id);
CREATE INDEX IF NOT EXISTS idx_corporate_elements_adventure ON cluequest_corporate_elements(adventure_id);
CREATE INDEX IF NOT EXISTS idx_educational_elements_adventure ON cluequest_educational_elements(adventure_id);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_template_analytics_date ON cluequest_template_analytics(template_id, analytics_date);
CREATE INDEX IF NOT EXISTS idx_learning_outcomes_session ON cluequest_learning_outcomes(session_id, learning_objective);

-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Template instances policies
ALTER TABLE cluequest_template_instances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view template instances in their organization" 
ON cluequest_template_instances FOR SELECT 
USING (
    organization_id IN (
        SELECT organization_id FROM cluequest_profiles 
        WHERE id = auth.uid()
    )
);

CREATE POLICY "Users can create template instances in their organization" 
ON cluequest_template_instances FOR INSERT 
WITH CHECK (
    organization_id IN (
        SELECT organization_id FROM cluequest_profiles 
        WHERE id = auth.uid()
    )
);

-- Template reviews policies
ALTER TABLE cluequest_template_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all template reviews" 
ON cluequest_template_reviews FOR SELECT 
USING (true);

CREATE POLICY "Users can create reviews for their organization" 
ON cluequest_template_reviews FOR INSERT 
WITH CHECK (
    organization_id IN (
        SELECT organization_id FROM cluequest_profiles 
        WHERE id = auth.uid()
    )
);

CREATE POLICY "Users can update their own reviews" 
ON cluequest_template_reviews FOR UPDATE 
USING (reviewer_id = auth.uid());

-- Theme-specific elements policies
ALTER TABLE cluequest_mystery_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_fantasy_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_hacker_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_corporate_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_educational_elements ENABLE ROW LEVEL SECURITY;

-- Shared policy for theme elements
DO $$
DECLARE
    table_name TEXT;
BEGIN
    FOR table_name IN VALUES 
        ('cluequest_mystery_elements'),
        ('cluequest_fantasy_elements'), 
        ('cluequest_hacker_elements'),
        ('cluequest_corporate_elements'),
        ('cluequest_educational_elements')
    LOOP
        EXECUTE format('
            CREATE POLICY "Users can manage theme elements in their organization" 
            ON %I 
            USING (
                adventure_id IN (
                    SELECT id FROM cluequest_adventures 
                    WHERE organization_id IN (
                        SELECT organization_id FROM cluequest_profiles 
                        WHERE id = auth.uid()
                    )
                )
            )', table_name);
    END LOOP;
END $$;

-- =============================================================================
-- TEMPLATE SYSTEM FUNCTIONS
-- =============================================================================

-- Function to instantiate a template as a new adventure
CREATE OR REPLACE FUNCTION instantiate_template(
    p_template_id TEXT,
    p_organization_id UUID,
    p_creator_id UUID,
    p_customizations JSONB DEFAULT '{}',
    p_title TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    template_adventure cluequest_adventures%ROWTYPE;
    new_adventure_id UUID;
    new_title TEXT;
BEGIN
    -- Get the template adventure
    SELECT * INTO template_adventure 
    FROM cluequest_adventures 
    WHERE template_id = p_template_id AND is_template = true
    LIMIT 1;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Template not found: %', p_template_id;
    END IF;
    
    -- Generate new title if not provided
    new_title := COALESCE(
        p_title, 
        template_adventure.title || ' - ' || to_char(now(), 'YYYY-MM-DD HH24:MI')
    );
    
    -- Create new adventure from template
    INSERT INTO cluequest_adventures (
        organization_id,
        creator_id,
        title,
        description,
        category,
        difficulty,
        estimated_duration,
        theme_name,
        theme_config,
        settings,
        max_participants,
        status,
        template_id,
        original_template_id,
        is_template,
        template_metadata,
        narrative_hook,
        success_criteria,
        failure_handling,
        adaptive_difficulty,
        recommended_group_size
    ) VALUES (
        p_organization_id,
        p_creator_id,
        new_title,
        template_adventure.description,
        template_adventure.category,
        template_adventure.difficulty,
        template_adventure.estimated_duration,
        template_adventure.theme_name,
        COALESCE(p_customizations->'theme_config', template_adventure.theme_config),
        COALESCE(p_customizations->'settings', template_adventure.settings),
        template_adventure.max_participants,
        'draft',
        p_template_id,
        template_adventure.template_id,
        false,
        p_customizations,
        template_adventure.narrative_hook,
        template_adventure.success_criteria,
        template_adventure.failure_handling,
        template_adventure.adaptive_difficulty,
        template_adventure.recommended_group_size
    ) RETURNING id INTO new_adventure_id;
    
    -- Record the instantiation
    INSERT INTO cluequest_template_instances (
        template_id,
        adventure_id,
        organization_id,
        creator_id,
        customizations
    ) VALUES (
        p_template_id,
        new_adventure_id,
        p_organization_id,
        p_creator_id,
        p_customizations
    );
    
    -- TODO: Copy scenes, challenges, roles, and other components
    -- This will be implemented in subsequent migrations
    
    RETURN new_adventure_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get template performance metrics
CREATE OR REPLACE FUNCTION get_template_performance(p_template_id TEXT)
RETURNS TABLE(
    instantiation_count BIGINT,
    avg_completion_rate DECIMAL,
    avg_rating DECIMAL,
    avg_duration_minutes DECIMAL,
    total_participants BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(ti.id)::BIGINT as instantiation_count,
        AVG(a.completion_rate) as avg_completion_rate,
        AVG(a.rating) as avg_rating,
        AVG(a.estimated_duration)::DECIMAL as avg_duration_minutes,
        SUM(a.total_participants)::BIGINT as total_participants
    FROM cluequest_template_instances ti
    JOIN cluequest_adventures a ON ti.adventure_id = a.id
    WHERE ti.template_id = p_template_id
    AND a.status != 'draft';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- INSERT TEMPLATE CATEGORIES
-- =============================================================================

INSERT INTO cluequest_template_categories (name, slug, description, sort_order) VALUES
('Mystery & Detective', 'mystery', 'Solve crimes, uncover secrets, and piece together clues in thrilling detective adventures', 1),
('Fantasy & Magic', 'fantasy', 'Embark on mystical quests with dragons, magic, and ancient mysteries', 2),
('Cybersecurity & Hacking', 'hacker', 'Navigate digital realms, crack codes, and outsmart AI in tech-focused challenges', 3),
('Business & Corporate', 'corporate', 'Master leadership, strategy, and business acumen through professional scenarios', 4),
('Educational & Learning', 'educational', 'Discover new knowledge through interactive learning adventures and skill-building challenges', 5)
ON CONFLICT (slug) DO NOTHING;

COMMIT;