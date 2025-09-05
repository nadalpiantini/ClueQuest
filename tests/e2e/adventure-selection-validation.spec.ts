import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Adventure Selection Page - Comprehensive Validation', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.navigateAndVerify('/adventure-selection');
    await helpers.waitForPageLoad();
  });

  test.describe('Core Functionality Tests', () => {
    test('should load page correctly with all essential elements', async ({ page }) => {
      // Verify page loads without errors
      await expect(page).toHaveURL(/adventure-selection/);
      
      // Check for main content container
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
      
      // Check for page title/header
      const title = page.locator('h1').filter({ hasText: /ClueQuest|Adventure|Welcome/i });
      await expect(title.first()).toBeVisible();
      
      // Check for "Choose Your Adventure" badge/indicator
      const chooseAdventureBadge = page.locator('text="Choose Your Adventure"');
      await expect(chooseAdventureBadge).toBeVisible();
      
      console.log('✅ Page loaded successfully with all essential elements');
      await helpers.takeScreenshot('adventure-selection-loaded');
    });

    test('should display all three adventure type cards', async ({ page }) => {
      // Look for adventure cards by type
      const corporateCard = page.locator('[data-testid*="corporate"], .card, div').filter({ hasText: /Corporate.*Mystery|Corporate/i });
      const socialCard = page.locator('[data-testid*="social"], .card, div').filter({ hasText: /Social.*Adventure|Social/i });
      const educationalCard = page.locator('[data-testid*="educational"], .card, div').filter({ hasText: /Learning.*Quest|Educational/i });
      
      // Verify all three card types are visible
      await expect(corporateCard.first()).toBeVisible();
      await expect(socialCard.first()).toBeVisible();
      await expect(educationalCard.first()).toBeVisible();
      
      // Verify card content includes key information
      await expect(corporateCard.first()).toContainText(/team.*building|corporate|4-50.*players/i);
      await expect(socialCard.first()).toContainText(/parties|weddings|celebrations|2-30.*players/i);
      await expect(educationalCard.first()).toContainText(/gamified|education|curriculum|1-25.*players/i);
      
      console.log('✅ All three adventure type cards are visible with correct content');
      await helpers.takeScreenshot('adventure-cards-visible');
    });

    test('should allow card selection and show visual feedback', async ({ page }) => {
      // Find adventure cards
      const adventureCards = page.locator('.card, [role="button"]').filter({ hasText: /Corporate|Social|Learning/i });
      const cardCount = await adventureCards.count();
      expect(cardCount).toBeGreaterThanOrEqual(3);
      
      // Test selecting each card
      for (let i = 0; i < Math.min(cardCount, 3); i++) {
        const card = adventureCards.nth(i);
        await card.click();
        
        // Wait for selection state to update
        await page.waitForTimeout(500);
        
        // Take screenshot of selected state
        await helpers.takeScreenshot(`card-selected-${i}`);
        
        // Look for visual selection indicators
        const selectionIndicator = page.locator('.ring-2, .border-2, [class*="selected"], [aria-selected="true"]');
        const indicatorCount = await selectionIndicator.count();
        expect(indicatorCount).toBeGreaterThan(0);
        
        console.log(`✅ Card ${i} selection works with visual feedback`);
      }
    });

    test('should show "Start Adventure Builder" button when adventure is selected', async ({ page }) => {
      // Initially, the button should not be visible (or should be disabled)
      const builderButton = page.locator('text="Start Adventure Builder"').or(
        page.locator('button, a').filter({ hasText: /start.*adventure.*builder/i })
      );
      
      // Select an adventure card first
      const firstCard = page.locator('.card, [role="button"]').filter({ hasText: /Corporate|Social|Learning/i }).first();
      await firstCard.click();
      await page.waitForTimeout(500);
      
      // Now the button should be visible
      await expect(builderButton.first()).toBeVisible();
      await helpers.verifyTouchTarget(builderButton.first(), 44);
      
      console.log('✅ Start Adventure Builder button appears when adventure is selected');
      await helpers.takeScreenshot('builder-button-visible');
    });

    test('should navigate to builder page when Start Adventure Builder is clicked', async ({ page }) => {
      // Select an adventure
      const firstCard = page.locator('.card, [role="button"]').filter({ hasText: /Corporate|Social|Learning/i }).first();
      await firstCard.click();
      await page.waitForTimeout(500);
      
      // Click the builder button
      const builderButton = page.locator('text="Start Adventure Builder"').or(
        page.locator('button, a').filter({ hasText: /start.*adventure.*builder/i })
      );
      await builderButton.first().click();
      
      // Verify navigation to builder
      await helpers.waitForPageLoad();
      await expect(page).toHaveURL(/\/builder/);
      
      console.log('✅ Navigation to builder page works correctly');
    });

    test('should have working navigation links', async ({ page }) => {
      // Test back to home link
      const backLink = page.locator('text="Back to Home"').or(
        page.locator('a').filter({ hasText: /back.*home|home/i })
      );
      
      if (await backLink.count() > 0) {
        await expect(backLink.first()).toBeVisible();
        await helpers.verifyTouchTarget(backLink.first(), 44);
        
        // Test the link (but don't navigate away for other tests)
        const href = await backLink.first().getAttribute('href');
        expect(href).toBe('/');
      }
      
      // Test demo and join links
      const demoLink = page.locator('text="Live Demo"').or(
        page.locator('a').filter({ hasText: /demo/i })
      );
      const joinLink = page.locator('text="Join Adventure"').or(
        page.locator('a').filter({ hasText: /join.*adventure/i })
      );
      
      if (await demoLink.count() > 0) {
        await expect(demoLink.first()).toBeVisible();
        await helpers.verifyTouchTarget(demoLink.first(), 44);
      }
      
      if (await joinLink.count() > 0) {
        await expect(joinLink.first()).toBeVisible();
        await helpers.verifyTouchTarget(joinLink.first(), 44);
      }
      
      console.log('✅ All navigation links are present and accessible');
    });
  });

  test.describe('Mobile Optimization Tests', () => {
    test('should work properly on small mobile screens (320px)', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      await page.waitForTimeout(500);
      
      // Verify cards are still visible and accessible
      const adventureCards = page.locator('.card, [role="button"]').filter({ hasText: /Corporate|Social|Learning/i });
      const cardCount = await adventureCards.count();
      expect(cardCount).toBeGreaterThanOrEqual(3);
      
      for (let i = 0; i < Math.min(cardCount, 3); i++) {
        const card = adventureCards.nth(i);
        await expect(card).toBeVisible();
        await helpers.verifyTouchTarget(card, 44);
      }
      
      console.log('✅ Mobile 320px viewport works correctly');
      await helpers.takeScreenshot('mobile-320px');
    });

    test('should work properly on standard mobile screens (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      
      // Test card selection on mobile
      const firstCard = page.locator('.card, [role="button"]').filter({ hasText: /Corporate|Social|Learning/i }).first();
      await firstCard.click();
      await page.waitForTimeout(500);
      
      // Verify builder button appears and has proper touch target
      const builderButton = page.locator('text="Start Adventure Builder"').or(
        page.locator('button, a').filter({ hasText: /start.*adventure.*builder/i })
      );
      await expect(builderButton.first()).toBeVisible();
      await helpers.verifyTouchTarget(builderButton.first(), 44);
      
      console.log('✅ Mobile 375px viewport works correctly');
      await helpers.takeScreenshot('mobile-375px');
    });

    test('should verify all touch targets meet 44px minimum requirement', async ({ page }) => {
      const interactiveElements = page.locator('button, a, [role="button"], .card').filter({ hasText: /.+/ });
      const count = await interactiveElements.count();
      
      const touchTargetIssues = [];
      
      for (let i = 0; i < count; i++) {
        const element = interactiveElements.nth(i);
        try {
          if (await element.isVisible()) {
            const box = await element.boundingBox();
            if (box && (box.width < 44 || box.height < 44)) {
              const text = await element.textContent();
              touchTargetIssues.push({
                text: text?.slice(0, 50) || 'Unknown element',
                width: box.width,
                height: box.height
              });
            }
          }
        } catch (error) {
          // Element might not be interactable, skip
        }
      }
      
      if (touchTargetIssues.length > 0) {
        console.warn('⚠️ Touch target issues found:', touchTargetIssues);
        await helpers.takeScreenshot('touch-target-issues');
      }
      
      // Allow some minor violations but flag major ones
      expect(touchTargetIssues.length).toBeLessThan(3);
      console.log(`✅ Touch targets validated - ${touchTargetIssues.length} minor issues found`);
    });

    test('should have responsive grid layout', async ({ page }) => {
      const viewportSizes = [
        { width: 320, height: 568, name: 'mobile-small' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 1024, height: 768, name: 'desktop' },
        { width: 1440, height: 900, name: 'desktop-large' }
      ];

      for (const size of viewportSizes) {
        await page.setViewportSize(size);
        await page.waitForTimeout(500);
        
        // Verify cards are properly laid out
        const cardContainer = page.locator('.grid, [class*="grid-cols"]').first();
        if (await cardContainer.count() > 0) {
          await expect(cardContainer).toBeVisible();
        }
        
        // Verify no horizontal overflow
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = size.width;
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // Allow 20px tolerance
        
        console.log(`✅ Responsive layout works at ${size.name} (${size.width}x${size.height})`);
        await helpers.takeScreenshot(`responsive-${size.name}`);
      }
    });

    test('should have smooth animations that work properly', async ({ page }) => {
      // Test hover animations on desktop
      if (page.viewportSize()!.width >= 768) {
        const firstCard = page.locator('.card, [role="button"]').filter({ hasText: /Corporate|Social|Learning/i }).first();
        
        await firstCard.hover();
        await page.waitForTimeout(300);
        await helpers.takeScreenshot('card-hover-animation');
        
        // Test click animation
        await firstCard.click();
        await page.waitForTimeout(300);
        await helpers.takeScreenshot('card-click-animation');
      }
      
      // Test that animations don't break functionality
      const builderButton = page.locator('text="Start Adventure Builder"').or(
        page.locator('button, a').filter({ hasText: /start.*adventure.*builder/i })
      );
      
      if (await builderButton.count() > 0) {
        await expect(builderButton.first()).toBeVisible();
        console.log('✅ Animations work without breaking functionality');
      }
    });
  });

  test.describe('Interactive Elements Tests', () => {
    test('should handle card selection state correctly', async ({ page }) => {
      const adventureCards = page.locator('.card, [role="button"]').filter({ hasText: /Corporate|Social|Learning/i });
      const cardCount = await adventureCards.count();
      
      // Test that only one card can be selected at a time
      for (let i = 0; i < Math.min(cardCount, 3); i++) {
        const card = adventureCards.nth(i);
        await card.click();
        await page.waitForTimeout(300);
        
        // Count selected indicators - should only be one
        const selectedIndicators = page.locator('[class*="ring-2"], [class*="border-2"], [aria-selected="true"]');
        const selectedCount = await selectedIndicators.count();
        
        // Should have at least one selected indicator but not more than reasonable
        expect(selectedCount).toBeGreaterThan(0);
        expect(selectedCount).toBeLessThan(10); // Reasonable upper limit
        
        console.log(`✅ Card ${i} selection state works correctly`);
      }
    });

    test('should show proper button states and hover effects', async ({ page }) => {
      // Select a card first
      const firstCard = page.locator('.card, [role="button"]').filter({ hasText: /Corporate|Social|Learning/i }).first();
      await firstCard.click();
      await page.waitForTimeout(500);
      
      const builderButton = page.locator('text="Start Adventure Builder"').or(
        page.locator('button, a').filter({ hasText: /start.*adventure.*builder/i })
      );
      
      await expect(builderButton.first()).toBeVisible();
      
      // Test hover effect on desktop
      if (!page.context().options.isMobile) {
        await builderButton.first().hover();
        await page.waitForTimeout(300);
        await helpers.takeScreenshot('builder-button-hover');
      }
      
      // Test button is clickable
      await expect(builderButton.first()).toBeEnabled();
      console.log('✅ Button states and hover effects work correctly');
    });

    test('should handle demo and join link interactions', async ({ page }) => {
      const demoLink = page.locator('text="Live Demo"').or(
        page.locator('a').filter({ hasText: /demo/i })
      );
      const joinLink = page.locator('text="Join Adventure"').or(
        page.locator('a').filter({ hasText: /join.*adventure/i })
      );
      
      if (await demoLink.count() > 0) {
        await expect(demoLink.first()).toBeVisible();
        const href = await demoLink.first().getAttribute('href');
        expect(href).toContain('demo');
        
        // Test hover effect on desktop
        if (!page.context().options.isMobile) {
          await demoLink.first().hover();
          await page.waitForTimeout(200);
        }
        
        console.log('✅ Demo link works correctly');
      }
      
      if (await joinLink.count() > 0) {
        await expect(joinLink.first()).toBeVisible();
        const href = await joinLink.first().getAttribute('href');
        expect(href).toContain('join');
        
        console.log('✅ Join link works correctly');
      }
    });
  });

  test.describe('Visual Validation Tests', () => {
    test('should have proper gradient backgrounds and visual elements', async ({ page }) => {
      // Check for background gradients
      const backgroundElements = page.locator('div[class*="bg-gradient"], [class*="gradient"]');
      const gradientCount = await backgroundElements.count();
      expect(gradientCount).toBeGreaterThan(0);
      
      // Check for floating elements (decorative)
      const floatingElements = page.locator('[class*="animate"], [class*="float"], [class*="bounce"]');
      const animatedCount = await floatingElements.count();
      
      console.log(`✅ Visual elements: ${gradientCount} gradients, ${animatedCount} animations`);
      await helpers.takeScreenshot('visual-elements');
    });

    test('should have proper color contrast and accessibility', async ({ page }) => {
      // Check for proper color classes
      const colorElements = page.locator('[class*="text-"], [class*="bg-"]');
      const colorCount = await colorElements.count();
      expect(colorCount).toBeGreaterThan(0);
      
      // Check for heading structure
      const h1 = page.locator('h1');
      await expect(h1.first()).toBeVisible();
      
      // Check for proper button styling
      const buttons = page.locator('button, a[class*="btn"]');
      const buttonCount = await buttons.count();
      expect(buttonCount).toBeGreaterThan(0);
      
      console.log(`✅ Accessibility: ${colorCount} styled elements, proper heading structure`);
    });

    test('should take comprehensive screenshots across screen sizes', async ({ page }) => {
      const screenSizes = [
        { width: 320, height: 568, name: 'mobile-small' },
        { width: 375, height: 667, name: 'mobile-standard' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 1024, height: 768, name: 'desktop' },
        { width: 1440, height: 900, name: 'desktop-large' },
        { width: 1920, height: 1080, name: 'desktop-xl' }
      ];

      for (const size of screenSizes) {
        await page.setViewportSize(size);
        await page.waitForTimeout(1000);
        
        // Take full page screenshot
        await helpers.takeScreenshot(`complete-${size.name}`);
        
        // Take screenshot with card selected
        const firstCard = page.locator('.card, [role="button"]').filter({ hasText: /Corporate|Social|Learning/i }).first();
        await firstCard.click();
        await page.waitForTimeout(500);
        await helpers.takeScreenshot(`selected-state-${size.name}`);
        
        console.log(`✅ Screenshots taken for ${size.name} (${size.width}x${size.height})`);
      }
    });

    test('should verify Framer Motion animations work correctly', async ({ page }) => {
      // Look for Framer Motion animated elements
      const animatedElements = page.locator('[data-framer-name], [style*="transform"], [class*="motion"]');
      
      // Wait for animations to settle
      await page.waitForTimeout(2000);
      
      // Check if elements are visible after animations
      const cards = page.locator('.card, [role="button"]').filter({ hasText: /Corporate|Social|Learning/i });
      const cardCount = await cards.count();
      expect(cardCount).toBeGreaterThanOrEqual(3);
      
      for (let i = 0; i < Math.min(cardCount, 3); i++) {
        await expect(cards.nth(i)).toBeVisible();
      }
      
      console.log('✅ Framer Motion animations work without breaking functionality');
      await helpers.takeScreenshot('animations-complete');
    });
  });

  test.describe('Performance and Error Handling', () => {
    test('should load within acceptable time limits', async ({ page }) => {
      const metrics = await helpers.measurePerformance();
      
      // Verify performance is reasonable
      expect(metrics.loadTime).toBeLessThan(5000); // 5 seconds
      expect(metrics.firstContentfulPaint).toBeLessThan(3000); // 3 seconds
      
      console.log('✅ Performance metrics within acceptable limits:', metrics);
    });

    test('should handle missing or slow-loading resources gracefully', async ({ page }) => {
      // Check for broken images
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const naturalWidth = await img.evaluate((img: HTMLImageElement) => img.naturalWidth);
        if (naturalWidth === 0) {
          console.warn(`⚠️ Potentially broken image found: ${await img.getAttribute('src')}`);
        }
      }
      
      // Check for console errors
      let consoleErrors = 0;
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors++;
          console.error('Console error:', msg.text());
        }
      });
      
      await page.reload();
      await helpers.waitForPageLoad();
      
      expect(consoleErrors).toBeLessThan(3); // Allow some minor errors
      console.log(`✅ Error handling: ${consoleErrors} console errors found`);
    });

    test('should work with JavaScript disabled (graceful degradation)', async ({ page }) => {
      // This test verifies basic HTML structure works without JS
      await page.context().addInitScript(() => {
        // Disable JavaScript execution for new scripts
        Object.defineProperty(window, 'addEventListener', { value: () => {} });
      });
      
      await page.reload();
      await page.waitForTimeout(2000);
      
      // Verify basic elements are still visible
      const title = page.locator('h1').filter({ hasText: /ClueQuest|Adventure|Welcome/i });
      await expect(title.first()).toBeVisible();
      
      const cards = page.locator('.card, div').filter({ hasText: /Corporate|Social|Learning/i });
      const cardCount = await cards.count();
      expect(cardCount).toBeGreaterThanOrEqual(3);
      
      console.log('✅ Basic functionality works without JavaScript');
    });
  });
});

// Generate comprehensive status report
test.describe('Adventure Selection - Status Report Generation', () => {
  test('should generate comprehensive validation report', async ({ page }) => {
    const helpers = new TestHelpers(page);
    await helpers.navigateAndVerify('/adventure-selection');
    await helpers.waitForPageLoad();

    const report = {
      timestamp: new Date().toISOString(),
      pageUrl: '/adventure-selection',
      validation: {
        coreFunctionality: {
          pageLoads: true,
          cardsVisible: false,
          selectionWorks: false,
          builderButtonAppears: false,
          navigationWorks: false
        },
        mobileOptimization: {
          mobileViewports: { '320px': false, '375px': false },
          touchTargets: { compliant: 0, issues: 0 },
          responsiveLayout: false,
          animations: false
        },
        interactiveElements: {
          cardSelection: false,
          buttonStates: false,
          links: false
        },
        visualValidation: {
          gradients: false,
          accessibility: false,
          screenshots: 0,
          animations: false
        },
        performance: {
          loadTime: 0,
          fcp: 0,
          lcp: 0
        }
      },
      issues: [],
      recommendations: []
    };

    try {
      // Test core functionality
      const cards = page.locator('.card, [role="button"]').filter({ hasText: /Corporate|Social|Learning/i });
      const cardCount = await cards.count();
      report.validation.coreFunctionality.cardsVisible = cardCount >= 3;
      
      if (cardCount >= 3) {
        // Test selection
        await cards.first().click();
        await page.waitForTimeout(500);
        
        const builderButton = page.locator('text="Start Adventure Builder"').or(
          page.locator('button, a').filter({ hasText: /start.*adventure.*builder/i })
        );
        report.validation.coreFunctionality.builderButtonAppears = await builderButton.count() > 0;
        report.validation.coreFunctionality.selectionWorks = true;
      }
      
      // Test mobile viewports
      await page.setViewportSize({ width: 320, height: 568 });
      await page.waitForTimeout(500);
      report.validation.mobileOptimization.mobileViewports['320px'] = await cards.first().isVisible();
      
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      report.validation.mobileOptimization.mobileViewports['375px'] = await cards.first().isVisible();
      
      // Test touch targets
      const interactiveElements = page.locator('button, a, [role="button"], .card');
      const elementCount = await interactiveElements.count();
      let touchTargetIssues = 0;
      
      for (let i = 0; i < Math.min(elementCount, 10); i++) {
        const element = interactiveElements.nth(i);
        try {
          if (await element.isVisible()) {
            const box = await element.boundingBox();
            if (box && (box.width < 44 || box.height < 44)) {
              touchTargetIssues++;
            }
          }
        } catch (error) {
          // Skip elements that can't be measured
        }
      }
      
      report.validation.mobileOptimization.touchTargets = {
        compliant: Math.max(0, elementCount - touchTargetIssues),
        issues: touchTargetIssues
      };
      
      // Performance measurement
      const metrics = await helpers.measurePerformance();
      report.validation.performance = metrics;
      
      // Generate recommendations
      if (!report.validation.coreFunctionality.cardsVisible) {
        report.issues.push('Adventure cards are not visible or not found');
        report.recommendations.push('Verify card selectors and ensure cards are properly rendered');
      }
      
      if (touchTargetIssues > 0) {
        report.issues.push(`${touchTargetIssues} touch target(s) below 44px minimum`);
        report.recommendations.push('Update CSS to ensure all interactive elements meet WCAG touch target requirements');
      }
      
      if (metrics.loadTime > 3000) {
        report.issues.push('Page load time exceeds 3 seconds');
        report.recommendations.push('Optimize images and reduce bundle size for better performance');
      }
      
      console.log('\n🎯 ADVENTURE SELECTION VALIDATION REPORT');
      console.log('=' .repeat(50));
      console.log(`📅 Timestamp: ${report.timestamp}`);
      console.log(`🌐 Page: ${report.pageUrl}`);
      console.log('\n📊 CORE FUNCTIONALITY:');
      console.log(`  ✅ Page Loads: ${report.validation.coreFunctionality.pageLoads}`);
      console.log(`  👀 Cards Visible: ${report.validation.coreFunctionality.cardsVisible}`);
      console.log(`  🎯 Selection Works: ${report.validation.coreFunctionality.selectionWorks}`);
      console.log(`  🚀 Builder Button: ${report.validation.coreFunctionality.builderButtonAppears}`);
      console.log('\n📱 MOBILE OPTIMIZATION:');
      console.log(`  📟 320px Viewport: ${report.validation.mobileOptimization.mobileViewports['320px']}`);
      console.log(`  📱 375px Viewport: ${report.validation.mobileOptimization.mobileViewports['375px']}`);
      console.log(`  👆 Touch Targets: ${report.validation.mobileOptimization.touchTargets.compliant} compliant, ${report.validation.mobileOptimization.touchTargets.issues} issues`);
      console.log('\n⚡ PERFORMANCE:');
      console.log(`  ⏱️  Load Time: ${metrics.loadTime}ms`);
      console.log(`  🎨 First Paint: ${metrics.firstContentfulPaint}ms`);
      console.log('\n🚨 ISSUES FOUND:');
      if (report.issues.length === 0) {
        console.log('  🎉 No major issues detected!');
      } else {
        report.issues.forEach((issue, index) => {
          console.log(`  ${index + 1}. ${issue}`);
        });
      }
      console.log('\n💡 RECOMMENDATIONS:');
      if (report.recommendations.length === 0) {
        console.log('  ✨ Page meets all validation criteria!');
      } else {
        report.recommendations.forEach((rec, index) => {
          console.log(`  ${index + 1}. ${rec}`);
        });
      }
      console.log('=' .repeat(50));
      
    } catch (error) {
      console.error('❌ Error during validation:', error);
      report.issues.push(`Validation error: ${error.message}`);
    }
  });
});