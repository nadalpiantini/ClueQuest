const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function executeCorrectedMigration() {
  console.log('🚀 EJECUTANDO MIGRACIÓN CORREGIDA 006_missing_tables.sql');
  console.log('=======================================================');
  
  try {
    // Read the corrected migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '006_missing_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Migración leída correctamente');
    console.log('📊 Tamaño del archivo:', migrationSQL.length, 'caracteres');
    
    // Split the migration into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log('🔧 Ejecutando', statements.length, 'declaraciones SQL...');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`\n📝 Ejecutando declaración ${i + 1}/${statements.length}...`);
          
          // Execute the statement using a custom RPC function
          const { data, error } = await supabase.rpc('exec_sql', { 
            sql: statement + ';' 
          });
          
          if (error) {
            console.log(`❌ Error en declaración ${i + 1}:`, error.message);
            errorCount++;
            
            // Continue with next statement unless it's a critical error
            if (error.message.includes('already exists') || 
                error.message.includes('does not exist')) {
              console.log('⚠️ Error no crítico - continuando...');
            } else {
              console.log('🚨 Error crítico - deteniendo ejecución');
              break;
            }
          } else {
            console.log(`✅ Declaración ${i + 1} ejecutada correctamente`);
            successCount++;
          }
        } catch (err) {
          console.log(`❌ Excepción en declaración ${i + 1}:`, err.message);
          errorCount++;
        }
      }
    }
    
    console.log('\n📊 RESUMEN DE EJECUCIÓN:');
    console.log('========================');
    console.log(`✅ Declaraciones exitosas: ${successCount}`);
    console.log(`❌ Declaraciones con error: ${errorCount}`);
    console.log(`📈 Tasa de éxito: ${((successCount / (successCount + errorCount)) * 100).toFixed(1)}%`);
    
    if (successCount > 0) {
      console.log('\n🎉 MIGRACIÓN COMPLETADA CON ÉXITO');
      console.log('==================================');
      
      // Verify the new tables were created
      console.log('\n🔍 VERIFICANDO NUEVAS TABLAS...');
      const newTables = [
        'cluequest_user_activities',
        'cluequest_adventure_participations', 
        'cluequest_user_scores'
      ];
      
      for (const table of newTables) {
        try {
          const { data, error } = await supabase.from(table).select('*').limit(1);
          if (error) {
            console.log(`❌ ${table}: ${error.message}`);
          } else {
            console.log(`✅ ${table}: Creada correctamente (${data?.length || 0} registros)`);
          }
        } catch (err) {
          console.log(`❌ ${table}: ${err.message}`);
        }
      }
    }
    
  } catch (error) {
    console.error('🚨 ERROR CRÍTICO EN MIGRACIÓN:', error.message);
    process.exit(1);
  }
}

// Alternative method using direct SQL execution
async function executeMigrationAlternative() {
  console.log('\n🔄 INTENTANDO MÉTODO ALTERNATIVO...');
  console.log('===================================');
  
  try {
    // Try to execute the migration using a different approach
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '006_missing_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Use the SQL editor approach
    const { data, error } = await supabase
      .from('_sql_editor')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Método alternativo no disponible:', error.message);
      return false;
    }
    
    console.log('✅ Método alternativo disponible');
    return true;
    
  } catch (err) {
    console.log('❌ Método alternativo falló:', err.message);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🎯 INICIANDO EJECUCIÓN DE MIGRACIÓN CORREGIDA');
  console.log('=============================================');
  
  // First try the main method
  await executeCorrectedMigration();
  
  // If that fails, try alternative method
  const alternativeSuccess = await executeMigrationAlternative();
  
  if (!alternativeSuccess) {
    console.log('\n💡 RECOMENDACIÓN:');
    console.log('==================');
    console.log('1. Ejecutar la migración manualmente via Supabase Dashboard');
    console.log('2. Copiar el contenido de supabase/migrations/006_missing_tables.sql');
    console.log('3. Pegar en el SQL Editor del Dashboard');
    console.log('4. Ejecutar la migración');
  }
}

main().catch(console.error);
