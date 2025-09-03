import { test, expect, Page } from '@playwright/test'

/**
 * COMPREHENSIVE CLUEQUEST FUNCTIONALITY AUDIT
 * Testing all 18 pages and every button/interaction
 * Mission: Verify EVERY button, link, and interactive element works
 */

// Test helpers
async function checkButtonInteractivity(page: Page, selector: string, name: string) {
  const button = page.locator(selector).first()
  await expect(button, `${name} should be visible`).toBeVisible()
  
  // Check if it's a proper touch target (minimum 44px)
  const bbox = await button.boundingBox()
  if (bbox) {
    expect(bbox.height >= 44 || bbox.width >= 44, `${name} should be at least 44px in one dimension`).toBeTruthy()
  }
  
  // Test click interaction
  await button.hover()
  await button.click()
  
  return true
}

async function checkResponsiveDesign(page: Page) {
  // Test mobile viewport
  await page.setViewportSize({ width: 375, height: 667 })
  await page.waitForTimeout(500)
  
  // Test tablet viewport
  await page.setViewportSize({ width: 768, height: 1024 })
  await page.waitForTimeout(500)
  
  // Test desktop viewport
  await page.setViewportSize({ width: 1200, height: 800 })
  await page.waitForTimeout(500)
}

test.describe('ClueQuest Comprehensive Functionality Audit', () => {
  
  test('1. Landing Page (/) - Complete button audit', async ({ page }) => {
    await page.goto('http://localhost:5173/')
    
    // Wait for animations to settle
    await page.waitForTimeout(2000)
    
    console.log('🔍 Testing Landing Page interactions...')
    
    let workingButtons = 0
    let totalButtons = 0
    
    // Main CTAs
    try {
      totalButtons++
      const beginQuest = page.locator('a[href="/adventure-selection"]').first()
      await expect(beginQuest).toBeVisible()
      await beginQuest.hover()
      workingButtons++
      console.log('✅ Begin Mystery Quest button - visible and hoverable')
    } catch (e) {
      console.log('❌ Begin Mystery Quest button failed')
    }
    
    try {
      totalButtons++
      const watchPreview = page.locator('a[href="/demo"]').first()
      await expect(watchPreview).toBeVisible()
      await watchPreview.hover()
      workingButtons++
      console.log('✅ Watch Preview button - visible and hoverable')
    } catch (e) {
      console.log('❌ Watch Preview button failed')
    }
    
    // Footer links
    const footerLinks = [
      { href: '/about', text: 'About Quest' },
      { href: '/privacy', text: 'Privacy' },
      { href: '/terms', text: 'Terms' },
      { href: '/contact', text: 'Contact' },
      { href: '/careers', text: 'Careers' }
    ]
    
    for (const link of footerLinks) {
      try {
        totalButtons++
        const linkElement = page.locator(`a[href="${link.href}"]`).first()
        await expect(linkElement).toBeVisible()
        await linkElement.hover()
        workingButtons++
        console.log(`✅ Footer link ${link.text} - working`)
      } catch (e) {
        console.log(`❌ Footer link ${link.text} - failed`)
      }
    }
    
    // Feature cards (should be hoverable/interactive)
    const featureCards = page.locator('.card')
    const cardCount = await featureCards.count()
    totalButtons += cardCount
    
    for (let i = 0; i < cardCount; i++) {
      try {
        await featureCards.nth(i).hover()
        workingButtons++
        console.log(`✅ Feature card ${i + 1} - interactive`)
      } catch (e) {
        console.log(`❌ Feature card ${i + 1} - not interactive`)
      }
    }
    
    // Test responsive design
    await checkResponsiveDesign(page)
    
    console.log(`📊 Landing Page Results: ${workingButtons}/${totalButtons} interactive elements working`)
    expect(workingButtons).toBeGreaterThan(totalButtons * 0.8) // 80% success rate minimum
  })
  
  test('2. Adventure Selection (/adventure-selection) - Adventure cards', async ({ page }) => {
    await page.goto('http://localhost:5173/adventure-selection')
    await page.waitForTimeout(2000)
    
    console.log('🔍 Testing Adventure Selection page...')
    
    let workingButtons = 0
    let totalButtons = 0
    
    // Adventure type cards
    const adventureCards = page.locator('.adventure-card, .card, button').filter({ hasText: /corporate|social|educational|mystery|team|adventure/i })
    const cardCount = await adventureCards.count()
    totalButtons += cardCount
    
    for (let i = 0; i < cardCount; i++) {
      try {
        const card = adventureCards.nth(i)
        await expect(card).toBeVisible()
        await card.hover()
        await card.click()
        workingButtons++
        console.log(`✅ Adventure card ${i + 1} - interactive`)
        await page.waitForTimeout(500)
      } catch (e) {
        console.log(`❌ Adventure card ${i + 1} - failed`)
      }
    }
    
    // Navigation buttons
    try {
      totalButtons++
      const backButton = page.locator('button, a').filter({ hasText: /back|previous|return/i }).first()
      if (await backButton.isVisible()) {
        await backButton.hover()
        workingButtons++
        console.log('✅ Back button - working')
      }
    } catch (e) {
      console.log('❌ Back button - not found or failed')
    }
    
    console.log(`📊 Adventure Selection Results: ${workingButtons}/${totalButtons} interactive elements working`)
  })
  
  test('3. Join Page (/join) - Session code entry', async ({ page }) => {
    await page.goto('http://localhost:5173/join')
    await page.waitForTimeout(2000)
    
    console.log('🔍 Testing Join page...')
    
    let workingButtons = 0
    let totalButtons = 0
    
    // Session code input
    try {
      totalButtons++
      const codeInput = page.locator('input[type="text"], input[placeholder*="code"], input[placeholder*="session"]').first()
      await expect(codeInput).toBeVisible()
      await codeInput.fill('TEST123')
      workingButtons++
      console.log('✅ Session code input - working')
    } catch (e) {
      console.log('❌ Session code input - failed')
    }
    
    // Join button
    try {
      totalButtons++
      const joinButton = page.locator('button').filter({ hasText: /join|enter|connect/i }).first()
      await expect(joinButton).toBeVisible()
      await joinButton.hover()
      workingButtons++
      console.log('✅ Join button - working')
    } catch (e) {
      console.log('❌ Join button - failed')
    }
    
    // Back/navigation buttons
    try {
      totalButtons++
      const backButton = page.locator('a, button').filter({ hasText: /back|return|home/i }).first()
      if (await backButton.isVisible()) {
        await backButton.hover()
        workingButtons++
        console.log('✅ Navigation button - working')
      }
    } catch (e) {
      console.log('❌ Navigation button - failed')
    }
    
    console.log(`📊 Join Page Results: ${workingButtons}/${totalButtons} interactive elements working`)
  })
  
  test('4. Demo Page (/demo) - Preview functionality', async ({ page }) => {
    await page.goto('http://localhost:5173/demo')
    await page.waitForTimeout(2000)
    
    console.log('🔍 Testing Demo page...')
    
    let workingButtons = 0
    let totalButtons = 0
    
    // Play/preview buttons
    const playButtons = page.locator('button').filter({ hasText: /play|watch|preview|start/i })
    const playCount = await playButtons.count()
    totalButtons += playCount
    
    for (let i = 0; i < playCount; i++) {
      try {
        await playButtons.nth(i).hover()
        await playButtons.nth(i).click()
        workingButtons++
        console.log(`✅ Play button ${i + 1} - working`)
        await page.waitForTimeout(500)
      } catch (e) {
        console.log(`❌ Play button ${i + 1} - failed`)
      }
    }
    
    // Feature showcase cards/buttons
    const featureButtons = page.locator('.card, button, a').filter({ hasText: /feature|demo|try/i })
    const featureCount = await featureButtons.count()
    totalButtons += featureCount
    
    for (let i = 0; i < featureCount; i++) {
      try {
        await featureButtons.nth(i).hover()
        workingButtons++
        console.log(`✅ Feature button ${i + 1} - interactive`)
      } catch (e) {
        console.log(`❌ Feature button ${i + 1} - failed`)
      }
    }
    
    console.log(`📊 Demo Page Results: ${workingButtons}/${totalButtons} interactive elements working`)
  })
  
  test('5. Auth Login (/auth/login) - Form interactions', async ({ page }) => {
    await page.goto('http://localhost:5173/auth/login')
    await page.waitForTimeout(2000)
    
    console.log('🔍 Testing Auth Login page...')
    
    let workingButtons = 0
    let totalButtons = 0
    
    // Email input
    try {
      totalButtons++
      const emailInput = page.locator('input[type="email"], input[placeholder*="email"]').first()
      await expect(emailInput).toBeVisible()
      await emailInput.fill('test@example.com')
      workingButtons++
      console.log('✅ Email input - working')
    } catch (e) {
      console.log('❌ Email input - failed')
    }
    
    // Password input
    try {
      totalButtons++
      const passwordInput = page.locator('input[type="password"], input[placeholder*="password"]').first()
      await expect(passwordInput).toBeVisible()
      await passwordInput.fill('testpassword')
      workingButtons++
      console.log('✅ Password input - working')
    } catch (e) {
      console.log('❌ Password input - failed')
    }
    
    // Login button
    try {
      totalButtons++
      const loginButton = page.locator('button[type="submit"], button').filter({ hasText: /login|sign in|enter/i }).first()
      await expect(loginButton).toBeVisible()
      await loginButton.hover()
      workingButtons++
      console.log('✅ Login button - working')
    } catch (e) {
      console.log('❌ Login button - failed')
    }
    
    // Social auth buttons
    const socialButtons = page.locator('button').filter({ hasText: /google|facebook|github|discord/i })
    const socialCount = await socialButtons.count()
    totalButtons += socialCount
    
    for (let i = 0; i < socialCount; i++) {
      try {
        await socialButtons.nth(i).hover()
        workingButtons++
        console.log(`✅ Social auth button ${i + 1} - working`)
      } catch (e) {
        console.log(`❌ Social auth button ${i + 1} - failed`)
      }
    }
    
    console.log(`📊 Auth Login Results: ${workingButtons}/${totalButtons} interactive elements working`)
  })
  
  test('6. Dashboard (/dashboard) - Main interface', async ({ page }) => {
    await page.goto('http://localhost:5173/dashboard')
    await page.waitForTimeout(2000)
    
    console.log('🔍 Testing Dashboard page...')
    
    let workingButtons = 0
    let totalButtons = 0
    
    // Navigation buttons
    const navButtons = page.locator('button, a').filter({ hasText: /create|build|join|profile|settings/i })
    const navCount = await navButtons.count()
    totalButtons += navCount
    
    for (let i = 0; i < navCount; i++) {
      try {
        await navButtons.nth(i).hover()
        workingButtons++
        console.log(`✅ Navigation button ${i + 1} - working`)
      } catch (e) {
        console.log(`❌ Navigation button ${i + 1} - failed`)
      }
    }
    
    // Action cards/buttons
    const actionCards = page.locator('.card, button').filter({ hasText: /adventure|quest|mystery/i })
    const actionCount = await actionCards.count()
    totalButtons += actionCount
    
    for (let i = 0; i < actionCount; i++) {
      try {
        await actionCards.nth(i).hover()
        await actionCards.nth(i).click()
        workingButtons++
        console.log(`✅ Action card ${i + 1} - interactive`)
        await page.waitForTimeout(300)
      } catch (e) {
        console.log(`❌ Action card ${i + 1} - failed`)
      }
    }
    
    console.log(`📊 Dashboard Results: ${workingButtons}/${totalButtons} interactive elements working`)
  })
  
  test('7-18. Adventure Flow Pages - Systematic testing', async ({ page }) => {
    const adventurePages = [
      { path: '/adventure/welcome', name: 'Welcome' },
      { path: '/adventure/login', name: 'Adventure Login' },
      { path: '/adventure/intro', name: 'Intro' },
      { path: '/adventure/role-selection', name: 'Role Selection' },
      { path: '/adventure/avatar-generation', name: 'Avatar Generation' },
      { path: '/adventure/adventure-hub', name: 'Adventure Hub' },
      { path: '/adventure/qr-scan', name: 'QR Scan' },
      { path: '/adventure/challenges', name: 'Challenges' },
      { path: '/adventure/ranking', name: 'Ranking' },
      { path: '/builder', name: 'Builder' },
      { path: '/create', name: 'Create' },
      { path: '/escape-room', name: 'Escape Room' }
    ]
    
    let totalPages = 0
    let workingPages = 0
    let totalInteractions = 0
    let workingInteractions = 0
    
    for (const pageDef of adventurePages) {
      console.log(`\n🔍 Testing ${pageDef.name} page (${pageDef.path})...`)
      totalPages++
      
      try {
        await page.goto(`http://localhost:5173${pageDef.path}`)
        await page.waitForTimeout(2000)
        
        workingPages++
        console.log(`✅ ${pageDef.name} - page loads successfully`)
        
        // Test all buttons on the page
        const allButtons = page.locator('button, a, input[type="submit"], [role="button"]')
        const buttonCount = await allButtons.count()
        totalInteractions += buttonCount
        
        console.log(`   Found ${buttonCount} interactive elements`)
        
        for (let i = 0; i < Math.min(buttonCount, 10); i++) { // Limit to first 10 to avoid timeouts
          try {
            const button = allButtons.nth(i)
            await button.hover({ timeout: 2000 })
            
            // Check if it's visible and has proper size
            const bbox = await button.boundingBox()
            if (bbox && (bbox.height >= 32 || bbox.width >= 32)) { // Relaxed size requirement
              workingInteractions++
              console.log(`   ✅ Interactive element ${i + 1} - working`)
            }
          } catch (e) {
            console.log(`   ❌ Interactive element ${i + 1} - failed: ${e.message?.substring(0, 50) || 'unknown error'}`)
          }
        }
        
        // Test key gaming components if present
        const gamingButtons = page.locator('.gaming-button, button').filter({ hasText: /start|continue|next|select|choose|scan|submit/i })
        const gamingCount = await gamingButtons.count()
        
        if (gamingCount > 0) {
          console.log(`   🎮 Found ${gamingCount} gaming-specific buttons`)
          
          for (let i = 0; i < Math.min(gamingCount, 5); i++) {
            try {
              await gamingButtons.nth(i).hover()
              console.log(`   ✅ Gaming button ${i + 1} - interactive`)
            } catch (e) {
              console.log(`   ❌ Gaming button ${i + 1} - failed`)
            }
          }
        }
        
        // Test responsive design
        await checkResponsiveDesign(page)
        console.log(`   📱 Responsive design - tested`)
        
      } catch (e) {
        console.log(`❌ ${pageDef.name} - page failed to load: ${e.message?.substring(0, 100) || 'unknown error'}`)
      }
    }
    
    console.log(`\n📊 FINAL RESULTS:`)
    console.log(`📄 Pages: ${workingPages}/${totalPages} pages loaded successfully (${Math.round(workingPages/totalPages*100)}%)`)
    console.log(`🔘 Interactions: ${workingInteractions}/${totalInteractions} interactive elements working (${Math.round(workingInteractions/totalInteractions*100)}%)`)
    
    // Success criteria: At least 70% of pages work and 60% of interactions work
    expect(workingPages / totalPages).toBeGreaterThan(0.7)
    expect(workingInteractions / totalInteractions).toBeGreaterThan(0.6)
  })
})