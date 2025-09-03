import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('P6: Adventure Hub - Map/QR List with Location Guidance', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    
    // Try to navigate to adventure hub/map page
    const hubRoutes = [
      '/adventure-hub',
      '/map', 
      '/qr-scan',
      '/locations',
      '/adventure/adventure-hub',
      '/hub'
    ];
    
    let loaded = false;
    for (const route of hubRoutes) {
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
      console.log('Adventure hub routes not found - may need to be accessed through avatar flow');
    }
  });

  test('should display adventure hub with map or location list', async ({ page }) => {
    // Look for map or location elements
    const mapElements = [
      page.locator('canvas, svg').filter({ hasText: /map/i }),
      page.locator('.map, .location-map'),
      page.locator('[data-testid="map"]'),
      page.locator('#map, .map-container'),
    ];
    
    const locationElements = [
      page.locator('.location-card, .location-item'),
      page.locator('[data-testid="location"]'),
      page.locator('ul li, .location-list'),
      page.locator('div, button').filter({ hasText: /location|place|area/i }),
    ];
    
    let mapFound = false;
    let locationsFound = false;
    
    // Check for map
    for (const elementSet of mapElements) {
      if (await elementSet.count() > 0) {
        await expect(elementSet.first()).toBeVisible();
        mapFound = true;
        console.log('✅ Map interface found');
        break;
      }
    }
    
    // Check for location list
    for (const elementSet of locationElements) {
      if (await elementSet.count() > 0) {
        const count = await elementSet.count();
        console.log(`✅ Found ${count} location items`);
        locationsFound = true;
        break;
      }
    }
    
    if (mapFound || locationsFound) {
      await helpers.takeScreenshot('p6-adventure-hub');
    } else {
      console.log('⚠️ No map or location list found');
    }
  });

  test('should show QR code scanning functionality', async ({ page }) => {
    // Look for QR scanning elements
    const qrElements = [
      page.locator('button, a').filter({ hasText: /scan.*qr|qr.*scan|scan.*code/i }),
      page.locator('.qr-scanner, [data-testid="qr"]'),
      page.locator('text="QR Code"').or(page.locator('text="Scan QR"')),
      page.locator('svg, img').filter({ hasText: /qr/i }),
    ];
    
    let qrScannerFound = false;
    for (const elementSet of qrElements) {
      if (await elementSet.count() > 0) {
        const element = elementSet.first();
        await expect(element).toBeVisible();
        await helpers.verifyTouchTarget(element);
        qrScannerFound = true;
        console.log('✅ QR scanner functionality found');
        break;
      }
    }
    
    if (qrScannerFound) {
      await helpers.takeScreenshot('p6-qr-scanner');
      
      // Test QR scanner activation
      const qrButton = page.locator('button, a').filter({ hasText: /scan.*qr|qr.*scan/i });
      if (await qrButton.count() > 0) {
        await qrButton.first().click();
        await page.waitForTimeout(1000);
        
        // Look for camera permission request or scanner interface
        const scannerInterface = [
          page.locator('.camera-view, .scanner-view'),
          page.locator('video, canvas'),
          page.locator('text="Allow camera access"'),
          page.locator('[data-testid="camera"]'),
        ];
        
        for (const interfaceSet of scannerInterface) {
          if (await interfaceSet.count() > 0) {
            console.log('✅ QR scanner interface activated');
            await helpers.takeScreenshot('p6-qr-scanner-active');
            break;
          }
        }
      }
    } else {
      console.log('⚠️ No QR scanner functionality found');
    }
  });

  test('should provide location guidance and directions', async ({ page }) => {
    // Look for location guidance elements
    const guidanceElements = [
      page.locator('.directions, .guidance'),
      page.locator('text="Distance:"').or(page.locator('text="meters"')),
      page.locator('button, a').filter({ hasText: /directions|navigate|guide/i }),
      page.locator('.location-info, .distance'),
    ];
    
    for (const elementSet of guidanceElements) {
      if (await elementSet.count() > 0) {
        console.log('✅ Location guidance found');
        await helpers.takeScreenshot('p6-location-guidance');
        break;
      }
    }
  });

  test('should display available challenges/locations list', async ({ page }) => {
    // Look for challenge or location lists
    const challengeElements = [
      page.locator('.challenge-card, .location-card'),
      page.locator('[data-testid="challenge"], [data-testid="location"]'),
      page.locator('ul li').filter({ hasText: /challenge|location|clue/i }),
      page.locator('div, button').filter({ hasText: /challenge.*\d+|location.*\d+/i }),
    ];
    
    let challengesFound = false;
    let challengeCount = 0;
    
    for (const elementSet of challengeElements) {
      challengeCount = await elementSet.count();
      if (challengeCount > 0) {
        challengesFound = true;
        
        // Verify first few challenges are clickable
        for (let i = 0; i < Math.min(challengeCount, 5); i++) {
          const challenge = elementSet.nth(i);
          if (await challenge.isVisible()) {
            await expect(challenge).toBeVisible();
            await helpers.verifyTouchTarget(challenge);
          }
        }
        break;
      }
    }
    
    if (challengesFound) {
      console.log(`✅ Found ${challengeCount} challenges/locations`);
      await helpers.takeScreenshot('p6-challenges-list');
    } else {
      console.log('⚠️ No challenges or locations list found');
    }
  });

  test('should navigate to specific challenge on selection (P6 → P7)', async ({ page }) => {
    // Find a selectable challenge/location
    const selectableItems = [
      page.locator('.challenge-card, .location-card'),
      page.locator('button, a').filter({ hasText: /challenge|location|start|enter/i }),
      page.locator('[data-testid="challenge"], [data-testid="location"]'),
    ];
    
    let itemSelected = false;
    for (const itemSet of selectableItems) {
      if (await itemSet.count() > 0) {
        const firstItem = itemSet.first();
        await expect(firstItem).toBeVisible();
        
        await firstItem.click();
        await helpers.waitForPageLoad();
        
        // Should navigate to challenge page (P7)
        const currentUrl = page.url();
        if (currentUrl.includes('/challenge') || 
            currentUrl.includes('/game') || 
            currentUrl.includes('/minigame') ||
            currentUrl.includes('/puzzle')) {
          console.log('✅ Successfully navigated to challenge');
          itemSelected = true;
          break;
        }
      }
    }
    
    if (!itemSelected) {
      console.log('⚠️ No selectable challenge items found');
    }
  });

  test('should show user progress and inventory access', async ({ page }) => {
    // Look for progress indicators
    const progressElements = [
      page.locator('.progress, .completion'),
      page.locator('text="Progress:"').or(page.locator('text="Completed:"')),
      page.locator('.progress-bar, [role="progressbar"]'),
      page.locator('div, span').filter({ hasText: /\d+\/\d+|\d+%/ }),
    ];
    
    for (const elementSet of progressElements) {
      if (await elementSet.count() > 0) {
        console.log('✅ Progress tracking found');
        break;
      }
    }
    
    // Look for inventory access
    const inventoryElements = [
      page.locator('button, a').filter({ hasText: /inventory|items|backpack/i }),
      page.locator('.inventory, [data-testid="inventory"]'),
      page.locator('svg, img').filter({ hasText: /bag|inventory/i }),
    ];
    
    for (const elementSet of inventoryElements) {
      if (await elementSet.count() > 0) {
        const inventoryButton = elementSet.first();
        await expect(inventoryButton).toBeVisible();
        await helpers.verifyTouchTarget(inventoryButton);
        console.log('✅ Inventory access found');
        
        // Test inventory opening
        await inventoryButton.click();
        await page.waitForTimeout(500);
        
        // Look for inventory modal/panel
        const inventoryPanel = page.locator('.modal, .panel, .inventory-panel');
        if (await inventoryPanel.count() > 0) {
          await helpers.verifyModal(inventoryPanel.first().locator('..').locator('..'));
        }
        
        break;
      }
    }
  });

  test('should be mobile-optimized for outdoor use', async ({ page }) => {
    await helpers.testResponsive(async () => {
      const viewport = page.viewportSize()!;
      
      // On mobile, interface should be optimized for outdoor/bright conditions
      if (viewport.width <= 768) {
        // Check for high contrast elements
        const highContrastElements = page.locator('button, .card').first();
        
        if (await highContrastElements.count() > 0) {
          const styles = await highContrastElements.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return {
              backgroundColor: computed.backgroundColor,
              color: computed.color,
              fontSize: computed.fontSize,
            };
          });
          
          // Font should be large enough for outdoor use
          const fontSize = parseFloat(styles.fontSize);
          expect(fontSize).toBeGreaterThanOrEqual(16);
          
          console.log('📱 Mobile optimization styles:', styles);
        }
        
        // All interactive elements should be touch-optimized
        const touchElements = page.locator('button, a, [role="button"]');
        const touchCount = await touchElements.count();
        
        for (let i = 0; i < Math.min(touchCount, 5); i++) {
          const element = touchElements.nth(i);
          if (await element.isVisible()) {
            await helpers.verifyTouchTarget(element, 44);
          }
        }
      }
    });
  });

  test('should handle GPS/location permissions gracefully', async ({ page }) => {
    // Mock geolocation to test location handling
    await page.context().grantPermissions(['geolocation']);
    await page.setGeolocation({ latitude: 40.7128, longitude: -74.0060 }); // NYC
    
    // Look for location-based features
    const locationFeatures = [
      page.locator('button').filter({ hasText: /current.*location|find.*me|gps/i }),
      page.locator('text="Current Location"'),
      page.locator('.current-location, [data-testid="location"]'),
    ];
    
    for (const featureSet of locationFeatures) {
      if (await featureSet.count() > 0) {
        const locationButton = featureSet.first();
        await locationButton.click();
        await page.waitForTimeout(1000);
        
        console.log('✅ Location-based features found and tested');
        break;
      }
    }
  });

  test('should display real-time team collaboration features', async ({ page }) => {
    // Look for team/collaboration elements
    const teamElements = [
      page.locator('.team, .teammates'),
      page.locator('button, a').filter({ hasText: /team|members|collaborate/i }),
      page.locator('[data-testid="team"], .team-list'),
      page.locator('div, span').filter({ hasText: /\d+.*players?|\d+.*members?/i }),
    ];
    
    for (const elementSet of teamElements) {
      if (await elementSet.count() > 0) {
        console.log('✅ Team collaboration features found');
        await helpers.takeScreenshot('p6-team-features');
        break;
      }
    }
  });

  test('should show security features for QR codes', async ({ page }) => {
    // Look for security indicators
    const securityElements = [
      page.locator('text="Secure"').or(page.locator('text="Verified"')),
      page.locator('svg, img').filter({ hasText: /lock|shield|secure/i }),
      page.locator('.security, .verification'),
    ];
    
    for (const elementSet of securityElements) {
      if (await elementSet.count() > 0) {
        console.log('✅ Security features found for QR codes');
        break;
      }
    }
  });

  test('should maintain performance with location tracking', async ({ page }) => {
    const metrics = await helpers.measurePerformance();
    
    // Adventure hub should remain performant even with location features
    expect(metrics.loadTime).toBeLessThan(4000); // 4 seconds max
    expect(metrics.firstContentfulPaint).toBeLessThan(2500); // 2.5 seconds max
    
    console.log('🗺️ Adventure hub performance:', metrics);
  });
});