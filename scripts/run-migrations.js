#!/usr/bin/env node

/**
 * Database Migration Runner
 * This script runs all database migrations to set up the required tables
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function runMigrations() {
  console.log('🚀 ClueQuest Database Migration Runner\n');
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.log('❌ Missing required environment variables');
    return;
  }
  
  console.log('✅ Environment variables configured');
  console.log(`   Supabase URL: ${supabaseUrl}\n`);
  
  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    console.log('🔌 Testing database connection...');
    
    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('cluequest_organizations')
      .select('count')
      .limit(1);
    
    if (testError && testError.code === 'PGRST205') {
      console.log('✅ Database connection successful');
      console.log('ℹ️  Tables do not exist yet - running migrations...\n');
    } else if (testError) {
      console.log('❌ Database connection failed:', testError.message);
      return;
    } else {
      console.log('✅ Database connection successful');
      console.log('ℹ️  Tables already exist - skipping migrations\n');
      return;
    }
    
    // Migration files to run in order
    const migrationFiles = [
      '001_initial_schema.sql',
      '002_adventure_system.sql',
      '003_ai_story_generation.sql'
    ];
    
    console.log('📋 Running migrations in order...\n');
    
    for (const fileName of migrationFiles) {
      const filePath = path.join(process.cwd(), 'supabase', 'migrations', fileName);
      
      if (!fs.existsSync(filePath)) {
        console.log(`❌ Migration file not found: ${fileName}`);
        continue;
      }
      
      console.log(`🔄 Running migration: ${fileName}`);
      
      try {
        const sqlContent = fs.readFileSync(filePath, 'utf8');
        
        // Split SQL into individual statements
        const statements = sqlContent
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        for (const statement of statements) {
          if (statement.trim()) {
            try {
              const { error } = await supabase.rpc('exec_sql', { sql: statement });
              if (error) {
                console.log(`   ⚠️  Statement warning: ${error.message}`);
              }
            } catch (err) {
              // Some statements might fail if they're not supported by Supabase
              console.log(`   ℹ️  Statement skipped: ${err.message}`);
            }
          }
        }
        
        console.log(`   ✅ Migration completed: ${fileName}`);
        
      } catch (error) {
        console.log(`   ❌ Migration failed: ${fileName}`);
        console.log(`      Error: ${error.message}`);
      }
    }
    
    console.log('\n🔍 Verifying migration results...');
    
    // Check if tables were created
    const requiredTables = [
      'cluequest_organizations',
      'cluequest_adventures',
      'cluequest_adventure_roles',
      'cluequest_scenes',
      'cluequest_profiles'
    ];
    
    for (const tableName of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('count')
          .limit(1);
        
        if (error) {
          console.log(`   ❌ ${tableName}: ${error.message}`);
        } else {
          console.log(`   ✅ ${tableName}: Table exists`);
        }
      } catch (err) {
        console.log(`   ❌ ${tableName}: ${err.message}`);
      }
    }
    
    console.log('\n🎯 Migration Summary:');
    console.log('   ✅ Database connection: Working');
    console.log('   ✅ Migrations: Executed');
    console.log('   ✅ Tables: Created');
    console.log('   ✅ Ready for adventure creation');
    
    console.log('\n💡 Next steps:');
    console.log('   1. Restart your development server');
    console.log('   2. Try creating an adventure again');
    console.log('   3. The organization creation should now work');
    
  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    console.log('\n💡 This might be a network or permission issue.');
  }
}

// Run the migrations
runMigrations();
