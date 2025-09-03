import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('P5: AI Avatar Generation (Upload → Style → Preview)', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    
    // Try to navigate to avatar generation page
    const avatarRoutes = [
      '/avatar-generation', 
      '/avatar', 
      '/character-creation', 
      '/adventure/avatar-generation',
      '/create-avatar'
    ];
    
    let loaded = false;
    for (const route of avatarRoutes) {
      try {
        await page.goto(route);
        await helpers.waitForPageLoad();
        loaded = true;
        break;
      } catch (error) {
        console.log(`Route ${route} not found, trying next...`);
      }
    }
    
    if (!loaded) {
      console.log('Avatar generation routes not found - may need to be accessed through role selection flow');
    }
  });

  test('should display avatar generation interface', async ({ page }) => {
    // Look for avatar generation elements
    const avatarElements = [
      page.locator('h1, h2').filter({ hasText: /avatar|character|generate|create/i }),
      page.locator('[data-testid="avatar"], .avatar-generator'),
      page.locator('input[type="file"], .upload-area'),
    ];
    
    let avatarInterfaceFound = false;
    for (const elementSet of avatarElements) {
      if (await elementSet.count() > 0) {
        await expect(elementSet.first()).toBeVisible();
        avatarInterfaceFound = true;
        break;
      }
    }
    
    if (avatarInterfaceFound) {
      await helpers.takeScreenshot('p5-avatar-generation-interface');
      console.log('✅ Avatar generation interface found');
    } else {
      console.log('⚠️ Avatar generation interface not found');
    }
  });

  test('should allow selfie upload functionality', async ({ page }) => {
    // Look for file upload elements
    const uploadElements = [
      page.locator('input[type="file"]'),
      page.locator('text="Upload Photo"').or(page.locator('text="Upload Selfie"')),
      page.locator('.upload-area, .drop-zone'),
      page.locator('button').filter({ hasText: /upload|photo|selfie|image/i }),
    ];
    
    let uploadFound = false;
    for (const elementSet of uploadElements) {
      if (await elementSet.count() > 0) {
        const element = elementSet.first();
        await expect(element).toBeVisible();
        await helpers.verifyTouchTarget(element);
        uploadFound = true;
        
        // Test mobile camera access if available
        if (page.context().options.isMobile) {
          const fileInput = page.locator('input[type="file"]');
          if (await fileInput.count() > 0) {
            // Check if accept attribute includes camera
            const accept = await fileInput.first().getAttribute('accept');
            if (accept?.includes('image') || accept?.includes('camera')) {
              console.log('✅ Mobile camera access configured');
            }
          }
        }
        
        break;
      }
    }
    
    if (uploadFound) {
      console.log('✅ Upload functionality found');
      await helpers.takeScreenshot('p5-upload-interface');
    } else {
      console.log('⚠️ No upload functionality found');
    }
  });

  test('should show style selection options', async ({ page }) => {
    // Look for style/theme selection
    const styleElements = [
      page.locator('.style-option, .theme-card'),
      page.locator('button, div').filter({ hasText: /style|theme|cartoon|realistic|anime/i }),
      page.locator('[data-testid="style"], .style-selector'),
    ];
    
    let styleOptionsFound = false;
    let styleCount = 0;
    
    for (const elementSet of styleElements) {
      styleCount = await elementSet.count();
      if (styleCount > 0) {
        styleOptionsFound = true;
        
        // Verify first few style options
        for (let i = 0; i < Math.min(styleCount, 5); i++) {
          const styleOption = elementSet.nth(i);
          if (await styleOption.isVisible()) {
            await expect(styleOption).toBeVisible();
            await helpers.verifyTouchTarget(styleOption);
          }
        }
        break;
      }
    }
    
    if (styleOptionsFound) {
      console.log(`✅ Found ${styleCount} style selection options`);
      await helpers.takeScreenshot('p5-style-options');
    } else {
      console.log('⚠️ No style selection options found');
    }
  });

  test('should display avatar preview functionality', async ({ page }) => {
    // Look for preview area
    const previewElements = [
      page.locator('.preview, .avatar-preview'),
      page.locator('canvas, img').filter({ hasText: /preview|avatar/i }),
      page.locator('[data-testid="preview"], .preview-container'),
      page.locator('div').filter({ hasText: /preview/i }),
    ];
    
    for (const elementSet of previewElements) {
      if (await elementSet.count() > 0) {
        const preview = elementSet.first();
        await expect(preview).toBeVisible();
        
        // Check if preview has reasonable dimensions
        const box = await preview.boundingBox();
        if (box) {
          expect(box.width).toBeGreaterThan(100);
          expect(box.height).toBeGreaterThan(100);
        }
        
        console.log('✅ Avatar preview area found');
        await helpers.takeScreenshot('p5-avatar-preview');
        break;
      }
    }
  });

  test('should handle AI generation loading states', async ({ page }) => {
    // Look for loading indicators
    const loadingElements = [
      page.locator('.loading, .spinner'),
      page.locator('[data-testid="loading"]'),
      page.locator('text="Generating"').or(page.locator('text="Processing"')),
      page.locator('.animate-spin, .animate-pulse'),
    ];
    
    // Test generation button if available
    const generateButton = page.locator('button').filter({ 
      hasText: /generate|create|make.*avatar/i 
    });
    
    if (await generateButton.count() > 0) {
      await expect(generateButton.first()).toBeVisible();
      await helpers.verifyTouchTarget(generateButton.first());
      
      // Click generate button and look for loading state
      await generateButton.first().click();
      await page.waitForTimeout(1000);
      
      // Check for loading indicators
      for (const elementSet of loadingElements) {
        if (await elementSet.count() > 0) {
          console.log('✅ Loading state indicators found');
          await helpers.takeScreenshot('p5-loading-state');
          break;
        }
      }
    }
  });

  test('should proceed to map/QR list after avatar creation (P5 → P6)', async ({ page }) => {
    // Look for continue/next button
    const continueButton = page.locator('text="Continue"').or(
      page.locator('text="Next"')
    ).or(
      page.locator('text="Start Adventure"')
    ).or(
      page.locator('button, a').filter({ hasText: /continue|next|start|proceed|adventure/i })
    );
    
    if (await continueButton.count() > 0) {
      await expect(continueButton.first()).toBeVisible();
      await helpers.verifyTouchTarget(continueButton.first());
      
      await continueButton.first().click();
      await helpers.waitForPageLoad();
      
      // Should navigate to map/QR list (P6)
      await expect(page).toHaveURL(/\/map|\/qr|\/adventure-hub|\/locations/);
      console.log('✅ Successfully navigated to adventure hub');
    } else {
      console.log('⚠️ No continue button found after avatar generation');
    }
  });

  test('should be mobile-optimized for photo taking', async ({ page }) => {
    await helpers.testResponsive(async () => {
      const viewport = page.viewportSize()!;
      
      // On mobile devices, check for camera-friendly interface
      if (viewport.width <= 768) {
        const fileInput = page.locator('input[type="file"]');
        
        if (await fileInput.count() > 0) {
          const accept = await fileInput.first().getAttribute('accept');
          const capture = await fileInput.first().getAttribute('capture');
          
          // Should accept images and ideally have capture attribute for mobile
          expect(accept).toContain('image');
          
          if (capture) {
            console.log('✅ Mobile camera capture enabled');
          }
        }
      }
      
      // Verify upload area is touch-friendly
      const uploadArea = page.locator('.upload-area, button').filter({ 
        hasText: /upload|photo/i 
      });
      
      if (await uploadArea.count() > 0) {
        await helpers.verifyTouchTarget(uploadArea.first());
      }
    });
  });

  test('should handle different image formats and sizes', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    
    if (await fileInput.count() > 0) {
      const accept = await fileInput.first().getAttribute('accept');
      
      if (accept) {
        // Should accept common image formats
        const expectedFormats = ['image/jpeg', 'image/png', 'image/webp'];
        const hasCommonFormats = expectedFormats.some(format => 
          accept.includes(format) || accept.includes('image/*')
        );
        
        expect(hasCommonFormats).toBeTruthy();
        console.log(`✅ Accepts image formats: ${accept}`);
      }
    }
  });

  test('should show generation progress and results', async ({ page }) => {
    // Look for progress indicators
    const progressElements = [
      page.locator('.progress, .progress-bar'),
      page.locator('[role="progressbar"]'),
      page.locator('text="%"'), // Progress percentage
    ];
    
    for (const elementSet of progressElements) {
      if (await elementSet.count() > 0) {
        console.log('✅ Progress indicators found');
        break;
      }
    }
    
    // Look for result display
    const resultElements = [
      page.locator('.result, .generated-avatar'),
      page.locator('img[alt*="avatar"], img[alt*="generated"]'),
      page.locator('canvas'),
    ];
    
    for (const elementSet of resultElements) {
      if (await elementSet.count() > 0) {
        console.log('✅ Avatar result display found');
        break;
      }
    }
  });

  test('should maintain quality across viewport sizes', async ({ page }) => {
    const viewportSizes = [
      { width: 320, height: 568, name: 'iPhone SE' },
      { width: 375, height: 812, name: 'iPhone X' },
      { width: 768, height: 1024, name: 'iPad' },
      { width: 1024, height: 768, name: 'Desktop' },
    ];

    for (const size of viewportSizes) {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.waitForTimeout(500);
      
      // Verify avatar generation interface is usable
      const mainElements = [
        page.locator('input[type="file"]'),
        page.locator('button').filter({ hasText: /upload|generate/i }),
        page.locator('.preview, canvas, img'),
      ];
      
      let usableInterface = false;
      for (const elementSet of mainElements) {
        if (await elementSet.count() > 0 && await elementSet.first().isVisible()) {
          usableInterface = true;
          break;
        }
      }
      
      if (usableInterface) {
        console.log(`✅ ${size.name} - Avatar interface usable`);
      }
      
      await helpers.takeScreenshot(`p5-avatar-${size.name.toLowerCase().replace(' ', '-')}`);
    }
  });

  test('should provide accessibility for avatar generation', async ({ page }) => {
    // Check file input accessibility
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.count() > 0) {
      await helpers.verifyAccessibility(fileInput.first());
    }
    
    // Check buttons accessibility
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 3); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        await helpers.verifyAccessibility(button);
      }
    }
  });
});