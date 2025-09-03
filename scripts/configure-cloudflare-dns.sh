#!/bin/bash

# ClueQuest Cloudflare DNS Configuration Script
# This script configures the DNS record for cluequest.empleaido.com

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🌐 ClueQuest Cloudflare DNS Configuration${NC}"
echo "======================================================"
echo ""

# Configuration
DOMAIN="empleaido.com"
SUBDOMAIN="cluequest"
FULL_DOMAIN="cluequest.empleaido.com"
TARGET_IP="76.76.21.21"  # Vercel IP

echo -e "${BLUE}🎯 Target Configuration:${NC}"
echo "Domain: $DOMAIN"
echo "Subdomain: $FULL_DOMAIN"  
echo "IP Address: $TARGET_IP"
echo ""

# Check if API token is available
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo -e "${YELLOW}⚠️  CLOUDFLARE_API_TOKEN not configured${NC}"
    echo ""
    echo -e "${BLUE}📋 Quick Setup Options:${NC}"
    echo ""
    echo -e "${GREEN}Option 1: Automatic Configuration (Recommended)${NC}"
    echo "1. Go to: https://dash.cloudflare.com/profile/api-tokens"
    echo "2. Click 'Create Token'"
    echo "3. Use 'Edit zone DNS' template"
    echo "4. Zone Resources: empleaido.com"
    echo "5. Copy the token and run:"
    echo "   export CLOUDFLARE_API_TOKEN='your_token_here'"
    echo "6. Re-run this script: ./scripts/configure-cloudflare-dns.sh"
    echo ""
    echo -e "${BLUE}Option 2: Manual Configuration (5 minutes)${NC}"
    echo "1. Go to: https://dash.cloudflare.com"
    echo "2. Select: empleaido.com"
    echo "3. Go to: DNS > Records"
    echo "4. Add A record:"
    echo "   Name: cluequest"
    echo "   IPv4: 76.76.21.21"
    echo "   Proxy status: DNS only (gray cloud)"
    echo "   TTL: Auto"
    echo "5. Save"
    echo ""
    echo -e "${CYAN}✨ Result: https://cluequest.empleaido.com will be live in 5-15 minutes${NC}"
    exit 0
fi

# Get Zone ID for empleaido.com
echo -e "${BLUE}🔍 Step 1: Getting Zone ID for empleaido.com${NC}"

ZONE_RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$DOMAIN" \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     -H "Content-Type: application/json")

if echo "$ZONE_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    ZONE_ID=$(echo "$ZONE_RESPONSE" | jq -r '.result[0].id // empty')
    if [ -n "$ZONE_ID" ] && [ "$ZONE_ID" != "null" ]; then
        echo -e "${GREEN}✅ Zone ID found: $ZONE_ID${NC}"
    else
        echo -e "${RED}❌ Zone not found for domain: $DOMAIN${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Failed to get Zone ID${NC}"
    ERROR_MSG=$(echo "$ZONE_RESPONSE" | jq -r '.errors[0].message // "Unknown error"' 2>/dev/null || echo "API request failed")
    echo "Error: $ERROR_MSG"
    echo "Please check your API token has Zone:DNS:Edit permissions for $DOMAIN"
    exit 1
fi

echo ""
echo -e "${BLUE}🔍 Step 2: Checking existing DNS records${NC}"

# Check if record already exists
EXISTING_RESPONSE=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?name=$FULL_DOMAIN" \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     -H "Content-Type: application/json")

if echo "$EXISTING_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    RECORD_COUNT=$(echo "$EXISTING_RESPONSE" | jq '.result | length' 2>/dev/null || echo "0")
    
    if [ "$RECORD_COUNT" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Found $RECORD_COUNT existing record(s) for $FULL_DOMAIN${NC}"
        echo "$EXISTING_RESPONSE" | jq -r '.result[] | "  Type: \(.type), Content: \(.content), ID: \(.id)"' 2>/dev/null
        
        EXISTING_RECORD_ID=$(echo "$EXISTING_RESPONSE" | jq -r '.result[0].id // empty')
        
        echo -e "${BLUE}🔄 Updating existing record...${NC}"
        
        # Update existing record
        UPDATE_RESPONSE=$(curl -s -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$EXISTING_RECORD_ID" \
             -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
             -H "Content-Type: application/json" \
             -d "{
                \"type\": \"A\",
                \"name\": \"$SUBDOMAIN\",
                \"content\": \"$TARGET_IP\",
                \"ttl\": 300,
                \"proxied\": false,
                \"comment\": \"ClueQuest gaming platform - Updated $(date '+%Y-%m-%d %H:%M:%S')\"
             }")
        
        if echo "$UPDATE_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
            echo -e "${GREEN}✅ DNS record updated successfully!${NC}"
        else
            echo -e "${RED}❌ Failed to update DNS record${NC}"
            echo "Error: $(echo "$UPDATE_RESPONSE" | jq -r '.errors[0].message // "Unknown error"')"
            exit 1
        fi
    else
        echo -e "${GREEN}✅ No existing records found${NC}"
        echo -e "${BLUE}➕ Creating new DNS record...${NC}"
        
        # Create new record with 2025 API format
        CREATE_RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
             -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
             -H "Content-Type: application/json" \
             -d "{
                \"type\": \"A\",
                \"name\": \"$SUBDOMAIN\",
                \"content\": \"$TARGET_IP\",
                \"ttl\": 300,
                \"proxied\": false,
                \"comment\": \"ClueQuest gaming platform - Created $(date '+%Y-%m-%d %H:%M:%S')\"
             }")
        
        if echo "$CREATE_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
            RECORD_ID=$(echo "$CREATE_RESPONSE" | jq -r '.result.id // empty')
            echo -e "${GREEN}✅ DNS record created successfully!${NC}"
            echo "  Record ID: $RECORD_ID"
            echo "  Name: $FULL_DOMAIN"
            echo "  Content: $TARGET_IP"
        else
            echo -e "${RED}❌ Failed to create DNS record${NC}"
            ERROR_MSG=$(echo "$CREATE_RESPONSE" | jq -r '.errors[0].message // "Unknown error"')
            echo "Error: $ERROR_MSG"
            exit 1
        fi
    fi
else
    echo -e "${RED}❌ Failed to check existing records${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🔄 Step 3: Verifying DNS propagation${NC}"

# Monitor DNS propagation
max_attempts=15
attempt=0

while [ $attempt -lt $max_attempts ]; do
    echo -e "${BLUE}⏳ Checking propagation... ($((attempt + 1))/$max_attempts)${NC}"
    
    # Check multiple DNS servers
    GOOGLE_DNS=$(dig +short $FULL_DOMAIN @8.8.8.8 2>/dev/null | tail -n1)
    CLOUDFLARE_DNS=$(dig +short $FULL_DOMAIN @1.1.1.1 2>/dev/null | tail -n1)
    
    echo "  Google DNS: ${GOOGLE_DNS:-'Not resolved'}"
    echo "  Cloudflare DNS: ${CLOUDFLARE_DNS:-'Not resolved'}"
    
    # Check if DNS is working
    if [ "$GOOGLE_DNS" = "$TARGET_IP" ] || [ "$CLOUDFLARE_DNS" = "$TARGET_IP" ]; then
        echo -e "${GREEN}✅ DNS propagation successful!${NC}"
        echo "✅ $FULL_DOMAIN → $TARGET_IP"
        
        # Test HTTPS
        echo -e "${BLUE}🔒 Testing HTTPS...${NC}"
        sleep 2
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$FULL_DOMAIN" --connect-timeout 10 --max-time 15 || echo "000")
        
        if [ "$HTTP_STATUS" = "200" ]; then
            echo -e "${GREEN}🎉 SUCCESS! ClueQuest is live!${NC}"
            echo ""
            echo -e "${CYAN}🌟 Configuration Complete!${NC}"
            echo "================================"
            echo "✅ DNS: $FULL_DOMAIN → $TARGET_IP"
            echo "✅ HTTPS: Working with SSL"
            echo "✅ Status: Production Ready"
            echo ""
            echo -e "${GREEN}🚀 Your ClueQuest gaming platform is live at:${NC}"
            echo "   https://$FULL_DOMAIN"
            echo ""
            break
        else
            echo -e "${YELLOW}⚠️  DNS working, HTTPS status: $HTTP_STATUS${NC}"
            echo "SSL certificate may still be provisioning..."
        fi
    else
        echo -e "${YELLOW}⏳ Still propagating...${NC}"
    fi
    
    attempt=$((attempt + 1))
    if [ $attempt -lt $max_attempts ]; then
        echo "Waiting 20 seconds..."
        sleep 20
    fi
done

if [ $attempt -eq $max_attempts ]; then
    echo -e "${YELLOW}🕐 DNS propagation taking longer than expected${NC}"
    echo "Record created successfully. Check again in 10-30 minutes."
    echo "Monitor: https://$FULL_DOMAIN"
fi

echo ""
echo -e "${BLUE}📊 Manual Check Commands:${NC}"
echo "  dig $FULL_DOMAIN"
echo "  nslookup $FULL_DOMAIN"
echo "  curl -I https://$FULL_DOMAIN"