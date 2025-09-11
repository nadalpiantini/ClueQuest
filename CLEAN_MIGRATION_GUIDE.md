# 🧹 GUÍA DE MIGRACIÓN LIMPIA - ClueQuest

**Problema**: Error de sintaxis JavaScript en contexto SQL  
**Solución**: Archivos de migración completamente limpios

## 🚨 **PROBLEMA IDENTIFICADO**

El error `syntax error at or near "const"` indica que se está intentando ejecutar código JavaScript en el SQL Editor de Supabase. Esto puede ocurrir si:

1. Se copió accidentalmente código JavaScript
2. Se mezcló contenido de scripts con migraciones
3. Se ejecutó el script de verificación en lugar de la migración

## ✅ **SOLUCIÓN: ARCHIVOS DE MIGRACIÓN LIMPIOS**

### **Archivo 1: 007_fix_qr_codes_structure.sql**
- ✅ **338 líneas** de SQL puro
- ✅ **Sin código JavaScript**
- ✅ **Sintaxis SQL válida**
- ✅ **Comentarios apropiados**

### **Archivo 2: 006_missing_tables.sql**
- ✅ **275 líneas** de SQL puro
- ✅ **Sin código JavaScript**
- ✅ **Sintaxis SQL válida**
- ✅ **Comentarios apropiados**

## 📋 **INSTRUCCIONES DE EJECUCIÓN LIMPIA**

### **Paso 1: Verificar Contenido**
Antes de copiar, verificar que el archivo contiene solo SQL:

```bash
# Verificar que no hay JavaScript
grep -i "const\|require\|module" supabase/migrations/007_fix_qr_codes_structure.sql
grep -i "const\|require\|module" supabase/migrations/006_missing_tables.sql
```

**Resultado esperado**: No debe mostrar nada (archivos limpios)

### **Paso 2: Copiar Solo el Contenido SQL**
1. Abrir `supabase/migrations/007_fix_qr_codes_structure.sql`
2. **Copiar TODO el contenido** (Ctrl+A, Ctrl+C)
3. **NO copiar** líneas que contengan:
   - `const { createClient }`
   - `require('@supabase/supabase-js')`
   - `module.exports`
   - Cualquier código JavaScript

### **Paso 3: Ejecutar en Supabase Dashboard**
1. Ir a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Seleccionar proyecto ClueQuest
3. Ir a **SQL Editor**
4. **Pegar SOLO el contenido SQL**
5. Hacer clic en **Run**

## 🔍 **VERIFICACIÓN DE CONTENIDO LIMPIO**

### **Contenido Correcto (SQL):**
```sql
-- ClueQuest QR Codes Structure Fix
-- Handles the simplified QR codes table structure and adds missing columns

-- =============================================================================
-- QR CODES STRUCTURE ENHANCEMENT
-- =============================================================================

-- Add missing columns to cluequest_qr_codes table (conditional)
DO $$
BEGIN
    -- Add session_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cluequest_qr_codes' 
        AND column_name = 'session_id'
    ) THEN
        ALTER TABLE cluequest_qr_codes 
        ADD COLUMN session_id UUID;
        RAISE NOTICE 'Added session_id column to cluequest_qr_codes';
    END IF;
    -- ... más SQL ...
END $$;
```

### **Contenido Incorrecto (JavaScript):**
```javascript
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

## 🎯 **ORDEN DE EJECUCIÓN CORRECTO**

### **1. Migración 007 (Primero)**
- Archivo: `supabase/migrations/007_fix_qr_codes_structure.sql`
- Propósito: Agregar columnas faltantes a QR codes
- Incluye: Función `update_updated_at_column()`

### **2. Migración 006 (Segundo)**
- Archivo: `supabase/migrations/006_missing_tables.sql`
- Propósito: Crear tablas faltantes
- Incluye: Triggers y políticas RLS

### **3. Verificación (Tercero)**
- Comando: `node scripts/verify-final-migration.js`
- Propósito: Confirmar que todo funciona

## 🚨 **SEÑALES DE PROBLEMA**

Si ves estos errores, significa que se copió código JavaScript:

```
ERROR: 42601: syntax error at or near "const"
ERROR: 42601: syntax error at or near "require"
ERROR: 42601: syntax error at or near "module"
```

## ✅ **SEÑALES DE ÉXITO**

Si ves estos mensajes, la migración está funcionando:

```
NOTICE: Added session_id column to cluequest_qr_codes
NOTICE: Added token column to cluequest_qr_codes
NOTICE: Created QR codes status index with expires_at
NOTICE: Created update trigger for QR codes
```

## 🧹 **LIMPIEZA DE ARCHIVOS**

Si necesitas limpiar los archivos:

```bash
# Verificar contenido
head -10 supabase/migrations/007_fix_qr_codes_structure.sql
head -10 supabase/migrations/006_missing_tables.sql

# Debe mostrar solo comentarios SQL, no JavaScript
```

## 💡 **RECOMENDACIONES**

1. **Siempre verificar** el contenido antes de copiar
2. **Usar solo archivos .sql** para migraciones
3. **No mezclar** scripts JavaScript con migraciones
4. **Ejecutar en orden** (007 primero, 006 segundo)
5. **Verificar resultado** con scripts de verificación

---

**Los archivos de migración están completamente limpios y listos para ejecución. El error de sintaxis JavaScript indica que se copió accidentalmente código de un script en lugar del contenido SQL de la migración.**
