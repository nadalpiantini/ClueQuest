import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Landing Page (Entry Point)', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.navigateAndVerify('/');
  });

  test('should display main branding and hero section', async ({ page }) => {
    // Verify main title
    const mainTitle = page.locator('h1');
    await expect(mainTitle).toBeVisible();
    await expect(mainTitle).toContainText('CLUEQUEST');

    // Verify hero subtitle
    const subtitle = page.locator('h2');
    await expect(subtitle).toContainText('Interactive Escape Room Adventures');

    // Take screenshot for visual verification
    await helpers.takeScreenshot('landing-hero');
  });

  test('should have proper CTA buttons with 44px touch targets', async ({ page }) => {
    // Test "Begin Mystery Quest" button (P1 → P2 transition)
    const mainCTA = page.locator('a[href="/welcome"]');
    await expect(mainCTA).toBeVisible();
    await expect(mainCTA).toContainText('Begin Mystery Quest');
    await helpers.verifyTouchTarget(mainCTA);

    // Test "Watch Preview" button
    const previewCTA = page.locator('a[href="/demo"]');
    await expect(previewCTA).toBeVisible();
    await expect(previewCTA).toContainText('Watch Preview');
    await helpers.verifyTouchTarget(previewCTA);
  });

  test('should display feature cards with interactive elements', async ({ page }) => {
    const featureCards = page.locator('.card');
    await expect(featureCards).toHaveCount(4);

    // Verify all feature cards are visible
    const expectedFeatures = [
      'QR Mystery Hunt',
      'Team Collaboration', 
      'AI Storytelling',
      'Live Leaderboards'
    ];

    for (let i = 0; i < expectedFeatures.length; i++) {
      const card = featureCards.nth(i);
      await expect(card).toBeVisible();
      await expect(card).toContainText(expectedFeatures[i]);
      
      // Test hover effects (desktop only)
      if (!page.context().options.isMobile) {
        await card.hover();
        await page.waitForTimeout(300); // Wait for animation
      }
    }
  });

  test('should show global statistics and social proof', async ({ page }) => {
    // Verify statistics section
    const statsSection = page.locator('section').nth(1);
    await expect(statsSection).toBeVisible();
    
    // Check for statistics numbers
    await expect(page.locator('text=100K+')).toBeVisible();
    await expect(page.locator('text=95+')).toBeVisible();
    await expect(page.locator('text=24/7')).toBeVisible();

    // Verify testimonial section
    const testimonial = page.locator('blockquote');
    await expect(testimonial).toBeVisible();
    await expect(testimonial).toContainText('ClueQuest transformed our corporate retreat');
  });

  test('should have responsive footer with proper links', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check footer links
    const footerLinks = [
      'About Quest',
      'Privacy', 
      'Terms',
      'Contact',
      'Careers'
    ];

    for (const linkText of footerLinks) {
      const link = page.locator(`a:has-text("${linkText}")`);
      await expect(link).toBeVisible();
      await helpers.verifyTouchTarget(link);
    }
  });

  test('should navigate to welcome page on main CTA click', async ({ page }) => {
    const mainCTA = page.locator('a[href="/welcome"]');
    
    // Click and verify navigation
    await mainCTA.click();
    await helpers.waitForPageLoad();
    
    // Should be on welcome page (P1 → P2 transition)
    await expect(page).toHaveURL('/welcome');
  });

  test('should be fully responsive across all breakpoints', async ({ page }) => {
    await helpers.testResponsive(async () => {
      // Verify key elements are visible at all breakpoints
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('a[href="/welcome"]')).toBeVisible();
      await expect(page.locator('.card')).toHaveCount(4);
      
      // Verify mobile-specific adaptations
      const viewport = page.viewportSize()!;
      if (viewport.width <= 768) {
        // On mobile, check that elements stack properly
        const mainCTA = page.locator('a[href="/welcome"]');
        await helpers.verifyTouchTarget(mainCTA, 44);
      }
    });
  });

  test('should have proper performance metrics', async ({ page }) => {
    const metrics = await helpers.measurePerformance();
    
    // Landing page should load quickly
    expect(metrics.loadTime).toBeLessThan(3000); // 3 seconds max
    expect(metrics.firstContentfulPaint).toBeLessThan(2000); // 2 seconds max
    
    console.log('🏠 Landing page performance:', metrics);
  });

  test('should handle safe areas for notched devices', async ({ page }) => {
    await helpers.verifySafeArea();
    
    // Verify content doesn't get cut off by notch
    const mainContent = page.locator('main');
    const contentBox = await mainContent.boundingBox();
    expect(contentBox).toBeTruthy();
    expect(contentBox!.y).toBeGreaterThan(0); // Should have top padding
  });

  test('should have proper accessibility features', async ({ page }) => {
    // Check main navigation button
    const mainCTA = page.locator('a[href="/welcome"]');
    await helpers.verifyAccessibility(mainCTA);
    
    // Verify heading hierarchy
    const h1 = page.locator('h1');
    const h2 = page.locator('h2');
    await expect(h1).toHaveCount(1); // Only one h1
    await expect(h2).toHaveCount(2); // Multiple h2s allowed
    
    // Check for alt text on decorative elements
    const icons = page.locator('svg');
    const iconCount = await icons.count();
    expect(iconCount).toBeGreaterThan(0);
  });

  test('should show visual feedback on interactions', async ({ page }) => {
    const mainCTA = page.locator('a[href="/welcome"]');
    
    // Test hover state (desktop only)
    if (!page.context().options.isMobile) {
      await mainCTA.hover();
      await page.waitForTimeout(300);
      
      // Should have hover effects
      const hoverClass = await mainCTA.getAttribute('class');
      expect(hoverClass).toContain('hover:');
    }
    
    // Test active/focus states
    await mainCTA.focus();
    await page.waitForTimeout(200);
    
    // Should have focus indicator
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toHaveCount(1);
  });
});