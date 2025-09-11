-- Enhanced Story System for ClueQuest 25 Stories
-- Based on comprehensive analysis and best practices for escape room design
-- Implements all 25 stories with advanced puzzle mechanics, AR, QR, and AI features

-- Enhanced adventure categories to support all 25 stories
CREATE TYPE IF NOT EXISTS enhanced_adventure_category AS ENUM (
    'mystery', 'fantasy', 'hacker', 'corporate', 'educational'
);

-- Enhanced difficulty levels with more granular control
CREATE TYPE IF NOT EXISTS enhanced_difficulty_level AS ENUM (
    'beginner', 'intermediate', 'advanced', 'expert', 'master'
);

-- Puzzle types for advanced mechanics
CREATE TYPE IF NOT EXISTS puzzle_type AS ENUM (
    'logical', 'physical', 'digital', 'social', 'creative', 'cryptographic', 
    'spatial', 'temporal', 'linguistic', 'mathematical', 'scientific', 'artistic'
);

-- Technology integration types
CREATE TYPE IF NOT EXISTS tech_integration AS ENUM (
    'qr_code', 'ar_overlay', 'geolocation', 'voice_recognition', 'gesture_control',
    'ai_interaction', 'haptic_feedback', 'biometric', 'nfc', 'bluetooth'
);

-- Story progression types
CREATE TYPE IF NOT EXISTS progression_type AS ENUM (
    'linear', 'branching', 'hub_based', 'parallel', 'open_world'
);

-- Enhanced Adventures Table with all 25 stories support
CREATE TABLE IF NOT EXISTS public.cluequest_enhanced_adventures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.cluequest_organizations(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic Story Information
    story_id TEXT UNIQUE NOT NULL, -- e.g., 'midnight_express', 'dragon_academy'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    full_description TEXT, -- Extended description for detailed setup
    category enhanced_adventure_category NOT NULL,
    difficulty enhanced_difficulty_level NOT NULL,
    
    -- Story Structure
    estimated_duration INTEGER NOT NULL, -- minutes
    scene_count INTEGER NOT NULL,
    progression_type progression_type DEFAULT 'linear',
    
    -- Player Configuration
    min_players INTEGER NOT NULL,
    max_players INTEGER NOT NULL,
    recommended_players INTEGER, -- Optimal player count
    min_age INTEGER NOT NULL,
    max_age INTEGER,
    
    -- Setup Requirements
    setup_time INTEGER DEFAULT 15, -- minutes to set up
    location_type TEXT NOT NULL, -- 'indoor', 'outdoor', 'mixed'
    space_requirements TEXT, -- 'small_room', 'large_room', 'multiple_rooms', 'outdoor_area'
    
    -- Materials and Equipment
    required_materials JSONB DEFAULT '[]', -- List of physical materials needed
    tech_requirements JSONB DEFAULT '[]', -- List of technology requirements
    optional_materials JSONB DEFAULT '[]', -- Optional enhancement materials
    
    -- Learning and Skills
    learning_objectives JSONB DEFAULT '[]', -- Educational goals
    skills_developed JSONB DEFAULT '[]', -- Skills players will develop
    knowledge_areas JSONB DEFAULT '[]', -- Subject areas covered
    
    -- Game Mechanics
    puzzle_types puzzle_type[] DEFAULT '{}', -- Types of puzzles in this story
    tech_integrations tech_integration[] DEFAULT '{}', -- Technology features used
    special_mechanics JSONB DEFAULT '{}', -- Unique game mechanics
    
    -- Narrative Structure
    narrative_hook TEXT, -- Opening hook to engage players
    story_acts JSONB DEFAULT '[]', -- Detailed act structure
    character_roles JSONB DEFAULT '[]', -- Available character roles
    story_themes JSONB DEFAULT '[]', -- Themes explored in the story
    
    -- Difficulty Progression
    difficulty_curve JSONB DEFAULT '{}', -- How difficulty escalates
    hint_system JSONB DEFAULT '{}', -- Hint system configuration
    adaptive_difficulty BOOLEAN DEFAULT FALSE,
    
    -- Technology Features
    qr_codes_enabled BOOLEAN DEFAULT TRUE,
    ar_features JSONB DEFAULT '{}', -- AR configuration
    ai_characters JSONB DEFAULT '[]', -- AI character interactions
    voice_interactions BOOLEAN DEFAULT FALSE,
    gesture_controls BOOLEAN DEFAULT FALSE,
    
    -- Accessibility and Localization
    accessibility_features JSONB DEFAULT '[]',
    language_support TEXT[] DEFAULT ARRAY['en'],
    cultural_adaptations JSONB DEFAULT '{}',
    
    -- Visual and Audio
    theme_config JSONB DEFAULT '{}', -- Colors, fonts, styling
    cover_image_url TEXT,
    background_music_url TEXT,
    sound_effects JSONB DEFAULT '[]',
    visual_effects JSONB DEFAULT '[]',
    
    -- Metrics and Analytics
    completion_rate DECIMAL(5,2) DEFAULT 0,
    average_completion_time INTEGER,
    player_satisfaction DECIMAL(3,2) DEFAULT 0,
    replay_value INTEGER DEFAULT 0, -- 1-10 scale
    
    -- Status and Lifecycle
    status adventure_status DEFAULT 'draft',
    is_template BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    version TEXT DEFAULT '1.0.0',
    
    -- Metadata
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced Scenes Table for detailed scene management
CREATE TABLE IF NOT EXISTS public.cluequest_enhanced_scenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID NOT NULL REFERENCES public.cluequest_enhanced_adventures(id) ON DELETE CASCADE,
    
    -- Scene Identification
    scene_number INTEGER NOT NULL,
    scene_id TEXT NOT NULL, -- e.g., 'act1_intro', 'puzzle_room_1'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    
    -- Scene Structure
    act_number INTEGER, -- Which act this scene belongs to
    is_optional BOOLEAN DEFAULT FALSE,
    unlock_conditions JSONB DEFAULT '{}', -- Conditions to unlock this scene
    
    -- Scene Content
    narrative_content TEXT, -- Story text for this scene
    objectives JSONB DEFAULT '[]', -- Scene objectives
    completion_criteria JSONB DEFAULT '{}', -- How to complete this scene
    
    -- Puzzles and Challenges
    puzzles JSONB DEFAULT '[]', -- Puzzles in this scene
    challenges JSONB DEFAULT '[]', -- Challenges to overcome
    interactions JSONB DEFAULT '[]', -- Interactive elements
    
    -- Technology Integration
    qr_codes JSONB DEFAULT '[]', -- QR codes in this scene
    ar_elements JSONB DEFAULT '[]', -- AR elements
    tech_interactions JSONB DEFAULT '[]', -- Technology interactions
    
    -- Timing and Flow
    estimated_duration INTEGER, -- minutes for this scene
    time_limit INTEGER, -- optional time limit
    can_skip BOOLEAN DEFAULT FALSE,
    
    -- Hints and Help
    hints JSONB DEFAULT '[]', -- Available hints
    help_system JSONB DEFAULT '{}', -- Help configuration
    
    -- Rewards and Progression
    points_reward INTEGER DEFAULT 0,
    unlocks_next JSONB DEFAULT '[]', -- What this scene unlocks
    story_revelations JSONB DEFAULT '[]', -- Story elements revealed
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced Puzzles Table for advanced puzzle mechanics
CREATE TABLE IF NOT EXISTS public.cluequest_enhanced_puzzles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id UUID NOT NULL REFERENCES public.cluequest_enhanced_scenes(id) ON DELETE CASCADE,
    
    -- Puzzle Identification
    puzzle_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    
    -- Puzzle Classification
    puzzle_type puzzle_type NOT NULL,
    difficulty enhanced_difficulty_level NOT NULL,
    category TEXT, -- e.g., 'cryptography', 'logic', 'observation'
    
    -- Puzzle Content
    puzzle_data JSONB NOT NULL, -- The actual puzzle content
    solution_data JSONB NOT NULL, -- The solution
    alternative_solutions JSONB DEFAULT '[]', -- Multiple valid solutions
    
    -- Interaction Methods
    input_methods TEXT[] DEFAULT '{}', -- How players can input answers
    validation_rules JSONB DEFAULT '{}', -- How to validate solutions
    feedback_system JSONB DEFAULT '{}', -- Feedback for attempts
    
    -- Technology Integration
    tech_requirements tech_integration[] DEFAULT '{}',
    ar_components JSONB DEFAULT '[]',
    qr_integration JSONB DEFAULT '{}',
    
    -- Hints and Help
    hint_levels JSONB DEFAULT '[]', -- Progressive hints
    help_resources JSONB DEFAULT '[]', -- Additional help
    tutorial_mode BOOLEAN DEFAULT FALSE,
    
    -- Timing and Constraints
    time_limit INTEGER, -- seconds
    attempt_limit INTEGER, -- max attempts allowed
    can_skip BOOLEAN DEFAULT FALSE,
    
    -- Rewards and Consequences
    points_reward INTEGER DEFAULT 0,
    unlocks_content JSONB DEFAULT '[]',
    failure_consequences JSONB DEFAULT '{}',
    
    -- Analytics
    success_rate DECIMAL(5,2) DEFAULT 0,
    average_solve_time INTEGER,
    hint_usage_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced QR Codes Table with advanced features
CREATE TABLE IF NOT EXISTS public.cluequest_enhanced_qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id UUID NOT NULL REFERENCES public.cluequest_enhanced_scenes(id) ON DELETE CASCADE,
    
    -- QR Code Identification
    qr_id TEXT NOT NULL,
    qr_data TEXT NOT NULL,
    display_name TEXT, -- Human-readable name
    
    -- Location and Access
    location_description TEXT,
    geolocation JSONB, -- lat/lng coordinates
    geofence_radius INTEGER DEFAULT 50, -- meters
    access_requirements JSONB DEFAULT '{}', -- Conditions to access
    
    -- Content and Interaction
    content_type TEXT NOT NULL, -- 'clue', 'puzzle', 'narrative', 'reward'
    content_data JSONB NOT NULL, -- The content revealed
    interaction_type TEXT, -- 'scan', 'tap', 'voice', 'gesture'
    
    -- Technology Integration
    ar_overlay JSONB DEFAULT '{}', -- AR content
    voice_activation BOOLEAN DEFAULT FALSE,
    gesture_control BOOLEAN DEFAULT FALSE,
    
    -- Security and Access Control
    scan_limit INTEGER DEFAULT 1000,
    current_scans INTEGER DEFAULT 0,
    time_restrictions JSONB DEFAULT '{}', -- When QR is active
    player_restrictions JSONB DEFAULT '{}', -- Who can scan
    
    -- Analytics
    scan_analytics JSONB DEFAULT '{}', -- Usage statistics
    success_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced AR Assets Table for advanced AR features
CREATE TABLE IF NOT EXISTS public.cluequest_enhanced_ar_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id UUID NOT NULL REFERENCES public.cluequest_enhanced_scenes(id) ON DELETE CASCADE,
    
    -- Asset Identification
    asset_id TEXT NOT NULL,
    asset_name TEXT NOT NULL,
    asset_type TEXT NOT NULL, -- '3d_model', 'animation', 'overlay', 'interactive'
    
    -- Asset Content
    asset_url TEXT NOT NULL,
    asset_data JSONB DEFAULT '{}', -- Additional asset properties
    content_description TEXT,
    
    -- 3D Positioning and Animation
    position JSONB DEFAULT '{"x": 0, "y": 0, "z": 0}',
    rotation JSONB DEFAULT '{"x": 0, "y": 0, "z": 0}',
    scale JSONB DEFAULT '{"x": 1, "y": 1, "z": 1}',
    animation_data JSONB DEFAULT '{}',
    
    -- Interaction Properties
    is_interactive BOOLEAN DEFAULT FALSE,
    interaction_methods TEXT[] DEFAULT '{}',
    interaction_responses JSONB DEFAULT '{}',
    
    -- Triggering Conditions
    trigger_conditions JSONB DEFAULT '{}', -- When to show this asset
    visibility_rules JSONB DEFAULT '{}', -- Visibility conditions
    duration INTEGER, -- How long to show (seconds)
    
    -- Technology Requirements
    device_requirements JSONB DEFAULT '{}',
    performance_requirements JSONB DEFAULT '{}',
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced Hints System Table
CREATE TABLE IF NOT EXISTS public.cluequest_enhanced_hints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    puzzle_id UUID REFERENCES public.cluequest_enhanced_puzzles(id) ON DELETE CASCADE,
    scene_id UUID REFERENCES public.cluequest_enhanced_scenes(id) ON DELETE CASCADE,
    
    -- Hint Identification
    hint_level INTEGER NOT NULL, -- 1, 2, 3, etc.
    hint_type TEXT NOT NULL, -- 'direct', 'indirect', 'contextual', 'progressive'
    
    -- Hint Content
    hint_text TEXT NOT NULL,
    hint_media JSONB DEFAULT '[]', -- Images, videos, audio
    hint_interaction JSONB DEFAULT '{}', -- Interactive elements
    
    -- Hint Delivery
    delivery_method TEXT NOT NULL, -- 'text', 'voice', 'ar', 'qr'
    timing_rules JSONB DEFAULT '{}', -- When to show this hint
    cost INTEGER DEFAULT 0, -- Points cost for this hint
    
    -- Hint Effectiveness
    success_rate_improvement DECIMAL(5,2) DEFAULT 0,
    usage_statistics JSONB DEFAULT '{}',
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Story Templates Table for easy story creation
CREATE TABLE IF NOT EXISTS public.cluequest_story_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Template Identification
    template_id TEXT UNIQUE NOT NULL,
    template_name TEXT NOT NULL,
    category enhanced_adventure_category NOT NULL,
    description TEXT NOT NULL,
    
    -- Template Structure
    template_data JSONB NOT NULL, -- Complete story template
    default_settings JSONB DEFAULT '{}',
    customization_options JSONB DEFAULT '{}',
    
    -- Template Metadata
    difficulty_range enhanced_difficulty_level[] DEFAULT '{}',
    player_range JSONB DEFAULT '{}', -- min/max players
    age_range JSONB DEFAULT '{}', -- min/max age
    duration_range JSONB DEFAULT '{}', -- min/max duration
    
    -- Usage Statistics
    usage_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_enhanced_adventures_category ON public.cluequest_enhanced_adventures(category);
CREATE INDEX IF NOT EXISTS idx_enhanced_adventures_difficulty ON public.cluequest_enhanced_adventures(difficulty);
CREATE INDEX IF NOT EXISTS idx_enhanced_adventures_story_id ON public.cluequest_enhanced_adventures(story_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_adventures_status ON public.cluequest_enhanced_adventures(status);

CREATE INDEX IF NOT EXISTS idx_enhanced_scenes_adventure ON public.cluequest_enhanced_scenes(adventure_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_scenes_order ON public.cluequest_enhanced_scenes(adventure_id, order_index);
CREATE INDEX IF NOT EXISTS idx_enhanced_scenes_act ON public.cluequest_enhanced_scenes(adventure_id, act_number);

CREATE INDEX IF NOT EXISTS idx_enhanced_puzzles_scene ON public.cluequest_enhanced_puzzles(scene_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_puzzles_type ON public.cluequest_enhanced_puzzles(puzzle_type);
CREATE INDEX IF NOT EXISTS idx_enhanced_puzzles_difficulty ON public.cluequest_enhanced_puzzles(difficulty);

CREATE INDEX IF NOT EXISTS idx_enhanced_qr_scene ON public.cluequest_enhanced_qr_codes(scene_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_qr_content_type ON public.cluequest_enhanced_qr_codes(content_type);

CREATE INDEX IF NOT EXISTS idx_enhanced_ar_scene ON public.cluequest_enhanced_ar_assets(scene_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_ar_type ON public.cluequest_enhanced_ar_assets(asset_type);

CREATE INDEX IF NOT EXISTS idx_enhanced_hints_puzzle ON public.cluequest_enhanced_hints(puzzle_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_hints_scene ON public.cluequest_enhanced_hints(scene_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_hints_level ON public.cluequest_enhanced_hints(hint_level);

-- RLS Policies for security
ALTER TABLE public.cluequest_enhanced_adventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_enhanced_scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_enhanced_puzzles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_enhanced_qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_enhanced_ar_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_enhanced_hints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_story_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for enhanced adventures
CREATE POLICY "Users can view public enhanced adventures" ON public.cluequest_enhanced_adventures
    FOR SELECT USING (is_public = true OR organization_id IN (
        SELECT id FROM public.cluequest_organizations WHERE id IN (
            SELECT organization_id FROM public.cluequest_organization_members 
            WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can create enhanced adventures in their organizations" ON public.cluequest_enhanced_adventures
    FOR INSERT WITH CHECK (organization_id IN (
        SELECT id FROM public.cluequest_organizations WHERE id IN (
            SELECT organization_id FROM public.cluequest_organization_members 
            WHERE user_id = auth.uid() AND role IN ('admin', 'creator')
        )
    ));

CREATE POLICY "Users can update enhanced adventures in their organizations" ON public.cluequest_enhanced_adventures
    FOR UPDATE USING (organization_id IN (
        SELECT id FROM public.cluequest_organizations WHERE id IN (
            SELECT organization_id FROM public.cluequest_organization_members 
            WHERE user_id = auth.uid() AND role IN ('admin', 'creator')
        )
    ));

-- Similar policies for other tables...
-- (Additional RLS policies would be added here for scenes, puzzles, etc.)

-- Functions for story management
CREATE OR REPLACE FUNCTION public.create_story_from_template(
    template_id TEXT,
    organization_id UUID,
    creator_id UUID,
    customizations JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    new_adventure_id UUID;
    template_data JSONB;
BEGIN
    -- Get template data
    SELECT template_data INTO template_data
    FROM public.cluequest_story_templates
    WHERE template_id = create_story_from_template.template_id
    AND is_active = true;
    
    IF template_data IS NULL THEN
        RAISE EXCEPTION 'Template not found: %', template_id;
    END IF;
    
    -- Apply customizations
    template_data := template_data || customizations;
    
    -- Create new adventure
    INSERT INTO public.cluequest_enhanced_adventures (
        organization_id, creator_id, story_id, title, description,
        category, difficulty, estimated_duration, scene_count,
        min_players, max_players, min_age, location_type,
        required_materials, tech_requirements, learning_objectives,
        skills_developed, puzzle_types, tech_integrations,
        story_acts, character_roles, theme_config
    ) VALUES (
        create_story_from_template.organization_id,
        create_story_from_template.creator_id,
        template_data->>'story_id',
        template_data->>'title',
        template_data->>'description',
        (template_data->>'category')::enhanced_adventure_category,
        (template_data->>'difficulty')::enhanced_difficulty_level,
        (template_data->>'estimated_duration')::INTEGER,
        (template_data->>'scene_count')::INTEGER,
        (template_data->'player_range'->>'min')::INTEGER,
        (template_data->'player_range'->>'max')::INTEGER,
        (template_data->'age_range'->>'min')::INTEGER,
        template_data->>'location_type',
        template_data->'required_materials',
        template_data->'tech_requirements',
        template_data->'learning_objectives',
        template_data->'skills_developed',
        ARRAY(SELECT jsonb_array_elements_text(template_data->'puzzle_types')),
        ARRAY(SELECT jsonb_array_elements_text(template_data->'tech_integrations')),
        template_data->'story_acts',
        template_data->'character_roles',
        template_data->'theme_config'
    ) RETURNING id INTO new_adventure_id;
    
    -- Update template usage count
    UPDATE public.cluequest_story_templates
    SET usage_count = usage_count + 1
    WHERE template_id = create_story_from_template.template_id;
    
    RETURN new_adventure_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get story analytics
CREATE OR REPLACE FUNCTION public.get_story_analytics(story_id_param TEXT)
RETURNS JSONB AS $$
DECLARE
    analytics JSONB;
BEGIN
    SELECT jsonb_build_object(
        'completion_rate', completion_rate,
        'average_completion_time', average_completion_time,
        'player_satisfaction', player_satisfaction,
        'replay_value', replay_value,
        'total_sessions', total_sessions,
        'total_participants', total_participants
    ) INTO analytics
    FROM public.cluequest_enhanced_adventures
    WHERE story_id = story_id_param;
    
    RETURN analytics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE public.cluequest_enhanced_adventures IS 'Enhanced adventures table supporting all 25 ClueQuest stories with advanced features';
COMMENT ON TABLE public.cluequest_enhanced_scenes IS 'Detailed scene management for complex story structures';
COMMENT ON TABLE public.cluequest_enhanced_puzzles IS 'Advanced puzzle system with multiple types and technology integration';
COMMENT ON TABLE public.cluequest_enhanced_qr_codes IS 'Enhanced QR code system with geolocation and advanced interactions';
COMMENT ON TABLE public.cluequest_enhanced_ar_assets IS 'AR assets management for immersive experiences';
COMMENT ON TABLE public.cluequest_enhanced_hints IS 'Progressive hint system for better player experience';
COMMENT ON TABLE public.cluequest_story_templates IS 'Story templates for easy creation of new adventures';
