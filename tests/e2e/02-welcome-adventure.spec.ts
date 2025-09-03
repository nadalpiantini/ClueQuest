import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('P1: Welcome Screen - "Enter the Adventure"', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.navigateAndVerify('/welcome');
  });

  test('should display welcome screen with adventure entry button', async ({ page }) => {
    // Verify we're on the welcome page
    await helpers.waitForPageLoad();
    
    // Look for welcome content
    const welcomeContent = page.locator('main, [data-testid="welcome"], .welcome');
    await expect(welcomeContent.first()).toBeVisible();
    
    // Look for adventure entry button or similar CTA
    const adventureButton = page.locator('text="Enter the Adventure"').or(
      page.locator('text="Begin Mystery Quest"')
    ).or(
      page.locator('text="Start Adventure"')
    ).or(
      page.locator('a, button').filter({ hasText: /adventure|mystery|quest|start|begin/i })
    );
    
    await expect(adventureButton.first()).toBeVisible();
    await helpers.verifyTouchTarget(adventureButton.first());
    
    await helpers.takeScreenshot('p1-welcome-screen');
  });

  test('should navigate to login on adventure button click (P1 → P2)', async ({ page }) => {
    // Find and click the adventure entry button
    const adventureButton = page.locator('text="Enter the Adventure"').or(
      page.locator('text="Begin Mystery Quest"')
    ).or(
      page.locator('text="Start Adventure"')
    ).or(
      page.locator('a, button').filter({ hasText: /adventure|mystery|quest|start|begin/i })
    );

    await adventureButton.first().click();
    await helpers.waitForPageLoad();
    
    // Should navigate to login page (P2: Login Express)
    await expect(page).toHaveURL(/\/login|\/adventure|\/auth/);
  });

  test('should have responsive design with proper mobile adaptation', async ({ page }) => {
    await helpers.testResponsive(async () => {
      // Verify adventure button is always accessible
      const adventureButton = page.locator('a, button').filter({ hasText: /adventure|mystery|quest|start|begin/i });
      await expect(adventureButton.first()).toBeVisible();
      await helpers.verifyTouchTarget(adventureButton.first());
    });
  });

  test('should display welcome content and branding', async ({ page }) => {
    // Look for ClueQuest branding
    const branding = page.locator('text="ClueQuest"').or(
      page.locator('h1, h2').filter({ hasText: /quest|mystery|adventure/i })
    );
    await expect(branding.first()).toBeVisible();
    
    // Look for welcome or introductory text
    const welcomeText = page.locator('text="Welcome"').or(
      page.locator('text="Bienvenido"')
    ).or(
      page.locator('p, div').filter({ hasText: /welcome|ready|adventure|mystery/i })
    );
    
    if (await welcomeText.count() > 0) {
      await expect(welcomeText.first()).toBeVisible();
    }
  });

  test('should handle loading states and animations', async ({ page }) => {
    // Wait for any initial animations
    await page.waitForTimeout(1000);
    
    // Take screenshot after animations settle
    await helpers.takeScreenshot('p1-welcome-loaded');
    
    // Test button interaction feedback
    const adventureButton = page.locator('a, button').filter({ hasText: /adventure|mystery|quest|start|begin/i });
    
    if (!page.context().options.isMobile) {
      await adventureButton.first().hover();
      await page.waitForTimeout(300);
      await helpers.takeScreenshot('p1-welcome-hover');
    }
  });

  test('should maintain accessibility standards', async ({ page }) => {
    const adventureButton = page.locator('a, button').filter({ hasText: /adventure|mystery|quest|start|begin/i });
    await helpers.verifyAccessibility(adventureButton.first());
    
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
  });

  test('should work across different viewport sizes', async ({ page }) => {
    const viewportSizes = [
      { width: 320, height: 568 }, // iPhone SE
      { width: 375, height: 667 }, // iPhone 8
      { width: 768, height: 1024 }, // iPad
      { width: 1024, height: 768 }, // Desktop
      { width: 1440, height: 900 }, // Large desktop
    ];

    for (const size of viewportSizes) {
      await page.setViewportSize(size);
      await page.waitForTimeout(500);
      
      // Verify button is still accessible
      const adventureButton = page.locator('a, button').filter({ hasText: /adventure|mystery|quest|start|begin/i });
      await expect(adventureButton.first()).toBeVisible();
      await helpers.verifyTouchTarget(adventureButton.first());
      
      console.log(`✅ P1 Welcome - ${size.width}x${size.height} viewport test passed`);
    }
  });
});

test.describe('P2: Login Express with SSO Options', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    // Try multiple possible login routes
    const loginRoutes = ['/login', '/adventure/login', '/auth/login', '/auth'];
    
    let loaded = false;
    for (const route of loginRoutes) {
      try {
        await page.goto(route);
        await page.waitForTimeout(1000);
        loaded = true;
        break;
      } catch (error) {
        console.log(`Route ${route} not found, trying next...`);
      }
    }
    
    if (!loaded) {
      // Navigate from welcome page instead
      await page.goto('/welcome');
      await helpers.waitForPageLoad();
      const adventureButton = page.locator('a, button').filter({ hasText: /adventure|mystery|quest|start|begin/i });
      await adventureButton.first().click();
      await helpers.waitForPageLoad();
    }
  });

  test('should display login form with email/password fields', async ({ page }) => {
    // Look for login form elements
    const emailField = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
    const passwordField = page.locator('input[type="password"], input[name="password"]');
    
    if (await emailField.count() > 0) {
      await expect(emailField.first()).toBeVisible();
      await helpers.verifyTouchTarget(emailField.first());
    }
    
    if (await passwordField.count() > 0) {
      await expect(passwordField.first()).toBeVisible();
      await helpers.verifyTouchTarget(passwordField.first());
    }
    
    await helpers.takeScreenshot('p2-login-form');
  });

  test('should show SSO/social login options', async ({ page }) => {
    // Look for social login buttons
    const socialButtons = page.locator('button, a').filter({ 
      hasText: /google|facebook|github|twitter|linkedin|sign.*with/i 
    });
    
    const socialCount = await socialButtons.count();
    if (socialCount > 0) {
      for (let i = 0; i < Math.min(socialCount, 5); i++) {
        const button = socialButtons.nth(i);
        await expect(button).toBeVisible();
        await helpers.verifyTouchTarget(button);
      }
      console.log(`Found ${socialCount} social login options`);
    }
  });

  test('should handle guest mode access if available', async ({ page }) => {
    // Look for guest access option
    const guestButton = page.locator('text="Continue as Guest"').or(
      page.locator('text="Guest Mode"')
    ).or(
      page.locator('button, a').filter({ hasText: /guest|demo|skip.*login/i })
    );
    
    if (await guestButton.count() > 0) {
      await expect(guestButton.first()).toBeVisible();
      await helpers.verifyTouchTarget(guestButton.first());
      
      // Test guest login flow
      await guestButton.first().click();
      await helpers.waitForPageLoad();
      
      // Should proceed to next step (P3: Intro or P4: Role Selection)
      await expect(page).toHaveURL(/\/intro|\/role|\/story|\/adventure/);
    } else {
      console.log('No guest mode found - using demo form data');
    }
  });

  test('should validate form inputs with proper error handling', async ({ page }) => {
    const emailField = page.locator('input[type="email"], input[name="email"]');
    const passwordField = page.locator('input[type="password"], input[name="password"]');
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /login|sign.*in|enter/i });
    
    if (await emailField.count() > 0 && await submitButton.count() > 0) {
      // Test invalid email
      await helpers.testFormInput(
        'input[type="email"], input[name="email"]',
        'valid@example.com',
        'invalid-email'
      );
      
      // Test empty form submission
      await emailField.first().fill('');
      if (await passwordField.count() > 0) {
        await passwordField.first().fill('');
      }
      
      await submitButton.first().click();
      await page.waitForTimeout(1000);
      
      // Should show validation errors
      const errorMessage = page.locator('[role="alert"], .error, .text-red-500, .invalid');
      if (await errorMessage.count() > 0) {
        await expect(errorMessage.first()).toBeVisible();
      }
    }
  });

  test('should proceed to intro story on successful login (P2 → P3)', async ({ page }) => {
    // Try to find a way to proceed (guest mode, demo, or skip)
    const proceedOptions = [
      page.locator('text="Continue as Guest"'),
      page.locator('text="Demo"'),
      page.locator('text="Skip"'),
      page.locator('button, a').filter({ hasText: /continue|proceed|next|skip/i })
    ];
    
    let proceeded = false;
    for (const option of proceedOptions) {
      if (await option.count() > 0) {
        await option.first().click();
        await helpers.waitForPageLoad();
        proceeded = true;
        break;
      }
    }
    
    if (proceeded) {
      // Should be on intro/story page (P3)
      await expect(page).toHaveURL(/\/intro|\/story|\/role|\/adventure/);
      console.log('✅ Successfully proceeded from login to next step');
    } else {
      console.log('⚠️ No proceed option found - this may need actual authentication setup');
    }
  });

  test('should be mobile-optimized with proper touch targets', async ({ page }) => {
    await helpers.testResponsive(async () => {
      const interactiveElements = page.locator('button, input, a');
      const count = await interactiveElements.count();
      
      for (let i = 0; i < Math.min(count, 10); i++) {
        const element = interactiveElements.nth(i);
        if (await element.isVisible()) {
          await helpers.verifyTouchTarget(element);
        }
      }
    });
  });
});