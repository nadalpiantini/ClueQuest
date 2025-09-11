#!/usr/bin/env node

/**
 * Script para crear tablas faltantes en ClueQuest
 * Usa la API REST de Supabase para ejecutar SQL
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createMissingTables() {
  console.log('🔧 CREANDO TABLAS FALTANTES VIA API REST');
  console.log('=========================================');

  const tables = [
    {
      name: 'cluequest_user_activities',
      sql: `
        CREATE TABLE IF NOT EXISTS cluequest_user_activities (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          organization_id UUID REFERENCES cluequest_organizations(id) ON DELETE CASCADE,
          activity_type TEXT NOT NULL,
          activity_data JSONB DEFAULT '{}',
          ip_address INET,
          user_agent TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    },
    {
      name: 'cluequest_adventure_participations',
      sql: `
        CREATE TABLE IF NOT EXISTS cluequest_adventure_participations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          session_id UUID REFERENCES cluequest_game_sessions(id) ON DELETE CASCADE,
          participation_type TEXT DEFAULT 'player' CHECK (participation_type IN ('player', 'spectator', 'host', 'co_host')),
          joined_at TIMESTAMPTZ DEFAULT NOW(),
          left_at TIMESTAMPTZ,
          completion_status TEXT DEFAULT 'active' CHECK (completion_status IN ('active', 'completed', 'abandoned', 'disqualified')),
          final_score INTEGER DEFAULT 0,
          completion_time INTEGER,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(adventure_id, user_id, session_id)
        );
      `
    },
    {
      name: 'cluequest_user_scores',
      sql: `
        CREATE TABLE IF NOT EXISTS cluequest_user_scores (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          adventure_id UUID REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
          session_id UUID REFERENCES cluequest_game_sessions(id) ON DELETE CASCADE,
          score_type TEXT NOT NULL CHECK (score_type IN ('total', 'scene', 'bonus', 'penalty', 'team')),
          score_value INTEGER NOT NULL DEFAULT 0,
          score_source TEXT,
          metadata JSONB DEFAULT '{}',
          earned_at TIMESTAMPTZ DEFAULT NOW(),
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    }
  ];

  // Crear tablas
  for (const table of tables) {
    console.log(`📊 Creando ${table.name}...`);
    try {
      const { data, error } = await supabase.rpc('exec_sql', { 
        sql: table.sql 
      });
      
      if (error) {
        console.log(`❌ Error creando ${table.name}:`, error.message);
      } else {
        console.log(`✅ ${table.name} creada exitosamente`);
      }
    } catch (err) {
      console.log(`❌ Exception creando ${table.name}:`, err.message);
    }
  }

  // Agregar columna status a cluequest_qr_codes
  console.log('🔧 Agregando columna status a cluequest_qr_codes...');
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE cluequest_qr_codes 
        ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired', 'revoked'));
      `
    });
    
    if (error) {
      console.log('❌ Error agregando columna status:', error.message);
    } else {
      console.log('✅ Columna status agregada exitosamente');
    }
  } catch (err) {
    console.log('❌ Exception agregando columna status:', err.message);
  }

  // Crear índices
  console.log('📈 Creando índices de performance...');
  const indexes = [
    {
      name: 'idx_user_activities_user',
      sql: 'CREATE INDEX IF NOT EXISTS idx_user_activities_user ON cluequest_user_activities(user_id, created_at DESC);'
    },
    {
      name: 'idx_adventure_participations_user',
      sql: 'CREATE INDEX IF NOT EXISTS idx_adventure_participations_user ON cluequest_adventure_participations(user_id, created_at DESC);'
    },
    {
      name: 'idx_user_scores_user',
      sql: 'CREATE INDEX IF NOT EXISTS idx_user_scores_user ON cluequest_user_scores(user_id, earned_at DESC);'
    },
    {
      name: 'idx_qr_codes_status',
      sql: 'CREATE INDEX IF NOT EXISTS idx_qr_codes_status ON cluequest_qr_codes(status, expires_at) WHERE status = \'active\';'
    }
  ];

  for (const index of indexes) {
    try {
      const { data, error } = await supabase.rpc('exec_sql', { 
        sql: index.sql 
      });
      
      if (error) {
        console.log(`❌ Error creando índice ${index.name}:`, error.message);
      } else {
        console.log(`✅ Índice ${index.name} creado exitosamente`);
      }
    } catch (err) {
      console.log(`❌ Exception creando índice ${index.name}:`, err.message);
    }
  }

  // Habilitar RLS
  console.log('🔐 Habilitando Row Level Security...');
  const rlsTables = [
    'cluequest_user_activities',
    'cluequest_adventure_participations',
    'cluequest_user_scores'
  ];

  for (const tableName of rlsTables) {
    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;`
      });
      
      if (error) {
        console.log(`❌ Error habilitando RLS en ${tableName}:`, error.message);
      } else {
        console.log(`✅ RLS habilitado en ${tableName}`);
      }
    } catch (err) {
      console.log(`❌ Exception habilitando RLS en ${tableName}:`, err.message);
    }
  }

  // Verificar tablas creadas
  console.log('\n🔍 Verificando tablas creadas...');
  const tablesToCheck = [
    'cluequest_user_activities',
    'cluequest_adventure_participations', 
    'cluequest_user_scores'
  ];
  
  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: verificada y accesible`);
      }
    } catch (err) {
      console.log(`⚠️ ${table}: ${err.message}`);
    }
  }

  // Test QR validation con nueva columna status
  console.log('\n⚡ Probando QR validation con columna status...');
  const start = Date.now();
  const { data: qrData, error: qrError } = await supabase
    .from('cluequest_qr_codes')
    .select('*')
    .eq('status', 'active')
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

  console.log('\n🎉 Proceso completado!');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createMissingTables().catch(console.error);
}

module.exports = { createMissingTables };
