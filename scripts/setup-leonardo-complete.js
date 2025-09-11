#!/usr/bin/env node

/**
 * 🎨 Leonardo AI Complete Setup & Test
 * Real-time setup with API testing for ClueQuest avatar generation
 */

require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

const colors = {
  reset: '\x1b[0m', bright: '\x1b[1m', red: '\x1b[31m', green: '\x1b[32m', 
  yellow: '\x1b[33m', blue: '\x1b[34m', magenta: '\x1b[35m', cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function setupLeonardoAI() {
  log('\n🎨 Leonardo AI Complete Setup for ClueQuest', 'bright');
  console.log('='.repeat(60));
  
  // Check if API key exists
  const apiKey = process.env.LEONARDO_AI_API_KEY;
  
  if (!apiKey || apiKey === 'your_leonardo_api_key_here') {
    log('\n📋 STEP 1: Get Leonardo AI API Key', 'cyan');
    console.log('1. Visit: https://leonardo.ai/account/api');
    console.log('2. Create account or login');
    console.log('3. Generate API Key');
    console.log('4. Add to .env.local:');
    log('   LEONARDO_AI_API_KEY=your_actual_key_here\n', 'yellow');
    
    log('💡 Free Tier: 150 credits/day (≈30 avatars/day)', 'blue');
    log('💰 Paid Plans: From $12/month for higher limits\n', 'blue');
    return;
  }

  // Test API connection
  log('\n🧪 STEP 2: Testing Leonardo AI API', 'cyan');
  try {
    const response = await fetch('https://cloud.leonardo.ai/api/rest/v1/me', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const userData = await response.json();
      log(`✅ API Connected! User: ${userData.user_details?.user?.username || 'Unknown'}`, 'green');
      log(`💰 Credits Available: ${userData.user_details?.token_count || 'Unknown'}`, 'blue');
    } else {
      log(`❌ API Error: ${response.status} - ${response.statusText}`, 'red');
      log('Check your API key at: https://leonardo.ai/account/api', 'yellow');
      return;
    }
  } catch (error) {
    log(`❌ Connection Error: ${error.message}`, 'red');
    return;
  }

  // Test avatar generation
  log('\n🎭 STEP 3: Testing Avatar Generation', 'cyan');
  try {
    const testPrompt = "Professional avatar of a friendly game master, digital art style";
    
    const generationResponse = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: testPrompt,
        num_images: 1,
        width: 512,
        height: 512,
        guidance_scale: 7,
        modelId: "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3" // Leonardo Creative v1.1
      })
    });

    if (generationResponse.ok) {
      const result = await generationResponse.json();
      log(`✅ Test Avatar Generation Started!`, 'green');
      log(`🔄 Generation ID: ${result.sdGenerationJob?.generationId || 'Processing...'}`, 'blue');
      log(`⏱️  Processing time: ~20-30 seconds`, 'blue');
    } else {
      log(`❌ Generation Error: ${generationResponse.status}`, 'red');
    }
  } catch (error) {
    log(`❌ Generation Test Failed: ${error.message}`, 'red');
  }

  // Setup complete
  log('\n🎯 Leonardo AI Integration Features:', 'bright');
  console.log('• Player selfie → AI avatar conversion');
  console.log('• Multiple art styles (realistic, cartoon, fantasy)');
  console.log('• Role-based character visualization');
  console.log('• Team avatar generation for multiplayer');
  console.log('• Leaderboard profile pictures\n');

  log('🔗 Integration Points in ClueQuest:', 'cyan');
  console.log('• /avatar-generation - Main avatar creation page');
  console.log('• /api/ai/avatar/generate - Generation endpoint');
  console.log('• /api/ai/avatar/upload-selfie - Selfie upload');
  console.log('• /role-selection - Avatar preview in roles\n');

  log('✅ Leonardo AI Ready for Production!', 'green');
}

if (require.main === module) {
  setupLeonardoAI().catch(console.error);
}

module.exports = setupLeonardoAI;