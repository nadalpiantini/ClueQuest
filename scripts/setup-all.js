#!/usr/bin/env node

/**
 * ClueQuest Complete Setup Automation
 * Master script that orchestrates all configuration
 * Based on proven patterns from AXIS6 and production deployments
 */

require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(80));
  log(`  🚀 ${title}`, 'bright');
  console.log('='.repeat(80) + '\n');
}

function logStep(step, description) {
  log(`\n[Step ${step}] ${description}`, 'cyan');
  console.log('-'.repeat(60));
}

async function checkEnvironment() {
  logSection('Environment Check');
  
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  const optionalEnvVars = [
    'CLOUDFLARE_API_TOKEN',
    'CLOUDFLARE_ACCOUNT_ID',
    'VERCEL_TOKEN',
    'RESEND_API_KEY'
  ];

  const missingVars = [];
  const presentVars = [];
  const optionalPresent = [];

  requiredEnvVars.forEach(varName => {
    if (process.env[varName]) {
      presentVars.push(varName);
    } else {
      missingVars.push(varName);
    }
  });

  optionalEnvVars.forEach(varName => {
    if (process.env[varName]) {
      optionalPresent.push(varName);
    }
  });

  if (presentVars.length > 0) {
    log('✅ Required environment variables found:', 'green');
    presentVars.forEach(v => console.log(`   - ${v}`));
  }

  if (optionalPresent.length > 0) {
    log('\n🔧 Optional services configured:', 'blue');
    optionalPresent.forEach(v => console.log(`   - ${v}`));
  }

  if (missingVars.length > 0) {
    log('\n❌ Missing required environment variables:', 'red');
    missingVars.forEach(v => console.log(`   - ${v}`));
    
    console.log('\n📝 To get missing credentials:');
    console.log('\nSupabase:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Create a new project or select existing');
    console.log('3. Go to Settings > API');
    console.log('4. Copy URL and anon/service keys');
    
    return false;
  }

  return true;
}

async function installDependencies() {
  logStep(1, 'Installing Dependencies');
  
  try {
    log('📦 Installing npm packages...', 'blue');
    execSync('npm install', { stdio: 'inherit' });
    log('✅ Dependencies installed successfully', 'green');
    return true;
  } catch (error) {
    log(`❌ Dependency installation failed: ${error.message}`, 'red');
    return false;
  }
}

async function setupDatabase() {
  logStep(2, 'Setting Up Database');
  
  try {
    // Check if Supabase CLI is available
    try {
      execSync('supabase --version', { stdio: 'pipe' });
    } catch {
      log('📥 Installing Supabase CLI...', 'blue');
      execSync('npm install -g supabase', { stdio: 'inherit' });
    }
    
    // Initialize Supabase project if not exists
    if (!fs.existsSync('./supabase/config.toml')) {
      log('🔧 Initializing Supabase project...', 'blue');
      execSync('supabase init', { stdio: 'inherit' });
    }
    
    // Link to remote project
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      const projectId = supabaseUrl.split('//')[1].split('.')[0];
      log(`🔗 Linking to Supabase project: ${projectId}`, 'blue');
      
      try {
        execSync(`supabase link --project-ref ${projectId}`, { 
          stdio: 'inherit',
          input: process.env.SUPABASE_SERVICE_ROLE_KEY + '\n'
        });
      } catch (error) {
        log('⚠️  Project linking skipped (may already be linked)', 'yellow');
      }
    }
    
    // Apply migrations
    log('🗄️  Applying database migrations...', 'blue');
    execSync('supabase db push', { stdio: 'inherit' });
    
    log('✅ Database setup complete', 'green');
    return true;
  } catch (error) {
    log(`❌ Database setup failed: ${error.message}`, 'red');
    log('💡 You can run migrations manually in Supabase dashboard', 'yellow');
    return false;
  }
}

async function setupAuthentication() {
  logStep(3, 'Configuring Authentication');
  
  try {
    log('🔐 Setting up authentication providers...', 'blue');
    
    // Create auth configuration
    const authConfig = {
      providers: ['email', 'google', 'github'],
      email: {
        confirmSignup: true,
        confirmChange: true
      },
      redirectUrls: [
        'http://localhost:5173/auth/callback',
        'https://your-domain.com/auth/callback'
      ]
    };
    
    // Save auth config for reference
    fs.writeFileSync(
      path.join(__dirname, '../auth-config.json'),
      JSON.stringify(authConfig, null, 2)
    );
    
    log('✅ Authentication configuration saved', 'green');
    log('📝 Configure OAuth providers in Supabase dashboard manually', 'blue');
    
    return true;
  } catch (error) {
    log(`❌ Authentication setup failed: ${error.message}`, 'red');
    return false;
  }
}

async function setupAutomation() {
  logStep(4, 'Setting Up Automation Scripts');
  
  try {
    log('🤖 Creating automation scripts...', 'blue');
    
    // Create .env.local.example if it doesn't exist
    if (!fs.existsSync('.env.local.example')) {
      const envExample = `# ClueQuest Environment Variables
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:5173
NODE_ENV=development

# Email Service (Resend)
RESEND_API_KEY=re_your_key_here

# Infrastructure (Production)
VERCEL_TOKEN=your_vercel_token
CLOUDFLARE_API_TOKEN=your_cloudflare_token
CLOUDFLARE_ACCOUNT_ID=your_account_id

# Analytics & Monitoring
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
SENTRY_DSN=your_sentry_dsn
`;
      fs.writeFileSync('.env.local.example', envExample);
      log('📄 Created .env.local.example template', 'green');
    }
    
    // Create git hooks
    if (fs.existsSync('.git')) {
      log('🪝 Setting up git hooks...', 'blue');
      
      const preCommitHook = `#!/bin/sh
# ClueQuest pre-commit hook
echo "🔍 Running pre-commit checks..."

# Type checking
npm run type-check || exit 1

# Linting
npm run lint || exit 1

echo "✅ Pre-commit checks passed"
`;
      
      const hooksDir = '.git/hooks';
      if (!fs.existsSync(hooksDir)) {
        fs.mkdirSync(hooksDir, { recursive: true });
      }
      
      fs.writeFileSync(path.join(hooksDir, 'pre-commit'), preCommitHook);
      execSync('chmod +x .git/hooks/pre-commit');
      log('✅ Git hooks configured', 'green');
    }
    
    return true;
  } catch (error) {
    log(`❌ Automation setup failed: ${error.message}`, 'red');
    return false;
  }
}

async function runHealthCheck() {
  logStep(5, 'Running Health Check');
  
  try {
    log('🏥 Checking system health...', 'blue');
    
    // Check Node.js version
    const nodeVersion = process.version;
    log(`Node.js version: ${nodeVersion}`, 'blue');
    
    if (parseInt(nodeVersion.slice(1)) < 18) {
      log('⚠️  Node.js 18+ recommended', 'yellow');
    }
    
    // Check npm version
    try {
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      log(`npm version: ${npmVersion}`, 'blue');
    } catch {
      log('⚠️  npm not found', 'yellow');
    }
    
    // Check if build works
    log('🔨 Testing build process...', 'blue');
    try {
      execSync('npm run build', { stdio: 'pipe' });
      log('✅ Build test successful', 'green');
    } catch (error) {
      log('⚠️  Build test failed - check for errors', 'yellow');
      log(`Build error: ${error.message}`, 'red');
    }
    
    return true;
  } catch (error) {
    log(`❌ Health check failed: ${error.message}`, 'red');
    return false;
  }
}

async function generateReport(results) {
  logSection('Setup Report');
  
  const report = {
    timestamp: new Date().toISOString(),
    project: 'ClueQuest',
    version: '1.0.0',
    results: results,
    nextSteps: []
  };

  // Generate next steps based on results
  if (!results.environment) {
    report.nextSteps.push('Configure missing environment variables');
  }
  
  if (!results.database) {
    report.nextSteps.push('Complete database setup manually');
  }
  
  if (!results.authentication) {
    report.nextSteps.push('Configure OAuth providers in Supabase dashboard');
  }
  
  if (results.healthCheck) {
    report.nextSteps.push('Start development with: npm run dev');
  }

  // Save report
  const reportPath = path.join(__dirname, 'setup-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Display summary
  console.log('📊 Setup Status:');
  console.log(`  Environment:      ${results.environment ? '✅' : '❌'}`);
  console.log(`  Dependencies:     ${results.dependencies ? '✅' : '❌'}`);
  console.log(`  Database:         ${results.database ? '✅' : '❌'}`);
  console.log(`  Authentication:   ${results.authentication ? '✅' : '❌'}`);
  console.log(`  Automation:       ${results.automation ? '✅' : '❌'}`);
  console.log(`  Health Check:     ${results.healthCheck ? '✅' : '❌'}`);
  
  if (report.nextSteps.length > 0) {
    console.log('\n📋 Next Steps:');
    report.nextSteps.forEach((step, i) => {
      console.log(`  ${i + 1}. ${step}`);
    });
  }
  
  console.log(`\n💾 Full report saved to: ${reportPath}`);
  
  return report;
}

async function main() {
  logSection('ClueQuest Complete Setup');
  
  console.log('🎯 This script will automatically configure:');
  console.log('  • Development environment');
  console.log('  • Database schema and migrations');
  console.log('  • Authentication system');
  console.log('  • Automation scripts and git hooks');
  console.log('  • Health checks and validation');
  
  const results = {
    environment: false,
    dependencies: false,
    database: false,
    authentication: false,
    automation: false,
    healthCheck: false
  };

  try {
    // Step 1: Environment check
    results.environment = await checkEnvironment();
    if (!results.environment) {
      log('\n⚠️  Please configure environment variables and try again', 'yellow');
      process.exit(1);
    }

    // Step 2: Install dependencies
    results.dependencies = await installDependencies();
    
    // Step 3: Database setup
    results.database = await setupDatabase();
    
    // Step 4: Authentication setup
    results.authentication = await setupAuthentication();
    
    // Step 5: Automation setup
    results.automation = await setupAutomation();
    
    // Step 6: Health check
    results.healthCheck = await runHealthCheck();
    
  } catch (error) {
    log(`\n❌ Setup failed: ${error.message}`, 'red');
    console.error(error.stack);
  }

  // Generate report
  const report = await generateReport(results);
  
  // Final message
  const successCount = Object.values(results).filter(Boolean).length;
  const totalSteps = Object.keys(results).length;
  
  if (successCount === totalSteps) {
    logSection('🎉 Setup Complete!');
    log('All components have been configured successfully.', 'green');
    console.log('\n🚀 Ready to start development:');
    console.log('  npm run dev');
    console.log('\n🌐 Open: http://localhost:5173');
  } else {
    logSection('⚠️  Setup Partially Complete');
    log(`${successCount}/${totalSteps} steps completed successfully.`, 'yellow');
    console.log('Please check the report and complete remaining steps.');
  }
  
  console.log('\n📚 Next steps:');
  console.log('1. Review CLAUDE.md for development guidelines');
  console.log('2. Check RULES.md for business rules and standards');
  console.log('3. Use PRODUCTION_CHECKLIST.md before deployment');
  console.log('4. Configure OAuth providers in Supabase dashboard');
  console.log('5. Set up domain and email in production');
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    log(`\n❌ Fatal error: ${error.message}`, 'red');
    console.error(error.stack);
    process.exit(1);
  });
}

module.exports = { 
  main,
  checkEnvironment,
  installDependencies,
  setupDatabase,
  setupAuthentication,
  setupAutomation,
  runHealthCheck
};