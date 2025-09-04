CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.cluequest_organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_active ON public.cluequest_organizations(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.cluequest_profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON public.cluequest_profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_adventures_organization ON public.cluequest_adventures(organization_id);
CREATE INDEX IF NOT EXISTS idx_adventures_creator ON public.cluequest_adventures(creator_id);
CREATE INDEX IF NOT EXISTS idx_adventures_status ON public.cluequest_adventures(status);
CREATE INDEX IF NOT EXISTS idx_adventures_category ON public.cluequest_adventures(category);
CREATE INDEX IF NOT EXISTS idx_scenes_adventure ON public.cluequest_scenes(adventure_id);
CREATE INDEX IF NOT EXISTS idx_scenes_order ON public.cluequest_scenes(adventure_id, order_index);
CREATE INDEX IF NOT EXISTS idx_sessions_adventure ON public.cluequest_sessions(adventure_id);
CREATE INDEX IF NOT EXISTS idx_players_session ON public.cluequest_players(session_id);
CREATE INDEX IF NOT EXISTS idx_players_profile ON public.cluequest_players(profile_id);
CREATE INDEX IF NOT EXISTS idx_teams_session ON public.cluequest_teams(session_id);
CREATE INDEX IF NOT EXISTS idx_ar_assets_scene ON public.cluequest_ar_assets(scene_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_scene ON public.cluequest_qr_codes(scene_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_session ON public.cluequest_leaderboard(session_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON public.cluequest_leaderboard(session_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_ai_stories_adventure ON public.cluequest_ai_stories(adventure_id);
CREATE INDEX IF NOT EXISTS idx_ai_characters_adventure ON public.cluequest_ai_characters(adventure_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_scene ON public.cluequest_ai_interactions(scene_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_character ON public.cluequest_ai_interactions(character_id);

ALTER TABLE public.cluequest_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_adventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_adventure_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_ar_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_ai_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_ai_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluequest_ai_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizations are viewable by everyone" ON public.cluequest_organizations FOR SELECT USING (true);
CREATE POLICY "Organizations are insertable by service role" ON public.cluequest_organizations FOR INSERT WITH CHECK (true);
CREATE POLICY "Organizations are updatable by service role" ON public.cluequest_organizations FOR UPDATE USING (true);

CREATE POLICY "Profiles are viewable by everyone" ON public.cluequest_profiles FOR SELECT USING (true);
CREATE POLICY "Profiles are insertable by service role" ON public.cluequest_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Profiles are updatable by service role" ON public.cluequest_profiles FOR UPDATE USING (true);

CREATE POLICY "Adventures are viewable by everyone" ON public.cluequest_adventures FOR SELECT USING (true);
CREATE POLICY "Adventures are insertable by service role" ON public.cluequest_adventures FOR INSERT WITH CHECK (true);
CREATE POLICY "Adventures are updatable by service role" ON public.cluequest_adventures FOR UPDATE USING (true);

CREATE POLICY "Adventure roles are viewable by everyone" ON public.cluequest_adventure_roles FOR SELECT USING (true);
CREATE POLICY "Adventure roles are insertable by service role" ON public.cluequest_adventure_roles FOR INSERT WITH CHECK (true);
CREATE POLICY "Adventure roles are updatable by service role" ON public.cluequest_adventure_roles FOR UPDATE USING (true);

CREATE POLICY "Scenes are viewable by everyone" ON public.cluequest_scenes FOR SELECT USING (true);
CREATE POLICY "Scenes are insertable by service role" ON public.cluequest_scenes FOR INSERT WITH CHECK (true);
CREATE POLICY "Scenes are updatable by service role" ON public.cluequest_scenes FOR UPDATE USING (true);

CREATE POLICY "Sessions are viewable by everyone" ON public.cluequest_sessions FOR SELECT USING (true);
CREATE POLICY "Sessions are insertable by service role" ON public.cluequest_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Sessions are updatable by service role" ON public.cluequest_sessions FOR UPDATE USING (true);

CREATE POLICY "Players are viewable by everyone" ON public.cluequest_players FOR SELECT USING (true);
CREATE POLICY "Players are insertable by service role" ON public.cluequest_players FOR INSERT WITH CHECK (true);
CREATE POLICY "Players are updatable by service role" ON public.cluequest_players FOR UPDATE USING (true);

CREATE POLICY "Teams are viewable by everyone" ON public.cluequest_teams FOR SELECT USING (true);
CREATE POLICY "Teams are insertable by service role" ON public.cluequest_teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Teams are updatable by service role" ON public.cluequest_teams FOR UPDATE USING (true);

CREATE POLICY "AR assets are viewable by everyone" ON public.cluequest_ar_assets FOR SELECT USING (true);
CREATE POLICY "AR assets are insertable by service role" ON public.cluequest_ar_assets FOR INSERT WITH CHECK (true);
CREATE POLICY "AR assets are updatable by service role" ON public.cluequest_ar_assets FOR UPDATE USING (true);

CREATE POLICY "QR codes are viewable by everyone" ON public.cluequest_qr_codes FOR SELECT USING (true);
CREATE POLICY "QR codes are insertable by service role" ON public.cluequest_qr_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "QR codes are updatable by service role" ON public.cluequest_qr_codes FOR UPDATE USING (true);

CREATE POLICY "Leaderboard is viewable by everyone" ON public.cluequest_leaderboard FOR SELECT USING (true);
CREATE POLICY "Leaderboard is insertable by service role" ON public.cluequest_leaderboard FOR INSERT WITH CHECK (true);
CREATE POLICY "Leaderboard is updatable by service role" ON public.cluequest_leaderboard FOR UPDATE USING (true);

CREATE POLICY "Achievements are viewable by everyone" ON public.cluequest_achievements FOR SELECT USING (true);
CREATE POLICY "Achievements are insertable by service role" ON public.cluequest_achievements FOR INSERT WITH CHECK (true);
CREATE POLICY "Achievements are updatable by service role" ON public.cluequest_achievements FOR UPDATE USING (true);

CREATE POLICY "AI stories are viewable by everyone" ON public.cluequest_ai_stories FOR SELECT USING (true);
CREATE POLICY "AI stories are insertable by service role" ON public.cluequest_ai_stories FOR INSERT WITH CHECK (true);
CREATE POLICY "AI stories are updatable by service role" ON public.cluequest_ai_stories FOR UPDATE USING (true);

CREATE POLICY "AI characters are viewable by everyone" ON public.cluequest_ai_characters FOR SELECT USING (true);
CREATE POLICY "AI characters are insertable by service role" ON public.cluequest_ai_characters FOR INSERT WITH CHECK (true);
CREATE POLICY "AI characters are updatable by service role" ON public.cluequest_ai_characters FOR UPDATE USING (true);

CREATE POLICY "AI interactions are viewable by everyone" ON public.cluequest_ai_interactions FOR SELECT USING (true);
CREATE POLICY "AI interactions are insertable by service role" ON public.cluequest_ai_interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "AI interactions are updatable by service role" ON public.cluequest_ai_interactions FOR UPDATE USING (true);
