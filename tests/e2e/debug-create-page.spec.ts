import { test, expect } from '@playwright/test';

test.describe('DEBUG: Create Adventure Page', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to create page
    console.log('🚀 Navigating to /create page...');
    await page.goto('/create');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    console.log('✅ Page loaded successfully');
  });

  test('DEBUG: Page loads and displays main elements', async ({ page }) => {
    console.log('🔍 Checking page load and main elements...');
    
    // Take initial screenshot
    await page.screenshot({ path: 'debug-screenshots/create-page-initial.png', fullPage: true });
    
    // Check page title
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);
    
    // Look for main page elements
    const mainContent = page.locator('main, [data-testid="create"], .create-page');
    await expect(mainContent.first()).toBeVisible({ timeout: 10000 });
    console.log('✅ Main content container found');
    
    // Look for adventure creation form or components
    const adventureForm = page.locator('form, .adventure-form, [data-testid="adventure-form"]');
    if (await adventureForm.count() > 0) {
      await expect(adventureForm.first()).toBeVisible();
      console.log('✅ Adventure form found');
    }
    
    // Check for any visible headings
    const headings = page.locator('h1, h2, h3');
    const headingCount = await headings.count();
    console.log(`📝 Found ${headingCount} headings on the page`);
    
    if (headingCount > 0) {
      const firstHeading = await headings.first().textContent();
      console.log(`🏷️ First heading: "${firstHeading}"`);
    }
  });

  test('DEBUG: Adventure form interactions', async ({ page }) => {
    console.log('🎮 Testing adventure form interactions...');
    
    // Look for title input field
    const titleField = page.locator('input[name="title"], input[placeholder*="title" i], #title');
    if (await titleField.count() > 0) {
      console.log('📝 Title field found - testing input');
      await titleField.first().click();
      await titleField.first().fill('Debug Test Adventure');
      await page.screenshot({ path: 'debug-screenshots/title-filled.png' });
      console.log('✅ Title field interaction successful');
    } else {
      console.log('⚠️ Title field not found');
    }
    
    // Look for theme selection
    const themeSelector = page.locator('select[name="theme"], [data-testid="theme"], .theme-selector');
    if (await themeSelector.count() > 0) {
      console.log('🎨 Theme selector found');
      await themeSelector.first().click();
      await page.screenshot({ path: 'debug-screenshots/theme-selector-open.png' });
    }
    
    // Look for duration/time inputs
    const durationField = page.locator('input[name="duration"], input[placeholder*="duration" i], input[type="number"]');
    if (await durationField.count() > 0) {
      console.log('⏱️ Duration field found');
      await durationField.first().click();
      await durationField.first().fill('60');
      console.log('✅ Duration set to 60 minutes');
    }
    
    // Look for max players input
    const playersField = page.locator('input[name="maxPlayers"], input[placeholder*="players" i]');
    if (await playersField.count() > 0) {
      console.log('👥 Max players field found');
      await playersField.first().click();
      await playersField.first().fill('8');
      console.log('✅ Max players set to 8');
    }
    
    await page.screenshot({ path: 'debug-screenshots/form-filled.png', fullPage: true });
  });

  test('DEBUG: Story Generation Modal (AI Feature)', async ({ page }) => {
    console.log('🤖 Testing Story Generation Modal - the feature we just fixed!');
    
    // First, fill out basic form to enable story generation
    const titleField = page.locator('input[name="title"], input[placeholder*="title" i], #title');
    if (await titleField.count() > 0) {
      await titleField.first().fill('AI Story Test Adventure');
      console.log('📝 Adventure title set for AI generation');
    }
    
    // Look for AI/Story generation button
    const aiButtons = [
      page.locator('text="Generate Story"'),
      page.locator('text="AI Story"'),
      page.locator('text="Story Assistant"'),
      page.locator('button, a').filter({ hasText: /story|ai|generate/i })
    ];
    
    let storyButton = null;
    for (const buttonLocator of aiButtons) {
      if (await buttonLocator.count() > 0) {
        storyButton = buttonLocator.first();
        break;
      }
    }
    
    if (storyButton) {
      console.log('🎯 Story generation button found!');
      await page.screenshot({ path: 'debug-screenshots/before-story-modal.png' });
      
      // Click the story generation button
      await storyButton.click();
      console.log('🚀 Clicked story generation button');
      
      // Wait for modal to appear
      await page.waitForTimeout(1000);
      
      // Look for modal/dialog
      const modal = page.locator('[role="dialog"], .modal, .dialog, [data-testid*="modal"]');
      if (await modal.count() > 0) {
        await expect(modal.first()).toBeVisible();
        console.log('✅ Story generation modal appeared');
        
        // Take screenshot of the modal
        await page.screenshot({ path: 'debug-screenshots/story-modal-open.png', fullPage: true });
        
        // Look for AI configuration options
        const promptField = page.locator('textarea[name="prompt"], textarea[placeholder*="prompt" i]');
        if (await promptField.count() > 0) {
          console.log('📝 Prompt field found in modal');
          await promptField.first().click();
        }
        
        // Look for tone selector
        const toneSelector = page.locator('select[name="tone"], [data-testid="tone"]');
        if (await toneSelector.count() > 0) {
          console.log('🎭 Tone selector found');
        }
        
        // Look for generate button in modal
        const generateBtn = page.locator('button').filter({ hasText: /generate|create|start/i });
        if (await generateBtn.count() > 0) {
          console.log('⚡ Generate button found in modal');
          await page.screenshot({ path: 'debug-screenshots/ready-to-generate.png' });
          
          // Test the actual API call (this should now work without 401 error)
          await generateBtn.first().click();
          console.log('🧪 Testing API call - should NOT get 401 error now!');
          
          // Wait for response
          await page.waitForTimeout(3000);
          await page.screenshot({ path: 'debug-screenshots/after-api-call.png', fullPage: true });
          
          // Check for success indicators or loading states
          const loadingIndicator = page.locator('.loading, .spinner, [data-testid="loading"]');
          const successMessage = page.locator('.success, .completed, [data-testid="success"]');
          const errorMessage = page.locator('.error, .failed, [data-testid="error"]');
          
          if (await loadingIndicator.count() > 0) {
            console.log('⏳ Loading indicator found - API call in progress');
          }
          
          if (await successMessage.count() > 0) {
            console.log('✅ Success indicator found - API call successful!');
          }
          
          if (await errorMessage.count() > 0) {
            console.log('❌ Error message found - checking details...');
            const errorText = await errorMessage.first().textContent();
            console.log(`Error details: ${errorText}`);
          }
        }
      } else {
        console.log('⚠️ No modal found after clicking story button');
      }
    } else {
      console.log('⚠️ No story generation button found on the page');
      
      // List all buttons for debugging
      const allButtons = page.locator('button, a[role="button"]');
      const buttonCount = await allButtons.count();
      console.log(`🔍 Found ${buttonCount} buttons/links on the page:`);
      
      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const buttonText = await allButtons.nth(i).textContent();
        console.log(`  ${i + 1}. "${buttonText?.trim()}"`);
      }
    }
    
    await page.screenshot({ path: 'debug-screenshots/story-generation-final.png', fullPage: true });
  });

  test('DEBUG: Mobile responsiveness and touch targets', async ({ page }) => {
    console.log('📱 Testing mobile responsiveness...');
    
    // Test different viewport sizes
    const viewportSizes = [
      { width: 375, height: 667, name: 'iPhone 8' },
      { width: 414, height: 896, name: 'iPhone 11' },
      { width: 768, height: 1024, name: 'iPad' },
      { width: 1024, height: 768, name: 'Desktop' }
    ];
    
    for (const viewport of viewportSizes) {
      console.log(`📏 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500);
      
      // Take screenshot for each viewport
      await page.screenshot({ 
        path: `debug-screenshots/responsive-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
        fullPage: true 
      });
      
      // Check that main elements are still visible
      const mainContent = page.locator('main, [data-testid="create"]');
      await expect(mainContent.first()).toBeVisible();
      
      // Check touch target sizes for mobile
      if (viewport.width <= 768) {
        const buttons = page.locator('button, a[role="button"], input[type="submit"]');
        const buttonCount = await buttons.count();
        
        for (let i = 0; i < Math.min(buttonCount, 5); i++) {
          const button = buttons.nth(i);
          if (await button.isVisible()) {
            const boundingBox = await button.boundingBox();
            if (boundingBox) {
              const minSize = 44; // WCAG minimum touch target size
              if (boundingBox.width < minSize || boundingBox.height < minSize) {
                console.log(`⚠️ Touch target too small: ${boundingBox.width}x${boundingBox.height}px`);
              } else {
                console.log(`✅ Touch target adequate: ${boundingBox.width}x${boundingBox.height}px`);
              }
            }
          }
        }
      }
    }
  });

  test('DEBUG: Console errors and network monitoring', async ({ page }) => {
    console.log('🔍 Monitoring console errors and network requests...');
    
    // Listen for console messages
    const consoleMessages: string[] = [];
    page.on('console', (message) => {
      const msg = `${message.type()}: ${message.text()}`;
      consoleMessages.push(msg);
      console.log(`🖥️ Console: ${msg}`);
    });
    
    // Listen for network failures
    const networkErrors: string[] = [];
    page.on('response', (response) => {
      if (response.status() >= 400) {
        const error = `${response.status()} ${response.statusText()} - ${response.url()}`;
        networkErrors.push(error);
        console.log(`🌐 Network Error: ${error}`);
        
        // Special attention to the 401 error we just fixed
        if (response.status() === 401 && response.url().includes('/api/ai/story-generation')) {
          console.log('🚨 Found the 401 error we were supposed to fix!');
          console.log('This indicates our fix may not be working properly.');
        }
      }
    });
    
    // Navigate and interact with the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Try to trigger the story generation API
    const titleField = page.locator('input[name="title"], input[placeholder*="title" i], #title');
    if (await titleField.count() > 0) {
      await titleField.first().fill('Network Test Adventure');
    }
    
    // Look for and click story generation
    const storyButton = page.locator('button, a').filter({ hasText: /story|ai|generate/i });
    if (await storyButton.count() > 0) {
      console.log('🎯 Clicking story button to test network requests...');
      await storyButton.first().click();
      await page.waitForTimeout(3000);
    }
    
    // Report findings
    console.log(`\n📊 DEBUG SUMMARY:`);
    console.log(`Console messages: ${consoleMessages.length}`);
    console.log(`Network errors: ${networkErrors.length}`);
    
    if (networkErrors.length > 0) {
      console.log(`❌ Network errors found:`);
      networkErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    } else {
      console.log(`✅ No network errors detected`);
    }
  });

  test('DEBUG: Interactive pause for manual testing', async ({ page }) => {
    console.log('🛑 Interactive debug mode - manual testing enabled');
    console.log('The browser will stay open for manual interaction...');
    
    // Fill out some basic form data
    const titleField = page.locator('input[name="title"], input[placeholder*="title" i], #title');
    if (await titleField.count() > 0) {
      await titleField.first().fill('Manual Debug Adventure');
      console.log('📝 Pre-filled title for manual testing');
    }
    
    await page.screenshot({ path: 'debug-screenshots/manual-debug-start.png' });
    
    // Pause for manual interaction
    console.log('🔍 You can now manually interact with the page...');
    console.log('- Test the story generation modal');
    console.log('- Fill out forms');  
    console.log('- Check responsive design');
    console.log('- Monitor network tab for API calls');
    
    await page.pause(); // This will pause execution and keep browser open
  });
});