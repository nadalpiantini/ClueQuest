export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'speed' | 'accuracy' | 'teamwork' | 'exploration' | 'creativity' | 'mastery'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  points: number
  criteria: {
    type: 'challenges_completed' | 'time_bonus' | 'perfect_score' | 'team_collaboration' | 'hints_used' | 'locations_visited'
    threshold: number
    condition?: 'less_than' | 'greater_than' | 'equal_to'
  }
  unlockedAt?: Date
}

export interface PlayerLevel {
  level: number
  name: string
  requiredPoints: number
  benefits: string[]
  color: string
  icon: string
}

export const achievements: Achievement[] = [
  // SPEED ACHIEVEMENTS
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete 5 challenges in under 2 minutes each',
    icon: '⚡',
    category: 'speed',
    rarity: 'rare',
    points: 50,
    criteria: {
      type: 'time_bonus',
      threshold: 5,
      condition: 'greater_than'
    }
  },
  {
    id: 'lightning-fast',
    name: 'Lightning Fast',
    description: 'Complete a challenge in under 30 seconds',
    icon: '🌩️',
    category: 'speed',
    rarity: 'uncommon',
    points: 25,
    criteria: {
      type: 'time_bonus',
      threshold: 30,
      condition: 'less_than'
    }
  },

  // ACCURACY ACHIEVEMENTS
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete 10 challenges without using any hints',
    icon: '🎯',
    category: 'accuracy',
    rarity: 'epic',
    points: 100,
    criteria: {
      type: 'hints_used',
      threshold: 0,
      condition: 'equal_to'
    }
  },
  {
    id: 'first-try-master',
    name: 'First Try Master',
    description: 'Complete 5 challenges on the first attempt',
    icon: '🏆',
    category: 'accuracy',
    rarity: 'rare',
    points: 75,
    criteria: {
      type: 'perfect_score',
      threshold: 5,
      condition: 'greater_than'
    }
  },

  // TEAMWORK ACHIEVEMENTS
  {
    id: 'team-player',
    name: 'Team Player',
    description: 'Complete 3 team challenges successfully',
    icon: '🤝',
    category: 'teamwork',
    rarity: 'common',
    points: 30,
    criteria: {
      type: 'team_collaboration',
      threshold: 3,
      condition: 'greater_than'
    }
  },
  {
    id: 'collaboration-expert',
    name: 'Collaboration Expert',
    description: 'Help teammates complete 10 challenges',
    icon: '👥',
    category: 'teamwork',
    rarity: 'rare',
    points: 60,
    criteria: {
      type: 'team_collaboration',
      threshold: 10,
      condition: 'greater_than'
    }
  },

  // EXPLORATION ACHIEVEMENTS
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Visit all locations in an adventure',
    icon: '🗺️',
    category: 'exploration',
    rarity: 'uncommon',
    points: 40,
    criteria: {
      type: 'locations_visited',
      threshold: 1,
      condition: 'greater_than'
    }
  },
  {
    id: 'adventure-seeker',
    name: 'Adventure Seeker',
    description: 'Complete 5 different adventures',
    icon: '🏔️',
    category: 'exploration',
    rarity: 'rare',
    points: 80,
    criteria: {
      type: 'challenges_completed',
      threshold: 25,
      condition: 'greater_than'
    }
  },

  // CREATIVITY ACHIEVEMENTS
  {
    id: 'creative-genius',
    name: 'Creative Genius',
    description: 'Submit 3 highly creative photo challenges',
    icon: '🎨',
    category: 'creativity',
    rarity: 'uncommon',
    points: 35,
    criteria: {
      type: 'challenges_completed',
      threshold: 3,
      condition: 'greater_than'
    }
  },
  {
    id: 'artistic-master',
    name: 'Artistic Master',
    description: 'Create 5 unique creative solutions',
    icon: '🖼️',
    category: 'creativity',
    rarity: 'rare',
    points: 65,
    criteria: {
      type: 'challenges_completed',
      threshold: 5,
      condition: 'greater_than'
    }
  },

  // MASTERY ACHIEVEMENTS
  {
    id: 'challenge-master',
    name: 'Challenge Master',
    description: 'Complete 50 challenges total',
    icon: '👑',
    category: 'mastery',
    rarity: 'epic',
    points: 150,
    criteria: {
      type: 'challenges_completed',
      threshold: 50,
      condition: 'greater_than'
    }
  },
  {
    id: 'legendary-adventurer',
    name: 'Legendary Adventurer',
    description: 'Complete 100 challenges and unlock all other achievements',
    icon: '🌟',
    category: 'mastery',
    rarity: 'legendary',
    points: 500,
    criteria: {
      type: 'challenges_completed',
      threshold: 100,
      condition: 'greater_than'
    }
  }
]

export const playerLevels: PlayerLevel[] = [
  {
    level: 1,
    name: 'Novice Explorer',
    requiredPoints: 0,
    benefits: ['Basic challenge access', 'Standard hints'],
    color: 'slate',
    icon: '🌱'
  },
  {
    level: 2,
    name: 'Adventure Seeker',
    requiredPoints: 100,
    benefits: ['Extra hints per challenge', 'Priority support'],
    color: 'blue',
    icon: '🔍'
  },
  {
    level: 3,
    name: 'Challenge Solver',
    requiredPoints: 250,
    benefits: ['Bonus points multiplier', 'Advanced challenges'],
    color: 'green',
    icon: '🧩'
  },
  {
    level: 4,
    name: 'Puzzle Master',
    requiredPoints: 500,
    benefits: ['Time bonus increase', 'Exclusive challenges'],
    color: 'purple',
    icon: '🎯'
  },
  {
    level: 5,
    name: 'Adventure Expert',
    requiredPoints: 1000,
    benefits: ['Double points weekend', 'Custom challenges'],
    color: 'orange',
    icon: '⚡'
  },
  {
    level: 6,
    name: 'Quest Legend',
    requiredPoints: 2000,
    benefits: ['All benefits unlocked', 'Legendary status'],
    color: 'gold',
    icon: '👑'
  }
]

// Helper functions
export const getPlayerLevel = (totalPoints: number): PlayerLevel => {
  const sortedLevels = [...playerLevels].sort((a, b) => b.requiredPoints - a.requiredPoints)
  return sortedLevels.find(level => totalPoints >= level.requiredPoints) || playerLevels[0]
}

export const getNextLevel = (currentLevel: number): PlayerLevel | null => {
  return playerLevels.find(level => level.level === currentLevel + 1) || null
}

export const getProgressToNextLevel = (currentPoints: number, currentLevel: number): number => {
  const nextLevel = getNextLevel(currentLevel)
  if (!nextLevel) return 100 // Max level reached
  
  const currentLevelData = playerLevels.find(l => l.level === currentLevel)!
  const progress = (currentPoints - currentLevelData.requiredPoints) / 
                  (nextLevel.requiredPoints - currentLevelData.requiredPoints)
  
  return Math.min(100, Math.max(0, progress * 100))
}

export const checkAchievements = (playerStats: {
  challengesCompleted: number
  hintsUsed: number
  timeBonuses: number
  teamCollaborations: number
  locationsVisited: number
  perfectScores: number
}): Achievement[] => {
  const unlockedAchievements: Achievement[] = []
  
  achievements.forEach(achievement => {
    if (achievement.unlockedAt) return // Already unlocked
    
    let isUnlocked = false
    const { type, threshold, condition = 'greater_than' } = achievement.criteria
    
    switch (type) {
      case 'challenges_completed':
        isUnlocked = checkCondition(playerStats.challengesCompleted, threshold, condition)
        break
      case 'hints_used':
        isUnlocked = checkCondition(playerStats.hintsUsed, threshold, condition)
        break
      case 'time_bonus':
        isUnlocked = checkCondition(playerStats.timeBonuses, threshold, condition)
        break
      case 'team_collaboration':
        isUnlocked = checkCondition(playerStats.teamCollaborations, threshold, condition)
        break
      case 'locations_visited':
        isUnlocked = checkCondition(playerStats.locationsVisited, threshold, condition)
        break
      case 'perfect_score':
        isUnlocked = checkCondition(playerStats.perfectScores, threshold, condition)
        break
    }
    
    if (isUnlocked) {
      unlockedAchievements.push({
        ...achievement,
        unlockedAt: new Date()
      })
    }
  })
  
  return unlockedAchievements
}

const checkCondition = (value: number, threshold: number, condition: string): boolean => {
  switch (condition) {
    case 'less_than':
      return value < threshold
    case 'greater_than':
      return value > threshold
    case 'equal_to':
      return value === threshold
    default:
      return false
  }
}

export const getAchievementsByCategory = (category: string): Achievement[] => {
  return achievements.filter(achievement => achievement.category === category)
}

export const getAchievementsByRarity = (rarity: string): Achievement[] => {
  return achievements.filter(achievement => achievement.rarity === rarity)
}

export const getTotalAchievementPoints = (unlockedAchievements: Achievement[]): number => {
  return unlockedAchievements.reduce((total, achievement) => total + achievement.points, 0)
}
