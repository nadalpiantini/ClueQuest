#!/usr/bin/env node

/**
 * ClueQuest DNS Configuration Automation
 * Configures Cloudflare DNS records for production deployment
 * Based on proven patterns from AXIS6 and CINETWRK
 */

require('dotenv').config({ path: '.env.local' });
const https = require('https');

class CloudflareDNSManager {
  constructor(apiToken, accountId) {
    this.apiToken = apiToken;
    this.accountId = accountId;
    this.baseUrl = 'https://api.cloudflare.com/client/v4';
  }

  async makeRequest(method, endpoint, data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(url, options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            if (jsonData.success) {
              resolve(jsonData.result);
            } else {
              reject(new Error(jsonData.errors?.[0]?.message || 'Unknown error'));
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', reject);
      
      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }

  async getZones() {
    return await this.makeRequest('GET', '/zones');
  }

  async getZoneByName(name) {
    const zones = await this.getZones();
    return zones.find(zone => zone.name === name);
  }

  async getDNSRecords(zoneId) {
    return await this.makeRequest('GET', `/zones/${zoneId}/dns_records`);
  }

  async createDNSRecord(zoneId, record) {
    return await this.makeRequest('POST', `/zones/${zoneId}/dns_records`, record);
  }

  async updateDNSRecord(zoneId, recordId, record) {
    return await this.makeRequest('PUT', `/zones/${zoneId}/dns_records/${recordId}`, record);
  }

  async deleteDNSRecord(zoneId, recordId) {
    return await this.makeRequest('DELETE', `/zones/${zoneId}/dns_records/${recordId}`);
  }

  async configureDNS(domain = 'your-domain.com', vercelIp = '76.76.21.21') {
    console.log(`🌐 Configuring DNS for ${domain}...`);
    
    try {
      // Get zone
      const zone = await this.getZoneByName(domain);
      if (!zone) {
        throw new Error(`Zone not found for domain: ${domain}`);
      }
      
      console.log(`✅ Found zone: ${zone.name} (${zone.id})`);
      
      // Get existing records
      const existingRecords = await this.getDNSRecords(zone.id);
      console.log(`📋 Found ${existingRecords.length} existing DNS records`);
      
      // Define required records for ClueQuest
      const requiredRecords = [
        // Main domain A record (pointing to Vercel)
        {
          type: 'A',
          name: '@',
          content: vercelIp,
          ttl: 300,
          comment: 'ClueQuest main domain - points to Vercel'
        },
        // WWW redirect
        {
          type: 'CNAME',
          name: 'www',
          content: domain,
          ttl: 300,
          comment: 'WWW redirect to apex domain'
        },
        // Email authentication records (for Resend)
        {
          type: 'TXT',
          name: '@',
          content: 'v=spf1 include:_spf.mx.cloudflare.net include:amazonses.com ~all',
          ttl: 300,
          comment: 'SPF record for email authentication'
        },
        {
          type: 'TXT',
          name: '_dmarc',
          content: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@' + domain + '; ruf=mailto:dmarc@' + domain + '; rf=afrf; pct=100; ri=86400',
          ttl: 300,
          comment: 'DMARC policy for email security'
        },
        // API subdomain (for API access)
        {
          type: 'CNAME',
          name: 'api',
          content: domain,
          ttl: 300,
          comment: 'API subdomain'
        },
        // Status page subdomain
        {
          type: 'CNAME',
          name: 'status',
          content: domain,
          ttl: 300,
          comment: 'Status page subdomain'
        },
        // App subdomain (for different deployment if needed)
        {
          type: 'CNAME',
          name: 'app',
          content: domain,
          ttl: 300,
          comment: 'App subdomain'
        }
      ];
      
      const results = [];
      
      for (const record of requiredRecords) {
        try {
          // Check if record already exists
          const existing = existingRecords.find(r => 
            r.type === record.type && 
            r.name === record.name
          );
          
          if (existing) {
            // Update existing record
            console.log(`🔄 Updating ${record.type} record: ${record.name}`);
            const updated = await this.updateDNSRecord(zone.id, existing.id, record);
            results.push({ action: 'updated', record: updated });
            console.log(`  ✅ Updated ${record.name} → ${record.content}`);
          } else {
            // Create new record
            console.log(`➕ Creating ${record.type} record: ${record.name}`);
            const created = await this.createDNSRecord(zone.id, record);
            results.push({ action: 'created', record: created });
            console.log(`  ✅ Created ${record.name} → ${record.content}`);
          }
        } catch (error) {
          console.log(`  ❌ Failed to configure ${record.name}: ${error.message}`);
          results.push({ action: 'failed', record: record, error: error.message });
        }
      }
      
      // Summary
      const created = results.filter(r => r.action === 'created').length;
      const updated = results.filter(r => r.action === 'updated').length;
      const failed = results.filter(r => r.action === 'failed').length;
      
      console.log(`\n📊 DNS Configuration Summary:`);
      console.log(`  Created: ${created} records`);
      console.log(`  Updated: ${updated} records`);
      console.log(`  Failed:  ${failed} records`);
      
      if (failed === 0) {
        console.log(`\n✅ DNS configuration completed successfully!`);
        console.log(`\n🔍 Verify propagation with:`);
        console.log(`  dig ${domain}`);
        console.log(`  dig www.${domain}`);
        console.log(`  dig TXT ${domain}`);
      } else {
        console.log(`\n⚠️  DNS configuration completed with ${failed} errors`);
      }
      
      return {
        success: failed === 0,
        created,
        updated,
        failed,
        results
      };
      
    } catch (error) {
      console.error(`❌ DNS configuration failed: ${error.message}`);
      throw error;
    }
  }
}

async function main() {
  console.log('🌐 ClueQuest DNS Configuration');
  console.log('================================\n');
  
  // Validate environment variables
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const domain = process.env.PRODUCTION_DOMAIN || 'your-domain.com';
  
  if (!apiToken) {
    console.error('❌ CLOUDFLARE_API_TOKEN environment variable is required');
    console.log('\n📝 To get your Cloudflare API token:');
    console.log('1. Go to https://dash.cloudflare.com/profile/api-tokens');
    console.log('2. Create token with Zone:DNS:Edit permissions');
    console.log('3. Add to your .env.local file');
    process.exit(1);
  }
  
  if (!accountId) {
    console.error('❌ CLOUDFLARE_ACCOUNT_ID environment variable is required');
    console.log('\n📝 To get your Cloudflare Account ID:');
    console.log('1. Go to https://dash.cloudflare.com');
    console.log('2. Select your domain');
    console.log('3. Account ID is shown in the right sidebar');
    process.exit(1);
  }
  
  try {
    const manager = new CloudflareDNSManager(apiToken, accountId);
    
    // Test API connection
    console.log('🔑 Testing Cloudflare API connection...');
    const zones = await manager.getZones();
    console.log(`✅ Connected! Found ${zones.length} zones in your account\n`);
    
    // Configure DNS
    const result = await manager.configureDNS(domain);
    
    if (result.success) {
      console.log('\n🎉 DNS configuration completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('1. Wait 5-10 minutes for DNS propagation');
      console.log('2. Configure your domain in Vercel dashboard');
      console.log('3. Set up email domain in Resend');
      console.log('4. Update your .env.local with production domain');
    }
    
  } catch (error) {
    console.error(`❌ Setup failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { CloudflareDNSManager };