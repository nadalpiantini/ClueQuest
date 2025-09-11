# ClueQuest Migration Deployment Guide

## Current Schema Status
✅ **Deployed**: 001_initial_schema.sql (basic tables: profiles, organizations, adventures, teams, qr_codes)  
❌ **Missing**: 002_adventure_system.sql, 003_ai_story_generation.sql, 004_knowledge_base.sql, 005_performance_indexes.sql

## Quick Deployment Steps

### 1. Access Supabase SQL Editor
Go to: https://supabase.com/dashboard/project/josxxqkdnvqodxvtjgov/sql/new

### 2. Deploy Missing Migrations (Execute in Order)

#### Step 2.1: Deploy Adventure System (REQUIRED)
```sql
-- Copy and paste the entire content of: supabase/migrations/002_adventure_system.sql
-- This creates: user_activities, adventure_participations, user_scores tables
-- Estimated execution time: 30 seconds
```

#### Step 2.2: Deploy AI Story Generation (REQUIRED for AI features)
```sql
-- Copy and paste the entire content of: supabase/migrations/003_ai_story_generation.sql  
-- This creates: ai_story_generations, ai_story_feedback tables
-- Estimated execution time: 15 seconds
```

#### Step 2.3: Deploy Knowledge Base (OPTIONAL - for enhanced content)
```sql
-- Copy and paste the entire content of: supabase/migrations/004_knowledge_base.sql
-- This creates: knowledge_base_documents, embeddings tables
-- Estimated execution time: 20 seconds
```

#### Step 2.4: Deploy Performance Indexes (CRITICAL for production)
```sql
-- Copy and paste the entire content of: supabase/migrations/005_performance_indexes.sql
-- This creates indexes for QR validation (<50ms), dashboard queries (<200ms)
-- Estimated execution time: 60 seconds (CONCURRENT indexes)
```

### 3. Verification Commands

After each migration, run this test in your terminal to verify:

```bash
# Test schema deployment
npm run test:performance

# Test specific functionality 
node scripts/test-auth.js
```

## Migration Files to Copy

### Required Files (Deploy in Order):
1. `supabase/migrations/002_adventure_system.sql` - **CRITICAL**
2. `supabase/migrations/003_ai_story_generation.sql` - **REQUIRED**  
3. `supabase/migrations/004_knowledge_base.sql` - **OPTIONAL**
4. `supabase/migrations/005_performance_indexes.sql` - **CRITICAL**

## Expected Results After Full Deployment

### Database Tables (should exist):
- ✅ cluequest_profiles  
- ✅ cluequest_organizations
- ✅ cluequest_adventures
- ✅ cluequest_teams
- ✅ cluequest_qr_codes
- 🆕 cluequest_user_activities
- 🆕 cluequest_adventure_participations  
- 🆕 cluequest_user_scores
- 🆕 cluequest_ai_story_generations
- 🆕 cluequest_ai_story_feedback
- 🆕 cluequest_knowledge_base_documents (optional)

### Performance Improvements:
- 🎯 QR code validation: <50ms (from 89ms)
- 🎯 Dashboard queries: <200ms  
- 🎯 Leaderboard queries: <300ms
- 🎯 Team formation: <150ms

## Troubleshooting

### If Migrations Fail:
1. Check for syntax errors in SQL Editor
2. Run migrations one section at a time (split by `;`)
3. Verify table dependencies are satisfied

### If Performance Tests Still Fail:
1. Verify all indexes were created: `SHOW INDEX FROM cluequest_qr_codes;`
2. Check that tables have data for realistic testing
3. Run `ANALYZE` on tables to update statistics

## Post-Deployment Validation

```bash
# Run full test suite
npm run test:performance
npm run test:auth  
npm run test:e2e

# Check specific performance
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const start = Date.now();
supabase.from('cluequest_qr_codes').select('*').eq('status', 'active').limit(10).then(() => {
  console.log('QR validation:', Date.now() - start + 'ms');
});
"
```

---

**⚠️ IMPORTANT**: Deploy migrations in the exact order listed above. Each migration builds on the previous ones.