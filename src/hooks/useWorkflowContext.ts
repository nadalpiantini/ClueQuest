/**
 * React Hook for Workflow Context Management
 * Provides role-aware state management and permissions
 */

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { WorkflowManager, UserRole, WorkflowUtils } from '@/lib/workflow-manager'
import { Session, Participant, Adventure } from '@/types/adventure'
import { useAdventure } from '@/components/adventure/adventure-provider'

interface UseWorkflowContextReturn {
  workflow: WorkflowManager | null
  role: UserRole | null
  isHost: boolean
  isGuest: boolean
  hasPermission: (action: string, resource: string) => boolean
  filteredData: ReturnType<WorkflowManager['getFilteredData']>
  uiComponents: ReturnType<WorkflowManager['getUIComponents']>
  websocketChannels: string[]
  navigateToDashboard: () => void
  checkRouteAccess: (route: string) => boolean
  loading: boolean
  error: string | null
}

interface UseWorkflowContextProps {
  userId: string
  sessionId?: string
  autoRedirect?: boolean
}

export function useWorkflowContext({
  userId,
  sessionId,
  autoRedirect = true
}: UseWorkflowContextProps): UseWorkflowContextReturn {
  const router = useRouter()
  const { state } = useAdventure()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [workflow, setWorkflow] = useState<WorkflowManager | null>(null)

  /**
   * Initialize workflow manager when dependencies change
   */
  useEffect(() => {
    try {
      setLoading(true)
      setError(null)

      const workflowManager = new WorkflowManager(
        userId,
        sessionId,
        state.session || undefined,
        state.participant || undefined,
        undefined // adventure will be loaded separately
      )

      setWorkflow(workflowManager)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [userId, sessionId, state.session, state.participant])

  /**
   * Auto-redirect based on role and current route
   */
  useEffect(() => {
    if (!autoRedirect || !workflow || loading) return

    const currentPath = window.location.pathname
    const canAccess = WorkflowUtils.canAccessRoute(workflow.role, currentPath)

    if (!canAccess) {
      const redirectUrl = WorkflowUtils.getRedirectForUnauthorized(workflow.role, currentPath)
      router.replace(redirectUrl)
    }
  }, [workflow, router, autoRedirect, loading])

  /**
   * Permission checker
   */
  const hasPermission = useCallback(
    (action: string, resource: string): boolean => {
      return workflow?.hasPermission(action, resource) || false
    },
    [workflow]
  )

  /**
   * Navigate to appropriate dashboard
   */
  const navigateToDashboard = useCallback(() => {
    if (!workflow) return
    
    const dashboardRoute = workflow.getDashboardRoute()
    router.push(dashboardRoute)
  }, [workflow, router])

  /**
   * Check if user can access specific route
   */
  const checkRouteAccess = useCallback(
    (route: string): boolean => {
      if (!workflow) return false
      return WorkflowUtils.canAccessRoute(workflow.role, route)
    },
    [workflow]
  )

  /**
   * Memoized derived data
   */
  const derivedData = useMemo(() => {
    if (!workflow) {
      return {
        role: null as UserRole | null,
        isHost: false,
        isGuest: false,
        filteredData: { session: null, participants: [], adventure: null },
        uiComponents: { layout: 'guest' as const, navigation: [], features: [] },
        websocketChannels: []
      }
    }

    return {
      role: workflow.role,
      isHost: workflow.isHost,
      isGuest: workflow.isGuest,
      filteredData: workflow.getFilteredData(),
      uiComponents: workflow.getUIComponents(),
      websocketChannels: workflow.getWebSocketChannels()
    }
  }, [workflow])

  return {
    workflow,
    ...derivedData,
    hasPermission,
    navigateToDashboard,
    checkRouteAccess,
    loading,
    error
  }
}

/**
 * Hook for route protection based on workflow permissions
 */
export function useWorkflowGuard(
  userId: string, 
  requiredPermissions?: Array<{action: string, resource: string}>
) {
  const router = useRouter()
  const workflowContext = useWorkflowContext({ userId, autoRedirect: false })

  useEffect(() => {
    if (workflowContext.loading) return

    // Check route access
    const currentPath = window.location.pathname
    const hasRouteAccess = workflowContext.checkRouteAccess(currentPath)

    if (!hasRouteAccess) {
      const redirectUrl = WorkflowUtils.getRedirectForUnauthorized(
        workflowContext.role || 'guest', 
        currentPath
      )
      router.replace(redirectUrl)
      return
    }

    // Check specific permissions if required
    if (requiredPermissions && workflowContext.workflow) {
      const hasAllPermissions = requiredPermissions.every(permission =>
        workflowContext.hasPermission(permission.action, permission.resource)
      )

      if (!hasAllPermissions) {
        workflowContext.navigateToDashboard()
        return
      }
    }
  }, [
    workflowContext.loading,
    workflowContext.role,
    workflowContext.workflow,
    workflowContext.hasPermission,
    workflowContext.checkRouteAccess,
    workflowContext.navigateToDashboard,
    router,
    requiredPermissions
  ])

  return workflowContext
}

/**
 * Hook specifically for host-only components
 */
export function useHostWorkflow(userId: string) {
  const workflowContext = useWorkflowContext({ userId })

  useEffect(() => {
    if (!workflowContext.loading && !workflowContext.isHost) {
      workflowContext.navigateToDashboard()
    }
  }, [workflowContext.loading, workflowContext.isHost, workflowContext.navigateToDashboard])

  return {
    ...workflowContext,
    // Additional host-specific utilities
    canManageParticipants: workflowContext.hasPermission('manage', 'participants'),
    canControlSession: workflowContext.hasPermission('control', 'session_flow'),
    canViewAnalytics: workflowContext.hasPermission('view', 'session_analytics'),
    canModifyDifficulty: workflowContext.hasPermission('modify', 'difficulty')
  }
}

/**
 * Hook specifically for guest-only components
 */
export function useGuestWorkflow(userId: string, sessionId?: string) {
  const workflowContext = useWorkflowContext({ userId, sessionId })

  useEffect(() => {
    if (!workflowContext.loading && !workflowContext.isGuest) {
      workflowContext.navigateToDashboard()
    }
  }, [workflowContext.loading, workflowContext.isGuest, workflowContext.navigateToDashboard])

  return {
    ...workflowContext,
    // Additional guest-specific utilities
    canViewProgress: workflowContext.hasPermission('view', 'own_progress'),
    canRequestHints: workflowContext.hasPermission('request', 'hints'),
    canSubmitAnswers: workflowContext.hasPermission('submit', 'challenge_answers'),
    canChatWithTeam: workflowContext.hasPermission('chat', 'team_messages')
  }
}