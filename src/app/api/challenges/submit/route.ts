import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const submitSchema = z.object({
  challengeId: z.string(),
  sessionCode: z.string(),
  participantId: z.string().optional(),
  answer: z.string().optional(),
  selectedOption: z.string().optional(),
  teamAnswer: z.string().optional(),
  photoData: z.any().optional(),
  audioData: z.any().optional(),
  timeRemaining: z.number(),
  hintUsed: z.boolean(),
  retryCount: z.number()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = submitSchema.parse(body)
    
    // Enhanced challenge validation logic
    const isCorrect = mockValidateAnswer(data.challengeId, data.answer || data.selectedOption || data.teamAnswer)
    
    if (!isCorrect) {
      return NextResponse.json({
        correct: false,
        points_earned: 0,
        bonus_points: 0,
        time_bonus: 0,
        new_achievements: [],
        scene_completed: false,
        message: 'Incorrect answer. Try again!'
      })
    }
    
    // Enhanced scoring system
    const basePoints = 100
    const timeBonus = calculateTimeBonus(data.timeRemaining || 0)
    const hintPenalty = data.hintUsed ? 15 : 0
    const retryPenalty = data.retryCount * 5
    const perfectBonus = data.retryCount === 0 && !data.hintUsed ? 25 : 0
    const speedBonus = data.timeRemaining > 60 ? 20 : 0
    
    const pointsEarned = Math.max(10, basePoints - hintPenalty - retryPenalty + perfectBonus + speedBonus)
    const totalBonus = timeBonus + perfectBonus + speedBonus
    
    // Check for achievements
    const newAchievements = checkNewAchievements(data)
    
    const result = {
      correct: true,
      points_earned: pointsEarned,
      bonus_points: totalBonus,
      time_bonus: timeBonus,
      perfect_bonus: perfectBonus,
      speed_bonus: speedBonus,
      hint_penalty: hintPenalty,
      retry_penalty: retryPenalty,
      new_achievements: newAchievements,
      scene_completed: true,
      message: getSuccessMessage(pointsEarned, newAchievements.length)
    }
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
}

function calculateTimeBonus(timeRemaining: number): number {
  if (timeRemaining <= 0) return 0
  if (timeRemaining >= 120) return 30 // 2+ minutes remaining
  if (timeRemaining >= 60) return 20  // 1+ minutes remaining
  if (timeRemaining >= 30) return 10  // 30+ seconds remaining
  return 5 // Less than 30 seconds
}

function checkNewAchievements(data: any): any[] {
  const achievements = []
  
  // Speed achievements
  if (data.timeRemaining > 90) {
    achievements.push({
      id: 'lightning-fast',
      name: 'Lightning Fast',
      description: 'Completed challenge with plenty of time to spare',
      icon: '⚡',
      points: 25
    })
  }
  
  // Accuracy achievements
  if (data.retryCount === 0 && !data.hintUsed) {
    achievements.push({
      id: 'first-try-master',
      name: 'First Try Master',
      description: 'Completed challenge perfectly on first attempt',
      icon: '🎯',
      points: 30
    })
  }
  
  // Team achievements
  if (data.teamAnswer) {
    achievements.push({
      id: 'team-player',
      name: 'Team Player',
      description: 'Successfully completed a team challenge',
      icon: '🤝',
      points: 20
    })
  }
  
  return achievements
}

function getSuccessMessage(pointsEarned: number, achievementCount: number): string {
  if (achievementCount > 0) {
    return `🎉 Excellent work! You earned ${pointsEarned} points and unlocked ${achievementCount} achievement${achievementCount > 1 ? 's' : ''}!`
  }
  
  if (pointsEarned >= 120) {
    return `🌟 Outstanding! You earned ${pointsEarned} points with perfect execution!`
  }
  
  if (pointsEarned >= 100) {
    return `🎯 Great job! You earned ${pointsEarned} points!`
  }
  
  return `✅ Well done! You earned ${pointsEarned} points!`
}

function mockValidateAnswer(challengeId: string, answer?: string): boolean {
  // Mock validation - always return true for demo
  if (!answer) return false
  
  const mockAnswers: Record<string, string[]> = {
    'riddle_1': ['key', 'skeleton key', 'master key'],
    'puzzle_1': ['seven', '7', 'VII'],
    'photo_1': ['accepted'], // Photo challenges auto-accept
    'team_1': ['collaboration', 'teamwork', 'together']
  }
  
  const validAnswers = mockAnswers[challengeId] || ['demo', 'test', 'correct']
  return validAnswers.some(valid => 
    answer.toLowerCase().includes(valid.toLowerCase())
  )
}