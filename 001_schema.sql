CREATE TABLE IF NOT EXISTS public.cluequest_organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    website_url text,
    logo_url text,
    industry text,
    company_size text CHECK (company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+')),
    country text,
    timezone text DEFAULT 'UTC',
    settings jsonb DEFAULT '{}',
    billing_email text,
    is_active boolean DEFAULT true,
    trial_ends_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cluequest_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL,
    full_name text,
    avatar_url text,
    timezone text DEFAULT 'UTC',
    language text DEFAULT 'en',
    country text,
    phone text,
    job_title text,
    company text,
    bio text,
    preferences jsonb DEFAULT '{}',
    is_verified boolean DEFAULT false,
    last_login timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TYPE IF NOT EXISTS adventure_category AS ENUM (
    'mystery', 'puzzle', 'escape_room', 'treasure_hunt', 'detective', 'adventure', 'horror', 'fantasy', 'sci_fi', 'historical'
);

CREATE TYPE IF NOT EXISTS difficulty_level AS ENUM (
    'beginner', 'intermediate', 'advanced', 'expert'
);

CREATE TYPE IF NOT EXISTS adventure_status AS ENUM (
    'draft', 'published', 'active', 'paused', 'completed', 'archived'
);

CREATE TABLE IF NOT EXISTS public.cluequest_adventures (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES public.cluequest_organizations(id) ON DELETE CASCADE,
    creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    category adventure_category NOT NULL,
    difficulty difficulty_level NOT NULL,
    estimated_duration integer DEFAULT 30,
    theme_name text DEFAULT 'default',
    theme_config jsonb DEFAULT '{}',
    cover_image_url text,
    background_music_url text,
    settings jsonb DEFAULT '{}',
    security_config jsonb DEFAULT '{}',
    allows_teams boolean DEFAULT true,
    max_team_size integer DEFAULT 4,
    max_participants integer DEFAULT 50,
    min_participants integer DEFAULT 1,
    leaderboard_enabled boolean DEFAULT true,
    live_tracking boolean DEFAULT true,
    chat_enabled boolean DEFAULT false,
    hints_enabled boolean DEFAULT true,
    ai_personalization boolean DEFAULT false,
    adaptive_difficulty boolean DEFAULT false,
    ai_avatars_enabled boolean DEFAULT true,
    ai_narrative_enabled boolean DEFAULT false,
    offline_mode boolean DEFAULT true,
    accessibility_features jsonb DEFAULT '[]',
    language_support text[] DEFAULT ARRAY['en'],
    status adventure_status DEFAULT 'draft',
    scheduled_start timestamptz,
    scheduled_end timestamptz,
    tags text[] DEFAULT '{}',
    is_template boolean DEFAULT false,
    is_public boolean DEFAULT false,
    total_sessions integer DEFAULT 0,
    total_participants integer DEFAULT 0,
    average_completion_time integer,
    completion_rate decimal(5,2) DEFAULT 0,
    rating decimal(3,2) DEFAULT 0,
    review_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cluequest_adventure_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id uuid NOT NULL REFERENCES public.cluequest_adventures(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    perks jsonb DEFAULT '[]',
    point_multiplier decimal(3,2) DEFAULT 1.0,
    max_players integer DEFAULT 5,
    is_available boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cluequest_scenes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id uuid NOT NULL REFERENCES public.cluequest_adventures(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    order_index integer NOT NULL,
    interaction_type text NOT NULL,
    completion_criteria text,
    points_reward integer DEFAULT 0,
    narrative_data jsonb DEFAULT '{}',
    scene_config jsonb DEFAULT '{}',
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cluequest_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id uuid NOT NULL REFERENCES public.cluequest_adventures(id) ON DELETE CASCADE,
    name text NOT NULL,
    status text DEFAULT 'active',
    max_participants integer DEFAULT 50,
    current_participants integer DEFAULT 0,
    start_time timestamptz DEFAULT now(),
    end_time timestamptz,
    settings jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cluequest_players (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id uuid NOT NULL REFERENCES public.cluequest_sessions(id) ON DELETE CASCADE,
    profile_id uuid NOT NULL REFERENCES public.cluequest_profiles(id) ON DELETE CASCADE,
    role_id uuid REFERENCES public.cluequest_adventure_roles(id),
    team_id uuid,
    score integer DEFAULT 0,
    status text DEFAULT 'active',
    joined_at timestamptz DEFAULT now(),
    completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.cluequest_teams (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id uuid NOT NULL REFERENCES public.cluequest_sessions(id) ON DELETE CASCADE,
    name text NOT NULL,
    color text DEFAULT '#FF0000',
    score integer DEFAULT 0,
    max_players integer DEFAULT 4,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cluequest_ar_assets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id uuid NOT NULL REFERENCES public.cluequest_scenes(id) ON DELETE CASCADE,
    asset_type text NOT NULL,
    asset_url text NOT NULL,
    position jsonb DEFAULT '{"x": 0, "y": 0, "z": 0}',
    rotation jsonb DEFAULT '{"x": 0, "y": 0, "z": 0}',
    scale jsonb DEFAULT '{"x": 1, "y": 1, "z": 1}',
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cluequest_qr_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id uuid NOT NULL REFERENCES public.cluequest_scenes(id) ON DELETE CASCADE,
    qr_data text NOT NULL,
    location jsonb,
    is_active boolean DEFAULT true,
    scan_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cluequest_leaderboard (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id uuid NOT NULL REFERENCES public.cluequest_sessions(id) ON DELETE CASCADE,
    player_id uuid NOT NULL REFERENCES public.cluequest_players(id) ON DELETE CASCADE,
    score integer NOT NULL,
    rank integer,
    completed_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cluequest_achievements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    icon_url text,
    points_reward integer DEFAULT 0,
    criteria text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cluequest_ai_stories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id uuid REFERENCES public.cluequest_adventures(id) ON DELETE CASCADE,
    prompt text NOT NULL,
    generated_story text NOT NULL,
    story_type text NOT NULL,
    story_framework text,
    ai_model text,
    generation_parameters jsonb DEFAULT '{}',
    quality_score decimal(3,2),
    is_approved boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cluequest_ai_characters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id uuid REFERENCES public.cluequest_adventures(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    personality_traits jsonb DEFAULT '[]',
    background_story text,
    dialogue_style text,
    ai_model text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cluequest_ai_interactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id uuid REFERENCES public.cluequest_scenes(id) ON DELETE CASCADE,
    character_id uuid REFERENCES public.cluequest_ai_characters(id) ON DELETE CASCADE,
    interaction_type text NOT NULL,
    ai_response text NOT NULL,
    context jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);
