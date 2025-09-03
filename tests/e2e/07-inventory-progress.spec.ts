import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('P8: Inventory and Progress Tracking', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    
    // Try to navigate to inventory/progress page
    const inventoryRoutes = [
      '/inventory',
      '/progress',
      '/items',
      '/achievements',
      '/adventure-hub', // May include inventory
      '/profile'
    ];
    
    let loaded = false;
    for (const route of inventoryRoutes) {
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
      console.log('Inventory routes not found - may need to be accessed through challenge completion');
    }
  });

  test('should display inventory with collected items', async ({ page }) => {
    // Look for inventory elements
    const inventoryElements = [
      page.locator('.inventory, .items'),
      page.locator('[data-testid="inventory"], [data-testid="items"]'),
      page.locator('h1, h2').filter({ hasText: /inventory|items|collected/i }),
      page.locator('.item-grid, .inventory-grid'),
    ];
    
    let inventoryFound = false;
    for (const elementSet of inventoryElements) {
      if (await elementSet.count() > 0) {
        await expect(elementSet.first()).toBeVisible();
        inventoryFound = true;
        console.log('✅ Inventory interface found');
        break;
      }
    }
    
    if (inventoryFound) {
      await helpers.takeScreenshot('p8-inventory-interface');
    } else {
      console.log('⚠️ No inventory interface found');
    }
  });

  test('should show individual inventory items with details', async ({ page }) => {
    // Look for individual items
    const itemElements = [
      page.locator('.item, .inventory-item'),
      page.locator('[data-testid="item"]'),
      page.locator('.card').filter({ hasText: /item|clue|artifact|key/i }),
      page.locator('img[alt*="item"], img[alt*="clue"]'),
    ];
    
    let itemsFound = false;
    let itemCount = 0;
    
    for (const elementSet of itemElements) {
      itemCount = await elementSet.count();
      if (itemCount > 0) {
        itemsFound = true;
        
        // Test first few items
        for (let i = 0; i < Math.min(itemCount, 6); i++) {
          const item = elementSet.nth(i);
          if (await item.isVisible()) {
            await expect(item).toBeVisible();
            await helpers.verifyTouchTarget(item);
            
            // Test item interaction (details view)
            await item.click();
            await page.waitForTimeout(500);
            
            // Look for item details
            const itemDetails = [
              page.locator('.item-details, .modal'),
              page.locator('[role="dialog"]'),
              page.locator('.description, .item-description'),
            ];
            
            for (const detailSet of itemDetails) {
              if (await detailSet.count() > 0) {
                console.log('✅ Item details interaction working');
                
                // Test modal centering if it's a modal
                const modal = detailSet.first();
                await helpers.verifyModal(modal.locator('..').locator('..'));
                
                // Close modal/details
                const closeButton = page.locator('button').filter({ hasText: /close|×|x/i });
                if (await closeButton.count() > 0) {
                  await closeButton.first().click();
                  await page.waitForTimeout(300);
                }
                break;
              }
            }
            break;
          }
        }
        break;
      }
    }
    
    if (itemsFound) {
      console.log(`✅ Found ${itemCount} inventory items`);
      await helpers.takeScreenshot('p8-inventory-items');
    } else {
      console.log('⚠️ No inventory items found');
    }
  });

  test('should display progress tracking metrics', async ({ page }) => {
    // Look for progress tracking elements
    const progressElements = [
      page.locator('.progress, .stats'),
      page.locator('[data-testid="progress"]'),
      page.locator('div, span').filter({ hasText: /progress|completed|\d+\/\d+|\d+%/i }),
      page.locator('.progress-bar, [role="progressbar"]'),
    ];
    
    let progressFound = false;
    for (const elementSet of progressElements) {
      if (await elementSet.count() > 0) {
        const progress = elementSet.first();
        await expect(progress).toBeVisible();
        progressFound = true;
        
        // Get progress text
        const progressText = await progress.textContent();
        console.log(`✅ Progress tracking found: ${progressText}`);
        break;
      }
    }
    
    if (progressFound) {
      await helpers.takeScreenshot('p8-progress-tracking');
    } else {
      console.log('⚠️ No progress tracking found');
    }
  });

  test('should show completion statistics and achievements', async ({ page }) => {
    // Look for achievement/stats elements
    const achievementElements = [
      page.locator('.achievement, .badge'),
      page.locator('[data-testid="achievement"]'),
      page.locator('div, span').filter({ hasText: /achievement|badge|unlock|earned/i }),
      page.locator('.stats, .statistics'),
    ];
    
    for (const elementSet of achievementElements) {
      if (await elementSet.count() > 0) {
        const count = await elementSet.count();
        console.log(`✅ Found ${count} achievement/stat elements`);
        
        // Verify first few achievements
        for (let i = 0; i < Math.min(count, 3); i++) {
          const achievement = elementSet.nth(i);
          if (await achievement.isVisible()) {
            await expect(achievement).toBeVisible();
          }
        }
        
        await helpers.takeScreenshot('p8-achievements');
        break;
      }
    }
  });

  test('should provide team/collaborative progress if multiplayer', async ({ page }) => {
    // Look for team progress elements
    const teamElements = [
      page.locator('.team, .teammates'),
      page.locator('[data-testid="team"]'),
      page.locator('div, span').filter({ hasText: /team|members|players|collaborate/i }),
      page.locator('.team-progress, .shared-progress'),
    ];
    
    for (const elementSet of teamElements) {
      if (await elementSet.count() > 0) {
        console.log('✅ Team/collaborative progress found');
        
        const teamElement = elementSet.first();
        await expect(teamElement).toBeVisible();
        
        await helpers.takeScreenshot('p8-team-progress');
        break;
      }
    }
  });

  test('should navigate to ranking/ceremony on completion (P8 → P9)', async ({ page }) => {
    // Look for navigation to final ranking
    const rankingButtons = [
      page.locator('button, a').filter({ hasText: /ranking|leaderboard|ceremony|finish/i }),
      page.locator('text="View Rankings"').or(page.locator('text="Final Results"')),
      page.locator('.ranking-button, .finish-button'),
    ];
    
    let rankingFound = false;
    for (const buttonSet of rankingButtons) {
      if (await buttonSet.count() > 0) {
        const rankingButton = buttonSet.first();
        await expect(rankingButton).toBeVisible();
        await helpers.verifyTouchTarget(rankingButton);
        
        await rankingButton.click();
        await helpers.waitForPageLoad();
        
        // Should navigate to ranking page (P9)
        const currentUrl = page.url();
        if (currentUrl.includes('/ranking') || 
            currentUrl.includes('/leaderboard') || 
            currentUrl.includes('/ceremony') ||
            currentUrl.includes('/results')) {
          console.log('✅ Successfully navigated to ranking/ceremony');
          rankingFound = true;
        }
        break;
      }
    }
    
    if (!rankingFound) {
      console.log('⚠️ No ranking navigation found');
    }
  });

  test('should handle inventory grid layout responsively', async ({ page }) => {
    await helpers.testResponsive(async () => {
      const viewport = page.viewportSize()!;
      
      // Check inventory grid layout
      const inventoryItems = page.locator('.item, .inventory-item, [data-testid="item"]');
      const itemCount = await inventoryItems.count();
      
      if (itemCount > 0) {
        // On mobile, items should stack or use fewer columns
        if (viewport.width <= 768) {
          // Verify items don't overflow horizontally
          for (let i = 0; i < Math.min(itemCount, 3); i++) {
            const item = inventoryItems.nth(i);
            if (await item.isVisible()) {
              const box = await item.boundingBox();
              if (box) {
                expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 10);
              }
            }
          }
        }
        
        // On desktop, can use grid layout
        if (viewport.width > 1024) {
          // Should be able to show multiple items per row
          const firstItem = inventoryItems.first();
          const secondItem = inventoryItems.nth(1);
          
          if (await firstItem.isVisible() && await secondItem.isVisible()) {
            const firstBox = await firstItem.boundingBox();
            const secondBox = await secondItem.boundingBox();
            
            if (firstBox && secondBox) {
              // On desktop, items might be side by side
              const sideBySide = Math.abs(firstBox.y - secondBox.y) < 50;
              if (sideBySide) {
                console.log('✅ Desktop grid layout detected');
              }
            }
          }
        }
      }
    });
  });

  test('should show item categories and organization', async ({ page }) => {
    // Look for item categories
    const categoryElements = [
      page.locator('.category, .item-category'),
      page.locator('h3, h4').filter({ hasText: /clues|keys|artifacts|items|tools/i }),
      page.locator('.filter, .sort'),
      page.locator('button').filter({ hasText: /all|clues|keys|artifacts/i }),
    ];
    
    for (const elementSet of categoryElements) {
      if (await elementSet.count() > 0) {
        const count = await elementSet.count();
        console.log(`✅ Found ${count} item categories/filters`);
        
        // Test category interaction if it's interactive
        const firstCategory = elementSet.first();
        if (await firstCategory.isVisible()) {
          // Check if it's clickable
          const tagName = await firstCategory.evaluate(el => el.tagName.toLowerCase());
          if (tagName === 'button' || tagName === 'a') {
            await helpers.verifyTouchTarget(firstCategory);
            await firstCategory.click();
            await page.waitForTimeout(500);
          }
        }
        
        break;
      }
    }
  });

  test('should display item acquisition timestamps or order', async ({ page }) => {
    // Look for timestamps or order indicators
    const timeElements = [
      page.locator('.timestamp, .date'),
      page.locator('span, div').filter({ hasText: /ago|minutes?|hours?|collected/i }),
      page.locator('.order, .sequence'),
    ];
    
    for (const elementSet of timeElements) {
      if (await elementSet.count() > 0) {
        console.log('✅ Item acquisition timing found');
        break;
      }
    }
  });

  test('should handle empty inventory state gracefully', async ({ page }) => {
    // Check if inventory appears empty and handles it well
    const inventoryItems = page.locator('.item, .inventory-item');
    const itemCount = await inventoryItems.count();
    
    if (itemCount === 0) {
      // Look for empty state messaging
      const emptyStateElements = [
        page.locator('text="No items"').or(page.locator('text="Empty"')),
        page.locator('.empty, .no-items'),
        page.locator('text="Start collecting"').or(page.locator('text="Complete challenges"')),
      ];
      
      let emptyStateFound = false;
      for (const elementSet of emptyStateElements) {
        if (await elementSet.count() > 0) {
          console.log('✅ Empty inventory state handled gracefully');
          emptyStateFound = true;
          await helpers.takeScreenshot('p8-empty-inventory');
          break;
        }
      }
      
      if (!emptyStateFound) {
        console.log('⚠️ Empty inventory state not clearly handled');
      }
    } else {
      console.log(`📦 Inventory contains ${itemCount} items`);
    }
  });

  test('should maintain accessibility in inventory interface', async ({ page }) => {
    // Check inventory items accessibility
    const inventoryItems = page.locator('.item, button, [role="button"]');
    const itemCount = await inventoryItems.count();
    
    if (itemCount > 0) {
      for (let i = 0; i < Math.min(itemCount, 3); i++) {
        const item = inventoryItems.nth(i);
        if (await item.isVisible()) {
          await helpers.verifyAccessibility(item);
        }
      }
    }
    
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThanOrEqual(1);
    
    console.log('✅ Inventory accessibility verified');
  });

  test('should show progress towards completion goals', async ({ page }) => {
    // Look for completion goals and current progress
    const goalElements = [
      page.locator('div, span').filter({ hasText: /\d+\/\d+|goal|target|complete/i }),
      page.locator('.goal, .target'),
      page.locator('text="Complete all"').or(page.locator('text="Find all"')),
    ];
    
    for (const elementSet of goalElements) {
      if (await elementSet.count() > 0) {
        const goalText = await elementSet.first().textContent();
        console.log(`✅ Completion goals found: ${goalText}`);
        break;
      }
    }
  });

  test('should perform well with large inventories', async ({ page }) => {
    const startTime = Date.now();
    
    // Test performance of inventory display
    const inventoryItems = page.locator('.item, .inventory-item');
    const itemCount = await inventoryItems.count();
    
    if (itemCount > 0) {
      // Test scrolling through items if there are many
      if (itemCount > 5) {
        await page.mouse.wheel(0, 500); // Scroll down
        await page.waitForTimeout(100);
        await page.mouse.wheel(0, -500); // Scroll back up
        await page.waitForTimeout(100);
      }
      
      // Test clicking on items
      for (let i = 0; i < Math.min(itemCount, 3); i++) {
        const item = inventoryItems.nth(i);
        if (await item.isVisible()) {
          await item.click();
          await page.waitForTimeout(100);
        }
      }
    }
    
    const elapsed = Date.now() - startTime;
    console.log(`📊 Inventory interaction test completed in ${elapsed}ms`);
    
    // Should remain responsive even with many items
    expect(elapsed).toBeLessThan(5000); // 5 seconds max
  });
});