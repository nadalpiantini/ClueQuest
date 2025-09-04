# 🚀 Supabase Setup Guide - Fix "Error creating adventure: Failed to fetch"

## **Problem Identified**

The error "Error creating adventure: Failed to fetch" occurs because the Supabase environment variables are not properly configured with real credentials. Currently, your `.env.local` file contains placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

## **Solution: Configure Supabase**

### **Step 1: Create a Supabase Project**

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `cluequest` (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
6. Click "Create new project"
7. Wait for setup to complete (2-3 minutes)

### **Step 2: Get Your API Keys**

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public**: The public API key
   - **service_role**: The service role key (keep this secret!)

### **Step 3: Configure Environment Variables**

#### **Option A: Use the Setup Script (Recommended)**

```bash
# Run the automated setup script
node scripts/setup-supabase-env.js
```

The script will prompt you for your Supabase credentials and automatically update your `.env.local` file.

#### **Option B: Manual Configuration**

1. Open `.env.local` in your code editor
2. Replace the placeholder values with your actual Supabase credentials:

```env
# Supabase (Required for full functionality)
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
```

### **Step 4: Verify Configuration**

After updating the environment variables, verify your `.env.local` file contains real values (not placeholders).

### **Step 5: Restart Development Server**

```bash
# Stop your current dev server (Ctrl+C)
# Then restart it
npm run dev
# or
yarn dev
```

## **Testing the Fix**

1. Go to `/builder` in your app
2. Fill out the adventure creation form
3. Click "Create Adventure"
4. The error should be resolved and the adventure should be created successfully

## **Database Schema Status**

✅ **Good News**: Your database schema is already production-ready! The migrations in `supabase/migrations/` will automatically create all required tables when you first connect to Supabase.

## **Troubleshooting**

### **Still Getting "Failed to fetch"?**

1. **Check Environment Variables**:
   ```bash
   # Verify your .env.local file has real values
   cat .env.local | grep SUPABASE
   ```

2. **Check Supabase Connection**:
   - Go to your Supabase dashboard
   - Check if the project is active
   - Verify API keys are correct

3. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Look for more specific error messages in the Console tab

4. **Verify API Route**:
   - Check if `/api/adventures` endpoint is accessible
   - Look for any CORS or network errors

### **Common Issues**

- **Invalid URL Format**: Must be `https://project-id.supabase.co`
- **Wrong API Keys**: Make sure you're using the correct keys from Settings → API
- **Project Not Active**: Ensure your Supabase project is fully set up and active
- **Environment File Not Loaded**: Restart your dev server after updating `.env.local`

## **Next Steps After Setup**

1. **Test Adventure Creation**: Create a test adventure to verify everything works
2. **Check Database**: Verify tables are created in your Supabase dashboard
3. **Monitor Logs**: Check Supabase logs for any errors during adventure creation

## **Security Notes**

- 🔒 Never commit `.env.local` to version control
- 🔒 Keep your `SUPABASE_SERVICE_ROLE_KEY` secret
- 🔒 The `anon` key is safe to expose in client-side code
- 🔒 Consider using environment-specific files for production

---

**Need Help?** Check the Supabase documentation or create an issue in your project repository.
