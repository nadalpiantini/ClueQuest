# ⚠️ DANGEROUS MODE - Database Surgical Diagnostic

## Overview
The `--dangerously-skip-permissions` flag enables **FULL ADMIN ACCESS** to PostgreSQL system catalogs, bypassing normal security restrictions to execute your original SQL queries.

## 🚨 WARNING
**USE THIS MODE ONLY IF YOU HAVE FULL DATABASE ADMIN ACCESS**

This mode:
- Connects directly to PostgreSQL using the `pg` driver
- Bypasses Supabase's security layer
- Executes admin-level queries on system catalogs
- Accesses `pg_constraint`, `pg_policies`, `pg_class`, `pg_proc`

## Usage

### Safe Mode (Default)
```bash
npm run db:surgical-diagnostic
```
- Uses Supabase client
- Limited to accessible queries
- Safe for production environments
- Graceful degradation for restricted queries

### Dangerous Mode (Full Access)
```bash
npm run db:surgical-diagnostic:dangerous
```
- Uses direct PostgreSQL connection
- **Executes ALL your original SQL queries**
- Requires database admin privileges
- Full system catalog access

## What Dangerous Mode Enables

### 1. **Complete Constraint Analysis**
```sql
SELECT conname, conrelid::regclass AS table_name, pg_get_constraintdef(c.oid) AS definition
FROM pg_constraint c
WHERE connamespace = 'public'::regnamespace
ORDER BY conrelid::regclass::text, conname;
```

### 2. **Full RLS Policy Audit**
```sql
SELECT tablename, policyname, cmd AS command, roles, qual, with_check, permissive
FROM pg_policies
ORDER BY tablename, policyname;
```

### 3. **Complete RLS Status Check**
```sql
SELECT relname AS table_name,
       relrowsecurity AS rls_enabled,
       relforcerowsecurity AS rls_forced
FROM pg_class
WHERE relkind = 'r' AND relnamespace = 'public'::regnamespace
ORDER BY relname;
```

### 4. **Full RPC Function Analysis**
```sql
SELECT p.proname AS function, pg_get_functiondef(p.oid) AS definition
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname='public' AND p.prokind='f' AND p.prosecdef IS NOT NULL
ORDER BY p.proname;
```

## Connection Details

### Safe Mode Connection
- Uses: `@supabase/supabase-js` client
- Authentication: Service Role Key
- Access: Limited to accessible tables/views
- Security: Full Supabase security layer

### Dangerous Mode Connection
- Uses: `pg` PostgreSQL driver directly
- Authentication: Direct PostgreSQL credentials
- Access: Full admin access to system catalogs
- Security: ⚠️ **BYPASSED** - Direct database access

## Output Differences

### Safe Mode Output
```
🔒 Analyzing constraints (LIMITED ACCESS MODE)...
⚠️  Constraint analysis requires elevated database privileges

🛡️ Analyzing RLS policies (LIMITED ACCESS MODE)...
⚠️  Tables with open access (RLS may be disabled): cluequest_profiles
```

### Dangerous Mode Output
```
🔬 Executing (DIRECT): 2. Constraints and unique keys analysis...
✅ Constraints and unique keys analysis completed in 45ms (127 rows)
🔒 Found 127 constraints: 23 PK, 45 FK, 12 UNIQUE, 47 CHECK

🔬 Executing (DIRECT): 3. RLS policies analysis...
✅ RLS policies analysis completed in 32ms (89 rows)
🛡️ Found 89 RLS policies (67 ClueQuest-specific)
   25 SELECT, 22 INSERT, 21 UPDATE, 21 DELETE
```

## When to Use Dangerous Mode

### ✅ Use When:
- You have full database admin access
- You need complete constraint analysis
- You want full RLS policy audit
- You're performing security compliance checks
- You need exact pg_* catalog data

### ❌ Don't Use When:
- You only have application-level access
- Running in production without admin rights
- You're unsure about database permissions
- Supabase restricts direct PostgreSQL access

## Error Handling

### Safe Mode Graceful Fallback
```javascript
// Limited access - falls back to expected schema analysis
this.issues.push({
    category: 'analysis_limitation',
    severity: 'low',
    description: 'Constraint analysis requires elevated database privileges',
    recommendation: 'Run with --dangerously-skip-permissions flag for complete audit'
});
```

### Dangerous Mode Error Detection
```javascript
// Full error details for admin-level failures
console.log(`❌ ${description} failed: ${error.message}`);
this.issues.push({
    category: 'query_execution',
    severity: 'high',
    description: `Failed to execute ${description}`,
    error: error.message,
    recommendation: 'Check database admin privileges and connection'
});
```

## Security Considerations

1. **Connection String**: Uses direct PostgreSQL connection string
2. **Authentication**: Bypasses Supabase auth layer
3. **SSL**: Configured with `{ rejectUnauthorized: false }`
4. **Privileges**: Requires `postgres` user or equivalent admin
5. **Audit Trail**: All queries are logged and timed

## Troubleshooting

### Common Issues in Dangerous Mode

**Connection Failed**
```
❌ Failed to connect directly to PostgreSQL: connection refused
```
- Check if you have direct PostgreSQL access
- Verify connection string format
- Confirm admin privileges

**Permission Denied**
```
❌ Constraints and unique keys analysis failed: permission denied for table pg_constraint
```
- Requires `postgres` superuser or equivalent
- Check if your service role has admin privileges

**SSL Certificate Issues**
```
❌ Failed to connect: self signed certificate
```
- SSL configuration set to `{ rejectUnauthorized: false }`
- Supabase uses self-signed certificates in some configurations

## Example Output Comparison

### Constraint Analysis Results

**Safe Mode:**
```json
{
  "constraints_analysis": {
    "duration_ms": 100,
    "status": "limited_access",
    "note": "Requires --dangerously-skip-permissions for full constraint analysis"
  }
}
```

**Dangerous Mode:**
```json
{
  "constraints_analysis": {
    "duration_ms": 45,
    "status": "success",
    "row_count": 127,
    "method": "direct_postgresql"
  }
}
```

---

## Summary

**Dangerous Mode = Your Original SQL Queries in Full**

Use `--dangerously-skip-permissions` when you need the **complete surgical analysis** with all 6 original SQL queries executing at full admin level.

This gives you the **true operación bisturí** experience! 🏥⚔️