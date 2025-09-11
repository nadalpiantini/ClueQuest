#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function validateProductionPerformance() {
  console.log('🚀 ClueQuest Production Performance Validation');
  console.log('==============================================');
  console.log(`🕐 Started at: ${new Date().toISOString()}\n`);
  
  const results = {
    schemaComplete: false,
    performanceTargets: [],
    criticalIssues: [],
    recommendations: []
  };
  
  // Phase 1: Schema Completeness Check
  console.log('📊 Phase 1: Schema Completeness Validation');
  console.log('-------------------------------------------');
  
  const requiredTables = [
    { name: 'cluequest_profiles', critical: true },
    { name: 'cluequest_adventures', critical: true },
    { name: 'cluequest_qr_codes', critical: true },
    { name: 'cluequest_teams', critical: true },
    { name: 'cluequest_user_activities', critical: true },
    { name: 'cluequest_adventure_participations', critical: true },
    { name: 'cluequest_user_scores', critical: true },
    { name: 'cluequest_ai_story_generations', critical: false },
    { name: 'cluequest_knowledge_base_documents', critical: false }
  ];
  
  let schemaScore = 0;
  const maxSchemaScore = requiredTables.filter(t => t.critical).length;
  
  for (const table of requiredTables) {
    try {
      const { error } = await supabase.from(table.name).select('id').limit(1);
      if (error) {
        if (table.critical) {
          console.log(`❌ ${table.name}: MISSING (CRITICAL)`);
          results.criticalIssues.push(`Missing critical table: ${table.name}`);
        } else {
          console.log(`⚠️  ${table.name}: missing (optional)`);
        }
      } else {
        console.log(`✅ ${table.name}: exists`);
        if (table.critical) schemaScore++;
      }
    } catch (err) {
      console.log(`⚠️  ${table.name}: error - ${err.message}`);
    }
  }
  
  results.schemaComplete = schemaScore === maxSchemaScore;
  console.log(`\n📈 Schema Score: ${schemaScore}/${maxSchemaScore} (${Math.round(schemaScore/maxSchemaScore*100)}%)`);
  
  // Phase 2: Performance Benchmarks
  console.log('\n⚡ Phase 2: Performance Benchmarks');
  console.log('----------------------------------');
  
  const performanceTests = [
    {
      name: 'QR Code Validation',
      target: 50,
      critical: true,
      test: async () => {
        const start = Date.now();
        const { error } = await supabase
          .from('cluequest_qr_codes')
          .select('*')
          .eq('status', 'active')
          .limit(10);
        return {
          duration: Date.now() - start,
          error: error?.message
        };
      }
    },
    {
      name: 'Dashboard Query',
      target: 200,
      critical: true,
      test: async () => {
        const start = Date.now();
        const { error } = await supabase
          .from('cluequest_user_activities')
          .select('*')
          .gte('created_at', new Date().toISOString().split('T')[0])
          .limit(20);
        return {
          duration: Date.now() - start,
          error: error?.message
        };
      }
    },
    {
      name: 'Team Formation Query',
      target: 150,
      critical: true,
      test: async () => {
        const start = Date.now();
        const { error } = await supabase
          .from('cluequest_teams')
          .select('*')
          .eq('status', 'open')
          .limit(15);
        return {
          duration: Date.now() - start,
          error: error?.message
        };
      }
    },
    {
      name: 'Leaderboard Query',
      target: 300,
      critical: false,
      test: async () => {
        const start = Date.now();
        const { error } = await supabase
          .from('cluequest_user_scores')
          .select('*')
          .order('score', { ascending: false })
          .limit(50);
        return {
          duration: Date.now() - start,
          error: error?.message
        };
      }
    }
  ];
  
  let performanceScore = 0;
  const maxPerformanceScore = performanceTests.filter(t => t.critical).length;
  
  for (const test of performanceTests) {
    try {
      const result = await test.test();
      
      if (result.error) {
        if (result.error.includes('does not exist')) {
          console.log(`⚠️  ${test.name}: TABLE MISSING (${test.target}ms target)`);
          if (test.critical) {
            results.criticalIssues.push(`Missing table for ${test.name}`);
          }
        } else {
          console.log(`❌ ${test.name}: ERROR - ${result.error}`);
          if (test.critical) {
            results.criticalIssues.push(`${test.name} error: ${result.error}`);
          }
        }
      } else {
        const status = result.duration <= test.target ? '✅' : '⚠️';
        const statusText = result.duration <= test.target ? 'PASS' : 'SLOW';
        console.log(`${status} ${test.name}: ${result.duration}ms (target: <${test.target}ms) - ${statusText}`);
        
        results.performanceTargets.push({
          name: test.name,
          duration: result.duration,
          target: test.target,
          passed: result.duration <= test.target,
          critical: test.critical
        });
        
        if (result.duration <= test.target && test.critical) {
          performanceScore++;
        } else if (result.duration > test.target && test.critical) {
          results.criticalIssues.push(`${test.name} too slow: ${result.duration}ms > ${test.target}ms`);
        }
      }
    } catch (err) {
      console.log(`❌ ${test.name}: FAILED - ${err.message}`);
      if (test.critical) {
        results.criticalIssues.push(`${test.name} failed: ${err.message}`);
      }
    }
  }
  
  // Phase 3: Production Readiness Assessment
  console.log('\n🎯 Phase 3: Production Readiness Assessment');
  console.log('--------------------------------------------');
  
  const schemaReady = results.schemaComplete;
  const performanceReady = performanceScore === maxPerformanceScore;
  const criticalIssuesCount = results.criticalIssues.length;
  
  console.log(`📊 Schema Readiness: ${schemaReady ? '✅ READY' : '❌ NOT READY'}`);
  console.log(`⚡ Performance Readiness: ${performanceReady ? '✅ READY' : '❌ NOT READY'}`);
  console.log(`🚨 Critical Issues: ${criticalIssuesCount}`);
  
  // Overall Assessment
  const overallReady = schemaReady && performanceReady && criticalIssuesCount === 0;
  
  console.log('\n🏁 FINAL ASSESSMENT');
  console.log('==================');
  
  if (overallReady) {
    console.log('🎉 ✅ PRODUCTION READY!');
    console.log('   All critical systems operational');
    console.log('   Performance targets achieved');
    console.log('   No blocking issues detected');
  } else {
    console.log('⚠️  ❌ NOT PRODUCTION READY');
    console.log('\n🔧 REQUIRED ACTIONS:');
    
    if (!schemaReady) {
      console.log('   1. Deploy missing database migrations');
      console.log('      → Follow: MIGRATION_DEPLOYMENT_GUIDE.md');
    }
    
    if (criticalIssuesCount > 0) {
      console.log('   2. Resolve critical issues:');
      results.criticalIssues.forEach((issue, i) => {
        console.log(`      → ${issue}`);
      });
    }
    
    if (!performanceReady) {
      console.log('   3. Deploy performance indexes');
      console.log('      → Execute: 005_performance_indexes.sql');
    }
  }
  
  // Recommendations
  if (results.recommendations.length > 0) {
    console.log('\n💡 RECOMMENDATIONS:');
    results.recommendations.forEach(rec => console.log(`   → ${rec}`));
  }
  
  console.log(`\n🕐 Completed at: ${new Date().toISOString()}`);
  
  // Exit with appropriate code
  process.exit(overallReady ? 0 : 1);
}

// Execute validation
validateProductionPerformance().catch(err => {
  console.error('❌ Validation failed:', err.message);
  process.exit(1);
});