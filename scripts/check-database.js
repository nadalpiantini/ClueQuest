#!/usr/bin/env node

/**
 * Check Database Status
 * Verifies what tables and data exist in the database
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

async function checkDatabase() {
  console.log('🔍 Checking ClueQuest Database Status...\n');

  try {
    // Check organizations
    const { data: orgs, error: orgError } = await supabase
      .from('cluequest_organizations')
      .select('id, name, created_at')
      .limit(5);

    if (orgError) {
      console.error('❌ Organizations query failed:', orgError);
    } else {
      console.log(`📊 Organizations: ${orgs ? orgs.length : 0} found`);
      if (orgs && orgs.length > 0) {
        orgs.forEach(org => {
          console.log(`   - ${org.name} (${org.id})`);
        });
      }
    }

    // Check profiles
    const { data: profiles, error: profileError } = await supabase
      .from('cluequest_profiles')
      .select('user_id, display_name, created_at')
      .limit(5);

    if (profileError) {
      console.error('❌ Profiles query failed:', profileError);
    } else {
      console.log(`👥 Profiles: ${profiles ? profiles.length : 0} found`);
      if (profiles && profiles.length > 0) {
        profiles.forEach(profile => {
          console.log(`   - ${profile.display_name} (${profile.user_id})`);
        });
      }
    }

    // Check adventures
    const { data: adventures, error: adventureError } = await supabase
      .from('cluequest_adventures')
      .select('id, title, status, created_at')
      .limit(5);

    if (adventureError) {
      console.error('❌ Adventures query failed:', adventureError);
    } else {
      console.log(`🎭 Adventures: ${adventures ? adventures.length : 0} found`);
      if (adventures && adventures.length > 0) {
        adventures.forEach(adventure => {
          console.log(`   - ${adventure.title} (${adventure.status})`);
        });
      }
    }

    // Check scenes
    const { data: scenes, error: sceneError } = await supabase
      .from('cluequest_scenes')
      .select('id, title, adventure_id, order_index')
      .limit(5);

    if (sceneError) {
      console.error('❌ Scenes query failed:', sceneError);
    } else {
      console.log(`🎪 Scenes: ${scenes ? scenes.length : 0} found`);
      if (scenes && scenes.length > 0) {
        scenes.forEach(scene => {
          console.log(`   - ${scene.title} (Order: ${scene.order_index})`);
        });
      }
    }

    // Check QR codes
    const { data: qrCodes, error: qrError } = await supabase
      .from('cluequest_qr_codes')
      .select('id, token, display_text, scene_id')
      .limit(5);

    if (qrError) {
      console.error('❌ QR codes query failed:', qrError);
    } else {
      console.log(`📱 QR Codes: ${qrCodes ? qrCodes.length : 0} found`);
      if (qrCodes && qrCodes.length > 0) {
        qrCodes.forEach(qr => {
          console.log(`   - ${qr.token}: ${qr.display_text}`);
        });
      }
    }

    console.log('\n✅ Database check completed');

  } catch (error) {
    console.error('❌ Database check failed:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  checkDatabase();
}

module.exports = { checkDatabase };
