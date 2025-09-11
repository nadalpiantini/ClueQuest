# 🚀 INSTRUCCIONES DE MIGRACIÓN MANUAL - ClueQuest

**Estado Actual**: 7/10 tablas existentes (70% completitud)  
**Fecha**: $(date)  
**Prioridad**: CRÍTICA

## 🎯 PROBLEMA IDENTIFICADO

La migración `006_missing_tables.sql` no se puede ejecutar automáticamente porque:
1. La función `exec_sql` no está disponible en el entorno
2. Faltan 3 tablas críticas que causan errores de referencia

## 📊 ESTADO ACTUAL DE LA BASE DE DATOS

### ✅ **TABLAS EXISTENTES (7/10)**
- `cluequest_profiles` - 0 registros
- `cluequest_organizations` - 1 registro  
- `cluequest_adventures` - 1 registro
- `cluequest_scenes` - 1 registro
- `cluequest_teams` - 0 registros
- `cluequest_ai_stories` - 0 registros
- `cluequest_qr_codes` - 0 registros

### ❌ **TABLAS FALTANTES (3/10)**
- `cluequest_user_activities` - **CRÍTICA**
- `cluequest_adventure_participations` - **CRÍTICA**  
- `cluequest_user_scores` - **CRÍTICA**

## 🛠️ SOLUCIÓN: MIGRACIÓN MANUAL

### **Paso 1: Acceder al Supabase Dashboard**
1. Ir a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Seleccionar el proyecto ClueQuest
3. Navegar a **SQL Editor** en el menú lateral

### **Paso 2: Ejecutar las Migraciones en Orden**
1. **Primero**: Copiar el contenido de `supabase/migrations/007_fix_qr_codes_structure.sql`
2. Pegar en el SQL Editor y ejecutar
3. **Segundo**: Copiar el contenido de `supabase/migrations/006_missing_tables.sql`
4. Pegar en el SQL Editor y ejecutar
5. **Tercero**: Copiar el contenido de `supabase/migrations/008_final_completion.sql`
6. Pegar en el SQL Editor y ejecutar

### **Paso 3: Verificar la Ejecución**
Después de ejecutar, verificar que aparezcan estos mensajes:

**Migración 007:**
- ✅ `Added [column_name] column to cluequest_qr_codes` (para cada columna agregada)
- ✅ `Created QR codes [index_name] index` (para cada índice creado)
- ✅ `Created update trigger for QR codes` (trigger creado)

**Migración 006:**
- ✅ `Foreign key constraints added for cluequest_game_sessions` (si la tabla existe)
- ✅ `cluequest_game_sessions table does not exist - skipping FK constraints` (si no existe)

**Migración 008 (Final):**
- ✅ `Created update trigger for QR codes`
- ✅ `Created update trigger for adventure participations`
- ✅ `Created RLS policies for user activities`
- ✅ `Created RLS policies for adventure participations`
- ✅ `Created RLS policies for user scores`
- ✅ `🎉 MIGRATION COMPLETED SUCCESSFULLY!`

## 📋 CONTENIDO DE LA MIGRACIÓN

La migración corregida incluye:

### **1. Tablas Principales**
```sql
-- User activities tracking
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

-- Adventure participations tracking  
CREATE TABLE IF NOT EXISTS cluequest_adventure_participations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID NOT NULL REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID, -- FK constraint added conditionally
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

-- User scores tracking
CREATE TABLE IF NOT EXISTS cluequest_user_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    adventure_id UUID REFERENCES cluequest_adventures(id) ON DELETE CASCADE,
    session_id UUID, -- FK constraint added conditionally
    score_type TEXT NOT NULL CHECK (score_type IN ('total', 'scene', 'bonus', 'penalty', 'team')),
    score_value INTEGER NOT NULL DEFAULT 0,
    score_source TEXT,
    metadata JSONB DEFAULT '{}',
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **2. Columnas Adicionales**
```sql
-- Add status column to QR codes table
ALTER TABLE cluequest_qr_codes 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired', 'revoked'));
```

### **3. Índices de Performance**
```sql
-- User activities indexes
CREATE INDEX IF NOT EXISTS idx_user_activities_user ON cluequest_user_activities(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_org ON cluequest_user_activities(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON cluequest_user_activities(activity_type, created_at DESC);

-- Adventure participations indexes
CREATE INDEX IF NOT EXISTS idx_adventure_participations_user ON cluequest_adventure_participations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_adventure_participations_adventure ON cluequest_adventure_participations(adventure_id, completion_status);
CREATE INDEX IF NOT EXISTS idx_adventure_participations_session ON cluequest_adventure_participations(session_id, completion_status);

-- User scores indexes
CREATE INDEX IF NOT EXISTS idx_user_scores_user ON cluequest_user_scores(user_id, earned_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_scores_adventure ON cluequest_user_scores(adventure_id, score_type);
CREATE INDEX IF NOT EXISTS idx_user_scores_session ON cluequest_user_scores(session_id, score_type);

-- QR codes status index
CREATE INDEX IF NOT EXISTS idx_qr_codes_status ON cluequest_qr_codes(status, expires_at) WHERE status = 'active';
```

### **4. Políticas de Seguridad (RLS)**
```sql
-- Enable RLS on new tables
ALTER TABLE cluequest_user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_adventure_participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluequest_user_scores ENABLE ROW LEVEL SECURITY;

-- User activities policies
CREATE POLICY "Users can view own activities" ON cluequest_user_activities
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own activities" ON cluequest_user_activities
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Adventure participations policies
CREATE POLICY "Users can view own participations" ON cluequest_adventure_participations
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own participations" ON cluequest_adventure_participations
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- User scores policies
CREATE POLICY "Users can view own scores" ON cluequest_user_scores
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own scores" ON cluequest_user_scores
    FOR INSERT WITH CHECK (user_id = auth.uid());
```

### **5. Triggers y Funciones**
```sql
-- Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update timestamps trigger for participations
CREATE TRIGGER update_adventure_participations_updated_at 
    BEFORE UPDATE ON cluequest_adventure_participations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update timestamps trigger for QR codes
CREATE TRIGGER update_qr_codes_updated_at 
    BEFORE UPDATE ON cluequest_qr_codes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Helper functions for user activity and score summaries
-- (Incluye funciones get_user_activity_summary y get_user_score_summary)
```

### **6. Foreign Keys Condicionales**
```sql
-- Add foreign key constraints only if the referenced tables exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cluequest_game_sessions') THEN
        -- Add FK constraints if cluequest_game_sessions exists
        ALTER TABLE cluequest_adventure_participations 
        ADD CONSTRAINT cluequest_adventure_participations_session_id_fkey 
        FOREIGN KEY (session_id) REFERENCES cluequest_game_sessions(id) ON DELETE CASCADE;
        
        ALTER TABLE cluequest_user_scores 
        ADD CONSTRAINT cluequest_user_scores_session_id_fkey 
        FOREIGN KEY (session_id) REFERENCES cluequest_game_sessions(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Foreign key constraints added for cluequest_game_sessions';
    ELSE
        RAISE NOTICE 'cluequest_game_sessions table does not exist - skipping FK constraints';
    END IF;
END $$;
```

## ✅ VERIFICACIÓN POST-MIGRACIÓN

Después de ejecutar la migración, verificar que:

1. **Todas las tablas existen**:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_name LIKE 'cluequest_%' 
   ORDER BY table_name;
   ```

2. **Las nuevas tablas tienen datos de prueba**:
   ```sql
   SELECT COUNT(*) FROM cluequest_user_activities;
   SELECT COUNT(*) FROM cluequest_adventure_participations;
   SELECT COUNT(*) FROM cluequest_user_scores;
   ```

3. **Los índices se crearon correctamente**:
   ```sql
   SELECT indexname FROM pg_indexes 
   WHERE tablename LIKE 'cluequest_%' 
   AND indexname LIKE 'idx_%';
   ```

## 🎯 RESULTADO ESPERADO

Después de la migración exitosa:
- ✅ **10/10 tablas existentes** (100% completitud)
- ✅ **Performance optimizada** con índices
- ✅ **Seguridad implementada** con RLS
- ✅ **Funcionalidad completa** para tracking de usuarios

## 🚨 IMPORTANTE

- **NO ejecutar la migración si ya existe** - usa `CREATE TABLE IF NOT EXISTS`
- **Verificar mensajes de error** - algunos pueden ser normales
- **Hacer backup** antes de ejecutar (recomendado)
- **Ejecutar en orden** - no modificar el orden de las declaraciones

---

**Una vez completada la migración, el proyecto ClueQuest tendrá una base de datos completamente funcional y lista para producción.**
