/**
 * Workflow Manager - Differentiates between Host and Guest experiences
 * Manages the two distinct user journeys with appropriate permissions and UX
 */

import { Session, Participant, Adventure } from '@/types/adventure'

export type UserRole = 'host' | 'guest'

export interface WorkflowContext {
  role: UserRole
  session: Session | null
  participant: Participant | null
  adventure: Adventure | null
  permissions: Permission[]
}

export interface Permission {
  action: string
  resource: string
  granted: boolean
  reason?: string
}

export class WorkflowManager {
  private context: WorkflowContext

  constructor(
    userId: string,
    sessionId?: string,
    session?: Session,
    participant?: Participant,
    adventure?: Adventure
  ) {
    // Determine role based on session data
    const role = this.determineUserRole(userId, session)
    
    this.context = {
      role,
      session: session || null,
      participant: participant || null,
      adventure: adventure || null,
      permissions: this.calculatePermissions(role, session, participant)
    }
  }

  /**
   * Determine if user is Host or Guest based on session ownership
   */
  private determineUserRole(userId: string, session?: Session): UserRole {
    if (!session) return 'guest' // Default to guest if no session
    return session.host_user_id === userId ? 'host' : 'guest'
  }

  /**
   * Calculate permissions based on role and context
   */
  private calculatePermissions(
    role: UserRole, 
    session?: Session | null, 
    participant?: Participant | null
  ): Permission[] {
    const permissions: Permission[] = []

    if (role === 'host') {
      permissions.push(
        // Host Powers - Full Control
        { action: 'view', resource: 'all_participants', granted: true },
        { action: 'view', resource: 'session_analytics', granted: true },
        { action: 'edit', resource: 'session_settings', granted: true },
        { action: 'control', resource: 'session_flow', granted: true },
        { action: 'manage', resource: 'participants', granted: true },
        { action: 'view', resource: 'adventure_structure', granted: true },
        { action: 'intervene', resource: 'participant_progress', granted: true },
        { action: 'broadcast', resource: 'messages', granted: true },
        { action: 'release', resource: 'hints', granted: true },
        { action: 'modify', resource: 'difficulty', granted: true },
      )
    } else {
      permissions.push(
        // Guest Powers - Limited & Progressive Discovery
        { action: 'view', resource: 'own_progress', granted: true },
        { action: 'view', resource: 'current_challenge', granted: true },
        { action: 'view', resource: 'public_leaderboard', granted: true },
        { action: 'request', resource: 'hints', granted: true },
        { action: 'submit', resource: 'challenge_answers', granted: true },
        { action: 'chat', resource: 'team_messages', granted: participant?.status === 'active' },
        { action: 'view', resource: 'inventory', granted: true },
        
        // Explicitly Denied - Preserve Mystery
        { action: 'view', resource: 'adventure_structure', granted: false, reason: 'Spoils the mystery' },
        { action: 'view', resource: 'other_participants_full', granted: false, reason: 'Privacy protection' },
        { action: 'control', resource: 'session_flow', granted: false, reason: 'Host privilege only' },
        { action: 'view', resource: 'upcoming_challenges', granted: false, reason: 'Progressive discovery' },
      )
    }

    return permissions
  }

  /**
   * Check if user has permission for specific action
   */
  public hasPermission(action: string, resource: string): boolean {
    const permission = this.context.permissions.find(
      p => p.action === action && p.resource === resource
    )
    return permission?.granted || false
  }

  /**
   * Get the appropriate dashboard route based on role
   */
  public getDashboardRoute(): string {
    if (this.context.role === 'host') {
      return this.context.session 
        ? `/host/${this.context.session.id}`
        : '/dashboard'
    } else {
      return this.context.session
        ? `/play/${this.context.session.id}`
        : '/join'
    }
  }

  /**
   * Get filtered data appropriate for user's role
   */
  public getFilteredData(): {
    session: Partial<Session> | null
    participants: Partial<Participant>[]
    adventure: Partial<Adventure> | null
    analytics?: any
  } {
    if (!this.context.session) {
      return { session: null, participants: [], adventure: null }
    }

    if (this.context.role === 'host') {
      // Host gets everything
      return {
        session: this.context.session,
        participants: this.context.session.participants || [],
        adventure: this.context.adventure,
        analytics: this.getHostAnalytics()
      }
    } else {
      // Guest gets limited view
      return {
        session: this.getGuestSessionView(),
        participants: this.getGuestParticipantsView(),
        adventure: this.getGuestAdventureView(),
      }
    }
  }

  /**
   * Host-specific analytics data
   */
  private getHostAnalytics() {
    if (!this.context.session) return null

    return {
      totalParticipants: this.context.session.participants?.length || 0,
      averageProgress: this.calculateAverageProgress(),
      completionRate: this.calculateCompletionRate(),
      engagementMetrics: this.calculateEngagement(),
      realTimeEvents: [] // WebSocket events feed
    }
  }

  /**
   * Guest view of session - minimal info to preserve mystery
   */
  private getGuestSessionView(): Partial<Session> | null {
    if (!this.context.session) return null

    return {
      id: this.context.session.id,
      status: this.context.session.status,
      session_code: this.context.session.session_code,
      // Deliberately omitting:
      // - Total participant count (could reveal scale)
      // - Other participants' detailed info
      // - Adventure structure details
    }
  }

  /**
   * Guest view of participants - only team members and public leaderboard
   */
  private getGuestParticipantsView(): Partial<Participant>[] {
    if (!this.context.session?.participants || !this.context.participant) {
      return []
    }

    const myRoleId = this.context.participant.role_id

    return this.context.session.participants
      .filter(p => 
        // Show team members (same role) or top performers for leaderboard
        p.role_id === myRoleId || p.score > 0
      )
      .map(p => ({
        id: p.id,
        guest_name: p.guest_name,
        role_id: p.role_id,
        avatar_url: p.avatar_url,
        score: p.score,
        status: p.status,
        // Omit sensitive data:
        // - Full progress details
        // - Current scene info
        // - Personal user_id
      }))
  }

  /**
   * Guest view of adventure - current challenge only
   */
  private getGuestAdventureView(): Partial<Adventure> | null {
    if (!this.context.adventure || !this.context.participant) return null

    const currentSceneId = this.context.participant.current_scene_id
    const currentScene = this.context.adventure.scenes.find(s => s.id === currentSceneId)

    return {
      id: this.context.adventure.id,
      title: this.context.adventure.title,
      theme: this.context.adventure.theme,
      // Only current scene and its challenges
      scenes: currentScene ? [currentScene] : [],
      // Omit future challenges and full story structure
    }
  }

  /**
   * Calculate average progress across all participants
   */
  private calculateAverageProgress(): number {
    if (!this.context.session?.participants) return 0

    const totalProgress = this.context.session.participants.reduce(
      (sum, p) => sum + p.progress.completed_challenges.length, 0
    )
    return totalProgress / this.context.session.participants.length
  }

  /**
   * Calculate completion rate
   */
  private calculateCompletionRate(): number {
    if (!this.context.session?.participants) return 0

    const completedParticipants = this.context.session.participants.filter(
      p => p.status === 'completed'
    ).length

    return (completedParticipants / this.context.session.participants.length) * 100
  }

  /**
   * Calculate engagement metrics
   */
  private calculateEngagement(): any {
    // Implementation for engagement calculations
    return {
      averageTimeSpent: 0,
      hintUsageRate: 0,
      collaborationScore: 0,
      dropOffRate: 0
    }
  }

  /**
   * Get appropriate UI components for role
   */
  public getUIComponents(): {
    layout: 'host' | 'guest'
    navigation: string[]
    features: string[]
  } {
    if (this.context.role === 'host') {
      return {
        layout: 'host',
        navigation: [
          'Dashboard',
          'Session Control',
          'Participants',
          'Analytics',
          'Settings'
        ],
        features: [
          'real-time-monitoring',
          'participant-management',
          'session-control',
          'analytics-dashboard',
          'intervention-tools'
        ]
      }
    } else {
      return {
        layout: 'guest',
        navigation: [
          'Adventure',
          'Inventory',
          'Team',
          'Leaderboard'
        ],
        features: [
          'progressive-discovery',
          'challenge-interface',
          'team-chat',
          'hint-system',
          'achievement-tracker'
        ]
      }
    }
  }

  /**
   * Get role-specific websocket channels
   */
  public getWebSocketChannels(): string[] {
    if (!this.context.session) return []

    const baseChannels = [`session:${this.context.session.id}`]

    if (this.context.role === 'host') {
      baseChannels.push(
        `session:${this.context.session.id}:host`,
        `session:${this.context.session.id}:analytics`,
        `session:${this.context.session.id}:participants`
      )
    } else if (this.context.participant) {
      baseChannels.push(
        `participant:${this.context.participant.id}`,
        `role:${this.context.participant.role_id}`,
        `session:${this.context.session.id}:public`
      )
    }

    return baseChannels
  }

  /**
   * Context getters
   */
  public get role(): UserRole {
    return this.context.role
  }

  public get isHost(): boolean {
    return this.context.role === 'host'
  }

  public get isGuest(): boolean {
    return this.context.role === 'guest'
  }

  public get permissions(): Permission[] {
    return this.context.permissions
  }
}

/**
 * Hook for using workflow manager in React components
 */
export function useWorkflow(
  userId: string,
  sessionId?: string,
  session?: Session,
  participant?: Participant,
  adventure?: Adventure
): WorkflowManager {
  return new WorkflowManager(userId, sessionId, session, participant, adventure)
}

/**
 * Utility functions for common checks
 */
export const WorkflowUtils = {
  /**
   * Determine if a route should be accessible for a role
   */
  canAccessRoute(role: UserRole, route: string): boolean {
    const hostRoutes = ['/dashboard', '/create', '/host/', '/analytics']
    const guestRoutes = ['/join', '/play/', '/results/']
    
    if (role === 'host') {
      return hostRoutes.some(r => route.startsWith(r)) || 
             guestRoutes.some(r => route.startsWith(r)) // Hosts can also join as guests
    } else {
      return guestRoutes.some(r => route.startsWith(r))
    }
  },

  /**
   * Get redirect URL for unauthorized access
   */
  getRedirectForUnauthorized(role: UserRole, intendedRoute: string): string {
    if (role === 'host') {
      return '/dashboard'
    } else {
      return '/join'
    }
  },

  /**
   * Check if user can create adventures
   */
  canCreateAdventures(role: UserRole): boolean {
    return role === 'host'
  },

  /**
   * Check if user needs session code to proceed
   */
  needsSessionCode(role: UserRole, route: string): boolean {
    return role === 'guest' && (route.startsWith('/play') || route.startsWith('/results'))
  }
}