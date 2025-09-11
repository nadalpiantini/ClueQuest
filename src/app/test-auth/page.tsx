'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { getCurrentUserWithMembership, hasPermission } from '@/lib/auth/actions'
import { motion } from 'framer-motion'

export default function TestAuthPage() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [adventures, setAdventures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [testResults, setTestResults] = useState<any>({})

  useEffect(() => {
    runAuthTests()
  }, [])

  const runAuthTests = async () => {
    setLoading(true)
    const results: any = {}

    try {
      // Test 1: Get current user with membership
      results.userTest = await getCurrentUserWithMembership()
      setUserInfo(results.userTest)

      // Test 2: Check permissions
      results.permissions = {
        create: await hasPermission('create'),
        edit: await hasPermission('edit'),
        delete: await hasPermission('delete'),
        admin: await hasPermission('admin')
      }

      // Test 3: Try to read public adventures (should work without auth)
      const { data: publicAdventures, error: publicError } = await supabase
        .from('cluequest_adventures')
        .select('*')
        .eq('is_public', true)
        .limit(5)

      results.publicAdventures = {
        success: !publicError,
        data: publicAdventures || [],
        error: publicError?.message
      }

      // Test 4: Try to read all adventures (should be filtered by RLS)
      const { data: allAdventures, error: allError } = await supabase
        .from('cluequest_adventures')
        .select('*')
        .limit(10)

      results.allAdventures = {
        success: !allError,
        data: allAdventures || [],
        error: allError?.message,
        count: allAdventures?.length || 0
      }

      // Test 5: Try to create an adventure (should work if member)
      if (results.userTest?.membership.isMember) {
        const { data: createTest, error: createError } = await supabase
          .from('cluequest_adventures')
          .insert({
            organization_id: 'f7b93ab0-b4c2-46bc-856f-6e22ac6671fb',
            title: `Test Adventure - ${new Date().toISOString()}`,
            description: 'Test adventure created by auth test',
            category: 'test',
            difficulty: 'easy',
            estimated_duration: 10,
            theme_name: 'modern',
            settings: { test: true },
            status: 'draft',
            is_public: false
          } as any)
          .select()
          .single()

        results.createTest = {
          success: !createError,
          data: createTest,
          error: createError?.message
        }

        // Clean up test adventure
        if (createTest) {
          await supabase
            .from('cluequest_adventures')
            .delete()
            .eq('id', (createTest as any).id)
        }
      }

    } catch (error: any) {
      results.error = error.message
    }

    setTestResults(results)
    setLoading(false)
  }

  const TestResult = ({ title, result, expected }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border p-4 space-y-2"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <span className={`text-sm px-2 py-1 rounded-full ${
          result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {result.success ? '✅ Pass' : '❌ Fail'}
        </span>
      </div>
      
      {expected && (
        <p className="text-xs text-gray-600">
          <strong>Expected:</strong> {expected}
        </p>
      )}
      
      {result.error && (
        <p className="text-xs text-red-600">
          <strong>Error:</strong> {result.error}
        </p>
      )}
      
      {result.data && typeof result.data === 'object' && (
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-600">Data ({Array.isArray(result.data) ? `${result.data.length} items` : 'object'})</summary>
          <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </details>
      )}
      
      {typeof result.count === 'number' && (
        <p className="text-xs text-gray-600">
          <strong>Count:</strong> {result.count}
        </p>
      )}
    </motion.div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Running authentication tests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Auth & RLS Test Suite</h1>
          <p className="text-gray-600">Testing multi-tenant authentication and row-level security</p>
        </div>

        {/* User Info Panel */}
        {userInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border p-6 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">Current User Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{userInfo.user?.email || 'Not authenticated'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">User ID</p>
                <p className="font-mono text-xs">{userInfo.user?.id || 'None'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Status</p>
                <p className={`font-medium ${userInfo.membership.isMember ? 'text-green-600' : 'text-red-600'}`}>
                  {userInfo.membership.isMember ? `✅ ${userInfo.membership.role}` : '❌ Not a member'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Organization</p>
                <p className="font-mono text-xs">{userInfo.membership.organizationId || 'None'}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Permissions Panel */}
        {testResults.permissions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border p-6 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">Permissions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(testResults.permissions).map(([permission, allowed]: [string, any]) => (
                <div key={permission} className="text-center">
                  <div className={`text-2xl mb-1 ${allowed ? 'text-green-600' : 'text-red-600'}`}>
                    {allowed ? '✅' : '❌'}
                  </div>
                  <p className="text-sm font-medium capitalize">{permission}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Test Results */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Test Results</h2>
          
          <div className="grid gap-4">
            {testResults.publicAdventures && (
              <TestResult
                title="Public Adventures Access (No Auth Required)"
                result={testResults.publicAdventures}
                expected="Should work for everyone, shows public adventures only"
              />
            )}

            {testResults.allAdventures && (
              <TestResult
                title="All Adventures Access (RLS Filtered)"
                result={testResults.allAdventures}
                expected={userInfo?.membership.isMember 
                  ? "Should show organization adventures for members" 
                  : "Should show only public adventures for non-members"
                }
              />
            )}

            {testResults.createTest && (
              <TestResult
                title="Create Adventure (Members Only)"
                result={testResults.createTest}
                expected="Should work only for organization members"
              />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={runAuthTests}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            🔄 Re-run Tests
          </motion.button>
          
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="/onboard"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            👤 Go to Onboarding
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="/dashboard"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            🏠 Go to Dashboard
          </motion.a>
        </div>

        {/* Debug Info */}
        <div className="mt-8 text-xs text-gray-500">
          <p>Default Organization: f7b93ab0-b4c2-46bc-856f-6e22ac6671fb</p>
          <p>Server: http://localhost:5173</p>
          <p>Test ran at: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}