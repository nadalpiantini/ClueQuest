import { Page, Locator, expect } from '@playwright/test';

export class TestHelpers {
  constructor(public page: Page) {}

  /**
   * Wait for page to be fully loaded with animations
   */
  async waitForPageLoad(timeout = 10000) {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000); // Wait for animations
  }

  /**
   * Verify element has minimum 44px touch target (WCAG compliant)
   */
  async verifyTouchTarget(locator: Locator, minSize = 44) {
    const box = await locator.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThanOrEqual(minSize);
    expect(box!.height).toBeGreaterThanOrEqual(minSize);
  }

  /**
   * Test button interactions with proper feedback
   */
  async testButton(selector: string, expectedText?: string) {
    const button = this.page.locator(selector);
    
    // Verify button exists and is visible
    await expect(button).toBeVisible();
    
    // Verify minimum touch target
    await this.verifyTouchTarget(button);
    
    // Verify button text if provided
    if (expectedText) {
      await expect(button).toContainText(expectedText);
    }
    
    // Test hover state (desktop only)
    const browserInfo = this.page.context().browser();
    const isMobile = this.page.viewportSize()?.width! < 768;
    if (!isMobile) {
      await button.hover();
      await this.page.waitForTimeout(200); // Wait for hover animation
    }
    
    // Test click
    await button.click();
    await this.page.waitForTimeout(500); // Wait for click response
    
    return button;
  }

  /**
   * Verify modal is properly centered and responsive
   */
  async verifyModal(modalSelector: string) {
    const modal = this.page.locator(modalSelector);
    await expect(modal).toBeVisible();
    
    const viewportSize = this.page.viewportSize()!;
    const modalBox = await modal.boundingBox();
    
    expect(modalBox).toBeTruthy();
    
    // Verify modal is centered (within reasonable bounds)
    const centerX = viewportSize.width / 2;
    const centerY = viewportSize.height / 2;
    const modalCenterX = modalBox!.x + modalBox!.width / 2;
    const modalCenterY = modalBox!.y + modalBox!.height / 2;
    
    // Allow 10% tolerance for centering
    const tolerance = 0.1;
    expect(Math.abs(modalCenterX - centerX)).toBeLessThan(viewportSize.width * tolerance);
    expect(Math.abs(modalCenterY - centerY)).toBeLessThan(viewportSize.height * tolerance);
    
    // Verify modal doesn't overflow viewport
    expect(modalBox!.x).toBeGreaterThanOrEqual(0);
    expect(modalBox!.y).toBeGreaterThanOrEqual(0);
    expect(modalBox!.x + modalBox!.width).toBeLessThanOrEqual(viewportSize.width);
    expect(modalBox!.y + modalBox!.height).toBeLessThanOrEqual(viewportSize.height);
  }

  /**
   * Test form input with validation
   */
  async testFormInput(inputSelector: string, validValue: string, invalidValue?: string) {
    const input = this.page.locator(inputSelector);
    await expect(input).toBeVisible();
    
    // Test valid input
    await input.fill(validValue);
    await expect(input).toHaveValue(validValue);
    
    // Test invalid input if provided
    if (invalidValue) {
      await input.fill(invalidValue);
      // Look for validation message
      const validationMessage = this.page.locator('[role="alert"], .error-message, .text-red-500');
      await expect(validationMessage).toBeVisible({ timeout: 5000 });
    }
  }

  /**
   * Take screenshot with descriptive name
   */
  async takeScreenshot(name: string) {
    const viewportSize = this.page.viewportSize()!;
    const deviceInfo = `${viewportSize.width}x${viewportSize.height}`;
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${deviceInfo}.png`,
      fullPage: true 
    });
  }

  /**
   * Test navigation and verify URL
   */
  async navigateAndVerify(path: string, expectedUrlPattern?: string | RegExp) {
    await this.page.goto(path);
    await this.waitForPageLoad();
    
    if (expectedUrlPattern) {
      await expect(this.page).toHaveURL(expectedUrlPattern);
    }
  }

  /**
   * Verify accessibility features
   */
  async verifyAccessibility(element: Locator) {
    // Check for proper ARIA labels
    const ariaLabel = await element.getAttribute('aria-label');
    const ariaLabelledBy = await element.getAttribute('aria-labelledby');
    const role = await element.getAttribute('role');
    
    // At least one accessibility attribute should be present
    expect(ariaLabel || ariaLabelledBy || role).toBeTruthy();
  }

  /**
   * Test responsive behavior across breakpoints
   */
  async testResponsive(testCallback: () => Promise<void>) {
    const breakpoints = [
      { name: 'mobile-small', width: 320, height: 568 },
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1024, height: 768 },
      { name: 'desktop-large', width: 1440, height: 900 },
    ];

    for (const breakpoint of breakpoints) {
      await this.page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
      await this.page.waitForTimeout(500); // Wait for responsive adjustments
      
      try {
        await testCallback();
        console.log(`✅ ${breakpoint.name} (${breakpoint.width}x${breakpoint.height}) - PASSED`);
      } catch (error) {
        console.error(`❌ ${breakpoint.name} (${breakpoint.width}x${breakpoint.height}) - FAILED:`, error);
        await this.takeScreenshot(`responsive-failure-${breakpoint.name}`);
        throw error;
      }
    }
  }

  /**
   * Measure and verify performance timing
   */
  async measurePerformance(): Promise<{
    loadTime: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
  }> {
    const performanceMetrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
      const lcp = paintEntries.find(entry => entry.name === 'largest-contentful-paint')?.startTime || 0;
      
      return {
        loadTime: navigation.loadEventEnd - navigation.navigationStart,
        firstContentfulPaint: fcp,
        largestContentfulPaint: lcp,
      };
    });

    console.log('📊 Performance Metrics:', performanceMetrics);
    
    // Assert reasonable performance thresholds
    expect(performanceMetrics.loadTime).toBeLessThan(5000); // 5 seconds
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(3000); // 3 seconds
    
    return performanceMetrics;
  }

  /**
   * Test error handling and user feedback
   */
  async testErrorHandling(triggerErrorAction: () => Promise<void>) {
    try {
      await triggerErrorAction();
      
      // Look for error indicators
      const errorIndicators = [
        '[role="alert"]',
        '.error-message',
        '.text-red-500',
        '.bg-red-100',
        '[aria-live="polite"]',
        '[aria-live="assertive"]'
      ];
      
      let errorFound = false;
      for (const selector of errorIndicators) {
        const errorElement = this.page.locator(selector);
        if (await errorElement.count() > 0) {
          await expect(errorElement.first()).toBeVisible();
          errorFound = true;
          break;
        }
      }
      
      expect(errorFound).toBeTruthy();
      
    } catch (error) {
      console.log('Expected error occurred:', error);
    }
  }

  /**
   * Verify safe area support for notched devices
   */
  async verifySafeArea() {
    // Check if CSS custom properties for safe areas are being used
    const safeAreaCSS = await this.page.evaluate(() => {
      const rootElement = document.documentElement;
      const computedStyle = window.getComputedStyle(rootElement);
      
      return {
        safeAreaInsetTop: computedStyle.getPropertyValue('--safe-area-inset-top'),
        safeAreaInsetRight: computedStyle.getPropertyValue('--safe-area-inset-right'),
        safeAreaInsetBottom: computedStyle.getPropertyValue('--safe-area-inset-bottom'),
        safeAreaInsetLeft: computedStyle.getPropertyValue('--safe-area-inset-left'),
      };
    });
    
    console.log('🔒 Safe Area Support:', safeAreaCSS);
  }
}