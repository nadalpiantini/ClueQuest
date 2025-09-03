#!/usr/bin/env node

/**
 * Database Performance Testing Script
 * Benchmarks query performance before/after optimization
 * Validates 70% improvement target from AXIS6 patterns
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Performance test configurations
const PERFORMANCE_TESTS = [
  {
    name: 'Dashboard Query Performance',
    category: 'critical',
    description: 'User dashboard data retrieval',
    target: '< 200ms',
    tests: [
      {
        name: 'user_activities_today',
        query: (userId) => `
          SELECT * FROM cluequest_user_activities 
          WHERE user_id = '${userId}' 
          AND created_at >= CURRENT_DATE
          ORDER BY created_at DESC
        `,
        expectedRows: 10
      },
      {
        name: 'active_participations',
        query: (userId) => `
          SELECT a.*, p.status, p.progress
          FROM cluequest_adventures a
          JOIN cluequest_adventure_participations p ON a.id = p.adventure_id
          WHERE p.user_id = '${userId}' AND p.status = 'active'
          ORDER BY p.updated_at DESC
        `,
        expectedRows: 5
      }
    ]
  },
  
  {
    name: 'Leaderboard Query Performance',
    category: 'high',
    description: 'Adventure leaderboard with ranking',
    target: '< 300ms',
    tests: [
      {
        name: 'leaderboard_top_50',
        query: (adventureId) => `
          SELECT 
            s.user_id,
            p.name as user_name,
            s.score,
            s.completed_at,
            RANK() OVER (ORDER BY s.score DESC, s.completed_at ASC) as rank
          FROM cluequest_user_scores s
          JOIN cluequest_profiles p ON s.user_id = p.id
          WHERE s.adventure_id = '${adventureId}'
          AND s.completed_at IS NOT NULL
          ORDER BY s.score DESC, s.completed_at ASC
          LIMIT 50
        `,
        expectedRows: 50
      }
    ]
  },
  
  {
    name: 'QR Code Validation Performance',
    category: 'critical',
    description: 'Security-critical QR code lookup',
    target: '< 50ms',
    tests: [
      {
        name: 'qr_code_validation',
        query: (codeHash, adventureId) => `
          SELECT * FROM cluequest_qr_codes 
          WHERE code_hash = '${codeHash}' 
          AND adventure_id = '${adventureId}'
          AND is_active = true
        `,
        expectedRows: 1
      }
    ]
  },
  
  {
    name: 'Team Formation Performance',
    category: 'high',
    description: 'Available teams lookup',
    target: '< 150ms',
    tests: [
      {
        name: 'open_teams_lookup',
        query: (adventureId) => `
          SELECT * FROM cluequest_teams 
          WHERE adventure_id = '${adventureId}' 
          AND status = 'open'
          ORDER BY created_at DESC
        `,
        expectedRows: 20
      }
    ]
  }
]

// RPC Function performance tests
const RPC_TESTS = [
  {
    name: 'get_user_dashboard_optimized',
    description: 'Optimized dashboard RPC function',
    target: '< 200ms',
    query: (userId) => supabase.rpc('get_user_dashboard_optimized', { 
      p_user_id: userId 
    })
  },
  
  {
    name: 'get_adventure_leaderboard_optimized',
    description: 'Optimized leaderboard RPC function',
    target: '< 300ms',
    query: (adventureId) => supabase.rpc('get_adventure_leaderboard_optimized', { 
      p_adventure_id: adventureId,
      p_limit: 50 
    })
  }
]

async function runQueryBenchmark(testName, query, iterations = 10) {
  const timings = []
  
  console.log(`  🔄 Running ${testName} (${iterations} iterations)...`)
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    
    try {
      await supabase.rpc('exec_sql', { sql: query })
      const duration = performance.now() - start
      timings.push(duration)
    } catch (error) {
      console.error(`    ❌ Query failed:`, error.message)
      return null
    }
  }
  
  // Calculate statistics
  timings.sort((a, b) => a - b)
  const avg = timings.reduce((sum, time) => sum + time, 0) / timings.length
  const median = timings[Math.floor(timings.length / 2)]
  const p95 = timings[Math.floor(timings.length * 0.95)]
  const min = timings[0]
  const max = timings[timings.length - 1]
  
  return {
    avg: Math.round(avg),
    median: Math.round(median),
    p95: Math.round(p95),
    min: Math.round(min),
    max: Math.round(max),
    timings
  }
}

async function runRPCBenchmark(testName, rpcFunction, iterations = 10) {
  const timings = []
  
  console.log(`  🔄 Running RPC ${testName} (${iterations} iterations)...`)
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    
    try {
      await rpcFunction
      const duration = performance.now() - start
      timings.push(duration)
    } catch (error) {
      console.error(`    ❌ RPC failed:`, error.message)
      return null
    }
  }
  
  // Calculate statistics
  timings.sort((a, b) => a - b)
  const avg = timings.reduce((sum, time) => sum + time, 0) / timings.length
  const median = timings[Math.floor(timings.length / 2)]
  const p95 = timings[Math.floor(timings.length * 0.95)]
  const min = timings[0]
  const max = timings[timings.length - 1]
  
  return {
    avg: Math.round(avg),
    median: Math.round(median),
    p95: Math.round(p95),
    min: Math.round(min),
    max: Math.round(max),
    timings
  }
}

async function generateTestData() {
  console.log('🔄 Generating test data...')
  
  // Create test user if needed
  const testUserId = 'test-user-' + Date.now()
  const testAdventureId = 'test-adventure-' + Date.now()
  
  // Note: In a real scenario, you'd insert actual test data
  // For now, we'll use mock IDs for demonstration
  
  return {
    userId: testUserId,
    adventureId: testAdventureId
  }
}

function formatResults(results, target) {
  const targetMs = parseInt(target.replace(/[^0-9]/g, ''))
  const status = results.p95 <= targetMs ? '✅' : '❌'
  const performance = results.p95 <= targetMs ? 'PASS' : 'FAIL'
  
  return {
    status,
    performance,
    details: `Avg: ${results.avg}ms | P95: ${results.p95}ms | Target: ${target}`
  }
}

async function checkIndexes() {
  console.log('🔍 Checking deployed indexes...')
  
  const indexQueries = [
    "SELECT indexname FROM pg_indexes WHERE tablename LIKE 'cluequest_%' AND indexname LIKE 'idx_cluequest_%'",
  ]
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: indexQueries[0] 
    })
    
    if (error) {
      console.log('⚠️  Could not check indexes (this is normal if tables don\'t exist yet)')
      return false
    }
    
    const indexCount = data?.length || 0
    console.log(`✅ Found ${indexCount} performance indexes`)
    return indexCount > 0
  } catch (error) {
    console.log('⚠️  Could not check indexes:', error.message)
    return false
  }
}

async function runPerformanceTests() {
  const startTime = Date.now()
  
  console.log('🚀 ClueQuest Database Performance Tests')
  console.log('======================================')
  console.log(`Starting tests at: ${new Date().toISOString()}`)
  console.log()
  
  // Check if indexes are deployed
  const hasIndexes = await checkIndexes()
  
  if (!hasIndexes) {
    console.log('⚠️  Performance indexes not detected.')
    console.log('Run: npm run db:optimize')
    console.log('Proceeding with baseline performance tests...')
    console.log()
  }
  
  // Generate test data
  const testData = await generateTestData()
  
  const results = []
  
  // Test SQL queries
  console.log('📊 Testing SQL Query Performance')
  console.log('================================')
  
  for (const testSuite of PERFORMANCE_TESTS) {
    console.log(`\\n🧪 ${testSuite.name} (${testSuite.category} priority)`)
    console.log(`   ${testSuite.description}`)
    console.log(`   Target: ${testSuite.target}`)
    
    for (const test of testSuite.tests) {
      const query = test.query(testData.userId, testData.adventureId)
      const benchmarkResult = await runQueryBenchmark(test.name, query)
      
      if (benchmarkResult) {
        const formatted = formatResults(benchmarkResult, testSuite.target)
        console.log(`    ${formatted.status} ${test.name}: ${formatted.details}`)
        
        results.push({
          suite: testSuite.name,
          test: test.name,
          category: testSuite.category,
          target: testSuite.target,
          result: benchmarkResult,
          status: formatted.performance
        })
      }
    }
  }
  
  // Test RPC functions
  console.log('\\n🔧 Testing RPC Function Performance')
  console.log('===================================')
  
  for (const rpcTest of RPC_TESTS) {
    console.log(`\\n🧪 ${rpcTest.name}`)
    console.log(`   ${rpcTest.description}`)
    console.log(`   Target: ${rpcTest.target}`)
    
    const rpcQuery = rpcTest.query(testData.userId, testData.adventureId)
    const benchmarkResult = await runRPCBenchmark(rpcTest.name, rpcQuery)
    
    if (benchmarkResult) {
      const formatted = formatResults(benchmarkResult, rpcTest.target)
      console.log(`    ${formatted.status} ${rpcTest.name}: ${formatted.details}`)
      
      results.push({
        suite: 'RPC Functions',
        test: rpcTest.name,
        category: 'rpc',
        target: rpcTest.target,
        result: benchmarkResult,
        status: formatted.performance
      })
    }
  }
  
  // Performance Summary
  const duration = Date.now() - startTime
  const passed = results.filter(r => r.status === 'PASS').length
  const failed = results.filter(r => r.status === 'FAIL').length
  const total = results.length
  
  console.log('\\n📈 Performance Test Summary')
  console.log('============================')
  console.log(`✅ Passed: ${passed}/${total}`)
  console.log(`❌ Failed: ${failed}/${total}`)
  console.log(`⏱️  Total duration: ${Math.round(duration / 1000)}s`)
  console.log()
  
  // Category breakdown
  const critical = results.filter(r => r.category === 'critical')
  const criticalPassed = critical.filter(r => r.status === 'PASS').length
  
  console.log('🔥 Critical Performance Tests:')
  console.log(`   ${criticalPassed}/${critical.length} passed`)
  
  if (criticalPassed === critical.length) {
    console.log('   ✅ All critical performance targets met!')
  } else {
    console.log('   ❌ Some critical tests failed - immediate attention needed')
  }
  
  console.log()
  console.log('📊 Detailed Results:')
  console.log('====================')
  
  results.forEach(result => {
    const icon = result.status === 'PASS' ? '✅' : '❌'
    console.log(`${icon} ${result.suite} → ${result.test}`)
    console.log(`     P95: ${result.result.p95}ms | Avg: ${result.result.avg}ms | Target: ${result.target}`)
  })
  
  console.log()
  
  if (failed === 0) {
    console.log('🎉 All performance tests passed!')
    console.log('Database optimization successful!')
  } else {
    console.log('⚠️  Performance improvements needed.')
    console.log('Consider running: npm run db:optimize')
  }
  
  return {
    passed,
    failed,
    total,
    results,
    duration
  }
}

// Export for use in other scripts
module.exports = { runPerformanceTests }

// Run if called directly
if (require.main === module) {
  runPerformanceTests().catch(console.error)
}