#!/usr/bin/env node
/**
 * Update package.json with comprehensive security scripts
 * Run this script to add all security-related npm scripts
 */

const fs = require('fs');
const path = require('path');

const packagePath = path.join(process.cwd(), 'package.json');

if (!fs.existsSync(packagePath)) {
  console.error('❌ package.json not found');
  process.exit(1);
}

// Create backup
const backupPath = `${packagePath}.backup.${Date.now()}`;
fs.copyFileSync(packagePath, backupPath);
console.log(`📁 Created backup: ${backupPath}`);

// Read current package.json
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Add comprehensive security scripts
const securityScripts = {
  // Security validation and hardening
  'security:validate': 'node scripts/security-validation.js',
  'security:harden': 'node scripts/security-hardening.js',
  'security:monitor': 'node scripts/security-monitor.js',
  
  // Penetration testing
  'security:pentest': 'node scripts/penetration-testing.js',
  'security:pentest:full': 'npm run security:validate && npm run security:pentest',
  
  // Compliance auditing
  'security:compliance': 'node scripts/compliance-audit.js',
  'security:soc2': 'node scripts/compliance-audit.js --framework=soc2',
  'security:gdpr': 'node scripts/compliance-audit.js --framework=gdpr',
  'security:owasp': 'node scripts/compliance-audit.js --framework=owasp',
  
  // Comprehensive security suite
  'security:full': 'npm run security:audit && npm run security:validate && npm run security:pentest && npm run security:compliance',
  
  // Production security checks
  'security:pre-deploy': 'npm run security:validate && npm run security:pentest',
  'security:post-deploy': 'npm run security:monitor && npm run security:compliance',
  
  // Development security workflows
  'security:dev': 'npm run security:validate && npm run security:monitor',
  'security:ci': 'npm run security:audit && npm run security:validate',
  
  // Security maintenance
  'security:update-deps': 'npm audit fix && npm update',
  'security:check-deps': 'npm audit --audit-level moderate',
  
  // Security documentation generation
  'security:docs': 'node scripts/generate-security-docs.js',
  'security:report': 'npm run security:full && node scripts/generate-security-report.js'
};

// Merge with existing scripts, avoiding duplicates
packageJson.scripts = { ...packageJson.scripts, ...securityScripts };

// Write updated package.json
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

console.log('✅ Successfully updated package.json with security scripts');
console.log('\n📋 Added Security Scripts:');
Object.keys(securityScripts).forEach(script => {
  console.log(`  • npm run ${script}`);
});

console.log('\n🚀 Quick Start Commands:');
console.log('• npm run security:validate - Validate current security configuration');
console.log('• npm run security:harden - Apply automatic security fixes');
console.log('• npm run security:full - Run complete security assessment');
console.log('• npm run security:pre-deploy - Pre-deployment security checks');

console.log('\n📚 Security Workflow:');
console.log('1. Development: npm run security:dev');
console.log('2. Before deployment: npm run security:pre-deploy');
console.log('3. After deployment: npm run security:post-deploy');
console.log('4. Regular maintenance: npm run security:full (weekly)');