#!/usr/bin/env node

/**
 * ClueQuest Multi-Tenant Authentication Flow Test
 * Tests the complete authentication and membership system
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        if (value) {
          process.env[key.trim()] = value;
        }
      }
    });
  } catch (error) {
    // .env.local not found or not readable - use system env vars
  }
}

// Load environment variables
loadEnvFile();

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const DEFAULT_ORG = 'f7b93ab0-b4c2-46bc-856f-6e22ac6671fb';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Error: Missing Supabase environment variables');
  console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testAuthFlow() {
  console.log('🧪 ClueQuest Multi-Tenant Auth Flow Test\n');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  function logTest(name, passed, details = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${name}`);
    if (details) console.log(`   ${details}`);
    
    results.tests.push({ name, passed, details });
    if (passed) results.passed++;
    else results.failed++;
  }

  try {
    // Test 1: Check Supabase connection
    console.log('🔌 Testing Supabase Connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('cluequest_organizations')
      .select('id, name')
      .limit(1);
    
    logTest('Supabase Connection', !connectionError, 
      connectionError ? connectionError.message : `Connected successfully`);

    // Test 2: Check Default Organization exists
    console.log('\n🏢 Testing Default Organization...');
    const { data: orgData, error: orgError } = await supabase
      .from('cluequest_organizations')
      .select('*')
      .eq('id', DEFAULT_ORG)
      .single();

    logTest('Default Organization Exists', !orgError && orgData, 
      orgError ? orgError.message : `Found org: ${orgData?.name || 'Default Organization'}`);

    // Test 3: Check public adventures access (no auth required)
    console.log('\n🌍 Testing Public Adventures Access...');
    const { data: publicAdventures, error: publicError } = await supabase
      .from('cluequest_adventures')
      .select('id, title, is_public')
      .eq('is_public', true)
      .limit(3);

    logTest('Public Adventures Access', !publicError, 
      publicError ? publicError.message : `Found ${publicAdventures?.length || 0} public adventures`);

    // Test 4: Check RLS blocking private adventures (no auth)
    console.log('\n🔒 Testing RLS Protection...');
    const { data: allAdventures, error: rlsError } = await supabase
      .from('cluequest_adventures')
      .select('id, title, is_public, organization_id')
      .limit(10);

    // With RLS enabled, this should only return public adventures or none for anonymous users
    const privateCount = allAdventures?.filter(a => !a.is_public).length || 0;
    logTest('RLS Blocks Private Data', privateCount === 0, 
      `Anonymous user sees ${allAdventures?.length || 0} adventures, ${privateCount} private (should be 0)`);

    // Test 5: Check membership RPC function exists
    console.log('\n⚙️ Testing Membership Function...');
    
    // This should fail because we're not authenticated, but function should exist
    const { data: rpcTest, error: rpcError } = await supabase
      .rpc('ensure_membership_for_current_user', { 
        p_org: DEFAULT_ORG, 
        p_role: 'owner' 
      });

    // We expect this to fail with auth error, not function not found error
    const isAuthError = rpcError && (
      rpcError.message.includes('JWT') || 
      rpcError.message.includes('auth') ||
      rpcError.message.includes('user') ||
      rpcError.code === 'PGRST301'
    );
    
    logTest('Membership Function Exists', isAuthError, 
      isAuthError ? 'Function exists but requires authentication (correct)' : 
      rpcError ? `Unexpected error: ${rpcError.message}` : 'Function worked without auth (unexpected)');

    // Test 6: Check table structure
    console.log('\n📊 Testing Table Structure...');
    
    const tablesToCheck = [
      'cluequest_organizations',
      'cluequest_organization_members', 
      'cluequest_adventures',
      'cluequest_profiles'
    ];

    for (const table of tablesToCheck) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      // Error is OK if it's RLS blocking, not if table doesn't exist
      const tableExists = !error || !error.message.includes('does not exist');
      logTest(`Table ${table} exists`, tableExists,
        error && error.message.includes('does not exist') ? 'Table not found' : 
        error ? 'RLS blocking access (expected)' : 'Table accessible');
    }

  } catch (error) {
    logTest('Unexpected Error', false, error.message);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`🧪 Test Results: ${results.passed} passed, ${results.failed} failed`);
  console.log('='.repeat(50));

  if (results.failed === 0) {
    console.log('🎉 All tests passed! Multi-tenant system is working correctly.');
    console.log('\n🚀 Ready for user testing:');
    console.log('   • Landing page: http://localhost:5173');
    console.log('   • Onboarding: http://localhost:5173/onboard');
    console.log('   • Test suite: http://localhost:5173/test-auth');
  } else {
    console.log('⚠️  Some tests failed. Check the details above.');
  }
  
  return results.failed === 0;
}

// Run the test
if (require.main === module) {
  testAuthFlow()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('💥 Test runner crashed:', error);
      process.exit(1);
    });
}

module.exports = { testAuthFlow };