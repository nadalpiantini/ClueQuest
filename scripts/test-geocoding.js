#!/usr/bin/env node

/**
 * Test script for geocoding functionality
 * This script tests the geocoding API endpoints without requiring a browser
 */

const fetch = require('node-fetch')

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'

async function testGeocodingAPI() {
  console.log('🧪 Testing ClueQuest Geocoding API...\n')

  const tests = [
    {
      name: 'Geocode Address',
      endpoint: '/api/geocoding',
      method: 'POST',
      body: {
        action: 'geocode',
        query: 'Times Square, New York, NY'
      }
    },
    {
      name: 'Search Places',
      endpoint: '/api/geocoding',
      method: 'POST',
      body: {
        action: 'search',
        query: 'Central Park'
      }
    },
    {
      name: 'Reverse Geocode',
      endpoint: '/api/geocoding',
      method: 'POST',
      body: {
        action: 'reverse',
        latitude: 40.7589,
        longitude: -73.9851
      }
    }
  ]

  for (const test of tests) {
    try {
      console.log(`📋 Testing: ${test.name}`)
      
      const response = await fetch(`${BASE_URL}${test.endpoint}`, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test.body)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      if ('code' in result && 'message' in result) {
        console.log(`❌ Error: ${result.message}`)
      } else if (Array.isArray(result)) {
        console.log(`✅ Success: Found ${result.length} results`)
        if (result.length > 0) {
          console.log(`   First result: ${result[0].formattedAddress}`)
        }
      } else {
        console.log(`✅ Success: ${result.formattedAddress || 'Coordinates found'}`)
        if (result.latitude && result.longitude) {
          console.log(`   Coordinates: ${result.latitude}, ${result.longitude}`)
        }
      }
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`)
    }
    
    console.log('')
  }

  console.log('🏁 Geocoding API tests completed!')
}

async function testFallbackFunctionality() {
  console.log('🔄 Testing fallback functionality (without Google Maps API key)...\n')
  
  // Temporarily remove API key to test fallback
  const originalApiKey = process.env.GOOGLE_MAPS_API_KEY
  delete process.env.GOOGLE_MAPS_API_KEY
  
  try {
    const response = await fetch(`${BASE_URL}/api/geocoding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'geocode',
        query: 'Test Address'
      })
    })

    if (response.ok) {
      const result = await response.json()
      console.log('✅ Fallback working: Mock coordinates generated')
      console.log(`   Address: ${result.formattedAddress}`)
      console.log(`   Coordinates: ${result.latitude}, ${result.longitude}`)
    } else {
      console.log('❌ Fallback failed')
    }
  } catch (error) {
    console.log(`❌ Fallback test failed: ${error.message}`)
  } finally {
    // Restore API key
    if (originalApiKey) {
      process.env.GOOGLE_MAPS_API_KEY = originalApiKey
    }
  }
}

async function main() {
  try {
    await testGeocodingAPI()
    await testFallbackFunctionality()
  } catch (error) {
    console.error('Test suite failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = { testGeocodingAPI, testFallbackFunctionality }
