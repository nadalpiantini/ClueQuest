#!/usr/bin/env node

/**
 * Verify El Bosque Encantado Adventure
 * Checks if the adventure was created successfully
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyEnchantedForest() {
  console.log('🔍 Verifying El Bosque Encantado Adventure...\n');

  try {
    // Check if the adventure exists
    const { data: adventure, error: adventureError } = await supabase
      .from('cluequest_adventures')
      .select('*')
      .eq('id', '550e8400-e29b-41d4-a716-446655440001')
      .single();

    if (adventureError) {
      console.error('❌ Adventure not found:', adventureError);
      process.exit(1);
    }

    console.log('✅ Adventure found:', {
      id: adventure.id,
      title: adventure.title,
      status: adventure.status,
      duration: adventure.estimated_duration + ' minutes'
    });

    // Check scenes
    const { data: scenes, error: scenesError } = await supabase
      .from('cluequest_scenes')
      .select('id, title, order_index, interaction_type')
      .eq('adventure_id', adventure.id)
      .order('order_index');

    if (scenesError) {
      console.error('❌ Scenes query failed:', scenesError);
    } else {
      console.log(`✅ ${scenes ? scenes.length : 0} scenes found:`);
      if (scenes && scenes.length > 0) {
        scenes.forEach(scene => {
          console.log(`   ${scene.order_index}. ${scene.title} (${scene.interaction_type})`);
        });
      }
    }

    // Check roles
    const { data: roles, error: rolesError } = await supabase
      .from('cluequest_adventure_roles')
      .select('id, name, description, point_multiplier')
      .eq('adventure_id', adventure.id);

    if (rolesError) {
      console.error('❌ Roles query failed:', rolesError);
    } else {
      console.log(`✅ ${roles ? roles.length : 0} roles found:`);
      if (roles && roles.length > 0) {
        roles.forEach(role => {
          console.log(`   - ${role.name} (${role.point_multiplier}x points): ${role.description}`);
        });
      }
    }

    // Check QR codes
    const { data: qrCodes, error: qrError } = await supabase
      .from('cluequest_qr_codes')
      .select('id, token, display_text, scene_id')
      .in('scene_id', scenes ? scenes.map(s => s.id) : []);

    if (qrError) {
      console.error('❌ QR codes query failed:', qrError);
    } else {
      console.log(`✅ ${qrCodes ? qrCodes.length : 0} QR codes found:`);
      if (qrCodes && qrCodes.length > 0) {
        qrCodes.forEach(qr => {
          console.log(`   - ${qr.token}: ${qr.display_text}`);
        });
      }
    }

    console.log('\n🎉 El Bosque Encantado Adventure verification completed!');

  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  verifyEnchantedForest();
}

module.exports = { verifyEnchantedForest };
