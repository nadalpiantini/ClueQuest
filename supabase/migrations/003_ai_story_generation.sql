-- ClueQuest AI Story Generation Extension
-- Adds comprehensive AI story generation system with user feedback and iterations

-- =============================================================================
-- AI STORY GENERATION TYPES
-- =============================================================================

-- Story generation status
CREATE TYPE story_generation_status AS ENUM (
    'pending',           -- Request submitted, waiting for processing
    'generating',        -- AI is currently generating content
    'completed',         -- Generation completed successfully
    'failed',           -- Generation failed with error
    'reviewing',        -- User is reviewing the generated content
    'approved',         -- User approved the generated story
    'rejected',         -- User rejected, needs regeneration
    'regenerating'      -- Creating new version based on feedback
);

-- Story components that can be generated
CREATE TYPE story_component_type AS ENUM (
    'full_story',       -- Complete adventure narrative
    'opening_scene',    -- Adventure introduction
    'scene_narrative',  -- Individual scene descriptions
    'character_roles',  -- Character backgrounds and roles
    'plot_outline',     -- Story structure and flow
    'challenge_context', -- Context for puzzles/challenges
    'ending_scenarios'  -- Multiple possible endings
);

-- Content quality levels
CREATE TYPE content_quality AS ENUM (
    'draft',           -- Quick generation, basic quality
    'standard',        -- Good quality, balanced speed/quality
    'premium',         -- High quality, slower generation
    'custom'          -- Custom parameters specified
);

-- =============================================================================
-- AI STORY GENERATION CORE TABLES
-- =============================================================================

-- Story generation requests and results
CREATE TABLE cluequest_ai_story_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    
    -- Generation request details
    component_type story_component_type NOT NULL,
    generation_prompt TEXT NOT NULL,
    user_preferences JSONB DEFAULT '{}',
    
    -- Story parameters from adventure builder
    adventure_theme TEXT NOT NULL,
    target_audience TEXT NOT NULL, -- 'children', 'teens', 'adults', 'professionals'
    story_tone TEXT NOT NULL, -- 'adventurous', 'mysterious', 'educational', 'corporate', 'fun'
    difficulty_level TEXT NOT NULL,
    estimated_duration INTEGER, -- minutes
    max_participants INTEGER,
    
    -- Generation configuration
    quality_level content_quality DEFAULT 'standard',
    ai_provider TEXT NOT NULL DEFAULT 'openai', -- 'openai', 'anthropic', 'local'
    model_version TEXT NOT NULL,
    max_tokens INTEGER DEFAULT 2000,
    temperature DECIMAL(3,2) DEFAULT 0.7,
    
    -- Generated content
    generated_content TEXT,
    content_structure JSONB DEFAULT '{}', -- Structured breakdown of the story
    generated_scenes JSONB DEFAULT '[]', -- Array of scene objects
    generated_roles JSONB DEFAULT '[]', -- Array of character roles
    suggested_challenges JSONB DEFAULT '[]', -- Challenge ideas that fit the story
    
    -- Content analysis
    content_length INTEGER, -- Character count
    readability_score INTEGER, -- 0-100 (higher = more readable)
    engagement_score INTEGER, -- 0-100 (predicted user engagement)
    originality_score INTEGER, -- 0-100 (how unique the content is)
    theme_alignment_score INTEGER, -- 0-100 (how well it matches the theme)
    
    -- Generation metadata
    generation_time_seconds INTEGER,
    generation_cost DECIMAL(10,4),
    tokens_used INTEGER,
    
    -- Status and lifecycle
    status story_generation_status DEFAULT 'pending',
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    
    -- User interaction
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    user_feedback TEXT,
    improvement_suggestions JSONB DEFAULT '[]',
    is_user_approved BOOLEAN DEFAULT FALSE,
    
    -- Content moderation
    moderation_passed BOOLEAN DEFAULT FALSE,
    moderation_score INTEGER, -- 0-100 (safety score)
    moderation_flags JSONB DEFAULT '[]',
    inappropriate_content_detected BOOLEAN DEFAULT FALSE,
    
    -- Usage tracking
    times_viewed INTEGER DEFAULT 0,
    times_copied INTEGER DEFAULT 0,
    times_modified INTEGER DEFAULT 0,
    applied_to_adventure BOOLEAN DEFAULT FALSE,
    applied_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days') -- Generated content expires
);

-- Story generation iterations for improvement
CREATE TABLE cluequest_ai_story_iterations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_generation_id UUID NOT NULL REFERENCES cluequest_ai_story_generations(id) ON DELETE CASCADE,
    iteration_number INTEGER NOT NULL,
    
    -- Improvement request
    improvement_type TEXT NOT NULL, -- 'tone_adjustment', 'length_change', 'complexity_change', 'theme_refinement', 'complete_rewrite'
    user_instructions TEXT NOT NULL,
    specific_changes_requested JSONB DEFAULT '[]',
    
    -- Previous vs new content comparison
    previous_content TEXT,
    new_content TEXT NOT NULL,
    changes_made JSONB DEFAULT '[]', -- Detailed list of what changed
    
    -- Quality improvements
    quality_delta JSONB DEFAULT '{}', -- Changes in quality metrics
    user_satisfaction_improvement INTEGER, -- -100 to +100
    
    -- Generation details
    ai_provider TEXT NOT NULL,
    model_version TEXT NOT NULL,
    generation_time_seconds INTEGER,
    generation_cost DECIMAL(10,4),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(parent_generation_id, iteration_number)
);

-- User feedback on AI generated stories
CREATE TABLE cluequest_ai_story_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generation_id UUID NOT NULL REFERENCES cluequest_ai_story_generations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Detailed feedback categories
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    creativity_rating INTEGER CHECK (creativity_rating >= 1 AND creativity_rating <= 5),
    coherence_rating INTEGER CHECK (coherence_rating >= 1 AND coherence_rating <= 5),
    theme_fit_rating INTEGER CHECK (theme_fit_rating >= 1 AND theme_fit_rating <= 5),
    engagement_rating INTEGER CHECK (engagement_rating >= 1 AND engagement_rating <= 5),
    
    -- Specific feedback
    liked_aspects TEXT[],
    disliked_aspects TEXT[],
    suggestions_for_improvement TEXT,
    
    -- Behavioral feedback
    would_use_again BOOLEAN,
    would_recommend BOOLEAN,
    preferred_alternative TEXT, -- If they preferred a different version
    
    -- Context
    feedback_stage TEXT DEFAULT 'after_generation', -- 'during_review', 'after_generation', 'after_implementation'
    time_spent_reviewing INTEGER, -- seconds spent reading the generated content
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(generation_id, user_id)
);

-- AI story templates for faster generation
CREATE TABLE cluequest_ai_story_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    
    -- Template identity
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'corporate', 'educational', 'entertainment', 'mystery', 'fantasy'
    
    -- Template structure
    story_framework JSONB NOT NULL, -- Structured template with placeholders
    scene_templates JSONB DEFAULT '[]',
    character_archetypes JSONB DEFAULT '[]',
    challenge_patterns JSONB DEFAULT '[]',
    
    -- Generation parameters
    default_prompt_template TEXT NOT NULL,
    recommended_settings JSONB DEFAULT '{}',
    variable_placeholders JSONB DEFAULT '[]', -- What can be customized
    
    -- Usage and performance
    usage_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0,
    average_user_rating DECIMAL(3,2),
    average_generation_time INTEGER, -- seconds
    
    -- Customization options
    allows_customization BOOLEAN DEFAULT TRUE,
    customization_options JSONB DEFAULT '[]',
    
    -- Status and access
    is_active BOOLEAN DEFAULT TRUE,
    is_premium BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Story generation analytics for optimization
CREATE TABLE cluequest_ai_story_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    
    -- Time period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Generation metrics
    total_generations INTEGER DEFAULT 0,
    successful_generations INTEGER DEFAULT 0,
    failed_generations INTEGER DEFAULT 0,
    average_generation_time DECIMAL(10,2),
    total_cost DECIMAL(10,4),
    
    -- Quality metrics
    average_user_rating DECIMAL(3,2),
    average_readability_score DECIMAL(5,2),
    average_engagement_score DECIMAL(5,2),
    approval_rate DECIMAL(5,2),
    
    -- Usage patterns
    most_popular_themes JSONB DEFAULT '[]',
    most_popular_tones JSONB DEFAULT '[]',
    peak_usage_hours JSONB DEFAULT '[]',
    
    -- Performance by provider
    provider_performance JSONB DEFAULT '{}', -- Performance breakdown by AI provider
    model_performance JSONB DEFAULT '{}', -- Performance by model version
    
    -- User behavior
    average_iterations_per_story DECIMAL(3,1),
    retry_rate DECIMAL(5,2),
    template_usage_rate DECIMAL(5,2),
    
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- PERFORMANCE INDEXES FOR AI STORY GENERATION
-- =============================================================================

-- Story generation indexes for fast queries
CREATE INDEX idx_ai_story_generations_user ON cluequest_ai_story_generations(user_id, created_at DESC);
CREATE INDEX idx_ai_story_generations_adventure ON cluequest_ai_story_generations(adventure_id, status);
CREATE INDEX idx_ai_story_generations_org ON cluequest_ai_story_generations(organization_id, created_at DESC);
CREATE INDEX idx_ai_story_generations_status ON cluequest_ai_story_generations(status, created_at DESC);
CREATE INDEX idx_ai_story_generations_pending ON cluequest_ai_story_generations(status, created_at) 
    WHERE status IN ('pending', 'generating');

-- Quality and performance indexes
CREATE INDEX idx_ai_story_generations_rating ON cluequest_ai_story_generations(user_rating DESC, created_at DESC) 
    WHERE user_rating IS NOT NULL;
CREATE INDEX idx_ai_story_generations_approved ON cluequest_ai_story_generations(is_user_approved, organization_id) 
    WHERE is_user_approved = TRUE;
CREATE INDEX idx_ai_story_generations_component ON cluequest_ai_story_generations(component_type, adventure_theme);

-- Feedback and iteration indexes
CREATE INDEX idx_ai_story_feedback_generation ON cluequest_ai_story_feedback(generation_id);
CREATE INDEX idx_ai_story_iterations_parent ON cluequest_ai_story_iterations(parent_generation_id, iteration_number);

-- Template indexes for fast lookup
CREATE INDEX idx_ai_story_templates_category ON cluequest_ai_story_templates(category, is_active) 
    WHERE is_active = TRUE;
CREATE INDEX idx_ai_story_templates_org ON cluequest_ai_story_templates(organization_id, usage_count DESC);
CREATE INDEX idx_ai_story_templates_rating ON cluequest_ai_story_templates(average_user_rating DESC) 
    WHERE average_user_rating IS NOT NULL;

-- Analytics indexes
CREATE INDEX idx_ai_story_analytics_period ON cluequest_ai_story_analytics(organization_id, period_start, period_end);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all AI story tables
ALTER TABLE cluequest_ai_story_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_ai_story_iterations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_ai_story_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_ai_story_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_ai_story_analytics ENABLE ROW LEVEL SECURITY;

-- Story generations: Users can access their own generations and org members can view
CREATE POLICY "Users can manage own story generations" ON cluequest_ai_story_generations
    FOR ALL USING (
        user_id = auth.uid()
        OR organization_id IN (
            SELECT organization_id 
            FROM cluequest_organization_members 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin') 
            AND is_active = TRUE
        )
    );

-- Story iterations: Linked to parent generation permissions
CREATE POLICY "Users can view story iterations" ON cluequest_ai_story_iterations
    FOR SELECT USING (
        parent_generation_id IN (
            SELECT id FROM cluequest_ai_story_generations 
            WHERE user_id = auth.uid()
        )
    );

-- Story feedback: Users can provide feedback on stories they can access
CREATE POLICY "Users can provide story feedback" ON cluequest_ai_story_feedback
    FOR ALL USING (
        user_id = auth.uid()
        OR generation_id IN (
            SELECT id FROM cluequest_ai_story_generations 
            WHERE user_id = auth.uid()
        )
    );

-- Story templates: Organization members can use templates
CREATE POLICY "Organization members can use story templates" ON cluequest_ai_story_templates
    FOR SELECT USING (
        is_active = TRUE
        AND (
            organization_id IS NULL -- Global templates
            OR organization_id IN (
                SELECT organization_id 
                FROM cluequest_organization_members 
                WHERE user_id = auth.uid() AND is_active = TRUE
            )
        )
    );

-- Analytics: Organization admins can view analytics
CREATE POLICY "Organization admins can view story analytics" ON cluequest_ai_story_analytics
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id 
            FROM cluequest_organization_members 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin') 
            AND is_active = TRUE
        )
    );

-- =============================================================================
-- RPC FUNCTIONS FOR AI STORY GENERATION
-- =============================================================================

-- Get story generation with all related data
CREATE OR REPLACE FUNCTION get_story_generation_complete(generation_id_param UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'generation', (
            SELECT row_to_json(sg) 
            FROM cluequest_ai_story_generations sg 
            WHERE sg.id = generation_id_param
        ),
        'iterations', (
            SELECT COALESCE(jsonb_agg(
                row_to_json(si) 
                ORDER BY si.iteration_number
            ), '[]'::jsonb)
            FROM cluequest_ai_story_iterations si
            WHERE si.parent_generation_id = generation_id_param
        ),
        'feedback', (
            SELECT COALESCE(jsonb_agg(row_to_json(sf)), '[]'::jsonb)
            FROM cluequest_ai_story_feedback sf
            WHERE sf.generation_id = generation_id_param
        ),
        'adventure_context', (
            SELECT jsonb_build_object(
                'title', a.title,
                'theme', a.theme_name,
                'difficulty', a.difficulty,
                'duration', a.estimated_duration,
                'max_participants', a.max_participants
            )
            FROM cluequest_adventures a
            JOIN cluequest_ai_story_generations sg ON a.id = sg.adventure_id
            WHERE sg.id = generation_id_param
        )
    ) INTO result;
    
    RETURN result;
END;
$$;

-- Request new story generation
CREATE OR REPLACE FUNCTION request_story_generation(
    adventure_id_param UUID,
    component_type_param story_component_type,
    generation_prompt_param TEXT,
    preferences JSONB DEFAULT '{}',
    quality_level_param content_quality DEFAULT 'standard'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    generation_id UUID;
    adventure_data RECORD;
    estimated_cost DECIMAL(10,4);
    estimated_time INTEGER;
BEGIN
    -- Get adventure context
    SELECT a.*, o.id as org_id
    INTO adventure_data
    FROM cluequest_adventures a
    JOIN cluequest_organizations o ON a.organization_id = o.id
    WHERE a.id = adventure_id_param;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', FALSE, 'error', 'Adventure not found');
    END IF;
    
    -- Estimate cost and time based on quality level and content type
    estimated_cost := CASE quality_level_param
        WHEN 'draft' THEN 0.02
        WHEN 'standard' THEN 0.05
        WHEN 'premium' THEN 0.12
        WHEN 'custom' THEN 0.08
    END;
    
    estimated_time := CASE component_type_param
        WHEN 'full_story' THEN 45
        WHEN 'opening_scene' THEN 15
        WHEN 'scene_narrative' THEN 10
        WHEN 'character_roles' THEN 20
        WHEN 'plot_outline' THEN 30
        WHEN 'challenge_context' THEN 12
        WHEN 'ending_scenarios' THEN 25
    END;
    
    -- Create story generation request
    INSERT INTO cluequest_ai_story_generations (
        adventure_id,
        user_id,
        organization_id,
        component_type,
        generation_prompt,
        user_preferences,
        adventure_theme,
        target_audience,
        story_tone,
        difficulty_level,
        estimated_duration,
        max_participants,
        quality_level,
        ai_provider,
        model_version,
        status
    ) VALUES (
        adventure_id_param,
        auth.uid(),
        adventure_data.org_id,
        component_type_param,
        generation_prompt_param,
        preferences,
        adventure_data.theme_name,
        COALESCE(preferences->>'target_audience', 'adults'),
        COALESCE(preferences->>'story_tone', 'adventurous'),
        adventure_data.difficulty::text,
        adventure_data.estimated_duration,
        adventure_data.max_participants,
        quality_level_param,
        'openai',
        'gpt-4',
        'pending'
    ) RETURNING id INTO generation_id;
    
    RETURN jsonb_build_object(
        'success', TRUE,
        'generation_id', generation_id,
        'estimated_cost', estimated_cost,
        'estimated_time_seconds', estimated_time,
        'status', 'pending'
    );
END;
$$;

-- Update story generation with AI results
CREATE OR REPLACE FUNCTION update_story_generation_result(
    generation_id_param UUID,
    generated_content_param TEXT,
    content_structure_param JSONB DEFAULT '{}',
    generation_metadata JSONB DEFAULT '{}'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    content_length INTEGER;
    readability_score INTEGER;
    engagement_score INTEGER;
BEGIN
    -- Calculate content metrics
    content_length := LENGTH(generated_content_param);
    readability_score := GREATEST(0, LEAST(100, 100 - (content_length / 50))); -- Simple readability approximation
    engagement_score := GREATEST(0, LEAST(100, (content_length / 20) + (array_length(string_to_array(generated_content_param, '!'), 1) * 5))); -- Simple engagement score
    
    -- Update the generation record
    UPDATE cluequest_ai_story_generations
    SET 
        generated_content = generated_content_param,
        content_structure = content_structure_param,
        content_length = content_length,
        readability_score = readability_score,
        engagement_score = engagement_score,
        generation_time_seconds = COALESCE((generation_metadata->>'generation_time_seconds')::integer, 0),
        generation_cost = COALESCE((generation_metadata->>'generation_cost')::decimal, 0),
        tokens_used = COALESCE((generation_metadata->>'tokens_used')::integer, 0),
        status = 'completed',
        completed_at = NOW(),
        updated_at = NOW()
    WHERE id = generation_id_param
    AND user_id = auth.uid();
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', FALSE, 'error', 'Generation not found or access denied');
    END IF;
    
    RETURN jsonb_build_object(
        'success', TRUE,
        'content_length', content_length,
        'readability_score', readability_score,
        'engagement_score', engagement_score
    );
END;
$$;

-- =============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================================================

-- Update story generation timestamps
CREATE TRIGGER update_ai_story_generations_updated_at 
    BEFORE UPDATE ON cluequest_ai_story_generations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_story_templates_updated_at 
    BEFORE UPDATE ON cluequest_ai_story_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Track story template usage
CREATE OR REPLACE FUNCTION track_story_template_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.generated_content IS NOT NULL AND OLD.generated_content IS NULL THEN
        -- Story was generated, increment usage count for templates used
        UPDATE cluequest_ai_story_templates
        SET usage_count = usage_count + 1,
            updated_at = NOW()
        WHERE id = ANY(
            SELECT DISTINCT (value->>'template_id')::UUID 
            FROM jsonb_array_elements(NEW.user_preferences->'templates_used') 
            WHERE value->>'template_id' IS NOT NULL
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_track_story_template_usage
    AFTER UPDATE ON cluequest_ai_story_generations
    FOR EACH ROW EXECUTE FUNCTION track_story_template_usage();

-- =============================================================================
-- DEFAULT STORY TEMPLATES
-- =============================================================================

-- Insert default story templates for common scenarios
INSERT INTO cluequest_ai_story_templates (name, description, category, story_framework, default_prompt_template, recommended_settings) VALUES
(
    'Corporate Team Building Mystery',
    'A professional mystery scenario perfect for corporate team building events',
    'corporate',
    '{
        "structure": "three_act",
        "opening": "Company retreat with mysterious disappearance",
        "middle": "Teams investigate clues around office/venue",
        "climax": "Discovery and resolution requiring collaboration",
        "themes": ["teamwork", "communication", "problem_solving"],
        "tone": "professional but engaging"
    }',
    'Create a corporate team building mystery story with the theme "{theme}" for {max_participants} participants. The story should promote teamwork and take approximately {duration} minutes to complete. Set in a {setting} environment with a {tone} tone.',
    '{
        "recommended_duration": 60,
        "ideal_team_size": 4,
        "difficulty": "intermediate",
        "tone_options": ["professional", "light-hearted", "competitive"]
    }'
),
(
    'Educational Treasure Hunt',
    'Educational adventure that teaches while entertaining',
    'educational', 
    '{
        "structure": "quest_based",
        "opening": "Historical mystery or scientific discovery",
        "progression": "Learning through exploration and challenges",
        "resolution": "Knowledge application to solve final puzzle",
        "educational_goals": ["critical_thinking", "research_skills", "collaboration"],
        "age_appropriate": true
    }',
    'Design an educational treasure hunt about {subject} for {target_audience}. Include {learning_objectives} as core learning goals. Make it engaging and age-appropriate for {duration} minutes of play.',
    '{
        "recommended_duration": 45,
        "learning_integration": "seamless",
        "assessment_opportunities": true,
        "adaptable_difficulty": true
    }'
),
(
    'Fantasy Adventure Quest', 
    'Epic fantasy adventure with mythical creatures and magic',
    'entertainment',
    '{
        "structure": "heroes_journey",
        "opening": "Call to adventure in magical realm",
        "challenges": "Mythical creatures, magical puzzles, ancient riddles",
        "climax": "Final battle or ultimate challenge",
        "themes": ["courage", "friendship", "good_vs_evil"],
        "fantasy_elements": ["magic", "creatures", "ancient_mysteries"]
    }',
    'Create an epic fantasy adventure with {theme} theme. Include magical elements, mythical creatures, and heroic challenges for {max_participants} brave adventurers. The quest should take {duration} minutes and have a {tone} atmosphere.',
    '{
        "recommended_duration": 90,
        "magic_system": "simple_but_engaging", 
        "creature_encounters": "age_appropriate",
        "victory_conditions": "collaborative"
    }'
);

COMMENT ON SCHEMA public IS 'ClueQuest AI Story Generation System - Comprehensive AI-powered story creation with user feedback, iterations, and quality optimization. Built for the ClueQuest adventure platform.';