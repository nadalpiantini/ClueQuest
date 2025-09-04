#!/usr/bin/env node

/**
 * SQL Migration Generator
 * This script generates the exact SQL commands needed to create tables in Supabase dashboard
 */

const fs = require('fs');
const path = require('path');

function generateSQLMigrations() {
  console.log('🚀 ClueQuest SQL Migration Generator\n');
  console.log('Copy and paste these SQL commands into your Supabase SQL Editor:\n');
  
  console.log('='.repeat(80));
  console.log('MIGRATION 1: INITIAL SCHEMA');
  console.log('='.repeat(80));
  
  console.log(`
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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
    id UUID PRIMARY KEY,
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
`);
  
  console.log('='.repeat(80));
  console.log('MIGRATION 2: ADVENTURE SYSTEM');
  console.log('='.repeat(80));
  
  console.log(`
-- Create adventures table
CREATE TABLE IF NOT EXISTS cluequest_adventures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'entertainment',
    difficulty TEXT DEFAULT 'intermediate',
    estimated_duration INTEGER DEFAULT 30,
    theme_name TEXT DEFAULT 'default',
    theme_config JSONB DEFAULT '{}',
    cover_image_url TEXT,
    background_music_url TEXT,
    settings JSONB DEFAULT '{}',
    security_config JSONB DEFAULT '{}',
    allows_teams BOOLEAN DEFAULT TRUE,
    max_team_size INTEGER DEFAULT 4,
    max_participants INTEGER DEFAULT 50,
    min_participants INTEGER DEFAULT 1,
    leaderboard_enabled BOOLEAN DEFAULT TRUE,
    live_tracking BOOLEAN DEFAULT TRUE,
    chat_enabled BOOLEAN DEFAULT FALSE,
    hints_enabled BOOLEAN DEFAULT TRUE,
    ai_personalization BOOLEAN DEFAULT FALSE,
    adaptive_difficulty BOOLEAN DEFAULT FALSE,
    ai_avatars_enabled BOOLEAN DEFAULT TRUE,
    ai_narrative_enabled BOOLEAN DEFAULT FALSE,
    offline_mode BOOLEAN DEFAULT TRUE,
    accessibility_features JSONB DEFAULT '[]',
    language_support TEXT[] DEFAULT ARRAY['en'],
    status TEXT DEFAULT 'draft',
    scheduled_start TIMESTAMPTZ,
    scheduled_end TIMESTAMPTZ,
    tags TEXT[] DEFAULT '{}',
    is_template BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    total_sessions INTEGER DEFAULT 0,
    total_participants INTEGER DEFAULT 0,
    average_completion_time INTEGER,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create scenes table
CREATE TABLE IF NOT EXISTS cluequest_scenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    interaction_type TEXT,
    completion_criteria TEXT,
    points_reward INTEGER DEFAULT 100,
    narrative_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
`);
  
  console.log('='.repeat(80));
  console.log('MIGRATION 3: AI STORY GENERATION');
  console.log('='.repeat(80));
  
  console.log(`
-- Create AI story generation tables
CREATE TABLE IF NOT EXISTS cluequest_ai_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    story_type TEXT NOT NULL,
    story_framework TEXT NOT NULL,
    narrative_data JSONB NOT NULL,
    generated_content JSONB NOT NULL,
    ai_model TEXT,
    generation_parameters JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create QR codes table
CREATE TABLE IF NOT EXISTS cluequest_qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    scene_id UUID REFERENCES cluequest_scenes(id) ON DELETE CASCADE,
    qr_data TEXT NOT NULL,
    location_data JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
`);
  
  console.log('='.repeat(80));
  console.log('VERIFICATION QUERIES');
  console.log('='.repeat(80));
  
  console.log(`
-- Check if tables were created successfully
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'cluequest_%'
ORDER BY table_name;

-- Check table structure
\\d cluequest_organizations
\\d cluequest_adventures
\\d cluequest_adventure_roles
\\d cluequest_scenes
`);
  
  console.log('\n' + '='.repeat(80));
  console.log('INSTRUCTIONS');
  console.log('='.repeat(80));
  
  console.log(`
1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/josxxqkdnvqodxvtjgov
2. Navigate to SQL Editor in the left sidebar
3. Copy and paste each migration section above
4. Execute them in order (Migration 1, then 2, then 3)
5. Run the verification queries to confirm tables were created
6. Return to your app and try creating an adventure again

💡 Note: Execute each migration section separately to avoid timeout issues.
`);
  
  console.log('\n' + '='.repeat(80));
  console.log('TROUBLESHOOTING');
  console.log('='.repeat(80));
  
  console.log(`
If you encounter errors:

1. Check the Supabase logs for detailed error messages
2. Ensure your service role key has CREATE TABLE permissions
3. Verify the database is not in read-only mode
4. Check if there are any existing tables with conflicting names

Common issues:
- Permission denied: Check service role key permissions
- Table already exists: Drop existing tables first if needed
- Syntax error: Copy the SQL exactly as shown
`);
}

// Generate the SQL migrations
generateSQLMigrations();
