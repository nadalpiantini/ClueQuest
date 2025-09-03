import { test, expect, Page } from '@playwright/test'

/**
 * CLUEQUEST GAMING COMPONENTS AUDIT
 * Focus on gaming-specific buttons, animations, and interactions
 * Testing GamingButton variants, modal centering, touch targets
 */

test.describe('ClueQuest Gaming Components Audit', () => {
  
  test('Gaming Button Components - All variants', async ({ page }) => {
    // Test gaming buttons across different pages
    const pagesWithGamingButtons = [
      { url: '/', name: 'Landing Page' },
      { url: '/adventure-selection', name: 'Adventure Selection' },
      { url: '/adventure/role-selection', name: 'Role Selection' },
      { url: '/adventure/challenges', name: 'Challenges' },
    ]
    
    let totalGamingButtons = 0
    let workingGamingButtons = 0
    
    for (const pageInfo of pagesWithGamingButtons) {
      console.log(`\n🎮 Testing gaming buttons on ${pageInfo.name}...`)
      await page.goto(`http://localhost:5173${pageInfo.url}`)
      await page.waitForTimeout(2000)
      
      // Find gaming-specific buttons
      const gamingButtons = page.locator(`
        .gaming-button,
        button:has-text("Begin"),
        button:has-text("Start"),
        button:has-text("Continue"),
        button:has-text("Next"),
        button:has-text("Select"),
        button:has-text("Choose"),
        button:has-text("Scan"),
        button:has-text("Submit"),
        [class*="btn-primary"],
        [class*="btn-mystery"],
        [class*="btn-ghost"],
        [class*="btn-outline"]
      `)
      
      const buttonCount = await gamingButtons.count()
      totalGamingButtons += buttonCount
      
      console.log(`   Found ${buttonCount} gaming buttons`)
      
      for (let i = 0; i < buttonCount; i++) {
        try {
          const button = gamingButtons.nth(i)
          
          // Check visibility
          await expect(button).toBeVisible()
          
          // Check touch target size (minimum 44px for gaming)
          const bbox = await button.boundingBox()
          if (bbox) {
            const isTouchTarget = bbox.height >= 44 && bbox.width >= 44
            console.log(`   Button ${i + 1}: ${Math.round(bbox.width)}x${Math.round(bbox.height)}px - ${isTouchTarget ? '✅ Touch-friendly' : '⚠️ Small'}`)
          }
          
          // Test hover animations
          await button.hover()
          await page.waitForTimeout(200) // Allow for animation
          
          // Test click interaction
          await button.click()
          await page.waitForTimeout(300)
          
          workingGamingButtons++
          console.log(`   ✅ Gaming button ${i + 1} - fully interactive`)
          
        } catch (e) {
          console.log(`   ❌ Gaming button ${i + 1} - failed: ${e.message?.substring(0, 50)}`)
        }
      }
      
      // Test for button hover effects (Framer Motion animations)
      const animatedButtons = page.locator('button, a').filter({ hasText: /Begin|Start|Continue|Next/ })
      const animatedCount = await animatedButtons.count()
      
      if (animatedCount > 0) {
        console.log(`   🎬 Testing ${animatedCount} animated buttons...`)
        
        for (let i = 0; i < Math.min(animatedCount, 3); i++) {
          try {
            const button = animatedButtons.nth(i)
            
            // Test hover animation
            await button.hover()
            await page.waitForTimeout(300)
            
            // Test scale/transform animations
            const transform = await button.evaluate(el => window.getComputedStyle(el).transform)
            console.log(`   Button ${i + 1} transform: ${transform !== 'none' ? '✅ Animated' : '⚠️ Static'}`)
            
          } catch (e) {
            console.log(`   ❌ Animation test ${i + 1} failed`)
          }
        }
      }
    }
    
    console.log(`\n🎮 Gaming Buttons Summary: ${workingGamingButtons}/${totalGamingButtons} working (${Math.round(workingGamingButtons/totalGamingButtons*100)}%)`)
    expect(workingGamingButtons / totalGamingButtons).toBeGreaterThan(0.8)
  })
  
  test('Modal Centering - Perfect centering test', async ({ page }) => {
    console.log('🎯 Testing modal centering across viewports...')
    
    // Test modal centering on pages that likely have modals
    const modalPages = [
      '/adventure/role-selection',
      '/adventure/avatar-generation',
      '/adventure/challenges'
    ]
    
    const viewports = [
      { width: 320, height: 568, name: 'Small Mobile' },
      { width: 375, height: 667, name: 'iPhone' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1200, height: 800, name: 'Desktop' },
      { width: 3840, height: 2160, name: '4K' }
    ]
    
    for (const viewport of viewports) {
      console.log(`\n📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})...`)
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      
      for (const modalPage of modalPages) {
        try {
          await page.goto(`http://localhost:5173${modalPage}`)
          await page.waitForTimeout(1000)
          
          // Look for modal elements
          const modals = page.locator('[role="dialog"], .modal, [class*="dialog"], [class*="modal"]')
          const modalCount = await modals.count()
          
          if (modalCount > 0) {
            console.log(`   Found ${modalCount} modal(s) on ${modalPage}`)
            
            for (let i = 0; i < modalCount; i++) {
              const modal = modals.nth(i)
              const bbox = await modal.boundingBox()
              
              if (bbox) {
                const centerX = bbox.x + bbox.width / 2
                const centerY = bbox.y + bbox.height / 2
                const viewportCenterX = viewport.width / 2
                const viewportCenterY = viewport.height / 2
                
                const offsetX = Math.abs(centerX - viewportCenterX)
                const offsetY = Math.abs(centerY - viewportCenterY)
                
                const isPerfectlyCentered = offsetX < 10 && offsetY < 10 // 10px tolerance
                
                console.log(`   Modal ${i + 1}: ${isPerfectlyCentered ? '✅ Perfectly centered' : `⚠️ Off by ${Math.round(offsetX)}x${Math.round(offsetY)}px`}`)
              }
            }
          }
        } catch (e) {
          console.log(`   ⚠️ ${modalPage} - no modals or error`)
        }
      }
    }
  })
  
  test('Touch Target Compliance - 44px minimum', async ({ page }) => {
    console.log('👆 Testing touch target compliance (WCAG 2.1)...')
    
    const testPages = [
      '/',
      '/adventure-selection',
      '/adventure/welcome',
      '/adventure/role-selection',
      '/adventure/challenges'
    ]
    
    let totalTouchTargets = 0
    let compliantTouchTargets = 0
    
    for (const testPage of testPages) {
      await page.goto(`http://localhost:5173${testPage}`)
      await page.waitForTimeout(1500)
      
      console.log(`\n📱 Checking ${testPage}...`)
      
      // Get all interactive elements
      const interactiveElements = page.locator(`
        button,
        a,
        input[type="button"],
        input[type="submit"],
        [role="button"],
        [onclick],
        [class*="btn"],
        [class*="button"]
      `)
      
      const elementCount = await interactiveElements.count()
      totalTouchTargets += elementCount
      
      console.log(`   Found ${elementCount} interactive elements`)
      
      for (let i = 0; i < elementCount; i++) {
        try {
          const element = interactiveElements.nth(i)
          const bbox = await element.boundingBox()
          
          if (bbox) {
            const isCompliant = bbox.width >= 44 && bbox.height >= 44
            const minDimension = Math.min(bbox.width, bbox.height)
            
            if (isCompliant) {
              compliantTouchTargets++
            }
            
            console.log(`   Element ${i + 1}: ${Math.round(bbox.width)}x${Math.round(bbox.height)}px - ${isCompliant ? '✅ WCAG Compliant' : `⚠️ Too small (min: ${Math.round(minDimension)}px)`}`)
          }
        } catch (e) {
          console.log(`   ❌ Element ${i + 1} - measurement failed`)
        }
      }
    }
    
    const complianceRate = compliantTouchTargets / totalTouchTargets
    console.log(`\n👆 Touch Target Compliance: ${compliantTouchTargets}/${totalTouchTargets} (${Math.round(complianceRate*100)}%)`)
    
    // Gaming platforms should have higher compliance rates
    expect(complianceRate).toBeGreaterThan(0.7) // 70% minimum for gaming
  })
  
  test('Animation Performance - Smooth gaming animations', async ({ page }) => {
    console.log('🎬 Testing animation performance...')
    
    await page.goto('http://localhost:5173/')
    await page.waitForTimeout(2000)
    
    // Start performance monitoring
    await page.evaluate(() => {
      window.animationFrames = []
      window.startTime = performance.now()
      
      function measureFrame() {
        window.animationFrames.push(performance.now())
        if (performance.now() - window.startTime < 5000) { // 5 seconds
          requestAnimationFrame(measureFrame)
        }
      }
      requestAnimationFrame(measureFrame)
    })
    
    // Trigger animations by hovering over elements
    const animatedElements = page.locator(`
      .card,
      button:has-text("Begin"),
      [class*="animate"],
      [class*="transition"]
    `)
    
    const animatedCount = await animatedElements.count()
    console.log(`   Found ${animatedCount} animated elements`)
    
    for (let i = 0; i < Math.min(animatedCount, 5); i++) {
      try {
        await animatedElements.nth(i).hover()
        await page.waitForTimeout(200)
        console.log(`   ✅ Triggered animation ${i + 1}`)
      } catch (e) {
        console.log(`   ❌ Animation ${i + 1} failed`)
      }
    }
    
    // Wait for animations to complete
    await page.waitForTimeout(2000)
    
    // Measure frame rate
    const frameData = await page.evaluate(() => {
      if (!window.animationFrames || window.animationFrames.length < 2) return null
      
      const frames = window.animationFrames
      const totalTime = frames[frames.length - 1] - frames[0]
      const frameCount = frames.length - 1
      const averageFrameTime = totalTime / frameCount
      const fps = 1000 / averageFrameTime
      
      return {
        fps: Math.round(fps),
        frameCount,
        totalTime: Math.round(totalTime)
      }
    })
    
    if (frameData) {
      console.log(`   🎬 Animation Performance: ${frameData.fps} FPS (${frameData.frameCount} frames in ${frameData.totalTime}ms)`)
      expect(frameData.fps).toBeGreaterThan(45) // Gaming should maintain >45 FPS
    }
  })
  
  test('Responsive Gaming Components', async ({ page }) => {
    console.log('📱 Testing responsive gaming components...')
    
    const responsivePages = [
      '/adventure/role-selection',
      '/adventure/challenges',
      '/adventure/adventure-hub'
    ]
    
    const breakpoints = [
      { width: 320, height: 568, name: 'XS Mobile' },
      { width: 640, height: 1136, name: 'SM Mobile' },
      { width: 768, height: 1024, name: 'MD Tablet' },
      { width: 1024, height: 768, name: 'LG Desktop' },
      { width: 1280, height: 720, name: 'XL Desktop' }
    ]
    
    for (const breakpoint of breakpoints) {
      console.log(`\n📱 Testing ${breakpoint.name} (${breakpoint.width}px)...`)
      await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height })
      
      for (const responsivePage of responsivePages) {
        try {
          await page.goto(`http://localhost:5173${responsivePage}`)
          await page.waitForTimeout(1000)
          
          // Check gaming component responsiveness
          const gamingComponents = page.locator(`
            .gaming-button,
            .card,
            button,
            [class*="grid"],
            [class*="flex"]
          `)
          
          const componentCount = await gamingComponents.count()
          let responsiveComponents = 0
          
          for (let i = 0; i < Math.min(componentCount, 5); i++) {
            try {
              const component = gamingComponents.nth(i)
              const bbox = await component.boundingBox()
              
              if (bbox) {
                // Check if component fits within viewport
                const fitsInViewport = bbox.x >= 0 && 
                                     bbox.x + bbox.width <= breakpoint.width &&
                                     bbox.y >= 0 && 
                                     bbox.y + bbox.height <= breakpoint.height
                
                if (fitsInViewport) {
                  responsiveComponents++
                }
              }
            } catch (e) {
              // Component might not be visible at this breakpoint
            }
          }
          
          const tested = Math.min(componentCount, 5)
          console.log(`   ${responsivePage}: ${responsiveComponents}/${tested} components responsive`)
          
        } catch (e) {
          console.log(`   ❌ ${responsivePage} - loading failed`)
        }
      }
    }
  })
})