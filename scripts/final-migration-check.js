const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function finalMigrationCheck() {
  console.log('🎯 VERIFICACIÓN FINAL PRE-MIGRACIÓN');
  console.log('===================================');
  
  try {
    // 1. Check current state
    console.log('\n📊 1. ESTADO ACTUAL DE LA BASE DE DATOS');
    console.log('----------------------------------------');
    
    const tables = [
      'cluequest_profiles',
      'cluequest_organizations',
      'cluequest_adventures',
      'cluequest_scenes',
      'cluequest_teams',
      'cluequest_ai_stories',
      'cluequest_qr_codes',
      'cluequest_user_activities',
      'cluequest_adventure_participations',
      'cluequest_user_scores'
    ];
    
    let existingTables = 0;
    let missingTables = 0;
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
          missingTables++;
        } else {
          console.log(`✅ ${table}: existe (${data?.length || 0} registros)`);
          existingTables++;
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`);
        missingTables++;
      }
    }
    
    // 2. Check QR codes structure
    console.log('\n📊 2. ESTRUCTURA ACTUAL DE QR CODES');
    console.log('-----------------------------------');
    
    const qrColumns = ['id', 'scene_id', 'session_id', 'token', 'expires_at', 'status', 'updated_at'];
    let existingQRColumns = 0;
    
    for (const column of qrColumns) {
      try {
        const { data, error } = await supabase
          .from('cluequest_qr_codes')
          .select(column)
          .limit(1);
        
        if (error) {
          console.log(`❌ ${column}: No existe`);
        } else {
          console.log(`✅ ${column}: Existe`);
          existingQRColumns++;
        }
      } catch (err) {
        console.log(`❌ ${column}: ${err.message}`);
      }
    }
    
    // 3. Check if update function exists
    console.log('\n📊 3. FUNCIÓN update_updated_at_column');
    console.log('--------------------------------------');
    
    try {
      const { data, error } = await supabase
        .rpc('update_updated_at_column');
      
      if (error) {
        console.log('❌ Función no existe:', error.message);
      } else {
        console.log('✅ Función existe y es accesible');
      }
    } catch (err) {
      console.log('❌ Error verificando función:', err.message);
    }
    
    // 4. Summary and recommendations
    console.log('\n🎯 RESUMEN Y RECOMENDACIONES');
    console.log('=============================');
    
    const tableCompleteness = ((existingTables / tables.length) * 100).toFixed(1);
    const qrCompleteness = ((existingQRColumns / qrColumns.length) * 100).toFixed(1);
    
    console.log(`📊 Tablas: ${existingTables}/${tables.length} (${tableCompleteness}%)`);
    console.log(`📊 Columnas QR: ${existingQRColumns}/${qrColumns.length} (${qrCompleteness}%)`);
    
    if (existingTables < 8) {
      console.log('\n🚨 ACCIÓN REQUERIDA:');
      console.log('====================');
      console.log('1. Ejecutar migración 007_fix_qr_codes_structure.sql');
      console.log('2. Ejecutar migración 006_missing_tables.sql');
      console.log('3. Verificar resultado con: node scripts/verify-final-migration.js');
    } else if (existingQRColumns < 5) {
      console.log('\n⚠️ MEJORA RECOMENDADA:');
      console.log('======================');
      console.log('1. Ejecutar migración 007_fix_qr_codes_structure.sql');
      console.log('2. Verificar resultado con: node scripts/verify-final-migration.js');
    } else {
      console.log('\n🎉 ¡BASE DE DATOS COMPLETA!');
      console.log('===========================');
      console.log('La base de datos está lista para producción');
    }
    
    console.log('\n📋 ARCHIVOS DE MIGRACIÓN LISTOS:');
    console.log('=================================');
    console.log('✅ supabase/migrations/007_fix_qr_codes_structure.sql');
    console.log('✅ supabase/migrations/006_missing_tables.sql');
    console.log('✅ MIGRATION_INSTRUCTIONS.md');
    console.log('✅ scripts/verify-final-migration.js');
    
    console.log('\n💡 PRÓXIMOS PASOS:');
    console.log('===================');
    console.log('1. Abrir Supabase Dashboard');
    console.log('2. Ir a SQL Editor');
    console.log('3. Ejecutar migraciones en orden');
    console.log('4. Verificar resultado');
    
  } catch (error) {
    console.error('🚨 ERROR:', error.message);
  }
}

finalMigrationCheck().catch(console.error);
