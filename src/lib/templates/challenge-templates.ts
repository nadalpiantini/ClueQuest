import { Challenge } from '@/components/builder/ChallengeDesigner'

export interface ChallengeTemplate {
  id: string
  name: string
  description: string
  category: 'corporate' | 'educational' | 'social' | 'mystery' | 'fantasy'
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  estimatedTime: number // minutes
  challenge: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>
}

export const challengeTemplates: ChallengeTemplate[] = [
  // CORPORATE TEMPLATES
  {
    id: 'corporate-team-photo',
    name: 'Team Photo Challenge',
    description: 'Take a creative team photo that represents your company values',
    category: 'corporate',
    difficulty: 'easy',
    estimatedTime: 5,
    challenge: {
      name: 'Team Photo Challenge',
      description: 'Capture a creative team photo that represents your company values and culture',
      type: 'photo',
      difficulty: 'easy',
      points: 15,
      hints: [
        'Think about your company\'s mission statement',
        'Include company colors or logo if possible',
        'Make it fun and engaging for social media'
      ],
      instructions: 'Take a creative team photo that showcases your company values. The photo should be professional yet fun, and suitable for sharing on company social media.',
      successMessage: '🎉 Great team photo! You\'ve successfully captured your company culture.',
      failureMessage: '📸 Try again! Make sure the photo clearly represents your team and company values.',
      typeData: {
        photoPrompt: 'Creative team photo representing company values',
        photoRequirements: [
          'All team members visible',
          'Company branding elements',
          'Professional yet fun atmosphere'
        ]
      },
      tags: ['corporate', 'team-building', 'photo', 'values'],
      isActive: true
    }
  },
  {
    id: 'corporate-brainstorm',
    name: 'Innovation Brainstorm',
    description: 'Collaborate to solve a real business challenge',
    category: 'corporate',
    difficulty: 'medium',
    estimatedTime: 10,
    challenge: {
      name: 'Innovation Brainstorm',
      description: 'Work together to brainstorm solutions for a real business challenge',
      type: 'team',
      difficulty: 'medium',
      points: 25,
      hints: [
        'Focus on practical, implementable solutions',
        'Consider budget and timeline constraints',
        'Think about customer impact'
      ],
      instructions: 'Your team must brainstorm and present 3 innovative solutions to improve customer satisfaction. Each solution should include a brief implementation plan.',
      successMessage: '💡 Excellent brainstorming session! Your innovative solutions show great potential.',
      failureMessage: '🤔 Keep thinking! Make sure your solutions are practical and customer-focused.',
      typeData: {
        minPlayers: 3,
        maxPlayers: 6,
        teamRole: 'Innovation Team',
        taskSteps: [
          'Identify the core customer satisfaction issue',
          'Brainstorm 5+ potential solutions',
          'Evaluate feasibility and impact',
          'Select top 3 solutions',
          'Create brief implementation plans'
        ],
        completionCriteria: 'Present 3 well-thought-out solutions with implementation plans'
      },
      tags: ['corporate', 'innovation', 'team-work', 'problem-solving'],
      isActive: true
    }
  },

  // EDUCATIONAL TEMPLATES
  {
    id: 'educational-quiz',
    name: 'Knowledge Quiz',
    description: 'Test knowledge with interactive quiz questions',
    category: 'educational',
    difficulty: 'medium',
    estimatedTime: 8,
    challenge: {
      name: 'Knowledge Quiz Challenge',
      description: 'Answer a series of questions to test your knowledge on the topic',
      type: 'question',
      difficulty: 'medium',
      points: 20,
      hints: [
        'Read each question carefully',
        'Think about the context and learning objectives',
        'Don\'t rush - accuracy is important'
      ],
      instructions: 'You will be presented with 5 multiple-choice questions. Select the best answer for each question. You have 8 minutes to complete the quiz.',
      successMessage: '🎓 Well done! You\'ve demonstrated excellent knowledge on this topic.',
      failureMessage: '📚 Review the material and try again. Learning is a process!',
      typeData: {
        question: 'What is the primary benefit of collaborative learning?',
        correctAnswer: 'Enhanced critical thinking and problem-solving skills',
        wrongAnswers: [
          'Faster individual completion times',
          'Reduced need for instructor guidance',
          'Simplified assessment methods'
        ],
        answerType: 'multiple_choice'
      },
      tags: ['educational', 'quiz', 'knowledge', 'assessment'],
      isActive: true
    }
  },
  {
    id: 'educational-puzzle',
    name: 'Logic Puzzle',
    description: 'Solve a logical reasoning puzzle',
    category: 'educational',
    difficulty: 'hard',
    estimatedTime: 12,
    challenge: {
      name: 'Logic Puzzle Challenge',
      description: 'Use logical reasoning to solve a complex puzzle',
      type: 'puzzle',
      difficulty: 'hard',
      points: 35,
      hints: [
        'Break the problem into smaller parts',
        'Look for patterns and relationships',
        'Use process of elimination when possible'
      ],
      instructions: 'Solve this logic puzzle: Three friends (Alice, Bob, and Carol) have different favorite subjects. Alice doesn\'t like math, Bob\'s favorite subject starts with the same letter as his name, and Carol\'s favorite subject is science. What is each person\'s favorite subject?',
      successMessage: '🧩 Excellent logical reasoning! You\'ve solved the puzzle correctly.',
      failureMessage: '🤔 Think step by step. Consider all the given clues carefully.',
      typeData: {
        puzzleType: 'logic',
        puzzleData: {
          type: 'deduction',
          clues: [
            'Alice doesn\'t like math',
            'Bob\'s favorite subject starts with B',
            'Carol\'s favorite subject is science'
          ],
          answer: 'Alice: English, Bob: Biology, Carol: Science'
        }
      },
      tags: ['educational', 'logic', 'reasoning', 'puzzle'],
      isActive: true
    }
  },

  // SOCIAL TEMPLATES
  {
    id: 'social-selfie',
    name: 'Fun Selfie Challenge',
    description: 'Take a creative selfie with a fun theme',
    category: 'social',
    difficulty: 'easy',
    estimatedTime: 3,
    challenge: {
      name: 'Fun Selfie Challenge',
      description: 'Take a creative selfie that matches the given theme',
      type: 'photo',
      difficulty: 'easy',
      points: 10,
      hints: [
        'Be creative and have fun with it',
        'Make sure your face is clearly visible',
        'Follow the theme but add your own twist'
      ],
      instructions: 'Take a creative selfie that represents "Adventure Awaits". Be imaginative and show your adventurous spirit!',
      successMessage: '📸 Awesome selfie! You\'ve captured the adventurous spirit perfectly.',
      failureMessage: '😊 Try again! Make it more creative and adventurous.',
      typeData: {
        photoPrompt: 'Creative selfie representing "Adventure Awaits"',
        photoRequirements: [
          'Clear view of your face',
          'Adventure theme elements',
          'Creative and fun approach'
        ]
      },
      tags: ['social', 'selfie', 'fun', 'creative'],
      isActive: true
    }
  },
  {
    id: 'social-trivia',
    name: 'Pop Culture Trivia',
    description: 'Test knowledge of popular culture and entertainment',
    category: 'social',
    difficulty: 'medium',
    estimatedTime: 6,
    challenge: {
      name: 'Pop Culture Trivia',
      description: 'Answer questions about movies, music, and popular culture',
      type: 'question',
      difficulty: 'medium',
      points: 18,
      hints: [
        'Think about recent popular movies and shows',
        'Consider music from the last decade',
        'Don\'t overthink - go with your first instinct'
      ],
      instructions: 'Answer 5 pop culture trivia questions. Topics include movies, music, TV shows, and internet culture.',
      successMessage: '🎬 Great job! You\'re clearly up-to-date with pop culture.',
      failureMessage: '📺 No worries! Pop culture is always changing.',
      typeData: {
        question: 'Which streaming service produced the series "Stranger Things"?',
        correctAnswer: 'Netflix',
        wrongAnswers: ['Disney+', 'HBO Max', 'Amazon Prime'],
        answerType: 'multiple_choice'
      },
      tags: ['social', 'trivia', 'pop-culture', 'entertainment'],
      isActive: true
    }
  },

  // MYSTERY TEMPLATES
  {
    id: 'mystery-riddle',
    name: 'Mystery Riddle',
    description: 'Solve a classic mystery riddle',
    category: 'mystery',
    difficulty: 'hard',
    estimatedTime: 10,
    challenge: {
      name: 'Mystery Riddle',
      description: 'Use your detective skills to solve a classic riddle',
      type: 'riddle',
      difficulty: 'hard',
      points: 30,
      hints: [
        'Think outside the box',
        'Consider wordplay and double meanings',
        'Look for hidden clues in the wording'
      ],
      instructions: 'Solve this riddle: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?"',
      successMessage: '🔍 Brilliant detective work! You\'ve solved the riddle.',
      failureMessage: '🕵️ Keep thinking! The answer is simpler than it seems.',
      typeData: {
        puzzleType: 'riddle',
        puzzleData: {
          riddle: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
          answer: 'Echo',
          explanation: 'An echo speaks (repeats sounds) without a mouth, hears without ears, has no physical body, and is created by wind/sound waves.'
        }
      },
      tags: ['mystery', 'riddle', 'detective', 'wordplay'],
      isActive: true
    }
  },
  {
    id: 'mystery-cipher',
    name: 'Secret Cipher',
    description: 'Decode a secret message using a cipher',
    category: 'mystery',
    difficulty: 'expert',
    estimatedTime: 15,
    challenge: {
      name: 'Secret Cipher Challenge',
      description: 'Decode a secret message using the provided cipher',
      type: 'puzzle',
      difficulty: 'expert',
      points: 50,
      hints: [
        'Look for patterns in the cipher',
        'Common letters appear more frequently',
        'Start with short words to establish the pattern'
      ],
      instructions: 'Decode this Caesar cipher (shift of 3): "WKH VHFUHW PHVVDJH LV KHUH"',
      successMessage: '🔐 Excellent work, codebreaker! You\'ve cracked the cipher.',
      failureMessage: '🔍 Keep trying! Remember it\'s a Caesar cipher with a shift of 3.',
      typeData: {
        puzzleType: 'logic',
        puzzleData: {
          type: 'caesar',
          shift: 3,
          encoded: 'WKH VHFUHW PHVVDJH LV KHUH',
          answer: 'THE SECRET MESSAGE IS HERE'
        }
      },
      tags: ['mystery', 'cipher', 'code-breaking', 'expert'],
      isActive: true
    }
  },

  // FANTASY TEMPLATES
  {
    id: 'fantasy-quest',
    name: 'Fantasy Quest',
    description: 'Complete a magical quest with role-playing elements',
    category: 'fantasy',
    difficulty: 'medium',
    estimatedTime: 12,
    challenge: {
      name: 'Fantasy Quest Challenge',
      description: 'Embark on a magical quest and make choices that affect the outcome',
      type: 'task',
      difficulty: 'medium',
      points: 28,
      hints: [
        'Think like your character would',
        'Consider the consequences of your choices',
        'Use your magical abilities wisely'
      ],
      instructions: 'You are a brave adventurer seeking the Crystal of Power. You encounter a magical bridge guarded by a riddle-speaking dragon. The dragon says: "To cross this bridge, you must answer: What grows stronger the more it is shared?"',
      successMessage: '⚔️ Well done, brave adventurer! You\'ve proven your wisdom and can continue your quest.',
      failureMessage: '🐉 The dragon blocks your path. Think about what grows stronger when shared...',
      typeData: {
        taskSteps: [
          'Approach the magical bridge',
          'Listen to the dragon\'s riddle',
          'Think about what grows stronger when shared',
          'Provide your answer',
          'Cross the bridge if correct'
        ],
        completionCriteria: 'Answer the riddle correctly to cross the bridge'
      },
      tags: ['fantasy', 'quest', 'role-play', 'magic'],
      isActive: true
    }
  },
  {
    id: 'fantasy-spell',
    name: 'Magic Spell Challenge',
    description: 'Cast a spell by solving a word puzzle',
    category: 'fantasy',
    difficulty: 'hard',
    estimatedTime: 8,
    challenge: {
      name: 'Magic Spell Challenge',
      description: 'Cast a powerful spell by unscrambling magical words',
      type: 'puzzle',
      difficulty: 'hard',
      points: 32,
      hints: [
        'Think about magical terminology',
        'Look for common word patterns',
        'Consider fantasy literature and mythology'
      ],
      instructions: 'To cast the "Light of Wisdom" spell, unscramble these magical words: "HTGIL", "FODOMWIS", "PELSL"',
      successMessage: '✨ Magnificent! The Light of Wisdom spell has been successfully cast!',
      failureMessage: '🔮 The spell fizzles out. Try unscrambling the words again.',
      typeData: {
        puzzleType: 'word',
        puzzleData: {
          type: 'anagram',
          scrambled: ['HTGIL', 'FODOMWIS', 'PELSL'],
          answers: ['LIGHT', 'WISDOM', 'SPELL']
        }
      },
      tags: ['fantasy', 'magic', 'spell', 'word-puzzle'],
      isActive: true
    }
  }
]

// Helper function to get templates by category
export const getTemplatesByCategory = (category: string) => {
  return challengeTemplates.filter(template => template.category === category)
}

// Helper function to get templates by difficulty
export const getTemplatesByDifficulty = (difficulty: string) => {
  return challengeTemplates.filter(template => template.difficulty === difficulty)
}

// Helper function to get random template
export const getRandomTemplate = () => {
  return challengeTemplates[Math.floor(Math.random() * challengeTemplates.length)]
}

// Helper function to create challenge from template
export const createChallengeFromTemplate = (template: ChallengeTemplate): Challenge => {
  return {
    ...template.challenge,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
}
