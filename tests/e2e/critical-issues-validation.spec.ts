import { test, expect } from '@playwright/test'

/**
 * CRITICAL ISSUES VALIDATION
 * Verify specific problems found in comprehensive audit
 * Focus on actionable fixes for development team
 */

test.describe('Critical Issues Validation', () => {
  
  test('Adventure Flow Pages - Crash Investigation', async ({ page }) => {
    console.log('🔍 INVESTIGATING ADVENTURE FLOW PAGE CRASHES')
    
    const problematicPages = [
      '/adventure/role-selection',
      '/adventure/avatar-generation', 
      '/adventure/adventure-hub',
      '/adventure/qr-scan',
      '/adventure/challenges',
      '/adventure/ranking'
    ]
    
    for (const pagePath of problematicPages) {
      console.log(`\\nTesting ${pagePath}...`)
      
      try {
        // Monitor console errors
        const consoleErrors = []
        page.on('console', msg => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text())
          }
        })
        
        // Monitor network failures
        const networkErrors = []
        page.on('requestfailed', request => {
          networkErrors.push(request.url())
        })
        
        await page.goto(`http://localhost:5173${pagePath}`, { timeout: 10000 })
        await page.waitForTimeout(3000)
        
        console.log(`   ✅ ${pagePath} - loaded successfully`)
        
        if (consoleErrors.length > 0) {
          console.log(`   ⚠️ Console errors found:`)
          consoleErrors.forEach(err => console.log(`      - ${err.substring(0, 100)}`))
        }
        
        if (networkErrors.length > 0) {
          console.log(`   ⚠️ Network errors found:`)
          networkErrors.forEach(err => console.log(`      - ${err}`))
        }
        
      } catch (e) {
        console.log(`   ❌ ${pagePath} - FAILED: ${e.message}`)
        
        // Try to identify specific error types
        if (e.message.includes('timeout')) {
          console.log('      → DIAGNOSIS: Page load timeout (possible infinite loop)')
        } else if (e.message.includes('closed')) {
          console.log('      → DIAGNOSIS: Browser crash (possible memory issue)')
        } else if (e.message.includes('network')) {
          console.log('      → DIAGNOSIS: Network/resource loading issue')
        }
      }
    }
  })
  
  test('Touch Target Measurement - Specific Buttons', async ({ page }) => {
    console.log('👆 MEASURING SPECIFIC TOUCH TARGETS')
    
    const pagesToCheck = [
      { path: '/', buttons: ['a[href="/adventure-selection"]', 'a[href="/demo"]'] },
      { path: '/adventure-selection', buttons: ['.adventure-card', '.card'] },
      { path: '/adventure/welcome', buttons: ['button', 'a'] }
    ]
    
    for (const pageCheck of pagesToCheck) {
      try {
        await page.goto(`http://localhost:5173${pageCheck.path}`)
        await page.waitForTimeout(2000)
        
        console.log(`\\n📱 Checking ${pageCheck.path}:`)
        
        for (const buttonSelector of pageCheck.buttons) {
          try {
            const buttons = page.locator(buttonSelector)
            const count = await buttons.count()
            
            for (let i = 0; i < Math.min(count, 3); i++) {
              const button = buttons.nth(i)
              const bbox = await button.boundingBox()
              
              if (bbox) {
                const isCompliant = bbox.width >= 44 && bbox.height >= 44
                const recommendation = isCompliant ? 'Good' : `Increase to 44x44px (currently ${Math.round(bbox.width)}x${Math.round(bbox.height)}px)`
                
                console.log(`   ${buttonSelector} [${i+1}]: ${Math.round(bbox.width)}x${Math.round(bbox.height)}px - ${recommendation}`)
              }
            }
          } catch (e) {
            console.log(`   ${buttonSelector}: Not found or error`)
          }
        }
      } catch (e) {
        console.log(`   ❌ ${pageCheck.path}: Page load failed`)
      }
    }
  })
  
  test('Gaming Button Functionality - Core Actions', async ({ page }) => {
    console.log('🎮 TESTING CORE GAMING BUTTON FUNCTIONALITY')
    
    const gamingActions = [
      { 
        page: '/', 
        button: 'a[href="/adventure-selection"]',
        expectedAction: 'Navigate to adventure selection',
        test: 'click'
      },
      {
        page: '/adventure-selection',
        button: '.card, .adventure-card',
        expectedAction: 'Select adventure type',  
        test: 'hover'
      },
      {
        page: '/demo',
        button: 'button, a',
        expectedAction: 'Play demo content',
        test: 'click'
      }
    ]
    
    for (const action of gamingActions) {
      try {
        await page.goto(`http://localhost:5173${action.page}`)
        await page.waitForTimeout(2000)
        
        console.log(`\\n🎯 Testing ${action.page} - ${action.expectedAction}`)
        
        const button = page.locator(action.button).first()
        
        if (await button.isVisible()) {
          if (action.test === 'click') {
            await button.click()
            await page.waitForTimeout(1000)
            console.log(`   ✅ Click action successful`)
          } else if (action.test === 'hover') {
            await button.hover()
            await page.waitForTimeout(500)
            console.log(`   ✅ Hover action successful`)
          }
        } else {
          console.log(`   ❌ Button not visible: ${action.button}`)
        }
        
      } catch (e) {
        console.log(`   ❌ Action failed: ${e.message?.substring(0, 80)}`)
      }
    }
  })
  
  test('Mobile Responsiveness - Overflow Detection', async ({ page }) => {
    console.log('📱 DETECTING MOBILE OVERFLOW ISSUES')
    
    const mobileViewports = [
      { width: 320, height: 568, name: 'iPhone 5/SE' },
      { width: 375, height: 667, name: 'iPhone 8' }
    ]
    
    const testPages = ['/', '/adventure-selection', '/join']
    
    for (const viewport of mobileViewports) {
      console.log(`\\n📱 Testing ${viewport.name} (${viewport.width}px wide):`)
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      
      for (const testPage of testPages) {
        try {
          await page.goto(`http://localhost:5173${testPage}`)
          await page.waitForTimeout(1500)
          
          const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
          const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth)
          const maxWidth = Math.max(bodyWidth, documentWidth)
          
          if (maxWidth > viewport.width) {
            const overflow = maxWidth - viewport.width
            console.log(`   ❌ ${testPage}: ${overflow}px overflow detected`)
            
            // Try to identify the offending element
            const wideElements = await page.evaluate((viewportWidth) => {
              const elements = document.querySelectorAll('*')
              const offenders = []
              
              elements.forEach(el => {
                const rect = el.getBoundingClientRect()
                if (rect.width > viewportWidth) {
                  offenders.push({
                    tag: el.tagName,
                    class: el.className,
                    width: Math.round(rect.width)
                  })
                }
              })
              
              return offenders.slice(0, 3) // Top 3 offenders
            }, viewport.width)
            
            wideElements.forEach(el => {
              console.log(`      → ${el.tag}.${el.class}: ${el.width}px wide`)
            })
            
          } else {
            console.log(`   ✅ ${testPage}: No overflow (${maxWidth}px wide)`)
          }
          
        } catch (e) {
          console.log(`   ❌ ${testPage}: Test failed`)
        }
      }
    }
  })
  
  test('Performance - Page Load Times', async ({ page }) => {
    console.log('⚡ MEASURING PAGE LOAD PERFORMANCE')
    
    const performancePages = ['/', '/adventure-selection', '/demo', '/join']
    
    for (const testPage of performancePages) {
      console.log(`\\n⏱️ Testing ${testPage}:`)
      
      const startTime = Date.now()
      
      try {
        await page.goto(`http://localhost:5173${testPage}`)
        await page.waitForLoadState('networkidle')
        
        const loadTime = Date.now() - startTime
        console.log(`   Load time: ${loadTime}ms`)
        
        if (loadTime > 3000) {
          console.log(`   ⚠️ Slow loading (>3s) - consider optimization`)
        } else if (loadTime > 1000) {
          console.log(`   🟡 Moderate loading (1-3s) - acceptable for gaming`)
        } else {
          console.log(`   ✅ Fast loading (<1s) - excellent`)
        }
        
        // Check for large resources
        const resourceSizes = await page.evaluate(() => {
          return performance.getEntriesByType('navigation').map(entry => ({
            transferSize: entry.transferSize,
            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            loadComplete: entry.loadEventEnd - entry.loadEventStart
          }))
        })
        
        if (resourceSizes.length > 0) {
          const size = resourceSizes[0]
          console.log(`   Transfer size: ${Math.round(size.transferSize / 1024)}KB`)
          console.log(`   DOM ready: ${Math.round(size.domContentLoaded)}ms`)
        }
        
      } catch (e) {
        console.log(`   ❌ Performance test failed: ${e.message?.substring(0, 50)}`)
      }
    }
  })
})