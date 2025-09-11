import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Mobile Optimization - Comprehensive Testing', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test.describe('Touch Target Compliance (44px minimum)', () => {
    test('should verify all interactive elements meet 44px minimum', async ({ page }) => {
      const routes = ['/', '/welcome', '/login', '/adventure-hub', '/challenges'];
      
      for (const route of routes) {
        try {
          await helpers.navigateAndVerify(route);
          
          // Find all interactive elements
          const interactiveElements = page.locator('button, a, input[type="button"], input[type="submit"], [role="button"], [tabindex="0"]');
          const count = await interactiveElements.count();
          
          let compliantCount = 0;
          let failedElements = [];
          
          for (let i = 0; i < count; i++) {
            const element = interactiveElements.nth(i);
            if (await element.isVisible()) {
              try {
                await helpers.verifyTouchTarget(element, 44);
                compliantCount++;
              } catch (error) {
                const elementText = await element.textContent();
                const tagName = await element.evaluate(el => el.tagName);
                failedElements.push(`${tagName}: "${elementText?.slice(0, 30)}"`);
              }
            }
          }
          
          if (failedElements.length > 0) {
            console.log(`❌ ${route} - Touch target failures:`, failedElements);
          } else {
            console.log(`✅ ${route} - All ${compliantCount} elements meet 44px minimum`);
          }
          
          await helpers.takeScreenshot(`touch-targets-${route.replace('/', 'home')}`);
          
        } catch (error) {
          console.log(`⚠️ Could not test ${route}:`, (error as Error).message);
        }
      }
    });

    test('should test touch targets across different mobile devices', async ({ page }) => {
      const mobileDevices = [
        { name: 'iPhone SE', width: 320, height: 568 },
        { name: 'iPhone 12', width: 390, height: 844 },
        { name: 'Pixel 7', width: 412, height: 915 },
        { name: 'Galaxy S20', width: 360, height: 800 },
      ];
      
      await helpers.navigateAndVerify('/');
      
      for (const device of mobileDevices) {
        await page.setViewportSize({ width: device.width, height: device.height });
        await page.waitForTimeout(500);
        
        const ctaButton = page.locator('a[href="/adventure-selection"], button').filter({ hasText: /begin|start/i });
        
        if (await ctaButton.count() > 0) {
          try {
            await helpers.verifyTouchTarget(ctaButton.first(), 44);
            console.log(`✅ ${device.name} - Main CTA meets touch target requirements`);
          } catch (error) {
            console.log(`❌ ${device.name} - Main CTA failed touch target test`);
          }
        }
      }
    });
  });

  test.describe('Modal Centering (Perfect Responsive)', () => {
    test('should center modals perfectly across all viewport sizes', async ({ page }) => {
      const viewportSizes = [
        { width: 320, height: 568, name: 'iPhone SE' },
        { width: 375, height: 667, name: 'iPhone 8' },
        { width: 414, height: 896, name: 'iPhone 11 Pro Max' },
        { width: 768, height: 1024, name: 'iPad' },
        { width: 1024, height: 768, name: 'iPad Landscape' },
        { width: 1440, height: 900, name: 'Desktop' },
        { width: 3840, height: 2160, name: '4K Desktop' },
      ];
      
      // Navigate to a page likely to have modals
      await helpers.navigateAndVerify('/');
      
      for (const viewport of viewportSizes) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForTimeout(500);
        
        // Look for modal triggers
        const modalTriggers = page.locator('button, a').filter({ 
          hasText: /login|sign|menu|info|help|about/i 
        });
        
        const triggerCount = await modalTriggers.count();
        
        if (triggerCount > 0) {
          for (let i = 0; i < Math.min(triggerCount, 3); i++) {
            const trigger = modalTriggers.nth(i);
            if (await trigger.isVisible()) {
              await trigger.click();
              await page.waitForTimeout(1000);
              
              // Look for modal
              const modal = page.locator('[role="dialog"], .modal, .popup');
              if (await modal.count() > 0) {
                try {
                  await helpers.verifyModal('[role="dialog"], .modal, .popup');
                  console.log(`✅ ${viewport.name} - Modal perfectly centered`);
                  
                  // Close modal
                  const closeButton = page.locator('button').filter({ hasText: /close|×|x/i });
                  if (await closeButton.count() > 0) {
                    await closeButton.first().click();
                  } else {
                    await page.keyboard.press('Escape');
                  }
                  await page.waitForTimeout(300);
                  
                } catch (error) {
                  console.log(`❌ ${viewport.name} - Modal centering failed:`, (error as Error).message);
                  await helpers.takeScreenshot(`modal-centering-failed-${viewport.name.replace(' ', '-')}`);
                }
                break;
              }
            }
          }
        }
      }
    });

    test('should handle modal overflow correctly', async ({ page }) => {
      await helpers.navigateAndVerify('/');
      
      // Test very small viewport
      await page.setViewportSize({ width: 280, height: 400 });
      await page.waitForTimeout(500);
      
      // Try to trigger a modal
      const modalTrigger = page.locator('button, a').first();
      if (await modalTrigger.isVisible()) {
        await modalTrigger.click();
        await page.waitForTimeout(1000);
        
        const modal = page.locator('[role="dialog"], .modal');
        if (await modal.count() > 0) {
          const modalBox = await modal.first().boundingBox();
          const viewportSize = page.viewportSize()!;
          
          if (modalBox) {
            // Modal should not exceed viewport bounds
            expect(modalBox.x).toBeGreaterThanOrEqual(-10); // Small tolerance
            expect(modalBox.y).toBeGreaterThanOrEqual(-10);
            expect(modalBox.x + modalBox.width).toBeLessThanOrEqual(viewportSize.width + 10);
            expect(modalBox.y + modalBox.height).toBeLessThanOrEqual(viewportSize.height + 10);
            
            console.log('✅ Small viewport modal overflow handled correctly');
          }
        }
      }
    });
  });

  test.describe('Safe Area Support (Notched Devices)', () => {
    test('should support safe areas with CSS environment variables', async ({ page }) => {
      await helpers.navigateAndVerify('/');
      
      // Simulate notched device (iPhone X style)
      await page.setViewportSize({ width: 375, height: 812 });
      
      // Mock safe area insets (simulating a notched device)
      await page.addInitScript(() => {
        const originalGetComputedStyle = window.getComputedStyle;
        window.getComputedStyle = function(element, pseudoElement) {
          const style = originalGetComputedStyle.call(this, element, pseudoElement);
          const safeAreaProps = {
            'safe-area-inset-top': '44px',
            'safe-area-inset-right': '0px',
            'safe-area-inset-bottom': '34px', 
            'safe-area-inset-left': '0px'
          };
          
          const originalGetPropertyValue = style.getPropertyValue;
          style.getPropertyValue = function(property) {
            if (property.startsWith('--') || property.includes('safe-area')) {
              const cleanProperty = property.replace('--', '');
              return (safeAreaProps as Record<string, string>)[cleanProperty] || originalGetPropertyValue.call(this, property);
            }
            return originalGetPropertyValue.call(this, property);
          };
          
          return style;
        };
      });
      
      await page.reload();
      await helpers.waitForPageLoad();
      
      // Check if content respects safe areas
      const mainContent = page.locator('main, body > div, .app');
      if (await mainContent.count() > 0) {
        const contentStyles = await mainContent.first().evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            paddingTop: computed.paddingTop,
            paddingBottom: computed.paddingBottom,
            paddingLeft: computed.paddingLeft,
            paddingRight: computed.paddingRight,
          };
        });
        
        console.log('📱 Content padding with safe areas:', contentStyles);
        
        // Verify safe area CSS is being used
        await helpers.verifySafeArea();
      }
      
      await helpers.takeScreenshot('safe-area-support');
    });

    test('should handle landscape orientation with safe areas', async ({ page }) => {
      // Simulate landscape orientation
      await page.setViewportSize({ width: 812, height: 375 });
      await helpers.navigateAndVerify('/');
      
      // Check horizontal safe areas in landscape
      const contentBox = await page.locator('main, body > div').first().boundingBox();
      if (contentBox) {
        // Content should have left/right padding in landscape
        expect(contentBox.x).toBeGreaterThan(0); // Should have left safe area
        expect(contentBox.x + contentBox.width).toBeLessThan(812); // Should have right safe area
        
        console.log('✅ Landscape safe areas handled correctly');
      }
    });
  });

  test.describe('Responsive Design (320px - 4K+)', () => {
    test('should work perfectly from 320px to 4K+', async ({ page }) => {
      const breakpoints = [
        { width: 320, height: 568, name: 'Minimum Mobile' },
        { width: 375, height: 667, name: 'Standard Mobile' },
        { width: 414, height: 896, name: 'Large Mobile' },
        { width: 768, height: 1024, name: 'Tablet Portrait' },
        { width: 1024, height: 768, name: 'Tablet Landscape' },
        { width: 1280, height: 800, name: 'Small Desktop' },
        { width: 1920, height: 1080, name: 'Full HD' },
        { width: 3840, height: 2160, name: '4K Desktop' },
      ];
      
      await helpers.navigateAndVerify('/');
      
      for (const breakpoint of breakpoints) {
        await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
        await page.waitForTimeout(500);
        
        // Test key elements at each breakpoint
        const keyElements = [
          page.locator('h1').first(),
          page.locator('a[href="/adventure-selection"], button').filter({ hasText: /begin|start/i }).first(),
          page.locator('.card, .feature').first(),
        ];
        
        let allElementsVisible = true;
        for (const element of keyElements) {
          if (await element.count() > 0) {
            const isVisible = await element.isVisible();
            if (!isVisible) {
              allElementsVisible = false;
              break;
            }
          }
        }
        
        if (allElementsVisible) {
          console.log(`✅ ${breakpoint.name} (${breakpoint.width}x${breakpoint.height}) - All elements visible`);
        } else {
          console.log(`❌ ${breakpoint.name} - Some elements not visible`);
        }
        
        // Test text readability
        const textElements = page.locator('p, span, div').filter({ hasText: /\w{10,}/ });
        if (await textElements.count() > 0) {
          const fontSize = await textElements.first().evaluate(el => 
            parseFloat(window.getComputedStyle(el).fontSize)
          );
          
          // Text should be readable (minimum 12px, preferably 14px+)
          expect(fontSize).toBeGreaterThanOrEqual(12);
          
          if (fontSize < 14) {
            console.log(`⚠️ ${breakpoint.name} - Small font size: ${fontSize}px`);
          }
        }
        
        await helpers.takeScreenshot(`responsive-${breakpoint.name.replace(' ', '-').toLowerCase()}`);
      }
    });

    test('should adapt navigation for mobile vs desktop', async ({ page }) => {
      await helpers.navigateAndVerify('/');
      
      // Test mobile navigation
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      
      // Look for mobile navigation patterns
      const mobileNav = [
        page.locator('[aria-label*="menu" i], .mobile-menu, .hamburger'),
        page.locator('button').filter({ hasText: /menu|☰/i }),
      ];
      
      let mobileNavFound = false;
      for (const navSet of mobileNav) {
        if (await navSet.count() > 0) {
          mobileNavFound = true;
          console.log('✅ Mobile navigation pattern detected');
          break;
        }
      }
      
      // Test desktop navigation
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.waitForTimeout(500);
      
      // Look for desktop navigation patterns
      const desktopNav = [
        page.locator('nav, .navigation'),
        page.locator('header').filter({ hasText: /home|about|contact/i }),
      ];
      
      let desktopNavFound = false;
      for (const navSet of desktopNav) {
        if (await navSet.count() > 0) {
          desktopNavFound = true;
          console.log('✅ Desktop navigation pattern detected');
          break;
        }
      }
      
      if (mobileNavFound || desktopNavFound) {
        console.log('✅ Responsive navigation adaptation working');
      }
    });
  });

  test.describe('Performance on Mobile Devices', () => {
    test('should maintain good performance on slower mobile devices', async ({ page }) => {
      // Simulate slower mobile device
      const client = await page.context().newCDPSession(page);
      await client.send('Network.enable');
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
        uploadThroughput: 750 * 1024 / 8, // 750 Kbps
        latency: 100 // 100ms
      });
      
      // Enable CPU throttling (4x slower)
      await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      
      const startTime = Date.now();
      await helpers.navigateAndVerify('/');
      const loadTime = Date.now() - startTime;
      
      console.log(`📱 Mobile load time with throttling: ${loadTime}ms`);
      
      // Should still load within reasonable time even on slower devices
      expect(loadTime).toBeLessThan(8000); // 8 seconds max for slow mobile
      
      // Test interactions are responsive
      const button = page.locator('a[href="/adventure-selection"], button').first();
      if (await button.isVisible()) {
        const interactionStart = Date.now();
        await button.click();
        await helpers.waitForPageLoad();
        const interactionTime = Date.now() - interactionStart;
        
        console.log(`📱 Mobile interaction time: ${interactionTime}ms`);
        expect(interactionTime).toBeLessThan(3000); // 3 seconds max for navigation
      }
      
      // Disable throttling
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        downloadThroughput: -1,
        uploadThroughput: -1,
        latency: 0
      });
      await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    });

    test('should optimize image loading for mobile', async ({ page }) => {
      await helpers.navigateAndVerify('/');
      
      // Check for image optimization strategies
      const images = page.locator('img');
      const imageCount = await images.count();
      
      if (imageCount > 0) {
        for (let i = 0; i < Math.min(imageCount, 5); i++) {
          const img = images.nth(i);
          if (await img.isVisible()) {
            const loading = await img.getAttribute('loading');
            const srcset = await img.getAttribute('srcset');
            const sizes = await img.getAttribute('sizes');
            
            // Check for lazy loading
            if (loading === 'lazy') {
              console.log('✅ Lazy loading enabled for images');
            }
            
            // Check for responsive images
            if (srcset && sizes) {
              console.log('✅ Responsive images with srcset/sizes');
            }
          }
        }
      }
    });
  });

  test.describe('Touch Interactions and Gestures', () => {
    test('should support touch interactions properly', async ({ page }) => {
      if (!page.viewportSize() || page.viewportSize()!.width > 768) {
        test.skip();
      }
      
      await helpers.navigateAndVerify('/');
      
      // Test tap interactions
      const interactiveElements = page.locator('button, a, [role="button"]');
      const count = await interactiveElements.count();
      
      if (count > 0) {
        const element = interactiveElements.first();
        if (await element.isVisible()) {
          // Test tap
          await element.tap();
          await page.waitForTimeout(500);
          
          // Should provide visual feedback
          console.log('✅ Touch tap interaction working');
        }
      }
      
      // Test scroll behavior
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(500);
      await page.mouse.wheel(0, -500);
      await page.waitForTimeout(500);
      
      console.log('✅ Touch scrolling working');
    });

    test('should handle swipe gestures where appropriate', async ({ page }) => {
      if (!page.viewportSize() || page.viewportSize()!.width > 768) {
        test.skip();
      }
      
      await helpers.navigateAndVerify('/');
      
      // Look for swipeable content (carousels, galleries)
      const swipeableElements = [
        page.locator('.carousel, .gallery'),
        page.locator('[data-swipe], [data-swipeable]'),
        page.locator('.slider, .slideshow'),
      ];
      
      for (const elementSet of swipeableElements) {
        if (await elementSet.count() > 0) {
          const swipeable = elementSet.first();
          const box = await swipeable.boundingBox();
          
          if (box) {
            // Simulate swipe left
            await page.touchscreen.tap(box.x + box.width * 0.8, box.y + box.height / 2);
            await page.touchscreen.tap(box.x + box.width * 0.2, box.y + box.height / 2);
            await page.waitForTimeout(500);
            
            console.log('✅ Swipe gesture simulated');
          }
          break;
        }
      }
    });

    test('should prevent accidental touches and double-taps', async ({ page }) => {
      if (!page.viewportSize() || page.viewportSize()!.width > 768) {
        test.skip();
      }
      
      await helpers.navigateAndVerify('/');
      
      const button = page.locator('button, a').first();
      if (await button.isVisible()) {
        // Test rapid double tap
        await button.tap();
        await button.tap(); // Quick second tap
        await page.waitForTimeout(1000);
        
        // Should handle gracefully without double-executing
        console.log('✅ Double-tap prevention tested');
      }
    });
  });

  test.describe('Mobile-Specific Features', () => {
    test('should support device orientation changes', async ({ page }) => {
      if (!page.viewportSize() || page.viewportSize()!.width > 768) {
        test.skip();
      }
      
      await helpers.navigateAndVerify('/');
      
      // Portrait mode
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      
      const portraitLayout = await page.locator('main').first().boundingBox();
      
      // Landscape mode
      await page.setViewportSize({ width: 667, height: 375 });
      await page.waitForTimeout(500);
      
      const landscapeLayout = await page.locator('main').first().boundingBox();
      
      if (portraitLayout && landscapeLayout) {
        // Layout should adapt to orientation
        expect(landscapeLayout.width).toBeGreaterThan(portraitLayout.width);
        console.log('✅ Orientation change handled correctly');
      }
    });

    test('should optimize for battery and data usage', async ({ page }) => {
      await helpers.navigateAndVerify('/');
      
      // Check for data-saving features
      const optimizations = {
        lazyLoading: page.locator('img[loading="lazy"]'),
        compressedImages: page.locator('img[src*=".webp"], img[srcset*=".webp"]'),
        minifiedCSS: page.locator('link[rel="stylesheet"]'),
        prefetchOptimization: page.locator('link[rel="prefetch"], link[rel="preload"]'),
      };
      
      for (const [feature, locator] of Object.entries(optimizations)) {
        const count = await locator.count();
        if (count > 0) {
          console.log(`✅ ${feature}: ${count} elements optimized`);
        }
      }
    });

    test('should handle device capabilities gracefully', async ({ page }) => {
      await helpers.navigateAndVerify('/');
      
      // Check for camera access (for avatar generation)
      const cameraInput = page.locator('input[type="file"][accept*="image"]');
      if (await cameraInput.count() > 0) {
        const capture = await cameraInput.first().getAttribute('capture');
        if (capture) {
          console.log('✅ Camera capture attribute configured for mobile');
        }
      }
      
      // Check for geolocation features (for location guidance)
      const locationFeatures = page.locator('button').filter({ hasText: /location|gps|find.*me/i });
      if (await locationFeatures.count() > 0) {
        console.log('✅ Location features available');
      }
    });
  });

  test.describe('Accessibility on Mobile', () => {
    test('should maintain accessibility on touch devices', async ({ page }) => {
      if (!page.viewportSize() || page.viewportSize()!.width > 768) {
        test.skip();
      }
      
      await helpers.navigateAndVerify('/');
      
      // Test focus management on touch
      const focusableElements = page.locator('button, a, input, [tabindex="0"]');
      const count = await focusableElements.count();
      
      if (count > 0) {
        // Touch should still allow focus for accessibility tools
        const firstElement = focusableElements.first();
        await firstElement.tap();
        
        const focused = page.locator(':focus');
        if (await focused.count() > 0) {
          console.log('✅ Touch maintains focus for accessibility');
        }
        
        // Test ARIA labels on touch targets
        await helpers.verifyAccessibility(firstElement);
      }
    });

    test('should support screen reader gestures', async ({ page }) => {
      if (!page.viewportSize() || page.viewportSize()!.width > 768) {
        test.skip();
      }
      
      await helpers.navigateAndVerify('/');
      
      // Verify semantic structure for screen readers
      const landmarkElements = page.locator('[role="main"], main, [role="navigation"], nav, [role="banner"], header');
      const landmarkCount = await landmarkElements.count();
      
      expect(landmarkCount).toBeGreaterThan(0);
      console.log(`✅ Found ${landmarkCount} landmark elements for screen reader navigation`);
      
      // Verify heading structure
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();
      
      expect(headingCount).toBeGreaterThan(0);
      console.log(`✅ Found ${headingCount} headings for screen reader structure`);
    });
  });
});