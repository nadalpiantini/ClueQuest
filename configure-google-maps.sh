#!/bin/bash

# Google Maps API Configuration Script for ClueQuest
# This script helps you configure Google Maps API integration

echo "🗺️ Google Maps API Configuration for ClueQuest"
echo "=============================================="
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local first with your Supabase configuration"
    exit 1
fi

echo "✅ Found .env.local file"
echo ""

# Check current API key status
if grep -q "GOOGLE_MAPS_API_KEY=" .env.local; then
    if grep -q "GOOGLE_MAPS_API_KEY=AIza" .env.local; then
        echo "✅ Google Maps API key is already configured"
        echo ""
        read -p "Do you want to test the current configuration? (y/n): " test_current
        if [ "$test_current" = "y" ] || [ "$test_current" = "Y" ]; then
            echo ""
            echo "🧪 Testing current configuration..."
            node quick-test-maps.js
        fi
        exit 0
    else
        echo "⚠️  Google Maps API key placeholder found, but no real key configured"
    fi
else
    echo "❌ Google Maps API key not found in .env.local"
fi

echo ""
echo "📋 To get your Google Maps API key:"
echo "1. Go to: https://console.cloud.google.com/"
echo "2. Create/select a project"
echo "3. Enable APIs: Geocoding API, Places API"
echo "4. Create API Key in Credentials"
echo "5. Copy the API key"
echo ""

read -p "Enter your Google Maps API key (or press Enter to skip): " api_key

if [ -z "$api_key" ]; then
    echo "⏭️  Skipping API key configuration"
    echo "📖 See GOOGLE_MAPS_API_SETUP.md for detailed instructions"
    exit 0
fi

# Validate API key format
if [[ ! $api_key =~ ^AIza ]]; then
    echo "⚠️  Warning: API key should start with 'AIza'"
    read -p "Continue anyway? (y/n): " proceed
    if [ "$proceed" != "y" ] && [ "$proceed" != "Y" ]; then
        exit 0
    fi
fi

# Update .env.local
if grep -q "GOOGLE_MAPS_API_KEY=" .env.local; then
    # Replace existing key
    sed -i.bak "s/GOOGLE_MAPS_API_KEY=.*/GOOGLE_MAPS_API_KEY=$api_key/" .env.local
    rm .env.local.bak
else
    # Add new key
    echo "" >> .env.local
    echo "# Google Maps API" >> .env.local
    echo "GOOGLE_MAPS_API_KEY=$api_key" >> .env.local
fi

echo "✅ Updated .env.local with Google Maps API key"
echo ""

# Test the configuration
echo "🧪 Testing configuration..."
echo ""

# Test with a real address
echo "Testing with 'Times Square, New York'..."
response=$(curl -s -X POST http://localhost:3000/api/geocoding \
    -H "Content-Type: application/json" \
    -d '{"action":"geocode","query":"Times Square, New York"}')

if [ $? -eq 0 ]; then
    echo "✅ API endpoint is responding"
    
    # Check if we're getting real coordinates (not mock NYC area)
    lat=$(echo $response | grep -o '"latitude":[0-9.]*' | cut -d':' -f2)
    lng=$(echo $response | grep -o '"longitude":-[0-9.]*' | cut -d':' -f2)
    
    if [ ! -z "$lat" ] && [ ! -z "$lng" ]; then
        # Check if coordinates are in NYC mock area
        if (( $(echo "$lat >= 40.6 && $lat <= 40.8" | bc -l) )) && (( $(echo "$lng >= -74.1 && $lng <= -73.9" | bc -l) )); then
            echo "⚠️  WARNING: Still getting mock coordinates (NYC area)"
            echo "   Coordinates: $lat, $lng"
            echo "   This suggests the API key may not be working properly"
            echo ""
            echo "🔧 Please check:"
            echo "   - API key is correct"
            echo "   - Geocoding API is enabled in Google Cloud Console"
            echo "   - API key has proper permissions"
            echo "   - Restart the server: npm run dev"
        else
            echo "🎉 SUCCESS! Real coordinates detected!"
            echo "   Coordinates: $lat, $lng"
            echo "   Google Maps API is working correctly!"
        fi
    else
        echo "❌ Could not parse coordinates from response"
    fi
else
    echo "❌ API endpoint not responding"
    echo "   Make sure the server is running: npm run dev"
fi

echo ""
echo "🚀 Next steps:"
echo "1. Restart your development server: npm run dev"
echo "2. Test in the application: http://localhost:3000/create"
echo "3. Go to Step 3: Locations & QR Codes"
echo "4. Try the 'Google Maps Address Lookup' feature"
echo ""
echo "📖 For troubleshooting, see: GOOGLE_MAPS_API_SETUP.md"
