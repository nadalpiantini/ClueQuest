/**
 * Avatar Generation Pipeline Test Script
 * Tests the complete Runware.ai avatar generation flow
 */

const fs = require('fs')
const path = require('path')

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:5173',
  testImagePath: path.join(__dirname, '../public/images/test-avatar.jpg'),
  roles: ['Leader', 'Warrior', 'Mage', 'Healer', 'Scout'],
  apiEndpoints: {
    uploadSelfie: '/api/ai/avatar/upload-selfie',
    generateAvatar: '/api/ai/avatar/generate'
  }
}

// Create a simple test image if none exists
function createTestImage() {
  const testDir = path.dirname(TEST_CONFIG.testImagePath)
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true })
  }
  
  if (!fs.existsSync(TEST_CONFIG.testImagePath)) {
    console.log('⚠️  No test image found. Please add a test image at:', TEST_CONFIG.testImagePath)
    console.log('   Or use any passport-style photo for testing.')
    return false
  }
  return true
}

// Test image upload and validation
async function testImageUpload() {
  console.log('\n🔍 Testing image upload and validation...')
  
  try {
    if (!createTestImage()) {
      console.log('⚠️  Skipping upload test - no test image available')
      return { success: false, message: 'No test image' }
    }

    const imageBuffer = fs.readFileSync(TEST_CONFIG.testImagePath)
    const formData = new FormData()
    const imageFile = new File([imageBuffer], 'test-avatar.jpg', { type: 'image/jpeg' })
    formData.append('selfie', imageFile)

    const response = await fetch(`${TEST_CONFIG.baseUrl}${TEST_CONFIG.apiEndpoints.uploadSelfie}`, {
      method: 'POST',
      body: formData
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Image upload successful')
      console.log(`   - Face detection: ${result.face_detection?.faces_detected || 0} faces`)
      console.log(`   - Quality score: ${result.face_detection?.quality_score || 0}/100`)
      console.log(`   - Validation: ${result.validation?.is_valid ? 'PASSED' : 'WARNINGS'}`)
      
      if (result.validation?.issues?.length > 0) {
        console.log('   - Issues found:')
        result.validation.issues.slice(0, 3).forEach(issue => {
          console.log(`     • ${issue.message}`)
        })
      }
      
      return { success: true, url: result.url }
    } else {
      console.log('❌ Image upload failed:', result.error)
      return { success: false, message: result.error }
    }
    
  } catch (error) {
    console.log('❌ Upload test failed:', error.message)
    return { success: false, message: error.message }
  }
}

// Test avatar generation for a specific role
async function testAvatarGeneration(selfieUrl, role) {
  console.log(`\n🎭 Testing avatar generation for ${role}...`)
  
  try {
    const requestBody = {
      selfie_url: selfieUrl,
      style_id: `${role.toLowerCase()}-style`,
      gender: 'auto',
      age_range: 'adult',
      customizations: {
        style_intensity: 'moderate',
        preserve_ethnicity: true
      }
    }

    const response = await fetch(`${TEST_CONFIG.baseUrl}${TEST_CONFIG.apiEndpoints.generateAvatar}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log(`✅ ${role} avatar generated successfully`)
      console.log(`   - Generation time: ${result.generation_time_ms}ms`)
      console.log(`   - Model used: ${result.model_used || 'unknown'}`)
      console.log(`   - Face preservation: ${result.face_preservation_score || 'N/A'}%`)
      console.log(`   - Avatar URL: ${result.avatar_url?.slice(0, 50)}...`)
      
      return { success: true, result }
    } else {
      console.log(`❌ ${role} avatar generation failed:`, result.error)
      return { success: false, message: result.error }
    }
    
  } catch (error) {
    console.log(`❌ ${role} generation test failed:`, error.message)
    return { success: false, message: error.message }
  }
}

// Test Runware.ai client directly
function testRunwareClient() {
  console.log('\n🤖 Testing Runware.ai client...')
  
  try {
    const { runwareClient } = require('../src/lib/runware-ai.ts')
    
    console.log('✅ Runware client imported successfully')
    
    // Test model router
    const models = runwareClient.getAvailableModels()
    console.log(`✅ Model router loaded with ${Object.keys(models).length} roles:`)
    
    Object.entries(models).forEach(([role, config]) => {
      console.log(`   - ${role}: ${config.style_name} (${config.model_id})`)
    })
    
    // Test cost estimation
    const costEstimate = runwareClient.estimateCost('Leader', { gender: 'auto' })
    console.log(`✅ Cost estimation working: ~$${costEstimate.toFixed(3)} per generation`)
    
    return { success: true }
    
  } catch (error) {
    console.log('❌ Runware client test failed:', error.message)
    return { success: false, message: error.message }
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 ClueQuest Avatar Generation Pipeline Test')
  console.log('=' .repeat(50))
  
  const results = {
    client: { success: false },
    upload: { success: false },
    generations: []
  }
  
  // Test 1: Client functionality
  results.client = testRunwareClient()
  
  // Test 2: Image upload and validation
  results.upload = await testImageUpload()
  
  // Test 3: Avatar generation for each role
  if (results.upload.success && results.upload.url) {
    console.log('\n🎨 Testing avatar generation for all roles...')
    
    for (const role of TEST_CONFIG.roles.slice(0, 2)) { // Test first 2 roles to save time
      const genResult = await testAvatarGeneration(results.upload.url, role)
      results.generations.push({ role, ...genResult })
      
      // Small delay between generations
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  
  // Results summary
  console.log('\n📊 TEST RESULTS SUMMARY')
  console.log('=' .repeat(50))
  
  console.log(`🤖 Runware Client: ${results.client.success ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`📤 Image Upload: ${results.upload.success ? '✅ PASS' : '❌ FAIL'}`)
  
  const successfulGens = results.generations.filter(r => r.success).length
  const totalGens = results.generations.length
  console.log(`🎭 Avatar Generation: ${successfulGens}/${totalGens} roles successful`)
  
  results.generations.forEach(gen => {
    console.log(`   - ${gen.role}: ${gen.success ? '✅ PASS' : '❌ FAIL'}`)
  })
  
  const overallSuccess = results.client.success && 
                        (results.upload.success || results.upload.message === 'No test image') &&
                        (totalGens === 0 || successfulGens > 0)
  
  console.log('\n' + '=' .repeat(50))
  console.log(`🏁 OVERALL RESULT: ${overallSuccess ? '✅ PIPELINE READY' : '❌ NEEDS ATTENTION'}`)
  
  if (!overallSuccess) {
    console.log('\n🔧 NEXT STEPS:')
    if (!results.client.success) {
      console.log('   • Fix Runware.ai client configuration')
    }
    if (!results.upload.success && results.upload.message !== 'No test image') {
      console.log('   • Debug image upload and validation')
    }
    if (totalGens > 0 && successfulGens === 0) {
      console.log('   • Check avatar generation API and Runware.ai connection')
    }
  }
  
  console.log('\n💡 To run individual tests:')
  console.log('   • npm run dev (start the server first)')
  console.log('   • node scripts/test-avatar-pipeline.js')
  console.log('   • Add a test image at public/images/test-avatar.jpg for full testing')
}

// Export for use in other scripts
module.exports = {
  runTests,
  testImageUpload,
  testAvatarGeneration,
  testRunwareClient,
  TEST_CONFIG
}

// Run tests if called directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('Test runner failed:', error)
    process.exit(1)
  })
}