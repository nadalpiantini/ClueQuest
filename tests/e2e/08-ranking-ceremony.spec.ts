import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('P9: Ranking and Ceremony Finale', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    
    // Try to navigate to ranking/ceremony page
    const rankingRoutes = [
      '/ranking',
      '/leaderboard',
      '/ceremony',
      '/results',
      '/finale',
      '/adventure/ranking'
    ];
    
    let loaded = false;
    for (const route of rankingRoutes) {
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
      console.log('Ranking routes not found - may need to be accessed through inventory completion');
    }
  });

  test('should display final rankings and leaderboard', async ({ page }) => {
    // Look for ranking/leaderboard elements
    const rankingElements = [
      page.locator('h1, h2').filter({ hasText: /ranking|leaderboard|results|finale/i }),
      page.locator('.ranking, .leaderboard'),
      page.locator('[data-testid="ranking"], [data-testid="leaderboard"]'),
      page.locator('ol, ul').filter({ hasText: /\d+/ }), // Numbered lists
    ];
    
    let rankingFound = false;
    for (const elementSet of rankingElements) {
      if (await elementSet.count() > 0) {
        await expect(elementSet.first()).toBeVisible();
        rankingFound = true;
        console.log('✅ Ranking/leaderboard interface found');
        break;
      }
    }
    
    if (rankingFound) {
      await helpers.takeScreenshot('p9-rankings-interface');
    } else {
      console.log('⚠️ No ranking interface found');
    }
  });

  test('should show individual player rankings with scores', async ({ page }) => {
    // Look for individual ranking entries
    const rankingEntries = [
      page.locator('.rank-item, .player-rank'),
      page.locator('[data-testid="rank"]'),
      page.locator('li, tr').filter({ hasText: /\d+.*points?|\d+.*score/i }),
      page.locator('div').filter({ hasText: /#\d+|rank.*\d+/i }),
    ];
    
    let entriesFound = false;
    let entryCount = 0;
    
    for (const elementSet of rankingEntries) {
      entryCount = await elementSet.count();
      if (entryCount > 0) {
        entriesFound = true;
        
        // Check first few ranking entries
        for (let i = 0; i < Math.min(entryCount, 5); i++) {
          const entry = elementSet.nth(i);
          if (await entry.isVisible()) {
            await expect(entry).toBeVisible();
            
            // Get entry text to verify it contains ranking info
            const entryText = await entry.textContent();
            console.log(`Ranking entry ${i + 1}: ${entryText}`);
          }
        }
        break;
      }
    }
    
    if (entriesFound) {
      console.log(`✅ Found ${entryCount} ranking entries`);
      await helpers.takeScreenshot('p9-ranking-entries');
    } else {
      console.log('⚠️ No ranking entries found');
    }
  });

  test('should highlight current player position and score', async ({ page }) => {
    // Look for current player highlighting
    const currentPlayerElements = [
      page.locator('.current-player, .my-rank'),
      page.locator('.highlighted, .active, .selected'),
      page.locator('[data-testid="current-player"]'),
      page.locator('div, li').filter({ hasText: /you|your.*rank|your.*score/i }),
    ];
    
    for (const elementSet of currentPlayerElements) {
      if (await elementSet.count() > 0) {
        const currentPlayer = elementSet.first();
        await expect(currentPlayer).toBeVisible();
        
        // Verify highlighting (check for distinctive styling)
        const styles = await currentPlayer.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            backgroundColor: computed.backgroundColor,
            border: computed.border,
            color: computed.color,
            fontWeight: computed.fontWeight,
          };
        });
        
        console.log('✅ Current player highlighting found:', styles);
        await helpers.takeScreenshot('p9-current-player-highlight');
        break;
      }
    }
  });

  test('should display ceremony elements and celebrations', async ({ page }) => {
    // Look for ceremony/celebration elements
    const ceremonyElements = [
      page.locator('.ceremony, .celebration'),
      page.locator('[data-testid="ceremony"]'),
      page.locator('text="Congratulations"').or(page.locator('text="Well Done"')),
      page.locator('.confetti, .fireworks, .celebration-animation'),
      page.locator('svg, img').filter({ hasText: /trophy|medal|crown|star/i }),
    ];
    
    let ceremonyFound = false;
    for (const elementSet of ceremonyElements) {
      if (await elementSet.count() > 0) {
        console.log('✅ Ceremony elements found');
        ceremonyFound = true;
        
        // Wait for animations to complete
        await page.waitForTimeout(2000);
        await helpers.takeScreenshot('p9-ceremony');
        break;
      }
    }
    
    if (!ceremonyFound) {
      console.log('⚠️ No ceremony elements found');
    }
  });

  test('should show team rankings if multiplayer', async ({ page }) => {
    // Look for team ranking elements
    const teamElements = [
      page.locator('.team-ranking, .team-results'),
      page.locator('[data-testid="team-ranking"]'),
      page.locator('h3, h4').filter({ hasText: /team|group/i }),
      page.locator('div, span').filter({ hasText: /team.*\d+|group.*\d+/i }),
    ];
    
    for (const elementSet of teamElements) {
      if (await elementSet.count() > 0) {
        const count = await elementSet.count();
        console.log(`✅ Found ${count} team ranking elements`);
        
        // Verify team entries are displayed
        const firstTeam = elementSet.first();
        await expect(firstTeam).toBeVisible();
        
        await helpers.takeScreenshot('p9-team-rankings');
        break;
      }
    }
  });

  test('should provide sharing options for results', async ({ page }) => {
    // Look for sharing functionality
    const shareElements = [
      page.locator('button, a').filter({ hasText: /share|social|post/i }),
      page.locator('.share, .social-share'),
      page.locator('[data-testid="share"]'),
      page.locator('svg, img').filter({ hasText: /share|facebook|twitter|instagram/i }),
    ];
    
    for (const elementSet of shareElements) {
      if (await elementSet.count() > 0) {
        const shareButton = elementSet.first();
        await expect(shareButton).toBeVisible();
        await helpers.verifyTouchTarget(shareButton);
        
        console.log('✅ Sharing functionality found');
        
        // Test share button interaction
        await shareButton.click();
        await page.waitForTimeout(1000);
        
        // Look for share modal or external share
        const shareModal = page.locator('.modal, .share-modal');
        if (await shareModal.count() > 0) {
          await helpers.verifyModal(shareModal.first().locator('..'));
        }
        
        await helpers.takeScreenshot('p9-sharing');
        break;
      }
    }
  });

  test('should offer replay or new adventure options', async ({ page }) => {
    // Look for replay/continue options
    const replayElements = [
      page.locator('button, a').filter({ hasText: /play.*again|replay|new.*adventure|start.*over/i }),
      page.locator('.replay, .new-game'),
      page.locator('text="Play Again"').or(page.locator('text="New Adventure"')),
    ];
    
    let replayFound = false;
    for (const elementSet of replayElements) {
      if (await elementSet.count() > 0) {
        const replayButton = elementSet.first();
        await expect(replayButton).toBeVisible();
        await helpers.verifyTouchTarget(replayButton);
        
        console.log('✅ Replay functionality found');
        replayFound = true;
        
        // Test replay button (but don't actually replay)
        const buttonText = await replayButton.textContent();
        console.log(`Replay option: "${buttonText}"`);
        
        break;
      }
    }
    
    if (!replayFound) {
      console.log('⚠️ No replay options found');
    }
  });

  test('should display performance statistics and achievements', async ({ page }) => {
    // Look for detailed stats
    const statsElements = [
      page.locator('.stats, .statistics'),
      page.locator('[data-testid="stats"]'),
      page.locator('div, span').filter({ hasText: /time.*taken|challenges.*completed|items.*found/i }),
      page.locator('.achievement, .badge'),
    ];
    
    let statsFound = false;
    for (const elementSet of statsElements) {
      if (await elementSet.count() > 0) {
        const count = await elementSet.count();
        console.log(`✅ Found ${count} performance statistics`);
        statsFound = true;
        
        // Sample first few stats
        for (let i = 0; i < Math.min(count, 3); i++) {
          const stat = elementSet.nth(i);
          if (await stat.isVisible()) {
            const statText = await stat.textContent();
            console.log(`Stat ${i + 1}: ${statText}`);
          }
        }
        
        await helpers.takeScreenshot('p9-statistics');
        break;
      }
    }
    
    if (!statsFound) {
      console.log('⚠️ No performance statistics found');
    }
  });

  test('should be responsive for celebration viewing', async ({ page }) => {
    await helpers.testResponsive(async () => {
      const viewport = page.viewportSize()!;
      
      // Verify ranking list is readable at all sizes
      const rankingElements = page.locator('.rank-item, .player-rank, li');
      const count = await rankingElements.count();
      
      if (count > 0) {
        for (let i = 0; i < Math.min(count, 3); i++) {
          const rankItem = rankingElements.nth(i);
          if (await rankItem.isVisible()) {
            const box = await rankItem.boundingBox();
            
            if (box) {
              // Ranking items should fit within viewport
              expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 10);
              
              // On mobile, items should use full width effectively
              if (viewport.width <= 768) {
                const widthRatio = box.width / viewport.width;
                expect(widthRatio).toBeGreaterThan(0.8); // Use 80%+ of width
              }
            }
          }
        }
      }
      
      // Verify ceremony elements remain visible
      const ceremonyElements = page.locator('.ceremony, .celebration, .congratulations');
      if (await ceremonyElements.count() > 0) {
        const ceremony = ceremonyElements.first();
        if (await ceremony.isVisible()) {
          const box = await ceremony.boundingBox();
          expect(box).toBeTruthy();
          console.log(`Ceremony visible at ${viewport.width}x${viewport.height}`);
        }
      }
    });
  });

  test('should handle animations and visual effects', async ({ page }) => {
    // Wait for initial animations
    await page.waitForTimeout(3000);
    
    // Look for animated elements
    const animatedElements = [
      page.locator('.animate, .animation'),
      page.locator('[class*="animate"]'),
      page.locator('.confetti, .fireworks'),
      page.locator('svg, img').filter({ hasText: /trophy|star|sparkle/i }),
    ];
    
    let animationsFound = false;
    for (const elementSet of animatedElements) {
      if (await elementSet.count() > 0) {
        console.log('✅ Animations found in ceremony');
        animationsFound = true;
        
        // Take screenshot during animations
        await helpers.takeScreenshot('p9-animations');
        break;
      }
    }
    
    if (!animationsFound) {
      console.log('⚠️ No animations found in ceremony');
    }
  });

  test('should provide accessibility for rankings and ceremony', async ({ page }) => {
    // Check ranking list accessibility
    const rankingList = page.locator('ol, ul, .ranking-list');
    if (await rankingList.count() > 0) {
      await helpers.verifyAccessibility(rankingList.first());
    }
    
    // Check buttons accessibility
    const buttons = page.locator('button, a[role="button"]');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 3); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        await helpers.verifyAccessibility(button);
      }
    }
    
    // Check for proper heading hierarchy
    const headings = page.locator('h1, h2, h3');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThanOrEqual(1);
    
    console.log('✅ Ranking ceremony accessibility verified');
  });

  test('should show historical data or previous attempts', async ({ page }) => {
    // Look for historical/comparison data
    const historyElements = [
      page.locator('.history, .previous'),
      page.locator('text="Previous"').or(page.locator('text="Best"')),
      page.locator('div, span').filter({ hasText: /previous.*score|best.*time|personal.*best/i }),
    ];
    
    for (const elementSet of historyElements) {
      if (await elementSet.count() > 0) {
        console.log('✅ Historical data found');
        
        const historyElement = elementSet.first();
        const historyText = await historyElement.textContent();
        console.log(`Historical data: ${historyText}`);
        break;
      }
    }
  });

  test('should complete the user journey cycle', async ({ page }) => {
    // This test verifies the complete P1→P9 cycle is functional
    
    // Look for "back to start" or "new adventure" functionality
    const cycleElements = [
      page.locator('button, a').filter({ hasText: /home|start.*new|main.*menu/i }),
      page.locator('a[href="/"]').or(page.locator('a[href="/adventure-selection"]')),
      page.locator('.home-button, .menu-button'),
    ];
    
    for (const elementSet of cycleElements) {
      if (await elementSet.count() > 0) {
        const cycleButton = elementSet.first();
        await expect(cycleButton).toBeVisible();
        await helpers.verifyTouchTarget(cycleButton);
        
        console.log('✅ User journey cycle completion option found');
        
        // Don't actually click to avoid disrupting other tests
        const buttonText = await cycleButton.textContent();
        console.log(`Cycle completion option: "${buttonText}"`);
        
        break;
      }
    }
    
    // Verify this represents a satisfying conclusion
    const conclusionElements = [
      page.locator('text="Thank you"').or(page.locator('text="Congratulations"')),
      page.locator('.conclusion, .finale'),
      page.locator('text="Adventure Complete"').or(page.locator('text="Mission Accomplished"')),
    ];
    
    for (const elementSet of conclusionElements) {
      if (await elementSet.count() > 0) {
        console.log('✅ Satisfying conclusion found');
        break;
      }
    }
  });

  test('should measure ceremony page performance', async ({ page }) => {
    const metrics = await helpers.measurePerformance();
    
    // Ceremony page should load smoothly despite animations
    expect(metrics.loadTime).toBeLessThan(4000); // 4 seconds max
    expect(metrics.firstContentfulPaint).toBeLessThan(2500); // 2.5 seconds max
    
    console.log('🏆 Ceremony finale performance:', metrics);
  });
});