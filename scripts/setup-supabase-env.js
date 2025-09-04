#!/usr/bin/env node

/**
 * Supabase Environment Setup Script
 * This script helps configure the required Supabase environment variables
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupSupabaseEnv() {
  console.log('🚀 ClueQuest Supabase Environment Setup\n');
  console.log('This script will help you configure your Supabase environment variables.\n');
  
  console.log('📋 Prerequisites:');
  console.log('1. Create a Supabase project at https://supabase.com');
  console.log('2. Get your project URL and API keys from the project settings\n');
  
  try {
    const supabaseUrl = await question('Enter your Supabase project URL (e.g., https://abc123.supabase.co): ');
    const anonKey = await question('Enter your Supabase anon/public key: ');
    const serviceRoleKey = await question('Enter your Supabase service_role key: ');
    
    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      console.log('\n❌ All fields are required. Please run the script again.');
      rl.close();
      return;
    }
    
    // Validate URL format
    if (!supabaseUrl.includes('supabase.co')) {
      console.log('\n❌ Invalid Supabase URL format. Should be like: https://abc123.supabase.co');
      rl.close();
      return;
    }
    
    // Read current .env.local file
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    } else {
      // Create from example if .env.local doesn't exist
      const examplePath = path.join(process.cwd(), '.env.local.example');
      if (fs.existsSync(examplePath)) {
        envContent = fs.readFileSync(examplePath, 'utf8');
      }
    }
    
    // Replace placeholder values
    let updatedContent = envContent
      .replace(/NEXT_PUBLIC_SUPABASE_URL=https:\/\/your-project\.supabase\.co/g, `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}`)
      .replace(/NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key/g, `NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`)
      .replace(/SUPABASE_SERVICE_ROLE_KEY=your_service_key/g, `SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`);
    
    // Write updated .env.local file
    fs.writeFileSync(envPath, updatedContent);
    
    console.log('\n✅ Environment variables configured successfully!');
    console.log(`📁 Updated: ${envPath}`);
    console.log('\n🔄 Next steps:');
    console.log('1. Restart your development server');
    console.log('2. Try creating an adventure again');
    console.log('\n🔍 To verify the setup, check that your .env.local file now contains:');
    console.log(`   NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}`);
    console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey.substring(0, 20)}...`);
    console.log(`   SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey.substring(0, 20)}...`);
    
  } catch (error) {
    console.error('\n❌ Error during setup:', error.message);
  } finally {
    rl.close();
  }
}

// Run the setup
setupSupabaseEnv();
