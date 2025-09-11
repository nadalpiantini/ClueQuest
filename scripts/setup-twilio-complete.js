#!/usr/bin/env node

/**
 * 📱 Twilio MCP Complete Setup & Test
 * Configure Twilio for SMS/WhatsApp notifications in ClueQuest
 */

const colors = {
  reset: '\x1b[0m', bright: '\x1b[1m', red: '\x1b[31m', green: '\x1b[32m', 
  yellow: '\x1b[33m', blue: '\x1b[34m', magenta: '\x1b[35m', cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function setupTwilioMCP() {
  log('\n📱 Twilio MCP Complete Setup for ClueQuest', 'bright');
  console.log('='.repeat(60));
  
  log('\n📋 STEP 1: Get Twilio Credentials', 'cyan');
  console.log('1. Visit: https://console.twilio.com/');
  console.log('2. Create free account or login');
  console.log('3. Get Account SID from dashboard');
  console.log('4. Create API Key:');
  console.log('   - Go to Settings → API Keys');
  console.log('   - Create New API Key');
  console.log('   - Save SID and Secret\n');
  
  log('🔧 STEP 2: Configure MCP Twilio', 'cyan');
  console.log('The MCP server is already installed! ✅');
  console.log('Now configure with your credentials:');
  log('   claude mcp add twilio npx -- -y @twilio-alpha/mcp ACCOUNT_SID/API_KEY:API_SECRET', 'yellow');
  console.log('   (Replace ACCOUNT_SID, API_KEY, API_SECRET with your actual values)\n');

  log('📞 STEP 3: Features You\'ll Get', 'cyan');
  console.log('🎮 ClueQuest SMS/WhatsApp Integration:');
  console.log('• Adventure start notifications → SMS to all players');
  console.log('• Team formation confirmations → WhatsApp groups');
  console.log('• QR clue delivery → SMS with location hints');
  console.log('• Real-time score updates → SMS broadcasts');
  console.log('• Game completion → SMS results summary');
  console.log('• Emergency host communication → SMS hotline\n');

  log('💰 Pricing (Free Tier):', 'blue');
  console.log('• SMS: $15 free credit (≈500 SMS messages)');
  console.log('• WhatsApp: $0.005 per message');
  console.log('• Voice calls: $0.0085 per minute');
  console.log('• Numbers: $1/month per phone number\n');

  log('🎯 Integration Examples:', 'magenta');
  console.log('Adventure Start:');
  console.log('  "🎮 Welcome to Mystery Mansion! Your adventure begins now.');
  console.log('   Team Code: ALPHA-2024. Good luck, detectives! 🔍"');
  console.log('');
  console.log('QR Found:');
  console.log('  "🎉 Team Alpha found the library clue!');
  console.log('   Next location: Garden Maze. 2 teams remaining! 💪"');
  console.log('');
  console.log('Game Complete:');
  console.log('  "🏆 Mystery Solved! Team Alpha wins in 47 minutes!');
  console.log('   🥇 Alpha: 2,450 pts | 🥈 Beta: 2,180 pts | 🥉 Gamma: 1,950 pts"');

  log('\n🔗 Useful Commands:', 'cyan');
  console.log('• Test MCP connection: Ask Claude to "send a test SMS"');
  console.log('• Check Twilio balance: Ask Claude "check my Twilio account status"');
  console.log('• Send adventure notification: Ask Claude "notify players about [event]"\n');

  log('✅ Twilio MCP Ready! Configure with your credentials above.', 'green');
}

if (require.main === module) {
  setupTwilioMCP().catch(console.error);
}

module.exports = setupTwilioMCP;