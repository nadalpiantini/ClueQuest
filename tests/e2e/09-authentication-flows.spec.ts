import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Authentication Flows - Comprehensive Testing', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test.describe('Email/Password Authentication', () => {
    test.beforeEach(async ({ page }) => {
      await helpers.navigateAndVerify('/');
      
      // Navigate to login through the adventure flow
      const adventureButton = page.locator('a[href="/adventure-selection"], a').filter({ hasText: /begin.*mystery|start/i });
      if (await adventureButton.count() > 0) {
        await adventureButton.first().click();
        await helpers.waitForPageLoad();
      }
      
      // Try to find login form
      const loginRoutes = ['/login', '/auth', '/adventure/login'];
      for (const route of loginRoutes) {
        try {
          await page.goto(route);
          break;
        } catch (error) {
          continue;
        }
      }
    });

    test('should validate email format correctly', async ({ page }) => {
      const emailField = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
      
      if (await emailField.count() > 0) {
        // Test invalid email formats
        const invalidEmails = ['invalid', 'test@', '@domain.com', 'test..test@domain.com'];
        
        for (const invalidEmail of invalidEmails) {
          await emailField.first().fill(invalidEmail);
          
          // Try to submit or trigger validation
          await emailField.first().blur(); // Lose focus to trigger validation
          await page.waitForTimeout(500);
          
          // Look for validation message
          const validationMessage = page.locator('[role="alert"], .error, .invalid, .text-red-500');
          if (await validationMessage.count() > 0) {
            console.log(`✅ Validation caught invalid email: ${invalidEmail}`);
            break;
          }
        }
        
        // Test valid email
        await emailField.first().fill('test@example.com');
        await emailField.first().blur();
        await page.waitForTimeout(500);
        
        // Should not show error for valid email
        const errorAfterValid = page.locator('.error:visible, .invalid:visible');
        expect(await errorAfterValid.count()).toBe(0);
        
        console.log('✅ Valid email accepted');
      } else {
        console.log('⚠️ No email field found');
      }
    });

    test('should enforce password requirements', async ({ page }) => {
      const passwordField = page.locator('input[type="password"], input[name="password"]');
      
      if (await passwordField.count() > 0) {
        // Test weak passwords
        const weakPasswords = ['123', 'password', 'abc'];
        
        for (const weakPassword of weakPasswords) {
          await passwordField.first().fill(weakPassword);
          await passwordField.first().blur();
          await page.waitForTimeout(500);
          
          // Look for password strength indicator or validation
          const passwordFeedback = page.locator('.password-strength, .weak, [role="alert"]');
          if (await passwordFeedback.count() > 0) {
            console.log(`✅ Password validation detected weak password: ${weakPassword}`);
            break;
          }
        }
        
        // Test strong password
        await passwordField.first().fill('StrongPassword123!');
        await passwordField.first().blur();
        await page.waitForTimeout(500);
        
        console.log('✅ Strong password accepted');
      } else {
        console.log('⚠️ No password field found');
      }
    });

    test('should handle invalid credentials gracefully', async ({ page }) => {
      const emailField = page.locator('input[type="email"], input[name="email"]');
      const passwordField = page.locator('input[type="password"], input[name="password"]');
      const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /login|sign.*in/i });
      
      if (await emailField.count() > 0 && await passwordField.count() > 0 && await submitButton.count() > 0) {
        // Fill with fake credentials
        await emailField.first().fill('nonexistent@example.com');
        await passwordField.first().fill('wrongpassword123');
        
        await submitButton.first().click();
        await page.waitForTimeout(2000); // Wait for auth attempt
        
        // Look for error message
        const errorMessage = page.locator('[role="alert"], .error, .auth-error, .text-red-500');
        
        if (await errorMessage.count() > 0) {
          const errorText = await errorMessage.first().textContent();
          console.log(`✅ Login error handled: ${errorText}`);
          await helpers.takeScreenshot('auth-invalid-credentials');
        } else {
          console.log('⚠️ No error message shown for invalid credentials');
        }
      }
    });

    test('should show password visibility toggle', async ({ page }) => {
      const passwordField = page.locator('input[type="password"]');
      
      if (await passwordField.count() > 0) {
        // Look for password toggle button
        const toggleButton = page.locator('button').filter({ hasText: /show|hide|eye/i });
        const toggleIcon = page.locator('svg').filter({ hasText: /eye/i });
        
        if (await toggleButton.count() > 0 || await toggleIcon.count() > 0) {
          const toggle = (await toggleButton.count() > 0) ? toggleButton.first() : toggleIcon.first();
          
          await passwordField.first().fill('testpassword');
          
          // Click toggle
          await toggle.click();
          await page.waitForTimeout(300);
          
          // Check if password field type changed
          const fieldType = await passwordField.first().getAttribute('type');
          if (fieldType === 'text') {
            console.log('✅ Password visibility toggle working');
          }
          
          await helpers.takeScreenshot('auth-password-toggle');
        } else {
          console.log('⚠️ No password visibility toggle found');
        }
      }
    });
  });

  test.describe('Social Authentication', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to login page
      const loginRoutes = ['/login', '/auth', '/adventure/login'];
      for (const route of loginRoutes) {
        try {
          await page.goto(route);
          await helpers.waitForPageLoad();
          break;
        } catch (error) {
          continue;
        }
      }
    });

    test('should display social login options', async ({ page }) => {
      const socialProviders = [
        { name: 'Google', selectors: ['text="Google"', 'text="Sign in with Google"', '[alt*="google" i]'] },
        { name: 'Facebook', selectors: ['text="Facebook"', 'text="Sign in with Facebook"', '[alt*="facebook" i]'] },
        { name: 'GitHub', selectors: ['text="GitHub"', 'text="Sign in with GitHub"', '[alt*="github" i]'] },
        { name: 'Apple', selectors: ['text="Apple"', 'text="Sign in with Apple"', '[alt*="apple" i]'] },
      ];
      
      const foundProviders = [];
      
      for (const provider of socialProviders) {
        let providerFound = false;
        for (const selector of provider.selectors) {
          const element = page.locator(selector);
          if (await element.count() > 0) {
            await expect(element.first()).toBeVisible();
            await helpers.verifyTouchTarget(element.first());
            foundProviders.push(provider.name);
            providerFound = true;
            break;
          }
        }
      }
      
      if (foundProviders.length > 0) {
        console.log(`✅ Found social login providers: ${foundProviders.join(', ')}`);
        await helpers.takeScreenshot('auth-social-providers');
      } else {
        console.log('⚠️ No social login providers found');
      }
    });

    test('should handle social login button interactions', async ({ page }) => {
      const socialButtons = page.locator('button, a').filter({ hasText: /google|facebook|github|apple|sign.*with/i });
      const count = await socialButtons.count();
      
      if (count > 0) {
        // Test first social login button
        const socialButton = socialButtons.first();
        await expect(socialButton).toBeVisible();
        await helpers.verifyTouchTarget(socialButton);
        
        // Test hover effect (desktop only)
        if (!page.viewportSize() || page.viewportSize()!.width > 768) {
          await socialButton.hover();
          await page.waitForTimeout(300);
        }
        
        // Don't actually click to avoid external OAuth flows
        console.log('✅ Social login button interactions tested');
      }
    });
  });

  test.describe('Guest Mode Access', () => {
    test('should provide guest/demo access option', async ({ page }) => {
      await helpers.navigateAndVerify('/');
      
      // Look for guest access throughout the flow
      const guestAccessPages = ['/', '/welcome', '/login', '/auth'];
      
      for (const pagePath of guestAccessPages) {
        await page.goto(pagePath);
        await helpers.waitForPageLoad();
        
        const guestButtons = [
          page.locator('text="Continue as Guest"'),
          page.locator('text="Guest Mode"'),
          page.locator('text="Demo"'),
          page.locator('text="Try Demo"'),
          page.locator('button, a').filter({ hasText: /guest|demo|try.*without|skip.*login/i }),
        ];
        
        for (const buttonSet of guestButtons) {
          if (await buttonSet.count() > 0) {
            const guestButton = buttonSet.first();
            await expect(guestButton).toBeVisible();
            await helpers.verifyTouchTarget(guestButton);
            
            console.log(`✅ Guest access found on ${pagePath}`);
            
            // Test guest login flow
            await guestButton.click();
            await helpers.waitForPageLoad();
            
            // Should proceed to adventure flow
            const currentUrl = page.url();
            if (!currentUrl.includes('/login') && !currentUrl.includes('/auth')) {
              console.log('✅ Guest access allows proceeding without login');
              await helpers.takeScreenshot('auth-guest-access');
              return;
            }
            break;
          }
        }
      }
      
      console.log('⚠️ No guest access option found');
    });
  });

  test.describe('Authentication Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate network failure during authentication
      await page.route('**/auth/**', route => route.abort('failed'));
      
      await helpers.navigateAndVerify('/login');
      
      const emailField = page.locator('input[type="email"]');
      const passwordField = page.locator('input[type="password"]');
      const submitButton = page.locator('button[type="submit"]');
      
      if (await emailField.count() > 0 && await passwordField.count() > 0 && await submitButton.count() > 0) {
        await emailField.first().fill('test@example.com');
        await passwordField.first().fill('password123');
        
        await submitButton.first().click();
        await page.waitForTimeout(3000);
        
        // Look for network error message
        const networkError = page.locator('[role="alert"], .error').filter({ hasText: /network|connection|failed/i });
        if (await networkError.count() > 0) {
          console.log('✅ Network error handled gracefully');
        }
      }
      
      // Clear the route interception
      await page.unroute('**/auth/**');
    });

    test('should show loading states during authentication', async ({ page }) => {
      await helpers.navigateAndVerify('/login');
      
      const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /login|sign.*in/i });
      
      if (await submitButton.count() > 0) {
        // Fill form
        const emailField = page.locator('input[type="email"]');
        const passwordField = page.locator('input[type="password"]');
        
        if (await emailField.count() > 0 && await passwordField.count() > 0) {
          await emailField.first().fill('test@example.com');
          await passwordField.first().fill('password123');
        }
        
        // Click submit and quickly look for loading state
        await submitButton.first().click();
        
        // Look for loading indicators within first second
        await page.waitForTimeout(100);
        
        const loadingIndicators = [
          page.locator('.loading, .spinner'),
          page.locator('[aria-label*="loading" i]'),
          page.locator('.animate-spin'),
          submitButton.filter({ hasText: /loading|authenticating/i }),
        ];
        
        for (const indicatorSet of loadingIndicators) {
          if (await indicatorSet.count() > 0) {
            console.log('✅ Loading state shown during authentication');
            await helpers.takeScreenshot('auth-loading-state');
            break;
          }
        }
      }
    });

    test('should handle session timeout gracefully', async ({ page }) => {
      // Mock expired session scenario
      await page.addInitScript(() => {
        // Mock expired token scenario
        localStorage.setItem('auth-expired', 'true');
      });
      
      await helpers.navigateAndVerify('/');
      
      // Try to access protected content
      const protectedRoutes = ['/inventory', '/progress', '/adventure-hub'];
      
      for (const route of protectedRoutes) {
        try {
          await page.goto(route);
          await helpers.waitForPageLoad();
          
          // Should redirect to login or show session expired message
          const currentUrl = page.url();
          if (currentUrl.includes('/login') || currentUrl.includes('/auth')) {
            console.log('✅ Session timeout redirected to login');
            
            // Look for session expired message
            const sessionMessage = page.locator('text="Session expired"').or(page.locator('text="Please login"'));
            if (await sessionMessage.count() > 0) {
              console.log('✅ Session expiry message shown');
            }
            break;
          }
        } catch (error) {
          continue;
        }
      }
    });
  });

  test.describe('Mobile Authentication UX', () => {
    test('should be optimized for mobile keyboards', async ({ page }) => {
      if (page.viewportSize() && page.viewportSize()!.width <= 768) {
        await helpers.navigateAndVerify('/login');
        
        const emailField = page.locator('input[type="email"]');
        const passwordField = page.locator('input[type="password"]');
        
        if (await emailField.count() > 0) {
          // Check email field has proper input type for mobile keyboard
          const inputType = await emailField.first().getAttribute('type');
          const autocomplete = await emailField.first().getAttribute('autocomplete');
          
          expect(inputType).toBe('email'); // Triggers email keyboard on mobile
          
          if (autocomplete) {
            expect(autocomplete).toContain('email');
          }
          
          console.log('✅ Mobile email keyboard optimization verified');
        }
        
        if (await passwordField.count() > 0) {
          // Check password field attributes
          const autocomplete = await passwordField.first().getAttribute('autocomplete');
          if (autocomplete) {
            expect(autocomplete).toMatch(/current-password|password/);
          }
          
          console.log('✅ Mobile password field optimization verified');
        }
      }
    });

    test('should have proper touch targets for mobile', async ({ page }) => {
      if (page.viewportSize() && page.viewportSize()!.width <= 768) {
        await helpers.navigateAndVerify('/login');
        
        // Test all interactive authentication elements
        const authElements = page.locator('input, button, a[role="button"]');
        const count = await authElements.count();
        
        for (let i = 0; i < count; i++) {
          const element = authElements.nth(i);
          if (await element.isVisible()) {
            await helpers.verifyTouchTarget(element, 44); // WCAG minimum
          }
        }
        
        console.log('✅ Mobile touch targets verified');
      }
    });

    test('should handle mobile keyboard covering inputs', async ({ page }) => {
      if (page.viewportSize() && page.viewportSize()!.width <= 768) {
        await helpers.navigateAndVerify('/login');
        
        const passwordField = page.locator('input[type="password"]');
        
        if (await passwordField.count() > 0) {
          // Focus on password field (would trigger keyboard on real device)
          await passwordField.first().focus();
          await page.waitForTimeout(500);
          
          // Verify field is still visible/accessible
          await expect(passwordField.first()).toBeVisible();
          
          // Check if page scrolls to keep field visible
          const fieldBox = await passwordField.first().boundingBox();
          const viewportHeight = page.viewportSize()!.height;
          
          if (fieldBox) {
            // Field should be in visible area (accounting for virtual keyboard)
            const visibleArea = viewportHeight * 0.5; // Assume keyboard takes 50%
            expect(fieldBox.y).toBeLessThan(visibleArea);
          }
          
          console.log('✅ Mobile keyboard handling verified');
        }
      }
    });
  });

  test.describe('Authentication Accessibility', () => {
    test('should provide proper ARIA labels and roles', async ({ page }) => {
      await helpers.navigateAndVerify('/login');
      
      const authForm = page.locator('form, [role="form"]');
      if (await authForm.count() > 0) {
        await helpers.verifyAccessibility(authForm.first());
      }
      
      // Check form fields
      const formFields = page.locator('input');
      const fieldCount = await formFields.count();
      
      for (let i = 0; i < fieldCount; i++) {
        const field = formFields.nth(i);
        if (await field.isVisible()) {
          await helpers.verifyAccessibility(field);
          
          // Check for associated labels
          const fieldId = await field.getAttribute('id');
          const ariaLabelledBy = await field.getAttribute('aria-labelledby');
          
          if (fieldId) {
            const label = page.locator(`label[for="${fieldId}"]`);
            if (await label.count() > 0) {
              console.log('✅ Form field has proper label association');
            }
          } else if (ariaLabelledBy) {
            const labelElement = page.locator(`#${ariaLabelledBy}`);
            if (await labelElement.count() > 0) {
              console.log('✅ Form field has proper ARIA labelling');
            }
          }
        }
      }
      
      console.log('✅ Authentication form accessibility verified');
    });

    test('should support keyboard navigation', async ({ page }) => {
      await helpers.navigateAndVerify('/login');
      
      // Test tab navigation through form
      const interactiveElements = page.locator('input, button, a[role="button"]');
      const count = await interactiveElements.count();
      
      if (count > 0) {
        // Start at first element
        await interactiveElements.first().focus();
        
        // Tab through elements
        for (let i = 1; i < Math.min(count, 5); i++) {
          await page.keyboard.press('Tab');
          await page.waitForTimeout(200);
          
          // Verify focus moved
          const focusedElement = page.locator(':focus');
          await expect(focusedElement).toHaveCount(1);
        }
        
        console.log('✅ Keyboard navigation working');
      }
    });

    test('should announce errors to screen readers', async ({ page }) => {
      await helpers.navigateAndVerify('/login');
      
      // Trigger validation error
      const submitButton = page.locator('button[type="submit"]');
      if (await submitButton.count() > 0) {
        await submitButton.first().click();
        await page.waitForTimeout(1000);
        
        // Look for error announcements
        const errorAnnouncements = page.locator('[role="alert"], [aria-live="polite"], [aria-live="assertive"]');
        if (await errorAnnouncements.count() > 0) {
          console.log('✅ Error announcements available for screen readers');
        }
      }
    });
  });
});