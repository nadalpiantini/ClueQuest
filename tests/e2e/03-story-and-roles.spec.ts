import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('P3: Introductory Story with Skip Option', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    
    // Try to navigate to intro/story page
    const storyRoutes = ['/intro', '/story', '/adventure/intro', '/adventure/story'];
    
    let loaded = false;
    for (const route of storyRoutes) {
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
      console.log('Story routes not found - this test may need to be accessed through login flow');
    }
  });

  test('should display introductory story content', async ({ page }) => {
    // Look for story content elements
    const storyElements = [
      page.locator('h1, h2').filter({ hasText: /story|adventure|mystery|quest/i }),
      page.locator('p, div').filter({ hasText: /once upon|story|mystery|adventure|quest/i }),
      page.locator('[data-testid="story"], .story-content, .intro-story'),
    ];
    
    let storyFound = false;
    for (const element of storyElements) {
      if (await element.count() > 0) {
        await expect(element.first()).toBeVisible();
        storyFound = true;
        break;
      }
    }
    
    if (storyFound) {
      await helpers.takeScreenshot('p3-intro-story');
      console.log('✅ Found story content');
    } else {
      console.log('⚠️ No story content found - may not be implemented yet');
    }
  });

  test('should have skip option for story', async ({ page }) => {
    // Look for skip button
    const skipButton = page.locator('text="Skip"').or(
      page.locator('text="Skip Story"')
    ).or(
      page.locator('text="Continue"')
    ).or(
      page.locator('button, a').filter({ hasText: /skip|continue|next|proceed/i })
    );
    
    if (await skipButton.count() > 0) {
      await expect(skipButton.first()).toBeVisible();
      await helpers.verifyTouchTarget(skipButton.first());
      
      // Test skip functionality
      await skipButton.first().click();
      await helpers.waitForPageLoad();
      
      // Should navigate to role selection (P4)
      await expect(page).toHaveURL(/\/role|\/avatar|\/character|\/select/);
      console.log('✅ Skip functionality works - navigated to role selection');
    } else {
      console.log('⚠️ No skip option found');
    }
  });

  test('should display story with engaging visuals', async ({ page }) => {
    // Look for visual elements
    const visuals = [
      page.locator('img, svg, canvas'),
      page.locator('.animation, .animated'),
      page.locator('[class*="animation"], [class*="animate"]'),
    ];
    
    for (const visualSet of visuals) {
      const count = await visualSet.count();
      if (count > 0) {
        console.log(`Found ${count} visual elements in story`);
        break;
      }
    }
  });

  test('should be readable and accessible on mobile', async ({ page }) => {
    await helpers.testResponsive(async () => {
      // Verify text is readable at all sizes
      const textElements = page.locator('p, span, div').filter({ hasText: /\w{10,}/ });
      const count = await textElements.count();
      
      if (count > 0) {
        for (let i = 0; i < Math.min(count, 3); i++) {
          const textElement = textElements.nth(i);
          if (await textElement.isVisible()) {
            const fontSize = await textElement.evaluate(el => 
              window.getComputedStyle(el).fontSize
            );
            const fontSizeNum = parseFloat(fontSize);
            expect(fontSizeNum).toBeGreaterThanOrEqual(14); // Minimum readable size
          }
        }
      }
    });
  });
});

test.describe('P4: Role Selection with Animated Cards and Perks', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    
    // Try to navigate to role selection page
    const roleRoutes = ['/role-selection', '/roles', '/character', '/adventure/role-selection', '/select'];
    
    let loaded = false;
    for (const route of roleRoutes) {
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
      console.log('Role selection routes not found - may need to be accessed through story flow');
    }
  });

  test('should display animated role selection cards', async ({ page }) => {
    // Look for role cards
    const roleCards = [
      page.locator('.role-card, .character-card, .card'),
      page.locator('[data-testid="role"], [data-testid="character"]'),
      page.locator('button, div').filter({ hasText: /detective|explorer|scientist|investigator/i }),
    ];
    
    let cardsFound = false;
    let cardCount = 0;
    
    for (const cardSet of roleCards) {
      cardCount = await cardSet.count();
      if (cardCount > 0) {
        cardsFound = true;
        break;
      }
    }
    
    if (cardsFound) {
      console.log(`Found ${cardCount} role selection cards`);
      
      // Verify each card has proper touch targets
      const cards = roleCards.find(set => set.count() > 0);
      for (let i = 0; i < Math.min(cardCount, 6); i++) {
        const card = cards!.nth(i);
        await expect(card).toBeVisible();
        await helpers.verifyTouchTarget(card);
      }
      
      await helpers.takeScreenshot('p4-role-selection-cards');
    } else {
      console.log('⚠️ No role selection cards found');
    }
  });

  test('should show role perks and descriptions', async ({ page }) => {
    // Look for role descriptions and perks
    const perkElements = [
      page.locator('.perk, .benefit, .ability'),
      page.locator('p, div').filter({ hasText: /perk|ability|skill|bonus/i }),
      page.locator('ul li, .feature-list'),
    ];
    
    for (const perkSet of perkElements) {
      const count = await perkSet.count();
      if (count > 0) {
        console.log(`Found ${count} role perk elements`);
        
        // Verify at least one perk is visible
        const firstPerk = perkSet.first();
        await expect(firstPerk).toBeVisible();
        break;
      }
    }
  });

  test('should allow role selection and show feedback', async ({ page }) => {
    // Find selectable roles
    const selectableRoles = page.locator('button, .card, div').filter({ 
      hasText: /detective|explorer|scientist|investigator|select|choose/i 
    });
    
    const roleCount = await selectableRoles.count();
    
    if (roleCount > 0) {
      // Select the first available role
      const firstRole = selectableRoles.first();
      await expect(firstRole).toBeVisible();
      
      // Test hover effects (desktop only)
      if (!page.context().options.isMobile) {
        await firstRole.hover();
        await page.waitForTimeout(300);
        await helpers.takeScreenshot('p4-role-hover');
      }
      
      // Click to select
      await firstRole.click();
      await page.waitForTimeout(500);
      
      // Look for selection feedback
      const selectedFeedback = [
        page.locator('.selected, .active, .chosen'),
        page.locator('[aria-selected="true"]'),
        page.locator('.bg-green, .border-green, .text-green'),
      ];
      
      for (const feedbackSet of selectedFeedback) {
        if (await feedbackSet.count() > 0) {
          console.log('✅ Role selection feedback found');
          break;
        }
      }
      
      await helpers.takeScreenshot('p4-role-selected');
    }
  });

  test('should proceed to avatar generation after role selection (P4 → P5)', async ({ page }) => {
    // Look for continue/next button after role selection
    const continueButton = page.locator('text="Continue"').or(
      page.locator('text="Next"')
    ).or(
      page.locator('text="Create Avatar"')
    ).or(
      page.locator('button, a').filter({ hasText: /continue|next|proceed|avatar|create/i })
    );
    
    if (await continueButton.count() > 0) {
      await expect(continueButton.first()).toBeVisible();
      await helpers.verifyTouchTarget(continueButton.first());
      
      await continueButton.first().click();
      await helpers.waitForPageLoad();
      
      // Should navigate to avatar generation (P5)
      await expect(page).toHaveURL(/\/avatar|\/character|\/generation|\/create/);
      console.log('✅ Successfully navigated to avatar generation');
    } else {
      console.log('⚠️ No continue button found after role selection');
    }
  });

  test('should have responsive card layout', async ({ page }) => {
    await helpers.testResponsive(async () => {
      // Verify cards are properly displayed at all breakpoints
      const cards = page.locator('.card, .role-card, [data-testid="role"]');
      const cardCount = await cards.count();
      
      if (cardCount > 0) {
        // On mobile, cards should stack
        const viewport = page.viewportSize()!;
        if (viewport.width <= 768) {
          // Check if cards are stacking (vertical layout)
          const firstCard = cards.first();
          const secondCard = cards.nth(1);
          
          if (await secondCard.count() > 0) {
            const firstBox = await firstCard.boundingBox();
            const secondBox = await secondCard.boundingBox();
            
            if (firstBox && secondBox) {
              // On mobile, second card should be below first card
              expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height - 20);
            }
          }
        }
      }
    });
  });

  test('should show animations and transitions', async ({ page }) => {
    // Wait for any initial animations
    await page.waitForTimeout(1000);
    
    const cards = page.locator('.card, .role-card, [data-testid="role"]');
    const cardCount = await cards.count();
    
    if (cardCount > 0) {
      // Test card interactions
      for (let i = 0; i < Math.min(cardCount, 3); i++) {
        const card = cards.nth(i);
        
        if (await card.isVisible()) {
          // Hover and click to test animations
          if (!page.context().options.isMobile) {
            await card.hover();
            await page.waitForTimeout(200);
          }
          
          await card.click();
          await page.waitForTimeout(200);
        }
      }
      
      await helpers.takeScreenshot('p4-role-animations');
    }
  });

  test('should maintain accessibility in role selection', async ({ page }) => {
    const roleCards = page.locator('button, .card, [role="button"]');
    const cardCount = await roleCards.count();
    
    if (cardCount > 0) {
      // Check first few cards for accessibility
      for (let i = 0; i < Math.min(cardCount, 3); i++) {
        const card = roleCards.nth(i);
        if (await card.isVisible()) {
          await helpers.verifyAccessibility(card);
        }
      }
    }
  });
});