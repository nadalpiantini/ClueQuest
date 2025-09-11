# 🚨 Manual Database Migration Guide - Fix "Database connection failed"

## **Problem Identified**

The error "Error creating adventure: Database connection failed" occurs because the required database tables don't exist yet. The automated migration scripts failed because they rely on functions that don't exist in your Supabase setup.

## **🔧 Solution: Manual Migration in Supabase Dashboard**

### **Step 1: Access Your Supabase Dashboard**

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in with your account
3. Select your ClueQuest project
4. Navigate to **SQL Editor** in the left sidebar

### **Step 2: Run Migration 1 - Initial Schema**

Copy and paste this SQL into the SQL Editor and click **Run**:

```sql
-- Migration 1: Initial Schema
-- Create organizations table
CREATE TABLE IF NOT EXISTS cluequest_organizations (
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

-- Create profiles table
CREATE TABLE IF NOT EXISTS cluequest_profiles (
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
    is_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create enum types
CREATE TYPE IF NOT EXISTS adventure_category AS ENUM (
    'mystery', 'puzzle', 'escape_room', 'treasure_hunt', 'detective', 'adventure', 'horror', 'fantasy', 'sci_fi', 'historical'
);

CREATE TYPE IF NOT EXISTS difficulty_level AS ENUM (
    'beginner', 'intermediate', 'advanced', 'expert'
);

CREATE TYPE IF NOT EXISTS adventure_status AS ENUM (
    'draft', 'published', 'active', 'paused', 'completed', 'archived'
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON cluequest_organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_active ON cluequest_organizations(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON cluequest_profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON cluequest_profiles(is_verified);
```

### **Step 3: Run Migration 2 - Adventure System**

After the first migration succeeds, run this SQL:

```sql
-- Migration 2: Adventure System
-- Create adventures table
CREATE TABLE IF NOT EXISTS cluequest_adventures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic properties
    title TEXT NOT NULL,
    description TEXT,
    category adventure_category NOT NULL,
    difficulty difficulty_level NOT NULL,
    estimated_duration INTEGER DEFAULT 30, -- minutes
    
    -- Theme and branding
    theme_name TEXT DEFAULT 'default',
    theme_config JSONB DEFAULT '{}', -- Colors, fonts, styling
    cover_image_url TEXT,
    background_music_url TEXT,
    
    -- Experience configuration
    settings JSONB DEFAULT '{}',
    security_config JSONB DEFAULT '{}',
    
    -- Multi-player features
    allows_teams BOOLEAN DEFAULT TRUE,
    max_team_size INTEGER DEFAULT 4,
    max_participants INTEGER DEFAULT 50,
    min_participants INTEGER DEFAULT 1,
    
    -- Real-time features
    leaderboard_enabled BOOLEAN DEFAULT TRUE,
    live_tracking BOOLEAN DEFAULT TRUE,
    chat_enabled BOOLEAN DEFAULT FALSE,
    hints_enabled BOOLEAN DEFAULT TRUE,
    
    -- AI features
    ai_personalization BOOLEAN DEFAULT FALSE,
    adaptive_difficulty BOOLEAN DEFAULT FALSE,
    ai_avatars_enabled BOOLEAN DEFAULT TRUE,
    ai_narrative_enabled BOOLEAN DEFAULT FALSE,
    
    -- Accessibility
    offline_mode BOOLEAN DEFAULT TRUE,
    accessibility_features JSONB DEFAULT '[]',
    language_support TEXT[] DEFAULT ARRAY['en'],
    
    -- Lifecycle
    status adventure_status DEFAULT 'draft',
    scheduled_start TIMESTAMPTZ,
    scheduled_end TIMESTAMPTZ,
    tags TEXT[] DEFAULT '{}',
    is_template BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    
    -- Metrics
    total_sessions INTEGER DEFAULT 0,
    total_participants INTEGER DEFAULT 0,
    average_completion_time INTEGER, -- minutes
    completion_rate DECIMAL(5,2) DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create adventure roles table
CREATE TABLE IF NOT EXISTS cluequest_adventure_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    perks JSONB DEFAULT '[]',
    point_multiplier DECIMAL(3,2) DEFAULT 1.0,
    max_players INTEGER DEFAULT 5,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create scenes table
CREATE TABLE IF NOT EXISTS cluequest_scenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    interaction_type TEXT NOT NULL, -- puzzle, qr_scan, ar_experience, etc.
    completion_criteria TEXT,
    points_reward INTEGER DEFAULT 0,
    narrative_data JSONB DEFAULT '{}',
    scene_config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS cluequest_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active', -- active, paused, completed, cancelled
    max_participants INTEGER DEFAULT 50,
    current_participants INTEGER DEFAULT 0,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create players table
CREATE TABLE IF NOT EXISTS cluequest_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES cluequest_sessions(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES cluequest_profiles(id) ON DELETE CASCADE,
    role_id UUID REFERENCES cluequest_adventure_roles(id),
    team_id UUID, -- Will reference teams table
    score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active', -- active, inactive, completed
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Create teams table
CREATE TABLE IF NOT EXISTS cluequest_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES cluequest_sessions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#FF0000',
    score INTEGER DEFAULT 0,
    max_players INTEGER DEFAULT 4,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create AR assets table
CREATE TABLE IF NOT EXISTS cluequest_ar_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id UUID NOT NULL REFERENCES cluequest_scenes(id) ON DELETE CASCADE,
    asset_type TEXT NOT NULL, -- 3d_model, image, video, audio
    asset_url TEXT NOT NULL,
    position JSONB DEFAULT '{"x": 0, "y": 0, "z": 0}',
    rotation JSONB DEFAULT '{"x": 0, "y": 0, "z": 0}',
    scale JSONB DEFAULT '{"x": 1, "y": 1, "z": 1}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create QR codes table
CREATE TABLE IF NOT EXISTS cluequest_qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id UUID NOT NULL REFERENCES cluequest_scenes(id) ON DELETE CASCADE,
    qr_data TEXT NOT NULL,
    location JSONB, -- GPS coordinates
    is_active BOOLEAN DEFAULT TRUE,
    scan_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS cluequest_leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES cluequest_sessions(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES cluequest_players(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    rank INTEGER,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS cluequest_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    points_reward INTEGER DEFAULT 0,
    criteria TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_adventures_organization ON cluequest_adventures(organization_id);
CREATE INDEX IF NOT EXISTS idx_adventures_creator ON cluequest_adventures(creator_id);
CREATE INDEX IF NOT EXISTS idx_adventures_status ON cluequest_adventures(status);
CREATE INDEX IF NOT EXISTS idx_adventures_category ON cluequest_adventures(category);
CREATE INDEX IF NOT EXISTS idx_scenes_adventure ON cluequest_scenes(adventure_id);
CREATE INDEX IF NOT EXISTS idx_scenes_order ON cluequest_scenes(adventure_id, order_index);
CREATE INDEX IF NOT EXISTS idx_sessions_adventure ON cluequest_sessions(adventure_id);
CREATE INDEX IF NOT EXISTS idx_players_session ON cluequest_players(session_id);
CREATE INDEX IF NOT EXISTS idx_players_profile ON cluequest_players(profile_id);
CREATE INDEX IF NOT EXISTS idx_teams_session ON cluequest_teams(session_id);
CREATE INDEX IF NOT EXISTS idx_ar_assets_scene ON cluequest_ar_assets(scene_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_scene ON cluequest_qr_codes(scene_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_session ON cluequest_leaderboard(session_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON cluequest_leaderboard(session_id, score DESC);
```

### **Step 4: Run Migration 3 - AI Story Generation**

Finally, run this SQL:

```sql
-- Migration 3: AI Story Generation
-- Create AI story generation table
CREATE TABLE IF NOT EXISTS cluequest_ai_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    generated_story TEXT NOT NULL,
    story_type TEXT NOT NULL, -- narrative, dialogue, description
    story_framework TEXT, -- hero_journey, mystery, etc.
    ai_model TEXT,
    generation_parameters JSONB DEFAULT '{}',
    quality_score DECIMAL(3,2),
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create AI character table
CREATE TABLE IF NOT EXISTS cluequest_ai_characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    personality_traits JSONB DEFAULT '[]',
    background_story TEXT,
    dialogue_style TEXT,
    ai_model TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create AI interaction table
CREATE TABLE IF NOT EXISTS cluequest_ai_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id UUID REFERENCES cluequest_scenes(id) ON DELETE CASCADE,
    character_id UUID REFERENCES cluequest_ai_characters(id) ON DELETE CASCADE,
    interaction_type TEXT NOT NULL, -- conversation, hint, challenge
    ai_response TEXT NOT NULL,
    context JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for AI tables
CREATE INDEX IF NOT EXISTS idx_ai_stories_adventure ON cluequest_ai_stories(adventure_id);
CREATE INDEX IF NOT EXISTS idx_ai_characters_adventure ON cluequest_ai_characters(adventure_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_scene ON cluequest_ai_interactions(scene_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_character ON cluequest_ai_interactions(character_id);
```

### **Step 5: Verify Tables Were Created**

After running all migrations, verify the tables exist by running this query:

```sql
-- Check if all required tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'cluequest_%'
ORDER BY table_name;
```

You should see all the tables listed.

### **Step 6: Test the Fix**

1. **Restart your development server**:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. **Try creating an adventure again**:
   - Go to `/builder` in your app
   - Fill out the form and click "Create Adventure"
   - The error should be resolved

## **🔍 Troubleshooting**

### **If you get permission errors:**

1. **Check your service role key**: Ensure you're using the `SUPABASE_SERVICE_ROLE_KEY` (not the anon key)
2. **Verify project access**: Make sure you have admin access to the Supabase project
3. **Check RLS policies**: The service role should bypass RLS automatically

### **If tables still don't exist:**

1. **Check the SQL Editor output**: Look for any error messages
2. **Verify schema**: Make sure you're running SQL in the correct project
3. **Check table names**: Ensure table names match exactly (case-sensitive)

### **If you get constraint errors:**

1. **Check foreign key references**: Some tables reference others, so run migrations in order
2. **Verify enum types**: Make sure the enum types are created before tables that use them

## **✅ Success Indicators**

After successful migration, you should see:
- ✅ All tables created without errors
- ✅ Adventure creation works without "Database connection failed"
- ✅ Organizations are automatically created when needed
- ✅ No more PGRST205 errors

## **🚀 Next Steps**

Once the database is set up:
1. **Test adventure creation** thoroughly
2. **Monitor Supabase logs** for any new errors
3. **Create test data** to verify all functionality works
4. **Deploy to production** when ready

The database connection error should now be completely resolved!
