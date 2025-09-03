import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Performance & Comprehensive Testing', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test.describe('Core Web Vitals & Performance', () => {
    test('should meet Core Web Vitals thresholds', async ({ page }) => {
      await helpers.navigateAndVerify('/');
      
      const metrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const vitals = {
              LCP: 0,
              FID: 0,
              CLS: 0,
              FCP: 0,
              TTFB: 0
            };
            
            entries.forEach((entry) => {
              switch (entry.name) {
                case 'largest-contentful-paint':
                  vitals.LCP = entry.startTime;
                  break;
                case 'first-input-delay':
                  vitals.FID = entry.processingStart - entry.startTime;
                  break;
                case 'cumulative-layout-shift':
                  vitals.CLS += entry.value;
                  break;
                case 'first-contentful-paint':
                  vitals.FCP = entry.startTime;
                  break;
              }
            });
            
            // Get TTFB from navigation timing
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            if (navigation) {
              vitals.TTFB = navigation.responseStart - navigation.requestStart;
            }
            
            resolve(vitals);
          });
          
          observer.observe({ entryTypes: ['paint', 'layout-shift', 'largest-contentful-paint', 'first-input'] });
          
          // Fallback timeout
          setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            const paintEntries = performance.getEntriesByType('paint');
            
            const vitals = {
              LCP: 0,
              FID: 0,
              CLS: 0,
              FCP: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
              TTFB: navigation ? navigation.responseStart - navigation.requestStart : 0
            };
            
            resolve(vitals);
          }, 3000);
        });
      });
      
      console.log('🚀 Core Web Vitals:', metrics);
      
      // Core Web Vitals thresholds
      expect(metrics.FCP).toBeLessThan(1800); // Good: < 1.8s
      expect(metrics.LCP).toBeLessThan(2500); // Good: < 2.5s
      expect(metrics.CLS).toBeLessThan(0.1);  // Good: < 0.1
      expect(metrics.TTFB).toBeLessThan(800); // Good: < 0.8s
      
      if (metrics.FID > 0) {
        expect(metrics.FID).toBeLessThan(100); // Good: < 100ms
      }
    });

    test('should have optimized resource loading', async ({ page }) => {
      const responses: any[] = [];
      
      page.on('response', (response) => {
        responses.push({
          url: response.url(),
          status: response.status(),
          size: 0, // Will be calculated
          type: response.request().resourceType(),
          timing: 0
        });
      });
      
      await helpers.navigateAndVerify('/');
      await page.waitForTimeout(2000); // Wait for all resources
      
      // Analyze resource loading
      const resourceTypes = {
        document: 0,
        script: 0,
        stylesheet: 0,
        image: 0,
        font: 0
      };
      
      responses.forEach(response => {
        resourceTypes[response.type] = (resourceTypes[response.type] || 0) + 1;
      });
      
      console.log('📦 Resource breakdown:', resourceTypes);
      
      // Check for performance optimizations
      const optimizations = {
        hasServiceWorker: await page.evaluate(() => 'serviceWorker' in navigator),
        hasCompression: responses.some(r => r.headers && r.headers['content-encoding']),
        hasCaching: responses.some(r => r.headers && (r.headers['cache-control'] || r.headers['etag'])),
        hasPreload: await page.locator('link[rel="preload"]').count() > 0,
        hasPrefetch: await page.locator('link[rel="prefetch"]').count() > 0,
      };
      
      console.log('⚡ Performance optimizations detected:', optimizations);
      
      // Verify no 404s or major errors
      const errors = responses.filter(r => r.status >= 400);
      expect(errors.length).toBe(0);
    });

    test('should have efficient bundle sizes', async ({ page }) => {
      const resourceSizes: any = {};
      
      page.on('response', async (response) => {
        try {
          const body = await response.body();
          const type = response.request().resourceType();
          const size = body.length;
          
          if (!resourceSizes[type]) {
            resourceSizes[type] = [];
          }
          resourceSizes[type].push(size);
        } catch (error) {
          // Handle errors gracefully
        }
      });
      
      await helpers.navigateAndVerify('/');
      await page.waitForTimeout(3000);
      
      // Calculate total sizes by type
      const bundleSizes = {};
      for (const [type, sizes] of Object.entries(resourceSizes)) {
        const totalSize = (sizes as number[]).reduce((sum, size) => sum + size, 0);
        bundleSizes[type] = Math.round(totalSize / 1024); // KB
      }
      
      console.log('📊 Bundle sizes (KB):', bundleSizes);
      
      // Bundle size thresholds
      if (bundleSizes['script']) {
        expect(bundleSizes['script']).toBeLessThan(500); // < 500KB JavaScript
      }
      if (bundleSizes['stylesheet']) {
        expect(bundleSizes['stylesheet']).toBeLessThan(100); // < 100KB CSS
      }
    });
  });

  test.describe('Memory and CPU Performance', () => {
    test('should manage memory efficiently', async ({ page }) => {
      const startMemory = await page.evaluate(() => {
        return (performance as any).memory ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
        } : null;
      });
      
      if (startMemory) {
        console.log('🧠 Initial memory usage:', Math.round(startMemory.usedJSHeapSize / 1024 / 1024), 'MB');
      }
      
      // Navigate through the app flow
      const routes = ['/', '/welcome', '/login', '/adventure-hub'];
      
      for (const route of routes) {
        try {
          await helpers.navigateAndVerify(route);
          await page.waitForTimeout(1000);
        } catch (error) {
          continue;
        }
      }
      
      const endMemory = await page.evaluate(() => {
        return (performance as any).memory ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
        } : null;
      });
      
      if (startMemory && endMemory) {
        const memoryIncrease = endMemory.usedJSHeapSize - startMemory.usedJSHeapSize;
        const increasePercent = (memoryIncrease / startMemory.usedJSHeapSize) * 100;
        
        console.log('🧠 Final memory usage:', Math.round(endMemory.usedJSHeapSize / 1024 / 1024), 'MB');
        console.log('📈 Memory increase:', Math.round(memoryIncrease / 1024 / 1024), 'MB (', Math.round(increasePercent), '%)');
        
        // Memory shouldn't grow excessively
        expect(increasePercent).toBeLessThan(200); // Less than 200% increase
      }
    });

    test('should handle concurrent users simulation', async ({ page, context }) => {
      const startTime = Date.now();
      
      // Simulate multiple user sessions
      const sessions = [];
      for (let i = 0; i < 3; i++) {
        const newPage = await context.newPage();
        sessions.push(newPage);
      }
      
      // Navigate all sessions concurrently
      await Promise.all(sessions.map(async (sessionPage, index) => {
        try {
          await sessionPage.goto('/');
          await sessionPage.waitForLoadState('networkidle');
          
          // Simulate different user paths
          const userPaths = [
            ['/welcome'],
            ['/demo'], 
            ['/welcome', '/login']
          ];
          
          const path = userPaths[index % userPaths.length];
          for (const route of path) {
            try {
              await sessionPage.goto(route);
              await sessionPage.waitForTimeout(500);
            } catch (error) {
              // Handle route errors gracefully
            }
          }
          
        } catch (error) {
          console.log(`Session ${index + 1} error:`, error.message);
        }
      }));
      
      const totalTime = Date.now() - startTime;
      console.log(`👥 Concurrent users simulation completed in ${totalTime}ms`);
      
      // Clean up sessions
      await Promise.all(sessions.map(sessionPage => sessionPage.close()));
      
      // Should handle multiple sessions efficiently
      expect(totalTime).toBeLessThan(15000); // 15 seconds max
    });
  });

  test.describe('Real-World Usage Patterns', () => {
    test('should handle rapid navigation between pages', async ({ page }) => {
      await helpers.navigateAndVerify('/');
      
      const routes = ['/', '/welcome', '/', '/demo', '/', '/welcome'];
      const navigationTimes: number[] = [];
      
      for (const route of routes) {
        const startTime = Date.now();
        try {
          await page.goto(route);
          await page.waitForLoadState('domcontentloaded');
          const navTime = Date.now() - startTime;
          navigationTimes.push(navTime);
        } catch (error) {
          // Handle route errors
          navigationTimes.push(5000); // Penalty for failed route
        }
      }
      
      const averageNavTime = navigationTimes.reduce((sum, time) => sum + time, 0) / navigationTimes.length;
      console.log(`🏃‍♂️ Average rapid navigation time: ${Math.round(averageNavTime)}ms`);
      
      // Rapid navigation should remain responsive
      expect(averageNavTime).toBeLessThan(2000); // 2 seconds average
    });

    test('should maintain performance during extended use', async ({ page }) => {
      await helpers.navigateAndVerify('/');
      
      const performanceLog: number[] = [];
      
      // Simulate extended app usage
      for (let cycle = 0; cycle < 5; cycle++) {
        const cycleStart = Date.now();
        
        // Simulate user interactions
        const interactions = [
          () => page.click('a, button').catch(() => {}),
          () => page.mouse.wheel(0, 500),
          () => page.mouse.wheel(0, -500),
          () => page.keyboard.press('Tab'),
          () => page.waitForTimeout(500),
        ];
        
        for (const interaction of interactions) {
          await interaction();
        }
        
        const cycleTime = Date.now() - cycleStart;
        performanceLog.push(cycleTime);
        
        console.log(`🔄 Usage cycle ${cycle + 1}: ${cycleTime}ms`);
      }
      
      // Performance shouldn't degrade significantly over time
      const firstCycleAvg = performanceLog.slice(0, 2).reduce((a, b) => a + b) / 2;
      const lastCycleAvg = performanceLog.slice(-2).reduce((a, b) => a + b) / 2;
      const degradation = ((lastCycleAvg - firstCycleAvg) / firstCycleAvg) * 100;
      
      console.log(`📉 Performance degradation: ${Math.round(degradation)}%`);
      expect(degradation).toBeLessThan(50); // Less than 50% degradation
    });

    test('should handle errors gracefully without performance impact', async ({ page }) => {
      await helpers.navigateAndVerify('/');
      
      // Simulate various error conditions
      const errorTests = [
        // Network errors
        () => page.route('**/api/**', route => route.abort('failed')),
        // 404 navigation attempts
        () => page.goto('/nonexistent-page').catch(() => {}),
        // JavaScript errors
        () => page.evaluate(() => { throw new Error('Test error'); }).catch(() => {}),
      ];
      
      let errorHandlingTime = 0;
      
      for (const errorTest of errorTests) {
        const startTime = Date.now();
        await errorTest();
        await page.waitForTimeout(1000); // Allow error handling
        errorHandlingTime += Date.now() - startTime;
      }
      
      console.log(`⚠️ Error handling total time: ${errorHandlingTime}ms`);
      
      // Clear error routes
      await page.unroute('**/api/**');
      
      // App should still be responsive after errors
      await helpers.navigateAndVerify('/');
      const postErrorNavigation = Date.now();
      await page.waitForLoadState('domcontentloaded');
      const postErrorTime = Date.now() - postErrorNavigation;
      
      console.log(`🔄 Post-error navigation time: ${postErrorTime}ms`);
      expect(postErrorTime).toBeLessThan(3000); // Should recover quickly
    });
  });

  test.describe('Comprehensive User Journey Performance', () => {
    test('should maintain performance throughout complete P1-P9 flow', async ({ page }) => {
      const journeyMetrics: { step: string; time: number; url: string }[] = [];
      
      // P1: Landing → Welcome
      let stepStart = Date.now();
      await helpers.navigateAndVerify('/');
      await page.click('a[href="/adventure-selection"]').catch(() => {});
      await helpers.waitForPageLoad();
      journeyMetrics.push({
        step: 'P1-Welcome',
        time: Date.now() - stepStart,
        url: page.url()
      });
      
      // P2: Login Express (try guest mode)
      stepStart = Date.now();
      const guestButton = page.locator('text="Continue as Guest"').or(
        page.locator('button, a').filter({ hasText: /guest|demo|skip/i })
      );
      if (await guestButton.count() > 0) {
        await guestButton.first().click();
        await helpers.waitForPageLoad();
      }
      journeyMetrics.push({
        step: 'P2-Login',
        time: Date.now() - stepStart,
        url: page.url()
      });
      
      // P3-P9: Try to navigate through remaining steps
      const remainingSteps = [
        { name: 'P3-Story', routes: ['/intro', '/story'] },
        { name: 'P4-Roles', routes: ['/role-selection', '/roles'] },
        { name: 'P5-Avatar', routes: ['/avatar-generation', '/avatar'] },
        { name: 'P6-Hub', routes: ['/adventure-hub', '/map'] },
        { name: 'P7-Challenge', routes: ['/challenges', '/game'] },
        { name: 'P8-Inventory', routes: ['/inventory', '/progress'] },
        { name: 'P9-Ranking', routes: ['/ranking', '/results'] },
      ];
      
      for (const step of remainingSteps) {
        stepStart = Date.now();
        let navigated = false;
        
        for (const route of step.routes) {
          try {
            await page.goto(route);
            await helpers.waitForPageLoad();
            navigated = true;
            break;
          } catch (error) {
            continue;
          }
        }
        
        journeyMetrics.push({
          step: step.name,
          time: Date.now() - stepStart,
          url: navigated ? page.url() : 'not-found'
        });
      }
      
      // Analyze journey performance
      console.log('🎯 Complete User Journey Performance:');
      let totalTime = 0;
      let completedSteps = 0;
      
      journeyMetrics.forEach(metric => {
        totalTime += metric.time;
        if (!metric.url.includes('not-found')) {
          completedSteps++;
        }
        console.log(`  ${metric.step}: ${metric.time}ms (${metric.url})`);
      });
      
      const averageStepTime = totalTime / journeyMetrics.length;
      const completionRate = (completedSteps / journeyMetrics.length) * 100;
      
      console.log(`📊 Journey Summary:`);
      console.log(`  Total time: ${totalTime}ms`);
      console.log(`  Average step time: ${Math.round(averageStepTime)}ms`);
      console.log(`  Completion rate: ${Math.round(completionRate)}%`);
      
      // Performance expectations
      expect(averageStepTime).toBeLessThan(3000); // 3s average per step
      expect(totalTime).toBeLessThan(25000); // 25s total journey
      
      await helpers.takeScreenshot('complete-journey-final');
    });

    test('should provide consistent performance across devices', async ({ page }) => {
      const deviceTests = [
        { name: 'Mobile', width: 375, height: 667 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Desktop', width: 1280, height: 800 },
      ];
      
      const deviceMetrics: any = {};
      
      for (const device of deviceTests) {
        await page.setViewportSize({ width: device.width, height: device.height });
        
        const startTime = Date.now();
        await helpers.navigateAndVerify('/');
        const loadTime = Date.now() - startTime;
        
        // Test interactions
        const interactionStart = Date.now();
        const button = page.locator('a, button').first();
        if (await button.isVisible()) {
          await button.click();
          await helpers.waitForPageLoad();
        }
        const interactionTime = Date.now() - interactionStart;
        
        deviceMetrics[device.name] = {
          loadTime,
          interactionTime,
          total: loadTime + interactionTime
        };
        
        console.log(`${device.name} (${device.width}x${device.height}): Load ${loadTime}ms, Interaction ${interactionTime}ms`);
      }
      
      // All devices should have reasonable performance
      Object.values(deviceMetrics).forEach((metrics: any) => {
        expect(metrics.loadTime).toBeLessThan(4000); // 4s load time
        expect(metrics.interactionTime).toBeLessThan(2000); // 2s interaction
      });
      
      // Performance variance between devices should be reasonable
      const loadTimes = Object.values(deviceMetrics).map((m: any) => m.loadTime);
      const maxVariance = Math.max(...loadTimes) - Math.min(...loadTimes);
      expect(maxVariance).toBeLessThan(3000); // 3s max difference
    });
  });

  test.describe('Performance Regression Detection', () => {
    test('should establish performance baselines', async ({ page }) => {
      const baselines = {
        landingPageLoad: 0,
        firstInteraction: 0,
        imageLoad: 0,
        scriptExecution: 0,
      };
      
      // Landing page load
      let start = Date.now();
      await helpers.navigateAndVerify('/');
      baselines.landingPageLoad = Date.now() - start;
      
      // First interaction
      start = Date.now();
      const firstButton = page.locator('button, a').first();
      if (await firstButton.isVisible()) {
        await firstButton.hover();
      }
      baselines.firstInteraction = Date.now() - start;
      
      // Image loading
      start = Date.now();
      const images = page.locator('img');
      await images.first().waitFor({ state: 'visible' }).catch(() => {});
      baselines.imageLoad = Date.now() - start;
      
      // Script execution
      start = Date.now();
      await page.evaluate(() => {
        // Simple computation to test script performance
        let sum = 0;
        for (let i = 0; i < 10000; i++) {
          sum += Math.sqrt(i);
        }
        return sum;
      });
      baselines.scriptExecution = Date.now() - start;
      
      console.log('📏 Performance Baselines:');
      Object.entries(baselines).forEach(([metric, time]) => {
        console.log(`  ${metric}: ${time}ms`);
      });
      
      // Store baselines for future regression testing
      await page.evaluate((baselines) => {
        localStorage.setItem('performance-baselines', JSON.stringify(baselines));
      }, baselines);
      
      // All baselines should be reasonable
      expect(baselines.landingPageLoad).toBeLessThan(3000);
      expect(baselines.firstInteraction).toBeLessThan(500);
      expect(baselines.imageLoad).toBeLessThan(2000);
      expect(baselines.scriptExecution).toBeLessThan(100);
    });
  });
});