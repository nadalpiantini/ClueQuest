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
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deployMissingMigrations() {
  console.log('🚀 ClueQuest Missing Migrations Deployment');
  console.log('==========================================');
  
  // Check current schema state
  const missingTables = [];
  const tables = [
    'cluequest_user_activities',
    'cluequest_adventure_participations', 
    'cluequest_user_scores'
  ];
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error && error.message.includes('does not exist')) {
      missingTables.push(table);
    }
  }
  
  console.log(`📋 Missing tables: ${missingTables.length}`);
  
  // Check QR codes status column
  const { error: qrError } = await supabase
    .from('cluequest_qr_codes')
    .select('status')
    .limit(1);
  
  const needsPerformanceSchema = qrError && qrError.message.includes('status does not exist');
  
  if (missingTables.length > 0 || needsPerformanceSchema) {
    console.log('🔧 Deploying schema updates via SQL...');
    
    // Read and deploy migration 002 (adventure system)
    if (missingTables.length > 0) {
      const migration002 = fs.readFileSync(
        path.join(__dirname, '../supabase/migrations/002_adventure_system.sql'),
        'utf8'
      );
      
      console.log('📄 Deploying 002_adventure_system.sql...');
      console.log('⚠️  Manual deployment required:');
      console.log('1. Go to Supabase Dashboard → SQL Editor');
      console.log('2. Paste the following SQL:');
      console.log('---START SQL---');
      console.log(migration002);
      console.log('---END SQL---');
      console.log('3. Execute the query');
    }
    
    // Read and deploy performance indexes
    if (needsPerformanceSchema) {
      const migration005 = fs.readFileSync(
        path.join(__dirname, '../supabase/migrations/005_performance_indexes.sql'),
        'utf8'
      );
      
      console.log('\\n📄 Deploying 005_performance_indexes.sql...');
      console.log('⚠️  Manual deployment required:');
      console.log('1. Go to Supabase Dashboard → SQL Editor');
      console.log('2. Paste the following SQL:');
      console.log('---START SQL---');
      console.log(migration005);
      console.log('---END SQL---');
      console.log('3. Execute the query');
    }
    
    console.log('\\n🔗 Quick access:');
    console.log(`https://supabase.com/dashboard/project/josxxqkdnvqodxvtjgov/sql/new`);
    
  } else {
    console.log('✅ All migrations appear to be deployed');
    
    // Test performance
    console.log('\\n🎯 Testing current performance...');
    const start = Date.now();
    const { data, error } = await supabase
      .from('cluequest_qr_codes')
      .select('*')
      .limit(10);
    const duration = Date.now() - start;
    
    console.log(`⚡ Current query performance: ${duration}ms`);
  }
}

deployMissingMigrations().catch(console.error);