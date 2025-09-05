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
    
    // Mock challenge validation logic
    const isCorrect = mockValidateAnswer(data.challengeId, data.answer || data.selectedOption || data.teamAnswer)
    
    const basePoints = 100
    const timeBonus = Math.floor((data.timeRemaining || 0) / 10) * 5
    const hintPenalty = data.hintUsed ? 20 : 0
    const retryPenalty = data.retryCount * 10
    
    const pointsEarned = isCorrect ? Math.max(20, basePoints - hintPenalty - retryPenalty) : 0
    
    const result = {
      correct: isCorrect,
      points_earned: pointsEarned,
      bonus_points: 0,
      time_bonus: isCorrect ? timeBonus : 0,
      new_achievements: isCorrect && timeBonus > 50 ? [{ name: 'Speed Master', description: 'Completed challenge quickly' }] : [],
      scene_completed: true
    }
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
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