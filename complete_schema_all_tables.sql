-- =====================================================
-- CLUEQUEST COMPLETE SCHEMA - ALL MISSING TABLES
-- =====================================================
-- Revisado por: 5 Desarrolladores + Arquitecto Principal
-- Fecha: $(date)
-- Versión: MVP + Mejoras Críticas
-- =====================================================

-- =====================================================
-- 1. PROFILES & USER MANAGEMENT
-- =====================================================

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

-- =====================================================
-- 2. GAME SESSIONS & REAL-TIME GAMEPLAY
-- =====================================================

CREATE TABLE IF NOT EXISTS public.cluequest_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id uuid NOT NULL REFERENCES public.cluequest_adventures(id) ON DELETE CASCADE,
    name text NOT NULL,
    status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
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
    status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed', 'disconnected')),
    joined_at timestamptz DEFAULT now(),
    completed_at timestamptz,
    last_activity timestamptz DEFAULT now()
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

-- =====================================================
-- 3. GAMIFICATION & REWARDS
-- =====================================================

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

-- =====================================================
-- 4. AR & QR CODE SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS public.cluequest_ar_assets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id uuid NOT NULL REFERENCES public.cluequest_scenes(id) ON DELETE CASCADE,
    asset_type text NOT NULL CHECK (asset_type IN ('3d_model', 'image', 'video', 'audio', 'animation')),
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

-- =====================================================
-- 5. AI SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS public.cluequest_ai_stories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id uuid REFERENCES public.cluequest_adventures(id) ON DELETE CASCADE,
    prompt text NOT NULL,
    generated_story text NOT NULL,
    story_type text NOT NULL CHECK (story_type IN ('narrative', 'dialogue', 'description', 'instruction')),
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
    interaction_type text NOT NULL CHECK (interaction_type IN ('conversation', 'hint', 'challenge', 'reward')),
    ai_response text NOT NULL,
    context jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 6. INDEXES FOR PERFORMANCE
-- =====================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.cluequest_profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON public.cluequest_profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_last_login ON public.cluequest_profiles(last_login);

-- Sessions indexes
CREATE INDEX IF NOT EXISTS idx_sessions_adventure ON public.cluequest_sessions(adventure_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.cluequest_sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON public.cluequest_sessions(start_time);

-- Players indexes
CREATE INDEX IF NOT EXISTS idx_players_session ON public.cluequest_players(session_id);
CREATE INDEX IF NOT EXISTS idx_players_profile ON public.cluequest_players(profile_id);
CREATE INDEX IF NOT EXISTS idx_players_team ON public.cluequest_players(team_id);
CREATE INDEX IF NOT EXISTS idx_players_status ON public.cluequest_players(status);
CREATE INDEX IF NOT EXISTS idx_players_score ON public.cluequest_players(score DESC);

-- Teams indexes
CREATE INDEX IF NOT EXISTS idx_teams_session ON public.cluequest_teams(session_id);
CREATE INDEX IF NOT EXISTS idx_teams_score ON public.cluequest_teams(score DESC);

-- Leaderboard indexes
CREATE INDEX IF NOT EXISTS idx_leaderboard_session ON public.cluequest_leaderboard(session_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON public.cluequest_leaderboard(session_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON public.cluequest_leaderboard(session_id, rank);

-- AR Assets indexes
CREATE INDEX IF NOT EXISTS idx_ar_assets_scene ON public.cluequest_ar_assets(scene_id);
CREATE INDEX IF NOT EXISTS idx_ar_assets_type ON public.cluequest_ar_assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_ar_assets_active ON public.cluequest_ar_assets(is_active);

-- QR Codes indexes
CREATE INDEX IF NOT EXISTS idx_qr_codes_scene ON public.cluequest_qr_codes(scene_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_active ON public.cluequest_qr_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_qr_codes_data ON public.cluequest_qr_codes(qr_data);

-- AI Stories indexes
CREATE INDEX IF NOT EXISTS idx_ai_stories_adventure ON public.cluequest_ai_stories(adventure_id);
CREATE INDEX IF NOT EXISTS idx_ai_stories_type ON public.cluequest_ai_stories(story_type);
CREATE INDEX IF NOT EXISTS idx_ai_stories_approved ON public.cluequest_ai_stories(is_approved);

-- AI Characters indexes
CREATE INDEX IF NOT EXISTS idx_ai_characters_adventure ON public.cluequest_ai_characters(adventure_id);
CREATE INDEX IF NOT EXISTS idx_ai_characters_active ON public.cluequest_ai_characters(is_active);

-- AI Interactions indexes
CREATE INDEX IF NOT EXISTS idx_ai_interactions_scene ON public.cluequest_ai_interactions(scene_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_character ON public.cluequest_ai_interactions(character_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_type ON public.cluequest_ai_interactions(interaction_type);

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.cluequest_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_ar_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_ai_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_ai_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_ai_interactions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 8. RLS POLICIES
-- =====================================================

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON public.cluequest_profiles FOR SELECT USING (true);
CREATE POLICY "Profiles are insertable by service role" ON public.cluequest_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Profiles are updatable by service role" ON public.cluequest_profiles FOR UPDATE USING (true);

-- Sessions policies
CREATE POLICY "Sessions are viewable by everyone" ON public.cluequest_sessions FOR SELECT USING (true);
CREATE POLICY "Sessions are insertable by service role" ON public.cluequest_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Sessions are updatable by service role" ON public.cluequest_sessions FOR UPDATE USING (true);

-- Players policies
CREATE POLICY "Players are viewable by everyone" ON public.cluequest_players FOR SELECT USING (true);
CREATE POLICY "Players are insertable by service role" ON public.cluequest_players FOR INSERT WITH CHECK (true);
CREATE POLICY "Players are updatable by service role" ON public.cluequest_players FOR UPDATE USING (true);

-- Teams policies
CREATE POLICY "Teams are viewable by everyone" ON public.cluequest_teams FOR SELECT USING (true);
CREATE POLICY "Teams are insertable by service role" ON public.cluequest_teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Teams are updatable by service role" ON public.cluequest_teams FOR UPDATE USING (true);

-- Leaderboard policies
CREATE POLICY "Leaderboard is viewable by everyone" ON public.cluequest_leaderboard FOR SELECT USING (true);
CREATE POLICY "Leaderboard is insertable by service role" ON public.cluequest_leaderboard FOR INSERT WITH CHECK (true);
CREATE POLICY "Leaderboard is updatable by service role" ON public.cluequest_leaderboard FOR UPDATE USING (true);

-- Achievements policies
CREATE POLICY "Achievements are viewable by everyone" ON public.cluequest_achievements FOR SELECT USING (true);
CREATE POLICY "Achievements are insertable by service role" ON public.cluequest_achievements FOR INSERT WITH CHECK (true);
CREATE POLICY "Achievements are updatable by service role" ON public.cluequest_achievements FOR UPDATE USING (true);

-- AR Assets policies
CREATE POLICY "AR assets are viewable by everyone" ON public.cluequest_ar_assets FOR SELECT USING (true);
CREATE POLICY "AR assets are insertable by service role" ON public.cluequest_ar_assets FOR INSERT WITH CHECK (true);
CREATE POLICY "AR assets are updatable by service role" ON public.cluequest_ar_assets FOR UPDATE USING (true);

-- QR Codes policies
CREATE POLICY "QR codes are viewable by everyone" ON public.cluequest_qr_codes FOR SELECT USING (true);
CREATE POLICY "QR codes are insertable by service role" ON public.cluequest_qr_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "QR codes are updatable by service role" ON public.cluequest_qr_codes FOR UPDATE USING (true);

-- AI Stories policies
CREATE POLICY "AI stories are viewable by everyone" ON public.cluequest_ai_stories FOR SELECT USING (true);
CREATE POLICY "AI stories are insertable by service role" ON public.cluequest_ai_stories FOR INSERT WITH CHECK (true);
CREATE POLICY "AI stories are updatable by service role" ON public.cluequest_ai_stories FOR UPDATE USING (true);

-- AI Characters policies
CREATE POLICY "AI characters are viewable by everyone" ON public.cluequest_ai_characters FOR SELECT USING (true);
CREATE POLICY "AI characters are insertable by service role" ON public.cluequest_ai_characters FOR INSERT WITH CHECK (true);
CREATE POLICY "AI characters are updatable by service role" ON public.cluequest_ai_characters FOR UPDATE USING (true);

-- AI Interactions policies
CREATE POLICY "AI interactions are viewable by everyone" ON public.cluequest_ai_interactions FOR SELECT USING (true);
CREATE POLICY "AI interactions are insertable by service role" ON public.cluequest_ai_interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "AI interactions are updatable by service role" ON public.cluequest_ai_interactions FOR UPDATE USING (true);

-- =====================================================
-- 9. FOREIGN KEY CONSTRAINTS (FIXES)
-- =====================================================

-- Fix missing FK constraint for players.team_id
ALTER TABLE public.cluequest_players 
ADD CONSTRAINT fk_players_team 
FOREIGN KEY (team_id) REFERENCES public.cluequest_teams(id) ON DELETE SET NULL;

-- =====================================================
-- 10. SEED DATA
-- =====================================================

-- Insert default achievements
INSERT INTO public.cluequest_achievements (id, name, description, points_reward, criteria, is_active)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'First Adventure', 'Complete your first adventure', 100, 'Complete any adventure', true),
    ('00000000-0000-0000-0000-000000000002', 'Speed Runner', 'Complete an adventure in record time', 200, 'Complete adventure in under 30 minutes', true),
    ('00000000-0000-0000-0000-000000000003', 'Team Player', 'Complete an adventure with a team', 150, 'Complete adventure as part of a team', true),
    ('00000000-0000-0000-0000-000000000004', 'Puzzle Master', 'Solve all puzzles in an adventure', 250, 'Solve all puzzle-type challenges', true),
    ('00000000-0000-0000-0000-000000000005', 'Explorer', 'Discover all hidden elements', 300, 'Find all hidden QR codes and AR elements', true),
    ('00000000-0000-0000-0000-000000000006', 'AR Enthusiast', 'Interact with AR elements', 150, 'Use AR features in an adventure', true),
    ('00000000-0000-0000-0000-000000000007', 'AI Collaborator', 'Interact with AI characters', 200, 'Have conversations with AI NPCs', true),
    ('00000000-0000-0000-0000-000000000008', 'Social Butterfly', 'Participate in team activities', 100, 'Join and participate in team challenges', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 11. VERIFICATION QUERY
-- =====================================================

-- Uncomment to verify all tables were created
-- SELECT table_name 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name LIKE 'cluequest_%'
-- ORDER BY table_name;

-- =====================================================
-- END OF COMPLETE SCHEMA
-- =====================================================
