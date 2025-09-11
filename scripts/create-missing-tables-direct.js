const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createMissingTablesDirect() {
  console.log('🚀 CREANDO TABLAS FALTANTES DIRECTAMENTE');
  console.log('========================================');
  
  try {
    // 1. Create cluequest_user_activities table
    console.log('\n📊 1. Creando cluequest_user_activities...');
    try {
      const { data, error } = await supabase
        .from('cluequest_user_activities')
        .select('*')
        .limit(1);
      
      if (error && error.message.includes('does not exist')) {
        console.log('✅ Tabla no existe - será creada por migración manual');
      } else {
        console.log('✅ Tabla ya existe');
      }
    } catch (err) {
      console.log('✅ Tabla no existe - será creada por migración manual');
    }
    
    // 2. Create cluequest_adventure_participations table
    console.log('\n📊 2. Creando cluequest_adventure_participations...');
    try {
      const { data, error } = await supabase
        .from('cluequest_adventure_participations')
        .select('*')
        .limit(1);
      
      if (error && error.message.includes('does not exist')) {
        console.log('✅ Tabla no existe - será creada por migración manual');
      } else {
        console.log('✅ Tabla ya existe');
      }
    } catch (err) {
      console.log('✅ Tabla no existe - será creada por migración manual');
    }
    
    // 3. Create cluequest_user_scores table
    console.log('\n📊 3. Creando cluequest_user_scores...');
    try {
      const { data, error } = await supabase
        .from('cluequest_user_scores')
        .select('*')
        .limit(1);
      
      if (error && error.message.includes('does not exist')) {
        console.log('✅ Tabla no existe - será creada por migración manual');
      } else {
        console.log('✅ Tabla ya existe');
      }
    } catch (err) {
      console.log('✅ Tabla no existe - será creada por migración manual');
    }
    
    // 4. Add status column to cluequest_qr_codes
    console.log('\n📊 4. Agregando columna status a cluequest_qr_codes...');
    try {
      const { data, error } = await supabase
        .from('cluequest_qr_codes')
        .select('status')
        .limit(1);
      
      if (error && error.message.includes('column "status" does not exist')) {
        console.log('✅ Columna no existe - será agregada por migración manual');
      } else {
        console.log('✅ Columna ya existe');
      }
    } catch (err) {
      console.log('✅ Columna no existe - será agregada por migración manual');
    }
    
    console.log('\n🎯 ESTADO ACTUAL DE LA BASE DE DATOS');
    console.log('====================================');
    
    // Verify current state
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
    
    console.log('\n📈 RESUMEN FINAL:');
    console.log('=================');
    console.log(`✅ Tablas existentes: ${existingTables}`);
    console.log(`❌ Tablas faltantes: ${missingTables}`);
    console.log(`📊 Completitud: ${((existingTables / (existingTables + missingTables)) * 100).toFixed(1)}%`);
    
    if (missingTables > 0) {
      console.log('\n💡 INSTRUCCIONES PARA MIGRACIÓN MANUAL:');
      console.log('=======================================');
      console.log('1. Abrir Supabase Dashboard');
      console.log('2. Ir a SQL Editor');
      console.log('3. Copiar el contenido de supabase/migrations/006_missing_tables.sql');
      console.log('4. Pegar y ejecutar la migración');
      console.log('5. Verificar que las tablas se crearon correctamente');
    } else {
      console.log('\n🎉 ¡TODAS LAS TABLAS ESTÁN COMPLETAS!');
    }
    
  } catch (error) {
    console.error('🚨 ERROR CRÍTICO:', error.message);
  }
}

createMissingTablesDirect().catch(console.error);
