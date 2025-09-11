#!/usr/bin/env node

/**
 * Check Scenes Table Structure
 * Verifies the actual structure of the cluequest_scenes table
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

async function checkScenesTable() {
  console.log('🔍 Checking ClueQuest Scenes Table Structure...\n');

  try {
    // Get a sample scene to see the structure
    const { data: scenes, error: sceneError } = await supabase
      .from('cluequest_scenes')
      .select('*')
      .limit(1);

    if (sceneError) {
      console.error('❌ Scenes query failed:', sceneError);
      process.exit(1);
    }

    if (scenes && scenes.length > 0) {
      console.log('📊 Scenes table structure:');
      const scene = scenes[0];
      Object.keys(scene).forEach(key => {
        console.log(`   - ${key}: ${typeof scene[key]} (${scene[key]})`);
      });
    } else {
      console.log('📊 No scenes found, but table exists');
    }

  } catch (error) {
    console.error('❌ Check failed:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  checkScenesTable();
}

module.exports = { checkScenesTable };
