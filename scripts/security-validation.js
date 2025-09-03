#!/usr/bin/env node
/**
 * ClueQuest Security Validation Script
 * Comprehensive security checks for production deployment
 * 
 * Usage: npm run security:validate
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class SecurityValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = [];
    this.criticalCount = 0;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  addError(message, severity = 'high') {
    this.errors.push({ message, severity, timestamp: new Date() });
    if (severity === 'critical') this.criticalCount++;
    this.log(message, 'error');
  }

  addWarning(message) {
    this.warnings.push({ message, timestamp: new Date() });
    this.log(message, 'warning');
  }

  addPassed(message) {
    this.passed.push({ message, timestamp: new Date() });
    this.log(message, 'info');
  }

  // 1. Environment Variable Security
  validateEnvironmentVariables() {
    this.log('🔍 Validating Environment Variables...');
    
    // Check for required environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY'
    ];

    const productionEnvVars = [
      'QR_HMAC_SECRET',
      'JWT_SECRET',
      'RESEND_API_KEY'
    ];

    // Check if .env.local exists
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
      this.addWarning('.env.local file not found - using environment variables');
    }

    // Validate required variables
    requiredEnvVars.forEach(varName => {
      if (!process.env[varName]) {
        this.addError(`Missing required environment variable: ${varName}`, 'critical');
      } else {
        this.addPassed(`Required environment variable present: ${varName}`);
      }
    });

    // Check for fallback secrets in production
    if (process.env.NODE_ENV === 'production') {
      productionEnvVars.forEach(varName => {
        if (!process.env[varName]) {
          this.addError(`Missing production environment variable: ${varName}`, 'critical');
        } else {
          // Check if it's not a default/weak value
          const value = process.env[varName];
          if (value.includes('fallback') || value.includes('change') || value.length < 32) {
            this.addError(`Weak/default value for ${varName} in production`, 'critical');
          } else {
            this.addPassed(`Production environment variable secure: ${varName}`);
          }
        }
      });
    }

    // Check for exposed secrets in client-side code
    this.checkClientSideExposure();
  }

  checkClientSideExposure() {
    this.log('🔍 Checking for client-side secret exposure...');
    
    // Check next.config.js for environment variable exposure
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    if (fs.existsSync(nextConfigPath)) {
      const configContent = fs.readFileSync(nextConfigPath, 'utf8');
      
      // Look for env section that might expose secrets
      if (configContent.includes('env:') && configContent.includes('process.env')) {
        const envMatches = configContent.match(/env:\s*{[\s\S]*?}/);
        if (envMatches) {
          const envSection = envMatches[0];
          
          // Check if non-NEXT_PUBLIC variables are exposed
          const dangerousExposures = envSection.match(/[\w_]+(?<!NEXT_PUBLIC_[\w_]+):\s*process\.env\.[\w_]+/g);
          if (dangerousExposures) {
            this.addError('Environment variables exposed to client-side in next.config.js', 'critical');
            dangerousExposures.forEach(exposure => {
              this.addError(`  - ${exposure}`);
            });
          } else {
            this.addPassed('No dangerous environment variable exposure in next.config.js');
          }
        }
      }
    }
  }

  // 2. API Security Validation
  validateApiSecurity() {
    this.log('🔍 Validating API Security...');
    
    // Check middleware implementation
    const middlewarePath = path.join(process.cwd(), 'src', 'middleware.ts');
    if (fs.existsSync(middlewarePath)) {
      const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
      
      // Check for rate limiting implementation
      if (middlewareContent.includes('X-RateLimit-Limit') && middlewareContent.includes('999')) {
        this.addError('Rate limiting is only informational - not actually implemented', 'high');
      }
      
      // Check for proper API key validation
      if (middlewareContent.includes('validateApiKey')) {
        this.addPassed('API key validation function present');
      } else {
        this.addWarning('API key validation may not be implemented');
      }
      
      // Check for security headers
      const securityHeaders = [
        'Content-Security-Policy',
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Strict-Transport-Security'
      ];
      
      securityHeaders.forEach(header => {
        if (middlewareContent.includes(header)) {
          this.addPassed(`Security header implemented: ${header}`);
        } else {
          this.addWarning(`Security header missing: ${header}`);
        }
      });
    } else {
      this.addError('Middleware file not found', 'high');
    }
  }

  // 3. Database Security Validation
  validateDatabaseSecurity() {
    this.log('🔍 Validating Database Security...');
    
    // Check migration files for RLS policies
    const migrationDir = path.join(process.cwd(), 'supabase', 'migrations');
    if (fs.existsSync(migrationDir)) {
      const migrationFiles = fs.readdirSync(migrationDir).filter(f => f.endsWith('.sql'));
      
      let hasRLS = false;
      let hasPolicies = false;
      
      migrationFiles.forEach(file => {
        const content = fs.readFileSync(path.join(migrationDir, file), 'utf8');
        
        if (content.includes('ENABLE ROW LEVEL SECURITY')) {
          hasRLS = true;
        }
        
        if (content.includes('CREATE POLICY')) {
          hasPolicies = true;
        }
      });
      
      if (hasRLS) {
        this.addPassed('Row Level Security (RLS) enabled in database schema');
      } else {
        this.addError('Row Level Security (RLS) not found in database schema', 'critical');
      }
      
      if (hasPolicies) {
        this.addPassed('Security policies found in database schema');
      } else {
        this.addError('No security policies found in database schema', 'critical');
      }
    } else {
      this.addWarning('Database migration directory not found');
    }
  }

  // 4. QR Security System Validation
  validateQRSecurity() {
    this.log('🔍 Validating QR Security System...');
    
    const qrSecurityPath = path.join(process.cwd(), 'src', 'lib', 'services', 'qr-security.ts');
    if (fs.existsSync(qrSecurityPath)) {
      const qrContent = fs.readFileSync(qrSecurityPath, 'utf8');
      
      // Check for fallback secret usage
      if (qrContent.includes('fallback-secret-change-in-production')) {
        this.addError('QR Security using fallback HMAC secret', 'critical');
      }
      
      // Check for HMAC implementation
      if (qrContent.includes('createHmac') && qrContent.includes('timingSafeEqual')) {
        this.addPassed('HMAC signature validation properly implemented');
      } else {
        this.addError('HMAC signature validation not properly implemented', 'high');
      }
      
      // Check for fraud detection features
      const fraudFeatures = [
        'fraud_indicators',
        'risk_score',
        'location_validation',
        'rate_limiting'
      ];
      
      fraudFeatures.forEach(feature => {
        if (qrContent.includes(feature)) {
          this.addPassed(`QR fraud detection feature present: ${feature}`);
        } else {
          this.addWarning(`QR fraud detection feature missing: ${feature}`);
        }
      });
    } else {
      this.addError('QR Security service not found', 'high');
    }
  }

  // 5. Input Validation Security
  validateInputSecurity() {
    this.log('🔍 Validating Input Security...');
    
    // Check for Zod validation usage
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      if (packageJson.dependencies && packageJson.dependencies.zod) {
        this.addPassed('Zod validation library present');
      } else {
        this.addError('Input validation library (Zod) not found', 'high');
      }
    }
    
    // Look for validation schemas in API routes
    const apiDir = path.join(process.cwd(), 'src', 'app', 'api');
    if (fs.existsSync(apiDir)) {
      this.checkApiValidation(apiDir);
    }
  }

  checkApiValidation(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    files.forEach(file => {
      if (file.isDirectory()) {
        this.checkApiValidation(path.join(dir, file.name));
      } else if (file.name.endsWith('.ts') || file.name.endsWith('.js')) {
        const filePath = path.join(dir, file.name);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for validation schemas
        if (content.includes('z.object') || content.includes('.parse(')) {
          this.addPassed(`Input validation found in API route: ${filePath.replace(process.cwd(), '')}`);
        }
      }
    });
  }

  // 6. Authentication Security
  validateAuthSecurity() {
    this.log('🔍 Validating Authentication Security...');
    
    // Check Supabase client configuration
    const clientPath = path.join(process.cwd(), 'src', 'lib', 'supabase', 'client.ts');
    if (fs.existsSync(clientPath)) {
      const content = fs.readFileSync(clientPath, 'utf8');
      
      // Check for PKCE flow
      if (content.includes('flowType: \'pkce\'')) {
        this.addPassed('PKCE flow enabled for enhanced security');
      } else {
        this.addWarning('PKCE flow not explicitly enabled');
      }
      
      // Check for secure session storage
      if (content.includes('persistSession: true')) {
        this.addPassed('Session persistence configured');
      }
      
      // Check for token refresh
      if (content.includes('autoRefreshToken: true')) {
        this.addPassed('Automatic token refresh enabled');
      }
    }
  }

  // 7. Generate Security Report
  generateReport() {
    this.log('📊 Generating Security Report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      summary: {
        total_checks: this.errors.length + this.warnings.length + this.passed.length,
        critical_errors: this.criticalCount,
        total_errors: this.errors.length,
        warnings: this.warnings.length,
        passed: this.passed.length,
        security_score: this.calculateSecurityScore()
      },
      critical_errors: this.errors.filter(e => e.severity === 'critical'),
      errors: this.errors.filter(e => e.severity !== 'critical'),
      warnings: this.warnings,
      passed: this.passed,
      recommendations: this.generateRecommendations()
    };
    
    // Save report to file
    const reportPath = path.join(process.cwd(), 'security-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`📄 Security report saved to: ${reportPath}`);
    return report;
  }

  calculateSecurityScore() {
    const totalChecks = this.errors.length + this.warnings.length + this.passed.length;
    if (totalChecks === 0) return 0;
    
    // Critical errors: -20 points each
    // Regular errors: -10 points each  
    // Warnings: -5 points each
    // Passed: +10 points each
    
    const criticalPenalty = this.criticalCount * -20;
    const errorPenalty = (this.errors.length - this.criticalCount) * -10;
    const warningPenalty = this.warnings.length * -5;
    const passedBonus = this.passed.length * 10;
    
    const rawScore = 50 + criticalPenalty + errorPenalty + warningPenalty + passedBonus;
    return Math.max(0, Math.min(100, rawScore));
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.criticalCount > 0) {
      recommendations.push('🚨 IMMEDIATE ACTION REQUIRED: Fix all critical security errors before production deployment');
    }
    
    if (this.errors.length > 0) {
      recommendations.push('🔧 Address all high-severity security errors');
    }
    
    if (this.warnings.length > 5) {
      recommendations.push('⚠️ Review and address security warnings for improved protection');
    }
    
    recommendations.push('🔄 Run security validation regularly as part of CI/CD pipeline');
    recommendations.push('📚 Consider implementing additional security measures from OWASP guidelines');
    
    return recommendations;
  }

  // Main validation runner
  async runValidation() {
    console.log('🔒 ClueQuest Security Validation Starting...\n');
    
    try {
      this.validateEnvironmentVariables();
      this.validateApiSecurity();
      this.validateDatabaseSecurity();
      this.validateQRSecurity();
      this.validateInputSecurity();
      this.validateAuthSecurity();
      
      const report = this.generateReport();
      
      console.log('\n📊 SECURITY VALIDATION SUMMARY');
      console.log('════════════════════════════════');
      console.log(`🏆 Security Score: ${report.summary.security_score}/100`);
      console.log(`🚨 Critical Errors: ${report.summary.critical_errors}`);
      console.log(`❌ Total Errors: ${report.summary.total_errors}`);
      console.log(`⚠️ Warnings: ${report.summary.warnings}`);
      console.log(`✅ Passed Checks: ${report.summary.passed}`);
      
      if (report.summary.critical_errors > 0) {
        console.log('\n🚫 PRODUCTION DEPLOYMENT BLOCKED');
        console.log('Critical security errors must be fixed before deployment.');
        process.exit(1);
      } else if (report.summary.security_score < 70) {
        console.log('\n⚠️ SECURITY SCORE TOO LOW FOR PRODUCTION');
        console.log('Improve security score to at least 70 before deployment.');
        process.exit(1);
      } else {
        console.log('\n✅ SECURITY VALIDATION PASSED');
        console.log('System meets minimum security requirements for deployment.');
        process.exit(0);
      }
      
    } catch (error) {
      console.error('❌ Security validation failed:', error.message);
      process.exit(1);
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new SecurityValidator();
  validator.runValidation().catch(error => {
    console.error('Fatal error during security validation:', error);
    process.exit(1);
  });
}

module.exports = SecurityValidator;