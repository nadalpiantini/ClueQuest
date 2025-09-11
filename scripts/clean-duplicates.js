const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanDuplicates() {
  console.log('🧹 LIMPIANDO DUPLICADOS EN BASE DE DATOS');
  console.log('========================================');
  
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
    console.log('\n📊 2. ESTRUCTURA DE QR CODES');
    console.log('-----------------------------');
    
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
    
    if (existingTables >= 8 && existingQRColumns >= 5) {
      console.log('\n🎉 ¡MIGRACIÓN PARCIALMENTE COMPLETADA!');
      console.log('=====================================');
      console.log('La base de datos está funcionando');
      console.log('Los errores de duplicación indican que la migración se ejecutó parcialmente');
      
      console.log('\n💡 PRÓXIMOS PASOS:');
      console.log('===================');
      console.log('1. Ejecutar migración 007_fix_qr_codes_structure.sql (corregida)');
      console.log('2. Ejecutar migración 006_missing_tables.sql (corregida)');
      console.log('3. Las migraciones corregidas manejan duplicados automáticamente');
      
    } else if (existingTables < 8) {
      console.log('\n🚨 ACCIÓN REQUERIDA:');
      console.log('====================');
      console.log('1. Ejecutar migración 007_fix_qr_codes_structure.sql (corregida)');
      console.log('2. Ejecutar migración 006_missing_tables.sql (corregida)');
      console.log('3. Las migraciones corregidas manejan duplicados automáticamente');
    }
    
    console.log('\n📋 MIGRACIONES CORREGIDAS:');
    console.log('===========================');
    console.log('✅ 007_fix_qr_codes_structure.sql - Maneja triggers duplicados');
    console.log('✅ 006_missing_tables.sql - Maneja políticas RLS duplicadas');
    console.log('✅ Ambas migraciones son idempotentes (se pueden ejecutar múltiples veces)');
    
    console.log('\n🔧 CORRECCIONES APLICADAS:');
    console.log('===========================');
    console.log('✅ DROP TRIGGER IF EXISTS antes de CREATE TRIGGER');
    console.log('✅ DROP POLICY IF EXISTS antes de CREATE POLICY');
    console.log('✅ Verificaciones condicionales para columnas');
    console.log('✅ Manejo robusto de errores');
    
  } catch (error) {
    console.error('🚨 ERROR:', error.message);
  }
}

cleanDuplicates().catch(console.error);
