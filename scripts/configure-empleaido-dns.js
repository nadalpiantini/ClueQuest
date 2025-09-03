#!/usr/bin/env node

/**
 * ClueQuest Empleaido DNS Configuration Script
 * Automated DNS setup for cluequest.empleaido.com
 * Based on proven patterns from AXIS6 and CINETWRK
 */

require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');
const fs = require('fs');
const https = require('https');
const dns = require('dns').promises;

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
  log(`  🌐 ${title}`, 'bright');
  console.log('='.repeat(80) + '\n');
}

// DNS Configuration for empleaido.com subdomain
const DNS_CONFIG = {
  domain: 'empleaido.com',
  subdomain: 'cluequest',
  fullDomain: 'cluequest.empleaido.com',
  records: {
    cname: {
      type: 'CNAME',
      name: 'cluequest',
      value: 'cname.vercel-dns.com',
      ttl: 300
    },
    a_record: {
      type: 'A',
      name: 'cluequest',
      value: '76.76.21.21', // Vercel's IP
      ttl: 300
    }
  }
};

async function checkDNSProvider() {
  logSection('DNS Provider Detection');
  
  try {
    // Check current nameservers for empleaido.com
    const nameservers = await dns.resolveNs('empleaido.com');
    
    log('📋 Current nameservers for empleaido.com:', 'blue');
    nameservers.forEach(ns => {
      console.log(`  • ${ns}`);
    });
    
    // Detect common DNS providers
    const provider = detectDNSProvider(nameservers);
    log(`🔍 Detected DNS provider: ${provider}`, 'cyan');
    
    return { nameservers, provider };
    
  } catch (error) {
    log(`❌ Could not resolve nameservers for empleaido.com`, 'red');
    log(`Error: ${error.message}`, 'red');
    return null;
  }
}

function detectDNSProvider(nameservers) {
  const providers = {
    'cloudflare': ['cloudflare.com', 'ns.cloudflare.com'],
    'namecheap': ['namecheap.com', 'registrar-servers.com'],
    'godaddy': ['domaincontrol.com', 'godaddy.com'],
    'route53': ['awsdns', 'amazon.com'],
    'digitalocean': ['digitalocean.com', 'ns.digitalocean.com'],
    'google': ['googledomains.com', 'ns-cloud'],
    'vercel': ['vercel-dns.com']
  };
  
  for (const [provider, patterns] of Object.entries(providers)) {
    if (nameservers.some(ns => 
      patterns.some(pattern => ns.toLowerCase().includes(pattern))
    )) {
      return provider;
    }
  }
  
  return 'unknown';
}

async function checkCurrentDNSRecords() {
  logSection('Current DNS Records Check');
  
  const checks = [];
  
  try {
    // Check if subdomain already exists
    try {
      const addresses = await dns.resolve4(DNS_CONFIG.fullDomain);
      checks.push({
        record: 'A Record',
        status: '✅ Exists',
        value: addresses.join(', ')
      });
    } catch {
      checks.push({
        record: 'A Record',
        status: '❌ Not found',
        value: 'None'
      });
    }
    
    // Check CNAME record
    try {
      const cnames = await dns.resolveCname(DNS_CONFIG.fullDomain);
      checks.push({
        record: 'CNAME Record',
        status: '✅ Exists',
        value: cnames.join(', ')
      });
    } catch {
      checks.push({
        record: 'CNAME Record',
        status: '❌ Not found',
        value: 'None'
      });
    }
    
    // Display results
    console.log(`🔍 DNS Records for ${DNS_CONFIG.fullDomain}:`);
    checks.forEach(check => {
      console.log(`  ${check.record}: ${check.status} (${check.value})`);
    });
    
    return checks;
    
  } catch (error) {
    log(`❌ DNS check failed: ${error.message}`, 'red');
    return [];
  }
}

async function generateDNSInstructions(provider) {
  logSection('DNS Configuration Instructions');
  
  const instructions = {
    cloudflare: {
      steps: [
        '1. Log into Cloudflare dashboard',
        '2. Select empleaido.com domain',
        '3. Go to DNS > Records',
        '4. Click "Add record"',
        '5. Configure as shown below'
      ],
      automation: 'Cloudflare API automation available'
    },
    namecheap: {
      steps: [
        '1. Log into Namecheap account',
        '2. Go to Domain List',
        '3. Click "Manage" for empleaido.com',
        '4. Go to Advanced DNS tab',
        '5. Add new record as shown below'
      ],
      automation: 'Manual configuration required'
    },
    godaddy: {
      steps: [
        '1. Log into GoDaddy account',
        '2. Go to My Products > DNS',
        '3. Find empleaido.com and click "Manage"',
        '4. Click "Add Record"',
        '5. Configure as shown below'
      ],
      automation: 'Manual configuration required'
    },
    unknown: {
      steps: [
        '1. Log into your DNS provider',
        '2. Find DNS management for empleaido.com',
        '3. Add new DNS record',
        '4. Configure as shown below'
      ],
      automation: 'Check provider documentation'
    }
  };
  
  const config = instructions[provider] || instructions.unknown;
  
  log(`📋 Configuration steps for ${provider}:`, 'cyan');
  config.steps.forEach(step => console.log(`  ${step}`));
  
  console.log('\n' + '─'.repeat(60));
  log('🎯 RECOMMENDED: CNAME Record (Preferred)', 'green');
  console.log('─'.repeat(60));
  console.log(`Type:     CNAME`);
  console.log(`Name:     ${DNS_CONFIG.records.cname.name}`);
  console.log(`Value:    ${DNS_CONFIG.records.cname.value}`);
  console.log(`TTL:      ${DNS_CONFIG.records.cname.ttl} seconds`);
  console.log(`Proxy:    OFF (DNS only) - if using Cloudflare`);
  
  console.log('\n' + '─'.repeat(60));
  log('🔄 ALTERNATIVE: A Record (Fallback)', 'yellow');
  console.log('─'.repeat(60));
  console.log(`Type:     A`);
  console.log(`Name:     ${DNS_CONFIG.records.a_record.name}`);
  console.log(`Value:    ${DNS_CONFIG.records.a_record.value}`);
  console.log(`TTL:      ${DNS_CONFIG.records.a_record.ttl} seconds`);
  
  console.log('\n💡 Notes:');
  console.log('  • CNAME is preferred as it automatically follows Vercel IP changes');
  console.log('  • Use A record only if CNAME is not supported');
  console.log('  • DNS propagation takes 5-15 minutes typically');
  console.log(`  • ${config.automation}`);
  
  return config;
}

async function waitForDNSPropagation(maxWaitMinutes = 15) {
  logSection('DNS Propagation Monitor');
  
  const maxAttempts = maxWaitMinutes * 2; // Check every 30 seconds
  let attempts = 0;
  
  log(`⏳ Monitoring DNS propagation for ${DNS_CONFIG.fullDomain}`, 'blue');
  log(`Maximum wait time: ${maxWaitMinutes} minutes\n`, 'yellow');
  
  const startTime = Date.now();
  
  while (attempts < maxAttempts) {
    attempts++;
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    
    try {
      // Check if domain resolves
      const addresses = await dns.resolve4(DNS_CONFIG.fullDomain);
      
      if (addresses && addresses.length > 0) {
        log(`✅ DNS propagation complete!`, 'green');
        log(`🌐 ${DNS_CONFIG.fullDomain} resolves to: ${addresses.join(', ')}`, 'cyan');
        log(`⏱️  Total time: ${elapsed} seconds`, 'blue');
        
        // Additional validation
        await validateDNSConfiguration();
        
        return true;
      }
      
    } catch (error) {
      // DNS not ready yet, continue waiting
    }
    
    // Progress indicator
    const progress = Math.round((attempts / maxAttempts) * 100);
    process.stdout.write(`\r⏳ Checking... ${elapsed}s elapsed (${progress}%)`);
    
    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
  }
  
  console.log(); // New line after progress indicator
  log(`⚠️  DNS propagation not detected within ${maxWaitMinutes} minutes`, 'yellow');
  log(`This is normal and may take longer. The site should be accessible soon.`, 'yellow');
  
  return false;
}

async function validateDNSConfiguration() {
  log('\n🔍 Validating DNS configuration...', 'blue');
  
  try {
    // Test HTTPS access
    const testUrl = `https://${DNS_CONFIG.fullDomain}`;
    
    return new Promise((resolve) => {
      const req = https.get(testUrl, { timeout: 10000 }, (res) => {
        if (res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302) {
          log(`✅ HTTPS access successful (${res.statusCode})`, 'green');
          resolve(true);
        } else {
          log(`⚠️  HTTP response: ${res.statusCode}`, 'yellow');
          resolve(false);
        }
      });
      
      req.on('error', (error) => {
        log(`⚠️  HTTPS not ready yet: ${error.message}`, 'yellow');
        resolve(false);
      });
      
      req.on('timeout', () => {
        log(`⚠️  Connection timeout - may still be propagating`, 'yellow');
        resolve(false);
      });
    });
    
  } catch (error) {
    log(`⚠️  Validation error: ${error.message}`, 'yellow');
    return false;
  }
}

function generateDNSReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    domain: DNS_CONFIG.fullDomain,
    provider: results.provider || 'unknown',
    current_records: results.currentRecords || [],
    recommended_config: DNS_CONFIG.records,
    propagation_status: results.propagationComplete || false,
    next_steps: []
  };
  
  if (results.propagationComplete) {
    report.next_steps = [
      '✅ DNS configuration complete',
      '🚀 Deploy site with: npm run deploy:empleaido',
      '🔍 Monitor site performance',
      '📧 Test early access form functionality'
    ];
  } else {
    report.next_steps = [
      '📋 Configure DNS records as instructed above',
      '⏳ Wait for DNS propagation (5-15 minutes)',
      '🔍 Check site accessibility manually',
      '🚀 Proceed with deployment once DNS is ready'
    ];
  }
  
  // Save report
  const reportPath = 'dns-configuration-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  return report;
}

async function main() {
  logSection('ClueQuest Empleaido DNS Setup');
  
  console.log(`🎯 Configuring DNS for: ${DNS_CONFIG.fullDomain}`);
  console.log('\nThis will:');
  console.log('  • Detect your current DNS provider');
  console.log('  • Check existing DNS records');
  console.log('  • Provide step-by-step configuration instructions');
  console.log('  • Monitor DNS propagation status\n');
  
  const results = {};
  
  try {
    // Step 1: Check DNS provider
    const providerInfo = await checkDNSProvider();
    if (providerInfo) {
      results.provider = providerInfo.provider;
      results.nameservers = providerInfo.nameservers;
    }
    
    // Step 2: Check current DNS records
    results.currentRecords = await checkCurrentDNSRecords();
    
    // Step 3: Generate configuration instructions
    await generateDNSInstructions(results.provider);
    
    // Step 4: Ask user if they want to monitor propagation
    console.log('\n' + '─'.repeat(60));
    log('🤔 Next Steps:', 'cyan');
    console.log('\n1. Configure DNS records using the instructions above');
    console.log('2. Run this script again with --monitor flag to check propagation');
    console.log('3. Or wait and run: npm run deploy:empleaido\n');
    
    // Check if monitoring was requested
    const shouldMonitor = process.argv.includes('--monitor') || 
                         process.argv.includes('--wait') ||
                         process.argv.includes('--watch');
    
    if (shouldMonitor) {
      console.log('⏳ Starting DNS propagation monitoring...\n');
      results.propagationComplete = await waitForDNSPropagation();
    }
    
  } catch (error) {
    log(`❌ DNS configuration failed: ${error.message}`, 'red');
    console.error(error.stack);
  }
  
  // Generate report
  const report = generateDNSReport(results);
  
  // Final status
  logSection('📋 DNS Configuration Summary');
  
  console.log(`Domain: ${DNS_CONFIG.fullDomain}`);
  console.log(`Provider: ${results.provider || 'Unknown'}`);
  console.log(`Status: ${results.propagationComplete ? '✅ Ready' : '⏳ Pending configuration'}`);
  
  console.log('\n🌐 Next Steps:');
  report.next_steps.forEach((step, i) => {
    console.log(`  ${i + 1}. ${step}`);
  });
  
  console.log(`\n📊 Full report: dns-configuration-report.json`);
  
  if (results.propagationComplete) {
    console.log('\n🎉 DNS is ready! You can now deploy ClueQuest.');
  } else {
    console.log('\n💡 Run with --monitor flag to watch for DNS propagation:');
    console.log('   npm run setup:dns -- --monitor');
  }
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
  checkDNSProvider, 
  checkCurrentDNSRecords,
  waitForDNSPropagation,
  DNS_CONFIG
};