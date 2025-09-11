-- Testing script for RLS policies verification
-- Run this in Supabase SQL Editor or psql

-- ═══════════════════════════════════════════════════════════════════════════════
-- 1. Verify RLS is enabled on all ClueQuest tables
-- ═══════════════════════════════════════════════════════════════════════════════

WITH cluequest_tables AS (
  SELECT relname::text AS table_name
  FROM pg_class c 
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' 
    AND relname LIKE 'cluequest_%' 
    AND relkind = 'r'
),
rls_status AS (
  SELECT 
    schemaname,
    tablename AS table_name,
    rowsecurity AS rls_enabled
  FROM pg_tables 
  WHERE schemaname = 'public' 
    AND tablename LIKE 'cluequest_%'
)
SELECT 
  t.table_name,
  COALESCE(r.rls_enabled, false) AS rls_enabled,
  CASE 
    WHEN COALESCE(r.rls_enabled, false) THEN '✅' 
    ELSE '❌ RLS DISABLED' 
  END AS status
FROM cluequest_tables t
LEFT JOIN rls_status r USING(table_name)
ORDER BY t.table_name;

-- ═══════════════════════════════════════════════════════════════════════════════
-- 2. Check read policies exist for all tables
-- ═══════════════════════════════════════════════════════════════════════════════

WITH cluequest_tables AS (
  SELECT relname::text AS table_name
  FROM pg_class c 
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' 
    AND relname LIKE 'cluequest_%' 
    AND relkind = 'r'
),
read_policies AS (
  SELECT polrelid::regclass::text AS table_name
  FROM pg_policy
  WHERE polcmd = 'r' 
    AND polrelid::regclass::text LIKE 'cluequest_%'
)
SELECT 
  t.table_name,
  CASE 
    WHEN p.table_name IS NOT NULL THEN '✅ Has read policy'
    ELSE '❌ MISSING READ POLICY'
  END AS read_policy_status
FROM cluequest_tables t
LEFT JOIN read_policies p USING(table_name)
ORDER BY t.table_name;

-- ═══════════════════════════════════════════════════════════════════════════════
-- 3. Check write policies for main content tables
-- ═══════════════════════════════════════════════════════════════════════════════

SELECT 
  polrelid::regclass AS table_name, 
  polname AS policy_name, 
  polcmd AS command_type,
  CASE polcmd 
    WHEN 'r' THEN 'READ'
    WHEN 'a' THEN 'INSERT' 
    WHEN 'w' THEN 'UPDATE'
    WHEN 'd' THEN 'DELETE'
    WHEN '*' THEN 'ALL'
    ELSE polcmd::text
  END AS command_description
FROM pg_policy
WHERE polrelid IN (
  'public.cluequest_adventures'::regclass,
  'public.cluequest_scenes'::regclass,
  'public.cluequest_challenges'::regclass,
  'public.cluequest_organization_members'::regclass
)
ORDER BY table_name, polcmd, polname;

-- ═══════════════════════════════════════════════════════════════════════════════
-- 4. Test Default Organization exists
-- ═══════════════════════════════════════════════════════════════════════════════

SELECT 
  id,
  name,
  status,
  created_at,
  CASE 
    WHEN id = 'f7b93ab0-b4c2-46bc-856f-6e22ac6671fb' THEN '✅ DEFAULT ORG'
    ELSE '📋 Other org'
  END AS org_type
FROM cluequest_organizations
ORDER BY 
  CASE WHEN id = 'f7b93ab0-b4c2-46bc-856f-6e22ac6671fb' THEN 0 ELSE 1 END,
  created_at DESC;

-- ═══════════════════════════════════════════════════════════════════════════════
-- 5. Check if ensure_membership_for_current_user function exists
-- ═══════════════════════════════════════════════════════════════════════════════

SELECT 
  proname AS function_name,
  prosecdef AS is_security_definer,
  proacl AS permissions,
  CASE 
    WHEN prosecdef THEN '✅ SECURITY DEFINER'
    ELSE '❌ NOT SECURITY DEFINER'
  END AS security_status
FROM pg_proc
WHERE proname = 'ensure_membership_for_current_user';

-- ═══════════════════════════════════════════════════════════════════════════════
-- 6. Test sample data for public adventures (no authentication required)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Insert a public demo adventure if it doesn't exist
INSERT INTO cluequest_adventures (
  id, organization_id, title, description, category, difficulty,
  estimated_duration, theme_name, settings, status, is_public, created_at
)
VALUES (
  'demo-public-qr-mystery-12345',
  'f7b93ab0-b4c2-46bc-856f-6e22ac6671fb',
  'Demo Pública: QR Mystery',
  'Escanea códigos y resuelve 3 pistas rápidas - demo gratuito',
  'demo', 'easy',
  15, 'neo-noir', '{"demo": true, "public_access": true}', 'active', true, NOW()
)
ON CONFLICT (id) DO UPDATE SET
  updated_at = NOW(),
  description = EXCLUDED.description;

-- Verify the public adventure was created/updated
SELECT 
  id,
  title,
  is_public,
  status,
  organization_id,
  '✅ Demo adventure ready' AS demo_status
FROM cluequest_adventures
WHERE id = 'demo-public-qr-mystery-12345';

-- ═══════════════════════════════════════════════════════════════════════════════
-- 7. Performance check: indexes on member lookup
-- ═══════════════════════════════════════════════════════════════════════════════

SELECT 
  indexname,
  tablename,
  indexdef,
  CASE 
    WHEN indexname LIKE '%user_id%' THEN '✅ User lookup optimized'
    WHEN indexname LIKE '%organization%' THEN '✅ Org lookup optimized'
    ELSE '📊 Other index'
  END AS optimization_status
FROM pg_indexes
WHERE tablename = 'cluequest_organization_members'
ORDER BY indexname;

-- ═══════════════════════════════════════════════════════════════════════════════
-- Final Summary
-- ═══════════════════════════════════════════════════════════════════════════════

SELECT '🎯 RLS POLICIES VERIFICATION COMPLETE' AS summary;
SELECT 'Run this script to verify your multi-tenant setup is secure and functional' AS instructions;