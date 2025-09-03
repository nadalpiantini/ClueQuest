import { test, expect } from '@playwright/test'

/**
 * CLUEQUEST COMPREHENSIVE FUNCTIONALITY REPORT
 * Executive summary of all 18 pages and their interactive elements
 */

test.describe('ClueQuest Comprehensive Functionality Report', () => {
  
  test('Executive Summary - All 18 Pages', async ({ page }) => {
    console.log('\n📋 CLUEQUEST COMPREHENSIVE FUNCTIONALITY AUDIT')
    console.log('='.repeat(60))
    
    const allPages = [
      { path: '/', name: 'Landing Page', category: 'Marketing' },
      { path: '/adventure-selection', name: 'Adventure Selection', category: 'Core Flow' },
      { path: '/builder', name: 'Builder', category: 'Creation Tools' },
      { path: '/demo', name: 'Demo', category: 'Marketing' },
      { path: '/join', name: 'Join', category: 'Core Flow' },
      { path: '/auth/login', name: 'Auth Login', category: 'Authentication' },
      { path: '/dashboard', name: 'Dashboard', category: 'User Interface' },
      { path: '/create', name: 'Create', category: 'Creation Tools' },
      { path: '/escape-room', name: 'Escape Room', category: 'Gaming' },
      { path: '/adventure/welcome', name: 'Adventure Welcome', category: 'Adventure Flow' },
      { path: '/adventure/login', name: 'Adventure Login', category: 'Adventure Flow' },
      { path: '/adventure/intro', name: 'Adventure Intro', category: 'Adventure Flow' },
      { path: '/adventure/role-selection', name: 'Role Selection', category: 'Adventure Flow' },
      { path: '/adventure/avatar-generation', name: 'Avatar Generation', category: 'Adventure Flow' },
      { path: '/adventure/adventure-hub', name: 'Adventure Hub', category: 'Adventure Flow' },
      { path: '/adventure/qr-scan', name: 'QR Scan', category: 'Gaming' },
      { path: '/adventure/challenges', name: 'Challenges', category: 'Gaming' },
      { path: '/adventure/ranking', name: 'Ranking', category: 'Gaming' }
    ]
    
    let reportData = {
      totalPages: 0,
      workingPages: 0,
      totalButtons: 0,
      workingButtons: 0,
      touchCompliantButtons: 0,
      nonTouchButtons: 0,
      pagesByCategory: {},
      failedPages: [],
      criticalIssues: [],
      recommendations: []
    }
    
    console.log('\\n🔍 TESTING ALL 18 PAGES...')
    console.log('-'.repeat(40))
    
    for (const pageInfo of allPages) {
      reportData.totalPages++
      
      try {
        console.log(`\\nTesting ${pageInfo.name} (${pageInfo.path})...`)
        await page.goto(`http://localhost:5173${pageInfo.path}`)
        await page.waitForTimeout(1500)
        
        reportData.workingPages++
        
        // Initialize category tracking
        if (!reportData.pagesByCategory[pageInfo.category]) {
          reportData.pagesByCategory[pageInfo.category] = {
            total: 0,
            working: 0,
            buttons: 0
          }
        }
        reportData.pagesByCategory[pageInfo.category].total++
        reportData.pagesByCategory[pageInfo.category].working++
        
        // Count all interactive elements
        const interactiveElements = page.locator(`
          button,
          a,
          input[type="button"],
          input[type="submit"],
          [role="button"],
          [onclick],
          .card:hover,
          [class*="btn"],
          [class*="gaming"]
        `)
        
        const buttonCount = await interactiveElements.count()
        reportData.totalButtons += buttonCount
        reportData.pagesByCategory[pageInfo.category].buttons += buttonCount
        
        // Test each button
        let pageWorkingButtons = 0
        let pageTouchCompliant = 0
        
        for (let i = 0; i < Math.min(buttonCount, 8); i++) { // Limit to 8 per page for speed
          try {
            const element = interactiveElements.nth(i)
            const bbox = await element.boundingBox()
            
            if (bbox) {
              // Test interaction
              await element.hover()
              pageWorkingButtons++
              
              // Test touch compliance
              if (bbox.width >= 44 && bbox.height >= 44) {
                pageTouchCompliant++
              }
            }
          } catch (e) {
            // Button failed interaction test
          }
        }
        
        reportData.workingButtons += pageWorkingButtons
        reportData.touchCompliantButtons += pageTouchCompliant
        reportData.nonTouchButtons += (Math.min(buttonCount, 8) - pageTouchCompliant)
        
        // Page-specific testing
        let pageStatus = '✅'
        let pageNotes = []
        
        // Landing page specific checks
        if (pageInfo.path === '/') {
          const mainCTAs = page.locator('a[href="/adventure-selection"], a[href="/demo"]')
          const ctaCount = await mainCTAs.count()
          if (ctaCount < 2) {
            pageNotes.push('Missing main CTAs')
            pageStatus = '⚠️'
          }
        }
        
        // Adventure flow checks
        if (pageInfo.path.includes('/adventure/')) {
          const gameButtons = page.locator('button').filter({ hasText: /next|continue|select|start/i })
          const gameButtonCount = await gameButtons.count()
          if (gameButtonCount === 0) {
            pageNotes.push('No gaming progression buttons')
            pageStatus = '⚠️'
          }
        }
        
        // Form page checks
        if (pageInfo.path.includes('login') || pageInfo.path.includes('join')) {
          const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]')
          const inputCount = await inputs.count()
          if (inputCount === 0) {
            pageNotes.push('No form inputs found')
            pageStatus = '⚠️'
          }
        }
        
        console.log(`   ${pageStatus} ${pageInfo.name}: ${pageWorkingButtons}/${Math.min(buttonCount, 8)} buttons working, ${pageTouchCompliant} touch-compliant${pageNotes.length ? ' | ' + pageNotes.join(', ') : ''}`)
        
        if (pageNotes.length > 0) {
          reportData.criticalIssues.push(`${pageInfo.name}: ${pageNotes.join(', ')}`)
        }
        
      } catch (e) {
        console.log(`   ❌ ${pageInfo.name}: Failed to load - ${e.message?.substring(0, 50)}`)
        reportData.failedPages.push(pageInfo.name)
      }
    }
    
    // Test mobile responsiveness on key pages
    console.log('\\n📱 MOBILE RESPONSIVENESS CHECK...')
    const mobileViewports = [
      { width: 320, height: 568, name: 'Small Mobile' },
      { width: 375, height: 667, name: 'iPhone' }
    ]
    
    const keyPages = ['/', '/adventure-selection', '/adventure/role-selection']
    let mobileIssues = 0
    
    for (const viewport of mobileViewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      
      for (const keyPage of keyPages) {
        try {
          await page.goto(`http://localhost:5173${keyPage}`)
          await page.waitForTimeout(1000)
          
          // Check for horizontal overflow
          const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
          if (bodyWidth > viewport.width) {
            mobileIssues++
            reportData.criticalIssues.push(`${keyPage}: Horizontal overflow on ${viewport.name}`)
          }
          
        } catch (e) {
          mobileIssues++
        }
      }
    }
    
    console.log(`   Mobile test: ${mobileIssues} issues found`)
    
    // Generate recommendations
    const buttonSuccessRate = reportData.workingButtons / reportData.totalButtons
    const touchComplianceRate = reportData.touchCompliantButtons / (reportData.touchCompliantButtons + reportData.nonTouchButtons)
    const pageSuccessRate = reportData.workingPages / reportData.totalPages
    
    if (buttonSuccessRate < 0.9) {
      reportData.recommendations.push('Improve button interaction reliability')
    }
    if (touchComplianceRate < 0.7) {
      reportData.recommendations.push('Increase button sizes for better mobile accessibility')
    }
    if (pageSuccessRate < 0.95) {
      reportData.recommendations.push('Fix page loading issues')
    }
    if (mobileIssues > 0) {
      reportData.recommendations.push('Address mobile responsiveness issues')
    }
    
    // Print comprehensive report
    console.log('\\n📊 COMPREHENSIVE AUDIT RESULTS')
    console.log('='.repeat(60))
    console.log(`📄 Pages Tested: ${reportData.workingPages}/${reportData.totalPages} (${Math.round(pageSuccessRate*100)}%)`)
    console.log(`🔘 Interactive Elements: ${reportData.workingButtons}/${reportData.totalButtons} working (${Math.round(buttonSuccessRate*100)}%)`)
    console.log(`👆 Touch Compliance: ${reportData.touchCompliantButtons}/${reportData.touchCompliantButtons + reportData.nonTouchButtons} buttons (${Math.round(touchComplianceRate*100)}%)`)
    console.log(`📱 Mobile Issues: ${mobileIssues} critical issues found`)
    
    console.log('\\n📂 BY CATEGORY:')
    Object.entries(reportData.pagesByCategory).forEach(([category, data]: [string, any]) => {
      console.log(`   ${category}: ${data.working}/${data.total} pages, ${data.buttons} total interactions`)
    })
    
    if (reportData.failedPages.length > 0) {
      console.log('\\n❌ FAILED PAGES:')
      reportData.failedPages.forEach(page => console.log(`   • ${page}`))
    }
    
    if (reportData.criticalIssues.length > 0) {
      console.log('\\n⚠️ CRITICAL ISSUES:')
      reportData.criticalIssues.forEach(issue => console.log(`   • ${issue}`))
    }
    
    if (reportData.recommendations.length > 0) {
      console.log('\\n💡 RECOMMENDATIONS:')
      reportData.recommendations.forEach(rec => console.log(`   • ${rec}`))
    }
    
    console.log('\\n🎯 GAMING PLATFORM ASSESSMENT:')
    
    // Gaming platform specific scoring
    let gamingScore = 0
    let maxGamingScore = 0
    
    // Page availability (max 20 points)
    gamingScore += Math.min(pageSuccessRate * 20, 20)
    maxGamingScore += 20
    
    // Button functionality (max 25 points)  
    gamingScore += Math.min(buttonSuccessRate * 25, 25)
    maxGamingScore += 25
    
    // Touch compliance (max 20 points)
    gamingScore += Math.min(touchComplianceRate * 20, 20)
    maxGamingScore += 20
    
    // Mobile responsiveness (max 15 points)
    const mobileScore = Math.max(0, 15 - mobileIssues * 3)
    gamingScore += mobileScore
    maxGamingScore += 15
    
    // Adventure flow completeness (max 20 points)
    const adventurePages = Object.values(allPages).filter(p => p.category === 'Adventure Flow').length
    const workingAdventurePages = reportData.pagesByCategory['Adventure Flow']?.working || 0
    const adventureScore = (workingAdventurePages / adventurePages) * 20
    gamingScore += adventureScore
    maxGamingScore += 20
    
    const finalScore = Math.round((gamingScore / maxGamingScore) * 100)
    
    console.log(`\\n🏆 OVERALL GAMING PLATFORM SCORE: ${finalScore}/100`)
    
    if (finalScore >= 90) {
      console.log('   🟢 EXCELLENT - Production ready gaming platform')
    } else if (finalScore >= 75) {
      console.log('   🟡 GOOD - Minor improvements needed')
    } else if (finalScore >= 60) {
      console.log('   🟠 FAIR - Significant improvements required')  
    } else {
      console.log('   🔴 POOR - Major issues need addressing')
    }
    
    console.log('\\n📈 SCORING BREAKDOWN:')
    console.log(`   Page Availability: ${Math.round(pageSuccessRate * 20)}/20`)
    console.log(`   Button Functionality: ${Math.round(buttonSuccessRate * 25)}/25`) 
    console.log(`   Touch Compliance: ${Math.round(touchComplianceRate * 20)}/20`)
    console.log(`   Mobile Responsiveness: ${mobileScore}/15`)
    console.log(`   Adventure Flow: ${Math.round(adventureScore)}/20`)
    
    console.log('\\n' + '='.repeat(60))
    
    // Set reasonable expectations for a gaming platform
    expect(pageSuccessRate).toBeGreaterThan(0.85) // 85% pages should load
    expect(buttonSuccessRate).toBeGreaterThan(0.75) // 75% buttons should work
    expect(finalScore).toBeGreaterThan(60) // Overall score should be Fair or better
  })
})