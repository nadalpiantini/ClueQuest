#!/usr/bin/env node

/**
 * 📧 Resend Email Service Quick Setup
 * Configure email service for ClueQuest production
 */

console.log('🚀 Resend Email Service Setup');
console.log('=====================================\n');

console.log('📧 Quick Setup Steps:');
console.log('1. Go to: https://resend.com');
console.log('2. Sign up with your email');
console.log('3. Go to API Keys → Create API Key');
console.log('4. Copy the key (starts with "re_")');
console.log('5. Add domain: empleaido.com');
console.log('6. Verify DNS records in Cloudflare\n');

console.log('🔧 DNS Records to add in Cloudflare:');
console.log('Type: TXT | Name: _resend | Value: [provided by Resend]');
console.log('Type: TXT | Name: rs._domainkey | Value: [provided by Resend]\n');

console.log('✅ Once you have the API key, add it to:');
console.log('   Local: .env.local');
console.log('   Production: vercel env add RESEND_API_KEY production');

console.log('\n🎯 Result: Transactional emails for user onboarding and notifications');