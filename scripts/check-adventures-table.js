#!/usr/bin/env node

/**
 * Check Adventures Table Structure
 * Verifies the actual structure of the cluequest_adventures table
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

async function checkAdventuresTable() {
  console.log('🔍 Checking ClueQuest Adventures Table Structure...\n');

  try {
    // Get a sample adventure to see the structure
    const { data: adventures, error: adventureError } = await supabase
      .from('cluequest_adventures')
      .select('*')
      .limit(1);

    if (adventureError) {
      console.error('❌ Adventures query failed:', adventureError);
      process.exit(1);
    }

    if (adventures && adventures.length > 0) {
      console.log('📊 Adventures table structure:');
      const adventure = adventures[0];
      Object.keys(adventure).forEach(key => {
        console.log(`   - ${key}: ${typeof adventure[key]} (${adventure[key]})`);
      });
    } else {
      console.log('📊 No adventures found, but table exists');
    }

    // Try to get table schema information
    const { data: schemaInfo, error: schemaError } = await supabase
      .rpc('get_table_columns', { table_name: 'cluequest_adventures' });

    if (schemaError) {
      console.log('⚠️  Could not get schema info:', schemaError.message);
    } else {
      console.log('📋 Table columns:', schemaInfo);
    }

  } catch (error) {
    console.error('❌ Check failed:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  checkAdventuresTable();
}

module.exports = { checkAdventuresTable };
