const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testUpdateFunction() {
  console.log('🧪 PROBANDO FUNCIÓN update_updated_at_column');
  console.log('============================================');
  
  try {
    // First, try to create the function
    console.log('\n📝 1. Creando función update_updated_at_column...');
    
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    // Try to execute the function creation
    try {
      const { data, error } = await supabase
        .from('_sql_editor')
        .select('*')
        .limit(1);
      
      if (error) {
        console.log('❌ No se puede ejecutar SQL directamente:', error.message);
        console.log('💡 La función debe crearse via Supabase Dashboard');
        return;
      }
    } catch (err) {
      console.log('❌ Método directo no disponible:', err.message);
      console.log('💡 La función debe crearse via Supabase Dashboard');
      return;
    }
    
    // Test if function exists by trying to call it
    console.log('\n🔍 2. Verificando si la función existe...');
    
    try {
      const { data, error } = await supabase
        .rpc('update_updated_at_column');
      
      if (error) {
        console.log('❌ Función no existe:', error.message);
        console.log('💡 Necesita crearse via migración');
      } else {
        console.log('✅ Función existe y es accesible');
      }
    } catch (err) {
      console.log('❌ Error verificando función:', err.message);
    }
    
    // Test with a simple table that has updated_at
    console.log('\n🧪 3. Probando con tabla existente...');
    
    try {
      const { data, error } = await supabase
        .from('cluequest_profiles')
        .select('updated_at')
        .limit(1);
      
      if (error) {
        console.log('❌ Error accediendo a cluequest_profiles:', error.message);
      } else {
        console.log('✅ Tabla cluequest_profiles accesible');
        console.log('📊 Registros encontrados:', data?.length || 0);
      }
    } catch (err) {
      console.log('❌ Error con cluequest_profiles:', err.message);
    }
    
    console.log('\n💡 RECOMENDACIÓN:');
    console.log('==================');
    console.log('1. La función update_updated_at_column debe crearse via migración');
    console.log('2. Ejecutar migración 007_fix_qr_codes_structure.sql primero');
    console.log('3. Luego ejecutar migración 006_missing_tables.sql');
    console.log('4. Ambas migraciones incluyen la función necesaria');
    
  } catch (error) {
    console.error('🚨 ERROR:', error.message);
  }
}

testUpdateFunction().catch(console.error);
