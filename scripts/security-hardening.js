#!/usr/bin/env node
/**
 * ClueQuest Security Hardening Script
 * Automatically applies security fixes and configurations
 * 
 * Usage: npm run security:harden
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class SecurityHardening {
  constructor() {
    this.fixes = [];
    this.backups = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : '🔧';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  createBackup(filePath) {
    const backupPath = `${filePath}.backup.${Date.now()}`;
    fs.copyFileSync(filePath, backupPath);
    this.backups.push(backupPath);
    this.log(`Created backup: ${backupPath}`);
    return backupPath;
  }

  // Fix 1: Remove environment variable exposure from next.config.js
  fixNextConfigExposure() {
    this.log('🔧 Fixing environment variable exposure in next.config.js...');
    
    const configPath = path.join(process.cwd(), 'next.config.js');
    if (!fs.existsSync(configPath)) {
      this.log('next.config.js not found', 'warning');
      return;
    }
    
    this.createBackup(configPath);
    let content = fs.readFileSync(configPath, 'utf8');
    
    // Remove env section that exposes environment variables
    const envSectionRegex = /,?\s*\/\/ Environment variables validation\s*env:\s*{\s*[\s\S]*?\s*},?\s*/;
    if (content.match(envSectionRegex)) {
      content = content.replace(envSectionRegex, '');
      
      // Clean up any trailing commas
      content = content.replace(/,(\s*})/g, '$1');
      
      fs.writeFileSync(configPath, content);
      this.fixes.push('Removed environment variable exposure from next.config.js');
      this.log('Fixed environment variable exposure in next.config.js', 'success');
    } else {
      this.log('No environment variable exposure found in next.config.js');
    }
  }

  // Fix 2: Implement actual rate limiting in middleware
  implementRateLimiting() {
    this.log('🔧 Implementing rate limiting in middleware...');
    
    const middlewarePath = path.join(process.cwd(), 'src', 'middleware.ts');
    if (!fs.existsSync(middlewarePath)) {
      this.log('middleware.ts not found', 'error');
      return;
    }
    
    this.createBackup(middlewarePath);
    let content = fs.readFileSync(middlewarePath, 'utf8');
    
    // Add rate limiting implementation
    const rateLimitingCode = `
// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map();

// Rate limiting function
function rateLimit(ip: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Clean old entries
  for (const [key, timestamps] of rateLimitStore.entries()) {
    rateLimitStore.set(key, timestamps.filter((t: number) => t > windowStart));
    if (rateLimitStore.get(key).length === 0) {
      rateLimitStore.delete(key);
    }
  }
  
  // Check current IP
  const requests = rateLimitStore.get(ip) || [];
  const recentRequests = requests.filter((t: number) => t > windowStart);
  
  if (recentRequests.length >= limit) {
    return false; // Rate limit exceeded
  }
  
  recentRequests.push(now);
  rateLimitStore.set(ip, recentRequests);
  return true; // Within rate limit
}`;

    // Insert rate limiting code after imports
    const importEndIndex = content.lastIndexOf("import");
    const nextLineIndex = content.indexOf('\n', importEndIndex);
    content = content.slice(0, nextLineIndex + 1) + rateLimitingCode + '\n' + content.slice(nextLineIndex + 1);
    
    // Replace static rate limit headers with dynamic implementation
    const rateLimitHeadersRegex = /\/\/ Rate limiting headers \(informational\)[\s\S]*?response\.headers\.set\('X-RateLimit-Remaining', '999'\)/;
    
    const dynamicRateLimitHeaders = `// Rate limiting implementation
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1';
  
  const isWithinLimit = rateLimit(clientIp, 100, 60000); // 100 requests per minute
  
  if (!isWithinLimit) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', message: 'Too many requests. Please try again later.' },
      { status: 429, headers: response.headers }
    );
  }
  
  // Set actual rate limit headers
  const currentRequests = rateLimitStore.get(clientIp) || [];
  response.headers.set('X-RateLimit-Limit', '100');
  response.headers.set('X-RateLimit-Remaining', String(100 - currentRequests.length));
  response.headers.set('X-RateLimit-Reset', String(Date.now() + 60000));`;

    if (content.match(rateLimitHeadersRegex)) {
      content = content.replace(rateLimitHeadersRegex, dynamicRateLimitHeaders);
      this.fixes.push('Implemented actual rate limiting in middleware');
      this.log('Implemented rate limiting in middleware', 'success');
    } else {
      this.log('Rate limiting section not found in middleware', 'warning');
    }
    
    fs.writeFileSync(middlewarePath, content);
  }

  // Fix 3: Strengthen CSP headers
  strengthenCSPHeaders() {
    this.log('🔧 Strengthening Content Security Policy headers...');
    
    const middlewarePath = path.join(process.cwd(), 'src', 'middleware.ts');
    if (!fs.existsSync(middlewarePath)) {
      this.log('middleware.ts not found', 'error');
      return;
    }
    
    let content = fs.readFileSync(middlewarePath, 'utf8');
    
    // Updated CSP with stricter policies
    const stricterCSP = `const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' https://*.supabase.co https://vercel.live https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vercel.live https://vitals.vercel-insights.com",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ')`;

    // Replace existing CSP
    const cspRegex = /const csp = \[[\s\S]*?\]\.join\('; '\)/;
    if (content.match(cspRegex)) {
      content = content.replace(cspRegex, stricterCSP);
      this.fixes.push('Strengthened Content Security Policy headers');
      this.log('Strengthened CSP headers', 'success');
    } else {
      this.log('CSP section not found in middleware', 'warning');
    }
    
    fs.writeFileSync(middlewarePath, content);
  }

  // Fix 4: Add HMAC secret validation
  addHMACSecretValidation() {
    this.log('🔧 Adding HMAC secret validation...');
    
    const qrSecurityPath = path.join(process.cwd(), 'src', 'lib', 'services', 'qr-security.ts');
    if (!fs.existsSync(qrSecurityPath)) {
      this.log('QR security service not found', 'error');
      return;
    }
    
    this.createBackup(qrSecurityPath);
    let content = fs.readFileSync(qrSecurityPath, 'utf8');
    
    // Replace fallback secret with proper validation
    const constructorRegex = /constructor\(\) \{[\s\S]*?if \(this\.hmacSecret === 'fallback-secret-change-in-production'\) \{[\s\S]*?\}\s*\}/;
    
    const secureConstructor = `constructor() {
    // Require HMAC secret in production
    if (process.env.NODE_ENV === 'production' && !process.env.QR_HMAC_SECRET) {
      throw new Error('QR_HMAC_SECRET environment variable is required in production');
    }
    
    this.hmacSecret = process.env.QR_HMAC_SECRET || process.env.JWT_SECRET;
    
    if (!this.hmacSecret) {
      throw new Error('No HMAC secret available. Set QR_HMAC_SECRET or JWT_SECRET environment variable');
    }
    
    if (this.hmacSecret.length < 32) {
      console.warn('⚠️ HMAC secret is shorter than recommended 32 characters');
    }
    
    this.defaultConfig = {
      expirationMinutes: 60,
      proximityToleranceMeters: 50,
      maxScansPerUser: 1,
      rateLimitWindowSeconds: 60,
      enableLocationValidation: true,
      enableDeviceFingerprinting: true
    };
  }`;

    if (content.match(constructorRegex)) {
      content = content.replace(constructorRegex, secureConstructor);
      this.fixes.push('Added HMAC secret validation with mandatory production requirement');
      this.log('Added HMAC secret validation', 'success');
    } else {
      this.log('QR Security constructor not found for modification', 'warning');
    }
    
    fs.writeFileSync(qrSecurityPath, content);
  }

  // Fix 5: Generate secure environment template
  generateSecureEnvTemplate() {
    this.log('🔧 Generating secure environment template...');
    
    const envTemplatePath = path.join(process.cwd(), '.env.local.example');
    const secureEnvTemplatePath = path.join(process.cwd(), '.env.production.template');
    
    const productionEnvTemplate = `# ClueQuest Production Environment Variables
# Copy this file to .env.local and fill in your actual values
# SECURITY: Never commit actual secrets to version control

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id

# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Email Service (Required for notifications)
RESEND_API_KEY=re_your_key_here

# Security Secrets (CRITICAL - Generate strong secrets)
# Generate with: openssl rand -hex 32
QR_HMAC_SECRET=your_64_character_hmac_secret_here
JWT_SECRET=your_64_character_jwt_secret_here

# Infrastructure (Production)
VERCEL_TOKEN=your_vercel_token
CLOUDFLARE_API_TOKEN=your_cloudflare_token
CLOUDFLARE_ACCOUNT_ID=your_account_id

# Domain Configuration
PRODUCTION_DOMAIN=your-domain.com

# Monitoring (Optional)
SENTRY_DSN=your_sentry_dsn

# Security Configuration
SECURITY_RATE_LIMIT_REQUESTS_PER_MINUTE=100
SECURITY_SESSION_TIMEOUT_HOURS=24
SECURITY_MAX_LOGIN_ATTEMPTS=5

# IMPORTANT SECURITY NOTES:
# 1. Generate unique, random secrets for QR_HMAC_SECRET and JWT_SECRET
# 2. Use secrets at least 32 characters long
# 3. Never use default or example values in production
# 4. Rotate secrets regularly (quarterly recommended)
# 5. Use different secrets for different environments (dev/staging/prod)
`;

    fs.writeFileSync(secureEnvTemplatePath, productionEnvTemplate);
    this.fixes.push('Generated secure production environment template');
    this.log('Generated secure environment template at .env.production.template', 'success');
  }

  // Fix 6: Add security middleware for API routes
  addSecurityMiddleware() {
    this.log('🔧 Adding security middleware for API routes...');
    
    const securityMiddlewarePath = path.join(process.cwd(), 'src', 'lib', 'security', 'api-middleware.ts');
    const securityDir = path.dirname(securityMiddlewarePath);
    
    if (!fs.existsSync(securityDir)) {
      fs.mkdirSync(securityDir, { recursive: true });
    }
    
    const securityMiddlewareCode = `/**
 * Security Middleware for API Routes
 * Provides request validation, rate limiting, and security headers
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Request rate limiting store
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export interface SecurityOptions {
  requireAuth?: boolean;
  rateLimit?: {
    requests: number;
    window: number; // milliseconds
  };
  validateOrigin?: boolean;
  requireAPIKey?: boolean;
}

export async function withSecurity(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: SecurityOptions = {}
): Promise<NextResponse> {
  const {
    requireAuth = true,
    rateLimit = { requests: 100, window: 60000 }, // 100 requests per minute
    validateOrigin = true,
    requireAPIKey = false
  } = options;

  try {
    // 1. Rate Limiting
    const clientIp = getClientIp(request);
    if (!checkRateLimit(clientIp, rateLimit)) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.'
        },
        { status: 429 }
      );
    }

    // 2. Origin Validation
    if (validateOrigin && !isValidOrigin(request)) {
      return NextResponse.json(
        { 
          error: 'Invalid origin',
          message: 'Request origin not allowed'
        },
        { status: 403 }
      );
    }

    // 3. API Key Validation
    if (requireAPIKey && !await isValidAPIKey(request)) {
      return NextResponse.json(
        {
          error: 'Invalid API key',
          message: 'Valid API key required'
        },
        { status: 401 }
      );
    }

    // 4. Authentication Check
    if (requireAuth && !await isAuthenticated(request)) {
      return NextResponse.json(
        {
          error: 'Authentication required',
          message: 'Valid authentication required'
        },
        { status: 401 }
      );
    }

    // 5. Execute the handler
    const response = await handler(request);

    // 6. Add security headers
    addSecurityHeaders(response);

    return response;

  } catch (error) {
    console.error('Security middleware error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] ||
         request.headers.get('x-real-ip') ||
         '127.0.0.1';
}

function checkRateLimit(ip: string, limit: { requests: number; window: number }): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + limit.window });
    return true;
  }

  if (record.count >= limit.requests) {
    return false;
  }

  record.count++;
  return true;
}

function isValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true; // Allow requests without origin header (like mobile apps)

  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:5173',
    'http://localhost:3000'
  ].filter(Boolean);

  return allowedOrigins.some(allowed => origin.startsWith(allowed!));
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    return !error && !!user;
  } catch {
    return false;
  }
}

async function isValidAPIKey(request: NextRequest): Promise<boolean> {
  const apiKey = request.headers.get('x-api-key');
  if (!apiKey) return false;

  try {
    const supabase = await createClient();
    
    // Hash the provided API key
    const encoder = new TextEncoder();
    const data = encoder.encode(apiKey);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const keyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Verify against stored hash
    const { data: apiKeyData, error } = await supabase
      .from('cluequest_api_keys')
      .select('id, organization_id, expires_at')
      .eq('key_hash', keyHash)
      .eq('is_active', true)
      .single();
    
    if (error || !apiKeyData) return false;
    
    // Check expiration
    if (apiKeyData.expires_at && new Date(apiKeyData.expires_at) < new Date()) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

function addSecurityHeaders(response: NextResponse): void {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

// Helper function for common API security patterns
export function secureApiRoute(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: SecurityOptions = {}
) {
  return async (request: NextRequest) => {
    return withSecurity(request, handler, options);
  };
}
`;

    fs.writeFileSync(securityMiddlewarePath, securityMiddlewareCode);
    this.fixes.push('Added comprehensive security middleware for API routes');
    this.log('Added security middleware at src/lib/security/api-middleware.ts', 'success');
  }

  // Fix 7: Create security monitoring script
  createSecurityMonitoring() {
    this.log('🔧 Creating security monitoring script...');
    
    const monitoringPath = path.join(process.cwd(), 'scripts', 'security-monitor.js');
    
    const monitoringCode = `#!/usr/bin/env node
/**
 * ClueQuest Security Monitoring
 * Monitors security events and generates alerts
 */

const { createClient } = require('@supabase/supabase-js');

class SecurityMonitor {
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }

  async monitorSuspiciousActivity() {
    console.log('🔍 Monitoring suspicious activity...');
    
    // Check for high-risk QR scans
    const { data: suspiciousScans } = await this.supabase
      .from('cluequest_qr_scans')
      .select('*')
      .eq('is_suspicious', true)
      .gte('scanned_at', new Date(Date.now() - 3600000).toISOString()); // Last hour
    
    if (suspiciousScans && suspiciousScans.length > 0) {
      console.log(\`⚠️ Found \${suspiciousScans.length} suspicious QR scans in the last hour\`);
      // In production, send alerts to monitoring system
    }
    
    // Check for failed login attempts
    const { data: auditLogs } = await this.supabase
      .from('cluequest_audit_logs')
      .select('*')
      .eq('action', 'login_failed')
      .gte('created_at', new Date(Date.now() - 3600000).toISOString());
    
    if (auditLogs && auditLogs.length > 10) {
      console.log(\`🚨 HIGH: \${auditLogs.length} failed login attempts in the last hour\`);
    }
  }

  async generateSecurityReport() {
    console.log('📊 Generating security report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      fraud_incidents: await this.getFraudIncidents(),
      security_incidents: await this.getSecurityIncidents(),
      unusual_patterns: await this.getUnusualPatterns()
    };
    
    console.log('Security Report:', JSON.stringify(report, null, 2));
    return report;
  }

  async getFraudIncidents() {
    const { data } = await this.supabase
      .from('cluequest_fraud_incidents')
      .select('*')
      .gte('detected_at', new Date(Date.now() - 86400000).toISOString()) // Last 24 hours
      .order('detected_at', { ascending: false });
    
    return data || [];
  }

  async getSecurityIncidents() {
    const { data } = await this.supabase
      .from('cluequest_security_incidents')
      .select('*')
      .gte('detected_at', new Date(Date.now() - 86400000).toISOString())
      .order('detected_at', { ascending: false });
    
    return data || [];
  }

  async getUnusualPatterns() {
    // Check for unusual activity patterns
    const patterns = [];
    
    // Multiple logins from different locations
    const { data: locationChanges } = await this.supabase
      .from('cluequest_audit_logs')
      .select('user_id, ip_address')
      .eq('action', 'user_login')
      .gte('created_at', new Date(Date.now() - 3600000).toISOString());
    
    // Group by user and check for multiple IPs
    const userIPs = {};
    locationChanges?.forEach(log => {
      if (!userIPs[log.user_id]) userIPs[log.user_id] = new Set();
      userIPs[log.user_id].add(log.ip_address);
    });
    
    Object.entries(userIPs).forEach(([userId, ips]) => {
      if (ips.size > 3) {
        patterns.push({
          type: 'multiple_ip_login',
          user_id: userId,
          ip_count: ips.size,
          severity: 'medium'
        });
      }
    });
    
    return patterns;
  }
}

// Run monitoring if called directly
if (require.main === module) {
  const monitor = new SecurityMonitor();
  
  (async () => {
    try {
      await monitor.monitorSuspiciousActivity();
      await monitor.generateSecurityReport();
    } catch (error) {
      console.error('Security monitoring failed:', error);
      process.exit(1);
    }
  })();
}

module.exports = SecurityMonitor;
`;

    fs.writeFileSync(monitoringPath, monitoringCode);
    this.fixes.push('Created security monitoring script');
    this.log('Created security monitoring script at scripts/security-monitor.js', 'success');
  }

  // Fix 8: Update package.json scripts
  updatePackageScripts() {
    this.log('🔧 Updating package.json security scripts...');
    
    const packagePath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packagePath)) {
      this.log('package.json not found', 'error');
      return;
    }
    
    this.createBackup(packagePath);
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Add security scripts
    const securityScripts = {
      'security:validate': 'node scripts/security-validation.js',
      'security:harden': 'node scripts/security-hardening.js',
      'security:monitor': 'node scripts/security-monitor.js',
      'security:audit': 'npm audit --audit-level moderate',
      'security:full': 'npm run security:audit && npm run security:validate && npm run security:monitor'
    };
    
    packageJson.scripts = { ...packageJson.scripts, ...securityScripts };
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    this.fixes.push('Added security scripts to package.json');
    this.log('Updated package.json with security scripts', 'success');
  }

  // Main hardening process
  async runHardening() {
    console.log('🔒 ClueQuest Security Hardening Starting...\n');
    
    try {
      // Create backups directory
      const backupDir = path.join(process.cwd(), 'security-backups');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
      }
      
      // Apply all fixes
      this.fixNextConfigExposure();
      this.implementRateLimiting();
      this.strengthenCSPHeaders();
      this.addHMACSecretValidation();
      this.generateSecureEnvTemplate();
      this.addSecurityMiddleware();
      this.createSecurityMonitoring();
      this.updatePackageScripts();
      
      // Generate summary report
      const report = {
        timestamp: new Date().toISOString(),
        fixes_applied: this.fixes,
        backups_created: this.backups,
        next_steps: [
          'Run security validation: npm run security:validate',
          'Generate secure secrets for production environment',
          'Configure monitoring alerts in production',
          'Test all security features in staging environment',
          'Review and customize CSP headers for your specific needs'
        ]
      };
      
      const reportPath = path.join(process.cwd(), 'security-hardening-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      
      console.log('\n✅ SECURITY HARDENING COMPLETE');
      console.log('════════════════════════════════');
      console.log(\`🔧 Fixes Applied: \${this.fixes.length}\`);
      console.log(\`📁 Backups Created: \${this.backups.length}\`);
      console.log(\`📄 Report Saved: \${reportPath}\`);
      
      console.log('\\n📋 NEXT STEPS:');
      report.next_steps.forEach((step, index) => {
        console.log(\`\${index + 1}. \${step}\`);
      });
      
      console.log('\\n⚠️ IMPORTANT:');
      console.log('- Generate strong secrets for QR_HMAC_SECRET and JWT_SECRET');
      console.log('- Test all functionality after security hardening');
      console.log('- Run security validation before production deployment');
      
    } catch (error) {
      console.error('❌ Security hardening failed:', error.message);
      process.exit(1);
    }
  }
}

// Run hardening if called directly
if (require.main === module) {
  const hardening = new SecurityHardening();
  hardening.runHardening().catch(error => {
    console.error('Fatal error during security hardening:', error);
    process.exit(1);
  });
}

module.exports = SecurityHardening;