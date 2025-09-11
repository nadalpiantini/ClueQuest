/**
 * Demo Implementation for The Midnight Express Mystery
 * Shows how to use the adventure data in a real application
 */

import { 
  completeMidnightExpressAdventure,
  midnightExpressNPCs,
  midnightExpressMaterials,
  midnightExpressEndings,
  midnightExpressProgression,
  midnightExpressCommunication,
  ADVENTURE_CONSTANTS
} from './index'

// Example: Setting up a new game session
export const setupMidnightExpressSession = () => {
  const adventure = completeMidnightExpressAdventure
  const sessionId = `session-${Date.now()}`
  
  return {
    sessionId,
    adventure: adventure,
    players: [],
    currentScene: adventure.scenes[0],
    progress: {
      completedScenes: [],
      completedPuzzles: [],
      hintsUsed: [],
      score: 0,
      startTime: new Date(),
      currentTime: new Date()
    },
    decisions: [],
    ending: null
  }
}

// Example: Validating a puzzle answer
export const validatePuzzleAnswer = (puzzleId: string, answer: string) => {
  const validation = midnightExpressProgression.validations.find(v => v.puzzleId === puzzleId)
  
  if (!validation) {
    return { valid: false, message: 'Puzzle not found' }
  }
  
  const normalizedAnswer = answer.trim().toLowerCase()
  const normalizedCorrectAnswers = validation.correctAnswers.map(a => a.trim().toLowerCase())
  
  if (validation.validationType === 'exact_match') {
    const isValid = normalizedCorrectAnswers.includes(normalizedAnswer)
    return { 
      valid: isValid, 
      message: isValid ? 'Correct!' : 'Incorrect. Try again.',
      score: isValid ? 100 : 0
    }
  }
  
  if (validation.validationType === 'fuzzy_match') {
    // Simple fuzzy matching - in production, use a proper fuzzy matching library
    const isValid = normalizedCorrectAnswers.some(correct => 
      correct.includes(normalizedAnswer) || normalizedAnswer.includes(correct)
    )
    return { 
      valid: isValid, 
      message: isValid ? 'Correct!' : 'Close, but not quite right.',
      score: isValid ? 100 : 0
    }
  }
  
  return { valid: false, message: 'Unknown validation type' }
}

// Example: Getting hints for a puzzle
export const getPuzzleHints = (puzzleId: string, attemptNumber: number) => {
  const hints = midnightExpressProgression.hints.filter(h => h.puzzleId === puzzleId)
  
  if (attemptNumber === 1) {
    return hints.find(h => h.level === 'subtle')
  } else if (attemptNumber === 2) {
    return hints.find(h => h.level === 'obvious')
  } else if (attemptNumber >= 3) {
    return hints.find(h => h.level === 'direct')
  }
  
  return null
}

// Example: Processing NPC dialogue
export const processNPCDialogue = (npcId: string, dialogueId: string, responseId: string) => {
  const npc = midnightExpressNPCs.find(n => n.id === npcId)
  if (!npc) return { error: 'NPC not found' }
  
  const dialogue = npc.dialogue.find(d => d.id === dialogueId)
  if (!dialogue) return { error: 'Dialogue not found' }
  
  const response = dialogue.responses.find(r => r.id === responseId)
  if (!response) return { error: 'Response not found' }
  
  return {
    npc: npc.name,
    response: response.text,
    nextDialogue: response.nextDialogueId,
    revealsClue: response.revealsClue,
    clueId: response.clueId,
    givesItem: response.givesItem
  }
}

// Example: Checking scene unlock conditions
export const checkSceneUnlock = (sceneId: string, progress: any) => {
  const unlockCondition = midnightExpressProgression.unlockConditions.find(u => u.sceneId === sceneId)
  
  if (!unlockCondition) {
    return { unlocked: true, message: 'No unlock conditions' }
  }
  
  // Check required scenes
  const requiredScenesCompleted = unlockCondition.requiredScenes.every(sceneId => 
    progress.completedScenes.includes(sceneId)
  )
  
  // Check required puzzles
  const requiredPuzzlesCompleted = unlockCondition.requiredPuzzles.every(puzzleId => 
    progress.completedPuzzles.includes(puzzleId)
  )
  
  const unlocked = requiredScenesCompleted && requiredPuzzlesCompleted
  
  return {
    unlocked,
    message: unlocked ? 'Scene unlocked!' : 'Complete previous scenes and puzzles first',
    missingScenes: unlockCondition.requiredScenes.filter(sceneId => 
      !progress.completedScenes.includes(sceneId)
    ),
    missingPuzzles: unlockCondition.requiredPuzzles.filter(puzzleId => 
      !progress.completedPuzzles.includes(puzzleId)
    )
  }
}

// Example: Processing team decisions
export const processTeamDecision = (decisionId: string, choiceId: string, teamVotes: any[]) => {
  const decision = midnightExpressEndings.decisions.find(d => d.id === decisionId)
  if (!decision) return { error: 'Decision not found' }
  
  const choice = decision.options.find(o => o.id === choiceId)
  if (!choice) return { error: 'Choice not found' }
  
  // Check if decision requires consensus
  if ((decision as any).coordinationType === 'consensus') {
    const unanimous = teamVotes.every(vote => vote.choiceId === choiceId)
    if (!unanimous) {
      return { 
        error: 'Consensus required', 
        message: 'All team members must agree on this decision' 
      }
    }
  }
  
  return {
    decision: decision.question,
    choice: choice.text,
    consequences: choice.consequences,
    unlocksEnding: choice.unlocksEnding,
    blocksEnding: choice.blocksEnding,
    nextSceneId: choice.nextSceneId
  }
}

// Example: Calculating final score
export const calculateFinalScore = (progress: any, ending: string) => {
  let baseScore = progress.completedPuzzles.length * 100
  let bonusScore = 0
  
  // Bonus for completing without hints
  const hintsUsed = progress.hintsUsed.length
  if (hintsUsed === 0) {
    bonusScore += 500
  } else if (hintsUsed <= 3) {
    bonusScore += 200
  }
  
  // Bonus for time
  const totalTime = progress.currentTime.getTime() - progress.startTime.getTime()
  const timeInMinutes = totalTime / (1000 * 60)
  const targetTime = ADVENTURE_CONSTANTS.MIDNIGHT_EXPRESS.DURATION
  
  if (timeInMinutes <= targetTime) {
    bonusScore += 300
  } else if (timeInMinutes <= targetTime * 1.2) {
    bonusScore += 100
  }
  
  // Bonus for ending
  const endingData = midnightExpressEndings.endings.find(e => e.id === ending)
  if (endingData) {
    bonusScore += endingData.score
  }
  
  return {
    baseScore,
    bonusScore,
    totalScore: baseScore + bonusScore,
    hintsUsed,
    timeTaken: timeInMinutes,
    ending
  }
}

// Example: Getting adventure statistics
export const getAdventureStats = () => {
  const adventure = completeMidnightExpressAdventure
  
  return {
    title: adventure.title,
    duration: adventure.estimatedDuration,
    scenes: adventure.scenes.length,
    puzzles: adventure.scenes.reduce((total, scene) => total + scene.challenges.length, 0),
    npcs: midnightExpressNPCs.length,
    materials: midnightExpressMaterials.materials.length,
    endings: midnightExpressEndings.endings.length,
    hints: midnightExpressProgression.hints.length,
    coordination: midnightExpressCommunication.coordination.length
  }
}

// Example: Exporting adventure data for external use
export const exportAdventureData = () => {
  return {
    adventure: completeMidnightExpressAdventure,
    npcs: midnightExpressNPCs,
    materials: midnightExpressMaterials,
    endings: midnightExpressEndings,
    progression: midnightExpressProgression,
    communication: midnightExpressCommunication,
    constants: ADVENTURE_CONSTANTS,
    exportedAt: new Date().toISOString(),
    version: '1.0.0'
  }
}

// Example: Importing and validating adventure data
export const importAdventureData = (data: any) => {
  try {
    // Validate required fields
    const requiredFields = ['adventure', 'npcs', 'materials', 'endings', 'progression', 'communication']
    const missingFields = requiredFields.filter(field => !data[field])
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }
    
    // Validate adventure structure
    if (!data.adventure.id || !data.adventure.title || !data.adventure.scenes) {
      throw new Error('Invalid adventure structure')
    }
    
    // Validate scenes
    if (!Array.isArray(data.adventure.scenes) || data.adventure.scenes.length === 0) {
      throw new Error('Adventure must have at least one scene')
    }
    
    // Validate NPCs
    if (!Array.isArray(data.npcs) || data.npcs.length === 0) {
      throw new Error('Adventure must have at least one NPC')
    }
    
    return {
      valid: true,
      message: 'Adventure data imported successfully',
      stats: getAdventureStats()
    }
  } catch (error) {
    return {
      valid: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error
    }
  }
}

export default {
  setupMidnightExpressSession,
  validatePuzzleAnswer,
  getPuzzleHints,
  processNPCDialogue,
  checkSceneUnlock,
  processTeamDecision,
  calculateFinalScore,
  getAdventureStats,
  exportAdventureData,
  importAdventureData
}
