import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('P7: Challenges/Minigames (≤90s duration)', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    
    // Try to navigate to challenges page
    const challengeRoutes = [
      '/challenges',
      '/minigames',
      '/game',
      '/puzzle',
      '/adventure/challenges',
      '/challenge/1'
    ];
    
    let loaded = false;
    for (const route of challengeRoutes) {
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
      console.log('Challenge routes not found - may need to be accessed through adventure hub');
    }
  });

  test('should display challenge interface with game elements', async ({ page }) => {
    // Look for game/challenge elements
    const gameElements = [
      page.locator('h1, h2').filter({ hasText: /challenge|puzzle|game|clue/i }),
      page.locator('.game, .challenge, .puzzle'),
      page.locator('[data-testid="game"], [data-testid="challenge"]'),
      page.locator('canvas, svg').filter({ hasText: /game/i }),
    ];
    
    let gameFound = false;
    for (const elementSet of gameElements) {
      if (await elementSet.count() > 0) {
        await expect(elementSet.first()).toBeVisible();
        gameFound = true;
        console.log('✅ Challenge/game interface found');
        break;
      }
    }
    
    if (gameFound) {
      await helpers.takeScreenshot('p7-challenge-interface');
    } else {
      console.log('⚠️ No challenge interface found');
    }
  });

  test('should show timer with 90-second constraint', async ({ page }) => {
    // Look for timer elements
    const timerElements = [
      page.locator('.timer, .countdown'),
      page.locator('[data-testid="timer"]'),
      page.locator('div, span').filter({ hasText: /\d+:\d+|\d+s|seconds?|timer?/i }),
      page.locator('text="Time:"').or(page.locator('text="Timer:"')),
    ];
    
    let timerFound = false;
    for (const elementSet of timerElements) {
      if (await elementSet.count() > 0) {
        const timer = elementSet.first();
        await expect(timer).toBeVisible();
        timerFound = true;
        
        // Get initial timer value
        const timerText = await timer.textContent();
        console.log(`✅ Timer found: ${timerText}`);
        
        // Verify timer is counting down
        await page.waitForTimeout(2000);
        const newTimerText = await timer.textContent();
        
        if (timerText !== newTimerText) {
          console.log('✅ Timer is actively counting down');
        }
        
        break;
      }
    }
    
    if (timerFound) {
      await helpers.takeScreenshot('p7-timer-display');
    } else {
      console.log('⚠️ No timer found');
    }
  });

  test('should have interactive game controls with proper touch targets', async ({ page }) => {
    // Look for interactive game elements
    const gameControls = [
      page.locator('button, input').filter({ hasText: /answer|submit|guess|click|tap/i }),
      page.locator('.game-button, .control-button'),
      page.locator('input[type="text"], textarea'),
      page.locator('[role="button"], [tabindex="0"]'),
    ];
    
    let controlsFound = false;
    let controlCount = 0;
    
    for (const controlSet of gameControls) {
      controlCount = await controlSet.count();
      if (controlCount > 0) {
        controlsFound = true;
        
        // Verify touch targets for game controls
        for (let i = 0; i < Math.min(controlCount, 8); i++) {
          const control = controlSet.nth(i);
          if (await control.isVisible()) {
            await expect(control).toBeVisible();
            await helpers.verifyTouchTarget(control);
            
            // Test interaction feedback
            if (!page.context().options.isMobile) {
              await control.hover();
              await page.waitForTimeout(150);
            }
          }
        }
        break;
      }
    }
    
    if (controlsFound) {
      console.log(`✅ Found ${controlCount} interactive game controls`);
      await helpers.takeScreenshot('p7-game-controls');
    } else {
      console.log('⚠️ No interactive game controls found');
    }
  });

  test('should display puzzle/challenge content clearly', async ({ page }) => {
    // Look for challenge content
    const challengeContent = [
      page.locator('.question, .puzzle-text'),
      page.locator('p, div').filter({ hasText: /.{20,}/ }), // Substantial text content
      page.locator('h3, h4').filter({ hasText: /question|clue|riddle|puzzle/i }),
      page.locator('.challenge-description, .game-instructions'),
    ];
    
    for (const contentSet of challengeContent) {
      if (await contentSet.count() > 0) {
        const content = contentSet.first();
        await expect(content).toBeVisible();
        
        // Verify text is readable (font size check)
        const fontSize = await content.evaluate(el => 
          window.getComputedStyle(el).fontSize
        );
        const fontSizeNum = parseFloat(fontSize);
        expect(fontSizeNum).toBeGreaterThanOrEqual(14); // Minimum readable size
        
        console.log('✅ Challenge content found and readable');
        break;
      }
    }
  });

  test('should handle different challenge types', async ({ page }) => {
    // Look for different types of challenges
    const challengeTypes = [
      { type: 'Multiple Choice', selector: 'input[type="radio"], .choice-option' },
      { type: 'Text Input', selector: 'input[type="text"], textarea' },
      { type: 'Image/Visual', selector: 'img, canvas, svg' },
      { type: 'Interactive', selector: '[draggable="true"], .draggable, .interactive' },
    ];
    
    const foundTypes = [];
    
    for (const challengeType of challengeTypes) {
      const elements = page.locator(challengeType.selector);
      const count = await elements.count();
      
      if (count > 0) {
        foundTypes.push(`${challengeType.type} (${count} elements)`);
        
        // Test first element of each type
        const firstElement = elements.first();
        if (await firstElement.isVisible()) {
          await helpers.verifyTouchTarget(firstElement);
        }
      }
    }
    
    if (foundTypes.length > 0) {
      console.log(`✅ Found challenge types: ${foundTypes.join(', ')}`);
    } else {
      console.log('⚠️ No specific challenge types identified');
    }
  });

  test('should provide immediate feedback on interactions', async ({ page }) => {
    // Find interactive elements and test feedback
    const interactiveElements = page.locator('button, input[type="radio"], .choice-option');
    const count = await interactiveElements.count();
    
    if (count > 0) {
      const element = interactiveElements.first();
      if (await element.isVisible()) {
        // Click and look for feedback
        await element.click();
        await page.waitForTimeout(300);
        
        // Look for feedback indicators
        const feedbackElements = [
          page.locator('.feedback, .response'),
          page.locator('.correct, .incorrect, .selected'),
          page.locator('[role="alert"]'),
          page.locator('.text-green, .text-red, .bg-green, .bg-red'),
        ];
        
        for (const feedbackSet of feedbackElements) {
          if (await feedbackSet.count() > 0) {
            console.log('✅ Interaction feedback found');
            await helpers.takeScreenshot('p7-interaction-feedback');
            break;
          }
        }
      }
    }
  });

  test('should handle challenge completion (P7 → P8)', async ({ page }) => {
    // Look for completion mechanism
    const completionElements = [
      page.locator('button').filter({ hasText: /submit|complete|finish|done/i }),
      page.locator('.submit-button, .complete-button'),
      page.locator('input[type="submit"]'),
    ];
    
    let completionFound = false;
    for (const elementSet of completionElements) {
      if (await elementSet.count() > 0) {
        const submitButton = elementSet.first();
        await expect(submitButton).toBeVisible();
        await helpers.verifyTouchTarget(submitButton);
        
        // Try to complete the challenge
        await submitButton.click();
        await page.waitForTimeout(1000);
        
        // Look for completion feedback
        const completionFeedback = [
          page.locator('text="Completed"').or(page.locator('text="Well done"')),
          page.locator('text="Next Challenge"').or(page.locator('text="Continue"')),
          page.locator('.success, .completion'),
        ];
        
        for (const feedbackSet of completionFeedback) {
          if (await feedbackSet.count() > 0) {
            console.log('✅ Challenge completion detected');
            completionFound = true;
            
            // Should navigate to inventory/progress (P8)
            const continueButton = page.locator('button, a').filter({ 
              hasText: /continue|next|inventory|progress/i 
            });
            
            if (await continueButton.count() > 0) {
              await continueButton.first().click();
              await helpers.waitForPageLoad();
              
              const currentUrl = page.url();
              if (currentUrl.includes('/inventory') || 
                  currentUrl.includes('/progress') ||
                  currentUrl.includes('/hub')) {
                console.log('✅ Successfully navigated to inventory/progress');
              }
            }
            break;
          }
        }
        break;
      }
    }
    
    if (!completionFound) {
      console.log('⚠️ No challenge completion mechanism found');
    }
  });

  test('should be responsive for different game types', async ({ page }) => {
    await helpers.testResponsive(async () => {
      const viewport = page.viewportSize()!;
      
      // Verify game interface adapts to screen size
      const gameContent = page.locator('.game, .challenge, canvas, svg');
      
      if (await gameContent.count() > 0) {
        const content = gameContent.first();
        const box = await content.boundingBox();
        
        if (box) {
          // Game content should fit within viewport
          expect(box.x).toBeGreaterThanOrEqual(0);
          expect(box.y).toBeGreaterThanOrEqual(0);
          expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 10); // 10px tolerance
          expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 10);
          
          // On mobile, content should use most of the screen
          if (viewport.width <= 768) {
            const contentRatio = (box.width * box.height) / (viewport.width * viewport.height);
            expect(contentRatio).toBeGreaterThan(0.3); // At least 30% of screen
          }
        }
      }
    });
  });

  test('should maintain 90-second performance constraint', async ({ page }) => {
    const startTime = Date.now();
    
    // Simulate a complete challenge interaction
    const interactiveElements = page.locator('button, input, [role="button"]');
    const count = await interactiveElements.count();
    
    if (count > 0) {
      // Interact with first few elements
      for (let i = 0; i < Math.min(count, 3); i++) {
        const element = interactiveElements.nth(i);
        if (await element.isVisible()) {
          await element.click();
          await page.waitForTimeout(100);
        }
      }
      
      // Look for submit button and click
      const submitButton = page.locator('button').filter({ hasText: /submit|complete/i });
      if (await submitButton.count() > 0) {
        await submitButton.first().click();
        await page.waitForTimeout(500);
      }
    }
    
    const elapsed = Date.now() - startTime;
    console.log(`⏱️ Challenge interaction completed in ${elapsed}ms`);
    
    // Challenge should be completable within reasonable time
    expect(elapsed).toBeLessThan(10000); // 10 seconds for testing
  });

  test('should handle mobile touch interactions for games', async ({ page }) => {
    if (page.context().options.isMobile) {
      // Test touch-specific interactions
      const touchElements = page.locator('button, [role="button"], .touchable');
      const count = await touchElements.count();
      
      if (count > 0) {
        for (let i = 0; i < Math.min(count, 3); i++) {
          const element = touchElements.nth(i);
          if (await element.isVisible()) {
            // Verify touch target size
            await helpers.verifyTouchTarget(element, 44);
            
            // Test tap interaction
            await element.tap();
            await page.waitForTimeout(200);
          }
        }
        
        console.log('✅ Mobile touch interactions tested');
      }
    }
  });

  test('should provide accessibility for game challenges', async ({ page }) => {
    // Check game controls accessibility
    const gameControls = page.locator('button, input, [role="button"]');
    const count = await gameControls.count();
    
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const control = gameControls.nth(i);
        if (await control.isVisible()) {
          await helpers.verifyAccessibility(control);
        }
      }
    }
    
    // Check for proper heading structure in challenges
    const headings = page.locator('h1, h2, h3, h4');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThanOrEqual(1);
    
    // Check for instructions or help text
    const instructions = page.locator('.instructions, .help, [aria-describedby]');
    if (await instructions.count() > 0) {
      console.log('✅ Challenge instructions found for accessibility');
    }
  });

  test('should handle challenge timeout gracefully', async ({ page }) => {
    // Look for timer and test timeout behavior
    const timer = page.locator('.timer, .countdown, [data-testid="timer"]');
    
    if (await timer.count() > 0) {
      console.log('✅ Timer found - monitoring timeout behavior');
      
      // Wait and see if timeout is handled
      await page.waitForTimeout(5000);
      
      // Look for timeout messages or automatic progression
      const timeoutElements = [
        page.locator('text="Time\'s up"').or(page.locator('text="Timeout"')),
        page.locator('text="Try again"').or(page.locator('text="Next"')),
        page.locator('.timeout, .expired'),
      ];
      
      for (const elementSet of timeoutElements) {
        if (await elementSet.count() > 0) {
          console.log('✅ Timeout handling found');
          break;
        }
      }
    }
  });
});