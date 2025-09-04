import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

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

async function verifySchema() {
  console.log('🔍 Verifying ClueQuest Database Schema\n');
  console.log(`📡 Connecting to: ${supabaseUrl}\n`);

  let allTablesExist = true;

  for (const tableName of requiredTables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('count')
        .limit(1);

      if (error) {
        console.log(`❌ ${tableName}: ${error.message}`);
        allTablesExist = false;
      } else {
        console.log(`✅ ${tableName}: Table exists and accessible`);
      }
    } catch (err) {
      console.log(`❌ ${tableName}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      allTablesExist = false;
    }
  }

  console.log('\n📊 Verification Summary:');
  
  if (allTablesExist) {
    console.log('✅ All required tables exist and are accessible');
    console.log('✅ Database schema is complete');
    console.log('✅ Ready for adventure creation');
    console.log('\n💡 Next steps:');
    console.log('   1. Restart your development server');
    console.log('   2. Try creating an adventure again');
    console.log('   3. The "Database connection failed" error should be resolved');
  } else {
    console.log('❌ Some required tables are missing or inaccessible');
    console.log('💡 Please run the SQL migrations in your Supabase dashboard');
    console.log('\n🔧 Required actions:');
    console.log('   1. Go to Supabase Dashboard → SQL Editor');
    console.log('   2. Run 001_schema.sql');
    console.log('   3. Run 002_indexes_policies.sql');
    console.log('   4. Run 003_seed.sql');
    console.log('   5. Run this verification script again');
  }
}

verifySchema().catch(console.error);
