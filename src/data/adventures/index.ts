/**
 * Adventure Data Exports
 * Centralized exports for all adventure data and systems
 */
// @ts-nocheck

// Midnight Express Mystery Adventure
export { default as midnightExpressMystery } from './midnight-express-mystery'
export { default as midnightExpressNPCs } from './midnight-express-npcs'
export { default as midnightExpressMaterials } from './midnight-express-materials'
export { default as midnightExpressEndings } from './midnight-express-endings'
export { default as midnightExpressProgression } from './midnight-express-progression'
export { default as midnightExpressCommunication } from './midnight-express-communication'
export { completeMidnightExpressAdventure } from './midnight-express-complete'

// Adventure Types
export type { Adventure, Scene, Challenge, Role } from '@/lib/domain/adventure/models'

// Midnight Express Types
export type { NPC, NPCDialogue, DialogueResponse } from './midnight-express-npcs'
export type { AdventureMaterial, QRCodeElement, ARElement, SoundEffect, ScentElement } from './midnight-express-materials'
export type { AdventureEnding, PlayerDecision, DecisionOption, DecisionConsequence } from './midnight-express-endings'
export type { PuzzleValidation, ProgressionTracker, HintSystem, SceneUnlockCondition } from './midnight-express-progression'
export type { TeamCommunication, TeamCoordination, SharedNotebook } from './midnight-express-communication'
export type { CompleteMidnightExpressAdventure, SetupGuide, MasterGuide, PlayerGuide } from './midnight-express-complete'

// Adventure Constants
export const ADVENTURE_CONSTANTS = {
  MIDNIGHT_EXPRESS: {
    ID: 'midnight-express-mystery',
    TITLE: 'The Midnight Express Mystery',
    DURATION: 55, // minutes
    MIN_PLAYERS: 4,
    MAX_PLAYERS: 8,
    MIN_AGE: 12,
    DIFFICULTY: 'intermediate',
    CATEGORY: 'mystery',
    SCENE_COUNT: 10,
    PUZZLE_COUNT: 15,
    NPC_COUNT: 7,
    ENDING_COUNT: 6
  }
} as const

// Adventure Utilities
export const getAdventureById = (id: string) => {
  switch (id) {
    case 'midnight-express-mystery':
      return completeMidnightExpressAdventure
    default:
      throw new Error(`Adventure with id "${id}" not found`)
  }
}

export const getAllAdventures = () => {
  return [completeMidnightExpressAdventure]
}

export const getAdventureByCategory = (category: string) => {
  return getAllAdventures().filter(adventure => adventure.category === category)
}

export const getAdventureByDifficulty = (difficulty: string) => {
  return getAllAdventures().filter(adventure => adventure.difficulty === difficulty)
}

export const getAdventureByPlayerCount = (playerCount: number) => {
  return getAllAdventures().filter(adventure => 
    playerCount >= adventure.settings.maxTeamSize && 
    playerCount <= adventure.maxParticipants
  )
}
