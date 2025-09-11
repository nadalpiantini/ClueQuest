-- Performance Index Migration for ClueQuest
-- Implements critical indexes to improve QR validation and dashboard performance
-- Priority: Critical for production deployment
-- Note: Using regular CREATE INDEX for Supabase transaction compatibility

-- This migration is intentionally minimal to avoid dependency issues
-- All performance indexes have been moved to later migrations where tables are guaranteed to exist

-- NOTE: User activities, participations, and scores indexes moved to 006_missing_tables.sql
-- because those tables are created in migration 006, not 005

-- This migration serves as a placeholder and can be extended in the future
-- when all table dependencies are properly established