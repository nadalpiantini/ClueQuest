const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyFinalMigration() {
  console.log('🎯 VERIFICACIÓN FINAL POST-MIGRACIÓN');
  console.log('====================================');
  
  try {
    // 1. Verify all main tables exist
    console.log('\n📊 1. VERIFICANDO TABLAS PRINCIPALES');
    console.log('------------------------------------');
    
    const mainTables = [
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
    
    for (const table of mainTables) {
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
    
    // 2. Verify QR codes table structure
    console.log('\n📊 2. VERIFICANDO ESTRUCTURA DE QR CODES');
    console.log('----------------------------------------');
    
    const qrColumns = [
      'id', 'scene_id', 'session_id', 'token', 'display_text', 'hmac_signature',
      'secret_key', 'expires_at', 'max_scans', 'scan_count', 'unique_scan_count',
      'required_location', 'proximity_tolerance', 'altitude_tolerance',
      'rate_limit_per_user', 'cooldown_seconds', 'device_fingerprint_required',
      'ip_validation_enabled', 'active_from', 'active_until', 'created_at',
      'updated_at', 'is_active', 'status'
    ];
    
    let existingQRColumns = 0;
    let missingQRColumns = 0;
    
    for (const column of qrColumns) {
      try {
        const { data, error } = await supabase
          .from('cluequest_qr_codes')
          .select(column)
          .limit(1);
        
        if (error) {
          if (error.message.includes('does not exist')) {
            console.log(`❌ ${column}: No existe`);
            missingQRColumns++;
          } else {
            console.log(`⚠️ ${column}: Error - ${error.message}`);
          }
        } else {
          console.log(`✅ ${column}: Existe`);
          existingQRColumns++;
        }
      } catch (err) {
        console.log(`❌ ${column}: ${err.message}`);
        missingQRColumns++;
      }
    }
    
    // 3. Test performance
    console.log('\n📊 3. TESTING PERFORMANCE');
    console.log('-------------------------');
    
    // Test QR validation performance
    const start = Date.now();
    const { data: qrData, error: qrError } = await supabase
      .from('cluequest_qr_codes')
      .select('*')
      .limit(10);
    const qrDuration = Date.now() - start;
    
    if (qrError) {
      console.log('❌ QR validation test failed:', qrError.message);
    } else {
      console.log(`⚡ QR validation: ${qrDuration}ms (target: <50ms)`);
      if (qrDuration < 50) {
        console.log('✅ Performance target achieved!');
      } else {
        console.log('⚠️ Performance optimization needed');
      }
    }
    
    // Test adventure query performance
    const advStart = Date.now();
    const { data: advData, error: advError } = await supabase
      .from('cluequest_adventures')
      .select('*')
      .limit(5);
    const advDuration = Date.now() - advStart;
    
    if (advError) {
      console.log('❌ Adventure query test failed:', advError.message);
    } else {
      console.log(`⚡ Adventure query: ${advDuration}ms (target: <200ms)`);
      if (advDuration < 200) {
        console.log('✅ Adventure performance target achieved!');
      } else {
        console.log('⚠️ Adventure performance optimization needed');
      }
    }
    
    // 4. Final summary
    console.log('\n🎯 RESUMEN FINAL');
    console.log('================');
    
    const tableCompleteness = ((existingTables / (existingTables + missingTables)) * 100).toFixed(1);
    const qrCompleteness = ((existingQRColumns / (existingQRColumns + missingQRColumns)) * 100).toFixed(1);
    
    console.log(`📊 Tablas principales: ${existingTables}/${mainTables.length} (${tableCompleteness}%)`);
    console.log(`📊 Columnas QR codes: ${existingQRColumns}/${qrColumns.length} (${qrCompleteness}%)`);
    console.log(`⚡ Performance QR: ${qrDuration}ms`);
    console.log(`⚡ Performance Adventure: ${advDuration}ms`);
    
    // Overall status
    const overallStatus = {
      database: existingTables >= 8 ? 'FUNCIONAL' : 'INCOMPLETO',
      qrStructure: existingQRColumns >= 20 ? 'COMPLETA' : 'PARCIAL',
      performance: qrDuration < 200 && advDuration < 200 ? 'ACEPTABLE' : 'LENTO',
      readiness: existingTables >= 8 && existingQRColumns >= 20 ? 'LISTO' : 'PENDIENTE'
    };
    
    console.log('\n🎯 ESTADO GENERAL:');
    console.log('==================');
    Object.entries(overallStatus).forEach(([category, status]) => {
      const emoji = status === 'FUNCIONAL' || status === 'COMPLETA' || status === 'ACEPTABLE' || status === 'LISTO' ? '✅' : '⚠️';
      console.log(`${emoji} ${category.toUpperCase()}: ${status}`);
    });
    
    if (overallStatus.readiness === 'LISTO') {
      console.log('\n🎉 ¡MIGRACIÓN COMPLETADA CON ÉXITO!');
      console.log('====================================');
      console.log('La base de datos está lista para producción');
    } else {
      console.log('\n⚠️ MIGRACIÓN PENDIENTE');
      console.log('======================');
      console.log('Ejecutar las migraciones faltantes:');
      if (existingTables < 8) {
        console.log('- Ejecutar migración 006_missing_tables.sql');
      }
      if (existingQRColumns < 20) {
        console.log('- Ejecutar migración 007_fix_qr_codes_structure.sql');
      }
    }
    
  } catch (error) {
    console.error('🚨 ERROR CRÍTICO:', error.message);
  }
}

verifyFinalMigration().catch(console.error);
