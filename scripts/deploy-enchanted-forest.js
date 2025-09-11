#!/usr/bin/env node

/**
 * Deploy El Bosque Encantado Adventure
 * Executes the specific migration for the Enchanted Forest adventure
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deployEnchantedForest() {
  console.log('🎭 Deploying El Bosque Encantado Adventure...\n');

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '008_enchanted_forest_adventure.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath);
      process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log('📄 Migration file loaded successfully');

    // Execute the migration by splitting into individual statements
    console.log('🚀 Executing migration...');
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('COMMENT'));

    console.log(`📝 Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
          if (error) {
            console.warn(`⚠️  Statement ${i + 1} warning:`, error.message);
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.warn(`⚠️  Statement ${i + 1} error:`, err.message);
        }
      }
    }

    console.log('✅ Migration execution completed');

    // Verify the adventure was created
    console.log('🔍 Verifying adventure creation...');
    const { data: adventure, error: adventureError } = await supabase
      .from('cluequest_adventures')
      .select('id, title, status, estimated_duration')
      .eq('id', '550e8400-e29b-41d4-a716-446655440001')
      .single();

    if (adventureError) {
      console.error('❌ Adventure verification failed:', adventureError);
      process.exit(1);
    }

    console.log('✅ Adventure verified:', {
      id: adventure.id,
      title: adventure.title,
      status: adventure.status,
      duration: adventure.estimated_duration + ' minutes'
    });

    // Verify scenes were created
    const { data: scenes, error: scenesError } = await supabase
      .from('cluequest_scenes')
      .select('id, title, order_index, interaction_type')
      .eq('adventure_id', '550e8400-e29b-41d4-a716-446655440001')
      .order('order_index');

    if (scenesError) {
      console.error('❌ Scenes verification failed:', scenesError);
      process.exit(1);
    }

    console.log(`✅ ${scenes.length} scenes created:`);
    scenes.forEach(scene => {
      console.log(`   ${scene.order_index}. ${scene.title} (${scene.interaction_type})`);
    });

    // Verify QR codes were created
    const { data: qrCodes, error: qrError } = await supabase
      .from('cluequest_qr_codes')
      .select('id, token, display_text')
      .in('scene_id', scenes.map(s => s.id));

    if (qrError) {
      console.error('❌ QR codes verification failed:', qrError);
      process.exit(1);
    }

    console.log(`✅ ${qrCodes.length} QR codes created:`);
    qrCodes.forEach(qr => {
      console.log(`   ${qr.token}: ${qr.display_text}`);
    });

    // Verify roles were created
    const { data: roles, error: rolesError } = await supabase
      .from('cluequest_adventure_roles')
      .select('id, name, description, point_multiplier')
      .eq('adventure_id', '550e8400-e29b-41d4-a716-446655440001');

    if (rolesError) {
      console.error('❌ Roles verification failed:', rolesError);
      process.exit(1);
    }

    console.log(`✅ ${roles.length} roles created:`);
    roles.forEach(role => {
      console.log(`   ${role.name} (${role.point_multiplier}x points): ${role.description}`);
    });

    console.log('\n🎉 El Bosque Encantado Adventure deployed successfully!');
    console.log('🎭 Adventure ID: 550e8400-e29b-41d4-a716-446655440001');
    console.log('🎪 Ready for players to experience the magical forest!');

  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  deployEnchantedForest();
}

module.exports = { deployEnchantedForest };
