const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyQRTableStructure() {
  console.log('🔍 VERIFICANDO ESTRUCTURA REAL DE cluequest_qr_codes');
  console.log('==================================================');
  
  try {
    // Get actual table structure by trying different columns
    const possibleColumns = [
      'id', 'scene_id', 'session_id', 'token', 'display_text', 'hmac_signature',
      'secret_key', 'expires_at', 'max_scans', 'scan_count', 'unique_scan_count',
      'required_location', 'proximity_tolerance', 'altitude_tolerance',
      'rate_limit_per_user', 'cooldown_seconds', 'device_fingerprint_required',
      'ip_validation_enabled', 'active_from', 'active_until', 'created_at',
      'updated_at', 'is_active', 'status'
    ];
    
    console.log('\n📊 COLUMNAS EXISTENTES:');
    console.log('=======================');
    
    const existingColumns = [];
    const missingColumns = [];
    
    for (const column of possibleColumns) {
      try {
        const { data, error } = await supabase
          .from('cluequest_qr_codes')
          .select(column)
          .limit(1);
        
        if (error) {
          if (error.message.includes('does not exist')) {
            missingColumns.push(column);
            console.log(`❌ ${column}: No existe`);
          } else {
            console.log(`⚠️ ${column}: Error - ${error.message}`);
          }
        } else {
          existingColumns.push(column);
          console.log(`✅ ${column}: Existe`);
        }
      } catch (err) {
        missingColumns.push(column);
        console.log(`❌ ${column}: Error - ${err.message}`);
      }
    }
    
    console.log('\n📈 RESUMEN DE ESTRUCTURA:');
    console.log('=========================');
    console.log(`✅ Columnas existentes: ${existingColumns.length}`);
    console.log(`❌ Columnas faltantes: ${missingColumns.length}`);
    
    console.log('\n📋 COLUMNAS EXISTENTES:');
    existingColumns.forEach(col => console.log(`  - ${col}`));
    
    console.log('\n📋 COLUMNAS FALTANTES:');
    missingColumns.forEach(col => console.log(`  - ${col}`));
    
    // Check if this is the expected structure from migration 002
    const expectedColumns = [
      'id', 'scene_id', 'session_id', 'token', 'display_text', 'hmac_signature',
      'secret_key', 'expires_at', 'max_scans', 'scan_count', 'unique_scan_count',
      'required_location', 'proximity_tolerance', 'altitude_tolerance',
      'rate_limit_per_user', 'cooldown_seconds', 'device_fingerprint_required',
      'ip_validation_enabled', 'active_from', 'active_until', 'created_at', 'updated_at'
    ];
    
    const missingExpected = expectedColumns.filter(col => !existingColumns.includes(col));
    
    console.log('\n🎯 ANÁLISIS DE MIGRACIÓN 002:');
    console.log('==============================');
    
    if (missingExpected.length === 0) {
      console.log('✅ La tabla tiene la estructura completa de la migración 002');
    } else {
      console.log('⚠️ Faltan columnas de la migración 002:');
      missingExpected.forEach(col => console.log(`  - ${col}`));
      
      console.log('\n💡 RECOMENDACIÓN:');
      console.log('==================');
      console.log('1. La migración 002_adventure_system.sql no se ejecutó completamente');
      console.log('2. Ejecutar primero la migración 002 para crear la estructura completa');
      console.log('3. Luego ejecutar la migración 006 corregida');
    }
    
    // Check if we have a simplified structure
    const hasBasicStructure = existingColumns.includes('id') && 
                             existingColumns.includes('scene_id') && 
                             existingColumns.includes('created_at');
    
    if (hasBasicStructure && missingExpected.length > 0) {
      console.log('\n🔧 ESTRUCTURA SIMPLIFICADA DETECTADA:');
      console.log('=====================================');
      console.log('La tabla existe pero con estructura simplificada');
      console.log('Esto sugiere que se creó con una migración anterior o manual');
    }
    
    return {
      existingColumns,
      missingColumns,
      missingExpected,
      hasCompleteStructure: missingExpected.length === 0
    };
    
  } catch (error) {
    console.error('🚨 ERROR:', error.message);
    return null;
  }
}

verifyQRTableStructure().catch(console.error);
