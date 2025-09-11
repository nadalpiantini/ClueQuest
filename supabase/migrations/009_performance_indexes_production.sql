-- Performance Index Migration for ClueQuest Production
-- Implements critical indexes to improve QR validation and dashboard performance
-- Priority: Critical for production deployment

BEGIN;

-- Critical index for QR code validation performance
-- Target: Reduce validation time from 97ms to <50ms
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cluequest_qr_codes_validation 
ON cluequest_qr_codes(code_hash, adventure_id, status)
WHERE status = 'active';

-- Dashboard performance for user activities
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cluequest_user_activities_today
ON cluequest_user_activities(user_id, created_at DESC)
WHERE created_at >= CURRENT_DATE;

-- Adventure participations lookup
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cluequest_participations_active
ON cluequest_adventure_participations(user_id, adventure_id, status)
WHERE status IN ('active', 'in_progress');

-- Leaderboard queries with ranking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cluequest_scores_leaderboard
ON cluequest_user_scores(adventure_id, score DESC, completed_at DESC)
WHERE completed_at IS NOT NULL;

-- Team formation and joining
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cluequest_teams_lookup
ON cluequest_teams(adventure_id, status, member_count)
WHERE status = 'open' AND member_count < max_members;

-- User profile lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cluequest_user_profiles_lookup
ON cluequest_profiles(user_id, status, created_at DESC);

COMMIT;
