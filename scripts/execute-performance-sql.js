#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executePerformanceIndexes() {
  console.log('🚀 ClueQuest Performance Index Execution');
  console.log('========================================');
  
  const indexes = [
    {
      name: 'idx_cluequest_qr_codes_validation',
      sql: `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cluequest_qr_codes_validation 
            ON cluequest_qr_codes(code_hash, adventure_id, status)
            WHERE status = 'active';`,
      purpose: 'QR code validation performance (97ms → <50ms)',
      priority: 'CRITICAL'
    },
    {
      name: 'idx_cluequest_user_activities_today',
      sql: `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cluequest_user_activities_today
            ON cluequest_user_activities(user_id, created_at DESC)
            WHERE created_at >= CURRENT_DATE;`,
      purpose: 'Dashboard performance for today\'s activities',
      priority: 'CRITICAL'
    },
    {
      name: 'idx_cluequest_participations_active',
      sql: `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cluequest_participations_active
            ON cluequest_adventure_participations(user_id, adventure_id, status)
            WHERE status IN ('active', 'in_progress');`,
      purpose: 'Active adventure participations lookup',
      priority: 'HIGH'
    }
  ];

  let deployed = 0;
  let failed = 0;

  for (const index of indexes) {
    console.log(`\n🔄 Deploying ${index.priority}: ${index.name}`);
    console.log(`   Purpose: ${index.purpose}`);
    
    try {
      // First check if tables exist by trying to query them
      const { error: checkError } = await supabase
        .from('cluequest_qr_codes')
        .select('id')
        .limit(1);
      
      if (checkError) {
        console.log(`⚠️  Table doesn't exist yet: ${checkError.message}`);
        console.log('   This is normal if the database schema hasn\'t been initialized');
        failed++;
        continue;
      }

      // Execute the index creation
      const { error } = await supabase.rpc('exec_sql', { sql: index.sql });
      
      if (error) {
        console.log(`❌ Failed to create index: ${error.message}`);
        failed++;
      } else {
        console.log(`✅ Successfully deployed: ${index.name}`);
        deployed++;
      }
    } catch (err) {
      console.log(`❌ Error deploying ${index.name}: ${err.message}`);
      failed++;
    }
  }

  console.log('\n📈 Performance Index Execution Summary');
  console.log('=====================================');
  console.log(`✅ Successful deployments: ${deployed}`);
  console.log(`❌ Failed deployments: ${failed}`);
  
  if (deployed > 0) {
    console.log('\n🎉 Performance indexes deployed successfully!');
    console.log('🔄 Run performance tests to validate improvements:');
    console.log('   npm run test:performance');
  } else {
    console.log('\n⚠️  No indexes were deployed. This might indicate:');
    console.log('   • Database tables don\'t exist yet');
    console.log('   • exec_sql function is not available');
    console.log('   • Database connection issues');
    console.log('\n💡 Alternative: Copy SQL from migration file to Supabase SQL Editor');
  }
}

// Execute the deployment
executePerformanceIndexes().catch(console.error);