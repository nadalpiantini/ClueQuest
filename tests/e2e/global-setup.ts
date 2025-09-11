import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting ClueQuest E2E Testing Suite');
  console.log(`🎯 Base URL: ${config.projects[0]?.use?.baseURL}`);
  console.log(`📱 Testing ${config.projects.length} device/browser configurations`);
  
  // Verify server is running
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3000';
  
  try {
    const response = await fetch(baseURL);
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    console.log('✅ ClueQuest server is running and accessible');
  } catch (error) {
    console.error('❌ Failed to connect to ClueQuest server:', error);
    throw error;
  }
}

export default globalSetup;