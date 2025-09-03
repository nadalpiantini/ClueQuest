'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { GameState, Adventure, Session, Participant, LeaderboardEntry } from '@/types/adventure'

interface AdventureContextType {
  state: GameState
  dispatch: React.Dispatch<AdventureAction>
  // Action helpers
  setSession: (session: Session) => void
  setParticipant: (participant: Participant) => void
  updateScore: (newScore: number) => void
  updateLeaderboard: (leaderboard: LeaderboardEntry[]) => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
}

type AdventureAction =
  | { type: 'SET_SESSION'; payload: Session }
  | { type: 'SET_PARTICIPANT'; payload: Participant }
  | { type: 'SET_CURRENT_SCENE'; payload: any }
  | { type: 'SET_CURRENT_CHALLENGE'; payload: any }
  | { type: 'UPDATE_SCORE'; payload: number }
  | { type: 'UPDATE_LEADERBOARD'; payload: LeaderboardEntry[] }
  | { type: 'ADD_INVENTORY_ITEM'; payload: any }
  | { type: 'ADD_ACHIEVEMENT'; payload: any }
  | { type: 'SET_CONNECTION_STATUS'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_STATE' }

const initialState: GameState = {
  session: null,
  participant: null,
  current_scene: null,
  current_challenge: null,
  leaderboard: [],
  inventory: [],
  achievements: [],
  is_connected: false,
  is_loading: false,
  error: null
}

function adventureReducer(state: GameState, action: AdventureAction): GameState {
  switch (action.type) {
    case 'SET_SESSION':
      return { ...state, session: action.payload }
    
    case 'SET_PARTICIPANT':
      return { ...state, participant: action.payload }
    
    case 'SET_CURRENT_SCENE':
      return { ...state, current_scene: action.payload }
    
    case 'SET_CURRENT_CHALLENGE':
      return { ...state, current_challenge: action.payload }
    
    case 'UPDATE_SCORE':
      return {
        ...state,
        participant: state.participant ? {
          ...state.participant,
          score: action.payload
        } : null
      }
    
    case 'UPDATE_LEADERBOARD':
      return { ...state, leaderboard: action.payload }
    
    case 'ADD_INVENTORY_ITEM':
      return {
        ...state,
        inventory: [...state.inventory, action.payload]
      }
    
    case 'ADD_ACHIEVEMENT':
      return {
        ...state,
        achievements: [...state.achievements, action.payload]
      }
    
    case 'SET_CONNECTION_STATUS':
      return { ...state, is_connected: action.payload }
    
    case 'SET_LOADING':
      return { ...state, is_loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'RESET_STATE':
      return initialState
    
    default:
      return state
  }
}

const AdventureContext = createContext<AdventureContextType | undefined>(undefined)

interface AdventureProviderProps {
  children: React.ReactNode
}

export function AdventureProvider({ children }: AdventureProviderProps) {
  const [state, dispatch] = useReducer(adventureReducer, initialState)

  // Load saved state from localStorage on mount
  useEffect(() => {
    try {
      const savedParticipant = localStorage.getItem('cluequest_participant')
      if (savedParticipant) {
        const participant = JSON.parse(savedParticipant)
        dispatch({ type: 'SET_PARTICIPANT', payload: participant })
      }

      const savedSession = localStorage.getItem('cluequest_session')
      if (savedSession) {
        const session = JSON.parse(savedSession)
        dispatch({ type: 'SET_SESSION', payload: session })
      }
    } catch (error) {
      console.error('Failed to load saved adventure state:', error)
    }
  }, [])

  // Save participant data when it changes
  useEffect(() => {
    if (state.participant) {
      localStorage.setItem('cluequest_participant', JSON.stringify(state.participant))
    }
  }, [state.participant])

  // Save session data when it changes
  useEffect(() => {
    if (state.session) {
      localStorage.setItem('cluequest_session', JSON.stringify(state.session))
    }
  }, [state.session])

  // Action helpers
  const setSession = (session: Session) => {
    dispatch({ type: 'SET_SESSION', payload: session })
  }

  const setParticipant = (participant: Participant) => {
    dispatch({ type: 'SET_PARTICIPANT', payload: participant })
  }

  const updateScore = (newScore: number) => {
    dispatch({ type: 'UPDATE_SCORE', payload: newScore })
  }

  const updateLeaderboard = (leaderboard: LeaderboardEntry[]) => {
    dispatch({ type: 'UPDATE_LEADERBOARD', payload: leaderboard })
  }

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }

  const value: AdventureContextType = {
    state,
    dispatch,
    setSession,
    setParticipant,
    updateScore,
    updateLeaderboard,
    setError,
    setLoading
  }

  return (
    <AdventureContext.Provider value={value}>
      {children}
    </AdventureContext.Provider>
  )
}

export function useAdventure() {
  const context = useContext(AdventureContext)
  if (context === undefined) {
    throw new Error('useAdventure must be used within an AdventureProvider')
  }
  return context
}