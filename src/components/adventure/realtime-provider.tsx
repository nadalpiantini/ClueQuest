'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { RealtimeChannel } from '@supabase/supabase-js'
import { RealtimeEvent } from '@/types/adventure'
import { useAdventure } from './adventure-provider'

interface RealtimeContextType {
  isConnected: boolean
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected'
  sendEvent: (event: Omit<RealtimeEvent, 'timestamp'>) => void
  joinSession: (sessionId: string) => void
  leaveSession: () => void
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

interface RealtimeProviderProps {
  children: React.ReactNode
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const { state, updateLeaderboard, updateScore } = useAdventure()
  const [isConnected, setIsConnected] = useState(false)
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'disconnected'>('disconnected')
  const channelRef = useRef<RealtimeChannel | null>(null)
  const supabaseRef = useRef<any>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const connectionMetricsRef = useRef({
    lastPong: 0,
    latency: 0,
    reconnectAttempts: 0
  })

  // Initialize Supabase client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      supabaseRef.current = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          realtime: {
            params: {
              eventsPerSecond: 10 // Limit events for mobile performance
            }
          }
        }
      )
    }

    return () => {
      cleanup()
    }
  }, [])

  // Monitor connection status - removed dispatch to prevent infinite re-renders
  // Connection status is managed locally in this component

  const cleanup = () => {
    if (channelRef.current) {
      channelRef.current.unsubscribe()
      channelRef.current = null
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }
  }

  const startHeartbeat = () => {
    heartbeatIntervalRef.current = setInterval(() => {
      if (channelRef.current && isConnected) {
        const pingTime = Date.now()
        
        // Send ping and measure latency
        channelRef.current.send({
          type: 'broadcast',
          event: 'heartbeat',
          payload: { ping: pingTime, user_id: state.participant?.user_id }
        })
      }
    }, 30000) // 30 second heartbeat
  }

  const updateConnectionQuality = (latency: number) => {
    let quality: 'excellent' | 'good' | 'poor' | 'disconnected'
    
    if (latency < 100) {
      quality = 'excellent'
    } else if (latency < 300) {
      quality = 'good'
    } else if (latency < 1000) {
      quality = 'poor'
    } else {
      quality = 'disconnected'
    }
    
    setConnectionQuality(quality)
  }

  const handleReconnect = () => {
    const { reconnectAttempts } = connectionMetricsRef.current
    
    if (reconnectAttempts > 5) {
      console.error('Max reconnection attempts reached')
      setConnectionQuality('disconnected')
      return
    }

    connectionMetricsRef.current.reconnectAttempts += 1
    
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000) // Exponential backoff
    
    reconnectTimeoutRef.current = setTimeout(() => {
      if (state.session) {
        joinSession(state.session.id)
      }
    }, delay)
  }

  const joinSession = (sessionId: string) => {
    if (!supabaseRef.current || !sessionId) return

    cleanup()

    const channel = supabaseRef.current.channel(`session:${sessionId}`, {
      config: {
        broadcast: { self: true, ack: true }
      }
    })

    channel
      .on('broadcast', { event: 'participant_joined' }, (payload: any) => {
        handleRealtimeEvent({
          type: 'participant_joined',
          session_id: sessionId,
          user_id: payload.user_id,
          data: payload.data,
          timestamp: new Date().toISOString()
        })
      })
      .on('broadcast', { event: 'participant_left' }, (payload: any) => {
        handleRealtimeEvent({
          type: 'participant_left',
          session_id: sessionId,
          user_id: payload.user_id,
          data: payload.data,
          timestamp: new Date().toISOString()
        })
      })
      .on('broadcast', { event: 'score_updated' }, (payload: any) => {
        handleRealtimeEvent({
          type: 'score_updated',
          session_id: sessionId,
          user_id: payload.user_id,
          data: payload.data,
          timestamp: new Date().toISOString()
        })
      })
      .on('broadcast', { event: 'scene_completed' }, (payload: any) => {
        handleRealtimeEvent({
          type: 'scene_completed',
          session_id: sessionId,
          user_id: payload.user_id,
          data: payload.data,
          timestamp: new Date().toISOString()
        })
      })
      .on('broadcast', { event: 'challenge_completed' }, (payload: any) => {
        handleRealtimeEvent({
          type: 'challenge_completed',
          session_id: sessionId,
          user_id: payload.user_id,
          data: payload.data,
          timestamp: new Date().toISOString()
        })
      })
      .on('broadcast', { event: 'achievement_unlocked' }, (payload: any) => {
        handleRealtimeEvent({
          type: 'achievement_unlocked',
          session_id: sessionId,
          user_id: payload.user_id,
          data: payload.data,
          timestamp: new Date().toISOString()
        })
      })
      .on('broadcast', { event: 'session_started' }, (payload: any) => {
        handleRealtimeEvent({
          type: 'session_started',
          session_id: sessionId,
          user_id: payload.user_id,
          data: payload.data,
          timestamp: new Date().toISOString()
        })
      })
      .on('broadcast', { event: 'session_completed' }, (payload: any) => {
        handleRealtimeEvent({
          type: 'session_completed',
          session_id: sessionId,
          user_id: payload.user_id,
          data: payload.data,
          timestamp: new Date().toISOString()
        })
      })
      .on('broadcast', { event: 'heartbeat' }, (payload: any) => {
        const pongTime = Date.now()
        const latency = pongTime - payload.ping
        connectionMetricsRef.current.latency = latency
        connectionMetricsRef.current.lastPong = pongTime
        updateConnectionQuality(latency)
      })
      .subscribe((status: any) => {
        console.log('Realtime channel status:', status)
        
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
          connectionMetricsRef.current.reconnectAttempts = 0
          startHeartbeat()
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setIsConnected(false)
          handleReconnect()
        }
      })

    channelRef.current = channel
  }

  const leaveSession = () => {
    cleanup()
    setIsConnected(false)
    setConnectionQuality('disconnected')
  }

  const sendEvent = (event: Omit<RealtimeEvent, 'timestamp'>) => {
    if (!channelRef.current || !isConnected) {
      console.warn('Cannot send event: not connected to realtime channel')
      return
    }

    const fullEvent: RealtimeEvent = {
      ...event,
      timestamp: new Date().toISOString()
    }

    channelRef.current.send({
      type: 'broadcast',
      event: event.type,
      payload: {
        user_id: event.user_id,
        data: event.data
      }
    })
  }

  const handleRealtimeEvent = (event: RealtimeEvent) => {
    console.log('Realtime event received:', event)

    switch (event.type) {
      case 'participant_joined':
        // Update participant list
        break
        
      case 'participant_left':
        // Update participant list
        break
        
      case 'score_updated':
        if (event.data.leaderboard) {
          updateLeaderboard(event.data.leaderboard)
        }
        if (event.user_id === state.participant?.user_id && event.data.new_score) {
          updateScore(event.data.new_score)
        }
        break
        
      case 'scene_completed':
        // Update scene completion status
        break
        
      case 'challenge_completed':
        // Update challenge status
        break
        
      case 'achievement_unlocked':
        if (event.user_id === state.participant?.user_id && event.data.achievement) {
          dispatch({ type: 'ADD_ACHIEVEMENT', payload: event.data.achievement })
        }
        break
        
      case 'session_started':
        // Update session status
        break
        
      case 'session_completed':
        // Handle session completion
        break
        
      case 'hint_used':
        // Update hint usage
        break
        
      case 'message_sent':
        // Handle team messages
        break
        
      default:
        console.log('Unhandled realtime event:', event.type)
    }
  }

  const value: RealtimeContextType = {
    isConnected,
    connectionQuality,
    sendEvent,
    joinSession,
    leaveSession
  }

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  )
}

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider')
  }
  return context
}