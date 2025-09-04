# 🚨 Fix: "Failed to create default organization" Error

## **Problem Identified**

The error "Failed to create default organization" occurs when trying to create an adventure. This happens because:

1. **Database tables don't exist yet** (migrations not applied)
2. **Permission issues** with the service role key
3. **Unique constraint violations** on organization slugs
4. **Database connection problems**

## **🔧 Immediate Fixes Applied**

I've updated the API route (`src/app/api/adventures/route.ts`) with:

1. **Better error handling** with detailed error messages
2. **Unique slug generation** to avoid conflicts
3. **Connection testing** before attempting operations
4. **Detailed logging** for debugging

## **🛠️ Step-by-Step Solution**

### **Step 1: Verify Database Setup**

Run the database verification script:

```bash
node scripts/verify-database-setup.js
```

This will check:
- ✅ Environment variables
- ✅ Database connection
- ✅ Required tables exist
- ✅ Current data status

### **Step 2: Check Environment Variables**

Ensure your `.env.local` has real Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
```

**Not placeholder values!**

### **Step 3: Apply Database Migrations**

If tables don't exist, you need to run the migrations:

1. **Go to your Supabase dashboard**
2. **Navigate to SQL Editor**
3. **Run the migration files** from `supabase/migrations/`:

```sql
-- Run 001_initial_schema.sql first
-- Then 002_adventure_system.sql
-- Finally 003_ai_story_generation.sql
```

### **Step 4: Check Service Role Permissions**

Ensure your service role key has:
- ✅ **Full database access**
- ✅ **Ability to create tables**
- ✅ **Insert/update/delete permissions**

## **🔍 Troubleshooting Steps**

### **If "Table does not exist" error:**

1. **Check if you have a Supabase project created**
2. **Verify migrations are applied**
3. **Check table names match exactly**

### **If "Permission denied" error:**

1. **Verify service role key is correct**
2. **Check key permissions in Supabase dashboard**
3. **Ensure key hasn't expired**

### **If "Unique constraint violation":**

1. **The fix is already applied** (unique slug generation)
2. **Check for existing organizations**
3. **Clear test data if needed**

## **📋 Quick Diagnostic Commands**

```bash
# Check environment variables
cat .env.local | grep SUPABASE

# Verify database connection
node scripts/verify-database-setup.js

# Check if Supabase is accessible
curl -I https://your-project-id.supabase.co
```

## **🎯 Expected Results After Fix**

1. **Database verification script runs successfully**
2. **All required tables exist**
3. **Organization creation works**
4. **Adventure creation completes successfully**

## **🚨 Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| Tables don't exist | Run migrations in Supabase SQL Editor |
| Permission denied | Check service role key permissions |
| Connection failed | Verify Supabase URL and project status |
| Unique constraint | Already fixed with unique slug generation |

## **💡 Pro Tips**

1. **Always run the verification script first** to identify the exact issue
2. **Check Supabase dashboard logs** for detailed error information
3. **Use the browser console** to see the full error response
4. **Monitor the Network tab** in DevTools for API call details

## **🔄 After Fixing**

1. **Restart your development server**
2. **Try creating an adventure again**
3. **Check the browser console for any remaining errors**
4. **Monitor the Supabase dashboard for new records**

---

**Still having issues?** Run the verification script and share the output for further diagnosis.
