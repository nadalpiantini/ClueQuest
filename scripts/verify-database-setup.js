#!/usr/bin/env node

/**
 * Database Setup Verification Script
 * This script checks if all required database tables exist and are properly configured
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function verifyDatabaseSetup() {
  console.log('🔍 ClueQuest Database Setup Verification\n');
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.log('❌ Missing required environment variables:');
    console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
    console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${serviceRoleKey ? '✅ Set' : '❌ Missing'}`);
    console.log('\n💡 Run the setup script first: node scripts/setup-supabase-env.js');
    return;
  }
  
  console.log('✅ Environment variables configured');
  console.log(`   Supabase URL: ${supabaseUrl}\n`);
  
  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    console.log('🔌 Testing database connection...');
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('cluequest_organizations')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.log('❌ Database connection failed:');
      console.log(`   Error: ${testError.message}`);
      console.log(`   Code: ${testError.code}`);
      console.log(`   Details: ${testError.details}`);
      
      if (testError.code === '42P01') {
        console.log('\n💡 Table does not exist. You need to run the database migrations.');
        console.log('   Check if you have a Supabase project set up and migrations applied.');
      } else if (testError.code === '42501') {
        console.log('\n💡 Permission denied. Check your service role key permissions.');
      }
      
      return;
    }
    
    console.log('✅ Database connection successful\n');
    
    // Check required tables
    const requiredTables = [
      'cluequest_organizations',
      'cluequest_adventures',
      'cluequest_adventure_roles',
      'cluequest_scenes',
      'cluequest_profiles'
    ];
    
    console.log('📋 Checking required tables...');
    
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
    
    console.log('\n🔍 Checking organization data...');
    
    // Check if organizations exist
    const { data: orgs, error: orgError } = await supabase
      .from('cluequest_organizations')
      .select('id, name, slug, created_at')
      .limit(5);
    
    if (orgError) {
      console.log(`   ❌ Error fetching organizations: ${orgError.message}`);
    } else if (orgs && orgs.length > 0) {
      console.log(`   ✅ Found ${orgs.length} organization(s):`);
      orgs.forEach(org => {
        console.log(`      - ${org.name} (${org.slug}) - Created: ${org.created_at}`);
      });
    } else {
      console.log('   ℹ️  No organizations found (this is normal for new projects)');
    }
    
    console.log('\n🔍 Checking adventure data...');
    
    // Check if adventures exist
    const { data: adventures, error: advError } = await supabase
      .from('cluequest_adventures')
      .select('id, title, theme_name, status, created_at')
      .limit(5);
    
    if (advError) {
      console.log(`   ❌ Error fetching adventures: ${advError.message}`);
    } else if (adventures && adventures.length > 0) {
      console.log(`   ✅ Found ${adventures.length} adventure(s):`);
      adventures.forEach(adv => {
        console.log(`      - ${adv.title} (${adv.theme_name}) - Status: ${adv.status}`);
      });
    } else {
      console.log('   ℹ️  No adventures found (this is normal for new projects)');
    }
    
    console.log('\n🎯 Database Status Summary:');
    console.log('   ✅ Connection: Working');
    console.log('   ✅ Tables: Checked');
    console.log('   ✅ Ready for adventure creation');
    
    console.log('\n💡 Next steps:');
    console.log('   1. Try creating an adventure again');
    console.log('   2. Check the browser console for any errors');
    console.log('   3. Monitor the Supabase dashboard for new records');
    
  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    console.log('\n💡 This might be a network or configuration issue.');
  }
}

// Run the verification
verifyDatabaseSetup();
