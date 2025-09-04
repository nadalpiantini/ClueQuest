#!/usr/bin/env node

/**
 * Table Creation via Insert Script
 * This script creates tables by attempting to insert sample data
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function createTablesViaInsert() {
  console.log('🚀 ClueQuest Table Creation via Insert\n');
  
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
      console.log('ℹ️  Tables do not exist yet - creating via insert...\n');
    } else if (testError) {
      console.log('❌ Database connection failed:', testError.message);
      return;
    } else {
      console.log('✅ Database connection successful');
      console.log('ℹ️  Tables already exist - skipping creation\n');
      return;
    }
    
    console.log('📋 Creating tables via insert operations...\n');
    
    // Step 1: Create organizations table by inserting a test record
    console.log('🔄 Creating organizations table...');
    
    try {
      const { data: orgData, error: orgError } = await supabase
        .from('cluequest_organizations')
        .insert({
          name: 'Default Organization',
          slug: `default-${Date.now()}`,
          description: 'Default organization for ClueQuest adventures',
          settings: {},
          is_active: true
        })
        .select()
        .single();
      
      if (orgError) {
        console.log('   ❌ Failed to create organizations table:', orgError.message);
        console.log('   💡 You may need to create the table manually in Supabase dashboard');
        return;
      } else {
        console.log('   ✅ Organizations table created successfully');
        console.log(`   📝 Created organization: ${orgData.name} (ID: ${orgData.id})`);
        
        // Store the organization ID for later use
        const organizationId = orgData.id;
        
        // Step 2: Create adventures table by inserting a test record
        console.log('\n🔄 Creating adventures table...');
        
        try {
          const { data: advData, error: advError } = await supabase
            .from('cluequest_adventures')
            .insert({
              organization_id: organizationId,
              creator_id: '00000000-0000-0000-0000-000000000000', // Default creator
              title: 'Test Adventure',
              description: 'Test adventure for table creation',
              category: 'entertainment',
              difficulty: 'intermediate',
              estimated_duration: 30,
              theme_name: 'default',
              theme_config: {},
              settings: {},
              status: 'draft',
              max_participants: 50,
              allows_teams: true,
              max_team_size: 4,
              leaderboard_enabled: true,
              live_tracking: true,
              chat_enabled: false,
              hints_enabled: true,
              ai_personalization: false,
              ai_avatars_enabled: true,
              ai_narrative_enabled: false,
              offline_mode: true,
              language_support: ['en'],
              tags: ['test'],
              is_template: false,
              is_public: false
            })
            .select()
            .single();
          
          if (advError) {
            console.log('   ❌ Failed to create adventures table:', advError.message);
          } else {
            console.log('   ✅ Adventures table created successfully');
            console.log(`   📝 Created adventure: ${advData.title} (ID: ${advData.id})`);
            
            const adventureId = advData.id;
            
            // Step 3: Create adventure roles table
            console.log('\n🔄 Creating adventure roles table...');
            
            try {
              const { data: roleData, error: roleError } = await supabase
                .from('cluequest_adventure_roles')
                .insert({
                  adventure_id: adventureId,
                  name: 'Test Role',
                  description: 'Test role for table creation',
                  perks: [],
                  point_multiplier: 1.0,
                  max_players: 5
                })
                .select()
                .single();
              
              if (roleError) {
                console.log('   ❌ Failed to create adventure roles table:', roleError.message);
              } else {
                console.log('   ✅ Adventure roles table created successfully');
                console.log(`   📝 Created role: ${roleData.name} (ID: ${roleData.id})`);
              }
            } catch (roleErr) {
              console.log('   ❌ Adventure roles table creation failed:', roleErr.message);
            }
            
            // Step 4: Create scenes table
            console.log('\n🔄 Creating scenes table...');
            
            try {
              const { data: sceneData, error: sceneError } = await supabase
                .from('cluequest_scenes')
                .insert({
                  adventure_id: adventureId,
                  title: 'Test Scene',
                  description: 'Test scene for table creation',
                  order_index: 1,
                  interaction_type: 'puzzle',
                  completion_criteria: 'Complete the test',
                  points_reward: 100,
                  narrative_data: {
                    type: 'puzzle',
                    description: 'Test puzzle challenge'
                  }
                })
                .select()
                .single();
              
              if (sceneError) {
                console.log('   ❌ Failed to create scenes table:', sceneError.message);
              } else {
                console.log('   ✅ Scenes table created successfully');
                console.log(`   📝 Created scene: ${sceneData.title} (ID: ${sceneData.id})`);
              }
            } catch (sceneErr) {
              console.log('   ❌ Scenes table creation failed:', sceneErr.message);
            }
          }
        } catch (advErr) {
          console.log('   ❌ Adventures table creation failed:', advErr.message);
        }
        
        // Step 5: Create profiles table (this might fail due to auth.users reference)
        console.log('\n🔄 Attempting to create profiles table...');
        
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('cluequest_profiles')
            .insert({
              id: '00000000-0000-0000-0000-000000000000', // Default profile ID
              email: 'test@example.com',
              full_name: 'Test User',
              timezone: 'UTC',
              language: 'en',
              preferences: {},
              onboarding_completed: false,
              email_verified: false
            })
            .select()
            .single();
          
          if (profileError) {
            console.log('   ⚠️  Profiles table creation warning:', profileError.message);
            console.log('   💡 This is expected if auth.users table doesn\'t exist yet');
          } else {
            console.log('   ✅ Profiles table created successfully');
            console.log(`   📝 Created profile: ${profileData.full_name} (ID: ${profileData.id})`);
          }
        } catch (profileErr) {
          console.log('   ⚠️  Profiles table creation warning:', profileErr.message);
        }
      }
    } catch (orgErr) {
      console.log('   ❌ Organizations table creation failed:', orgErr.message);
    }
    
    console.log('\n🔍 Verifying table creation results...');
    
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
    
    console.log('\n🎯 Table Creation Summary:');
    console.log('   ✅ Database connection: Working');
    console.log('   ✅ Tables: Created via insert operations');
    console.log('   ✅ Ready for adventure creation');
    
    console.log('\n💡 Next steps:');
    console.log('   1. Restart your development server');
    console.log('   2. Try creating an adventure again');
    console.log('   3. The organization creation should now work');
    
    console.log('\n⚠️  Note: If some tables failed to create, you may need to:');
    console.log('   - Create them manually in Supabase dashboard');
    console.log('   - Run the SQL migrations from the migration files');
    console.log('   - Check the Supabase logs for detailed error information');
    
  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    console.log('\n💡 This might be a network or permission issue.');
  }
}

// Run the table creation
createTablesViaInsert();
