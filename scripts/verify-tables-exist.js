#!/usr/bin/env node

/**
 * Table Existence Verification Script
 * Run this after applying manual migrations to verify tables were created
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function verifyTablesExist() {
  console.log('🔍 ClueQuest Table Verification Script\n');
  
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
      console.log('❌ Database connection failed: Tables do not exist');
      console.log('💡 Please run the manual migrations from MANUAL_MIGRATION_GUIDE.md first');
      return;
    } else if (testError) {
      console.log('❌ Database connection failed:', testError.message);
      return;
    } else {
      console.log('✅ Database connection successful');
      console.log('✅ Tables exist - checking all required tables...\n');
    }
    
    // List of all required tables
    const requiredTables = [
      'cluequest_organizations',
      'cluequest_profiles',
      'cluequest_adventures',
      'cluequest_adventure_roles',
      'cluequest_scenes',
      'cluequest_sessions',
      'cluequest_players',
      'cluequest_teams',
      'cluequest_ar_assets',
      'cluequest_qr_codes',
      'cluequest_leaderboard',
      'cluequest_achievements',
      'cluequest_ai_stories',
      'cluequest_ai_characters',
      'cluequest_ai_interactions'
    ];
    
    console.log('📋 Checking required tables...\n');
    
    let allTablesExist = true;
    
    for (const tableName of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('count')
          .limit(1);
        
        if (error) {
          console.log(`   ❌ ${tableName}: ${error.message}`);
          allTablesExist = false;
        } else {
          console.log(`   ✅ ${tableName}: Table exists and accessible`);
        }
      } catch (err) {
        console.log(`   ❌ ${tableName}: ${err.message}`);
        allTablesExist = false;
      }
    }
    
    console.log('\n🔍 Verification Summary:');
    
    if (allTablesExist) {
      console.log('   ✅ All required tables exist and are accessible');
      console.log('   ✅ Database is ready for adventure creation');
      console.log('   ✅ The "Database connection failed" error should be resolved');
      
      console.log('\n💡 Next steps:');
      console.log('   1. Restart your development server');
      console.log('   2. Try creating an adventure again');
      console.log('   3. The organization creation should now work automatically');
      
    } else {
      console.log('   ❌ Some required tables are missing or inaccessible');
      console.log('   💡 Please check the manual migration guide and ensure all migrations were applied');
      
      console.log('\n🔧 Troubleshooting:');
      console.log('   1. Go to your Supabase dashboard → SQL Editor');
      console.log('   2. Run the migrations from MANUAL_MIGRATION_GUIDE.md');
      console.log('   3. Check for any error messages in the SQL output');
      console.log('   4. Verify you have admin access to the project');
    }
    
  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    console.log('\n💡 This might be a network or configuration issue.');
  }
}

// Run the verification
verifyTablesExist();
